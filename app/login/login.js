/**
 * 登录模块
 */
require(['../../config/config'], function() {
	var deps = ['app', 'vue', 'md5', 'validate'];
	require(deps, function(app, Vue, md5, validate) {

		var data = {
			loginName: '', //手机号
			password: '', //密码
			passwordMd5: '', //md5密码
			isShow: false
		};

		//登录
		var loginVm = new Vue({
			el: '#idlogin',
			data: data,
			methods: {
				/**
				 * 登录点击事件
				 */
				doLogin: function() {

					if(!check()) {
						return;
					}

					this.passwordMd5 = hex_md5(this.password).toUpperCase();
					//登录请求
					login(this.loginName, this.passwordMd5);

				},

				doRegister: function() {

					if(!check()) {
						return;
					}

					this.passwordMd5 = hex_md5(this.password).toUpperCase();
					//登录请求
					register(this.loginName, this.passwordMd5);

				}
			}

		});
		//		app.plusReady(function() {
		//			init();
		//		});
		//		initH();
		//		//预设保存的密码
		//		getSavedUserInfo();
		/**
		 * 设置高度
		 */
		function initH() {
			var height = document.documentElement.getBoundingClientRect().height;
			var contentH = mui("#idcontent")[0].offsetHeight;
			mui("#idblank")[0].style.height = (height - contentH - 60) + 'px';
			loginVm.isShow = true;
		}

		/**
		 * 获取存储的用户名密码
		 */
		function getSavedUserInfo() {
			var loginName = app.getSave('loginName');
			var pwdOrigin = app.getSave('passwordOrigin');
			if(loginName) {
				Vue.set(loginVm, 'loginName', loginName);
			}
			if(pwdOrigin) {
				Vue.set(loginVm, 'password', pwdOrigin);
			}

		}
		/**
		 * 登录之前的数据检查
		 */
		function check() {
			var constraints = {
				phone: {
					presence: {
						message: '^请填写手机号'
					},
					format: {
						pattern: /^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/,
						message: '^手机号格式不正确'
					}
				},
				password: {
					presence: {
						message: '^请填写密码'
					},
					length: {
						minimum: 6,
						message: '^密码最少6位！'
					}
				}
			};

			return app.checkForm({
				phone: loginVm.loginName.toString(),
				password: loginVm.password,
			}, constraints, validate);

		}

		/**
		 * 请求登录接口
		 * @param {Object} loginName
		 * @param {Object} passWord
		 */
		function login(loginName, passWord) {
			if(window.plus)
				plus.nativeUI.showWaiting();

			//请求数据拼装
			var reqData = {
				loginName: loginName,
				passWord: passWord,
			};

			app.request({
				url: '/login/loginA0100',
				data: reqData,

				success: function(res) {
					if(window.plus)
						plus.nativeUI.closeWaiting();

					app.save('userId', res.response.userId);
					app.open({
						url: '../home/main.html',
						id: 'main.html'
					});
				},
				fail: function(res) {
					if(window.plus)
						plus.nativeUI.closeWaiting();
					app.toast(res.msg);
				}
			});

		}

		/**
		 * 请求注册接口
		 * @param {Object} loginName
		 * @param {Object} passWord
		 */
		function register(loginName, passWord) {
			if(window.plus)
				plus.nativeUI.showWaiting();

			//请求数据拼装
			var reqData = {
				loginName: loginName,
				passWord: passWord,
			};

			app.request({
				url: '/register/registerA0100',
				data: reqData,

				success: function(res) {
					if(window.plus)
						plus.nativeUI.closeWaiting();
					//请求成功
					/**
					 * 保存token、用户名和密码，以及登录返回参数
					 */

					//					app.save.token(res.response.auth_token);
					//
					//					app.save('loginName', loginName);
					//					app.save('password', passWord);
					//					app.save('passwordOrigin', loginVm.password);
					//					app.save('userInfo', JSON.stringify(res.response));
				},
				fail: function(res) {
					if(window.plus)
						plus.nativeUI.closeWaiting();
					app.toast(res.msg);
				}
			});

		}

		/**
		 * 按2次退出应用
		 */
		mui.oldBack = mui.back;
		var backButtonPress = 0;
		mui.back = function(event) {
			backButtonPress++;
			if(backButtonPress > 1) {
				plus.runtime.quit();
			} else {
				app.toast('再按一次退出应用');
			}
			setTimeout(function() {
				backButtonPress = 0;
			}, 1000);
			return false;
		};
	});
});