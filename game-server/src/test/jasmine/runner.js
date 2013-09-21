var et = require("elementtree");
var fs = require('fs');
var path = require('path');
var RESULT_PATH = path.join(__dirname, '..', 'TESTS-jasmine-api-test.xml' );

// Use webdriverjs to create a Selenium Client
var client = require('webdriverjs').remote({
    desiredCapabilities: {
        // You may choose other browsers
        // http://code.google.com/p/selenium/wiki/DesiredCapabilities
        browserName: 'safari', //'firefox'
    },
    // webdriverjs has a lot of output which is generally useless
    // However, if anything goes wrong, remove this to see more details
    // logLevel: 'silent'
});

var Run = function() {
    client.init()
        .url('http://127.0.0.1:3000/test')
        .waitFor(".runner .description", 60000 * 10)
        .execute(
            "var results = []; " +
            "$('.jasmine_reporter .spec:not(div.skipped)').each( function( i, el ) { " +
                "var tc = $('> .description', el );" +
                "var suites = tc.text();" +
                "var href = tc.attr('href');" +
                "$( el ).parents( '.suite' ).each( function( j, su ) {" +
                    "suites = $( '> .description', su ).text() + ' > ' + suites;" +
                "});" +
                "results[i] = { " +
                    "'name': suites, " +
                    "'url': href, " +
                    "'result': $( el ).hasClass( 'passed' ), " +
                    "'errorMessage': $( '> .messages > .resultMessage ', el ).text(), " +
                    "'stackTrace': $('> .messages > .stackTrace ', el).text() " + 
                "};" +
            "});" +
            "return JSON.stringify(results);", 
            [], 
            function(err, res) {
                ConvertJasmineResults(JSON.parse(res.value));
            })
        .end();
};

var ConvertJasmineResults = function(results) {
    console.log('message, ', results);
    var ElementTree = et.ElementTree;
    var element = et.Element;
    var subElement = et.SubElement;

    var suite = element("testsuite");
    suite.set("name", "Jasmine Tests > Socket Api Tests");

    var tests = results.length;
    var failures = 0;
    var errors = 0;
    for (var i = 0; i < results.length; i++) {
        res = results[i];
        var testcase = subElement(suite, 'testcase');
        testcase.set("name", res.name);
        testcase.set("url", res.url);
        testcase.set('passed', 'true');
        if (!res.result) {
            testcase.set('passed', 'false');
            var failure = subElement(testcase, 'failure');
            failure.set('message', res.errorMessage)
            failure.text = res.stackTrace;

            failures++;
            errors++;
        }
    }
    suite.set("tests", tests);
    suite.set("failures", failures);
    suite.set("errors", errors);

    var etree = new ElementTree(suite);
    var xml = etree.write({
        'xml_declaration': false
    });
    fs.writeFile(RESULT_PATH, xml, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('jasmine tests completed.');
        }
    });
};

Run();