import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    items: [
      {
        title: null,
        value: 0,
        id: 1,
      }
    ],
  },
  mutations: {
    add(state) {
      state.items.push({
        title: null,
        value: 0,
        id: state.items.length + 1,
      });
    },
    update(state, payload) {
      state.items.forEach((item, index) => {
        if(item.id == payload.id) {
          // Replace item's ID with new payload data.
          state.items[index] = payload;
        }
      });
    }
  },
  getters: {
    items: state => {
      return state.items;
    },
    item: (state) => (id) => {
      return state.items.find(item => item.id == id);
    },
  }
})
