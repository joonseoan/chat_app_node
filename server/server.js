console.log('must study web_Server again');

const path = require('path');

const express = require('express');

const http = require('http');

const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');

const { isRealString } = require('./utils/validate_string');

const { Users } = require('./utils/users');

const currentLocation = __dirname;

const publicPath = path.join(currentLocation, '../public');

const app = express();

const server = http.createServer(app);
	
const io = socketIO(server)

const users = new Users(); 

io.on('connection', (socket) => {

	socket.on('join', (params, callback) => {

		// The condition when we need to call callback
		if (!isRealString(params.name) || !isRealString(params.room)) {

			// only when it has an error, execute a callback.
			// Stop if the "params" is not available
			return callback('Name and room are required.');	
		
		}

		// mapping with a specific channel
		socket.join(params.room);

		// When the userr exists the room, not when the user is connected.
		// user is deleted at the previous room
		users.removeUser(socket.id);
		
		// joins the new room
		users.addUser(socket.id, params.name, params.room);

		// sending messages to the room members only, then get user list.
		io.to(params.room).emit('updateUserList', users.getUserList(params.room));
		
		socket.emit('serverSendingMessage', generateMessage('Admin', 'Welcome to the chatting room!!!'));
		
		//to(params.room) sending message just one room
		socket.broadcast.to(params.room).emit('serverSendingMessage', generateMessage('Admin', `${ params.name } has joined!`));
		
		callback();

	});

	socket.emit('youGotMessage', {

		from: 'jsonChoo',
		text: 'You are awesome!',
		createdAt: new Date()

	});

	socket.on('clientSendingMessage', (message, callback) => {

		// console.log('clientSendingMessage: ', message);

		const user = users.getUser(socket.id);

		// message to a room only
		if (user && isRealString(message.text)) {

			io.to(user.room).emit('serverSendingMessage', generateMessage(user.name, message.text));
		}


		callback(); // delete the message in the textbox in client.

	});

//	========================== GeoLocation ============================

	socket.on('createLocationMessage', (coords) => {

		const user = users.getUser(socket.id);

		if(user && coords.latitude && coords.longitude) {

			io.to(user.room).emit('serverSendingLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));

		}
	});


// remove users when it refreshes or the user is disconnected.
	socket.on('disconnect', () => {

		// socket.id : it is granted the client or browser from "socket".
		console.log(socket.id); 
		
		// When the cuser / client disconnects to the server
		const user = users.removeUser(socket.id);

		// notify the other users that some just left.
		io.to(user.room).emit('serverSendingMessage', generateMessage('Admin', `${user.name} just left.`));

		// Then, renew the list
		io.to(user.room).emit('updateUserList', users.getUserList(user.room));

	});

});


app.use(express.static(publicPath));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {

	console.log(`Server is up on port ${PORT}`);

});
