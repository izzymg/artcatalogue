import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    catalogueItems: [
    ],
  },
  mutations: {
    add(state, payload) {
      state.catalogueItems.push(payload);
    },
    update(state, payload) {
      state.catalogueItems.forEach((item, index) => {
        if(item.id == payload.id) {
          // Replace item's ID with new payload data.
          state.catalogueItems[index] = payload;
        }
      });
    }
  },
  getters: {
    catalogueItems: state => {
      return state.catalogueItems;
    }
  }
})
