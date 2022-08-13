import { createStore } from "vuex";

export default createStore({
  state: {
    devIpAddress:"http://172.21.213.44:8999",
    devBackIp:"http://172.21.213.248:8999",//wyj
  },
  mutations: {},
  actions: {},
  modules: {},
  getters: {
    devIpAddress(state){
      return state.devIpAddress
    },
  }
});
