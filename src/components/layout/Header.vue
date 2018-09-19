<template>
  <header class="site-header">
    <nav class="skip-links">
      <ul>
        <li class="to-content"><a href="#conteudo">conteúdo</a></li>
        <li class="to-menu"><a href="#menu">menu</a></li>
      </ul>
    </nav>
    <nav class="main-menu">
      <div class="menu-container">
        <button class="mobile-button">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div class="brand-wrap">
          <a href="#home__greetings" v-scroll-to="'#home__greetings'" class="logo-psol">PSOL</a>
        </div>
        <ul class="menu-wrap">
          <li class="menu-item">
            <a href="#home__knowMore" v-scroll-to="'#home__knowMore'">
              Uso dos recursos
            </a>
          </li>
          <li class="menu-item donate-nav">
            <a href="#doar" v-scroll-to="'#doar'">
              Doar
            </a>
          </li>
        </ul>
      </div>
    </nav>
    <div id="home__greetings">
      <div class="site-label">
        <h1>Quem financia o PSOL é você</h1>
          <a class="call-to-action" href="#doar" v-scroll-to="'#doar'">
          Quero doar >
          </a>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',

  methods: {
    scrollMenu() {
      const element = document.querySelector('.main-menu');

      window.addEventListener('scroll', (e) => {
        const newOffset = window.scrollY;
        const currentRouteName = this.$route.name;
        if (newOffset > 13 && window.matchMedia("").matches) {
          element.classList.add('animate');
        } else {
          element.classList.remove('animate');
        }
      });
    },
    showMenu() {
      const element = document.querySelector('.mobile-button');
      const menu = document.querySelector('.menu-wrap');
      element.addEventListener('click', function() {
        menu.classList.toggle('show');
      })
    }
  },
  created() {
    this.$nextTick(function() {
      this.scrollMenu();
      this.showMenu();
    });
  }
}
</script>

