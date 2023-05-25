const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');

const { PORT = 3000, DB_PATH = 'mongodb://127.0.0.1:27017/mestodb' } =  process.env;
const app = express();


app.use(helmet());