import express from 'express';
import minimist from 'minimist';
import database from "better-sqlite3";
import path from 'path';
import {fileURLToPath} from 'url';
//import { roshambo } from './lib/roshambo.js';


// Create database
const db = new database('points.db');
db.pragma('journal_mode = WAL');

//Tables to track users/passwords, wins across games, and access log
const sql_users = `CREATE TABLE users (id INTEGER PRIMARY KEY, username VARCHAR, password VARCHAR);`
db.exec(sql_users);

const sql_wins = `CREATE TABLE wins (id INTEGER PRIMARY KEY, user VARCHAR, game1 INTEGER, game2 INTEGER, game3 INTEGER, game4 INTEGER);`
db.exec(sql_wins);

const sql_logs = `CREATE TABLE accesslog (id INTEGER PRIMARY KEY, remote_addr VARCHAR, remote_user VARCHAR, date VARCHAR, method VARCHAR, url VARCHAR, http_version VARCHAR, status INTEGER, content_length VARCHAR, referer_url VARCHAR, user_agent VARCHAR);`
db.exec(sql_logs);

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
    res.render('homePage');
});

app.post('/homePage', function(req, res) {
	const username = req.body.username;
	const password = req.body.password;

	const new_username = req.body.new_username;
	const new_password = req.body.new_password;
	
	if (new_username == null && new_password == null) {
		const stmt1 = db.prepare(`SELECT * FROM users WHERE username= ? and password= ?;`);
		const exists = stmt1.run(username, password).get();
		if (exists != undefined) {
			res.redirect('/gameMenu');
		} else {
			res.redirect('/invalidLogin');
		}
	} else {
		const stmt2 = db.prepare('INSERT INTO users (username, password) (?, ?)');
		stmt2.run(new_username, new_password);
		res.redirect('/newAccount');
	}
});

app.get('/gameMenu', function(req, res) {
	res.render('gameMenu');
});

app.get('/invalidLogin', function(req, res) {
	res.render('invalidLogin')
});

app.get('/newAccount', function(req, res) {
	res.render('newAccount')
});

  
// app.get('/app', function (req, res) {
//     res.redirect('/homePage');
// })

app.listen(port)

