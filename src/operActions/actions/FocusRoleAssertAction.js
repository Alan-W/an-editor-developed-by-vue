'use strict';


// 点击资源栏的具体呈现物资源的action
var FocusRoleAssertAction = class FocusRoleAssertAction extends Action {
	constructor(id) {
		super( 'FocusRoleAssertAction', 'click to focus the identify assert');
		this.id = id;
		this.oldID = editor.getRoleAssertFocusInfo();
		console.log('当前点击的标志物资源的ID 是: --- ', id);
		this.roleAssertProps = sceneClass.rolesAssertsObj[this.id];
		this.oldRoleAssertProps = sceneClass.rolesAssertsObj[this.oldID];
		console.log('当前点击的标志物资源的属性数组是: ---- ', this.roleAssertProps);
	}

	
	excute () {
		// 首先移除之前选中的样式
		$('.assert-draggable-active').removeClass('assert-draggable-active');
		$('#folderAsserts a.role-assert-'+this.id+'').parent('li').addClass('assert-draggable-active');

		// 属性栏显示相应资源的属性
		editor.resetPropsList();
		var objInfo = {
			id: this.id,
			classname: 'moreProps',
			type: 'modelAssert',
			name: editor.getProperValue(this.roleAssertProps, 'name'),
		};

		editor.createPropsList(this.roleAssertProps, objInfo);
		editor.setAssertFocusInfo(this.id); // 设置新的选中资源ID


		// 请求该资源的反引用对象列表
		var roleResourceID = editor.getProperValue(this.roleAssertProps, 'roleSourceId');
		console.log('当前标志物绑定的ZIP 资源ID 是------ ', roleResourceID);
		var quoteList = editor.getAssertQuoteObjsListInfo(roleResourceID);
		console.log('反引用的对象列表是: ------- ', quoteList);

		
		// 预览当前的3D 模型资源
		if (!editor.assertsScanMode) { // 当前是预览模式
			$('.show-assert-wrapper').css('display', 'block');
			this.scanRoleAssertModel(this.roleAssertProps);
		} else {
			$('.show-assert-wrapper').css('display', 'none');
		}
	}

	undo () {
		// 首先移除之前选中的样式
		$('.assert-draggable-active').removeClass('assert-draggable-active');
		$('#folderAsserts a.role-assert-'+this.oldID+'').parent('li').addClass('assert-draggable-active');

		// 属性栏显示相应资源的属性
		editor.resetPropsList();

		if (!this.oldID) return;

		
		var objInfo = {
			id: this.oldID,
			classname: 'moreProps',
			type: 'modelAssert',
			name: editor.getProperValue(this.oldRoleAssertProps, 'name'),
		};

		editor.createPropsList(this.oldRoleAssertProps, objInfo);

		// 请求该资源的反引用对象列表
		var roleResourceID = editor.getProperValue(this.oldRoleAssertProps, 'roleSourceId');
		console.log('当前标志物绑定的ZIP 资源ID 是------ ', roleResourceID);
		var quoteList = editor.getAssertQuoteObjsListInfo(roleResourceID);
		console.log('反引用的对象列表是: ------- ', quoteList);

		// 预览当前的3D 模型资源
		if (!editor.assertsScanMode) { // 当前是预览模式
			$('.show-assert-wrapper').css('display', 'block');
			this.scanRoleAssertModel(this.oldRoleAssertProps);
		} else {
			$('.show-assert-wrapper').css('display', 'none');
		}
	}

	redo () {
		this.excute();
	}

	scanRoleAssertModel (props) {
		$('#show3DsceneAssert').css('display', 'block');
		$('#show2DIdentifyASssert').css('display', 'none');
		$('#showVideo').css('display', 'none');
		console.log('预览3D模型资源传入的数据时 ；-- ----- ', props);
		var resourceData = editor.getProperValue(props, 'modelsourceurl');
		if (resourceData) {
			editor.loaddScan3DModelAssert(resourceData); 
		}
	}

}
