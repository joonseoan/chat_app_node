const path = require('path');
const express = require('express');

// when expresses the current folder
const currentfolder = path.join();

// when expresses the current project name
const currentLocation = __dirname;

// all directory to the current folder
// 		because ".."means that upper folder!!!
const publicPath = path.join(__dirname, '../public');

// it is weired
console.log(`${__dirname}/../public`);

console.log(currentfolder);
console.log(currentLocation);
console.log(publicPath);



const app = express();

app.use(express.static(publicPath));


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

	console.log(`Server is up on port ${PORT}`);

});