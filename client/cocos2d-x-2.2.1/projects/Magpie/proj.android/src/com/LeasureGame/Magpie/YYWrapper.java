package com.LeasureGame.Magpie;

import com.yy.gamesdk.AppInfo;
import com.yy.gamesdk.LoginInfo;
import com.yy.gamesdk.PayInfo;
import com.yy.gamesdk.YYGame;
import com.yy.gamesdk.YYGameSDKScreenOrientation;
import com.yy.gamesdk.callbacks.YYGameSDKCallback;
import com.yy.gamesdk.callbacks.YYGameSDKErrorCode;

import android.content.Context;
import android.app.Activity;
import android.util.Log;
import android.widget.Toast;

public class YYWrapper {
	protected static boolean isInitSuccess = false;
	protected static boolean isLoginSuccess = false;
	protected static String sid;
	protected static String time;
	protected static String account;
	protected static String userName;
	protected static boolean isPaySuccess;
	
	public static String getInitResult() {
		Log.d("debug", "- get init result- ");
		Log.d("debug", String.valueOf(YYWrapper.isInitSuccess));
		if (YYWrapper.isInitSuccess) {
			return "true";
		} else {
			return "false";
		}
	}
	
	public static void login(Context ctx) {
		final Activity activity = (Activity)ctx;
		
		YYGame.getInstance().login(activity, new YYGameSDKCallback<LoginInfo>(){
			
			@Override
			public void callback(int error, LoginInfo data) {
				if (error == YYGameSDKErrorCode.YY_SUCCESS) {
					YYWrapper.sid = data.getSid();
					YYWrapper.time = data.getTime();
					YYWrapper.account = data.getAccount();
					YYWrapper.userName = data.getUsername();
					
					YYWrapper.isLoginSuccess = true;
					Log.i("", " - 登陆成功");
					//Toast.makeText(activity, "登陆成功", Toast.LENGTH_SHORT).show();
				} else {
					Log.i("", " - 登陆取消");
					YYWrapper.isLoginSuccess = false;
					//Toast.makeText(activity, "登陆取消", Toast.LENGTH_SHORT).show();
				}
			}
		});
	}
	
	public static String getLoginResult() {
		Log.d("debug", "- get login result- ");
		Log.d("debug", String.valueOf(YYWrapper.isLoginSuccess));
		
		return String.valueOf(YYWrapper.isLoginSuccess);
	}
	
	public static String getSid(){
		return YYWrapper.sid;
	}
	
	public static String getTime(){
		return YYWrapper.time;
	}
	
	public static String getAccount(){
		return YYWrapper.account;
	}
	
	public static String getUserName() {
		return YYWrapper.userName;
	}
	
	public static void enterGameServer(String gameServer, String roleId, String roleName) {
		Log.d("debug", "enterGameServer()");
		YYGame.getInstance().enterGameServer(gameServer, roleId, roleName);
	}
	
	public static void pay(Context ctx, String areaId, String playerId, String playerName, 
			String productId, String productName, float price) {
		final Activity activity = (Activity) ctx;
		PayInfo payinfo = new PayInfo();
		payinfo.setServerId(areaId);
		payinfo.setRoleId(playerId);
		payinfo.setRoleName(playerName);
		payinfo.setProductId(productId);
		payinfo.setProductName(productName);
		payinfo.setProductCount(1);
		payinfo.setPrice(price);
		
		YYGame.getInstance().pay(activity, payinfo, new YYGameSDKCallback<String>() {
			
			@Override
			public void callback(int error, String data){
				if (error == YYGameSDKErrorCode.YY_SUCCESS) {
					Toast.makeText(activity, "充值成功", 2000).show();
					YYWrapper.isPaySuccess = true;
				 }else if (error == YYGameSDKErrorCode.YY_PAY_CANCEL){
					 Toast.makeText(activity, "取消了充值", 2000).show();
					 YYWrapper.isPaySuccess = false;
				 }
			}
		});
	}
	
	public static String getPayResult() {
		return String.valueOf(YYWrapper.isPaySuccess);
	}
	
	public static void exitSDK(Context ctx) {
		final Activity act = (Activity) ctx;
		YYGame.getInstance().exitSDK(act, new YYGameSDKCallback<String>() {

			@Override
			public void callback(int error, String data) {
				if (error == YYGameSDKErrorCode.YY_SDK_EXIT) {
					Toast.makeText(act, "退出游戏", Toast.LENGTH_SHORT).show();
				} else if (error == YYGameSDKErrorCode.YY_SDK_CONTINUE) {
					Toast.makeText(act, "继续游戏", Toast.LENGTH_SHORT).show();
				}
			}
		});
	}
}
