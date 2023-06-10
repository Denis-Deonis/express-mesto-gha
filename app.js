const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/errorHandler');
const authLimiter = require('./middlewares/rateLimiter');

const routes = require('./routes/router');

const { PORT = 3000, DB_PATH = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(routes);
app.use(errors());
app.use(errorHandler);
app.use(authLimiter);

mongoose
  .connect(DB_PATH)
  .then(() => console.log('БД подключена'))
  .catch(() => console.log('Не удалось подключиться к БД'));

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
