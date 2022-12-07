import express from 'express';
import minimist from 'minimist';
import database from "better-sqlite3";
import path from 'path';
import {fileURLToPath} from 'url';
//import { roshambo } from './lib/roshambo.js';
import { magic8ball } from './lib/magic8ball.js';
import { mora } from './lib/mora.js';
import morgan from 'morgan';
import fs from 'fs';


// // Create database
const db = new database('points.db');
db.pragma('journal_mode = WAL');

// //Tables to track users/passwords, wins across games, and access log
const stmt_bases = db.prepare(`SELECT name FROM sqlite_master WHERE type='table';`)
let row = stmt_bases.get();
// If access log table doesn't exist, create it.
if (row === undefined) { 
	const sql_users = `CREATE TABLE users (id INTEGER PRIMARY KEY, username VARCHAR, password VARCHAR);`
	db.exec(sql_users);
	
	const sql_wins = `CREATE TABLE wins (id INTEGER PRIMARY KEY, username VARCHAR, game1 INTEGER, game2 INTEGER, game3 INTEGER, game4 INTEGER);`
	db.exec(sql_wins);
	
	const sql_logs = `CREATE TABLE accesslog (id INTEGER PRIMARY KEY, remote_addr VARCHAR, remote_user VARCHAR, date VARCHAR, method VARCHAR, url VARCHAR, protocol VARCHAR, http_version VARCHAR, status INTEGER);` 
	db.exec(sql_logs);
}

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
app.set('view engine', 'ejs');

//Create access log and put in database using morgan TODO: need to fix
const accesslog = fs.createWriteStream( './access.log', { flags: 'a'});

app.use(morgan('combined', { stream: accesslog }));

app.use((req, res, next) => {
	let logdata = {
		remote_addr: req.ip,
        remote_user: req.user,
        date: Date.now(),
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        http_version: req.httpVersion,
        status: res.statusCode
	}
	const stmt_log = db.prepare(`INSERT INTO accesslog (remote_addr, remote_user, date, method, url, protocol, http_version, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
	const info = stmt_log.run(logdata.remote_addr, logdata.remote_user, logdata.date, logdata.method, logdata.url, logdata.protocol, logdata.http_version, logdata.status);
	next();
});


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
    res.render('homePage');
});

app.post('/gameMenu', function(req, res) {
	res.render('gameMenu');
});


app.post('/roshambo', function(req, res) {
    res.render('roshambo');
});

app.post('/morra', function(req, res) {
    //var _mRes = mora(req.body.userguess, req.body.userfingers);
    //it will probably be undef at first
    res.render('morra')
    //renders, then use a submit for to get a URL encoded input
    //parse the input into mora.js
});

// app.get('/morra/:guess/:fingers', function(req, res) {
//     var _mRes = mora(req.params.guess, req.params.fingers);
//     res.render('morra', {})
// });

app.post('/tictactoe', function(req, res) {
    res.render('tictactoe')
});

app.post('/magic8ball', function(req, res) {
    var _res = magic8ball();
    res.render('magic8ball', {res: _res});
});


var curr_user; //Global variable for username
app.post('/login', function(req, res) {
	const username = req.body.username;
	const password = req.body.password;

	const exists = db.prepare(`SELECT * FROM users WHERE username= '${username}' and password= '${password}';`).get();
	if (exists === undefined) {
		res.render('invalidLogin');
	} else {
		curr_user = username;
		res.render('gameMenu');
	}
});

app.post('/newlogin', function(req, res) {
	const new_username = req.body.new_username;
	const new_password = req.body.new_password;
	
	const makeNew = db.prepare(`INSERT INTO users (username, password) VALUES ('${new_username}', '${new_password}');`);
	const makeBlank = db.prepare(`INSERT INTO wins (username, game1, game2, game3, game4) VALUES ('${new_username}', '0', '0', '0', '0');`);
	makeNew.run();
	makeBlank.run();
	res.render('newAccount');
});

app.post('/roshamboWin', function(req, res) {
	let newWins = db.prepare(`SELECT game1 FROM wins WHERE username = '${curr_user}';`).get() + 1;

	const stmt = db.prepare(`INSERT INTO wins (game1) ('${newWins}');`);
	stmt.run();
});

app.post('/morraWin', function(req, res) {
	var morraWins = req.body.guess;
	let newWins = db.prepare(`SELECT game2 FROM wins WHERE username = '${curr_user}';`).get() + morraWins;

	const stmt = db.prepare(`INSERT INTO wins (game2) ('${newWins}');`);
	stmt.run();
});

app.post('/magic8ballWin', function(req, res) {
	let newWins = db.prepare(`SELECT game4 FROM wins WHERE username = '${curr_user}';`).get() + 1;

	const stmt = db.prepare(`INSERT INTO wins (game4) ('${newWins}');`);
	stmt.run();
});

app.post('/tictactoeWin', function(req, res) {
	let newWins = db.prepare(`SELECT game3 FROM wins WHERE username = '${curr_user}';`).get() + 1;

	const stmt = db.prepare(`INSERT INTO wins (game3) ('${newWins}');`);
	stmt.run();
});


app.get('/database', function(req, res) {
	const stmt = db.prepare(`SELECT * FROM users;`);
	res.send(stmt.all())
});

app.get('/database2', function(req, res) {
	const stmt = db.prepare(`SELECT * FROM wins;`);
	res.send(stmt.all())
});
  
app.get('/database3', function(req, res) {
	const stmt = db.prepare(`SELECT * FROM accesslog;`);
	res.send(stmt.all())
});

app.listen(port)