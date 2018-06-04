<template>
  <footer class="site-footer">
    <div class="container">
      <div class="psol">
		  <a href="#home__greetings" v-scroll-to="'#home__greetings'">PSOL</a>
      </div>
      <div class="site-footer__copyright">
        <div>Proporcionado por</div>
        <ul>
          <li class="apoiadores"><a href="https://appcivico.com/pt/apoiadores/" target="_blank">Apoiadores</a></li>
          <li class="appcivico"><a href="https://appcivico.com/" target="_blank">AppCívico</a></li>
        </ul>
        <p>© 2016-2018 Tecnologia <a href="https://votolegal.com.br/" target="_blank">VotoLegal</a> • Uma iniciativa <a href="https://appcivico.com/" target="_blank">AppCívico</a></p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
}
</script>

