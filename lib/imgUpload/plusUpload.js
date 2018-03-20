/**
 * Android - 2.2+ (支持): 返回的是系统相册路径，如“file:///storage/sdcard0/DCIM/Camera/1428841301674.jpg”。
 * iOS - 5.1+ (支持): 受系统相册路径的访问限制，选择后图片会先拷贝到应用沙盒下的"_doc"目录中，
 /*如“file:///var/mobile/Applications/0373DFBF-6AA7-4C9B-AE1F-766469117C94/Library/Pandora/apps/HBuilder/doc/IMG_0005.jpg”。
 */

define(function(require, exports, modules) {

	var app = require('app');

	// 选择照片参数配置
	var pickSettings = {
		animation: true, //是否显示系统相册文件选择界面的动画是否显示系统相册文件选择界面的动画，可取值true、false，默认值为true。

		filename: '', //某些系统不能直接使用系统相册的路径，这时需要将选择的文件保存到应用可访问的目录中，可通过此参数设置保存文件的路径。 如果路径中包括文件后缀名称，则表明指定文件路径及名称，否则仅指定文件保存目录，文件名称自动生成。

		filter: 'image', //(GalleryFilter 类型 )相册中选择文件类型过滤器,系统相册选择器中可选择的文件类型，可设置为仅选择图片文件（“image”）、视频文件（“video”）或所有文件（“none”），默认值为“image”。

		maximum: 1, //(Number 类型 )最多选择的图片数量,仅在支持多选时有效，取值范围为1到Infinity，默认值为Infinity，即不限制选择的图片数。 如果设置的值非法则使用默认值Infinity。

		system: false, //强制使用5+统一相册选择界面。设置为true时，如果系统自带相册选择控件时则优先使用，否则使用5+统一相册选择控件；设置为false则不使用系统自带相册选择控件，直接使用5+统一相册选择界面。 默认值为true。

		multiple: false, //(Boolean 类型 )是否支持多选图片可从系统相册中选择多张图片，选择图片后通过GalleryMultiplePickSuccessCallback回调返回选择的图片。

		onmaxed: function() {}, //(Function 类型 )超过最多选择图片数量事件使用相册多选图片时，可通过maximum属性设置最多选择的图片数量，当用户操作选择的数量大于此时触发此事件。

		popover: {}, //(PopPosition 类型 )相册选择界面弹出指示区域对于大屏幕设备如iPad，相册选择界面为弹出窗口，此时可通过此参数设置弹出窗口位置。 其为JSON对象，格式如{top:"10px",left:"10px",width:"200px",height:"200px"}，所有值为像素值，左上坐标相对于容器的位置，默认弹出位置为屏幕居中。

		selected: [] //(Array[ String ] 类型 )已选择的图片路径列表,仅在多图片选择时生效，相册选择界面将选中指定的图片路径列表。 如果指定的路径无效，则忽略此项；如果指定的路径数超过maximum属性指定的最大选择数目则超出的图片不选中。

	};

	// 扩展API加载完毕后调用onPlusReady回调函数 
	//document.addEventListener("plusready", onPlusReady, false);

	// 扩展API加载完毕，现在可以正常调用扩展API 
	function onPlusReady() {}
	
	// 创建全局参数
	var globSettings= {
		imgSize: 200 * 1024,
		pickFail: function(){},
		uploadFail: function(res){},
		zipFail: function(){}
	};
	

	// 从相册中选择图片 上传
	exports.galleryImg = function(settings) {
		
		globSettings= app.extend([],globSettings,settings);

		// 从相册中选择图片
		console.log("从相册中选择图片:");
		plus.gallery.pick(
			function(path) {

				console.log(path);
				pickSuccess(path);
			},
			function(event) {

				console.log("取消选择图片");
				pickFail(event);
			}, {
				filter: "image",
				onmaxed: function() {
					app.alert('只能选择一张照片');
				}
			}
		);
	}

	// 拍照上传
	exports.camerImg = function(settings) {

		globSettings= app.extend([],globSettings,settings);

		var cmr = plus.camera.getCamera();

		cmr.captureImage(
			function(pic) {

				plus.io.resolveLocalFileSystemURL(
					pic,
					function(entry) {

						//妈蛋 entry.fullPath 有坑，在ios上获取不到
						var u = entry.toLocalURL();
						console.log("entry.toLocalURL: " + u);

						pickSuccess(u);
					},
					function(error) {
						
						console.log("读取拍照文件错误：" + err.message);
						pickFail(error);
					}
				);
			},
			function(err) {

				// 未测拍照权限 err.code
				console.log("失败：" + err.message);
				//app.alert(err.message);
				
			}, 
			{
				filename: "_doc/camera/",
				index: 1
			}
		);
	};

	
	// 读取图片成功
	function pickSuccess(path) {

		console.log('plus info: 选择照片成功 ;path: ' + path);
		
		plus.nativeUI.showWaiting('正在处理...');

		// 选择照片成功回调
		globSettings.pickSuccess(path);

		// 判断是否需要压缩
		plus.io.resolveLocalFileSystemURL(
			path,
			function(entry) {

				// 可通过entry对象操作文件 
				entry.file(function(file) {

					// 需要压缩图片
					if(file.size > globSettings.imgSize) {

						compressImage(path, function(event) {

							// 上传
							upLoad(event.target);

						}, function(error) {

							// 压缩失败
							globSettings.zipFail(error);
						});
					}
					// 不需要压缩图片
					else {

						// 直接上传
						upLoad(path);
					}

				});
			},
			function(e) {
				app.alert("Resolve file URL failed: " + e.message);
			}
		);
	}

	// 读取图片失败
	function pickFail(event) {

		// event {"code":12,"message":"User cancelled"}
		console.log('plus info: 选择照片失败' + JSON.stringify(event));

		sysPermission(event);

		// 返回失败信息，结束照片选择
		globSettings.pickFail(event);
	}

	/**
	 * 压缩照片
	 * @param {Object} path
	 * @param {Object} success
	 * @param {Object} fail
	 */
	function compressImage(path, success, fail) {

		//不覆盖原图
		var newImgSrc = "_downloads/" + (+new Date()) + path.substr(path.lastIndexOf('.'));

		plus.zip.compressImage({
				src: path,
				dst: newImgSrc,
				quality: 20
			},
			function(event) {

				// Code here
				var target = event.target;  // 压缩转换后的图片url路径，以"file://"开头
				var size = event.size;      // 压缩转换后图片的大小，单位为字节（Byte）
				var width = event.width;    // 压缩转换后图片的实际宽度，单位为px
				var height = event.height;  // 压缩转换后图片的实际高度，单位为px

				//alert("Compress success!");
				console.log("plus info: 压缩照片成功");
				success(event);
			},
			function(error) {

				// Handle the error
				var code = error.code; // 错误编码
				var message = error.message; // 错误描述信息

				//alert("Compress error!");
				console.log("plus info: 压缩照片失败;code: " + code + ',message: ' + message);
				fail(error);
			}
		);
	}

	/**
	 * @description 打开相册失败，请求系统权限
	 * @param {Error} e
	 */
	function sysPermission(e) {
		if(plus.os.name == "iOS") {
			if(e.code == 8) {
				app.alert("您的相册权限未打开，请在当前应用设置-隐私-相册来开打次权限", function() {
					plus.runtime.openURL('prefs:root=Privacy');
				})
			}
		} else if(plus.os.name == "Android") {
			if(e.code != 12) {
				app.alert("您的相册权限未打开，请在应用列表中找到您的程序，将您的权限打开", function() {
					var android = plus.android.importClass('com.android.settings');
					var main = plus.android.runtimeMainActivity();
					var Intent = plus.android.importClass("android.content.Intent");
					var mIntent = new Intent('android.settings.APPLICATION_SETTINGS');
					main.startActivity(mIntent);
				});
			}
		}
	}
		
	/**
	 * 上传照片
	 * @param {Object} path
	 */
	function upLoad(path) {
		
		plus.nativeUI.closeWaiting();
		
		plus.nativeUI.showWaiting('开始上传...');
		var task = plus.uploader.createUpload(
			app.baseUrl + globSettings.URL_UPLOAD, {
				method: "POST",
				timeout: 10
			},
			function(t, status) {

				if(status == 200) {
					
					var data = JSON.parse(t.responseText);
					
					if(data.code == '0000') {

						console.log("===图片上传log strat:\n" + JSON.stringify(data) + "===图片上传log end:\n");
						app.toast('照片上传成功');

						globSettings.uploadSuccess(data);
					} else {

						app.toast(data.msg || '照片上传失败' + '[' + data.code + ']');
						globSettings.uploadFail(data.message);

					}
				} else {
					
					try{
						app.toast(t.responseText);	
					}catch(e){
						app.alert('服务器繁忙');
					}

				}

				plus.nativeUI.closeWaiting();
			}
		);
		task.addFile(path, {
			key: 'phillyx_' + Math.floor(Math.random() * 100000000 + 10000000).toString()
		});

		task.setRequestHeader('auth_token',app.getSave.token());
		
		task.addData( "type", globSettings.type );
		
		addData(task);
		
		task.start();
		
		function addData(task){
			
			if (globSettings.data){
				for(var i in globSettings.data){
				
					if (globSettings.data[i]==undefined){
						continue;
					}
					task.addData(i,globSettings.data[i]);
					
				}	
			}
		}

	}

});