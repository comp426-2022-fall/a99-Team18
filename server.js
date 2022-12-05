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

