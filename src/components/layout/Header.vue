<template>
	<header class="site-header">
	<nav class="skip-links">
		<ul>
		<li class="to-content"><a href="#conteudo">conteúdo</a></li>
		<li class="to-menu"><a href="#menu">menu</a></li>
		</ul>
	</nav>
	<div class="header-container">
		<nav class="main-menu">
		<div class="logo-psol">
			<a href="/" target="_blank">PSOL</a>
		</div>
		<ul>
			<li>
				<a href="#home__knowMore" v-scroll-to="'#home__knowMore'">
					Saiba Mais
				</a>
			</li>
			<li>
				<a href="#home__donors" v-scroll-to="'#home__donors'">
					Doadores
				</a>
			</li>
			<li class="donate-nav">
				<a href="#home__donate" v-scroll-to="'#home__donate'">
					Doar
				</a>
			</li>
		</ul>
		</nav>
		<div class="site-label">
			<p>Partido Necessário</p>
			<h1>Quem financia o PSOL<span class="orange-highlight italic-text"> É você!</span></h1>
			<a class="call-to-action" href="#home__donate" v-scroll-to="'#home__donate'">
				> quero doar
			</a>
		</div>
	</div>
	</header>
</template>

<script>
export default {
name: 'Header',
}
</script>

