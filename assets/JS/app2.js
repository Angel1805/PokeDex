const containerPokemons = document.querySelector('.section2Cards'),
    //   btnsPreviousNext = document.querySelectorAll('div.btnsPreviousNext > button.btns'),
      btnsPreviousNext = document.querySelector('.btnsPreviousNext'),
      sectionLoader = document.querySelector('.sectionLoader'),
      btnPrevious = document.querySelector('.btnPrevious'),
      btnNext = document.querySelector('.btnNext'),
      inputSearchCards = document.getElementById('inputSearchCards'),
      buttonSearchPokemon = document.getElementById('buttonSearchPokemon'),
      searchPokemonResult = document.querySelector('.searchPokemonResult');

let linkAPI = "https://pokeapi.co/api/v2/pokemon/";
// crear la funcion seachPokemon con un nuevo fecth o nuevo link como el video

const searchPokemon = async (e) =>{
    
    try {
        const response = await fetch(`${linkAPI}${inputSearchCards.value.toLowerCase()}`)

        const data = await response.json();
        console.log(response);
        console.log(data);
        createCardPokemons2 (data);

        if(!response.ok)throw{status:response.status, statusText:response.statusText}
        
    } catch (error) {
        console.log(error);
        let message = error.statusText || "This pokemon is not available. Try with another pokemon"
        containerPokemons.innerHTML = `<p>Error: ${error.status}: ${message} </p>`
    }
}

// Agregar boton de volver a el inicio de todos los pokemones reinicia el programa 
const btnSearchPokemon = () =>{

}

buttonSearchPokemon.addEventListener('click', () =>{
    containerPokemons.innerHTML = '';
    btnsPreviousNext.innerHTML = '';
    searchPokemon()
    searchPokemonResult.innerHTML = '';
    inputSearchCards.value = '';
    console.log('di cliclk en buscar');
});

