/****************************************************************************
Copyright (c) 2010-2012 cocos2d-x.org

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 ****************************************************************************/
package com.LeasureGame.Magpie;

import com.yy.gamesdk.AppInfo;
import com.yy.gamesdk.YYGame;
import com.yy.gamesdk.YYGameSDKScreenOrientation;
import com.yy.gamesdk.callbacks.YYGameSDKCallback;
import com.yy.gamesdk.callbacks.YYGameSDKErrorCode;

import org.cocos2dx.lib.Cocos2dxActivity;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;
import android.widget.LinearLayout.LayoutParams;

public class Magpie extends Cocos2dxActivity {
	public WebView _webview;
	public LinearLayout _weblayout;
	public LinearLayout _topLayout;

	public static Context STATIC_REF = null;
	public static Magpie _magpie;

	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		STATIC_REF = this;
		_magpie = this;

		yySdkInit();
		webViewInit();
	}

	private void yySdkInit() {
		AppInfo info = new AppInfo();
		info.setAppId("MYYDS");
		info.setDebug(true);
		info.setScreenOrientation(YYGameSDKScreenOrientation.ScreenOrientationPortrait);

		Log.d("debug", "before init: " + this.toString() + info.toString());

		YYGame.getInstance().init(this, info, new YYGameSDKCallback<String>() {

			@Override
			public void callback(int error, String data) {
				if (error == YYGameSDKErrorCode.YY_SUCCESS) {
					// Toast.makeText(activity, "初始化成功",
					// Toast.LENGTH_SHORT).show();
					YYWrapper.isInitSuccess = true;
					Log.d("debug", "- 初始化成功");
				} else {
					// Toast.makeText(activity, "初始化失败",
					// Toast.LENGTH_SHORT).show();
					YYWrapper.isInitSuccess = false;
					Log.d("debug", "- 初始化失败");
				}
			}
		});
	}

	public void openAndroidView(final int x, final int y, final int width,
			final int height) {
		this.runOnUiThread(new Runnable() {

			@Override
			public void run() {
				_webview = new WebView(STATIC_REF);
				_weblayout.addView(_webview);

				LinearLayout.LayoutParams linearParams = 
						(LinearLayout.LayoutParams) _webview.getLayoutParams();
				linearParams.leftMargin = x;
				linearParams.topMargin = y;
				linearParams.width = width;
				linearParams.height = height;
				_webview.setLayoutParams(linearParams);
				_webview.setBackgroundColor(0);

				_webview.getSettings().setJavaScriptEnabled(true);
				//_webview.getSettings().setSupportZoom(true);
				//_webview.getSettings().setBuiltInZoomControls(true);

				_webview.requestFocus();
				_webview.setWebViewClient(new WebViewClient() {
					public boolean shouldOverrideUrlLoading(WebView view,
							String url) {
						if (url.indexOf("tel:") > 0) {
							view.loadUrl(url);
						}
						return true;
					}
				});

			}

		});
	}

	public void updateUrl(final String url) {
		this.runOnUiThread(new Runnable() {
			public void run() {
				_webview.loadUrl(url);
			}
		});
	}

	// 移除webView 把刚才加的所有控件都删掉
	public void removeWebView() {
		this.runOnUiThread(new Runnable() {
			public void run() {
				_weblayout.removeView(_webview);
				_webview.destroy();
			}
		});
	}

	public boolean onKeyDown(int keyCoder, KeyEvent event) // 重载函数，android手机实体返回键回调函数
	{
		if (_webview.canGoBack() && keyCoder == KeyEvent.KEYCODE_BACK) {// 如果网页能回退则后退
			_webview.goBack();
		} else {
			//removeWebView();
		}
		return false;
	}

	private void webViewInit() {
		_weblayout = new LinearLayout(this);
		addContentView(_weblayout, new LayoutParams(LayoutParams.FILL_PARENT,
				LayoutParams.FILL_PARENT));

	}

	public static Context getContext() {
		return STATIC_REF;
	}

	public static Magpie getInstance() {
		return _magpie;
	}

	public static String getAppVersion() {
		String version = "";

		try {
			PackageManager pm = STATIC_REF.getPackageManager();
			PackageInfo pi = pm.getPackageInfo(STATIC_REF.getPackageName(), 0);
			version = pi.versionName;
		} catch (Exception e) {
			Log.e("VersionInfo", "Exception", e);
		}

		return version;
	}

	static {
		System.loadLibrary("cocos2djs");
	}

}
