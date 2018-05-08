console.log('must study web_Server again');

const path = require('path');

// when expresses the current folder
const currentfolder = path.join();

// when expresses the current project name
const currentLocation = __dirname;

// from root directory up to the current folder
// 		because ".."means that upper folder!!!
/**
path.normalize('/foo/bar//baz/asdf/quux/..');
//  => Returns: '/foo/bar/baz/asdf'
*/

// it is weired
// console.log(`${__dirname}/../public`);
const publicPath = path.join(currentLocation, '../public');

console.log(currentfolder);
console.log(currentLocation);

// cient's directory and location
console.log(publicPath);

const express = require('express');

// For socket.io's http communication,
// 		need to explitly declare "http" first. 
const http = require('http');

const socketIO = require('socket.io');

const app = express();

// create httpServr and it encloses "app"
const server = http.createServer(app);
	
// That server is able to use sockeIO
const io = socketIO(server)

// Then, we need to setup the socket.io in the client side.
// http://localhost:3000/socket.io/socket.io.js
// go to the client, index.html.

// Then, we need to register the the event listener.
// The first event is "connection"!
// 'socket' here represents "sockets" from all users 
// 		who try to connect to the server simultaneously

// Then the server allow the client to connec to the server.
// "nodemon" normally disconnects and connects again because
// 		when socket.io connection exists, it tries to keep connected.

io.on('connection', (socket) => {

	console.log('New user connected.');

	// not disconnection
	socket.on('disconnect', () => {

		console.log('disconnected to the client!!!');

	});
});

// Then we should register socket in the client side too.


app.use(express.static(publicPath));

const PORT = process.env.PORT || 3000;

// 'http' is explitly declared to communicates with the client.
// app.listen(PORT, () => {

// 	console.log(`Server is up on port ${PORT}`);

// });

server.listen(PORT, () => {

	console.log(`Server is up on port ${PORT}`);

});



