<template>
  <section>
    <form @submit.prevent="validateForm" :aria-busy="loading ? 'true' : 'false'">
	<ul class="payment-choices">
		<li class="payment-type">
			<input name="payment_method" id="credit_card" value="credit_card" type="radio" v-model="payment_method">
			<label for="credit_card">{{ 'creditCard' | translate }}</label>
		</li>
		<li class="payment-type">
			<input name="payment_method" id="boleto" value="boleto" type="radio" v-model="payment_method">
			<label for="boleto">{{ 'boleto' | translate  }}</label>
		</li>
	</ul>
      <fieldset>
        <div
          :class="`input-wrapper half
          ${validation.errors.name ? 'has-error' : ''}`"
        >
          <label for="name">Nome</label>
          <input
            type="text"
            name="name"
            v-model="name">
          <div class="error" v-if="validation.errors.name">
            {{ validation.errors.name }}
          </div>
        </div>

        <div
          :class="`input-wrapper half
          ${validation.errors.surname ? 'has-error' : ''}`"
        >
          <label for="surname">Sobrenome (completo)</label>
          <input
            type="text"
            name="surname"
            v-model="surname">
          <div class="error" v-if="validation.errors.surname">
            {{ validation.errors.surname }}
          </div>
        </div>

        <div
          :class="`input-wrapper
          ${validation.errors.cpf ? 'has-error' : ''}`"
        >
          <label for="cpf">CPF</label>
          <input
            type="text"
            name="cpf"
            v-model="cpf"
            v-mask="'###.###.###-##'">
          <div class="error" v-if="validation.errors.cpf">
            {{ validation.errors.cpf }}
          </div>
        </div>

        <div
          :class="`input-wrapper
          ${validation.errors.email ? 'has-error' : ''}`"
        >
          <label for="email">Email</label>
          <input
            type="email"
            name="email"
            v-model="email">
          <div class="error" v-if="validation.errors.email">
            {{ validation.errors.email }}
          </div>
        </div>
      </fieldset>
      <p class="error" v-if="errorMessage != ''">
        {{ errorMessage }}
      </p>
      <button type="submit" :disabled="loading" class="donation-nav donation-nav--forward">Continuar</button>
    </form>
  </section>
</template>

<script>
import { mask } from 'vue-the-mask';
import { validate } from '../../utilities';

export default {
  name: 'userData',
  directives: {
    mask,
  },
  data() {
    return {
      loading: false,
      errorMessage: '',
      name: '',
      surname: '',
      cpf: '',
      email: '',
	  donationFp: '',
	  payment_method: 'credit_card',
      validation: {
        errors: {},
      },
    };
  },
  computed: {
    amount() {
      return this.$store.state.amount;
    },
    iugu() {
      return this.$store.state.iugu;
    },
    token() {
      return this.$store.state.token;
    },
    candidate() {
      return this.$store.state.candidate;
    },
  },
  methods: {
    toggleLoading() {
      this.loading = !this.loading;
    },
    validateForm() {
      this.toggleLoading();

      const {
        name,
        surname,
        cpf,
        email,
      } = this;

      const fields = {
        name,
        surname,
        cpf,
        email,
      };

      const validation = validate(fields);

      if (validation.valid) {
        this.registerUser(fields);
        const nameJoin = `${this.name} ${this.surname}`
          .toUpperCase()
          .trim()
          .replace(/\s/g, '');
        const cpf = this.cpf.replace(/[^\d]+/g, '');
        sessionStorage.setItem(
          'user-donation-data',
          JSON.stringify({
            nameJoin,
            cpf,
            email: this.email,
            firstName: this.name,
            surname: this.surname,
            cpfDirty: this.cpf,
            amount: this.amount,
          }),
        );
      } else {
        this.validation = validation;
        this.toggleLoading();
      }
    },
    registerUser(data) {
      this.getDonationFP()
        .then(() => {
          const payload = {
            payment_method: this.payment_method,
            device_authorization_token_id: this.token,
            email: data.email,
            cpf: data.cpf,
            name: `${data.name} ${data.surname}`,
            amount: this.amount,
            candidate_id: this.candidate.id,
            donation_fp: this.donationFp,
		  };

		 this.$store.dispatch('SAVE_USER_DATA', payload);
          this.$store.dispatch('GET_DONATION', payload)
            .then((res) => {
              const user = {
                name: data.name,
                surname: data.surname,
              };
              this.$store.dispatch('SAVE_USERNAME', user);
              this.handleIugu();
              this.$store.dispatch('CHANGE_PAYMENT_STEP', { step: 'address' });
            //   this.$store.dispatch('CHANGE_PAYMENT_STEP', { step: 'cardData' });
            }).catch((err) => {
              if (err.data[0].msg_id == 'need_billing_adddress') {
                this.$store.dispatch('CHANGE_PAYMENT_STEP', {
                  step: 'address',
                });
                return;
              }
              this.toggleLoading();
              this.handleErrorMessage(err);
            });
        }).catch(() => {
          this.toggleLoading();
          this.errorMessage = 'Ocorreu um erro inesperado, tente novamente!';
        });
    },
    handleErrorMessage(err) {
      this.errorMessage = err.data[0].message;
    },
    controlSession() {
	  const dataSession = JSON.parse(sessionStorage.getItem('user-donation-data'));
      if (dataSession != null) {
        const data = {
          amount: dataSession.amount,
          step: 'userData',
        };
        this.$store.dispatch('CHANGE_PAYMENT_AMOUNT', data);
        this.name = dataSession.firstName;
        this.surname = dataSession.surname;
        this.cpf = dataSession.cpf;
        this.email = dataSession.email;
      }
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
                o = (n & 3) << 4 | r >> 4;
                u = (r & 15) << 2 | i >> 6;
                a = i & 63;
                if (isNaN(r)) {
                  u = a = 64;
                } else if (isNaN(i)) {
                  a = 64;
                }
                t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
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
                } else if (r > 127 && r < 2048) {
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
            resolve();
          } else {
            reject();
          }
        });
      });
    },
    handleIugu() {
      Iugu.setAccountID(this.iugu.account_id);
      Iugu.setTestMode(this.iugu.is_testing === 1);
    },
  },
  mounted() {
    this.controlSession();
  },
};
</script>
