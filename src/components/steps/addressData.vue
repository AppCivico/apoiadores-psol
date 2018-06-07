<template>
		<form @submit.prevent="validateForm" :aria-busy="loading ? 'true' : 'false'">
			<fieldset>
				<div :class="`input-wrapper
					${validation.errors.birthdate ? 'has-error' : ''}`">
					<label for="birthdate">{{ 'Data de nascimento'  }}</label>
					<input type="text" v-model="birthdate" name="birthdate" v-mask="'##/##/####'" v-focus>
					<div class="error" v-if="validation.errors.birthdate">
						{{ validation.errors.birthdate }}
					</div>
				</div>
				<div :class="`input-wrapper
					${validation.errors.phone ? 'has-error' : ''}`">
					<label for="phone">{{ 'Telefone' }}</label>
					<input type="text" v-model="phone" name="phone" v-mask="'(##)#####-####'">
					<div class="error" v-if="validation.errors.phone">
						{{ validation.errors.phone }}
					</div>
				</div>
				<div :class="`input-wrapper
					${validation.errors.zip_code ? 'has-error' : ''}`">
					<label for="zip_code">{{ 'Cep'  }}</label>
					<input type="text" v-model="zip_code" name="zipcode" v-mask="'#####-###'" @blur="searchAddress($event)" >
					<div class="error" v-if="validation.errors.zip_code">
						{{ validation.errors.zip_code }}
					</div>
				</div>
				<div :class="`input-wrapper
					${validation.errors.city ? 'has-error' : ''}`">
					<label for="city">{{ 'Cidade'  }}</label>
					<input type="text" v-model="city" name="city" :disabled="true">
					<div class="error" v-if="validation.errors.city">
						{{ validation.errors.city }}
					</div>
				</div>
				<div :class="`input-wrapper
					${validation.errors.street ? 'has-error' : ''}`">
					<label for="street">{{ 'Rua'  }}</label>
					<input type="text" v-model="street" name="street" :disabled="true">
					<div class="error" v-if="validation.errors.street">
						{{ validation.errors.street }}
					</div>
				</div>
				<div :class="`input-wrapper
					${validation.errors.district ? 'has-error' : ''}`">
					<label for="district">{{ 'Bairro'  }}</label>
					<input type="text" v-model="district" name="district" :disabled="true">
					<div class="error" v-if="validation.errors.district">
						{{ validation.errors.district }}
					</div>
				</div>
				<div :class="`input-wrapper
					${validation.errors.number ? 'has-error' : ''}`">
					<label for="number">{{ 'Número'  }}</label>
					<input type="text" v-model="number" name="number" >
					<div class="error" v-if="validation.errors.number" >
						{{ validation.errors.number }}
					</div>
				</div>
					<div :class="`input-wrapper
					${validation.errors.complement ? 'has-error' : ''}`">
					<label for="complement">{{ 'Complemento' }}</label>
					<input type="text" v-model="complement" name="complement" autocomplete="nope">
					<div class="error" v-if="validation.errors.complement">
						{{ validation.errors.complement }}
					</div>
				</div>
			</fieldset>
				<p class="error" v-if="errorMessage != ''">
				{{ errorMessage }}
			</p>
			<button type="submit" :disabled="loading" class="donation-nav donation-nav--forward">Continuar</button>
		</form>
</template>

<script>
import { mask } from 'vue-the-mask';
import {
  validate,
  removeAccented,
} from '../../utilities';

export default {
  name: 'adressData',
  directives: {
    mask,
  },
  data() {
    return {
      loading: false,
      errorMessage: '',

      zip_code: '',
      state: '',
      city: '',
      street: '',
      district: '',
      number: '',
      complement: '',
      phone: '',
      birthdate: '',

      validation: {
        errors: {},
      },
    };
  },
  computed: {
    username() {
      return this.$store.state.username;
    },
    iugu() {
      return this.$store.state.iugu;
    },
    getUserData() {
      return this.$store.state.userData;
    },
  },
  methods: {
    toggleLoading() {
      this.loading = !this.loading;
    },
    validateForm() {
      this.toggleLoading();
      let birthdate = this.birthdate.split('/');
				 birthdate.reverse();
				 birthdate = birthdate.join('-');

      const address = {
        zip_code: this.zip_code,
        state: this.state,
        city: this.city,
        street: this.street,
        district: this.district,
        number: this.number,
        phone: this.phone.replace(/[^\d]+/g, ''),
        birthdate,
      };

      const validation = validate(address);

      if (validation.valid) {
        this.saveAddress();
      } else {
        this.validation = validation;
        this.toggleLoading();
      }
    },
    saveAddress() {
      let birthdate = this.birthdate.split('/');
      birthdate.reverse();
      birthdate = birthdate.join('-');

      const payload = {
        billing_address_zipcode: this.zip_code,
        billing_address_state: this.state,
        billing_address_city: this.city,
        billing_address_street: this.street,
        billing_address_district: this.district,
        billing_address_house_number: this.number,
        phone: this.phone.replace(/[^\d]+/g, ''),
        birthdate,
        billing_address_complement: this.complement,

        payment_method: this.getUserData.payment_method,
        device_authorization_token_id: this.getUserData.device_authorization_token_id,
        email: this.getUserData.email,
        cpf: this.getUserData.cpf,
        name: this.getUserData.name,
        amount: this.getUserData.amount,
        candidate_id: this.getUserData.candidate_id,
        donation_fp: this.getUserData.donation_fp,
	  };


      this.$store.dispatch('GET_DONATION', payload)
        .then((res) => {
				 this.handleIugu();
				 this.$store.dispatch('CHANGE_PAYMENT_STEP', { step: 'cardData' });
        })
        .catch((err) => {
          this.toggleLoading();
          this.handleErrorMessage(err);
        });
    },
    searchAddress(event) {
      this.toggleLoading();
      this.$store.dispatch('getAddress', event.target.value).then((response) => {
        this.state = (response.state == '') ? this.disableField('state') : response.state;
        this.city = (response.city == '') ? this.disableField('city') : response.city;
        this.street = (response.street == '') ? this.disableField('street') : response.street;
        this.district = (response.district == '') ? this.disableField('district') : response.district;
        this.toggleLoading();
      }).catch((erro) => {
        this.toggleLoading();
        this.errorMessage = 'Cep não encontrado';
      });
    },
    disableField(field) {
      this.$nextTick(() => {
        const element = document.getElementsByName(field);
        element[0].disabled = false;
        return '';
      });
    },
	  handleIugu() {
      Iugu.setAccountID(this.iugu.account_id);
      Iugu.setTestMode(this.iugu.is_testing === 1);
    },
    handleErrorMessage(err) {
      this.errorMessage = err.data[0].message;
    },
  },
};
</script>
