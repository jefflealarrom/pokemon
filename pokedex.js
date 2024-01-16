document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    document.getElementById("loadingImage").style.display = "none";
    document.querySelector(".web").style.display = "block"; //
  }, 20000);
});

const pokedexSection = document.querySelector("#pokedex");
const typeListSection = document.querySelector("#typeList");
const favoritesSection = document.querySelector("#favoritesSection");
let pokemonApi = [];
let favoritePokemonCount = 0;
let pokemonTypes = [];

// Función para obtener datos de la API de Pokémon
async function fetchPokemon() {
  favoritesSection.addEventListener("click", () => toggleFavoritesSection());
  for (let i = 1; i < 151; i++) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const data = await response.json();

    const pokemon = createPokemon(data);
    pokemonApi.push(pokemon);
  }
  console.log(pokemonApi);
}

// Función para crear un objeto Pokemon a partir de los datos
function createPokemon(data) {
  return {
    name: data.name,
    image: data.sprites.other["dream_world"].front_default,
    type: data.types.map((type) => type.type.name).join(", "),
    id: data.id,
    abilities: Array.isArray(data.abilities)
      ? data.abilities.map((ability) => ability.ability.name).join(", ")
      : "",
    isFavorite: false,
  };
}

// Función para mostrar todos los Pokémon en el front en cartas
function displayAllPokemon() {
  pokedexSection.innerHTML = "";
  pokemonApi.forEach((pokemon) => displayPokemon(pokemon));
}

// Función para mostrar un Pokémon en el front en cartas
function displayPokemon(pokemon) {
  const sectionItem = document.createElement("section");
  sectionItem.classList.add("pokemon-card");
  sectionItem.innerHTML = `
          <img src="${pokemon.image}" alt="${pokemon.name}">
          <h2>Name: ${pokemon.name}</h2>
          <p>Type: ${pokemon.type}</p>
      `;
  sectionItem.addEventListener("click", () => openModal(pokemon));
  pokedexSection.appendChild(sectionItem);
}

// Función para obtener y mostrar tipos de Pokémon desde la API
async function fetchPokemonTypes() {
  const typesSet = new Set();
  pokemonApi.forEach((pokemon) => {
    const pokemonTypes = pokemon.type.split(", ");
    pokemonTypes.forEach((type) => typesSet.add(type));
  });
  const typesArray = [...typesSet].map((type, index) => {
    return {
      name: type,
      hasPokemon: pokemonApi.some((pokemon) => pokemon.type.includes(type)),
    };
  });

  // Filtrar los tipos "dark"
  const filteredTypes = typesArray.filter(
    (type) => type.hasPokemon && type.name !== "dark"
  );

  return filteredTypes;
}

// Función para mostrar tipos de Pokémon en botones
function displayPokemonTypes(types) {
  types.forEach((type) => {
    const typeButton = document.createElement("button");
    typeButton.textContent = type.name;
    typeButton.addEventListener("click", () => filterPokemonByType(type.name));
    typeListSection.appendChild(typeButton);
  });
}

// Función para filtrar y mostrar Pokémon por tipo
function filterPokemonByType(type) {
  const filteredPokemon = pokemonApi.filter((pokemon) =>
    pokemon.type.includes(type)
  );
  displayFilteredPokemon(filteredPokemon);
}

// Función para mostrar Pokémon filtrados en el front en cartas
function displayFilteredPokemon(filteredPokemon) {
  pokedexSection.innerHTML = "";
  filteredPokemon.forEach((pokemon) => displayPokemon(pokemon));
}

// Función para abrir un modal con detalles de un Pokémon
function openModal(pokemon) {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="closeModal()">&times;</span>
            <img src="${pokemon.image}" alt="${pokemon.name}">
            <h2>My name is: ${pokemon.name}</h2>
            <h3>I am number: ${pokemon.id}</h3>
            <h4>I am of type: ${pokemon.type}</h4>
            <small>My abilities are ${pokemon.abilities}</small>
            <button class="favorite-button" onclick="toggleFavorite('${pokemon.name}')">\u2764</button>
        </div>
    `;

  document.body.appendChild(modal);
}

// Función para cerrar el modal
function closeModal() {
  const modal = document.querySelector(".modal");
  modal.parentElement.removeChild(modal);
}

// Función para marcar un Pokémon como favorito
function toggleFavorite(pokemonName) {
  const pokemon = pokemonApi.find((p) => p.name === pokemonName);
  pokemon.isFavorite = !pokemon.isFavorite;

  updateFavoriteCounter();
}

// Función para actualizar el contador de Pokémon favoritos
function updateFavoriteCounter() {
  const counterElement = document.querySelector("#favorites");
  favoritePokemonCount = pokemonApi.filter((p) => p.isFavorite).length;
  counterElement.innerHTML = `${favoritePokemonCount}`;
}

// Función para mostrar u ocultar la sección de favoritos
function toggleFavoritesSection() {
  const favoritesSection = document.getElementById("favorites");
  if (
    favoritesSection.style.display === "none" ||
    favoritesSection.style.display === ""
  ) {
    openFavoritesPage();
    favoritesSection.style.display = "flex";
  } else {
    favoritesSection.style.display = "none";
  }
}

// Función para mostrar la página de Pokémon favoritos
function openFavoritesPage() {
  const favoritesSection = document.getElementById("favorites");
  favoritesSection.innerHTML = "";
  pokemonApi
    .filter((pokemon) => pokemon.isFavorite)
    .forEach((pokemon) => displayFavoritePokemon(pokemon));

  const backButton = document.createElement("button");
  backButton.textContent = "X";
  backButton.classList.add("back-button");
  backButton.addEventListener("click", () => toggleFavoritesSection());
  favoritesSection.appendChild(backButton);
}

// Función para mostrar Pokémon favoritos en el front en cartas
function displayFavoritePokemon(pokemon) {
  const favoritesSection = document.getElementById("favorites");
  const sectionItem = document.createElement("section");
  sectionItem.classList.add("pokemon-card");
  sectionItem.innerHTML = `
          <img src="${pokemon.image}" alt="${pokemon.name}">
          <h2>Name: ${pokemon.name}</h2>
          <p>Type: ${pokemon.type}</p>
      `;
  sectionItem.addEventListener("click", () => openModal(pokemon));
  favoritesSection.appendChild(sectionItem);
  console.log(pokemon);
}

// Llamadas a funciones de inicialización
fetchPokemon().then(() => {
  fetchPokemonTypes().then((types) => {
    types.sort((a, b) => a.name.localeCompare(b.name));
    displayPokemonTypes(types);
    displayAllPokemon();
  });
});

const searchBarForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");

searchBarForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const searchTerm = searchInput.value;
  filterPokemon(searchTerm);
});

function filterPokemon(searchTerm) {
  const filteredPokemon = pokemonApi.filter(
    (pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm) ||
      pokemon.abilities.toLowerCase().includes(searchTerm) ||
      pokemon.type.toLowerCase().includes(searchTerm) ||
      String(pokemon.id).includes(searchTerm)
  );

  displayFilteredPokemon(filteredPokemon);
}
