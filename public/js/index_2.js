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