import express from 'express';
import minimist from 'minimist';
import Database from "better-sqlite3";
import path from 'path';
import {fileURLToPath} from 'url';


// Create database
const db = new database('task.db');
db.pragma('journal_mode = WAL');

// Connect app to front end pages in frontEndPages directory
app.use(express.static("styling"));
app.set('view engine', 'ejs');
app.set('frontEndPages', path.join(__dirname, 'frontEndPages'));

// Create all the needed constants
const app = express();
const args = minimist(process.argv.slice(2));
const port = args.port || 2000

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create all endpoints for app, depending on what app becomes
// ex. 
// app.get('/homepage', function (req, res) {
// res.redirect('/homepage');
// })

// Have to do ones with database, as well as all the other pages we want to go based
// off of what is clicked. 

// app.post('/homepage', function(req, res) {
//    do something
//    update database
//    res.redirect('/homepage');
// });


app.listen(port)

