import { get, post } from "@/request/request"
import { ElMessage } from "element-plus";

export default class {
    getData(id) {
        return
    }
    invokeDataMethod = (formData) => {
        return post("/datamethod/invokeMethod", formData)
    }
}