const moment = require('moment')
let router = require('log').Router()


router.post('/:name', (req, res) => {
    req.app.get('db').ref('experiments/' + req.params.name + '/logs').set(req.body)
    req.app.get('db').ref('experiments/' + req.params.name + '/last_updated').set(moment().format('LLLL'))
    res.redirect('/')
})


router.get('/:name',  (req, res) => {
    req.app.get('db').ref('experiments/' + req.params.name + '/logs').once('value')
    .then(snapshot => {
        let results = snapshot.val()
        res.render('index.pug', {experiments: Object.values(results || [])})
    })
})

router.put('/', (req, res) => {
    let updates = {}
    req.body.last_updated = moment().format('LLLL')
    updates['experiments/' + req.body.name] = req.body
    req.app.get('db').ref().update(updates);
})

router.delete('/', (req, res) => {
    req.app.get('db').ref('experiments/' + req.body.name).remove()
})


module.exports = router