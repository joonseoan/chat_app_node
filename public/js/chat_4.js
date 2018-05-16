const socket = io();

function scrollToBottom() {

	const messages = jQuery('#messages');
	
	const newMessage = messages.children('li:last-child');

	const clientHeight = messages.prop('clientHeight');
	
	const scrollTop = messages.prop('scrollTop');

	const scrollHeight = messages.prop('scrollHeight'); 

	const newMessageHeight = newMessage.innerHeight();

	console.log("prev(): ", newMessage.prev());
	const lastMessageHeight = newMessage.prev().innerHeight();	

	if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {

		messages.scrollTop(scrollHeight);
		console.log('Should scroll');

	}

}

// It is executed first when the user click "join" button. 
// Therefore, 
socket.on('connect', function() {

	// console.log('connected to the server');

	// global object : window.location
	// location.search : value is a query string in URL.
	// For instance, it contains "?name=joon&room=afa" as a string type.

	// jQuery has a method to make query string.
	// jQuery.param({ name: 'joon', age: 25}); // => "name=joon&age=25"
	// Howerver, it can't process "+: space" and so on. 

	// We need to install deparam.js. Then it makes us get value out of query string.
	// Bear in mind that it is an opposite way to jQuery.param();
	const param = jQuery.deparam(window.location.search);

	// use "join" event from index.html
	// Same format socket.emit('join', {object}, promise/callback)
	socket.emit('join', param, function(err) {

		if(err) {

			// err is a message from the server's call
			alert(err);

			// global object
			window.location.href = '/'; // inext.html

		} else {

			console.log('No error!');

		}

	});

});

// Andrew's code
socket.on('userjoined', function (message) {

	console.log( message.text );

});
 
socket.on('youGotMessage', function (message) {

	console.log('I got this message', message);

});

// ===================================== Message <html> ========================================

jQuery('#message-form').on('submit', function(e) {

	e.preventDefault();

	const textBoxMessage = jQuery('[name = message]');
	
	socket.emit('clientSendingMessage', {

		from: 'User1',

		text: textBoxMessage.val()
	
	}, function() { // 		// **************** [callback()]

		textBoxMessage.val('');

	});

});

socket.on('serverSendingMessage', function (message) {

	const time = moment(message.createdAt).format('h:mm a');

	const template = jQuery('#message-template').html();

	Mustache.parse(template);

	const html = Mustache.render(template, {

		text : message.text,
		from : message.from,
		createdAt : time

	});

	jQuery('#messages').append(html);

	scrollToBottom();

});

socket.on('disconnect', function() {

	console.log('disconnected to the server');
				
});

const locationButton = jQuery('#send-location');
locationButton.on('click', function() {

	console.log(navigator.geolocation) // Call a geolocation object
	if(!navigator.geolocation) {

		return alert('Geolocation not supported by your browser');

	}

	locationButton.attr('disabled', 'disabled');

	locationButton.text('Sending location...');

	navigator.geolocation.getCurrentPosition( function(position) {

		// position:  Position {coords: Coordinates, timestamp: 1526336195603}
		console.log('position: ', position);

		locationButton.removeAttr('disabled');
		locationButton.text('Send location');

		// console.log(position.coords.latitude);
		socket.emit('createLocationMessage', {

			latitude: position.coords.latitude,
			longitude: position.coords.longitude

		});

	}, function() {

		locationButton.removeAttr('disabled');
		locationButton.text('Send location');
		
		alert('Unable to fetch location: ');

	});

});

socket.on('serverSendingLocationMessage', function(locationMessage) {

	const time = moment(locationMessage.createdAt).format('h:mm a');
	
	const template = jQuery('#location-message-template').html();

	Mustache.parse(template);

	const rendered = Mustache.render(template, {

		url : locationMessage.url,
		from : locationMessage.from,
		createdAt : time

	})

	jQuery('#messages').append(rendered);

	scrollToBottom();


});
