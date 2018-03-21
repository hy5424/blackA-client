/**
 * 登录模块
 */
require(['../../config/config'], function() {
	var deps = ['app', 'vue', 'appPlus'];
	require(deps, function(app, Vue, appPlus) {
		var websocket = null;

		listInit(); //页面初始化

		function listInit() {
			appPlus.landscape;
			websocket = new WebSocket("ws://192.168.1.104:8081/blackA/websocket");

			//连接发生错误的回调方法  
			websocket.onerror = function() {
				alert("WebSocket连接发生错误");
			};

			//连接成功建立的回调方法  
			websocket.onopen = function() {
				alert("WebSocket连接成功");
			}

			//连接关闭的回调方法  
			websocket.onclose = function() {
				alert("WebSocket连接关闭");
			}

			//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。  
			window.onbeforeunload = function() {
				closeWebSocket();
			}
		};

		function play_a_hand(num) {
			var cards = null;
			var id = document.getElementById(num);
			id.style = {
				"margin-top": "10px",
				"border-bottom-width": "10px",
				"border-botton-color": "white",
				"border-bottom-style": "solid"
			};
			card += num + ",";
		}

		//接收到消息的回调方法  
		websocket.onmessage = function(event) {
			var callBackMsg = event.data;
			var json = JSON.parse(callBackMsg);
			switch(json.code) {
				case "order":
					alert("我的序号：" + json.response.msg);

					break;

				case "ready":
					var deal = JSON.parse(json.response.msg);
					
					break;

				case "play":
					alert("我的大小：" + json.response.msg);

					break;

				case "isType":
					alert("我的牌型：" + json.response.msg);

					break;

				default:
					break;
			}
		}

		var loginVm = new Vue({
			el: '#idTest',
			methods: {
				doReady: function() {
					var userId = app.getSave("userId");

					var code = "ready";
					var request = {
						userId: userId
					};
					var data = {
						code: code,
						request: request
					};

					//CONNECTING：值为0，表示正在连接；
					//OPEN： 值为1， 表示连接成功， 可以通信了；
					//CLOSING： 值为2， 表示连接正在关闭；
					//CLOSED： 值为3， 表示连接已经关闭， 或者打开连接失败。
					if(websocket.readyState === 1) {
						websocket.send(JSON.stringify(data));
					}
				}

			}
		});

	});
});