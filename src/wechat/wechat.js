const axios = require('axios').default
const fs = require('fs')
const path = require('path')
const { appID, appsecret } = require('../config')
const menuData = require('../config/cursomMenuTemp')
const wxapi = require('../config/wxapi')

class Wechat {
  // access_token相关
  getAccessToken() {
    const url = `${wxapi.access_token}&appid=${appID}&secret=${appsecret}`
    return new Promise((resolve, rejects) => {
      axios.get(url)
        .then(res => {
          // accesstoken有效期是两小时， 提前五分钟去请求accesstoken
          res.data.expires_in = Date.now() + (res.data.expires_in - 60*5)*1000
          resolve(res.data)
        })
        .catch(err => {
          rejects(err)
      })
    })
    
  }
  saveAccessToken(access_token) {
    return new Promise((resolve, reject) => {
      access_token = JSON.stringify(access_token)
      fs.writeFile(path.resolve(__dirname, '../local/access_token.txt'), access_token, (err) => {
        if (!err) {
          resolve()
        } else {
          reject('saveAccessToken出错：', err)
        }
      })
    })
  }
  readAccessToken() {
    return new Promise((resolve, reject) => {
      fs.readFile(path.resolve(__dirname) + '../local/access_token.txt', (err, data) => {
        if (!err) {
          data = JSON.parse(data)
          resolve(data)
        } else {
          reject('readAccessToken出错：', err)
        }
      })
    })
  }
  isValidAccessToken(data) {
    if (!data || !data.access_token || !data.expires_in) {
      return false
    }
    return data.expires_in > Date.now()
  }
  fetchAceessToken() {
    if (this.access_token && this.expires_in && this.isValidAccessToken(this)) {
      return Promise.resolve({
        access_token: this.access_token,
        expires_in: this.expires_in
      })
    }
    return this.readAccessToken()
      .then( async res => {
        const isValid = this.isValidAccessToken(res)
        // 没过期
        if (isValid) {
          return Promise.resolve(res)
        }
        // 已过期
        else {
          const data = await this.getAccessToken()
          const res = await this.saveAccessToken(data)
          return Promise.resolve(res)
        }
      })
      .catch(async err => {
          const res = await this.getAccessToken()
          await this.saveAccessToken(res)
          return Promise.resolve(res)
      })
      .then(res => {
        this.access_token = res.access_token
        this.expires_in = res.expires_in
        return Promise.resolve(res)
      })
  }
  async cursomMenu() {
    const { access_token } = await this.fetchAceessToken()
    const url = ` ${wxapi.create}access_token=${access_token}`
    axios({
        method: 'post',
        url,
        data: JSON.stringify(menuData),
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
    }).then(res => {
        console.log(res.data)
    })
  }
  // jsapi_ticket是公众号用于调用微信JS接口的临时票据，正常情况下，jsapi_ticket的有效期为7200秒，通过access_token来获取
  getTicket() {
    return new Promise(async (resolve, rejects) => {
      const { access_token } = this.fetchAceessToken()
      const url = `${wxapi.ticket}access_token=${access_token}`
      axios.get(url)
        .then(res => {
          // accesstoken有效期是两小时， 提前五分钟去请求accesstoken
          res.data.expires_in = Date.now() + (res.data.expires_in - 60*5)*1000
          resolve(res.data)
        })
        .catch(err => {
          rejects(err)
        })
    })
  }
  saveTicket(ticket) {
    return new Promise((resolve, reject) => {
      ticket = JSON.stringify(ticket)
      fs.writeFile(path.resolve(__dirname, '../local/ticket.txt'), ticket, (err) => {
        if (!err) {
          resolve()
        } else {
          reject('saveTicket出错：', err)
        }
      })
    })
  }
  readTicket() {
    return new Promise((resolve, reject) => {
      fs.readFile(path.resolve(__dirname) + '../local/ticket.txt', (err, data) => {
        if (!err) {
          data = JSON.parse(data)
          resolve(data)
        } else {
          reject('readTicket出错：', err)
        }
      })
    })
  }
  isValidTicket(data) {
    if (!data || !data.ticket || !data.expires_in) {
      return false
    }
    return data.expires_in > Date.now()
  }
  fetchTicket() {
    if (this.ticket && this.ticket_expires_in && this.isValidTicket(this)) {
      return Promise.resolve({
        ticket: this.ticket,
        ticket_expires_in: this.ticket_expires_in
      })
    }
    return this.readTicket()
      .then( async res => {
        const isValid = this.isValidTicket(res)
        // 没过期
        if (isValid) {
          return Promise.resolve(res)
        }
        // 已过期
        else {
          const data = await this.getTicket()
          const res = await this.saveTicket(data)
          return Promise.resolve(res)
        }
      })
      .catch(async err => {
          const res = await this.getTicket()
          await this.saveTicket(res)
          return Promise.resolve(res)
      })
      .then(res => {
        this.ticket = res.ticket
        this.ticket_expires_in = res.expires_in
        return Promise.resolve(res)
      })
  }
  
}
      
module.exports = Wechat
// A.getAccessToken()

// {
//   access_token: '56_hpmSVU0JH6IrYm3HCWQZbIQWX9rIVNmQimpUTmgTXg3GFYZ3QBlcKSuflwnCVlsXJVLQleBzlbc0XMYTenNryEUHj7VFaGE0u6TPpaSkClJbij5esP__Tl_KhScHdnpert4Ckn0leL0fUuHoVYCfAIAGJN',
//   expires_in: 7200
// }



