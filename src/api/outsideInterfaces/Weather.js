import axios from "axios"
import { get, post } from "@/request/request_backup"
export const get_weatherInfo = () => {
    return get('/weather/weatherinfo')
}