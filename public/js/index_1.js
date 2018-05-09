const socket = io();

// built-in event
socket.on('connect', function() {

	console.log('connected to the server');

	// email must be able to be sent
	//	 	while the connection is available. 


	socket.emit('youWillSendMessage', {

		to: 'clearclear.com',
		text: 'you too!!!'

	})


	socket.emit('YouJustCreatedEmailAndSentToUs', {

		to: 'parse@parse.com',
		text: 'It might be resolved soon',
		createdAt: new Date()

	});


});

// built-in event
socket.on('disconnect', function() {

	console.log('disconnected to the server');
				
});



socket.on('youGotMessage', (message) => {

	console.log('I got this message', message);

});

// 1)
// just tests a custom event without data
// socket.on('newEmail', function () {

// 	console.log('New Email')

// });

// 2)
// With data

// The reason it is not inside of 'socket.on('connect')'
//		is because the email can stay at the server and then the client is connected to the server
// 		that email can be sent. 
socket.on('youJustGotEmailfromOtherUser', function (email) {

	console.log('New Email: ', email);

});