<template>
		<section v-if="messages" class="certiface-verify">
			<div class="input-wrapper" v-html="messages[0].text"></div>
			<div class="input-wrapper" v-if="messages[1]">
				<a target="_blank" class="donation-nav donation-nav--forward" @click.prevent="redirectUser(messages[1])" >{{messages[1].text}} </a>
			</div>
		</section>
</template>

<script>

	export default {
		name: 'printBoleto',
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
				return this.$store.state.messages.messages;
			},
		},
		methods: {
			toggleLoading() {
				this.loading = !this.loading;
			},
			handleErrorMessage(err) {
				this.errorMessage = err.data[0].message;
			},
			redirectUser(ui) {
				if( ui.value === "pay_with_cc" ){
					this.$router.replace(this.$route.path);
						this.$store.dispatch("CHANGE_PAYMENT_STEP", {
							step: "userData"
					});
				}else{
					sessionStorage.clear();
					window.open(ui.href)
				}
			}
		},

	};
</script>
