// 自动识别开发环境与部署环境，并在开发环境下自动识别并连接backurl.json配置的后台
let isdeploy = true
let backIP = require('./backUrl.json').back_url
const backIP_deploy = "https://geomodeling.njnu.edu.cn/YangtzeVGLabBack"
const herf = window.location.href.toLowerCase()
if (herf.indexOf('geomodeling.njnu.edu.cn') != -1) {
    isdeploy = true
} else {
    isdeploy = false
    // backIP=herf.split(':')[0]+':'+herf.split(':')[1]+':8999'
}
let backUrl
let YangtzeVGLab
let backUrl_backup
if (isdeploy) {
    backUrl = backIP_deploy
    YangtzeVGLab = "/YangtzeVGLab"//部署状态下为'/YangtzeVGLab'
    backUrl_backup = backUrl
} else {
    backUrl = backIP
    YangtzeVGLab = ""//部署状态下为'/YangtzeVGLab'
    backUrl_backup = backUrl
}
export { backUrl, YangtzeVGLab, backUrl_backup }