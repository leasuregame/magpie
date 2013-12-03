var request = require('request');

request.post({
	headers: {
		'content-type': 'application/json'
	},
	url: 'https://sandbox.itunes.apple.com/verifyReceipt',
	json: {
		"receipt-data": 
		new Buffer('{"signature" = "Ao+R9ZtvcgkhjOi2Ha3mleboyJFIq6n+ZqAMTuowgUUp5365iz76uIiBqndla19FPSXRs+L9jw9f0Am+Vq+DRVKUNL0vDa3KhwymQvv+Z7xhxS/2Ln0RwyDn/BE3LcYWVUhSMYWHgz4sSZpHBVTYE5DICWmEUzDQZfE94+mFO1o7AAADVzCCA1MwggI7oAMCAQICCGUUkU3ZWAS1MA0GCSqGSIb3DQEBBQUAMH8xCzAJBgNVBAYTAlVTMRMwEQYDVQQKDApBcHBsZSBJbmMuMSYwJAYDVQQLDB1BcHBsZSBDZXJ0aWZpY2F0aW9uIEF1dGhvcml0eTEzMDEGA1UEAwwqQXBwbGUgaVR1bmVzIFN0b3JlIENlcnRpZmljYXRpb24gQXV0aG9yaXR5MB4XDTA5MDYxNTIyMDU1NloXDTE0MDYxNDIyMDU1NlowZDEjMCEGA1UEAwwaUHVyY2hhc2VSZWNlaXB0Q2VydGlmaWNhdGUxGzAZBgNVBAsMEkFwcGxlIGlUdW5lcyBTdG9yZTETMBEGA1UECgwKQXBwbGUgSW5jLjELMAkGA1UEBhMCVVMwgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAMrRjF2ct4IrSdiTChaI0g8pwv/cmHs8p/RwV/rt/91XKVhNl4XIBimKjQQNfgHsDs6yju++DrKJE7uKsphMddKYfFE5rGXsAdBEjBwRIxexTevx3HLEFGAt1moKx509dhxtiIdDgJv2YaVs49B0uJvNdy6SMqNNLHsDLzDS9oZHAgMBAAGjcjBwMAwGA1UdEwEB/wQCMAAwHwYDVR0jBBgwFoAUNh3o4p2C0gEYtTJrDtdDC5FYQzowDgYDVR0PAQH/BAQDAgeAMB0GA1UdDgQWBBSpg4PyGUjFPhJXCBTMzaN+mV8k9TAQBgoqhkiG92NkBgUBBAIFADANBgkqhkiG9w0BAQUFAAOCAQEAEaSbPjtmN4C/IB3QEpK32RxacCDXdVXAeVReS5FaZxc+t88pQP93BiAxvdW/3eTSMGY5FbeAYL3etqP5gm8wrFojX0ikyVRStQ+/AQ0KEjtqB07kLs9QUe8czR8UGfdM1EumV/UgvDd4NwNYxLQMg4WTQfgkQQVy8GXZwVHgbE/UC6Y7053pGXBk51NPM3woxhd3gSRLvXj+loHsStcTEqe9pBDpmG5+sk4tw+GK3GMeEN5/+e1QT9np/Kl1nj+aBw7C0xsy0bFnaAd1cSS6xdory/CUvM6gtKsmnOOdqTesbp0bs8sn6Wqs0C9dgcxRHuOMZ2tm8npLUm7argOSzQ==";"purchase-info" = "ewoJIm9yaWdpbmFsLXB1cmNoYXNlLWRhdGUtcHN0IiA9ICIyMDEzLTExLTI5IDAyOjE2OjAxIEFtZXJpY2EvTG9zX0FuZ2VsZXMiOwoJInVuaXF1ZS1pZGVudGlmaWVyIiA9ICJhZWM2MzdlMjcyZjBiMjAwYWY2NDU3Yzg2MjA1MDQ0NjgxNzA2ODQ4IjsKCSJvcmlnaW5hbC10cmFuc2FjdGlvbi1pZCIgPSAiMTAwMDAwMDA5NTA4NTc1MCI7CgkiYnZycyIgPSAiMS4wIjsKCSJ0cmFuc2FjdGlvbi1pZCIgPSAiMTAwMDAwMDA5NTA4NTc1MCI7CgkicXVhbnRpdHkiID0gIjEiOwoJIm9yaWdpbmFsLXB1cmNoYXNlLWRhdGUtbXMiID0gIjEzODU3MjAxNjE3MjciOwoJInVuaXF1ZS12ZW5kb3ItaWRlbnRpZmllciIgPSAiNjRCN0Y4ODItMTBDQi00QkQ3LUFBQTgtRTAxM0E1QzlBRkI4IjsKCSJwcm9kdWN0LWlkIiA9ICJjb20ubGVhc3VyZWdhbWUubWFncGllLnBheTEyOCI7CgkiaXRlbS1pZCIgPSAiNzY1MTkwNTY0IjsKCSJiaWQiID0gImNvbS5MZWFzdXJlR2FtZS5NYWdwaWUiOwoJInB1cmNoYXNlLWRhdGUtbXMiID0gIjEzODU3MjAxNjE3MjciOwoJInB1cmNoYXNlLWRhdGUiID0gIjIwMTMtMTEtMjkgMTA6MTY6MDEgRXRjL0dNVCI7CgkicHVyY2hhc2UtZGF0ZS1wc3QiID0gIjIwMTMtMTEtMjkgMDI6MTY6MDEgQW1lcmljYS9Mb3NfQW5nZWxlcyI7Cgkib3JpZ2luYWwtcHVyY2hhc2UtZGF0ZSIgPSAiMjAxMy0xMS0yOSAxMDoxNjowMSBFdGMvR01UIjsKfQ==";"environment" = "Sandbox";"pod" = "100";"signing-status" = "0";}'
		).toString('base64')
	}
}, function(err, res, body) {
	console.log(err);
	//console.log(res);
	console.log(body);
});	

/*
 
{ receipt: 
   { original_purchase_date_pst: '2013-11-29 02:16:01 America/Los_Angeles',
     purchase_date_ms: '1385720161727',
     unique_identifier: 'aec637e272f0b200af6457c86205044681706848',
     original_transaction_id: '1000000095085750',
     bvrs: '1.0',
     transaction_id: '1000000095085750',
     quantity: '1',
     unique_vendor_identifier: '64B7F882-10CB-4BD7-AAA8-E013A5C9AFB8',
     item_id: '765190564',
     product_id: 'com.leasuregame.magpie.pay128',
     purchase_date: '2013-11-29 10:16:01 Etc/GMT',
     original_purchase_date: '2013-11-29 10:16:01 Etc/GMT',
     purchase_date_pst: '2013-11-29 02:16:01 America/Los_Angeles',
     bid: 'com.LeasureGame.Magpie',
     original_purchase_date_ms: '1385720161727' },
  status: 0 
}

*/