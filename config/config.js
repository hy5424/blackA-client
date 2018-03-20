
/**
 * *************************************************************************
 * 
 *  应用程序配置文件
 * 
 * @param {string}	baseUrl	用于加载模块的根路径
 * @param {object}  paths   用于映射不存在根路径下面的模块路径
 * @param {object}  shim    配置在脚本/模块外面并没有使用RequireJS的函数依赖并且初始化函数
 * @param {array}   deps    加载依赖关系数组
 * @param {string}  exports 模块外部调用时的名称
 * 
 * *************************************************************************
 */

/**
 * 	计算config应用路径
 */
var hrefArry,base;
var sum=[];
console.log(location.href);
var url= location.href.split('?')[0];

// 兼容plus
if(url.indexOf('apps')!=-1){
	var array1= url.split('apps')[1];
	hrefArry= array1.split('app')[1].split('');
}
// 兼容配web
if(url.indexOf('csh-h5')!=-1){
	hrefArry= url.split('app')[1].split('');
}
// 兼容demo
if(url.indexOf('demo')!=-1){
	hrefArry= url.split('demo')[1].split('');
}

for(var i= 0;i< hrefArry.length;i++){
	if(hrefArry[i]==='/'){
		sum.push('/');
	}
}

if(sum.length===2){
	base='../../lib';
}
if(sum.length===3){
	base='../../../lib';
}
if(sum.length===4){
	base='../../../../lib';
}

/**
 *  配置config
 */
require.config({

	// 配置加载模块根路径为  空
	baseUrl: base,

	// 配置不在根路径下的模块 mui
	paths: {
		'text':'require/require-text',
		'wait':'../app/upgrade/wait/wait',
		'payment':'../app/upgrade/payment/payment',
		'all':'../app/upgrade/all/all',
		'search':'../app/vehicle/search/search',
		'select':'../app/vehicle/select/select',
		'confirm':'../app/vehicle/confirm/confirm'
	},

	shim: {
		'mui/js/mui': {
			exports: 'mui'
		},
		'mui/js/mui.picker' : {
			deps: ['mui/js/mui'],
			exports: 'mui.picker'
		},
		'mui/js/mui.poppicker' : {
			deps: ['mui/js/mui.picker'],
			exports: 'mui.PopPicker'
		},
		'mui/js/mui.pullToRefresh': {
			deps: ['mui/js/mui'],
			esports: 'mui.pullToRefresh'
		},
		'mui/js/mui.pullToRefresh.material': {
			deps: ['mui/js/mui.pullToRefresh'],
			esports: 'mui.pullToRefresh.material'
		},
		'mui/js/mui.dtpicker':{
			deps: ['mui/js/mui'],
			esports: 'mui.dtpicker'
		}
		
		/**
		 *  TODO mui 其它插件
		 * 
		 * 
		 * 
		 * 
		 * 
		 * 
		 */
		
	}
});


// 基本参数配置
window.config= {
	alertTitle: '橙生活'
};
