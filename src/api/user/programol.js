import { get, post } from "@/request/request"
import { ElMessage } from "element-plus";
import { backUrl, backUrl_backup } from "../../../public/backURL/backurl";
const dataServer = backUrl_backup;

export default class {
    OpenWorkSpace = (userId) => {
        return get("/workspace/" + userId)
    }
    CreateProject = (project) => {
        return post("/project", project)
    }
    OpenProject = (projectId) => {
        return get("/project/open/" + projectId)
    }
    DeleteProject = (projectId) => {
        return get("/project/delete/" + projectId)
    }
    CreateFile = (file) => {
        return post("/programfile/create", file)
    }
    DeleteFile = (fileId) => {
        return get("/programfile/delete/" + fileId)
    }
    RenameFile = (fileId, fileNewName) => {
        return get("/programfile/rename/" + fileId + '/' + fileNewName)
    }
    downloadFile(fileId) {
        return new Promise((resolve, reject) => {
            try {
                window.location.href = dataServer + '/programfile/download/' + fileId
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    }
    deleteTempFile(fileId) {
        return get("/programfile/deleteTemp/" + fileId)
    }
    uploadFile(parentId, upFile) {
        return post('/programfile/uploadfile/' + parentId, upFile)
    }
    openFile(id) {
        return get('/programfile/openprogramfile/' + id)
    }
    saveEdit(id, content) {
        return post('/programfile/saveEdit/' + id, content)
    }
    donwloadDep(id) {
        return get('/project/donwloadDep/' + id);
    }
    runDemo(id) {
        return get('/project/runDemo/' + id);
    }
    stopDemo(id) {
        return get('/project/stopDemo/' + id);
    }
    stopContainer(id) {
        return get('/project/stopContainer/' + id);
    }
}