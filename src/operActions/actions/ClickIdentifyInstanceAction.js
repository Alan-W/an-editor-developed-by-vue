import { Action } from '../action'
import indexStore from '../../store/index'
import globalConfig from '../../store/dataConfig/globalConfig'
console.log(' index store is : ----- ', indexStore)

// 点击标志物实例的action
var ClickIdentifyInstanceAction = class ClickIdentifyInstanceAction extends Action {
	constructor(stateData, newClickObj, bindLoc) {
		super( 'ClickIdentifyInstanceAction', 'click role obj');
		this.newClickObj = newClickObj; // 当前新点击选中的对象
		this.oldClickObj = stateData; // state 中原来的选中对象
		console.log('ClickIdentifyInstanceAction.js----- this newClickObj is : ------- ', this.newClickObj);
		console.log(' the old clickObj is : ------ ', this.oldClickObj);
		this.identifyBindLoc = bindLoc; // 当前标志物绑定的地点信息
	}

	// push the ClickIdentifyInstanceAction to the actions stacks;
	excute () {
	
		this.newClickObj.identifyBindLoc = this.identifyBindLoc; // 如果类型是标志物的话 全局的数据记录该标志物被绑定的地点
		indexStore.dispatch('changeClickObj', this.newClickObj);
		indexStore.dispatch('changeEditBoard', 'modelEditor');

		// 加载场景中的标志物模型
		globalConfig.modelScene.clear();

		// 判断标志物数据的合法性
		var resourceType = this.newClickObj.resource_type;
		if (this.newClickObj.resource_type == "" || !this.newClickObj.resource_type) { // 没有类型数据不合法
			indexStore.dispatch('setErrorInfo', {
				tip: '标志物加载失败！',
				reason: '该标志物没有类型(resource_type)数据, 请检查您创建的标志物!'
			});

			setTimeout(function () {
				indexStore.dispatch('setErrorInfo', null);
			}, 5000);

			return false;
		}

		var loadIdentifyType = 'create' + globalConfig.identifyTypeMap[this.newClickObj.resource_type]+'IdentifyModel';
		console.log('场景中要加载的标志物的名称是: ----- ', loadIdentifyType);
		globalConfig.modelScene[loadIdentifyType](this.newClickObj);

		// 加载该标志物绑定的呈现物
		if (this.newClickObj.roles && this.newClickObj.roles.length > 0) {
			for (var i = 0; i < this.newClickObj.roles.length; i++) {
				var role = this.newClickObj.roles[i];
				// 加载当前的3D 模型
				if (role.type == 1) {
					globalConfig.modelScene.loadObjModel(role);
				}
			}
		}
	}

	// undo the action
	undo () {
		indexStore.dispatch('changeClickObj', this.oldClickObj);
		console.log('撤销到前一步的选中对象的类型是: ----- ', this.oldClickObj.clickType);
	}

	// redo action
	redo () {
		this.excute();
	}

}

export default ClickIdentifyInstanceAction;
