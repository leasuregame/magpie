var et = require("elementtree");
var fs = require('fs');

// Use webdriverjs to create a Selenium Client
var client = require('webdriverjs').remote({
    desiredCapabilities: {
        // You may choose other browsers
        // http://code.google.com/p/selenium/wiki/DesiredCapabilities
        browserName: 'firefox'
    },
    // webdriverjs has a lot of output which is generally useless
    // However, if anything goes wrong, remove this to see more details
    logLevel: 'silent'
});
 
client.init()
.url('http://127.0.0.1:3000/test')
.waitFor(".runner .description", 60000)
.execute(
    "var results = []; " + 
    "$('.jasmine_reporter .spec').each( function( i, el ) { " + 
        "var suites = $('> .description', el ).text();" + 
        "$( el ).parents( '.suite' ).each( function( j, su ) {" + 
            "suites = $( '> .description', su ).text() + ' > ' + suites;" + 
        "});" + 
        "results[i] = { 'name': suites, 'result': $( el ).hasClass( 'passed' ), 'error': $( '> .messages > .resultMessage ', el ).text() };" +
    "});" + 
    "return JSON.stringify(results);", 
[], function(err, res) {
    ConvertJasmineResults(JSON.parse(res.value));
})
.end();

var ConvertJasmineResults = function(results) {
    console.log('message, ', results);
    var ElementTree = et.ElementTree;
    var element = et.Element;
    var subElement = et.SubElement;

    var suite = element("testsuite");
    suite.set("name", "Jasmine Tests > Socket Api Tests");

    for (var i = 0; i < results.length; i++) {
        res = results[i];
        var testcase = subElement(suite, 'testcase');
        testcase.set("name", res.name);
        if (!res.result) {
            testcase.set('error', res.error);
        }
    }
    var etree = new ElementTree(suite);
    var xml = etree.write({'xml_declaration': false});
    fs.writeFile(__dirname + '/../TESTS-jasmine-api-test.xml', xml, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('jasmine tests completed.');
        }
    });
};