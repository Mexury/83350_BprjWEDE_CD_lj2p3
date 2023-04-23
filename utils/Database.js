/*
|*   NodeJS MySQL helper class by Albert Lourensen (83350)
|*
|*   Dependencies:
|*   - mysql
|*   - dotenv
|*   - fs
*/

const mysql = require("mysql")
const dotenv = require("dotenv")
const fs = require('fs/promises');
const path = require('path')

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

function checkString(str, obj) {
    const regex = /%([^%]+)%/g; // matches any string enclosed in % symbols
    let matches = str.match(regex); // find all matches
    if (matches === null) {
        return str; // no matches found
    }
    for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const key = match.substring(1, match.length - 1); // extract the key from the matched string
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (Array.isArray(value) || typeof value === "object") {
                throw new Error(`Value for key '${key}' is not a scalar`);
            }
            str = str.replaceAll(match, value);
        }
    }
    return str;
}

const sql = async (file, obj) => {
    try {
        const matchingFile = await fs.readFile(`./sql/${file}.sql`)
        let result = matchingFile ? matchingFile.toString().replaceAll('\t', '').replaceAll('\r', ' ').split('\n').join('') : false

        if (!result) return false

        let checkedResult = true
        let data = ""

        if (obj) {
            try {
                let queryStr = checkString(result, obj)
                console.log(queryStr);
                data = await query(queryStr)
            } catch (err2) {
                checkedResult = false
            }
        } else {
            data = await query(result)
        }

        return {
            success: data.length > 0 ? true : false,
            data: data.length > 0 ? data : []
        }

    } catch (err) {
        console.error({
            message: "An error occured while trying to execute SQL",
            error: err
        })
        return false
    }
}

module.exports = {
    conn,
    connect,
    query,
    sql,
    $
}