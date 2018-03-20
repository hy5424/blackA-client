/**
 *  app 模块
 * 	@description    集合mui核心模块以及其它插件模块 
 *  @requires 		{object} mui
 * 	@version  		v2.0
 * 
 */

define(function(require, exports) {

	// 加载mui.js
	var self = require('mui/js/mui');

	// app 私有方法
	var _self = {};

	// 微信运行环境识别
	self.platform = (function() {
		var ua = window.navigator.userAgent.toLowerCase();

		if(ua.match(/MicroMessenger/i) == 'micromessenger') {
			wxConfig();
			return 'wx';
		} else
		if(ua.match(/html5plus/i) == 'html5plus') {
			console.log('开启5+环境配置----------------> plusConfig');
			return '5+';
		} else {
			debugConfig();
			return 'debug';
		}

		function wxConfig() {

			self.plusReady = function(callback) {
				callback();
			};

			console.log('开启微信环境配置----------------> wxConfig');

			// 禁用后退按钮
			if(top.location.href.indexOf('app/home/main.html') > -1) {

				history.pushState(null, null, document.URL);

				window.addEventListener('popstate', function() {
					history.pushState(null, null, document.URL);
				});
			}

		}

		function debugConfig() {
			self.plusReady = function(callback) {
				callback();
			};

			console.log('开启debug环境配置----------------> debugConfig');

		}

	})();

	//	self.baseUrl = 'http://192.168.1.31:8082/csh_apps';
	//	self.baseUrl = 'http://192.168.1.44:8081/csh_apps';
	self.baseUrl = 'http://192.168.1.104:8081/blackA';
	//	self.baseUrl = 'https://life.lanchain.com/csh_apps';

	/**
	 * 沉浸式效果
	 */
	self.setCurPageStatusFullPage = function(iosColor) {
		//		if(window.plus) {
		// 兼容immersed状态栏模式
		//			if(plus.navigator.isImmersedStatusbar()) {
		//				var immersed = 0;
		//				var ms = (/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent);
		//				// 当前环境为沉浸式状态栏模式
		//				if(ms && ms.length >= 3) {
		//					immersed = parseFloat(ms[2]); // 获取状态栏的高度
		//				}
		//				topoffset = (immersed + 45) + 'px';
		//				/*调整高度*/
		//				var nav = document.querySelector(".mui-bar-nav");
		//				if(nav) {
		//					document.querySelector(".mui-bar-nav").style.paddingTop = immersed + 'px';
		//					document.querySelector(".mui-bar-nav").style.height = topoffset;
		//				}
		//
		//				//document.querySelector(".mui-content").style.marginTop = immersed + 'px';
		//			}
		//			if(mui.os.ios) {
		//				plus.navigator.setStatusBarBackground(iosColor ? iosColor : "#755cd2");
		//			}
		//		}
	}
	/**
	 *  sessionStorage  localStorage 封装
	 *  @description sessionStorage 暂时性存储，app关闭，数据清除；localStorage 永久性存储
	 *  @param {string} $name   数据名称
	 *  @param {param}  value  数据值
	 */
	_self.watchStorage = function($name, $value) {
		if($name === '' || $name === undefined) {
			throw new Error('app 操作异常:保存数据时name值非法,不能为undefined 或 空');
		}
		if($value === '' || $value === undefined) {
			self.log.warn('app.save 警告', 'value 值为 ' + $value);
		}
	};
	_self.parseStorage = function($value) {
		return typeof $value === 'string' ? $value : typeof $value === 'number' ? $value.toString() : typeof $value === 'object' ? JSON.stringify($value) : undefined;
	};
	self.save = function($name, $value) {
		_self.watchStorage($name, $value);
		_self.parseStorage($value)
		localStorage.setItem($name, $value);
	};
	self.cache = function($name, $value) {
		_self.watchStorage($name, $value);
		_self.parseStorage($value)
		sessionStorage.setItem($name, $value);
	};

	/**
	 *  读取存储数据
	 *  @description 读取sessionStorage  localStorage中数据
	 *  @param  {string} $name
	 *  @return {string} value
	 */
	_self.watchGet = function($name) {
		if($name === '' || $name === undefined) {
			throw new Error('app 操作异常:读取数据时name值非法,不能为undefined 或 空');
		}
	};
	_self.parseGet = function($value) {
		return typeof $value === 'string' ? $value : typeof $value === 'number' ? $value.toString() : typeof $value === 'object' ? JSON.stringify($value) : undefined;
	};
	self.getSave = function($name) {
		_self.watchGet($name);
		return localStorage.getItem($name);
	};
	self.getCache = function($name) {
		_self.watchGet($name);
		var value = sessionStorage.getItem($name);
		if(value === null) {
			self.log.warn('app.getCache ', $name + ' 值为  null');
		}
		return value;
	};

	/**
	 *  清除localStorage 数据
	 *  @param {string} name
	 */
	self.removeSave = function($name) {
		if($name === '' || $name === undefined) {
			throw new Error('app 操作异常:删除数据时name值非法,不能为undefined 或 空');
		}
		localStorage.removeItem($name);
	};

	/**
	 *  清除sessionStorage 数据
	 *  @param {string} name
	 */
	self.removeCache = function($name) {
		if($name === '' || $name === undefined) {
			throw new Error('app 操作异常:删除数据时name值非法,不能为undefined 或 空');
		}
		sessionStorage.removeItem($name);
	};

	/**
	 *  缓存、读取、清除token
	 *  @param {string} auth_token
	 */
	self.save.token = function(token) {
		self.save('auth_token', token);
	};
	self.getSave.token = function() {
		return self.getSave('auth_token');
	};
	self.removeSave.token = function() {
		localStorage.removeItem('auth_token');
	};

	/**
	 *  缓存、读取、清除用户信息
	 *  @param {string} userInfo
	 */
	self.save.userInfo = function(userInfo) {
		userInfo = typeof userInfo == 'string' ? userInfo : JSON.stringify(userInfo);
		self.save('userInfo', userInfo);
	};
	self.getSave.userInfo = function() {
		return self.getSave('userInfo');
	};
	self.removeSave.userInfo = function() {
		localStorage.removeItem('userInfo');
	};

	/**
	 *  打开新页面
	 *  @param {Object} page
	 */
	self.open = function(page, target) {

		if(!!window.plus) {

			this.openWindow(page);
		} else {
			var url = page.url + "?";
			for(var key in page.extras) {
				url += key + "=" + page.extras[key] + "&";
			}

			url = url.substr(0, url.length - 1);
			if(target) {

				switch(target) {
					case "top":
						top.location.href = encodeURI(encodeURI(url));
						break;
					case "parent":
						parent.location.href = encodeURI(encodeURI(url));
						break;
					default:
						top.location.href = encodeURI(encodeURI(url));
				}

			} else {
				location.href = encodeURI(encodeURI(url));
			}

		}
		//event.stopPropagation();
	};

	/**
	 *  获取url 参数
	 *  @param {Object} name
	 */
	self.getUrlParam = function(name) {

		if(!!window.plus) {
			var param = plus.webview.currentWebview();

			return param[name];
		} else {

			var url = decodeURI(decodeURI(location.href));

			if(url.indexOf('?') == -1) {
				return undefined;
			}

			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = url.split('?')[1].substr(0).match(reg);
			if(r === undefined || r === null) {
				this.log.warn('app.getUrlParam ', name + ' 值为  ' + r);
			} else {
				return r[2];
			}
		}
	};

	/**
	 *  log 模块
	 *  1.默认打印
	 *  2.警告打印  warn
	 *  3.错误打印  error
	 *  4.信息打印  info
	 *  5.ajax日志 _ajax
	 *  @param {String} title 提示标题
	 *  @param {String} content 提示内容
	 */
	self.log = (function($, _$) {

		/**
		 *  默认打印
		 *  @param {Object} data
		 */
		function log(data) {
			if(mui.os.plus) {
				console.log(typeof data === 'string' ? data : JSON.stringify(data));
			} else {
				console.log(data, '\n');
			}
		}

		_$._log = log;
		// 警告日志
		log.warn = function(title, content) {

			console.warn(' 警告:\n--- start :\n' + title + '=> ' + content + '\n--- end \n\n');
		};

		// 错误日志
		log.error = function(title, content) {
			console.warn(' 错误:\n--- start :\n' + title + '=> ' + content + '\n--- end \n\n');
		};

		// 信息日志
		log.info = function(title, content) {
			console.warn(' 信息:\n--- start :\n' + title + '=> ' + content + '\n--- end \n\n');
		};

		// ajax 请求响应日志
		_$._log._ajax = function(param, content) {

			console.log('-- ajax request logger start :');

			console.log('请求地址 : ' + param.url);
			console.log('请求参数 : ' + param.data);
			console.log('请求响应 : ' + content);

			console.log('-- ajax request logger end\n');
		};

		return log;
	})(self, _self);

	/**
	 *  ajax 模块
	 *  @param {object} parameter 请求参数
	 */

	self.request = function(parameter, $, _$) {
		$ = self;
		_$ = _self;

		/**
		 *  监控parameter
		 *  @description 若不是一个object，抛出异常
		 */
		if(!self.isObject(parameter)) {
			throw new Error('app 操作异常:调用ajajx时参数非法,必须为object');
		}

		/**
		 * ajax参数处理
		 * @param {Object} parameter 传递参数
		 */
		var ajaxArguments = (function(parameter) {

			/**
			 *  ajax 请求参数定义
			 * 
			 *  @return {object} 合并后的请求参数
			 */

			var ajaxParams = {
				url: parameter.url.indexOf('http') != -1 ? parameter.url : $.baseUrl + parameter.url,
				type: parameter.type || 'POST',
				async: 'async' in parameter ? parameter.async : true,
				data: (this.type === 'GET' || this.type === 'get') ? null : parameter.data,
				timeout: 10000
			};

			// 日志内容
			var logPamram = {
				url: ajaxParams.url,
				data: JSON.stringify(parameter.data)
			};

			ajaxParams.context = ajaxParams; // 禁止修改执行环境
			ajaxParams.headers = parameter.headers || {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
			};

			if(!parameter.protoType) {
				parameter.protoType = {};
			}

			// ajax 默认的回调处理,支持覆盖修改
			ajaxParams.protoType = {
				beforeSend: parameter.protoType.beforeSend || function() {
					//$.showWaiting('正在处理...');
				},
				success: parameter.protoType.success || function(res) {
					//$.toast(res.msg);
				},
				fail: parameter.protoType.fail || function(res) {
					$.toast(res.msg || '处理失败' + '[' + res.code + ']');
				},
				error: parameter.protoType.error || function(res, that) {

					$.toast(res.msg);
					//that.requestError(res.msg);
				},
				complete: parameter.protoType.complete || function(xhr, status, that) {
					$.closeWaiting();
				}
			};

			// ajax 客户端自定义处理
			ajaxParams.extend = {
				beforeSend: parameter.beforeSend || $.noop,
				success: parameter.success || $.noop,
				fail: parameter.fail || $.noop,
				error: parameter.error || $.noop,
				timeout: parameter.timeout || $.noop,
				complete: parameter.complete || $.noop
			};

			ajaxParams.beforeSend = function() {

				this.protoType.beforeSend();
				this.extend.beforeSend();
			};

			ajaxParams.success = function(res, status, xhr) {

				if(res.hasOwnProperty('code')) {

					// 请求成功，返回数据
					if(res.code == '0000') {
						//测试将token失效
						//						self.save('auth_token', "");
						this.protoType.success(res, status, xhr);
						this.extend.success(res, status, xhr);
					} else
						// 会话过期
						if(res.code == 'I0002') {

							//							$.alert(res.msg);
							if(window.plus) {
								//获取www文件夹，然后跳转到对应的登录页面
								plus.io.resolveLocalFileSystemURL("_www/app/login/login.html", function(entry) {
									// 可通过entry对象操作test.html文件 
									entry.file(function(file) {
										var login = "file://" + file.fullPath;
										$.openWindow({
											url: login,
											id: 'login.html'
										});

									});

								}, function(e) {
									$.alert("请尝试重启应用");
								});

							}

						}

					// 请求失败，返回结果未知
					else {

						this.protoType.fail(res, status, xhr);
						this.extend.fail(res, status, xhr);

					}
				} else {

					// 处理不遵循response 规范的请求响应
					this.protoType.success(res, status, xhr);
					this.extend.success(res, status, xhr);
					//this.protoType.fail(res, status, xhr);
					//this.extend.fail(res, status, xhr);
				}

			};
			ajaxParams.error = function(xhr, type, errorThrown) {
				// 设置返回数据
				var res = {
					code: 'XXXX'
				};

				// 请求未发出
				if(xhr.status == 0) {

					if(navigator.onLine) {

						if(type == 'timeout') {

							xhr.abort();
							//this.requestTimeout();
							$.toast('连接超时');
							return;
						} else {

							// 服务器拒绝访问
							res.msg = '连接服务器失败，请重试 ):';
							if(window.plus) {
								//获取www文件夹，然后跳转到对应的登录页面
								plus.io.resolveLocalFileSystemURL("_www/app/login/login.html", function(entry) {
									// 可通过entry对象操作test.html文件 
									entry.file(function(file) {
										var login = "file://" + file.fullPath;
										$.openWindow({
											url: login,
											id: 'login.html'
										});

									});

								}, function(e) {
									$.alert("请尝试重启应用");
								});

							}
						}

					} else {
						// 未联网
						res.msg = '加载失败,请检查网络连接   ):';
						if(window.plus) {
							//获取www文件夹，然后跳转到对应的登录页面
							plus.io.resolveLocalFileSystemURL("_www/app/login/login.html", function(entry) {
								// 可通过entry对象操作test.html文件 
								entry.file(function(file) {
									var login = "file://" + file.fullPath;
									$.openWindow({
										url: login,
										id: 'login.html'
									});

								});

							}, function(e) {
								$.alert("请尝试重启应用");
							});

						}
					}
				} else

					// 数据解析错误
					if(xhr.status == 200) {
						res.msg = errorThrown || '数据解析错误 ):';
					} else

						// 客户端错误
						if(xhr.status >= 400 && xhr.status < 500) {
							res.msg = errorThrown || '身份验证失败  ):';
						} else

							// 服务端错误
							if(xhr.status >= 500) {
								res.msg = errorThrown || '服务器繁忙   ):';
							}

				else {
					res.msg = '请求发生未知错误   ):';
				}

				this.protoType.error(res, this);
				this.extend.error(res);
			};

			ajaxParams.complete = function(xhr, status) {

				// 打印请求日志
				_$._log._ajax(logPamram, xhr.responseText);

				// 默认关闭加载提示
				this.protoType.complete(xhr, status, this);
				this.extend.complete(xhr, status);
			};

			/**
			 *  请求发生错误页面处理
			 *  
			 *  @param {string} msg 错误信息
			 */
			ajaxParams.requestError = function(msg) {
				var div = document.createElement('div');
				div.setAttribute('class', 'cm-request-error');
				div.innerHTML = msg;

				var article = document.getElementsByTagName('article');
				if(article.length !== 0) {
					article[0].innerHTML = '';
					article[0].appendChild(div);
				} else {
					var _article = document.createElement('article');
					_article.setAttribute('class', 'mui-content')
					_article.innerHTML = div;
					document.getElementsByTagName('body')[0].appendChild(_article);
				}

				//document.getElementsByTagName('article')[0].innerHTML = msg;
			};

			return ajaxParams;

		})(parameter);

		/**
		 *  调用 mui ajax
		 *  @param {object} ajaxArguments ajax参数
		 */
		$.ajax(ajaxArguments);
	}

	/**
	 * 地区转换
	 * @param {string} province
	 * @param {string} city
	 * @param {string} area
	 * @param {Object} JSON
	 * @param {string} type
	 */
	self.areaSelect = function(province, city, area, JSON, type) {

		if(typeof province == 'object') {
			JSON = city;
			city = province.city;
			area = province.area;
			province = province.province;
		}

		if(province == '' || city == '' || area == '') {
			return '';
		}

		var result = {};
		// 检测转换类型
		var KEY = isNaN(parseInt(province)) ? 'text' : 'value';
		var VALUE = isNaN(parseInt(province)) ? 'value' : 'text';

		for(var i = 0; i < JSON.length; i++) {

			if(JSON[i][KEY] == province) {
				result.province = JSON[i][VALUE];
				for(var j in JSON[i].children) {

					if(JSON[i].children[j][KEY] == city) {
						result.city = JSON[i].children[j][VALUE];
						for(var k in JSON[i].children[j].children) {
							if(JSON[i].children[j].children[k][KEY] == area) {
								result.area = JSON[i].children[j].children[k][VALUE];
							}
						}
					}
				}
			}
		}
		if(type === 'string') {
			return result.province + result.city + result.area;
		}
		return result;
	};

	/*
	 * 表单验证
	 */
	self.checkForm = function(formData, constraints, validate) {
		var result = validate(formData, constraints, {
			format: "flat"
		});

		if(result) {

			self.alert(result[0]);
			return false;
		}
		return true;
	};

	/**
	 * 显示加载动画
	 * @param {Object} string
	 */
	self.showWaiting = (function() {
		if(!!window.plus) {
			_self.showWaitingFlag = true;
			return plus.nativeUI.showWaiting;
		} else {
			_self.showWaitingFlag = false;
			return function(string) {

				// 检查当前是否存在showWaiting
				var loadingElement = document.querySelector('.cm-load');
				if(loadingElement != null) {

					this.closeWaiting();
				}

				var div = document.createElement('div');
				div.className = 'cm-load';
				div.innerHTML =
					'<div class="cm-load-line">' +
					'<div></div>' +
					'<div></div>' +
					'<div></div>' +
					'<div></div>' +
					'<div></div>' +
					'<div></div>' +
					'<p class="cm-load-circlebg"></p>' +
					'</div>' +
					'<div class="cm-load-tip">' + (string ? string : '') + '</div>';

				var body = document.getElementsByTagName('body')[0];
				body.appendChild(div);
				var width = div.offsetWidth;
				div.style.marginLeft = -width / 2 + 'px';
			}
		}
	})();

	/**
	 * 关闭加载动画
	 */
	self.closeWaiting = (function() {

		if(_self.showWaitingFlag) {
			return plus.nativeUI.closeWaiting;
		} else {
			return function() {
				var loadingElement = document.querySelector('.cm-load');

				if(loadingElement) {
					loadingElement.parentNode.removeChild(loadingElement);
				}
			}
		}
	})();

	/**
	 * 将数值四舍五入(保留2位小数)后格式化成金额形式
	 * @param num 数值(Number或者String)
	 * @return 金额格式的字符串,如'1,234,567.45'
	 * @type String
	 */
	self.currency = function(num, $) {

		if(num === null) {
			num = 0;
		}

		if(num == undefined) {
			num = 0;
		}

		num = num.toString().replace(/\$|\,/g, '');
		if(isNaN(num))
			num = "0";
		sign = (num == (num = Math.abs(num)));
		num = Math.floor(num * 100 + 0.50000000001);
		cents = num % 100;
		num = Math.floor(num / 100).toString();
		if(cents < 10)
			cents = "0" + cents;
		for(var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
			num = num.substring(0, num.length - (4 * i + 3)) + ',' +
			num.substring(num.length - (4 * i + 3));
		if($) {
			return '￥' + (((sign) ? '' : '-') + num + '.' + cents);
		}
		return(((sign) ? '' : '-') + num + '.' + cents);
	}

	/**
	 *  javascript 局部异常监控
	 */
	_self.onerror = function(name, param) {
		if(param === undefined || param === null || param === '') {
			self.log.warn(name, '值为' + param);
		}
	};
	/** 
	 *  javascript 全局异常监控
	 *  目前只兼容chrome,其它浏览器慎用.
	 */
	window.onerror = function(errorMessage, scriptURI, lineNumber, columnNumber, error) {

		//		if(errorMessage.indexOf('SyntaxError')!=-1){
		//			console.error('app 解析代码,发生语法错误',errorMessage+'在'+scriptURI+' 第'+lineNumber+' 行'+' 第'+columnNumber+' 列');
		//		}
		//		if(errorMessage.indexOf('ReferenceError'!=-1)){
		//			console.error('app 引用了一个不存在的变量',errorMessage+'在'+scriptURI+' 第'+lineNumber+' 行'+' 第'+columnNumber+' 列');
		//		}
		//		if(errorMessage.indexOf('TypeError'!=-1)){
		//			console.error('app 变量或参数不是预期类型',errorMessage+'在'+scriptURI+' 第'+lineNumber+' 行'+' 第'+columnNumber+' 列');
		//		}

		// 自定义异常
		if(errorMessage.indexOf('app') != -1) {
			self.alert(error, 'app异常');
			//self.alert(errorMessage);
			//			self.log.error('app 程序异常提示',errorMessage+'在'+scriptURI+' 第 '+lineNumber+' 行'+' 第 '+columnNumber+' 列');
		} else {
			// 非预期异常
			//			self.alert(error + '：' + scriptURI, '程序异常');
		}
	}

	return self;
});