// Use webdriverjs to create a Selenium Client
var client = require('webdriverjs').remote({
    desiredCapabilities: {
        // You may choose other browsers
        // http://code.google.com/p/selenium/wiki/DesiredCapabilities
        browserName: 'chrome'
    },
    // webdriverjs has a lot of output which is generally useless
    // However, if anything goes wrong, remove this to see more details
    // logLevel: 'silent'
});
 
client.init();
client.url('http://127.0.0.1:3000/test')
client.getTitle(function(title){
    console.log('Title is', title);
});
client.waitFor(".finished-at", 60000,function(){
	client.getText(".runner failed", function(text){
		console.log('Text: ', text);
	});
	//client.end();
});
//client.end();