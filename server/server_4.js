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

	console.log('New user connected.');

	// socket.emit('userjoined', generateMessage('Admin', 'Welcome to the chatting room!!!'));
	// socket.broadcast.emit('userjoined', generateMessage('Admin', 'New user just joined!'));

	// We can use parantheses to make a promise.
	// In the client side "socket.emit('join, param, (err) => {});"

	// In the client, it concretes callback with an "err"
	// Therefore, we need to make a promise when it has an error.

	// Actually (params, callback) is a same format (param, (err) => ) up and above.
	socket.on('join', (params, callback) => {

		// The condition when we need to call callback
		if (!isRealString(params.name) || !isRealString(params.room)) {

			// only when it has an error, execute a callback.
			// '' is an parameter in the client side
			// Stop if the "params" is not available
			return callback('Name and room are required.');	
		
		}

		/*

			You can call join to subscribe the socket to a given channel:

			io.on('connection', function(socket){
			
			  socket.join('some room');
			
			});

			And then simply use to or in (they are the same) when broadcasting or emitting:
			io.to('some room').emit('some event');

		*/

		// room maps with a specific channel
		// join('string')
		socket.join(params.room);

		// When the userr exists the room, not when the user is connected.
		// user is deleted at the previous room
		users.removeUser(socket.id);
		
		// socket.id???
		// console.log('socket.id: ', socket.id)
		
		// and joins the new room
		users.addUser(socket.id, params.name, params.room);

		// leaving the room
		// socket.leave(params.room);

		// [options : after we use join()]
		// We just need to send messages in "the room"
		// BTW, "to" =>  target channel making the room
		
		// 1. io.emit -> io.to(params.room).emit()
		// 2. socket.broadcast -> socket.broadcast.to(params.room).emit()
		// 3. socket.emit: specifically to one user -> 

		// sending messages to the room members only, then get user list.
		io.to(params.room).emit('updateUserList', users.getUserList(params.room));
		
		socket.emit('serverSendingMessage', generateMessage('Admin', 'Welcome to the chatting room!!!'));
		
		//to(params.room) sending message just one room
		socket.broadcast.to(params.room).emit('serverSendingMessage', generateMessage('Admin', `${ params.name } has joined!`));
		
		// if it is ok, we do not need to call callback.
		// However, if the callback function is defined, we must call callback.
		// As a solution, we do not need to put parameters.
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

		// 1)
		// location message
		// console.log(coords);

		// only the room, including myself
		//io.to(user.room).emit('serverSendingLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));

		const user = users.getUser(socket.id);

		if(user && coords.latitude && coords.longitude) {

			io.to(user.room).emit('serverSendingLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));

		}
	});

// =======================================================================

// remove users when it refreshes or the user is disconnected.
	socket.on('disconnect', () => {

		// console.log('disconnected to the client!!!');

		// socket.id : it is granted the client or browser from "socket".
		console.log(socket.id); //  *****************whWQwjQf4FL16W54AAAA
		
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
