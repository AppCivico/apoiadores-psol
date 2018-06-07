<template>

	<div >
		<ul class="head-steps">
			<li :class="paymentStep === 'userData' ? 'active' : ''">
				Escolha a forma de pagamento
			</li>
			<li :class="paymentStep === 'cardData' ? 'active' : ''">
				Dados de cartão de crédito
			</li>
			<li :class="paymentStep === 'boleto' ? 'active' : ''">
				Endereço
			</li>
			<li :class="paymentStep === 'certFaceVerify' ? 'active' : ''">
				Verificação de segurança
			</li>
			<li :class="paymentStep === 'printBoleto' ? 'active' : ''">
				Boleto
			</li>
		</ul>
	</div>
</template>

<script>
export default {
  name: 'headSteps',
  computed: {
    paymentStep() {
      return this.$store.state.paymentStep;
    },
    amount() {
      return this.$store.state.amount;
    },
  },
  methods: {
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

