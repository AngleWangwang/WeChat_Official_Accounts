const express = require('express')


const app = express()

app.use((req, res, next) => {
    console.log(req.query)
})

// app.use(express.static('./dist'))

// app.get('/login', (req, res, next) => {
//     console.log('req==', req.query)
//     console.log('res==', res)
//     // console.log(res.json(req.body))
//     next()
//     res.end('1')
// })

app.listen(3000, () => {
    console.log('服务器启动成功~~')
})