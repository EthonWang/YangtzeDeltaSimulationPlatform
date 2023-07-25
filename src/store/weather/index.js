// import { getWeatherInfo } from "@/api/outsideInterfaces/Weather.js"
import { getCurrentWeatherInfo, getWeekWeatherInfo, get24hoursWeatherInfo } from "@/api/outsideInterfaces/Weather.js"
export default {
    namespaced: true,
    state: {
        //当前数据
        currentData: {},
        curCloud: [],
        curDate: "",
        curRain: [],
        stationID: [],
        curTemprature: [],
        curHumidity: [],
        timeofday: "",
        curWeather: [],
        curWindDir: [],
        curWindLevel: [],
        curIconPath: [],
        curBGIPath: [],
        //本周数据
        weekData: [],
        weekRain: [],
        //24小时温度
        todayTemp: [],
        todayMaxTemp: [],
        todayMinTemp: [],
        //城市基本数据
        city: [],
        province: [],
        lon: [],
        lat: [],
    },
    actions: {
        async getCurrentWeatherInfo(context) {
            let result = await getCurrentWeatherInfo();
            console.log(result)
            if (result.status == 200) {
                // context.commit("GETALL", result.data.data.DS[0].data);
                context.commit("GETCurrent", result);
                context.commit("GETDetail", result.data.data);
            } else {
                return (Promise.reject(new Error('failure')));
            }
        },
        async getWeekWeatherInfo(context) {
            let result = await getWeekWeatherInfo();
            console.log(result);
            if (result.status == 200) {
                // context.commit("GETALL", result.data.data.DS[0].data);
                context.commit("GETWeek", result);
                context.commit("GETWeekRain", result.data.data)
                // context.commit("GETDetail", result.data.data);
            } else {
                return (Promise.reject(new Error('failure')));
            }
        },
        async get24hoursWeatherInfo(context) {
            let result = await get24hoursWeatherInfo();
            console.log(result);
            if (result.status == 200) {
                context.commit("GET24Temp", result.data.data)
                context.commit("GETMINMAX", result.data.data)
            } else {
                return (Promise.reject(new Error('failure')));
            }
        }
    },
    mutations: {
        GETCurrent(state, result) {
            state.currentData = result.data.data;
        },
        GETDetail(state, result) {
            state.curDate = result[0].date || "";
            state.timeofday = result[0].timeofday || "";
            for (let i = 0; i < 237; i++) {
                state.curCloud[i] = result[i].cloud || "";
                state.curHumidity[i] = result[i].humidity || "";
                state.stationID[i] = result[i].stationID || "";
                state.curTemprature[i] = result[i].temprature || "";
                state.curWeather[i] = result[i].weather || "";
                state.curWindDir[i] = result[i].windDir || "";
                state.curWindLevel[i] = result[i].windLevel || "";
                state.curRain[i] = result[i].rain;
                state.curIconPath[i] = result[i].iconPath;
                state.curBGIPath[i] = result[i].bgimgPath;
                state.city[i] = result[i].city;
                state.province[i] = result[i].province;
                state.lon[i] = result[i].lon;
                state.lat[i] = result[i].lat;
            }
        },
        GETWeek(state, result) {
            state.weekData = result.data.data;
        },
        GETWeekRain(state, result) {
            var weekrain = new Array;
            for (var i = 0; i < 7; i++) {
                weekrain[i] = new Array;
                for (var j = 0; j < 238; j++) {
                    weekrain[i][j] = result[i][j].rain || 0;
                }
            }
            state.weekRain = weekrain;
        },
        GET24Temp(state, result) {
            var todayTemp_all = new Array;
            for (var i = 0; i < 237; i++) {
                todayTemp_all[i] = new Array;
                for (var j = 0; j < 25; j++) {
                    if (result[i][j]) {
                        var temp = Math.round(result[i][j].temp)
                        var h = result[i][j].h;
                        var arr = [];
                        arr[0] = h + ":00";
                        arr[1] = temp;
                        todayTemp_all[i][j] = arr;
                    }

                }
            }
            state.todayTemp = todayTemp_all;
        },
        GETMINMAX(state, result) {
            var max_all = new Array;
            var min_all = new Array;
            for (var i = 0; i < 237; i++) {
                var arr = [];
                for (var j = 0; j < 25; j++) {
                    if (result[i][j]) {
                        arr[j] = Math.round(result[i][j].temp)
                    }

                }
                max_all[i] = Math.max.apply(Math, arr);
                min_all[i] = Math.min.apply(Math, arr);
            }
            state.todayMaxTemp = max_all;
            state.todayMinTemp = min_all;
        }
    },
    getters: {
        CurrentData(state) {
            return state.currentData || {};
        }
    }
}