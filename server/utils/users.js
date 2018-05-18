const _ = require('lodash');

[

	{
		id : '/sdfafa',
		name : 'Joon',
		room : 'The Office Fans'
	}
	
]

// addUser(id, name, room)
// removeUser (id) // remove use by the socket.id
// getUser(id)
// getUserList(room)

// class Person {

// 	constructor(name, age) {

// 		console.log(name, age)
// 		console.log(this); // => Person{}

// 		// it creates a new property, "name" of Person{} object 
// 		this.name = name;
// 		this.age = age;
// 	}

// 	getUserDescription () {

// 		return `${this.name} is ${this.age} year(s) old.`;
// 	}
// }

// // object instance here call the constructor fucnction.
// const me = new Person('Andrew', 10);

// // Because me = Person {}
// console.log('me.name: ', me.name);
// console.log('me.age: ', me.age);

// const description = me.getUserDescription();
// console.log(description);


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

			//*********8 renew the array without the object which has an "id"
			this.users = this.users.filter( users => users.id !== id);
		}

		return user;

		// 1)
		// const user = this.users.filter(users => users.id === id);

		// if (user) {

		// 	// ********* standar remove bu using filter
		// 	//	this.users = this.users.filter( users => users !== user[0]);
		// 	_.pull(this.users, user[0]);
		
		// }
		
		// return user[0];
			
	}

	getUser(id) {

		// **********[0] get an element
		return this.users.filter(users => users.id === id)[0];
		
		// return user;
		//return user[0].name;

	}

	getUserList(room) {

		const users = this.users.filter(users => users.room === room);
		const nameArray = users.map( user => user.name);

		return nameArray;

			// users : an object in the array.
			// make and return what arg "room" is matched with
			// return users.room === room		

	}

}

// matching the case
module.exports = { Users };