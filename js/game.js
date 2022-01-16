// Contient la logique du jeu

let actorId = 1136406; // Tom Holland
let actorData = null;
let movieList = [];
let submittedAnswer = [];
let currentGameTurn = 1;
let maxGameTurn = 10;
let goodAnswers = 0;
let badAnswers = 0;

/**
 * Permet de retourner la liste des films dans lequel un acteur a joué
 * @param actor_id
 * @returns {*[]}
 */
async function getListOfMovies(actor_id) {
  let movieDetails = await getActorMovieDetail(actor_id);
  movieDetails.cast.forEach(function (element) {
    movieList.push(element.title);
  });
  return movieList;
}


/**
 * Retourne true ou false suivant le fait qu'un film soit dans la liste ou non
 * @param movie
 * @param movieList
 * @returns {boolean}
 */
function isInMovieList(movie, movieList) {
  let isInMovie = movieList.includes(movie);
  submittedAnswer.push({ 'answer': movie, 'isCorrect': isInMovie});
  return isInMovie;
}

/**
 * Lance un tour de jeu
 */
function playOne() {
  if (currentGameTurn > maxGameTurn) {
    alert('Fin du jeu !');
  } else {
    currentGameTurn++;
    movie = document.getElementById('inputFilmName').value
    isInMovieList(movie, movieList) ? goodAnswers++ : badAnswers++;
    refreshDisplay();
  }
}

/**
 * Permet de lancer le jeu avec l'actor_id
 * @param actor_id
 * @returns {Promise<void>}
 */
async function playGame(actor_id) {
  actorData = await getActor(actor_id);
  displayActorCard(actorData);
  console.log(actorData);
  getListOfMovies(actor_id);
  refreshDisplay();
  $('#startButton').prop("disabled", true);
  $('#searchActorResult').html('');
  $('#inputActorName').val('');
}

function displayActorCard(actorData) {
  $('#actorPicture').attr('src', 'https://image.tmdb.org/t/p/original' + actorData.profile_path);
  $('#actorPicture').attr('alt', 'https://image.tmdb.org/t/p/original' + actorData.name);
  $('#actorName').html( actorData.name);
  $('#actorBiography').html( actorData.biography);
  $('#actorBirthday').html( actorData.birthday);
  $('#actorPlaceOfBirth').html( actorData.place_of_birth);

  $('#actorCard').show();
  $('#actorHelperText').hide();
}

function hideActorCard() {
  $('#actorCard').hide();
  $('#actorHelperText').show();
}

/**
 * Reset les variables pour commencer une nouvelle partie
 */
function endGame() {
  actorData = {};
  movieList = [];
  gameTurn = 0;
  goodAnswers = 0;
  badAnswers = 0;
  currentGameTurn = 1;
  actorData = null;
  movieList = [];
  $('#startButton').prop("disabled", false);
  $('#inputFilmName').val('');
  refreshDisplay();
  hideActorCard();
}

/**
 * Permet de rafraîchir le index.html contenant les variables changées pendant une partie
 */
function refreshDisplay() {
  $('#currentGameTurn').html(currentGameTurn);
  $('#maxGameTurn').html(maxGameTurn);
  $('#goodAnswers').html(goodAnswers);
  $('#badAnswers').html(badAnswers);
  $('#selectedActorName').html(actorData !== null ? actorData.name : '-');
  if (submittedAnswer.length > 0) {
    let currentAnswer = submittedAnswer.pop();
    if (currentAnswer.isCorrect) {
      $( '#submittedAnswer' ).append("<p class='text-success'>✓ "+ currentAnswer.answer +"</p>");
    } else {
      $( '#submittedAnswer' ).append("<p class='text-danger'>❌ "+ currentAnswer.answer +"</p>");
    }
  } else {
    $('#submittedAnswer').html('');
  }
}


/**
 * Evolution 5A - Proposer de jouer avec n'importe quel acteur
 */
async function triggerSearchPerson() {
  let response = await searchPerson($('#inputActorName').val());
  // Construction de la liste pour la la vue
  let ul = document.getElementById('searchActorResult');
  ul.innerHTML = '';
  response.results.forEach(function (person) {
    let li = document.createElement('li');
    ul.appendChild(li);

    li.innerHTML += "<a href='#' onclick='playGame(" + person.id + ")'>Lancer une partie avec " + person.name + "</a>";
  });
  console.log(response);
}
