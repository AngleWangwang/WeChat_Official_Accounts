const { replayInfoToUser } = require('../utils/handleAsycnUserImportData')
module.exports = (options) => {
  let xml = `<xml>
    <ToUserName><![CDATA[${options.FromUserName}]]></ToUserName>
    <FromUserName><![CDATA[${options.ToUserName}]]></FromUserName>
    <CreateTime>${Date.now()}</CreateTime>
  `
  switch (options.MsgType) {
    case 'text':
      const content = replayInfoToUser(options.Content)
      xml += `
        <MsgType><![CDATA[text]]></MsgType>
        <Content><![CDATA[${content}]]></Content>
      `
  }
  xml += `</xml>`
  return xml
}