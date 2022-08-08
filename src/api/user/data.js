import { get, post } from "@/request/request"
import { useStore } from "vuex"

const dataServer = "http://172.21.213.44:8999";
// 上传文件
export default class {
    getAllFile(user_id) {
        return post("/resource/getUserAllResource?userId=" + user_id,)
    }
    getFile(parent_id) {
        return post("/resource/getUserResource?parentId=" + parent_id,)

    }
    uploadFile(data) {
        return post('/resource/saveDataItem', data)
    }
    downloadFile(data) {
        // return service.get('/file/download', {params: data})
        return new Promise((resolve, reject) => {
            try {
                window.location.href = dataServer + '/resource/downloadDataItem/' + data.id
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
                window.location.href = dataServer + '/resource/downloadDataItem/' + data.id
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    }
    deleteFile(file) {
        if (file.type != 'folder') {
            return post('/resource/deleteDataItem?dataItemId=' + file.id,)
        } else {
            return post('/resource/deleteFolder?folderId=' + file.id,)
        }
    }
    createFolder(parent_id, name,problemTags="") {
        let folder = {
            name: name,
            parentId: parent_id,
            description: '新建文件夹',
            problemTags: problemTags,
            publicBoolean:false,
            type: "folder",
        }
        return post('/resource/createFolder', folder)
    }

    moveFile() { }
    editFile(data) {
        if (data.type == 'file') {
            return post('/resource/updateUserDataItem', data)
        }
        else {
            return post('/resource/updateUserFolder', data)
        }
    }
    sendDataToContainer(fileRelativePath, userDataId) {
        return get('/model/upToDataContainer?dataRelativePath=' + fileRelativePath + '&userDataId=' + userDataId)
    }
    sendResDataToContainer(fileRelativePath, taskId, resDataId, userId) {
        return get('/model/upResToDataContainer?dataRelativePath=' + fileRelativePath + '&resDataId=' + resDataId + '&taskId=' + taskId + '&userId=' + userId)
    }
    sendXMLToContainer(configFile) {
        return post('/model/upXMLToDataContainer', configFile)
    }
}
