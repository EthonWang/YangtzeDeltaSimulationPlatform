import {get ,post} from "@/request/request"
import { ElMessage } from "element-plus";
import themeData from "../json/themeData.json"

// async function  getData(){
//     return get('xxx')
// }
async function  getData(){
    return themeData
}
export default getData