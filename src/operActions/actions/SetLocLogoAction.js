'use strict';


// 设置面板中地点的范围属性
var SetLocLogoAction = class SetLocLogoAction extends Action {
	constructor(object, newLogoUrl) {

		super( 'SetLocLogoAction', 'set value');
		this.object = object; //  当前修改的对象
		this.newLogoUrl = newLogoUrl;
		console.log(' the new loc logo is : ---- ', this.newLogoUrl);

		this.oldLogoUrl = editor.getProperValue(this.object, 'logo');
		this.id = editor.getProperValue(this.object, 'id');

	}

	// push the SetLocLogoAction to the actions stacks;
	excute () {
		

		// 修改本地保存的数据
		editor.setProperValue(sceneClass.locsObj[this.id], 'logo', this.newLogoUrl);

		var submitData = {
			id: this.id,
			logo: this.newLogoUrl
		};

		var imgDom = $('.img-type-prop').find('.img-scan').find('img');
		if (imgDom[0]) {
			imgDom[0].src = this.newLogoUrl;
		}
		
		sceneClass.changeLocProps(this.id, submitData); // 提交接口数据*/(this.submitData);

		
	}


	// undo the action
	undo () {

		// 修改本地保存的数据
		editor.setProperValue(sceneClass.locsObj[this.id], 'logo', this.oldLogoUrl);
		$('input[data-obj-id='+this.id+'][data-prop-type="scope"]').val(this.oldLogoUrl);

		var submitData = {
			id: this.id,
			logo: this.oldLogoUrl
		};

		var imgDom = $('.img-type-prop').find('.img-scan').find('img');
		if (imgDom[0]) {
			imgDom[0].src = this.oldLogoUrl;
		}

		sceneClass.changeLocProps(this.id, submitData); // 提交接口数据*/(this.submitData);

	}

	redo () {
		this.excute();
	}

}
