import axios from "axios"
import { get, post } from "@/request/request_pt.js"
export const getDataMethodList = (searchparam) => {
    return post('/dataMethod/items', searchparam)
}

export const getMethodServiceInfo = (applicationOid, serviceId) => {
    return get('/dataMethod/serviceInfo/' + applicationOid + "/" + serviceId)
}

export const getMethodServiceParameter = (applicationOid, serviceId) => {
    return get('/dataMethod/parameter/' + applicationOid + "/" + serviceId)
}
