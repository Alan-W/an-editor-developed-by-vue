'use strict';


// set base prop value action extend the Action class
var SetIdentifyPosAction = class SetIdentifyPosAction extends Action {
	constructor(identify, newPosData, type) {
		super( 'SetIdentifyPosAction', 'set value');
		this.identify = identify;
		this.id = editor.getProperValue(this.identify, 'id');
		this.newPosData = newPosData;
		this.type = type;

		this.oldPosData = editor.getProperValue(this.identify, this.type);

	}
	/**/

	// push the SetIdentifyPosAction to the actions stacks;
	excute () {
		
		editor.setProperValue(this.identify, this.type, this.newPosData);

		// 提交数据
		var editObj = {
			id: this.id,
		}
		console.log('input event');
		editObj[this.type] = this.newPosData;
		sceneClass.changeIdentifyProps(editObj); // 提交数据

		$('input[data-obj-id='+this.id+'][data-input-type='+this.type+']').val(this.newPosData);

	}


	// undo the action
	undo () {
		
		editor.setProperValue(this.identify, this.type, this.oldPosData);

		// 提交数据
		var editObj = {
			id: this.id,
		}
		/**/
		console.log('input event');
		editObj[this.type] = this.oldPosData;
		sceneClass.changeIdentifyProps(editObj); // 提交数据

		$('input[data-obj-id='+this.id+'][data-input-type='+this.type+']').val(this.oldPosData);
		
	}

	redo () {
		this.excute();
	}

}
