'use strict';

define(function(require, exports) {

	exports.open = function(url) {
		alert(123);
		// 5+引擎初始化完毕
		var plusReady = function(callback) {
			if(window.plus) {
				callback();
			} else {
				document.addEventListener('plusready', callback);
			}
		};
		// 内置浏览器
		var browser = {};
		// 初始化
		browser.init = function() {
			this.initWebview();
			this.handleEvent();
		};
		// 初始化webview相关
		browser.initWebview = function() {
			var _self = this;
			
			// 创建webview
			_self.webview = plus.webview.create('', 'browser', {
				titleNView: {
					titleColor: '#fff',
					backgroundColor: '#36353b',
					progress: { //进度条
						color: '#64ba6c',
						height: '2px'
					},
					splitLine: { //底部分割线
						color: '#cccccc',
						height: '1px'
					},
					buttons: [
					{ //后退按钮
						'float': 'left',
						fontSize: '18px',
						fontSrc: '_www/ins/public/fonts/browser.ttf',
						text: '\ue603',
						onclick: _self.back.bind(_self) //指定函数的上下文为browser，否则是当前这个对象；
					}, 
					{ //前进箭头
						'float': 'left',
						fontSrc: '_www/ins/public/fonts/browser.ttf',
						text: '\ue602',
						onclick: _self.forward.bind(_self)
					}, 
					{ //关闭按钮
						'float': 'left',
						fontSrc: '_www/ins/public/fonts/browser.ttf',
						text: '\ue601',
						onclick: _self.close.bind(_self)
					}, 
					{ //刷新按钮
						'float': 'right',
						fontSize: '18px',
						fontSrc: '_www/ins/public/fonts/browser.ttf',
						text: '\ue600',
						onclick: _self.reload.bind(_self)
					}]
				},
				backButtonAutoControl:'close'
			});
			
			// 配置下拉刷新  false 禁用
			_self.webview.setPullToRefresh({
				support: false
			}, function() {
				
				_self.reload();
				
				var titleUpdate = function() {
					setTimeout(function() {
						_self.webview.endPullToRefresh();
						_self.webview.removeEventListener('titleUpdate', titleUpdate);
					}, 300);
				};
				_self.webview.addEventListener('titleUpdate', titleUpdate);
			});
		};
		
		// 绑定事件
		browser.handleEvent = function() {
			var _self = this;
			
			_self.show();
			
//			plus.key.addEventListener('backbutton', function() {
//				
//				var topWebview = plus.webview.getTopWebview();
//				
//				// 不等于浏览器窗口
//				if(topWebview.id == 'browser') {
//					_self.back();
//				} else {
//					// 这里除了浏览器窗口就是首页了，直接退出了；
//					//plus.runtime.quit();
//				}
//			});
		};
		
		// 显示浏览器
		browser.show = function() {
			
			url = url || '../../../404.html';
			this.webview.loadURL(url);
			this.webview.show('slide-in-right');
		};
		
		// 后退
		browser.back = function() {
			var _self = this;
			_self.webview.canBack(function(event) {
				if(event.canBack) {
					_self.webview.back();
				} else {
					_self.close();
				}
			});
		};
		
		// 前进
		browser.forward = function() {
			var _self = this;
			_self.webview.canForward(function(event) {
				if(event.canForward) {
					_self.webview.forward();
				} else {
					plus.nativeUI.toast('没有可前进的地址');
				}
			});
		};
		
		// 刷新
		browser.reload = function() {
			this.webview.reload(true);
		};
		
		// 关闭
		browser.close = function() {
			this.webview.hide('slide-out-right');
			this.webview.clear();
		};
		
		plusReady(function() {
			browser.init();
		});
	};
});