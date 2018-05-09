console.log('must study web_Server again');

const path = require('path');

const express = require('express');

const http = require('http');

const socketIO = require('socket.io');

const currentLocation = __dirname;

const publicPath = path.join(currentLocation, '../public');

const app = express();

const server = http.createServer(app);
	
const io = socketIO(server)

io.on('connection', (socket) => {

// ========================================== message ==============================

	console.log('New user connected.');

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
		io.emit('youGotMessage', {

			from: message.to,
			text: message.text,
			createdAt: new Date().getTime()

		});

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