console.log('Now, starting socket.io test!');

const expect = require('expect');

const { generateMessage } = require('./message');


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