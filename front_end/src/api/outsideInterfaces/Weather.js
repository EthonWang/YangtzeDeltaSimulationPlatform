import axios from "axios"
import { get, post } from "@/request/request_backup"
export const getCurrentWeatherInfo = () => {
    return get('/weather/currentWeatherInfo')
}
export const getWeekWeatherInfo = () => {
    return get('/weather/weekWeatherInfo')
}
export const get24hoursWeatherInfo = () => {
    return get('/weather/24hoursWeatherInfo')
}