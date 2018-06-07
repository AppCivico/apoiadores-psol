<template>
        <form @submit.prevent="validateForm" :aria-busy="loading ? 'true' : 'false'">
            <fieldset>
                <p class="instructions">Por favor, informe os seguintes dados:</p>
                <div class="form-wrapper">
                    <div :class="`input-wrapper half
                        ${validation.errors.zip_code ? 'has-error' : ''}`">
                        <label for="zip_code">{{ 'cep' | translate }}</label>
                        <input type="text" v-model="zip_code" name="zipcode" v-mask="'#####-###'" @blur="searchAddress($event)" >
                        <div class="error" v-if="validation.errors.zip_code">
                            {{ validation.errors.zip_code }}
                        </div>
                    </div>
                    <div :class="`input-wrapper half
                        ${validation.errors.city ? 'has-error' : ''}`">
                        <label for="city">{{ 'city' | translate }}</label>
                        <input type="text" v-model="city" name="city" :disabled="true">
                        <div class="error" v-if="validation.errors.city">
                            {{ validation.errors.city }}
                        </div>
                    </div>
                </div>
                <div :class="`input-wrapper
                    ${validation.errors.street ? 'has-error' : ''}`">
                    <label for="street">{{ 'street' | translate }}</label>
                    <input type="text" v-model="street" name="street" :disabled="true">
                    <div class="error" v-if="validation.errors.street">
                        {{ validation.errors.street }}
                    </div>
                </div>
                <div class="form-wrapper">
                    <div :class="`input-wrapper half
                        ${validation.errors.number ? 'has-error' : ''}`">
                        <label for="number">{{ 'number' | translate }}</label>
                        <input type="text" v-model="number" name="number" >
                        <div class="error" v-if="validation.errors.number" >
                            {{ validation.errors.number }}
                        </div>
                    </div>
                        <div :class="`input-wrapper half
                        ${validation.errors.complement ? 'has-error' : ''}`">
                        <label for="complement">{{ 'complement' | translate }}</label>
                        <input type="text" v-model="complement" name="complement" autocomplete="nope">
                        <div class="error" v-if="validation.errors.complement">
                            {{ validation.errors.complement }}
                        </div>
                    </div>
                </div>
                <div :class="`input-wrapper
                    ${validation.errors.district ? 'has-error' : ''}`">
                    <label for="district">{{ 'district' | translate }}</label>
                    <input type="text" v-model="district" name="district" :disabled="true">
                    <div class="error" v-if="validation.errors.district">
                        {{ validation.errors.district }}
                    </div>
                </div>
                <div class="form-wrapper">
                    <div :class="`input-wrapper half
                        ${validation.errors.birthdate ? 'has-error' : ''}`">
                        <label for="birthdate">{{ 'birthdate' | translate }}</label>
                        <input type="text" v-model="birthdate" name="birthdate" v-mask="'##/##/####'" v-focus>
                        <div class="error" v-if="validation.errors.birthdate">
                            {{ validation.errors.birthdate }}
                        </div>
                    </div>
                    <div :class="`input-wrapper half
                        ${validation.errors.phone ? 'has-error' : ''}`">
                        <label for="phone">{{ 'phone' | translate }}</label>
                        <input type="text" v-model="phone" name="phone" v-mask="'(##)#####-####'">
                        <div class="error" v-if="validation.errors.phone">
                            {{ validation.errors.phone }}
                        </div>
                    </div>
                </div>
                <p class="error" v-if="errorMessage != ''">
                {{ errorMessage }}
            </p>
            <button type="submit" :disabled="loading" class="donation-nav donation-nav--forward">Continuar</button>
            </fieldset>
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
	  donationFp: '',
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
    candidate() {
      return this.$store.state.candidate;
    },
    token() {
      return this.$store.state.token;
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
        this.registerUser();
      } else {
        this.validation = validation;
        this.toggleLoading();
      }
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
    scrollToForm() {
        const form = document.getElementById('doar');
        form.scrollIntoView({ block: 'start', behavior: 'smooth' });
    },

    registerUser() {
      this.getDonationFP()
        .then((response) => {
          let birthdate = this.birthdate.split('/');
          birthdate.reverse();
          birthdate = birthdate.join('-');

          const payload = {
            device_authorization_token_id: this.token,
            name: this.getUserData.name,
            donation_fp: response,

            payment_method: this.getUserData.payment_method,
            email: this.getUserData.email,
            cpf: this.getUserData.cpf,
            amount: this.getUserData.amount,
            candidate_id: this.getUserData.candidate_id,

            billing_address_zipcode: this.zip_code,
            billing_address_state: this.state,
            billing_address_city: this.city,
            billing_address_street: this.street,
            billing_address_district: this.district,
            billing_address_house_number: this.number,
            phone: this.phone.replace(/[^\d]+/g, ''),
            birthdate,
            billing_address_complement: this.complement,
		  };

		 this.$store.dispatch('SAVE_USER_DATA', payload);
          this.$store.dispatch('GET_DONATION', payload)
            .then((res) => {
              const user = {
                name: this.getUserData.name.split(' ')[0],
                surname: this.getUserData.name.split(' ')[1],
			  };
              this.$store.dispatch('SAVE_USERNAME', user);
			  if (this.getUserData.payment_method == 'boleto') {
                this.$store.dispatch('CHANGE_PAYMENT_STEP', {
                  step: 'certFaceVerify',
                });
			  } else {
				  		this.$store.dispatch('CHANGE_PAYMENT_STEP', {
                  step: 'cardData',
                });
			  }
			  this.handleIugu();
            }).catch((err) => {
			  this.toggleLoading();
 			  this.validateStep(err);
              this.handleErrorMessage(err);
            });
        }).catch((data) => {
          this.toggleLoading();
          this.errorMessage = 'Ocorreu um erro inesperado, tente novamente!';
        });
    },
    validateStep(error) {
      const errorUserData = ['cpf_invalid', 'email_invalid', 'name_invalid', 'email_domain_invalid'];
      errorUserData.map((er) => {
        if (er == error.data[0].msg_id) {
          this.$store.dispatch('CHANGE_PAYMENT_STEP', { step: 'userData', error: { message: error.data[0].message } });
        }
      });
    },
    getDonationFP() {
      return new Promise((resolve, reject) => {
        const d1 = new Date();
        const fp = new VotolegalFP({
          excludeUserAgent: true,
          dontUseFakeFontInCanvas: true,
        });
        fp.get((result, components) => {
          const d2 = new Date();
          const info = {
            ms: d2 - d1,
            id: result,
          };
          for (const index in components) {
            const obj = components[index];
            if (obj.key == 'canvas' || obj.key == 'webgl') {
              info[obj.key] = obj.value.toString().length;
            } else {
              info[obj.key] = obj.value.toString();
            }
          }
          const Base64 = {
            _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
            encode(e) {
              let t = '';
              let n,
                r,
                i,
                s,
                o,
                u,
                a;
              let f = 0;
              e = Base64._utf8_encode(e);
              while (f < e.length) {
                n = e.charCodeAt(f++);
                r = e.charCodeAt(f++);
                i = e.charCodeAt(f++);
                s = n >> 2;
                o = (n & 3) <<
										4 | r >> 4;
                u = (r & 15) <<
										2 | i >> 6;
                a = i & 63;
                if (isNaN(r)) {
                  u = a = 64;
                } else if (isNaN(i)) {
                  a = 64;
                }
                t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) +
					this._keyStr.charAt(u) + this._keyStr.charAt(a);
              }
              return t;
            },
            _utf8_encode(e) {
              e = e.replace(/rn/g, 'n');
              let t = '';
              for (let n = 0; n < e.length; n++) {
                const r = e.charCodeAt(n);
                if (r < 128) {
                  t += String.fromCharCode(r);
                } else
                if (r > 127 && r < 	2048) {
                  t += String.fromCharCode(r >> 6 | 192);
                  t += String.fromCharCode(r & 63 | 128);
                } else {
                  t += String.fromCharCode(r >> 12 | 224);
                  t += String.fromCharCode(r >> 6 & 63 | 128);
                  t += String.fromCharCode(r & 63 | 128);
                }
              }
              return t;
            },
          };
		  const donation_fp = Base64.encode(JSON.stringify(info));
          if (donation_fp) {
            this.donationFp = donation_fp;
            resolve(donation_fp);
          } else {
            reject({ errro: 'Erro in donation fp' });
          }
        });
      });
    },
  },
  mounted() {
    this.scrollToForm();
  },
};
</script>
