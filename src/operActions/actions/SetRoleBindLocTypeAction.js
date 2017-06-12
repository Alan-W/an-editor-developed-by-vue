'use strict';


// 设置呈现绑定地点的类型数据
var SetRoleBindLocTypeAction = class SetRoleBindLocTypeAction extends Action {
	constructor(bindID, newBindLocType, dropType) {

		super( 'SetRoleBindLocTypeAction', 'set value');
		this.bindID = bindID;
		this.object = sceneClass.rolesObj[this.bindID]; // 根据唯一的bindID去获取当前的呈现物的熟悉感数据
		this.newBindLocType = newBindLocType;
		this.dropType = dropType; // 下拉列表的类型
		console.log('选择地点绑定类型的object 中的object 是: ---- ', this.object);
		console.log('当前的绑定ID 是-- -- ', this.bindID);
		this.oldBindLocType = editor.getProperValue(this.object, 'type_id');
		console.log('当前呈现物的就的绑定类型的数据时---- ', this.oldBindLocType);
	}

	// push the SetRoleBindLocTypeAction to the actions stacks;
	excute () {
		$('.props-list').find('li.dropdown-select').find('div.btn-group').find('button[data-drop-type='+this.dropType+']').first().html(sceneClass.locTypeMap[this.newBindLocType]);

		// 更改本地数据
		editor.setProperValue(this.object, 'type_id', this.newBindLocType);

		// 提交接口数据
		var submitData = {
			type_id: this.newBindLocType
		};
		sceneClass.submitRolePropsInfo(submitData, this.bindID); // 向后台提交数据
	}


	// undo the action
	undo () {
		// 更改显示
		if (this.oldBindLocType != '') {
			$('.props-list').find('li.dropdown-select').find('div.btn-group').find('button[data-drop-type='+this.dropType+']').first().html(sceneClass.locTypeMap[this.oldBindLocType]);
		} else $('.props-list').find('li.dropdown-select').find('div.btn-group').find('button[data-drop-type='+this.dropType+']').first().html('');
		

		// 更改本地数据
		editor.setProperValue(this.object, 'type_id', this.oldBindLocType);

		// 提交接口数据
		var submitData = {
			type_id: this.oldBindLocType
		};
		sceneClass.submitRolePropsInfo(submitData, this.bindID); // 向后台提交数据
		
	}

	redo () {
		this.excute();
	}

}
