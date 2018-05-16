// We are not required to import 'moment js'
//		because moment.js file is attached to the front.
// const moment = require('moment');

// mustachejs is same as above.

const socket = io();

function scrollToBottom() {

	// Selectors
	const messages = jQuery('#messages');
	
	// new Message = texts inside of "<li> including itself" 
	//		that will be placed in the bottom of scrollHeight container
	const newMessage = messages.children('li:last-child');

	// Heights
	// clientHeight : height visible in the browser.
	// get property of <ol> (1)
	const clientHeight = messages.prop('clientHeight');
	
	// get prop beyond <ol>
	// top beyond the browser's height which is not visible
	// scrollTop increases as same height as the one of newMessage (2)
	const scrollTop = messages.prop('scrollTop');

	// get the entire height
	// default: 0 (3)
	const scrollHeight = messages.prop('scrollHeight'); 

	// get the height of inner <li>
	// innerHeight() caculates the height and apply it via css (4)
	const newMessageHeight = newMessage.innerHeight();

	// the "text" inside of the previous <li> 
	console.log("prev(): ", newMessage.prev());
	const lastMessageHeight = newMessage.prev().innerHeight();	

	// scrollHeight : Current entire height containg all message
	// default : 0 and and it increases as we type messages.
	if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {

		// send previous messages to the scroll top 
		//		which gets hidden beyond the top of the browser.
		// send height of message in the scrollHeight to "scrollTop"
		messages.scrollTop(scrollHeight);
		console.log('Should scroll');

	}

}

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
	
	}, function() { // 		// **************** [callback()]

		// after sending message, remove that message
		// Normally, we can send value inside of paranthesis like val('message')
		// However, this time, we just need to remove the value.
		textBoxMessage.val('');

	});

});

socket.on('serverSendingMessage', function (message) {

	// console.log('I got this message', message);

	// 2)
	// Using mustache js

	const time = moment(message.createdAt).format('h:mm a');

	// html() => innerHtml : reads the text inside of the tag
	// 1. grap the tag!
	const template = jQuery('#message-template').html();

	// For the future use
	Mustache.parse(template);

	// 2. config the tag gained up above
	const html = Mustache.render(template, {

		// These properites are to map with "template"
		// Do not think about "generateMessage()" in the server side
		text : message.text,
		from : message.from,
		createdAt : time

	});

	// 1) renders once
	// jQuery('#messages').html(rendered);
	
	// 2) renders over and over
	jQuery('#messages').append(html);

	// 3. goest to index.html and setup template

	// execute the function
	scrollToBottom();

// ==============================================


	// 1)
	// // time stamp using the installed "momentjs"
	// // locationMessage.createdAt is changed to string in message.js file
	// const time = moment(message.createdAt).format('h:mm a');

	// // making <li> tag
	// const li = jQuery('<li></li>');
	// li.text(`${ message.from } (${ time }): ${ message.text }`);

	// jQuery('#messages').append(li);

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
	// ****** the first arg = attribute, the second one is value.
	locationButton.attr('disabled', 'disabled');

	// ****** input text in/on the buttton.
	locationButton.text('Sending location...');

	// "getCurrentPosition" fires up the process of geolocation to get coordnates
	// [ Uses Promise ]
	// MDN : navigator.geolocation.getCurrentPosition(success, error, [options])
	navigator.geolocation.getCurrentPosition( function(position) {

		// position:  Position {coords: Coordinates, timestamp: 1526336195603}
		console.log('position: ', position);

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

	// using mustache.js
	const time = moment(locationMessage.createdAt).format('h:mm a');
	
	const template = jQuery('#location-message-template').html();

	Mustache.parse(template);

	const rendered = Mustache.render(template, {

		url : locationMessage.url,
		from : locationMessage.from,
		createdAt : time

	})

	jQuery('#messages').append(rendered);

	// execute the scroll control.
	scrollToBottom();

	// 1)
	// const li = jQuery('<li></li>');
	// const a = jQuery('<a target="_blank">My Current Location</a>');

	// // time stamp using the installed "momentjs"
	// // locationMessage.createdAt is changed to string in message.js file

	// li.text(`${ locationMessage.from } (${ time }): ` );
	
	// // attribute defintion
	// a.attr('href', locationMessage.url);

	// li.append(a);
	// jQuery('#messages').append(li);

});
