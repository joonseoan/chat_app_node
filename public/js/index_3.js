// We are not required to import 'moment js'
//		because moment.js file is attached to the front.
// const moment = require('moment');

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

// ===================================== Message <html> ========================================

// submit ===> emit
// ".on" listens to submit  and takes value
jQuery('#message-form').on('submit', function(e) {

	// Without e.preventDefault(), the messages in the display board will dispear.
	//		because the entire page will refresh.
	e.preventDefault();

	const textBoxMessage = jQuery('[name = message]');
	
	socket.emit('clientSendingMessage', {

		from: 'User1',

		// at the condition name = "message"
		//		send "text value" inside of val();
		text: textBoxMessage.val()
	
	}, function() {

		// after sending message, remove that message
		// Normally, se can send value inside of paranthesis.
		// However, this time, we just need to remove the value.
		textBoxMessage.val('');

	});

});

socket.on('serverSendingMessage', function (message) {

	console.log('I got this message', message);

	// time stamp using the installed "momentjs"
	// locationMessage.createdAt is changed to string in message.js file
	const time = moment(message.createdAt).format('h:mm a');

	// making <li> tag
	const li = jQuery('<li></li>');
	li.text(`${ message.from } (${ time }): ${ message.text }`);

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

	// ****** Once the user clicks on the button, the button disabled.
	// the first arg = attribute, the second one is value.
	locationButton.attr('disabled', 'disabled');
	locationButton.text('Sending location...');

	// "getCurrentPosition" fires up the process of geolocation to get coordnates
	// Uses Promise
	navigator.geolocation.getCurrentPosition( function(position) {

		// Associated with "locationButton.attr('disabled', 'disabled');"
		// 		It removes "disabled" attribute and actived the button again.
		locationButton.removeAttr('disabled');
		locationButton.text('Send location');

		// console.log(position.coords.latitude);
		socket.emit('createLocationMessage', {

			latitude: position.coords.latitude,
			longitude: position.coords.longitude

		});

	}, function() {

		// when the user fails to fetch data, just let them try it again.
		locationButton.removeAttr('disabled');
		locationButton.text('Send location');
		
		alert('Unable to fetch location: ');

	});

});

// message from server with google map link
socket.on('serverSendingLocationMessage', function(locationMessage) {

	const li = jQuery('<li></li>');
	const a = jQuery('<a target="_blank">My Current Location</a>');

	// time stamp using the installed "momentjs"
	// locationMessage.createdAt is changed to string in message.js file
	const time = moment(locationMessage.createdAt).format('h:mm a');

	li.text(`${ locationMessage.from } (${ time }): ` );
	a.attr('href', locationMessage.url);

	li.append(a);
	jQuery('#messages').append(li);

});
