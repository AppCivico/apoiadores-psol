<template>
		<section class="certiface-verify">
			<div v-html="messages[0].text" ></div>

			<a :href="messages[1].href" target="_blank" class="donation-nav donation-nav--forward">{{messages[1].text}}</a>

		</section>
</template>

<script>

	export default {
		name: 'certFaceVerify',
		data() {
			return {
				loading: false,
				errorMessage: '',

				validation: {
					errors: {},
				},
			};
		},
		computed: {
			username() {
				return this.$store.state.username;
			},
			messages() {
				return this.$store.state.messages;
			},
		},
		methods: {
			toggleLoading() {
				this.loading = !this.loading;
			},

			handleErrorMessage(err) {
				this.errorMessage = err.data[0].message;
			},
		},
	};
</script>
