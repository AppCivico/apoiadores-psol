<template>
  <section>

	<div v-for="(message, i) in messages" :key="i" v-html="message.text"></div>
	<ul id="wrap-share">
		<li>
			<a class="twitter-hashtag-button twitter" href="https://twitter.com/intent/tweet?hashtags=FinanciePSOL&twitter&text=Ajude%20PSOL%20a%20mudar%20o%20Brasil!%20https://psol50.org.br/financie">Compartilhar</a>
		</li>
		<li>
			<a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fpsol50.org.br%2Ffinancie&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore facebook">Compartilhar</a>
		</li>
	</ul>
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
}
</script>
