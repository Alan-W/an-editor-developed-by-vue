'use strict';


// 设置标志物资源绑定的资源ID
var ChangeIdentifyAssertSourceId = class ChangeIdentifyAssertSourceId extends Action {
	constructor(object, newSourceID, newLogo) {

		super( 'ChangeIdentifyAssertSourceId', 'set value');
		this.object = object; //  当前修改的对象
		this.newSourceID = newSourceID; // 新修改的资源ID
		this.id = editor.getProperValue(this.object, 'id');
		this.newLogo = newLogo;
		this.oldLogo = editor.getProperValue(this.object, 'logo');

		this.oldSourceID = editor.getProperValue(this.object, 'identifySourceId');
		console.log('set obj name ,the obj info is : --- ', this.object);
	}

	// push the ChangeIdentifyAssertSourceId to the actions stacks;
	excute () {
		editor.setProperValue(this.object, 'identifySourceId', this.newSourceID);
		editor.setProperValue(this.object, 'logo', this.newLogo);
		
		var submitData = {
			id: this.id,
			model_resource_id: this.newSourceID,
			logo: this.newLogo,
		};

		// 获取当前的标志物资源选择的inputDOM
		var sourceInput = $('.props-list').find('.source-id-item').find('input[data-source-type=identifySourceId][data-obj-id='+this.id+']');
		sourceInput.val(this.newSourceID);

		sceneClass.changeIdentifyProps(submitData);

	}


	// undo the action
	undo () {
		editor.setProperValue(this.object, 'identifySourceId', this.oldSourceID);
		editor.setProperValue(this.object, 'logo', this.oldLogo);
		
		var submitData = {
			id: this.id,
			model_resource_id: this.oldSourceID,
			logo: this.oldLogo,
		};

		// 获取当前的标志物资源选择的inputDOM
		var sourceInput = $('.props-list').find('.source-id-item').find('input[data-source-type=identifySourceId][data-obj-id='+this.id+']');
		sourceInput.val(this.oldSourceID);

		sceneClass.changeIdentifyProps(submitData);
		
	}

	redo () {
		this.excute();
	}

}
