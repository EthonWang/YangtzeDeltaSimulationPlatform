import axios from 'axios'
import Global from "../Global";


axios.defaults.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/json'
const instance = axios.create();

axios.interceptors.request.use = instance.interceptors.request.use

export default {

    SaveBuildTableData(data){
        // console.log(Global.SDGUrl+'/api/EcoData')
        return instance.post(Global.SDGUrl+'/api/SaveData',data)
    },
    deleteTableData(id){
        return instance.post(Global.SDGUrl+'/api/DeleteData',id)
    }
}