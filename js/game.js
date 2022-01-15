// Contient la logique du jeu

let actorId = 1136406; // Tom Holland
let actorData = {};
let movieList = [];
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
  return movieList.includes(movie);
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
    console.log(movie);
    console.log(movieList);
    isInMovieList(movie, movieList) ? goodAnswers++ : badAnswers++;
    $('#goodAnswers').html(goodAnswers);
    $('#badAnswers').html(badAnswers);
    $('#currentGameTurn').html(currentGameTurn);
  }
}

/**
 * Permet de lancer le jeu avec l'actor_id
 * @param actor_id
 * @returns {Promise<void>}
 */
async function playGame(actor_id) {
  actorData = await getActor(actor_id);
  getListOfMovies(actor_id);
  badAnswers = 0;
  $('#currentGameTurn').html(currentGameTurn);
  $('#maxGameTurn').html(maxGameTurn);
  $('#goodAnswers').html(goodAnswers);
  $('#badAnswers').html(badAnswers);
  $('#selectedActorName').html(actorData.name);

  $('#startButton').prop("disabled", true);
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
}
