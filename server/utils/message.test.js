console.log('Now, starting socket.io test!');

const expect = require('expect');

const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {

	it('should generate correct message', () => {

		const from = 'Mike';
		const text = 'Oh yeah!!';
		const message = generateMessage(from, text);

		expect(message.createdAt).toBeA('number');
		expect(message).toInclude({

			from,
			text

		});

	});

});

describe('generateLocationMessage', () => {

	it('should generate correct Location', () => {

		const from = 'Admin';
		const lat = 'abc';
		const long = 'def';
		const locationMessage = generateLocationMessage(from, lat, long);

		expect(locationMessage.createdAt).toBeA('number');
		expect(locationMessage.url).toBe(`https://www.google.com/maps?=${lat},${long}`);

	});

});