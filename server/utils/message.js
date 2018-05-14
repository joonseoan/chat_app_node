// now use moment
const moment = require('moment');

const generateMessage = (from, text) => {

	return {

		from,
		text,

		// 1) createdAt : moment().valueOf()
		createdAt : moment().valueOf()

	};

}

const generateLocationMessage = (from, latitude, longitude) => {

	return {

		from,
		url : `https://www.google.ca/maps?=${latitude},${longitude}`,

		// 1) createdAt : moment().valueOf()
		createdAt : moment().valueOf()

	};

}


module.exports = { generateMessage, generateLocationMessage };
