const isRealString = (str) => {
    
    /*
		str = " ab cd ";
		console.log(str.trim().length)
		length: 5
    
    */
	return typeof str === 'string' && str.trim().length > 0;

}

module.exports = { isRealString };
