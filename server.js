const express = require('express');
const app = express();

require('dotenv').config();
require('./auth/passport.js');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/books', require('./routes/books.js'));


const server = app.listen(process.env.PORT || 3000, () => {
    server.emit("appStarted");
});

module.exports = server;
