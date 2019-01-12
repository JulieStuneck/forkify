import uniqid from 'uniqid';

export default class List {
	constructor() {
		this.items = [];
	}

	addItem(count, unit, ingredient) {
		const item = {
			id: uniqid(),
			count,
			unit,
			ingredient
		}
		this.items.push(item);
		return item;
	}

	deleteItem (id) { 
	//based on passed in item, find position of its id
	const index = this.items.findIndex(el => el.id === id);
		//[2,4,8] splice(1, 2) -> returns [4,8], original array becomes [2] (1=begin index, 2=how many elements to take)
		//[2,4,8] slice(1, 2) -> returns 4, original array becomes [2,4,8] (1=begin index, 2=end index)

		this.items.splice(index, 1); //could add return if needed the deleted item 
	}

	updateCount(id, newCount) {
		//find element 
		this.items.find(el => el.id === id).count = newCount;
	}
}