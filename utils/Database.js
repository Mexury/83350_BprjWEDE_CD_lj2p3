/*   
|*   NodeJS MySQL helper class by Albert Lourensen (83350)
|*   
|*   Dependencies:
|*   - mysql
|*   - dotenv
*/   

const mysql = require("mysql")
const dotenv = require("dotenv")
dotenv.config()

let conn

const connect = async () => {
    conn = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
        database: process.env.DATABASE_NAME,
    })

    conn.connect(err => {
        if (err) {
            console.log()
            console.error('Unable to connect to MySQL database.')
            console.log()
            return
        } else {
            console.log()
            console.log('Connection to MySQL database established successfully.')
            console.log()
        }
    })
}

const query = async (sql) => {
    return new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if (err) return reject(err)
            return resolve(result)
        })
    })
}

const $ = {
    SHOWS: {
        GET_ALL: async () => {
            let result = await query(`SELECT * FROM shows`)
            return result.length > 0 ? result : false
        }
    },
    LEADERBOARD: {
        GET_ALL: async () => {
            let result = await query(`SELECT * FROM leaderboard ORDER BY time_left ASC`)
            return result.length > 0 ? result : false
        },
        GET_TOP_THREE: async () => {
            let result = await query(`SELECT * FROM leaderboard ORDER BY time_left DESC LIMIT 3`)
            return result.length > 0 ? result : false
        }
    }
    // USER: {
    //     GET_ONE: async (email) => {
    //         let result = await query(`SELECT * FROM users WHERE email = '${email}' limit 1`)
    //         return result.length > 0 ? result[0] : false
    //     },
    //     GET_MULTIPLE: async (email) => {
    //         let result = await query(`SELECT * FROM users WHERE email = '${email}'`)
    //         return result.length > 0 ? result : false
    //     },
    //     CREATE: async (options) => {
    //         let result = await query(`INSERT INTO users (name, email, password) VALUES ('${options.name}', '${options.email}', '${options.password}')`)
    //     }
    // }
}

module.exports = {
    conn,
    connect,
    query,
    $
}