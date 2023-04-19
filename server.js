const bodyParser = require("body-parser")
const express = require("express")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const crypto = require("crypto")

const dotenv = require("dotenv")
const db = require("./utils/Database.js")

const app = express()

dotenv.config()
db.connect()

app.set("view engine", "ejs")
app.set("trust proxy", 1)
app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true
}))

app.use(bodyParser.json())
app.use(bodyParser.raw())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())

const shuffleArray = array => {

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const getPairs = (array) => {
    shuffleArray(array.keys)

    array.keys = array.keys.splice(0, 5)
    let tempValues = []
    array.keys.forEach(key => {
        let result = array.values.find(value => value.slug == key.target)
        if (result) tempValues.push(result)
    })
    shuffleArray(tempValues)

    return {
        keys: array.keys,
        values: tempValues
    }
}
let validators = []

app.get(["/"], async (req, res) => {

    res.render("home")
})

app.get(["/leaderboard"], async (req, res) => {
    const { session } = req

    const leaderboard = await db.$.LEADERBOARD.GET_TOP_THREE()

    res.render("leaderboard", {
        leaderboard,
        email: session.email || ""
    })
})

app.get(["/login"], async (req, res) => {
    const { session } = req
    
    if (session.token) {
        res.redirect('/game')
    } else {
        session.validator = crypto.randomUUID()
        validators.push(session.validator)
        res.render("login")
    }
})

app.post(["/login"], async (req, res) => {
    const { session, body } = req

    if (!session.token) {
        if (session.validator) {
            if (validators.includes(session.validator)) {
                // can log in
                if (body.email.trim().length > 0) {
                    validators.splice(validators.indexOf(session.validator), 1)
    
                    session.token = session.validator
                    session.email = body.email
                    delete session.validator
    
                    res.json({
                        success: true,
                        data: {
                            message: "Logged in successfully."
                        }
                    })
                } else {
                    res.json({
                        success: false,
                        errors: [
                            "Invalid email."
                        ]
                    })
                }
            } else {
                res.json({
                    success: false,
                    errors: [
                        "Not authorized."
                    ]
                })
            }
        } else {
            res.json({
                success: false,
                errors: [
                    "Not authorized."
                ]
            })
        }
    } else {
        res.json({
            success: false,
            errors: [
                "You're already logged in"
            ]
        })
    }
})

app.get(["/game"], async (req, res) => {
    const { session } = req

    if (!session.token) {
        // Not logged in!
        res.redirect('/login')
        return
    }

    if (!session.pairs) {
        const shows = await db.$.SHOWS.GET_ALL()
        let pairs = {
            keys: [],
            values: []
        }

        shows.forEach(show => {
            pairs.keys.push({
                target: show.slug,
                value: show.description
            })
            pairs.values.push({
                slug: show.slug,
                name: show.name
            })
        })

        session.pairs = getPairs(pairs)
    }

    res.render("game", {
        pairs: session.pairs
    })
})

app.listen(3000, () => console.log("Server running at http://localhost:3000"))