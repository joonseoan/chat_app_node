const _ = require('lodash');

class Users {

	constructor() {

		this.users = [];
	}

	addUser(id, name, room) {

		const user = { id, name, room };
	
		this.users.push(user);
	
		return user;
	
	}

	removeUser(id) {

		const user = this.getUser(id);

		if (user) {

			//renew the array without the object which has an "id"
			this.users = this.users.filter( users => users.id !== id);
		}

		return user;
			
	}

	getUser(id) {

		// get an element
		return this.users.filter(users => users.id === id)[0];
		
	

	}

	getUserList(room) {

		const users = this.users.filter(users => users.room === room);
		const nameArray = users.map( user => user.name);

		return nameArray;	

	}

}

// matching the case
module.exports = { Users };