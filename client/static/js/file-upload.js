$.fn.extend({
	fileUpload: function(dir, inputName) {
		var html = '<input type="file" class="hide" id="file_upload" />' +
			'<input type="hidden" name="' + (inputName || 'file') + '" class="file-path" />' +
			'<div class="upload-preview">上传图片</div>';
		this.html(html);
		var filePathEle = this.children('.file-path');
		var imgInputEle = this.children('#file_upload');
		var uploadPreviewEle = this.children('.upload-preview');
		// 默认封面图
		if (this.data('img')) {
			uploadPreviewEle.html('');
			uploadPreviewEle.css({
				background: 'url(' + IMG_PRE +this.data('img') + ') center center /cover',
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
						url: 'http://upload.qiniu.com/',
						type: 'post',
						data: formData,
						processData: false,
						contentType: false,
						cache: false,
						success: function(data) {
							filePathEle.val(data.key);
							uploadPreviewEle.html('');
							uploadPreviewEle.css({
								background: 'url(' + IMG_PRE + data.key + ') center center /cover',
								border: '0px'
							});
						}
					});
				}
			});
		});
	}
});