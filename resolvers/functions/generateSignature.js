const createHmac = require('create-hmac')

const KEY = process.env.IMGPROXY_KEY
const SALT = process.env.IMGPROXY_SALT

const urlSafeBase64 = (string) => {
  return Buffer.from(string).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

const hexDecode = (hex) => Buffer.from(hex, 'hex')

const sign = (salt, target, secret) => {
  const hmac = createHmac('sha256', hexDecode(secret))
  hmac.update(hexDecode(salt))
  hmac.update(target)
  return urlSafeBase64(hmac.digest())
}


const generateSignature = ({
    url,
    resizing_type,
    width,
    height,
    gravity,
    enlarge,
    extension,
}) => {

    const encoded_url = urlSafeBase64(url)
    const path = `/${resizing_type}/${width}/${height}/${gravity}/${enlarge}/${encoded_url}.${extension}`

    const signature = SALT && KEY ? sign(SALT, path, KEY) : ''
    const result = `${signature}${path}`
    
    
    return result


}



module.exports = generateSignature