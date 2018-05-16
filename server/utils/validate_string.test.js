const expect = require('expect');

const { isRealString } = require('./validate_string');

describe('isRealString', () => {

	it('should reject non string value', () => {

		const number = 2;
		expect(isRealString(number)).toBe(false);
		
	});

	it('should reject space only', () => {

		const space = "   ";
		expect(isRealString(space)).toBe(false);
		
	});

	it('should allow string with space inside of the string', () => {

		const str = "   aa bb";
		expect(isRealString(str)).toBe(true);

	});

});
