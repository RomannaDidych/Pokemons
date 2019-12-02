let previousPageURL = '';
let nextPageURL = '';

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
		console.log(previousPageURL);
		nextPageURL = value.next;
		console.log(nextPageURL);
		let arr = value.results;
		console.log(arr);	
		mainArr = arr.map(arr => [arr.name]);
		//console.log(mainArr);	
		let arrURL = arr.map(arr => arr.url);
		let arrPromises = [];
		for(let i=0; i<arrURL.length; i++){
		 	arrPromises.push(getServersData(arrURL[i]));		
		};
		return Promise.all(arrPromises);	
	}).then(function(resultArr){
		console.log(resultArr);
		let arrAbilities = resultArr.map(resultArr => resultArr.abilities);
		console.log(arrAbilities);
		 
		for (let i=0; i<arrAbilities.length; i++){
			let newLi = document.createElement('li');
			let h2 = document.createElement('h2');
			h2.innerHTML = mainArr[i];		
			newLi.append(h2);
			document.getElementById('list').append(newLi);
			let newUl = document.createElement('ul');
			newLi.append(newUl);

			let tempArr = arrAbilities[i];
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
			};// end cikle by j		
		}; //end cikle by i	
	});
};

let firstPageURL = "https://pokeapi.co/api/v2/pokemon/";
loadList(firstPageURL);
console.log
next.onclick = function(){
	loadList(nextPageURL)
};



