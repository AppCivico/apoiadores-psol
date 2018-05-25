<template>
  <section>
    <h2 v-for="(message, i) in messages" :key="i">{{ message.text }}</h2>


	<ul id="wrap-share">
		<li>
			<a class="twitter-hashtag-button twitter" href="https://twitter.com/intent/tweet?button_hashtag=PSOL">Compartilhar</a>
		</li>
		<li>
			<a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fpsol50.org.br%2Ffinancie&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore facebook">Compartilhar</a>
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
