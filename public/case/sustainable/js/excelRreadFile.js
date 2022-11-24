export const readFile = (file) => {
    return new Promise((resolve) => {
        if (window.FileReader) {
            let reader = new FileReader()
            //将文件读取为二进制码
            reader.readAsBinaryString(file)
 
            //文件读取成功完成时，若失败，结果为null，否则为读取的结果
            reader.onload = (ev) => {
                resolve(ev.target.result)
            }
        } else {
            //不支持，返回结果为null
            alert('读取错误，建议更换浏览器')
            resolve(null)
        }
    })
}