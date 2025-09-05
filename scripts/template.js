function pokeCardTemp(pokemon, i) {
    return `
    <div id="pokeCard${i}" class="pokeCard" onclick="openPokemonOverlay(${pokemon.id-1})">
        <div class="cardHeader">
                <span>${pokemon.name} </span>
                <span style="font-size: 12px">#${pokemon.id}</span>
        </div>
        <div class="pokeTypes" id="pokeTypes${i}">
        </div>
        <div class="pokeImg">
            <img src="${pokemon.sprites.other["official-artwork"]["front_default"]}" />
        </div>
        <div class="typeImg">
            <img src="./img/types/type_${pokemon.types[0].type.name}.png" />
        </div>
    </div>
  `;
}
