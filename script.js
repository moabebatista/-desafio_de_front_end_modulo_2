let pagina = 1;
const endPointGeral = 'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false'

async function cardsDeFilmes(itemInicial, itemFinal, endpoint) {
  const movies = document.querySelector('.movies');

  const arrayDeFilmes = await (await fetch(endpoint)).json()

  for (let i = itemInicial; i < itemFinal; i++) {
    const movie = arrayDeFilmes.results[i];
    const movie_div = document.createElement('div');

    movie_div.classList.add('movie');
    movie_div.style.backgroundImage = `url('${movie.poster_path}')`;

    movie_div.addEventListener('click', () => {
      const modal_div = document.querySelector('.modal');

      modal_div.classList.remove('hidden');

      AbrirModal(movie.id);
    })

    const info = document.createElement('div');
    info.classList.add('movie__info');

    const title = document.createElement('span');
    title.classList.add('movie__title');
    title.textContent = movie.title;

    const rating = document.createElement('span');
    rating.classList.add('movie__rating');
    rating.textContent = movie.vote_average;

    const img = document.createElement('img');
    img.src = './assets/estrela.svg';

    movie_div.append(info);
    info.append(title, rating);
    rating.append(img);

    movies.append(movie_div);
  }
  pagina++
}

function limparFilmes() {
  const movieDivs = document.querySelectorAll('.movie');

  movieDivs.forEach((div) => {
    div.remove();
  })
}

filmeDoDia();

cardsDeFilmes(0, 5, endPointGeral);

const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');

btnNext.addEventListener('click', (event) => {
  limparFilmes();

  if (pagina === 2) {
    cardsDeFilmes(5, 10, endPointGeral);
  }

  if (pagina === 3) {
    cardsDeFilmes(10, 15, endPointGeral);
  }

  if (pagina === 4) {
    cardsDeFilmes(15, 20, endPointGeral);
  }

  if (pagina === 5) {
    cardsDeFilmes(0, 5, endPointGeral);
    pagina = 1;
  }
})

btnPrev.addEventListener('click', (event) => {
  limparFilmes()

  if (pagina === 2) {
    cardsDeFilmes(15, 20, endPointGeral);
  }

  if (pagina === 3) {
    cardsDeFilmes(10, 15, endPointGeral);
  }

  if (pagina === 4) {
    cardsDeFilmes(5, 10, endPointGeral)
  }

  if (pagina === 5) {
    cardsDeFilmes(0, 5, endPointGeral)
    pagina = 1;
  }
})

const movie = document.querySelector('.movie');
const modal = document.querySelector('.modal');

