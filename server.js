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
import { tictactoe_response } from './lib/tictactoe.js';


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

app.get('/', function(req, res) {
    res.redirect('/homePage');
});

app.get('/app', function (req, res) {
    res.redirect('/homePage');
})

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
    var userGuess = parseInt(req.body.guess);
    var userFingers = parseInt(req.body.fingers);
    var _mRes = mora(userGuess, userFingers);
    res.render('morra', {input: userFingers, sum: _mRes.sum, res: _mRes.res, outcome: _mRes.output})
});

app.post('/tictactoe', function(req, res) {
    var boardState = "NNNNNNNNN";
    var select = null;
    var newBoard = tictactoe_response(boardState, select);
    res.render('tictactoe', {board: newBoard, zero: newBoard[0], one: newBoard[1], two: newBoard[2],
                                             three: newBoard[3], four: newBoard[4], five: newBoard[5],
                                             six: newBoard[6], seven: newBoard[7], eight: newBoard[8]})
});

// app.post('/tictactoe', function(req, res) {
//     var boardState = req.body.board;
//     var select = parseInt(req.body.input)
//     var newBoard = tictactoe_response(boardState, select);
//     res.render('tictactoe', {board: newBoard, zero: newBoard[0], one: newBoard[1], two: newBoard[2],
//                                              three: newBoard[3], four: newBoard[4], five: newBoard[5],
//                                              six: newBoard[6], seven: newBoard[7], eight: newBoard[8]})
// });

app.post('/magic8ball', function(req, res) {
    res.render('magic8ball');
});

var curr_user;
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
	let winsRecord = db.prepare(`SELECT * FROM wins WHERE username = '${curr_user}';`).get();
	winsRecord.game1 += 1;

	const stmt = db.prepare(`UPDATE wins SET game1 = '${winsRecord.game1}' WHERE username = '${curr_user}';`);
	stmt.run();
	res.render('roshambo');
});


app.post('/morraWin', function(req, res) {
    var userGuess = parseInt(req.body.guess);
    var userFingers = parseInt(req.body.fingers);
    var _mRes = mora(userGuess, userFingers);
	if (_mRes.res == "WIN!") {
		let winsRecord = db.prepare(`SELECT * FROM wins WHERE username = '${curr_user}';`).get();
		winsRecord.game2 += userGuess;//morraWins;
	
		const stmt = db.prepare(`UPDATE wins SET game2 = '${winsRecord.game2}' WHERE username = '${curr_user}';`);
		stmt.run();
	}
    res.render('morra', {input: userFingers, sum: _mRes.sum, res: _mRes.res, outcome: _mRes.output});
});

app.post('/magic8ballWin', function(req, res) {
	let winsRecord = db.prepare(`SELECT * FROM wins WHERE username = '${curr_user}';`).get();
	winsRecord.game4 += 1;

	const stmt = db.prepare(`UPDATE wins SET game4 = '${winsRecord.game4}' WHERE username = '${curr_user}';`);
	stmt.run();
	res.render('magic8ball');
});

app.post('/tictactoeWin', function(req, res) {
	let winsRecord = db.prepare(`SELECT * FROM wins WHERE username = '${curr_user}';`).get();
	winsRecord.game3 += 1;

	const stmt = db.prepare(`UPDATE wins SET game3 = '${winsRecord.game3}' WHERE username = '${curr_user}';`);
	stmt.run();
	res.render('tictactoe');
});

app.post('/databaseDisplay', function(req,res) {
	let winsRecord = db.prepare(`SELECT * FROM wins WHERE username = '${curr_user}';`).get();
	var rps = winsRecord.game1;
	var mor = winsRecord.game2;
	var ttt = winsRecord.game3;
	var bal = winsRecord.game4;
	res.render('databaseDisplay', {rps:rps, mor:mor,ttt:ttt,bal:bal});
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