console.log('must study web_Server again');

const path = require('path');

const express = require('express');

const http = require('http');

const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');

const { isRealString } = require('./utils/validate_string');

const currentLocation = __dirname;

const publicPath = path.join(currentLocation, '../public');

const app = express();

const server = http.createServer(app);
	
const io = socketIO(server)

io.on('connection', (socket) => {

	console.log('New user connected.');

	// socket.emit('userjoined', generateMessage('Admin', 'Welcome to the chatting room!!!'));
	// socket.broadcast.emit('userjoined', generateMessage('Admin', 'New user just joined!'));

	// We can use paranthes to make a promise.
	// In the client, it concretes callback with an "err"
	// Therefore, we need to make a promise when it has an error.
	socket.on('join', (params, callback) => {

		// The condition when we need to call callback
		if (!isRealString(params.name) || !isRealString(params.room)) {

			// only when it has an error, execute a callback.
			// '' is an parameter in the client side
			callback('Name and room are required.');	
		
		}

		/*
			You can call join to subscribe the socket to a given channel:

			io.on('connection', function(socket){
			
			  socket.join('some room');
			
			});

			And then simply use to or in (they are the same) when broadcasting or emitting:
			io.to('some room').emit('some event');

		*/

		// room is created channel?
		// join('string')
		socket.join(params.room);

		// leaving the room
		// socket.leave(params.room);

		// [options : after we use join()]
		// We just need to send messages in "the room"
		// BTW, "to" =>  target channel making the room
		
		// 1. io.emit -> io.to(params.room).emit
		// 2. socket.broadcast -> socket.broadcast.to(params.room).emit
		// 3. socket.emit: specifically to one user -> 

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

		console.log('clientSendingMessage: ', message);

		io.emit('serverSendingMessage', generateMessage(message.from, message.text));

		callback(); // delete the message in the textbox in client.

	});

//	========================== GeoLocation ============================

	socket.on('createLocationMessage', (coords) => {

		console.log(coords);

		io.emit('serverSendingLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));

	});

// =======================================================================

	socket.on('disconnect', () => {

		console.log('disconnected to the client!!!');

	});

});


app.use(express.static(publicPath));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {

	console.log(`Server is up on port ${PORT}`);

});
