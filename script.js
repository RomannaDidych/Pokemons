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
		console.log(value);				
		nextPageURL = value.next;		
		let arr = value.results;		
		mainArr = arr.map(arr => [arr.name]);		
		let arrURL = arr.map(arr => arr.url);
		let arrPromises = [];
		for(let i=0; i<arrURL.length; i++){
		 	arrPromises.push(getServersData(arrURL[i]));		
		};
		//console.log(arrPromises);
		return Promise.all(arrPromises);	
	}).then(function(resultArr){ 		
		//console.log("i'm hear");
		 console.log(resultArr);
		// create and return list (ul) one pokemons abilities
		/*function getUlAbilities(arr){ 
			let abilitiesUl = document.createElement('ul');
			let arrOnePokemonsAbil = arr.map(arr => arr.ability);			
			let arrAbilUrl = arrOnePokemonsAbil.map(arrOnePokemonsAbil => [arrOnePokemonsAbil.url]);
			console.log(arrAbilUrl);				
			for (j=0; j<arrAbilUrl.length; j++){
				console.log('start iteration '+j);
				let temp = arrAbilUrl[j];
				let shortAbilArr = getServersData(temp).then(function(val){ 
					console.log('entered then '+j);					
					let abilityText = val.name + ":     " + val.effect_entries[0]["short_effect"] + ";";				
					let abilityLi = document.createElement('li');
					let text = document.createTextNode(abilityText);
					abilityLi.append(text);
					abilitiesUl.append(abilityLi);
					console.log('completed then '+j);							
				});
				console.log('completed iteration '+j);
			};
			console.log('completed function');
			return abilitiesUl;		
		};*/

		function getUlAbilities(arr){
			let abilitiesUl = document.createElement('ul');
			let arrOnePokemonsAbil = arr.map(arr => arr.ability);			
			let arrAbilUrl = arrOnePokemonsAbil.map(arrOnePokemonsAbil => [arrOnePokemonsAbil.url]);
			//console.log(arrAbilUrl);
			async function asyncLoop(array){
				//console.log("async function started");
				function createUl(val){
						let abilityText = val.name + ":     " + val.effect_entries[0]["short_effect"] + ";";				
						let abilityLi = document.createElement('li');
						let text = document.createTextNode(abilityText);
						abilityLi.append(text);
						abilitiesUl.append(abilityLi);
					};

				let iteration = 0;
				for (let item of array){
					iteration++;
					console.log("started iteration " + iteration)
					let value = await getServersData(item);
					console.log("got data " + iteration);
					await createUl(value);
					console.log("ended iteration " + iteration)
				};				
			};
			asyncLoop(arrAbilUrl);
			console.log("async function finished");
			return abilitiesUl;		
		};


			


		let arrAbilities = resultArr.map(resultArr => resultArr.abilities);			
		let divList = document.createElement('div');
		divList.id = currentID;		 
		for (let i=0; i<arrAbilities.length; i++){
			let newLi = document.createElement('li');
			let h2 = document.createElement('h2');
			h2.innerHTML = mainArr[i];		
			newLi.append(h2);			
			divList.append(newLi);			
			let newUl = getUlAbilities(arrAbilities[i]);
			console.log(newUl);			
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
	} else {
		if (+currentID < maxPagesNumber){
			document.getElementById(currentID).style.display = 'none';
			location.hash = changeCurrentID(1);
			document.getElementById(currentID).style.display = 'block';
		};  
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
	




