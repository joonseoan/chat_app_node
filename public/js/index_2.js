const socket = io();

socket.on('connect', function() {

	console.log('connected to the server');

});

socket.on('disconnect', function() {

	console.log('disconnected to the server');
				
});

socket.on('youGotMessage', function (message) {

	console.log('I got this message', message);

});

// Andrew's code
socket.on('userjoined', function (message) {

	console.log( message.text );

});

// my code
socket.on('serverBroadcasting', function (message) {

	console.log( message.text );

});