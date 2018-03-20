
/**
 *  plus sdk
 *  @description 增强plus兼容性
 * 	@returns plus
 */

define(function(){
	
	var self = {};
	var noop=function(){};
	
	if(!!window.plus){
		self= plus;
	}else{
	
		self= {
			nativeUI: {
			
				showWaiting: function(tip){
		
					var div= document.createElement('div');
					//div.id= 'cm-loading';
	       			div.className= 'cm-load';
					div.innerHTML=
								    '<div class="cm-load-line">'+
								        '<div></div>'+
								        '<div></div>'+
								        '<div></div>'+
								        '<div></div>'+
								        '<div></div>'+
								        '<div></div>'+
								        '<p class="cm-load-circlebg"></p>'+
								    '</div>'+
								    '<div class="cm-load-tip">'+(tip?tip:'')+'</div>';

        			
        			
        			var body= document.getElementsByTagName('body')[0];
					body.appendChild(div);
					
					var width= div.offsetWidth;
					div.style.marginLeft= -width/2+'px';	
				
				},
				
				closeWaiting: function(){
					
					var loadingElement= document.querySelector('.cm-load');
					
					if (loadingElement){
						var body= document.getElementsByTagName('body')[0];
						var t= setTimeout(function(){
							body.removeChild(loadingElement);
						},300,function(){
							clearTimeout(t);
						});
						
					}
					
				}
			},
			webview: {
				getWebviewById: noop,
				currentWebview: function(){
					return this;
				},
				reload: function(){
					location.reload();
				},
				close: noop
			},
			navigator:{
				setFullscreen:function(){}
			}
			
			
			/**
			 *  TODO 
			 * 
			 * 
			 * 
			 * 
			 * 
			 */
		}
	}

	/**
	 *   plusready
	 */
	self.plusReady= function(callback){
		
		setTimeout(function() { //解决callback与plusready事件的执行时机问题(典型案例:showWaiting,closeWaiting)
			callback();
		}, 0);
		
	};
	
	return self;
	
});