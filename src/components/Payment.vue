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
	<div class="donation-form-title">
		<h2>Você escolheu doar:</h2>
		<h2 v-if="amount">R$ {{ amount | formatBRL }}</h2>
	</div>
	<a class="donation-nav donation-nav--rewind" href="#" @click.prevent="goBack()">voltar</a>

	<userData v-if="paymentStep === 'userData'"/>
	<cardData v-if="paymentStep === 'cardData'"/>
	<addressData v-if="paymentStep === 'boleto'"/>
   	<certFaceVerify v-if="paymentStep === 'certFaceVerify'"/>
	<printBoleto v-if="paymentStep === 'printBoleto'" :aria-busy="loading ? 'true' : 'false'"/>
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
		  this.toggleLoading();
		    setTimeout(() => {
            this.scroolFormDonation();
          }, 1000);
        }, (error) => {
		  console.error(error);
        });
	  }
    },
    scroolFormDonation() {
      const form = document.getElementById('donation-form');
      form.scrollIntoView();
    },
  },
  mounted() {
    this.getCertiFaceQueryString();
  },
};
</script>
