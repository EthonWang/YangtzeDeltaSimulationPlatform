// import { getWeatherInfo } from "@/api/outsideInterfaces/Weather.js"
import { get_weatherInfo } from "@/api/outsideInterfaces/Weather.js"
export default {
    namespaced: true,
    state: {
        // weatherInfo: [],
        //时刻天气现象
        weather: [],
        //1/3/12小时内累计降水量
        RAIN: [],
        //时刻温度
        TEMP: [],
        //时刻风向
        DD: [],
        //时刻风速
        FF: [],
        //站号标识位
        STATION: [],
        //时刻相对湿度
        RH: [],
        //1/3/12小时内最高温度
        TEMP_MAX: [],
        //1/3/12小时内最低温度
        TEMP_MIN: [],
    },
    actions: {
        async getweatherInfo(context, username, password, time) {
            let result = await get_weatherInfo();
            console.log(result)
            console.log(result.data.data.DS[0].data);
            if (result.status == 200) {
                // context.commit("GETALL", result.data.data.DS[0].data);
                context.commit("GETDetail", result.data.data.DS[0].data);
            } else {
                return (Promise.reject(new Error('failure')));
            }
        }
    },
    mutations: {
        // GETALL(state, result) {
        //     state.weatherInfo = result;
        // },
        GETDetail(state, result) {
            for (let i = 0; i < 237; i++) {
                state.weather[i] = result[i].WEATHER || "";
                state.RAIN[i] = result[i].RAIN || "";
                state.TEMP[i] = result[i].TEMP || "";
                state.DD[i] = result[i].DD || "";
                state.FF[i] = result[i].FF || "";
                state.STATION[i] = result[i].STATION || "";
                state.RH[i] = result[i].RH || "";
                state.TEMP_MAX[i] = result[i].TEMP_MAX || "";
                state.TEMP_MIN[i] = result[i].TEMP_MIN || "";
            }
        }
    },
    getters: {
        Weather(state) {
            return state.weather || [];
        }
    }
}