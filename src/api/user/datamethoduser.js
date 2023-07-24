import { get, post } from "@/request/request"
import { ElMessage } from "element-plus";
import { backUrl, backUrl_backup } from "../../../public/backURL/backurl";
const dataServer = backUrl_backup;

export default class {
    uploadDataMethod(userId, formdata) {
        return post("/dataMethodUser/createMethod/" + userId, formdata)
    }
    getDataMethod(searchparam) {
        return post('/dataMethodUser/items', searchparam)
    }
    getDataMethodUser(userId, searchdatauser) {
        return post('/dataMethodUser/user/' + userId, searchdatauser)
    }
    downloadFile(methodId) {
        return new Promise((resolve, reject) => {
            try {
                window.location.href = dataServer + '/dataMethodUser/download/' + methodId
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    }
    deleteMethod(methodId) {
        return get('/dataMethodUser/delete/' + methodId)
    }
    modifyMethod(methodId, formdata) {
        return post("/dataMethodUser/modifyMethod/" + methodId, formdata)
    }
    invokeInfo(methodId) {
        return get('/dataMethodUser/invokeInfo/' + methodId)
    }
    invokeDataMethod(id, formdata) {
        return post('/dataMethodUser/invoke/' + id, formdata)
    }
    downloadInputFile(id) {
        return new Promise((resolve, reject) => {
            try {
                window.location.href = dataServer + '/dataMethodUser/downloadinput/' + id
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    }
    closeDrawer(methodId, formdata) {
        return post('/dataMethodUser/close/' + methodId, formdata)
    }
}