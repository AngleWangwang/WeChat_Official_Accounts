// 验证身份有效性模块

const sha1 = require('sha1')

const config = require('../config')
const { getAsycnUserData, transformXml,  replayInfoToUser } = require('../utils/handleAsycnUserImportData')
const xmlTemplate = require('../config/xmlTemplate')

module.exports = () => {
    return async (req, res, next) => {
        const { signature, echostr, timestamp, nonce } = req.query
        const { token } = config
        const tmpArr = [token, timestamp, nonce].sort()
        const shastr = sha1(tmpArr.join(''))
      if (req.method === 'GET') {
        if (signature === shastr) {
          res.send(echostr)
        } else {
          res.send('error')
        }
          // GET请求代表微信服务器向开发服务器发送的认证请求
      }
      else if (req.method === 'POST') {
        /**
         * 当用户发送消息给公众号时（或某些特定的用户操作引发的事件推送时），
         * 会产生一个POST请求，开发者可以在响应包（Get）中返回特定XML结构，
         * 来对该消息进行响应（现支持回复文本、图片、图文、语音、视频、音乐）。
         * 严格来说，发送被动响应消息其实并不是一种接口，而是对微信服务器发过来消息的一次回复。
         * 
         */
        if (signature === shastr) {
          const xmlData = await getAsycnUserData(req)
          const messege = transformXml(xmlData)
          // console.log(messege)
          
          const xml = xmlTemplate(messege)
          res.send(xml)
          
        } else {
          res.send('error')
        }
        }
        next()
    }
}