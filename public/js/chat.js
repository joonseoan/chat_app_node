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

socket.on('connect', function() {

	// need to install deparam.js. Then it makes us get value out of query string.
	const param = jQuery.deparam(window.location.search);

	// all client (browser) who has namespace of 'join'
	socket.emit('join', param, function(err) {

		if(err) {

			// err is a message from the server's call
			alert(err);

			// global object: redirect
			window.location.href = '/'; // inext.html

		} else {

			console.log('No error!');

		}

	});

});

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
	
	}, function() { 

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

socket.on('updateUserList', function(users) {

	console.log('Users list', users);

	const ol = jQuery('<ol></ol>');

	users.forEach(function(user) {

		ol.append(jQuery('<li></li>').text(user));
	
	});

	// append : increase user number in the userlist
	// html : it doe not incease a number of the same user
	jQuery('#users').html(ol);

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
