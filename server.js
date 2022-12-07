import express from 'express';
import minimist from 'minimist';
import database from "better-sqlite3";
import path from 'path';
import {fileURLToPath} from 'url';
//import { roshambo } from './lib/roshambo.js';
import { magic8ball } from './lib/magic8ball.js';
import { mora } from './lib/mora.js';
import morgan from 'morgan';


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
	
	const sql_wins = `CREATE TABLE wins (id INTEGER PRIMARY KEY, user VARCHAR, game1 INTEGER, game2 INTEGER, game3 INTEGER, game4 INTEGER);`
	db.exec(sql_wins);
	
	const sql_logs = `CREATE TABLE accesslog (id INTEGER PRIMARY KEY, remote_addr VARCHAR, remote_user VARCHAR, date VARCHAR, method VARCHAR, url VARCHAR, http_version VARCHAR, status INTEGER, content_length VARCHAR, referer_url VARCHAR, user_agent VARCHAR);` 
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
// const accesslog = fs.createWriteStream( './access.log', { flags: 'a'});

// app.use(morgan('combined', { stream: accesslog }));

// app.use((req, res, next) => {
// 	let logdata = {

// 	}
// 	const stmt_log = db.prepare(`INSERT INTO accesslog ()`);
// 	const info = stmt_log.run();
// 	next();
// });


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
    res.render('homePage')
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



app.post('/login', function(req, res) {
	const username = req.body.username;
	const password = req.body.password;

	const exists = db.prepare(`SELECT * FROM users WHERE username= '${username}' and password= '${password}';`).get();
	if (exists === undefined) {
		res.render('/invalidLogin');
	} else {
		res.render('gameMenu');
	}
});

app.post('/newlogin', function(req, res) {
	const new_username = req.body.new_username;
	const new_password = req.body.new_password;
	
	const makeNew = db.prepare(`INSERT INTO users (username, password) VALUES ('${new_username}', '${new_password}');`);
	makeNew.run();
	res.render('newAccount');
});

app.post('/roshamboWin', function(req, res) {
	let curr_user = req.app.get(username);
	const stmt1 = db.prepare(`SELECT game1 FROM wins WHERE user = ?;`);
	var newWins = stmt2.run(curr_user).get() + 1;

	const stmt2 = db.prepare(`INSERT INTO wins (game1) (?);`);
	stmt2.run(newWins);
});

app.post('/morraWin', function(req, res) {
	let curr_user = req.app.get(username);
	var morraWins = req.app.get(guess);
	const stmt1 = db.prepare(`SELECT game2 FROM wins WHERE user = ?;`);
	var newWins = stmt2.run(curr_user).get() + morraWins;

	const stmt2 = db.prepare(`INSERT INTO wins (game2) (?);`);
	stmt2.run(newWins);
});

app.post('/magic8ballWin', function(req, res) {
	let curr_user = req.app.get(username);
	const stmt1 = db.prepare(`SELECT game4 FROM wins WHERE user = ?;`);
	var newWins = stmt2.run(curr_user).get() + 1;

	const stmt2 = db.prepare(`INSERT INTO wins (game4) (?);`);
	stmt2.run(newWins);
});

app.post('/tictactoeWin', function(req, res) {
	let curr_user = req.app.get(username);
	const stmt1 = db.prepare(`SELECT game3 FROM wins WHERE user = ?;`);
	var newWins = stmt2.run(curr_user).get() + 1;

	const stmt2 = db.prepare(`INSERT INTO wins (game3) (?);`);
	stmt2.run(newWins);
});


app.get('/newAccount', function(req, res) {
	res.render('newAccount')
});

app.get('/database', function(req, res) {
	const stmt = db.prepare(`SELECT * FROM users;`);
	res.send(stmt.all())
})
  
// app.get('/app', function (req, res) {
//     res.redirect('/homePage');
// })

app.listen(port)