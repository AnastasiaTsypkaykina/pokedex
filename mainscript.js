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


async function fetchAllPokemons(all) {
    let urlAtt;
    if (all) { urlAtt = `?offset=${offset}&limit=200`; } else urlAtt = `?offset=${offset}&limit=${maxPokemon}`;
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
    let species = fetchPokemon(`https://pokeapi.co/api/v2/pokemon-species/${id+1}/`);
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