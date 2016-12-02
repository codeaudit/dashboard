const express = require('express')
const body_parser = require('body-parser')
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
app.use(express.static('public'))
app.locals.pretty = true; 

app.get('/',  (req, res) => {
    res.redirect('/experiments')
})

app.use('/experiments', require('./routes/experiment'))

app.listen(3000,  () => {
    console.log('listening on port 3000')
})
