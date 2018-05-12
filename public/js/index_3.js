const socket = io();

socket.on('connect', function() {

	console.log('connected to the server');

});

// Andrew's code
socket.on('userjoined', function (message) {

	console.log( message.text );

});

// 
socket.on('youGotMessage', function (message) {

	console.log('I got this message', message);

});

// ===================================== Message <html> ========================================

// submit ===> emit
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

socket.on('disconnect', function() {

	console.log('disconnected to the server');
				
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

// ============================== Geo Location ============================

// console.log(jQuery('#send-location'));
const locationButton = jQuery('#send-location');
locationButton.on('click', function() {

	// Geolocation Setup
	// It is a pre-set methods of "geolocation"
	console.log(navigator.geolocation) // Call a geolocation object
	if(!navigator.geolocation) {

		return alert('Geolocation not supported by your browser');

	}

	// "getCurrentPosition" fires up the process of geolocation 
	// Uses Promise
	navigator.geolocation.getCurrentPosition(function(position) {

		// console.log(position.coords.latitude);

		socket.emit('createLocationMessage', {

			latitude: position.coords.latitude,
			longitude: position.coords.longitude

		});

	}, function() {

		alert('Unable to fetch location: ');

	});

});

// message from server with google map link
socket.on('serverSendingLocationMessage', function(locationMessage) {

	const li = jQuery('<li></li>');
	const a = jQuery('<a target="_blank">My Current Location</a>');

	li.text(`${locationMessage.from}: ` );
	a.attr('href', locationMessage.url);

	li.append(a);
	jQuery('#messages').append(li);

});
