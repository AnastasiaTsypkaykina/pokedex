let offset = 0;
let maxPokemon = 24;
let allPokemons = [];
let filtredPokemons = [];
let searchPokes = [];
let allFetchedPokemons = [];
let isLoading = false;
let lastSelect;

function resetVariables() {
  maxPokemon = 24;
  allPokemons = [];
  searchPokes = [];
  isLoading = false;
  content.innerHTML = "";
}

async function init(load) {
  isLoading = true;
  maxPokemon += load || 0; // Wenn load = null -> 0
  let pokemons = await fetchAllPokemons();
  allFetchedPokemons = await fetchAllPokemons(true);
  await loadPokemonArray(pokemons);
  showLoadAnimation(false);
  isLoading = false;
}

async function fetchAllPokemons(allPokemonsLoaded) {
  let urlAtt;
  if (allPokemonsLoaded) {
    urlAtt = `?offset=${offset}&limit=200`;
  } else 
    urlAtt = `?offset=${offset}&limit=${maxPokemon}`;

  let urlApi = "https://pokeapi.co/api/v2/pokemon";
  let url = `${urlApi}${urlAtt}`;
  let response = await fetch(url);
  let respJson = await response.json();
  return await respJson.results;
}

async function fetchPokemon(url) {
  const URL = url;
  let response = await fetch(URL);
  let respJson = await response.json();
  return respJson;
}

async function loadSpeciesJson(id) {
  let species = fetchPokemon(
    `https://pokeapi.co/api/v2/pokemon-species/${id + 1}/`
  );
  return species;
}

async function loadPokemonArray(pokemons) {
  for (let i = allPokemons.length; i < pokemons.length; i++) {
    const pokemon = pokemons[i];
    let response = await fetch(pokemon.url);
    let respJson = await response.json();
    allPokemons.push(respJson);
    renderAllPokemons(i);
  }
}

async function renderAllPokemons(id) {
  content.innerHTML += pokeCardTemp(allPokemons[id], id);
  renderTypes(id);
  showLoadAnimation(true);
  isLoaded = true;
}

async function showStats(id) {
  let infos = document.getElementById("infos");
  infos.innerHTML = "";
  openPokemonOverlay(id);
}

function renderTypes(id) {
  for (let i = 0; i < allPokemons[id].types.length; i++) {
    let pokeTypes = document.getElementById(`pokeTypes${id}`);
    pokeTypes.innerHTML += pokeTypeTemp(allPokemons[id], i);
    changeBadgeColor(id, i);
  }
  changeCardColor(id, 0);
}

async function showMoves(id) {
  let infos = document.getElementById("infos");
  let pokemon = await fetchPokemon(allFetchedPokemons[id].url);
  infos.innerHTML = "";
  infos.innerHTML = pokeInfoMovesTemp(pokemon);
  renderMoves(id, pokemon);
}

function renderMoves(id, pokemon) {
  let allMovesBox = document.getElementById("allMoves");
  for (let i = 0; i < pokemon.moves.length && i < 40; i++) {
    const element = pokemon.moves[i].move.name;
    allMovesBox.innerHTML += `<div class="moveBadges">${element}</div>`;
  }
}

function changeCardColor(id, i) {
  let type = allPokemons[id].types[i].type.name;
  let pokeCard = document.getElementById(`pokeCard${id}`);
  pokeCard.classList.add(`${type}-box`);
}

function changeBadgeColor(id, i) {
  let type = allPokemons[id].types[i].type.name;
  let pokemon = allPokemons[id];
  let badge = document.getElementById(`badge${pokemon.name}${i}`);
  badge.classList.add(`${type}-badge`);
}

function changeOverlayColor(id, pokemon) {
  let type = pokemon.types[0].type.name;
  let currentBox = document.getElementById("currentBox");
  currentBox.classList.add(`${type}-box`);
}

function closeOverlay() {
  const overlay = document.getElementById("overlay");
  document.body.classList.remove("overflow-hidden");
  overlay.classList.add("d-none");
}

