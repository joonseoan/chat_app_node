console.log('must study web_Server again');

const path = require('path');

const express = require('express');

const http = require('http');

const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');

const currentLocation = __dirname;

const publicPath = path.join(currentLocation, '../public');

const app = express();

const server = http.createServer(app);
	
const io = socketIO(server)

io.on('connection', (socket) => {

	console.log('New user connected.');

	// (1) only moment when the user is just connected!!!
	// the message only to this user.
	// "userjoined" = group id/name, browser = each client
	socket.emit('userjoined', generateMessage('Admin', 'Welcome to the chatting room!!!'));

	// (2) while the connection keeps maintained....
	// The client is recognized on the basis of the browser unit.
	// Therefore the new browser populated is a new client.
	// The new user is not able to get this message.
	socket.broadcast.emit('userjoined', generateMessage('Admin', 'New user just joined!'));

	// same as above (1)
	socket.emit('youGotMessage', {

		from: 'jsonChoo',
		text: 'You are awesome',
		createdAt: new Date()

	});

	// to show the user what that user just sent  
	socket.on('clientSendingMessage', (message, callback) => {

		console.log('clientSendingMessage: ', message);

		// socket.broadcast.emit('youGotMessage', generateMessage(message.from, messsage.text));

		// (2) while the connection keeps maintained....
		io.emit('serverSendingMessage', generateMessage(message.from, message.text));

		// It is "acknowledge" to the client
		callback('This is from the server');

	});

	socket.on('disconnect', () => {

		console.log('disconnected to the client!!!');

	});

//	========================== GeoLocation ============================

	socket.on('createLocationMessage', (coords) => {

		console.log(coords);

		// 1)
		// io.emit('serverSendingMessage', generateMessage('Admin', `${coords.latitude}, ${coords.longitude}`));

		// 2) 'serverSendingLocationMessage'
		io.emit('serverSendingLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));

	});

});

app.use(express.static(publicPath));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {

	console.log(`Server is up on port ${PORT}`);

});

// =================================== Reference ============================================

	// 1)
	// Andrew
	// socket.emit('userjoined', {

	// 		from: 'Admin',
	// 		text: 'Welcome to the chatting room'
	
	// });

// ==================================== My Message =========================================	

	// my code
	// socket.on('userJoin', (message) => {

	// 	socket.emit('serverBroadcasting', { text : 'welcome!!!' });

	// 	socket.broadcast.emit('serverBroadcasting', { 

	// 		text : `Everyone, ${ message.text } just joined!`,
	// 		createAt: new Date()

	// 	});

	// });

// =========================================================================================


// ============================================ email ======================================

	// socket.emit('youJustGotEmailfromOtherUser', { 

	// 	from : 'json@json.com',
	// 	text : 'what happened to my ad standing!',
	// 	createdAt: new Date()

	// });

	// socket.on('YouJustCreatedEmailAndSentToUs', (newEmail) => {

	// 	console.log('a new email is created from the user', newEmail);

	// });

