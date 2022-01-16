// Contient la logique du jeu

let actorId = 1136406; // Par défaut - Tom Holland
let actorData = null;
let movieList = [];
let submittedAnswer = [];
let currentGameTurn = 0;
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
 * Pousse la réponse entrée dans un objet utilisé pour afficher la liste des réponses et la barre de progression
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
  if (currentGameTurn  >= maxGameTurn) {
    alert('Fin du jeu !');
  } else {
    movie = document.getElementById('inputFilmName').value
    if (movie === '') {
      alert('Vous devez entrer un titre de film!');
      return;
    }
    currentGameTurn++;
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
  getListOfMovies(actor_id);
  refreshDisplay();
  $('#startButton').prop("disabled", true);
  $('#searchActorResult').html('');
  $('#inputActorName').val('');
}

/**
 * Permet de renseigner les détails d'un acteur depuis l'objet actorData dans la vue.
 * Masque le texte indiquant qu'aucun acteur n'a été sélectionné
 * @param actorData
 */
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

/**
 * Permet de masquer les détails d'un acteur à la RAZ d'une partie.
 * Affiche également le texte indiquant qu'aucun acteur n'a été sélectionné.
 */
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
  currentGameTurn = 0;
  actorData = null;
  movieList = [];
  $('#startButton').prop("disabled", false);
  $('#inputFilmName').val('');
  $('#turnProgressBar').html('');
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
  // S'il y a une réponse...
  if (submittedAnswer.length > 0) {
    // ... on la dépile du tableau !
    let currentAnswer = submittedAnswer.pop();
    // Selon la réponse, on affiche une coche verte si elle est correcte, sinon une croix rouge.
    // On met à jour aussi la barre de progression de la partie avec la couleur correspondante.
    if (currentAnswer.isCorrect) {
      $( '#submittedAnswer' ).append("<p class='text-success'>✓ "+ currentAnswer.answer +"</p>");
      $( '#turnProgressBar' ).append("<div class='progress-bar bg-success' role='progressbar' style='width: 10%' aria-valuenow='"+ (currentGameTurn - 1) * 10 +"'aria-valuemin='0' aria-valuemax='100'></div>");
    } else {
      $( '#submittedAnswer' ).append("<p class='text-danger'>❌ "+ currentAnswer.answer +"</p>");
      $( '#turnProgressBar' ).append("<div class='progress-bar bg-danger' role='progressbar' style='width: 10%' aria-valuenow='"+ (currentGameTurn - 1) * 10 +"'aria-valuemin='0' aria-valuemax='100'></div>");

    }
  } else {
    // Pas de réponses = RAZ de la partie donc on efface le champ !
    $('#submittedAnswer').html('');
  }
}


/**
 * Evolution 5A - Proposer de jouer avec n'importe quel acteur
 */
async function triggerSearchPerson() {
  // Utilise une fonction custom pour faire une recherche de Person via l'API de TMDB
  let response = await searchPerson($('#inputActorName').val());
  // Construction de la liste pour la vue
  let ul = document.getElementById('searchActorResult');
  // Au cas où, on vide le noeud d'abord.
  ul.innerHTML = '';
  // Pour chaque résultat qui est un objet Person, on construit un élément <li />
  response.results.forEach(function (person) {
    let li = document.createElement('li');
    // Rattache l'élément au noeud <ul /> parent
    ul.appendChild(li);
    // Construit un objet <a /> avec un événement "onClick" qui lance la partie avec l'acteur sélectionné
    li.innerHTML += "<a href='#' onclick='playGame(" + person.id + ")'>Lancer une partie avec " + person.name + "</a>";
  });
}
