import express from 'express';
import minimist from 'minimist';
import Database from "better-sqlite3";
import path from 'path';
import {fileURLToPath} from 'url';



const db = new database('task.db');
db.pragma('journal_mode = WAL');



const app = express();