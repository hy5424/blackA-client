/**
 * 支付模块
 */

define(function(require, exports, modules) {

	var app = require('app');
	return function(data, wxpaySuccess, wxpayError) {

		// 获取支付通道
		plus.payment.getChannels(function(channels) {
			for(var i = 0; i < channels.length; i++) {
				if(channels[i].id == "wxpay") {

					// 微信支付
					wxPay(channels[i], data);
					break;
				}
			}

			//	plus.ui.toast("使用支付方式:" + channel.id);
		}, function(e) {
			//	plus.ui.toast("获取支付通道失败!");
			app.toast("获取支付通道失败!");
			console.log(e);
		});

		//发起微信支付请求的方法
		function wxPay(channel, data) {

			//发送微信支付请求
			plus.payment.request(channel, data, wxpaySuccess, wxpayError);
		}
	}
});