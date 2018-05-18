const expect = require('expect');

const { Users } = require('./users');

describe ('Users', () => {

	let users;

	beforeEach(() => {

		users = new Users();
		users.users = [

		{

			id : '1',
			name : 'Mike',
			room : 'Midterm Study'

		},
		{
			id : '2',
			name : 'Fulya',
			room : 'Presenationers'
		},
		{
			id : '3',
			name : 'Augusto',
			room : 'Great Students'

		}

		]

	})

	it('it should add new user', () => {

		const users = new Users();
		const user = {

			id : '12345',
			name : 'Joon',
			room : 'Joon Family'

		};

		const resUser = users.addUser(user.id, user.name, user.room);

		// the second "users": array in Users {}
		expect(users.users).toEqual([user]);

	});

	it('it should remove a user', () => {

		const userID = '1';
		const userDelete = users.removeUser(userID);

		expect(userDelete.id).toBe(userID);
		expect(users.users.length).toBe(2);

	});

	it('it should not remove the user', () => {

		const userID = '4';
		const userDelete = users.removeUser(userID);

		expect(userDelete).toNotExist();
		expect(users.users.length).toBe(3);


	});

	it('it should find a user', () => {

		const userID = '2';
		const userFound = users.getUser(userID);

		expect(userFound.id).toBe(userID);

	});

	it('it should not find a user', () => {

		const userID = '4';
		const userFound = users.getUser(userID);

		expect(userFound).toNotExist();

		
	});

	it('it should return names in midterm study.', () => {
		
		const userList = users.getUserList('Midterm Study');
		expect(userList).toEqual('Mike');

	});

	it('it should return names in great students.', () => {
		
		const userList = users.getUserList('Great Students');
		expect(userList).toEqual('Augusto');

	});

});