const filterNames = async()=>{

    try {
        let namesPokeData = [];
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1279`);

        const data = await response.json();
        console.log(data);

        for(let i = 0; i < data.results.length; i++){
            let namesPoke = data.results[i].name;
            namesPokeData.push(namesPoke);
        };
        console.log(namesPokeData);

        let sortedNamesPoke = namesPokeData.sort();
        
        inputSearchCards.addEventListener("keyup", (e) =>{
            removeElements();
            
            for (let i of sortedNamesPoke){
                if(i.toLowerCase().startsWith(inputSearchCards.value.toLowerCase()) && inputSearchCards.value != ""){

                    let listItem = document.createElement("li");

                    listItem.classList.add("list-items");
                    listItem.style.cursor = "pointer";
                    listItem.setAttribute("onclick", "displayNamesPoke('" + i +"')");
                    let words = "<b>" + i.slice(0, inputSearchCards.value.length) + "<b>";
                    words += i.slice(inputSearchCards.value.length);
                    listItem.innerHTML = words;
                    document.querySelector(".list").appendChild(listItem);
                }
            }
        });

        if(!response.ok)throw{status:response.status, statusText:response.statusText}
        
    } catch (error) {
        console.log(error);
        let message = error.statusText || "This pokemon is not available. Try with another pokemon"
        containerPokemons.innerHTML = `<p>Error: ${error.status}: ${message} </p>`
    }

}
filterNames();
const displayNamesPoke = (value) => {
    inputSearchCards.value = value;
    removeElements();
}
const removeElements = () =>{

    let items = document.querySelectorAll(".list-items");
    items.forEach((item) =>{
        item.remove();
    });

}
const loadPokemons = async (url) =>{
    containerPokemons.innerHTML = `<span class="loader"></span>`;
    try {
        const response = await fetch(url);
        const json = await response.json();
        console.log(json);

        let prevLink;
        if (json.previous){
            prevLink = `<button class=" btns btnPrevious styleBtn" data-url=${json.previous}>
            <img src="./assets/icons/previous.png" alt="" type="button"> Previous</button>`;
        }else{
            prevLink = "";
        }
        let nextLink;
        if (json.next){
            nextLink = `<button class=" btns btnNext styleBtn" data-url=${json.next}>Next <img src="./assets/icons/next.png" alt="" type="button"></button> `;
        }else{
            nextLink = "";
        }
        btnsPreviousNext.innerHTML = prevLink + " " + nextLink;
        console.log(prevLink);
        console.log(nextLink);

        const pokemons = json.results;

        if(!response.ok)throw{status:response.status, statusText:response.statusText}

        createPokemons(json);

    } catch (error) {
        console.log(error);
        let message = error.statusText || "Ocurrió un error"
        containerPokemons.innerHTML = `<p>Error: ${error.status}: ${message} </p>`
    }
    
};
loadPokemons(linkAPI);

btnsPreviousNext.addEventListener('click',(e) => {
    e.preventDefault();
    // console.log(e.target.classList.contains('btns'));
    if (e.target.classList.contains('btns')){
        let value = e.target.dataset.url
        console.log(value);
        loadPokemons(value);

    }
})

const createPokemons = async (json)=>{
    containerPokemons.innerHTML = '';

    for(let i = 0; i < json.results.length; i++){

        try {
            let res = await fetch(json.results[i].url);
            let pokemon = await res.json();

                createCardPokemons(pokemon);
        } catch (error) {
            
        }
    }

};
const createCardPokemons = async(pokemon) =>{


    let types = await  pokemon.types.map( (type) => type.type.name);
    // console.log(types);

    let typesNames = await  types.map( (type) =>
    
        `<p class="${type} type">${ firstLetterUppercase(type)}
        <img src="./assets/icons/${type}.png" alt="${type}">
        </p>`
    ).join('');
    
    // console.log(typesNames);

    let pokemonId = pokemon.id.toString();
    if (pokemonId.length === 1){
        pokemonId = "000" + pokemonId
    }if (pokemonId.length === 2){
        pokemonId = "00" + pokemonId;
    }if(pokemonId.length === 3){
        pokemonId = "0" + pokemonId;
    };

    createCardPokemon(pokemon,pokemonId, typesNames)


};
const createCardPokemon = (pokemon, pokemonId, typesNames) =>{

    //TODO:arreglar el Html de esta tarjeta agregando otro div padre 
    const divCardPokemon = document.createElement("div");
    divCardPokemon.classList.add("divCardPokemon");

    divCardPokemon.innerHTML = `<div class="divImgPokemon">
        <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="Pokemon" class="imgCardPokemon">
    </div>
    <div class="divIdPokemon">
        <p>N.°${pokemonId}</p>
    </div>
    <div class="divNamePokemon">
        <h1>${ firstLetterUppercase(pokemon.name)}</h1>
    </div>
    <div class="divTypePokemon">
    ${typesNames}
    </div>`
    containerPokemons.append(divCardPokemon);

    const divCardPokemonAll = document.querySelectorAll("section.section2Cards > div.divCardPokemon");
    divCardPokemonAll.forEach((card) => {
        card.addEventListener("click", () =>{
            const child = card.children[2];
            const cardName = child.innerText.toLowerCase();
            createModalPokemon(cardName)
            console.log('di click en un hijo '+ cardName);
        });
    });

}
const createCardPokemons2 = async(pokemon) =>{


    let types = await  pokemon.types.map( (type) => type.type.name);
    // console.log(types);

    let typesNames = await  types.map( (type) =>
    
        `<p class="${type} type">${ firstLetterUppercase(type)}
        <img src="./assets/icons/${type}.png" alt="${type}">
        </p>`
    ).join('');
    
    // console.log(typesNames);

    let pokemonId = pokemon.id.toString();
    if (pokemonId.length === 1){
        pokemonId = "00" + pokemonId
    }else if (pokemonId.length === 2){
        pokemonId = "0" + pokemonId;
    };

    const divCardPokemon = document.createElement("div");
    divCardPokemon.classList.add("divCardPokemon");

    divCardPokemon.innerHTML = `<div class="divImgPokemon">
        <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="Pokemon" class="imgCardPokemon">
    </div>
    <div class="divIdPokemon">
        <p>N.°${pokemonId}</p>
    </div>
    <div class="divNamePokemon">
        <h1>${ firstLetterUppercase(pokemon.name)}</h1>
    </div>
    <div class="divTypePokemon">
    ${typesNames}
    </div>`
    searchPokemonResult.append(divCardPokemon);
};

const firstLetterUppercase = (name) =>{

    return name.split(' ')
    .map(word => {
        return word[0].toUpperCase() + word.substring(1);
    })
    .join(' ');
};

const createModalPokemon = async(namePokemon) =>{

    try {
        const response = await fetch(`${linkAPI}${namePokemon}`);
        const json = await response.json();
        console.log(json);


    } catch (error) {
        console.log(error);
        let message = error.statusText || "Ocurrió un error"
        containerPokemons.innerHTML = `<p>Error: ${error.status}: ${message} </p>`
    }
}
const closeModal = document.getElementById('closeModal');
console.log(closeModal);
const modal_container = document.querySelector('.modal_container');
console.log(modal_container);
const modalPokemon = document.querySelector('modalPokemon')
const divCloseModal = document.querySelector('divCloseModal');

closeModal.addEventListener("click", () =>{
    modalPokemon.classList.toggle('modalPokemon')
})


