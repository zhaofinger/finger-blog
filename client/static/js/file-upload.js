$.fn.extend({
	fileUpload: function(dir, inputName, isMutiple, callback) {
		var _this = this;
		var imgArr = [];
		isMutiple = isMutiple || false;
		var html = '<div class="upload-file-wrapper">' +
			'<input type="file" class="hide" id="file_upload" />' +
			'<input type="hidden" name="' + (inputName || 'file') + '" class="file-path" />' +
			'<div class="upload-target ' + (isMutiple ? 'upload-btn' : 'upload-preview') + '">上传图片</div>' +
			'<ul class="upload-img-list"></ul>' +
			'</div>';
		_this.html(html);

		var filePathEle = _this.find('.file-path');
		var imgInputEle = _this.find('#file_upload');
		var uploadPreviewEle = _this.find('.upload-target');
		var uploadImgListEle = _this.find('.upload-img-list');

		// 已有照片
		var hasImgVal = _this.data('value');
		if (hasImgVal) {
			filePathEle.val(hasImgVal);
			var hasImgsArr = hasImgVal.split('||');
			if (isMutiple) {
				hasImgsArr.forEach(function(item) {
					var imgHtml = '<li class="upload-img-item" style="background: url(\'' + IMG_PRE + item + '\') center center /cover"><i class="delete">×</i></li>';
					uploadImgListEle.append(imgHtml);
				});
			} else {
				uploadPreviewEle.html('');
				uploadPreviewEle.css({
					background: 'url(' + IMG_PRE + hasImgsArr[0] + ') center center /cover',
					border: '0px'
				});
			}
		}

		// 默认封面图
		if (this.data('img')) {
			uploadPreviewEle.html('');
			uploadPreviewEle.css({
				background: 'url(' + IMG_PRE + this.data('img') + ') center center /cover',
				border: '0px'
			});
		}
		uploadPreviewEle.click(function() {
			imgInputEle.trigger('click');
		});
		// 上传
		imgInputEle.change(function(e) {
			var file = e.target.files[0];
			var formData = new FormData();
			formData.append('file', file);
			formData.append('key', '/' + dir + '/' + (new Date()).getTime() + '_' + file.name);
			// 获取token
			$.get('/api/qiniu/token', function(data) {
				if (data.status === 200) {
					formData.append('token', data.data.token);
					$.ajax({
						// url: '//upload.qiniu.com/',
						url: '//up.qbox.me',
						type: 'post',
						data: formData,
						processData: false,
						contentType: false,
						cache: false,
						success: function(data) {
							if (!isMutiple) {
								filePathEle.val(data.key);
								uploadPreviewEle.html('');
								uploadPreviewEle.css({
									background: 'url(' + IMG_PRE + data.key + ') center center /cover',
									border: '0px'
								});
							} else {
								imgArr.push(data.key);
								filePathEle.val(imgArr.join('||'));
								var imgHtml = '<li class="upload-img-item" style="background: url(\'' + IMG_PRE + data.key + '\') center center /cover"><i class="delete">×</i></li>';
								uploadImgListEle.append(imgHtml);
							}
							if (callback) {
								callback(data.key);
							}
						}
					});
				}
			});
		});
		$(document).on('click', '.upload-file-wrapper .delete', function() {
			var parentEle = $(this).parent();
			imgArr.splice(parentEle.index(), 1);
			filePathEle.val(imgArr.join('||'));
			parentEle.remove();
		});
	}
});