import Vue from "vue";
import Vuex from "vuex";

import vuexI18n from "vuex-i18n";

// The translation file could also be loaded from a separate json file
// I won't do this for now to prevent an extra ajax call
// import ptBr from '/ptBR.js';

const ptBr = {
  moneySeparator: ",",

  //donation info
  gotFromTheExpected: "Meta",
  currencyReal: "R$",
  remainingDays: "dias restantes",
  capturedMoney: "arrecadados",
  doners: "Doações recebidas",
  viewDonors: "Veja quem são",
  daysRemaining: "Dias restantes",

  //form
  donationPanel: "Painel do Doador",
  chooseDOnationValue: "Escolha o valor",
  otherValues: "Outro valor",
  forward: "Continuar",
  rewind: "Voltar",
  orService: "Ou doe serviços",
  donationService: "Participe!",
  informPersonalData: "Informe seus dados pessoais",
  chosenValue: "Valor escolhido:",
  creditCard: "Cartão de crédito",
  boleto: "Boleto bancário",
  fillName: "Nome completo",
  CPF: "Cpf",
  email: "Email",
  tel: "Telefone",
  birthDate: "Data de nascimento",
  informAddress: "Por favor, informe seu endereço",
  cep: "Cep",
  state: "Estado",
  city: "Cidade",
  street: "Endereço",
  neighborhood: "Bairro",

  //NUMBER: "Número",
  //"Complemento",
  informPaymentData: "Obrigado, agora informe os dados de pagamento",
  creditCardNumber: "Número do cartão",
  firstname: "Nome",
  lastname: "Sobrenome",
  data: "Validade",
  ccv: "cod. Segurança",
  donate: "Doar!",

  //political info
  party: "Partido",
  runingon: "Concorre pelo estado",
  number: "Número",
  summaryCandidate: "Sobre",
  politicalMovement: "Movimento",

  //tabs
  mainProjects: "Projetos prioritários",
  aboutMe: "Sobre mim",
  donations: "Transparência",
  Name: "Nome do doador:",
  BlockchainAddress: "Endereço na Blockchain:",
  Type: "Tipo:",
  Value: "Valor doado:",
  expenses: "Despesas",

  //form adress
  district: 'Bairro',
  complement: 'Complemento',
  birthdate: 'Nascimento',
  phone: 'Telefone',


};

// initialize the vuex translations using the vuex module
const translations = new Vuex.Store();

// initialize the internationalization plugin on the vue instance
Vue.use(vuexI18n.plugin, translations);

// add translations directly to the application
Vue.i18n.add("pt-BR", ptBr);

// set the start locale to use
Vue.i18n.set("pt-BR");

export default translations;
