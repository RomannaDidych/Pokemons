let previousPageURL = '';
let nextPageURL = '';
let currentListID = '0';

function getCurrentID(){
	let ID = Number(currentListID) + 1;
	currentListID = String(ID);
	return currentListID;
}



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
		console.log(value);
		previousPageURL = value.previous;
		//console.log(previousPageURL);
		nextPageURL = value.next;
		//console.log(nextPageURL);
		let arr = value.results;
		//console.log(arr);	
		mainArr = arr.map(arr => [arr.name]);
		//console.log(mainArr);	
		let arrURL = arr.map(arr => arr.url);
		let arrPromises = [];
		for(let i=0; i<arrURL.length; i++){
		 	arrPromises.push(getServersData(arrURL[i]));		
		};
		return Promise.all(arrPromises);	
	}).then(function(resultArr){
		//console.log(resultArr);

		// create and return list (ul) one pokemons abilities
		function getUlAbilities(arr){ 
			let abilitiesUl = document.createElement('ul');
			let arrOnePokemonsAbil = arr.map(arr => arr.ability);
			//let arrName = arrOnePokemonsAbil.map(arrOnePokemonsAbil => [arrOnePokemonsAbil.name]);
			let arrAbilUrl = arrOnePokemonsAbil.map(arrOnePokemonsAbil => [arrOnePokemonsAbil.url]);				
			for (j=0; j<arrAbilUrl.length; j++){
				let temp = arrAbilUrl[j];
				let shortAbilArr = getServersData(temp).then(function(val){
					//let arrOneAbility = [val.name, val.effect_entries[0]["short_effect"]];
					let abilityText = val.name + ":     " + val.effect_entries[0]["short_effect"] + ";";				
					let abilityLi = document.createElement('li');
					let text = document.createTextNode(abilityText);
					abilityLi.append(text);
					abilitiesUl.append(abilityLi);							
				});
			};
			return abilitiesUl;		
		}

		let arrAbilities = resultArr.map(resultArr => resultArr.abilities);
		//console.log(arrAbilities);		
		
		let divList = document.createElement('div');
		divList.id = getCurrentID();
		console.log(divList.id); 
		for (let i=0; i<arrAbilities.length; i++){
			let newLi = document.createElement('li');
			let h2 = document.createElement('h2');
			h2.innerHTML = mainArr[i];		
			newLi.append(h2);
			//document.getElementById('list').append(newLi);
			divList.append(newLi);
			//let newUl = document.createElement('ul');
			let newUl = getUlAbilities(arrAbilities[i]);
			newLi.append(newUl);
			//console.log(newLi);

			/*let tempArr = arrAbilities[i];
			let arrOnePokemonsAbil = tempArr.map(tempArr => tempArr.ability);
			//let arrName = arrOnePokemonsAbil.map(arrOnePokemonsAbil => [arrOnePokemonsAbil.name]);
			let arrAbilUrl = arrOnePokemonsAbil.map(arrOnePokemonsAbil => [arrOnePokemonsAbil.url]);				
			for (j=0; j<arrAbilUrl.length; j++){
				let temp = arrAbilUrl[j];
				let shortAbilArr = getServersData(temp).then(function(val){
					//let arrOneAbility = [val.name, val.effect_entries[0]["short_effect"]];
					let abilityText = val.name + ":     " + val.effect_entries[0]["short_effect"] + ";";				
					let abilityLi = document.createElement('li');
					let text = document.createTextNode(abilityText);
					abilityLi.append(text);
					newUl.append(abilityLi);							
				});
			};*/// end cikle by j		
		}; //end cikle by i
		document.getElementById('listContainer').append(divList);	
	});
};

let firstPageURL = "https://pokeapi.co/api/v2/pokemon/";
//location.hash = "#1";
loadList(firstPageURL);
//location.hash = "#1";
/*window.addEventListener('hashchange', function(){
						
		for(let i=0; i<20; i++){
			let li1 = document.getElementById('list').firstElementChild;			
			li1.remove();				
		};
	});*/

next.onclick = function(){
	/*if (nextPageURL !== null) {
		
		let newHash = String(+location.hash.slice(0) +1);
		console.log(newHash);
		location.hash = newHash;*/

	location.hash = currentListID;
	window.addEventListener('hashchange', function(){
		
				console.log("I'm here");		
		}); 
		loadList(nextPageURL);
	//}
};
	




