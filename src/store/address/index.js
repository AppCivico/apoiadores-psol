import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

const state = {
  address: Object,

};
const actions = {
  getAddress: ({ commit, rootState }, cep) => new Promise((resolve, reject)=>{
				axios.get(`https://api-apoiadores.appcivico.com/cep?cep=${cep}`).then((response)=>{
				resolve(response.data)
				commit('getAddressMutation', response.data)

				}).catch((erro)=>{

					reject(erro)

				})
			}),
};
const mutations = {
  getAddressMutation: (state, payload) => {
    state.address = payload;
  },
};

export default {
  state,
  mutations,
  actions,
};
