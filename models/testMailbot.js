const Mailbot = require('./mailbot.js')();

var testEmailAddress = "";
Mailbot.emailValidationWelcome(testEmailAddress, "newPass");

console.log('Email sent');
