console.log('must study web_Server again');

const path = require('path');

const express = require('express');

const http = require('http');

const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');

const currentLocation = __dirname;

const publicPath = path.join(currentLocation, '../public');

const app = express();

const server = http.createServer(app);
	
const io = socketIO(server)

io.on('connection', (socket) => {

// ========================================== message ==============================

	console.log('New user connected.');

	// 1)
	// Andrew
	// socket.emit('userjoined', {

	// 	from: 'Admin',
	// 	text: 'Welcome to the chatting room'
	
	// });


	// 2)
	socket.emit('userjoined', generateMessage('Admin', 'Welcome to the chatting room!!!'));

	socket.broadcast.emit('userjoined', generateMessage('Admin', 'New user just joined!'));
	
	// my code
	socket.on('userJoin', (message) => {

		socket.emit('serverBroadcasting', { text : 'welcome!!!' });

		socket.broadcast.emit('serverBroadcasting', { 

			text : `Everyone, ${ message.text } just joined!`,
			createAt: new Date()

		});

	});





	// socket.emit('youGotMessage', {

	// 	from : 'jsonChoo',
	// 	text : 'You are awesome',
	// 	createdAt: new Date()

	// });

	// to show the user what that user just sent  
	socket.on('youWillSendMessage', (message) => {

		console.log('YouWillSendMessage', message);

		//  The message gets back onlty to me (client, browser).
		// socket.emit('youGotMessage', {});

		// "io.emit: " to "broadcasting" any user including me
		//		inside of the same network!!!
		// io.emit('youGotMessage', {

		// 	from: message.to,
		// 	text: message.text,
		// 	createdAt: new Date().getTime()

		// });

		// emit the message to the others, not to me
		//		not to the sending client

		// 1)
		// socket.broadcast.emit('youGotMessage', {

		// 	from: message.to,
		// 	text: message.text,
		// 	createdAt: new Date().getTime()

		// });

		// 2) by using reference variable, "generateMessage"
		socket.broadcast.emit('youGotMessage', generateMessage(message.from, messsage.text));


	});

// ============================================ email =======================

	socket.emit('youJustGotEmailfromOtherUser', { 

		from : 'json@json.com',
		text : 'what happened to my ad standing!',
		createdAt: new Date()

	});

	socket.on('YouJustCreatedEmailAndSentToUs', (newEmail) => {

		console.log('a new email is created from the user', newEmail);

	});

	socket.on('disconnect', () => {

		console.log('disconnected to the client!!!');

	});

});

app.use(express.static(publicPath));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {

	console.log(`Server is up on port ${PORT}`);

});