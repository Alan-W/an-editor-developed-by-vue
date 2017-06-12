'use strict';


// set base prop value action extend the Action class
var SetRoleModelResourceAction = class SetRoleModelResourceAction extends Action {
	constructor(role, newModleResourceId) {
		super( 'SetRoleModelResourceAction', 'set value');
		this.role = role;
		this.id = editor.getProperValue(this.role, 'id');
		this.newModleResourceId = newModleResourceId;

		console.log(' this role is : ----- ', this.role);
		this.oldModelResourceId = editor.getProperValue(this.role, 'roleSourceId');
		console.log(' the old resourceID is : ------ ', this.oldModelResourceId);

	}
	/**/

	// push the SetRoleModelResourceAction to the actions stacks;
	excute () {
		

		// 修改完之后更换场景中的3D 模型
		editor.resetModelEditor();
		
		var templateID = editor.getProperValue(this.role, 'template_id');
		var changeProps = {
			id: templateID,
			model_resource_id: this.newModleResourceId
		};

		// 提交接口数据
		sceneClass.changeRoleProps(changeProps);

		// 修改完之后更换场景中的3D 模型
		editor.resetModelEditor();

		// 加载新的更换后的模型
		var modelResourcePath = sceneClass.configs.adminUrl + 'upload/model_resource/'+ this.newModleResourceId + '/' + this.newModleResourceId + '.obj';
		// var this.role = JSON.parse($('a[data-obj-id='+objID+']').attr('data-props'));
		console.log('当前的模型属性是----- ', this.role);
		editor.loadModel(modelResourcePath, this.id, this.role);

		editor.setProperValue(this.role, 'modelsourceurl', modelResourcePath);
		editor.setProperValue(this.role, 'roleSourceId', this.newModleResourceId);

		$('.props-list').find('input[data-source-type="roleSourceId"][data-obj-id='+this.id+']').val(this.newModleResourceId);

		// 修改这个相当于去修改了模板的属性，整个引用了该资源ID 的呈现物实例的该属性都需要去改变
		editor.setProperObjParamValue(sceneClass.rolesObj, 'template_id', templateID, 'modelsourceurl', modelResourcePath);
		editor.setProperObjParamValue(sceneClass.rolesObj, 'template_id', templateID, 'roleSourceId', this.newModleResourceId);

	}


	// undo the action
	undo () {
		
		var templateID = editor.getProperValue(this.role, 'template_id'); // rolesObj 中的ID 实际值取了bind_id,但是修改资源ID 的时候组要的是模板ID
		var changeProps = {
			id: templateID,
			model_resource_id: this.oldModelResourceId
		};
		/**/

		// 提交接口数据
		sceneClass.changeRoleProps(changeProps);

		// 修改完之后更换场景中的3D 模型
		editor.resetModelEditor();

		// 加载新的更换后的模型
		var modelResourcePath = sceneClass.configs.adminUrl + 'upload/model_resource/'+ this.oldModelResourceId + '/' + this.oldModelResourceId + '.obj';
		// var modelProps = JSON.parse($('a[data-obj-id='+this.id+']').attr('data-props'));
		console.log('当前的模型属性是----- ', this.role);
		editor.loadModel(modelResourcePath, this.id, this.role);

		editor.setProperValue(this.role, 'modelsourceurl', modelResourcePath);
		editor.setProperValue(this.role, 'roleSourceId', this.oldModelResourceId);

		$('.props-list').find('input[data-source-type="roleSourceId"][data-obj-id='+this.id+']').val(this.oldModelResourceId);

		// 修改这个相当于去修改了模板的属性，整个引用了该资源ID 的呈现物实例的该属性都需要去改变
		editor.setProperObjParamValue(sceneClass.rolesObj, 'template_id', templateID, 'modelsourceurl', modelResourcePath);
		editor.setProperObjParamValue(sceneClass.rolesObj, 'template_id', templateID, 'roleSourceId', this.oldModelResourceId);
		
	}

	redo () {
		this.excute();
	}

}
