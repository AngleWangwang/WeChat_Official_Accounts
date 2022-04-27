const { parseString  } = require('xml2js')

module.exports = {
  getAsycnUserData(req) {
    return new Promise((resolve, reject) => {
      let xmlData = ''
      req.on('data', (d) => {
        xmlData += d.toString()
      })
      req.on('end', () => {
        resolve(xmlData)
      })
    })
  },
  transformXml(xmlData) {
    let obj = {}
    xmlData = parseString(xmlData, {trim: true}, (err, result) => {
      if (!err) {
        if (typeof result === 'object') {
          const tempObj = result.xml
          for (const key in tempObj) {
            const value = tempObj[key]
            if (Array.isArray(value) && value.length) {
              obj[key] = value[0]
            }
          }
        }
      } else {
        return 'error'
      }
    })
    return obj
  },
  replayInfoToUser(data) {
    let content = '请输入合法字符'
    if (data === '1') {
      content = '大吉大利 今晚吃鸡'
    } else if (data === '2') {
      content = '落地成盒'
    } else if(data.match('爱')) {
      content = 'i love you ~'
    }
    return content
  }
}