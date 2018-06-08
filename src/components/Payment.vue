<template>
<div class="donation-form" id="donation-form">
    <template v-if="paymentStep === 'selectValue'">
        <h2>Escolha um valor para doar</h2>
        <selectValue />
    </template>
    <template v-else-if="paymentStep === 'finalMessage'">
        <finalMessage />
    </template>
    <template v-else>
    <div class="donation-form-title" v-if="paymentStep !== 'printBoleto'">
        <h2>Você escolheu doar:</h2>
        <h2 v-if="amount">R$ {{ amount | formatBRL }}</h2>
    </div>
    <a class="donation-nav donation-nav--rewind" href="#" @click.prevent="goBack()">voltar</a>
     <headSteps></headSteps>

    <userData v-if="paymentStep === 'userData'"/>
    <cardData v-if="paymentStep === 'cardData'"/>
    <addressData v-if="paymentStep === 'address'"/>
       <certFaceVerify v-if="paymentStep === 'certFaceVerify'"/>
    <printBoleto v-if="paymentStep === 'printBoleto'" :aria-busy="loading ? 'true' : 'false'"/>
        <p class="error" v-if="errorMessage != ''">
                {{ errorMessage }}
            </p>
    </template>
</div>
</template>

<script>
// @ is an alias to /src
import selectValue from '@/components/steps/selectValue.vue';
import userData from '@/components/steps/userData.vue';
import cardData from '@/components/steps/cardData.vue';
import finalMessage from '@/components/steps/finalMessage.vue';
import addressData from '@/components/steps/addressData.vue';
import certFaceVerify from '@/components/steps/certFaceVerify.vue';
import printBoleto from '@/components/steps/printBoleto.vue';
import headSteps from '@/components/steps/headSteps.vue';


export default {
  name: 'Payment',
  components: {
    selectValue,
    userData,
    cardData,
    finalMessage,
    addressData,
    certFaceVerify,
    printBoleto,
    headSteps,
  },
  data() {
      return {
          loading: false,
           errorMessage: '',
      };
  },
  computed: {
    paymentStep() {
      return this.$store.state.paymentStep;
    },
    amount() {
      return this.$store.state.amount;
    },
  },
  methods: {
    toggleLoading() {
      this.loading = !this.loading;
    },
    goBack() {
      const step = this.paymentStep === 'userData' ? 'selectValue' : 'userData';
      this.$store.dispatch('CHANGE_PAYMENT_STEP', { step });
    },
    getCertiFaceQueryString() {
      if (this.$route.query.donation_id) {
        this.toggleLoading();

        this.$store.dispatch('CHANGE_PAYMENT_STEP', { step: 'printBoleto' });
        const payload = {
          donationId: this.$route.query.donation_id,
        };
        this.$store.dispatch('START_DONATION_BOLETO', payload).then((response) => {
          if (response) {
            this.toggleLoading();
          }
		  this.scroolFormDonation();
        }, (error) => {
		  this.toggleLoading();
		  if (error && error.data[0].message) {
            this.scroolFormDonation();
          	this.errorMessage = error.data[0].message;
		  }
          console.error(error);
        });
      }
    },
    scroolFormDonation() {
	   setTimeout(() => {
        const form = document.getElementById('donation-form');
		 form.scrollIntoView();
      }, 1000);
    },
  },
  mounted() {
    this.getCertiFaceQueryString();
  },
};
</script>
