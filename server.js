const express = require('express')
const body_parser = require('body-parser')
const flash = require('express-flash')
const cookie_parser = require('cookie-parser')
const session = require('express-session')
const fs = require('fs');


const app = express()
let config = JSON.parse(fs.readFileSync(__dirname + "/.config.json", "utf8"))


// Firebase
let admin = require("firebase-admin")
let serviceAccount = require(__dirname + '/.credentials/google-service-account-key.json')
// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config['firebase_db_url']
});
// As an admin, the app has access to read and write all data, regardless of Security Rules
app.set('db', admin.database())


app.set('view engine', 'pug')
app.use(body_parser.urlencoded({extended: true}))
app.use(body_parser.json())
app.use(cookie_parser());
app.use(session({
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true,
    secret: config.secret
}));
app.use(flash())
app.use(express.static('public'))
app.locals.pretty = true; 


app.use('/api/experiments', require('./api/experiment'))


app.get('/',  (req, res) => {
    res.render('index.pug')
})

app.get('/experiments/:name',  (req, res) => {
    res.render('experiment.pug', {name: req.params.name})
})

app.listen(3000,  () => {
    console.log('listening on port 3000')
})
