/*
 * WebBrowser.h
 *
 *  Created on: 2014-9-12
 *      Author: arthur
 */

#ifndef WEBBROWSER_H_
#define WEBBROWSER_H_

class WebBrowser {
public:
	WebBrowser();
	void openWebView(const char* url, int x, int y, int width, int height);
	void updateUrl(const char * url);
	void close();
	virtual ~WebBrowser();
};

#endif /* WEBBROWSER_H_ */
