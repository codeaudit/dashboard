const moment = require('moment')
let router = require('express').Router()


router.post('/', (req, res) => {
    req.body.last_updated = moment().format('LLLL')
    req.app.get('db').ref('experiments/' + req.body.name).set(req.body)
    res.json(req.body)
})


router.get('/',  (req, res) => {
    req.app.get('db').ref('experiments').once('value')
    .then(snapshot => {
        let results = snapshot.val()
        res.json(Object.values(results || {}))
    })
})


router.get('/:name',  (req, res) => {
    req.app.get('db').ref('experiments/' + req.params.name).once('value')
    .then(snapshot => {
        let results = snapshot.val()
        if (! results) res.status(404).send({error: 'Invalid experiment!'})
        else res.json(results)
    })
})


router.put('/:name', (req, res) => {
    req.app.get('db').ref('experiments/' + req.params.name).once('value')
    .then(snapshot => {
        let results = snapshot.val()
        if (! results) res.status(404).send({error: 'Invalid experiment!'})
        else {
            req.body.last_updated = moment().format('LLLL')
            Object.assign(results, req.body)
            let updates = {}
            updates['experiments/' + req.body.name] = results
            req.app.get('db').ref().update(updates);
            res.json(results)
        }
    })
})

router.delete('/:name', (req, res) => {
    req.app.get('db').ref('experiments/' + req.params.name).once('value')
    .then(snapshot => {
        let results = snapshot.val()
        if (! results) res.status(404).send({error: 'Invalid experiment!'})
        else {
            req.app.get('db').ref('experiments/' + req.body.name).remove()
            res.json({message: 'deleted example ' + req.params.name})
        }
    })
})


module.exports = router