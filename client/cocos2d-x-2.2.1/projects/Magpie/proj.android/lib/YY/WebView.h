/*
 * WebView.h
 *
 *  Created on: 2014-9-4
 *      Author: arthur
 */

#ifndef WEBVIEW_H_
#define WEBVIEW_H_

class WebView {
private:
	jobject webview;

public:
	WebView(const char * url);
	virtual ~WebView();

	void close();

	static WebView* create(const char * url);
};

#endif /* WEBVIEW_H_ */
