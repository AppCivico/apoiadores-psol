<template>
  <main id="conteudo">
		<article class="home__intro">
			<div class="container">
        <h2>
          Ajude o <span class="italic-text">PSOL</span> a mudar o brasil!
        </h2>

        <p>
			<span class="bigger-text">Por que financiar o PSOL?</span> Em tempos de tantos escândalos, somos um dos poucos partidos sem envolvimento em nenhuma denúncia de corrupção. Nunca recebemos dinheiro das grandes empresas e lutamos pelo fim do financiamento privado de campanhas.
		</p>
        <p>
			<span class="bigger-text">O que o PSOL quer?</span> Um país de direitos, democracia e sem desigualdades. Nossa bancada no Congresso é reconhecidamente a melhor do país, sempre atuando com independência, ética e coerência.
		</p>
        <p>
			<span class="bigger-text">O dinheiro vai ser usado para quê?</span> Para a construção aberta das propostas que vamos apresentar nessas eleições, com Guilherme Boulos e Sonia Guajajara. Serão realizados debates abertos em todo o país, com participação de especialistas - e tudo consolidado em uma plataforma na internet.
		</p>
        <p>
			<span class="bigger-text">Eu posso participar?</span> Nossa construção é coletiva, de baixo para cima. Você pode participar dos eventos de construção do programa e também participar online, debatendo e fazendo novas propostas. O nosso programa é feito de forma aberta, e só é possível com a sua participação. <span class="bigger-text">Vamos?</span>
		</p>
        <section id="campaign-progress" class="campaign-progress">
          <p>
            <span class="currency">R$</span>
            <strong class="amount">
              <template v-if="candidate.total_donated">{{ candidate.total_donated | formatBRL }}</template>
              <template v-else>0</template>
            </strong>
          </p>
		  <p class="campaign-progress-amount">Doados por {{ candidate.people_donated }} pessoas</p>

          <progress :value="candidate.total_donated" :max="expected">
            <div class="progress-bar">
              <span :style="{width: `${porcentage}%`}">
                {{ porcentage }}
              </span>
            </div>
          </progress>

          <p class="campaign-progress-porcentage">
            {{ porcentage }}% da meta de R$ {{ expected | formatBRL }}
          </p>

          <p>
            <a href="#home__donors" class="campaign-progress__link" v-scroll-to="'#home__donors'">Veja quem doou</a>
          </p>

        </section>
      </div>
    </article>

    <article id="home__donate" class="home__donate">
      <div class="container" id="donation-wrap">
        <Payment />
      </div>
    </article>

    <article id="home__knowMore" class="home__knowMore">
      <div class="container" id="donation-wrap">
        <h2>
          Saiba mais
        </h2>

        <p> <strong>Viabilizar a realização de eventos nas 5 regiões do país para a construção do programa.</strong>
		Vamos construir junto aos movimentos sociais eventos abertos para que todas e todos possam debater e propor suas ideias para o Brasil, nas mais diversas temáticas. Para isso, é necessário viabilizar a estrutura necessária para os debates, bem como o deslocamento de debatedores e a cobertura de comunicação. É o maior custo dessa proposta.
		</p>
        <p><strong>Manutenção de plataforma online para participação e mobilização.</strong>
		Nossa plataforma online será totalmente focada na participação: será possível cadastrar um grupo pequeno, em sua cidade ou bairro, para debater e construir nossa pré-campanha, realizar eventos e se articular com outros grupos e pessoas. Além disso, você poderá fazer propostas e debater as que outras pessoas estarão propondo.
		</p>

		<figure>
			<img src="../assets/images/photos/psol.jpg" alt="Boulos e Sônia do PSOL">
			<figcaption>Boulos e Sônia do PSOL</figcaption>
		</figure>

        <p> <strong>Campanha de comunicação.</strong>
		A construção de uma campanha online que fure o bloqueio da grande mídia é essencial para fazer com que essas propostas cheguem ao máximo possível de pessoas. Para isso, vamos contratar equipe qualificada em redes sociais e comprar os equipamentos necessários para transmissões ao vivo dos eventos, cobertura fotográfica e produção de conteúdos de divulgação.
		</p>
        <p><strong>Sistematização das propostas feitas.</strong>
		Durante a realização dos eventos e dos debates em nossa plataforma online, será preciso consolidar todas as propostas realizadas em eixos concretos para apresentar o programa ao país. Assim, é necessário ter pessoas dedicadas à sistematização da ampla gama de propostas e ideias surgidas, bem como viabilizar a apresentação e divulgação delas para todas e todos que participaram do processo.
		</p>




      </div>
    </article>

    <article id="home__donors" class="home__donors">
      <div class="container" id="donation-wrap">
        <h2>
          Doadores
        </h2>

        <p><strong>Essas são as pessoas que querem um país de direitos, democracia e sem desigualdades, que participaram com doações para nossa construção coletiva, de baixo para cima:</strong></p>
        <p>
          <span v-for="(person, i) in donations" :key="i">
            {{ person | titleCase }}{{ i < donations.length -1 ? ',' : '' }}
          </span>
        </p>
      </div>
    </article>

    <!-- <article id="home__faq" class="home__faq">
      <div class="container" id="donation-wrap">
        <h2>
          Doadores
        </h2>

		<ul class="faq-group">
			<li>
				<a class="faq-question" href="#0">Como faço doação?</a>
				<div class="faq-content">
					<p>Para fazer a doação...</p>
				</div>
			</li>

			<li>
				<a class="faq-question" href="#0">Meus dados estão protegidos?</a>
				<div class="faq-content">
					<p>Exemplo de resposta</p>
				</div>
			</li>
		</ul>
      </div>
    </article> -->
  </main>
</template>

<script>
// @ is an alias to /src
import Payment from '@/components/Payment.vue';

export default {
  name: 'home',
  components: {
    Payment,
  },
  mounted() {
    const candidateId = window.location.host === 'ap-psol.appcivico.com'
    ? 78
    : 136;
    this.$store.dispatch('GET_CANDIDATE_INFO', candidateId);
    this.$store.dispatch('GET_DONATIONS', candidateId);
  },
  computed: {
    candidate() {
      return this.$store.state.candidate;
    },
    donations() {
      return this.$store.state.donations;
    },
    expected() {
      if (this.candidate) {
        if (this.candidate.raising_goal) {
          return this.candidate.raising_goal;
        }
      }

      return 0
    },
    porcentage() {
      if (this.candidate) {
        const value = (this.candidate.total_donated * 100) / this.expected;
        return Math.ceil(value);
      }

      return 0
    }
  },
};
</script>
