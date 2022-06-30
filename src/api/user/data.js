import { get, post } from "@/request/request"

// 上传文件
export default class {
    getAllFile(user_id){
        return post("/resource/getUserAllResource?userId="+user_id,)
    }
    getFile(parent_id) {
        return post("/resource/getUserResource?parentId="+parent_id, )

    }
    uploadFile(data) {
        return post('/resource/saveDataItem', data)
    }
    downloadFile(data) {
        // return service.get('/file/download', {params: data})
        return new Promise((resolve, reject) => {
            try {
                window.location.href = '/back/resource/downloadDataItem/' + data.id
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
                window.location.href = '/back/resource/downloadDataItem/' + data.id
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    }
    deleteFile(file) {
        if (file.type != 'folder') { 
            return post('/resource/deleteDataItem?dataItemId='+file.id,) 
        } else {
            return post('/resource/deleteFolder?folderId='+file.id,) 
        }
    }
    createFolder(parent_id, name) {
        let folder = {
            name: name,
            parentId: parent_id,
            description: '新建文件夹',
            problemTags: "",
        }
        return post('/resource/createFolder', folder)
    }

    moveFile() { }
    editFile(data) {
        return post('/respurce/updateDataItem',data)
    }
}
