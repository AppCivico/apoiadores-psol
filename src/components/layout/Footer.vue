<template>
  <footer class="site-footer">
    <div class="container-footer">
      <div class="site-footer__copyright">
        <div>Proporcionado por</div>
        <div class="psol">
          <a href="#home__greetings" v-scroll-to="'#home__greetings'">PSOL</a>
        </div>
        <ul>
            <li class="apoiadores"><a href="https://appcivico.com/pt/apoiadores/" target="_blank">Apoiadores</a></li>
            <li class="appcivico"><a href="https://appcivico.com/" target="_blank">AppCívico</a></li>
        </ul>
      </div>
      <p>© 2016-2018 Tecnologia <a href="https://votolegal.com.br/" target="_blank">Voto Legal</a> • Uma iniciativa <a href="https://appcivico.com/" target="_blank">AppCívico</a></p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
};
</script>

