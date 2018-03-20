(function(win) {
	var doc = win.document;
	var docEl = doc.documentElement;
	var tid;
	var rem;

	function refreshRem() {
		var width = docEl.getBoundingClientRect().width;
		//有边距
		rem = width / 10; // 将屏幕宽度分成10
		docEl.style.fontSize = rem + 'px';
	}

	win.addEventListener('resize', function() {
		clearTimeout(tid);
		tid = setTimeout(refreshRem, 300);
	}, false);
	win.addEventListener('pageshow', function(e) {
		if(e.persisted) {
			clearTimeout(tid);
			tid = setTimeout(refreshRem, 300);
		}
	}, false);

	refreshRem();

})(window);