// UTC Time Stamp : Jan 1st 1970 00:00:00 am

// Based on the UTB up and above,
// + 1000 => // UTC Time Stamp : Jan 1st 1970 00:00:01 am
// - 1000 => // UTC Time Stamp : Jan 1st 1969 59:59:59 pm

// time stamp but it is too complicated. 
// new Date().getTime();

// we should install "moment". It is a simple way.

const moment = require('moment');

const date = moment();
const date1 = moment();
const date2 = moment();
const date3 = moment();

// normal format same as "new Date()"
console.log(date.format());

// get a short version of months
// "format()" returns string, by the way.
console.log(date1.format('MMM Do YYYY'));

// year and years are same!!!!
const dato = date2.add(1, 'years').subtract(3, 'years'); // May 14th 2016
console.log(dato.format('MMM Do YYYY')); // moment("2019-05-14T15:56:12.624")

// year and years are same!!!!
const datoo = date3.add(1, 'year').subtract(3, 'year'); // May 14th 2014
console.log(datoo.format('MMM Do YYYY')); // moment("2020-05-14T15:57:36.021")

const hundatoo = date.add(100, 'year');
console.log(hundatoo.format('MMM Do YYYY')); // moment("2020-05-14T15:57:36.021")

const ddd = date.add(100, 'year').subtract(9, 'month');
console.log(ddd.format('MMM Do YYYY'));

const time = moment();
console.log(time.format('h:mm a'));


// When we use UTC time stamp!!!!!!!!!!!!!1111
const createdAt = 123555555;
const dattoo = moment(createdAt);
console.log(dattoo.format('h:mm a'));

// It is thing I wanted to get!!!!
const createdWhen = new Date().getTime().valueOf();
const dday = moment(createdWhen);
console.log(dday.format('h:mm a in MMM Do YYYY'));

// making string
// "valueOf()" method returns the primitive value of a String object.
// moment() // => number type
const someTimestamp = moment().valueOf();
console.log(someTimestamp);


