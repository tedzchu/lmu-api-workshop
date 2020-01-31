const app = document.getElementById('root');

const logo = document.createElement('img');
logo.src = 'logo.png';

const container = document.createElement('div');
container.setAttribute('class', 'container');

app.appendChild(logo);
app.appendChild(container);

function generateFilmCards(data) {
  data.forEach(movie => {
    const card = document.createElement('div');
    card.setAttribute('class', 'card');

    const h1 = document.createElement('h1');
    h1.textContent = movie.title;

    const p = document.createElement('p');
    movie.description = movie.description.substring(0, 300);
    p.textContent = `${movie.description}...`;

    container.appendChild(card);
    card.appendChild(h1);
    card.appendChild(p);
  });
}

function getFilms() {
  fetch('https://ghibliapi.herokuapp.com/films')
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    })
    .then(function(data) {
      generateFilmCards(data);
    })
    .catch(function(err) {
      console.warn('Something went wrong.', err);
    });
}

// getFilms();

async function getFilmsAsync() {
  let response = await fetch('https://ghibliapi.herokuapp.com/films');
  let data = await response.json();
  return data;
}

getFilmsAsync()
  .then(function(data) {
    generateFilmCards(data);
  });