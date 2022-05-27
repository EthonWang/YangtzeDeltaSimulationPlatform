import { get, post } from "@/request/request"

// 上传文件
export default class {
    getFile(parent_id) {
        return post("/resource/getUserResource", parent_id)

    }
    uploadFile(data) {
        return post('/resource/saveDataItem', data)
    }
    downloadFile(data) {
        // return service.get('/file/download', {params: data})
        return new Promise((resolve, reject) => {
            try {
                window.location.href = '/back/file/download?id=' + data.id + '&catalogId=' + data.catalogId
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    }
    downloadFolder(data) {
        // return service.get('/file/download', {params: data})
        return new Promise((resolve, reject) => {
            try {
                window.location.href = '/back/resource/downloadDataItem/?id=' + data.id + '&catalogId=' + data.catalogId
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    }
    deleteFile(file) {
        if (file.type != 'folder') { 
            return post('/resource/deleteDataItem', file.id) 
        } else {
            return post('/resource/deleteFolder', file.id) 
        }
    }
    createFolder(parent_id, name) {
        let folder = {
            name: name,
            parentId: parent_id,
            description: '新建文件夹',
            issueTags: [""],
        }
        return post('/resource/createFolder', folder)
    }

    moveFile() { }
    editFile(type, file) {

    }
}