function dontClose(event) {
  event.stopPropagation();
}

async function openPokemonOverlay(id, bool) {
  const overlay = document.getElementById("overlay");
  document.body.classList.add("overflow-hidden");
  let pokemon = await fetchPokemon(allFetchedPokemons[id].url);
  let species = await loadSpeciesJson(id);
  overlay.classList.remove("d-none");
  overlay.innerHTML = "";
  overlay.innerHTML = currentPokemonTemp(pokemon, id, species);
  changeOverlayColor(id, pokemon);
  showChartStats(pokemon);
}

function openNext(id) {
  openPokemonOverlay(id);
}

function openPrev(id) {
  if (id == 1) {
    openPokemonOverlay(allPokemons.length);
  } else {
    openPokemonOverlay(id - 2);
  }
}

window.onscroll = async () => {
  if (
    window.innerHeight + window.scrollY - 95 >= document.body.offsetHeight &&
    !isLoading
  ) {
    await init(40);
  }
};

function showLoadAnimation(bool) {
  let loadAnimation = document.getElementById("loadAnimation");
  let mainContainer = document.querySelector(".mainContainer");
  if (bool) {
    loadAnimation.classList.remove("d-none");    
  }
  if (!bool) {
    loadAnimation.classList.add("d-none");    
    content.style.paddingRight = "0px";
  }
}

function searchPokemon(search) {
  search = search.toLowerCase();
  foundPokes = [];
  isLoading = true;
  for (let i = 0; i < allFetchedPokemons.length; i++) {
    const element = allFetchedPokemons[i];
    if (element.name.includes(search)) {
      foundPokes.push(element);
    } else {
      infoIfNotFound();
    }
  }
}

function infoIfNotFound() {
  let contentRef = document.getElementById("content");
  contentRef.innerHTML = "";
  contentRef.innerHTML = `<p>No pokemon found!</p>`;
}

function infoNotRightCriteria() {
  let contentRef = document.getElementById("content");
  contentRef.innerHTML = "";
  contentRef.innerHTML = `<p> Write more characters to search, at least 3 characters needed!</p>`;
}

async function filterPokemons() {
  let search = document.getElementById("search").value;
  if (search.length == 0) {
    init(0);
    resetVariables();
    return;
  } else if (search.length < 3) {
    infoNotRightCriteria();
  } else {
    searchPokemon(search);
    await loadPokemonSearch(foundPokes);
  }
}

async function loadPokemonSearch(pokemons) {
  foundPokes = [];
  for (let i = 0; i < 10; i++) {
    const pokemon = pokemons[i];
    try {
      let response = await fetch(pokemon.url);
      let respJson = await response.json();
      foundPokes.push(respJson);
      renderSearchPokemon(foundPokes);
    } catch (e) {}
  }
}

function renderSearchPokemon(pokemon) {
  content.innerHTML = "";
  for (let i = 0; i < pokemon.length; i++) {
    content.innerHTML += pokeCardTemp(pokemon[i], i);
    renderSearchTypes(pokemon, i);
  }
}

function renderSearchTypes(pokemon, id) {
  for (let i = 0; i < pokemon[id].types.length; i++) {
    let pokeTypes = document.getElementById(`pokeTypes${id}`);
    pokeTypes.innerHTML += pokeTypeTemp(pokemon[id], i);
    searchBadgeColor(id, i);
  }
  searchCardColor(id, 0);
}

function searchCardColor(id, i) {
  let type = foundPokes[id].types[i].type.name;
  let pokeCard = document.getElementById(`pokeCard${id}`);
  pokeCard.classList.add(`${type}-box`);
}

function searchBadgeColor(id, i) {
  let type = foundPokes[id].types[i].type.name;
  let pokemon = foundPokes[id];
  let badge = document.getElementById(`badge${pokemon.name}${i}`);
  badge.classList.add(`${type}-badge`);
}
