import { createStore } from "vuex";
import { backUrl, backUrl_backup } from "../../public/backURL/backurl";
import weather from "./weather";

export default createStore({
  state: {
    // devIpAddress:"http://172.21.213.44:8999",
    // devIpAddress_backup:"http://172.21.213.248:8999",
    // devBackIp:"http://172.21.213.248:8999",//wyj
    // devIpAddress:"http://172.21.213.92:8999",
    // devIpAddress_backup:"http://172.21.213.92:8999",
    // devBackIp:"http://172.21.213.92:8999",//wyj
    // devIpAddress:"/YangtzeDeltaBack",
    // devIpAddress_backup:"/YangtzeDeltaBack",
    // devBackIp:"/YangtzeDeltaBack",//wyj
    devIpAddress: backUrl,
    devIpAddress_backup: backUrl_backup,
    devBackIp: backUrl_backup,//wyj
  },
  mutations: {},
  actions: {},
  modules: { weather: weather },
  getters: {
    devIpAddress(state) {
      return state.devIpAddress
    },
    devIpAddress_backup(state) {
      return state.devIpAddress_backup
    },
    devBackIp(state) {
      return state.devBackIp
    }
  }
});
