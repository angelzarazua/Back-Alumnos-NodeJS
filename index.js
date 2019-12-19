const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const express = require('express')
const http = require('http')
const app = express()
const HOST = '0.0.0.0'
const PORT = 8080
const cors = require('cors');

app.use(cors({
    origin:'*'
}));
const corsOptions = {
    origin: [process.env.URL, '*']
  }
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let createTable = "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(40) NOT NULL, email varchar(40) NOT NULL, phone integer NOT NULL)"

// let db = new sqlite3.Database(':memory:', (err) => {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log('Connected to the in-memory SQlite database.');
// });

let db = new sqlite3.Database('db/users.db');
//db.run(createTable);

// db.close((err) => {
//   if (err) {dfaceccad150
//     return console.error(err.message);
//   }
//   console.log('Close the database connection.');
// });
db.run(createTable,(err) => {
      if (err){
        throw err;
      }
      console.log('Se pudo');
    });


app.listen(PORT, () => {
    console.log(`Server en http://${HOST}:${PORT}`);
})

app.get('/', (req, res) => {
    console.log('res: ', req.body);
    res.send('Hello world')
});

// db.all("SELECT rowid AS id, name FROM contacts", function(err, rows) {
//     rows.forEach(function (row) {
//         console.log(row.id + ": " + row.name);
//     });
// });

app.get('/users', (req, res, next) => {
    let sql = 'SELECT * FROM users'
    let list = []
    db.all(sql, [], (err, rows) => {
        if (err) {
          throw err;
        }
        return res.status(200)
            .json(rows)
    });
})

app.get('/users/:id', function(req, res) {
    const id = req.params.id
    const query = "SELECT * FROM users WHERE id = ?";

    db.get(query, [id], function(err, row){
        if (err || row == null) {
            return res.json('User not found')
        }
        return res.status(200)
            .json(row)

    });


});

app.post('/users', function(req, res) {
    const body = req.body;

    console.log('name: ', 'email: ', body.email, 'phone: ', body.phone);
    // const sql = "INSERT INTO users (name, email, phone) VALUES ('"+body.name+"','"+body.email+"','"+body.phone+"')"
    const sql = "INSERT INTO users (name, email, phone) VALUES (?, ?, ?);"
    db.run(sql, [body.name, body.email, body.phone], function(err){
        if (err) {
            return console.log(err.message);
        }
        return res.status(200)
        .json(body)
    });
});

app.put('/users/:id', function(req, res) {
    const id = req.params.id
    const body = req.body;
    // console.log('Body: ', body);
    let query = 'UPDATE users SET name = ?, email=?, phone=? WHERE id = ?'
    db.run(query, [body.name, body.email, body.phone, id], function(err){
        if(err){
            console.log(err.message);
            return res.err.message
        }
        return res.json({
            update: req.body
        })

    });
});


app.delete('/users/:id', function(req, res) {
    const id = req.params.id
    const query = "DELETE FROM users WHERE id = ?";

    db.run(query, [id], function(err){
        if(err){
            return res.err
        }
        return res.json('Has been delete')
    });
});