import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations.js'
import actions from './actions.js'
var configs = require('../configs/config.json');

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appTitle: process.env.VUE_APP_TITLE,
    apiUrl: configs.apiUrl,
    timeIncrement: 0,
    timeRangeSince: "",
    timeRangeUntil: ""
  },
  mutations: mutations,
  actions: actions,
})
