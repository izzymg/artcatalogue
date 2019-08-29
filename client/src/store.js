import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    catalogueItems: [
      {
        title: null,
        value: 0,
        id: 1,
      }
    ],
  },
  mutations: {
    add(state) {
      state.catalogueItems.push({
        title: null,
        value: 0,
        id: state.catalogueItems.length + 1,
      });
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
    },
    item: (state) => (id) => {
      return state.catalogueItems.find(item => item.id == id);
    },
  }
})
