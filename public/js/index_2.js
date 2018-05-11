const socket = io();

socket.on('connect', function() {

	console.log('connected to the server');

});

// Andrew's code
socket.on('userjoined', function (message) {

	console.log( message.text );

});


socket.on('youGotMessage', function (message) {

	console.log('I got this message', message);

});

socket.on('disconnect', function() {

	console.log('disconnected to the server');
				
});

// ===================================== Message ii ====================

jQuery('#message-form').on('submit', function(e) {

	e.preventDefault();

	socket.emit('clientSendingMessage', {

		from: 'User1',

		// at the condition name = "message"
		//		send "text value" inside of val();
		text: jQuery('[name = message]').val()
	
	}, function() {


	});

});

socket.on('serverSendingMessage', function (message) {

	console.log('I got this message', message);

	// making <li> tag
	const li = jQuery('<li></li>');
	li.text(`${message.from}: ${message.text}`);

	jQuery('#messages').append(li);

});


// =================================== Reference ==================================
// My code
// socket.on('serverBroadcasting', function (message) {

// 	console.log( message.text );

// });

/*
socket.emit('clientSendingMessage', {

	from: 'Frank',
	text:'Hi'

}, function (msg) {

	console.log(msg);

});
*/