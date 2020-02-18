let previousPageURL = '';
let nextPageURL = '';
let currentID = '1';
let maxPagesNumber = 0;

function changeCurrentID(arg){
	let ID = Number(currentID) + arg;
	currentID = String(ID);
	return currentID;
};

function getServersData(url){
	return new Promise(function(resolve,reject){
				$.get(url, function(data,status){
					if(status === 'success'){
						 resolve(data);
					} else {
						 reject(new Error("Whoops!"));
					}
				});
			});
};

function loadList(url){
	let mainArr = [];
	let loadPokemonsList = getServersData(url);
	loadPokemonsList.then(function(value){
		//console.log(value);
		previousPageURL = value.previous;		
		nextPageURL = value.next;		
		let arr = value.results;		
		mainArr = arr.map(arr => [arr.name]);		
		let arrURL = arr.map(arr => arr.url);
		let arrPromises = [];
		for(let i=0; i<arrURL.length; i++){
		 	arrPromises.push(getServersData(arrURL[i]));		
		};
		return Promise.all(arrPromises);	
	}).then(function(resultArr){		

		// create and return list (ul) one pokemons abilities
		function getUlAbilities(arr){ 
			let abilitiesUl = document.createElement('ul');
			let arrOnePokemonsAbil = arr.map(arr => arr.ability);			
			let arrAbilUrl = arrOnePokemonsAbil.map(arrOnePokemonsAbil => [arrOnePokemonsAbil.url]);				
			for (j=0; j<arrAbilUrl.length; j++){
				let temp = arrAbilUrl[j];
				let shortAbilArr = getServersData(temp).then(function(val){					
					let abilityText = val.name + ":     " + val.effect_entries[0]["short_effect"] + ";";				
					let abilityLi = document.createElement('li');
					let text = document.createTextNode(abilityText);
					abilityLi.append(text);
					abilitiesUl.append(abilityLi);							
				});
			};
			return abilitiesUl;		
		};

		let arrAbilities = resultArr.map(resultArr => resultArr.abilities);		
		let divList = document.createElement('div');
		divList.id = currentID;
		//console.log(divList.id); 
		for (let i=0; i<arrAbilities.length; i++){
			let newLi = document.createElement('li');
			let h2 = document.createElement('h2');
			h2.innerHTML = mainArr[i];		
			newLi.append(h2);			
			divList.append(newLi);			
			let newUl = getUlAbilities(arrAbilities[i]);
			newLi.append(newUl);			
		}; 
		maxPagesNumber +=1;
		document.getElementById('listContainer').append(divList);
	});
};


next.onclick = function(){	
	if (nextPageURL !== null) {
		document.getElementById(currentID).style.display = 'none';
		if (+currentID < maxPagesNumber){
			location.hash = changeCurrentID(1);
			document.getElementById(currentID).style.display = 'block';
		} else {
			location.hash = changeCurrentID(1);			
			loadList(nextPageURL);
		}
	};
};

previous.onclick = function(){
	if (+currentID > 1) {
		document.getElementById(currentID).style.display = 'none';
		location.hash = changeCurrentID(-1);
		document.getElementById(currentID).style.display = 'block';
	}
};

let firstPageURL = "https://pokeapi.co/api/v2/pokemon/";

loadList(firstPageURL);
location.hash = currentID;
	




