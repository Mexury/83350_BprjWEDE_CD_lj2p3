const bodyParser = require("body-parser")
const express = require("express")
const session = require("express-session")
const cookieParser = require("cookie-parser")

const app = express()

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

const pairs = {
    keys: [
        {
            target: "friends",
            value: "A group of friends in New York City navigate through their careers, relationships, and daily lives."
        },
        {
            target: "the_office_us",
            value: "A mockumentary-style sitcom that follows the employees of a Dunder Mifflin paper company branch in Scranton, Pennsylvania."
        },
        {
            target: "lost",
            value: "After their plane crashes on a mysterious island, a group of strangers must band together to survive and uncover the island's secrets."
        },
        {
            target: "breaking_bad",
            value: "A high school chemistry teacher turns to making and selling methamphetamine to support his family after he is diagnosed with cancer."
        },
        {
            target: "the_sopranos",
            value: "A New Jersey mob boss tries to balance his criminal enterprise with his family life and struggles with mental health issues."
        },
        {
            target: "the_wire",
            value: "A gritty crime drama that explores the interconnectedness of drug dealers, law enforcement, and politicians in Baltimore."
        },
        {
            target: "dexter",
            value: "A forensic blood spatter analyst for the Miami Metro Police Department also moonlights as a vigilante serial killer who only targets other murderers."
        },
        {
            target: "greys_anatomy",
            value: "The personal and professional lives of a group of doctors at Seattle Grace Hospital."
        },
        {
            target: "csi_crime_scene_investigation",
            value: "A team of forensic investigators solve crimes in Las Vegas using scientific techniques and technology."
        },
        {
            target: "desperate_housewives",
            value: "The seemingly perfect lives of suburban housewives in the fictional town of Fairview are not as they appear."
        },
        {
            target: "how_i_met_your_mother",
            value: "A man tells his children the story of how he met their mother, with plenty of romantic mishaps along the way."
        },
        {
            target: "gossip_girl",
            value: "An anonymous blogger creates drama among wealthy teenagers on the Upper East Side of New York City."
        },
        {
            target: "prison_break",
            value: "A man engineers a complicated plan to break his brother out of prison after he is wrongfully convicted of murder."
        },
        {
            target: "24",
            value: "A real-time action drama that follows counterterrorism agent Jack Bauer as he tries to prevent terrorist attacks and save the United States."
        },
        {
            target: "house",
            value: "A brilliant but irascible doctor solves medical mysteries and clashes with his colleagues and patients."
        },
        {
            target: "sex_and_the_city",
            value: "Four female friends in New York City explore dating, relationships, and their own identities."
        },
        {
            target: "heroes",
            value: "A group of ordinary people discover they have extraordinary abilities and must save the world from destruction."
        },
        {
            target: "entourage",
            value: "A young actor navigates the highs and lows of Hollywood with the help of his close friends and his agent."
        },
        {
            target: "the_oc",
            value: "A troubled teen from the wrong side of the tracks is taken in by a wealthy family in Orange County, California."
        },
        {
            target: "scrubs",
            value: "A medical comedy that follows the personal and professional lives of doctors and nurses at Sacred Heart Hospital."
        }
    ],
    values: [
        {
            slug: "friends",
            name: "Friends"
        },
        {
            slug: "the_office_us",
            name: "The Office (US)"
        },
        {
            slug: "lost",
            name: "Lost"
        },
        {
            slug: "breaking_bad",
            name: "Breaking Bad"
        },
        {
            slug: "the_sopranos",
            name: "The Sopranos"
        },
        {
            slug: "the_wire",
            name: "The Wire"
        },
        {
            slug: "dexter",
            name: "Dexter"
        },
        {
            slug: "greys_anatomy",
            name: "Grey's Anatomy"
        },
        {
            slug: "csi_crime_scene_investigation",
            name: "CSI: Crime Scene Investigation"
        },
        {
            slug: "desperate_housewives",
            name: "Desperate Housewives"
        },
        {
            slug: "how_i_met_your_mother",
            name: "How I Met Your Mother"
        },
        {
            slug: "gossip_girl",
            name: "Gossip Girl"
        },
        {
            slug: "prison_break",
            name: "Prison Break"
        },
        {
            slug: "24",
            name: "24"
        },
        {
            slug: "house",
            name: "House"
        },
        {
            slug: "sex_and_the_city",
            name: "Sex and the City"
        },
        {
            slug: "heroes",
            name: "Heroes"
        },
        {
            slug: "entourage",
            name: "Entourage"
        },
        {
            slug: "the_oc",
            name: "The OC"
        },
        {
            slug: "scrubs",
            name: "Scrubs"
        },
    ]
}

const shuffleArray = array => {

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const getPairs = () => {
    shuffleArray(pairs.keys)

    pairs.keys = pairs.keys.splice(0, 5)
    let tempValues = []
    pairs.keys.forEach(key => {
        let result = pairs.values.find(value => value.slug == key.target)
        if (result) tempValues.push(result)
    })
    shuffleArray(tempValues)

    console.log(tempValues);

    return {
        keys: pairs.keys,
        values: tempValues
    }
}

app.get(["/"], async (req, res) => {

    res.render("home")
})

app.get(["/game"], async (req, res) => {

    res.render("game", {
        pairs: getPairs()
    })
})

app.listen(3000, () => console.log("Server running at http://localhost:3000"))