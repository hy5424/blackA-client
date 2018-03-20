define(function(require, exports, module) {
	exports.getInfo = function (){
		var device = {
			IMEI: plus.device.imei,
			IMSI: "",
			Plateform:'',
			NativeVersion:plus.runtime.version,
			Version:'',
			Model: plus.device.model,
			Vendor: plus.device.vendor,
			UUID: plus.device.uuid,
			Screen: plus.screen.resolutionWidth * plus.screen.scale + " x " + plus.screen.resolutionHeight * plus.screen.scale + "",
			DPI: plus.screen.dpiX + " x " + plus.screen.dpiY,
			OS: new Object()
		};
		for (var i = 0; i < plus.device.imsi.length; i++) {
			device.IMSI += plus.device.imsi[i];
		}
		// 获取本地应用资源版本号
		plus.runtime.getProperty(plus.runtime.appid, function(info){
			Version=info.version;
		});
		var types = {};
		types[plus.networkinfo.CONNECTION_UNKNOW] = "未知";
		types[plus.networkinfo.CONNECTION_NONE] = "未连接网络";
		types[plus.networkinfo.CONNECTION_ETHERNET] = "有线网络";
		types[plus.networkinfo.CONNECTION_WIFI] = "WiFi网络";
		types[plus.networkinfo.CONNECTION_CELL2G] = "2G蜂窝网络";
		types[plus.networkinfo.CONNECTION_CELL3G] = "3G蜂窝网络";
		types[plus.networkinfo.CONNECTION_CELL4G] = "4G蜂窝网络";
		device.NetworkInfo = types[plus.networkinfo.getCurrentType()];
		if(plus.tools.platform==plus.tools.ANDROID) {
			device.Plateform="ANDROID";
		} else if (plus.tools.platform==plus.tools.IOS){
			device.Plateform="IOS";
		}
		device.OS = {
			Language: plus.os.language,
			Version: plus.os.version,
			Name: plus.os.name,
			Vendor: plus.os.vendor
		};
		return device;
	}
});