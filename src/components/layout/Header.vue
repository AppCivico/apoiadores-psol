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
					<a href="/" class="logo-psol">PSOL</a>
				</div>
				<ul class="menu-wrap">
					<li class="menu-item">
						<a href="#home__knowMore" v-scroll-to="'#home__knowMore'">
							Saiba Mais
						</a>
					</li>
					<li class="menu-item">
						<a href="#home__donors" v-scroll-to="'#home__donors'">
							Doadores
						</a>
					</li>
					<li class="menu-item donate-nav">
						<a href="#home__donate" v-scroll-to="'#home__donate'">
							Doar
						</a>
					</li>
				</ul>
			</div>
		</nav>
		<div class="header-container">
			<div class="site-label">
				<p>Partido Necessário</p>
				<h1>Quem financia o PSOL<span class="orange-highlight italic-text"> É você!</span></h1>
				<a class="call-to-action" href="#home__donate" v-scroll-to="'#home__donate'">
					> quero doar
				</a>
			</div>
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
					if (newOffset > 12 && window.matchMedia("").matches) {
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

