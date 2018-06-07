<template>
  <section>
    <form @submit.prevent="validateForm" :aria-busy="loading ? 'true' : 'false'">
      <fieldset>
        <div :class="`input-wrapper
          ${validation.errors.number ? 'has-error' : ''}`">
          <label for="number">Número do cartão de crédito</label>
          <input
            type="text"
            v-model="number"
            name="number"
            v-mask="'#### #### #### ####'" v-focus>
          <div class="error" v-if="validation.errors.number">
            {{ validation.errors.number }}
          </div>
        </div>
        <div :class="`input-wrapper
          ${validation.errors.validity_month ? 'has-error' : ''}`">
          <label for="validity_month">Mês</label>
          <input
            type="text"
            v-model="validity_month"
            name="validity_month"
            placeholder="MM"
            v-mask="'##'">
          <div class="error" v-if="validation.errors.validity_month">
            {{ validation.errors.validity_month }}
          </div>
        </div>
        <div :class="`input-wrapper
          ${validation.errors.validity_year ? 'has-error' : ''}`">
          <label for="validity_year">Ano</label>
          <input
            type="text"
            v-model="validity_year"
            name="validity_year"
            placeholder="AAAA"
            v-mask="'####'">
          <div class="error" v-if="validation.errors.validity_year">
            {{ validation.errors.validity_year }}
          </div>
        </div>
        <div :class="`input-wrapper
          ${validation.errors.csc ? 'has-error' : ''}`">
          <label for="csc">Cód. Segurança</label>
          <input
            type="text"
            v-model="csc"
            name="csc"
            maxlength="4">
          <div class="error" v-if="validation.errors.csc">
            {{ validation.errors.csc }}
          </div>
        </div>
      <p class="error" v-if="errorMessage != ''">
        {{ errorMessage }}
      </p>
      <p class="form__disclaimer">Será enviado um recibo em seu e-mail com todos os dados sobre a doação.<br> Não armazenamos seus dados de cartão de crédito.</p>
      <button class="donation-nav donation-nav--forward" type="submit" :disabled="loading">Continuar</button>
      </fieldset>
    </form>
  </section>
</template>

<script>
/* eslint-disable camelcase */
import creditCardType from 'credit-card-type';
import { mask } from 'vue-the-mask';
import { validate, removeAccented } from '../../utilities';

export default {
  name: 'cardData',
  directives: {
    mask,
  },
  data() {
    return {
      loading: false,
      errorMessage: '',
      csc: '',
      number: '',
      validity_month: '',
      validity_year: '',
      brand: '',
      validation: {
        errors: {},
      },
    };
  },
  computed: {
    username() {
      return this.$store.state.username;
    },
  },
  methods: {
    toggleLoading() {
      this.loading = !this.loading;
    },
    validateForm() {
      this.toggleLoading();

      const {
        csc,
        number,
        validity_year,
        validity_month,
      } = this;

      const fields = {
        csc,
        number,
        validity_year,
        validity_month,
      };

      const validation = validate(fields);

      if (validation.valid) {
        fields.brand = this.getBrand(number);

        this.saveCard({
          name: removeAccented(name),
          csc,
          number: number.replace(/\s+/g, ''),
          validity_year,
          validity_month,
        });
      } else {
        this.validation = validation;
        this.toggleLoading();
      }
    },
    getBrand(number) {
      const result = creditCardType(number);
      if (result.length < 1) {
        return 'No brand found';
      }

      return result[0].type.replace('-', '');
    },
    saveCard(card) {
	  const cc_hash = this.getCardHash(card.number);
	 const dataSession = JSON.parse(sessionStorage.getItem('user-donation-data'));
      const cc = Iugu.CreditCard(
        card.number,
        card.validity_month,
        card.validity_year,
        dataSession.firstName,
        dataSession.surname,
        card.csc,
      );

      Iugu.createPaymentToken(cc, (response) => {
        if (response.errors) {
          this.toggleLoading();
          this.errorMessage = 'Erro nos dados do cartão';
        } else {
          const payload = {
            cc_hash,
            id: response.id,
          };
          this.$store.dispatch('START_DONATION', payload).then(() => {
            sessionStorage.clear();
		  }).catch((err) => {
            this.toggleLoading();
            this.handleErrorMessage(err);
          });
        }
      });
    },
    handleErrorMessage(err) {
      this.errorMessage = err.data[0].message;
    },
    getCardHash(number) {
      const fp = new VotolegalFP({
        excludeUserAgent: true,
        dontUseFakeFontInCanvas: true,
      });

      const hash = fp.x64hash128(number, 31);
      return hash;
	},
    scrollToForm() {
        const form = document.getElementById('doar');
        form.scrollIntoView({ block: 'end', behavior: 'smooth' });
    },
  },
  mounted() {
    this.scrollToForm();
  },
};
</script>
