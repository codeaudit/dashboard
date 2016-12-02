const express = require('express')
const body_parser = require('body-parser')
const moment = require('moment')
const fs = require('fs');
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
let db = admin.database()


const app = express()
app.set('view engine', 'pug')
app.use(body_parser.urlencoded({extended: true}))
app.use(body_parser.json())
app.use(express.static('public'))
app.locals.pretty = true; 

app.post('/experiments', (req, res) => {
    req.body.last_updated = moment().format('LLLL')
    db.ref('experiments/' + req.body.name).set(req.body)
    res.redirect('/')
})


app.get('/',  (req, res) => {
    db.ref('experiments').once('value')
    .then(snapshot => {
        let results = snapshot.val()
        res.render('index.pug', {experiments: Object.values(results || [])})
    })
})

app.put('/experiments', (req, res) => {
    let updates = {}
    req.body.last_updated = moment().format('LLLL')
    updates['experiments/' + req.body.name] = req.body
    db.ref().update(updates);
})

app.delete('/experiments', (req, res) => {
    db.ref('experiments/' + req.body.name).remove()
})


app.listen(3000,  () => {
    console.log('listening on port 3000')
})