async function AbrirModal(id) {
  const endPointModal = await (await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`)).json();

  const modal__title = document.querySelector('.modal__title');
  const modal__img = document.querySelector('.modal__img');
  const modal__description = document.querySelector('.modal__description');
  const modal__average = document.querySelector('.modal__average');

  modal__title.textContent = endPointModal.title;
  modal__img.src = endPointModal.backdrop_path;
  modal__description.textContent = endPointModal.overview;
  modal__average.textContent = endPointModal.vote_average;

  const genresDiv = document.querySelector('.modal__genres');

  const genresArray = endPointModal.genres;
  for (let i = 0; i < genresArray.length; i++) {
    const genre = document.createElement('span');
    genre.classList.add('modal__genre');
    genre.textContent = genresArray[i].name;
    genresDiv.append(genre);

    const modalClose = document.querySelector('.modal__close');
    const modal_div = document.querySelector('.modal');

    modalClose.addEventListener('click', function () {
      modal_div.classList.add('hidden');
      genre.remove();
    })

    modal_div.addEventListener('click', () => {
      modal_div.classList.add('hidden')
      genre.remove();
    })
  }
}

function mesDeLancamento (mes) {
  switch (mes) {
    case 0:
    mes = 'Janeiro';
    break;
    case 1:
    mes = 'Fevereiro';
    break;
    case 2:
    mes = 'Março';
    break;
    case 3:
    mes = 'Abril';
    break;
    case 4:
    mes = 'Maio';
    break;
    case 5:
    mes = 'Junho';
    break;
    case 6:
    mes = 'Julho';
    break;
    case 7:
    mes = 'Agosto';
    break;
    case 8:
    mes = 'Setembro';
    break;
    case 9:
    mes = 'Outubro';
    break;
    case 10:
    mes = 'Novembro';
    break;
    case 11:
    mes = 'Dezembro';
    break;
  }
  return mes;
}

async function filmeDoDia() {
  const highlight__video = document.querySelector('.highlight__video');
  const highlight__title = document.querySelector('.highlight__title');
  const highlight__rating = document.querySelector('.highlight__rating');
  const highlight__genres = document.querySelector('.highlight__genres');
  const highlight__launch = document.querySelector('.highlight__launch');
  const highlight__description = document.querySelector('.highlight__description',);
  const highlight__video_link = document.querySelector('.highlight__video-link');

  const endPointGeral = await (await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR')).json();
  const endPointDeVideo = await (await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR')).json();

  highlight__video.style.backgroundImage = `url('${endPointGeral.backdrop_path}')`;
  highlight__title.textContent = endPointGeral.title;
  highlight__rating.textContent = endPointGeral.vote_average;
  let genres = "";
  for (let i = 0; i < endPointGeral.genres.length; i++) {
    highlight__genres.textContent += i > 0 ? `, ${endPointGeral.genres[i].name}` : endPointGeral.genres[i].name;
  }
  const dataFilme = new Date(endPointGeral.release_date);
  let filmeDoMes = mesDeLancamento(dataFilme.getMonth());
  highlight__launch.textContent = `${dataFilme.getDate()} de ${filmeDoMes} de ${dataFilme.getFullYear()}`

  highlight__description.textContent = endPointGeral.overview;
  highlight__video_link.href = `https://www.youtube.com/watch?v=${endPointDeVideo.results[0].key}`;
}

const pesquisar = document.querySelector('.input');

pesquisar.addEventListener('keydown', async function (event) {
  const busca = `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${pesquisar.value}`;

  if (pesquisar.value === '' || event.key !== 'Enter') {
    limparFilmes();

    cardsDeFilmes(0, 5, endPointGeral);
    pagina = 0;
    return
  }

  limparFilmes();
  cardsDeFilmes(0, 5, busca);
  pesquisar.value = '';
})

const body = document.querySelector('body');
const rulliTheme = document.querySelector('.btn-theme');

rulliTheme.addEventListener('click', function () {
  rulliTheme.src = (rulliTheme.src).includes('light-mode.svg') ? './assets/dark-mode.svg' : './assets/light-mode.svg';
  btnPrev.src = (rulliTheme.src).includes('light-mode.svg') ? './assets/seta-esquerda-preta.svg' : './assets/seta-esquerda-branca.svg';
  btnNext.src = (rulliTheme.src).includes('light-mode.svg') ? './assets/seta-direita-preta.svg' : './assets/seta-direita-branca.svg';

  const newBackgroundBody = body.style.getPropertyValue('--background-color') === 'rgb(26, 24, 24)' ? '#FFF' : 'rgb(26, 24, 24)';
  const newColorBody = body.style.getPropertyValue('--color') === '#FFF' ? '#000' : '#FFF';
  const newHighlightBackground = body.style.getPropertyValue('--highlight-background') === 'rgba(39, 38, 38, 0.7)' ? '#FFF' : 'rgba(39, 38, 38, 0.7)';
  const newHighlightColor = body.style.getPropertyValue('--highlight-color') === '#FFF' ? '#000' : '#FFF';
  const newHighlightDescription = body.style.getPropertyValue('--highlight-description') === '#FFF' ? '#000' : '#FFF';
  const newShadowColor = body.style.getPropertyValue('--shadow-color') === '0px 4px 8px rgba(245, 229, 229, 0.15)' ? '0px 4px 8px rgba(0, 0, 0, 0.15)' : '0px 4px 8px rgba(245, 229, 229, 0.15)';


  body.style.setProperty('--background-color', newBackgroundBody);
  body.style.setProperty('--color', newColorBody);
  body.style.setProperty('--highlight-background', newHighlightBackground);
  body.style.setProperty('--highlight-color', newHighlightColor);
  body.style.setProperty('--highlight-description', newHighlightDescription);
  body.style.setProperty('--shadow-color', newShadowColor);
});