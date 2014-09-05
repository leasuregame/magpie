package com.LeasureGame.Magpie;

import android.app.Activity;
import android.net.Uri;
import android.os.Bundle;
import android.view.KeyEvent;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class WebLayer extends Activity {
	private WebView webview = null;
	private String url;
	
	public WebLayer(String url) {
		this.url = url;
	}
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
        setContentView(R.layout.notice_webview);
        webview = (WebView) findViewById(R.id.notice_webview);
        WebSettings webSettings = webview.getSettings();
        webSettings.setJavaScriptEnabled(true);
        loadUrl();
	}
	
	public void loadUrl() {
		webview.loadUrl(this.url);
	}
	
	public void close() {
		webview.goBack();
	}
	
	public static WebLayer getInstance(String url) {
		return new WebLayer(url);
	}
}
