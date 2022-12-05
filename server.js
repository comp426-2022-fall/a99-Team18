import express from 'express';
import minimist from 'minimist';
import database from "better-sqlite3";
import path from 'path';
import {fileURLToPath} from 'url';
//import { roshambo } from './lib/roshambo.js';


// Create database
const db = new database('task.db');
db.pragma('journal_mode = WAL');


// Create all the needed constants
const args = minimist(process.argv.slice(2));
const port = args.port || 4321

// Connect app to front end pages in frontEndPages directory
const app = express();
app.use(express.static("styling"));
app.set('view engine', 'ejs');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.set('frontEndPages', path.join(__dirname, 'frontEndPages'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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

app.get('/', function(req, res) {
    res.redirect('/homePage');
});

app.get('/homePage', function(req, res) {
    res.render('gameMenu');
});

// app.post('/homePage', function(req, res) {
// 	const username = req.username;
// 	const password = req.password;

// 	const new_username = req.new_username;
// 	const new_password = req.new_username;
	
// 	if (new_username == null && new_password == null) {
// 		if ( ) {
// 			res.redirect('/gamepage');
// 		} else {
// 			res.redirect('/invalid');
// 		}
// 	} else {
// 		res.redirect('/accountcreate');
// 	}
// }

  
// app.get('/app', function (req, res) {
//     res.redirect('/homePage');
// })

app.listen(port)

