import { createStore } from "vuex";
import { backUrl,backUrl_backup } from "../../public/backURL/backurl";

export default createStore({
  state: {
    devIpAddress:backUrl,
    devIpAddress_backup:backUrl_backup,
    devBackIp:backUrl_backup,//wyj
  },
  mutations: {},
  actions: {},
  modules: {},
  getters: {
    devIpAddress(state){
      return state.devIpAddress
    },
    devIpAddress_backup(state){
      return state.devIpAddress_backup
    },
    devBackIp(state){
      return state.devBackIp
    }
  }
});
