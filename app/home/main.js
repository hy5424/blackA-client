require(['../../config/config'], function() {
	var deps = ['app', 'vue', 'appPlus'];
	require(deps, function(app, Vue, appPlus) {

		//测试
		var loginVm = new Vue({
			el: '#idTest',
			methods: {
				doReady: function() {
					app.open({
						url: '../play/play.html',
						id: 'play.html'
					});
				}

			}
		});
	});
});