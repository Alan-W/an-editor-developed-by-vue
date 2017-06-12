import { Action } from '../action'
import indexStore from '../../store/index'
import globalConfig from '../../store/dataConfig/globalConfig'
console.log(' index store is : ----- ', indexStore)

// 点击呈现物实例的action
var ClickRoleInstanceAction = class ClickRoleInstanceAction extends Action {
	constructor(stateData, newClickObj) {
		super( 'ClickRoleInstanceAction', 'click role obj');
		this.newClickObj = newClickObj; // 当前新点击选中的对象
		this.oldClickObj = stateData; // state 中原来的选中对象
		console.log('ClickRoleInstanceAction.js----- this newClickObj is : ------- ', this.newClickObj);
		console.log(' the state Data is : ------ ', this.stateData);
		console.log(' the old clickObj is : ------ ', this.oldClickObj);
	}

	// push the ClickRoleInstanceAction to the actions stacks;
	excute () {
		// 更改当前面板中选中的对象信息
		// 点击模型类型的呈现物时修改当前的编辑面板，修改当前场景编辑器中要加载的呈现物模型数据
		indexStore.dispatch('changeClickObj', this.newClickObj);
		if (parseInt(this.newClickObj.type) == 1) {
			indexStore.dispatch('changeEditBoard', 'modelEditor');
			console.log(' 模型编辑器中的对象是: ----- ', this.newClickObj);
			// 清除当前场景中已经存在的模型
			globalConfig.modelScene.clear();
			// 加载当前的3D 模型
			globalConfig.modelScene.loadObjModel(this.newClickObj);
			
		};
	}


	// undo the action
	undo () {
		indexStore.dispatch('changeClickObj', this.oldClickObj);
		if (parseInt(this.oldClickObj.type) == 1) {
			indexStore.dispatch('changeEditBoard', 'modelEditor');
			console.log(' 模型编辑器中的对象是: ----- ', this.oldClickObj);
			// 清除房钱场景中已经存在的模型
			globalConfig.modelScene.clear();
			// 加载当前的3D 模型
			globalConfig.modelScene.loadObjModel(this.oldClickObj);
		};
	}

	// redo action
	redo () {
		this.excute();
	}

}

export default ClickRoleInstanceAction;
