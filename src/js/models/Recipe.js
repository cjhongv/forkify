import axios from 'axios';

export default class Recipe {
	constructor(id){
		this.id = id;
	}

	async getRecipe() {
		const proxy = 'https://cors-anywhere.herokuapp.com/';
		try {
			const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`)
			this.title = res.data.recipe.title;
			this.author = res.data.recipe.publisher;
			this.src = res.data.recipe.publisher_url;
			this.img = res.data.recipe.image_url;
			this.ingredients = res.data.recipe.ingredients;
		} catch (error) {
			console.log(error);
			alert('something went wrong :(')
		}
	}

	calcTime() {
		const numIng = this.ingredients.length;
		const periods = Math.ceil(numIng / 3);
		this.time = periods * 15;
	}

	calcServings(){
		this.servings = 4;
	}

	parseIngredients() {
		//uniform units
		const unitsLong = ['tablespoon', 'tablespoons', 'ounce', 'ounces', 'teaspoon', 'teaspoons', 'cups', 'pounds'];
		const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
		const unit = [...unitShort, 'kg', 'g']

		const newIngredients = this.ingredients.map(el => {
			let ingredient = el.toLowerCase();
			unitsLong.forEach((unit, i) => {
				ingredient = ingredient.replace(unit, unitShort[i]);
			});
		// remove parenthesis
			ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

			const arrIng = ingredient.split(' ');
			const unitIndex = arrIng.findIndex(el2 => unit.includes(el2));

			let objIng;
			if (unitIndex > -1) {
				const arrCount = arrIng.slice(0, unitIndex)
				let count;
				if (arrCount.length === 1) {
					count = eval(arrIng[0].replace('-', '+'))
				} else {
					count = eval(arrIng.slice(0, unitIndex).join('+'))
				}
				objIng = {
					count: count,
					unit: arrIng[unitIndex],
					ingredient: arrIng.slice(unitIndex + 1).join(' ')
				}
			} else if (parseInt(arrIng[0], 10)) {
				objIng = {
					count: parseInt(arrIng[0], 10).toFixed(2),
					unit: '',
					ingredient: arrIng.slice(1).join(' '),
				}
			}else if (unitIndex === -1){
				objIng = {
					count: 1,
					unit: '',
					ingredient: ingredient,
				}
			}

			return objIng;
		});
		this.ingredients = newIngredients;
	}

	updateServings(type) {
		const newServings = type === 'dec' ? this.servings -1 : this.servings +1;
		
		this.ingredients.forEach(ing => {
			ing.count *= (newServings / this.servings);
		});
		this.servings = newServings;
	}
}