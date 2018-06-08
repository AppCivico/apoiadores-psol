<template>
  <section id="final-message-payment">
    <div v-for="(message, i) in messages" :key="i" v-html="message.text"></div>
    <ul id="wrap-share">
        <li>
            <a class="twitter-hashtag-button twitter" href="https://twitter.com/intent/tweet?hashtags=FinanciePSOL&twitter&text=Ajude%20PSOL%20a%20mudar%20o%20Brasil!%20https://financie.psol50.org.br/#doar">Compartilhar</a>
        </li>
        <li>
            <a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Ffinancie.psol50.org.br%2F&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore facebook">Compartilhar</a>
        </li>
    </ul>
        <a class="donation-nav donation-nav--rewind" href="#" @click.prevent="goBack">deseja doar novamente?</a>
  </section>
</template>

<script>
export default {
  name: 'finalMessage',
  computed: {
    messages() {
      return this.$store.state.messages;
    },
  },
  methods: {
    goBack() {
      this.$store.dispatch('CHANGE_PAYMENT_STEP', { step: 'selectValue' });
    },
    scrollToForm() {
      const formScroll = document.getElementById('doar');
      formScroll.scrollIntoView({ block: 'start', behavior: 'smooth' });
    },
  },
  mounted() {
    this.scrollToForm();
  },
};
</script>
