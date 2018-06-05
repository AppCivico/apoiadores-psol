<template>
  <div id="app">
    <Header />
    <div class="content-container">
      <router-view/>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
  },
  mounted() {
    this.handleSession();
  },
  methods: {
    handleSession() {
      if(window.localStorage) {
        const tokenName = window.location.host === 'ap-psol.appcivico.com' || window.location.host === 'financie.psol.org.br'
						? 'prod_apm_token'
						: 'dev_apm_token';
        const token = localStorage.getItem(tokenName);
        if (token !== null) {
          this.$store.dispatch('ADD_TOKEN', token);
        } else {
          this.$store.dispatch('GET_TOKEN')
            .then((res) => {
              localStorage.setItem(tokenName, res.data.device_authorization_token_id);
            });
        }
      }
    }
  }
}
</script>


<style src="./stylesheets/index.scss" lang="scss"></style>
