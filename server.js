const express = require('express');
const hbs = require('hbs');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'waitlistDB'
});

const port = process.env.PORT || 3000;
var app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//This lets use reuse code from handlebars
hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');

//middlware to set up express as a static directory
app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    socket.on('view-tables', function (data) {
        connection.connect(function (err) {
            if (err) throw err
            console.log('You are now connected...');
        });

        connection.query('SELECT * FROM tables', (err, rows) => {
            if (err) throw err;
            socket.emit('loadDataTables', rows);
        });

        connection.query('SELECT * FROM waitlist', (err, rows) => {
            connection.end();
            if (err) throw err;
            socket.emit('loadDataWailist', rows);
        });
    });

    socket.on('make-reservation', function (data) {
        connection.connect(function (err) {
            if (err) throw err;
            console.log('You are now connected...');
        });

        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM tables', (err, rows) => {
                if (err) throw err;
                resolve(rows);
            });
        }).then((rows) => {
            var message;
            if (rows.length >= 5) {
                message = "Sorry you are on the wait list";
                connection.query('INSERT INTO waitlist SET ?', data, (err, row) => {
                    if (err) throw err;
                    socket.emit('message', message);
                });
            } else {
                message = "Yay! You are officially booked!";
                connection.query('INSERT INTO tables SET ?', data, (err, row) => {
                    connection.end();
                    if (err) throw err;
                    socket.emit('message', message);
                });
            }
        });
    });
});


app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        jumbotronDescription: 'We only have 5 tables! Book your seat before they all are gone!'
    });
});

app.get('/tables', (req, res) => {
    res.render('tables.hbs', {
        pageTitle: 'Tables Page',
        jumbotronDescription: 'Current Reservations and Waiting List'
    });
});

app.get('/reserve', (req, res) => {
    res.render('reserve.hbs', {
        pageTitle: 'Reservation Page',
        jumbotronDescription: 'Make your reservation'
    });
});

app.get('/api/tables', (req, res) => {
    connection.connect(function (err) {
        if (err) throw err;
        console.log('You are now connected...');
    });
    connection.query('SELECT * FROM tables', (err, rows) => {
        connection.end();
        if (err) {
            return res.status(400).send(err);
        }
        res.send({
            rows
        })
    });
});

app.get('/api/waitlist', (req, res) => {
    connection.connect(function (err) {
        if (err) throw err;
        console.log('You are now connected...');
    });
    connection.query('SELECT * FROM waitlist', (err, rows) => {
        connection.end();
        if (err) {
            return res.status(400).send(err);
        }
        res.send({
            rows
        })
    });
});

//binding application to a port in heroku or our machine
server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});