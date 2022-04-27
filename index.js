const express = require('express')

const auth = require('./src/middleware/auth')

const W = require('./src/wechat/wechat')
const w = new W()
w.fetchTicket()

const app = express()



app.use(express.static('./dist'))

                                
app.get('/login', (req, res, next) => {
    console.log('req==', req.query)
    console.log('res==', res)
    // console.log(res.json(req.body))
    res.send('1')
    // next()
})
app.get('/jssdk', (req, res, next) => {
    
})
app.use(auth())

app.listen(3000, () => {
    console.log('服务器启动成功~~')
})