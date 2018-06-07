/* eslint-disable no-undef, arrow-body-style, no-param-reassign, no-console, camelcase */
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import address from './store/address';

Vue.use(Vuex);

const api =
  window.location.host === 'ap-psol.appcivico.com' || window.location.host === 'financie.psol50.org.br'
    ? 'https://api.votolegal.com.br'
    : 'https://dapi.votolegal.com.br';

export default new Vuex.Store({
  modules: {
    address,
  },
  state: {
    paymentStep: 'selectValue',
    paymentStepError: '',
    amount: 0,
    token: '',
    donation: {},
    iugu: {},
    messages: [],
    username: {},
    candidate: {},
    donations: [],
    userData: {},
  },

  mutations: {
    SET_PAYMENT_STEP(state, { data }) {
	  state.paymentStep = data.step;
	  state.stepError = data.error;
    },
    SET_PAYMENT_AMOUNT(state, { data }) {
      state.amount = data.amount;
    },
    SET_USER_DATA(state, { userData }) {
      state.userData = userData;
    },
    SET_TOKEN(state, { token }) {
      state.token = token;
    },

    SET_USERNAME(state, { user }) {
      state.username = user;
    },
    SET_DONATION(state, { donation }) {
      state.donation = donation;
    },
    SET_IUGU(state, { iugu }) {
      state.iugu = iugu;
    },
    SET_MESSAGES(state, { messages }) {
      state.messages = messages;
    },
    SET_CANDIDATE(state, { res }) {
      state.candidate = res.candidate;
    },
    SET_DONATIONS(state, { res }) {
      state.donations = res.names;
    },
    SET_USER_DATA(state, {
	    	userData,
	    }) {
	    	state.userData = userData;
	    },
  },
  actions: {
    CHANGE_PAYMENT_AMOUNT({ commit }, data) {
      commit('SET_PAYMENT_STEP', { data });
      commit('SET_PAYMENT_AMOUNT', { data });
    },
	  SAVE_ADDRESS({ commit }, data) {
		  commit('SET_PAYMENT_STEP', { data });
		  commit('SET_PAYMENT_AMOUNT', { data });
	  },
    SAVE_USER_DATA({ commit }, payload) {
      commit('SET_USER_DATA', { userData: payload });
    },
    CHANGE_PAYMENT_STEP({ commit }, data) {
      commit('SET_PAYMENT_STEP', { data });
    },
    SAVE_USERNAME({ commit }, user) {
      commit('SET_USERNAME', { user });
    },
	 SAVE_USER_DATA({
	 	commit,
	 }, payload) {
	 	commit('SET_USER_DATA', {
	 		userData: payload,
	 	});
	 },
    ADD_TOKEN({ commit }, data) {
      commit('SET_TOKEN', { token: data });
    },
    GET_TOKEN({ commit }, data) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          url: `${api}/api2/device-authentication`,
          data,
        })
          .then((response) => {
            const { device_authorization_token_id } = response.data;
            commit('SET_TOKEN', { token: device_authorization_token_id });
            resolve(response);
          })
          .catch((err) => {
            console.error(err.response);
            reject(err.response);
          });
      });
    },
    GET_DONATION({ commit }, data) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          url: `${api}/api2/donations`,
          data,
        }).then((response) => {
          const { donation, ui } = response.data;
          commit('SET_DONATION', { donation });
          commit('SET_IUGU', { iugu: ui.messages[1] });
          commit('SET_MESSAGES', { messages: response.data.ui.messages });
          resolve(response);
        }).catch((err) => {
			   reject(err.response);
        });
      });
    },
    START_DONATION({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          url: `${api}/api2/donations/${state.donation.id}?device_authorization_token_id=${
            state.token
          }&credit_card_token=${payload.id}&cc_hash=${payload.cc_hash}`,
        }).then(
          (response) => {
            const data = {
              step: 'finalMessage',
            };

            commit('SET_MESSAGES', { messages: response.data.ui.messages });
            commit('SET_PAYMENT_STEP', { data });

            resolve();
          },
          (err) => {
            console.error(err.response);
            reject(err.response);
          },
        );
      });
    },
	  START_DONATION_BOLETO({
		  commit,
		  state,
	  }, payload) {
		  const tokenName = window.location.host === 'ap-psol.appcivico.com'
			  ? 'prod_apm_token'
			  : 'dev_apm_token';
		  const token = localStorage.getItem(tokenName);
		  return new Promise((resolve, reject) => {
			  axios({
				  method: 'GET',
				  headers: {
					  'Content-Type': 'application/json',
				  },
				  url: `${api}/api2/donations/${payload.donationId}?device_authorization_token_id=${token}`,
			  }).then((response) => {
				  const data = {
					  step: 'printBoleto',
				  };
				  const { donation, ui } = response.data;
				  commit('SET_DONATION', { donation });
				  commit('SET_MESSAGES', { messages: response.data.ui.messages });
				  commit('SET_PAYMENT_STEP', {
					  data,
				  });

				  resolve(response);
			  }, (error) => {
				  console.error(error.response);
				  reject(error.response);
			  });
		  });
	  },
    GET_CANDIDATE_INFO({ commit }, id) {
      return new Promise((resolve, reject) => {
        axios.get(`${api}/public-api/candidate-summary/${id}`).then(
          (response) => {
            commit('SET_CANDIDATE', { res: response.data });
            resolve();
          },
          (err) => {
            reject(err.response);
            console.error(err);
          },
        );
      });
    },
    GET_DONATIONS({ commit }, id) {
      return new Promise((resolve, reject) => {
        axios.get(`${api}/public-api/candidate-donations/${id}/donators-name`).then(
          (response) => {
            commit('SET_DONATIONS', { res: response.data });
            resolve();
          },
          (err) => {
            reject(err.response);
            console.error(err);
          },
        );
      });
    },
  },
});
