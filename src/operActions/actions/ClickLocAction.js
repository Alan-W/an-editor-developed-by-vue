import { Action } from '../action'
import indexStore from '../../store/index'
import globalConfig from '../../store/dataConfig/globalConfig'
console.log(' index store is : ----- ', indexStore)

// 点击标志物实例的action
var ClickLocAction = class ClickLocAction extends Action {
	constructor(stateData, newClickObj, activeBoard) {
		super( 'ClickLocAction', 'click role obj');
		this.newClickObj = newClickObj; // 当前新点击选中的对象
		this.oldClickObj = stateData; // state 中原来的选中对象
		this.activeBoard = activeBoard;
		console.log('ClickLocAction.js----- this newClickObj is : ------- ', this.newClickObj);
		console.log(' the state Data is : ------ ', this.stateData);
		console.log(' the old clickObj is : ------ ', this.oldClickObj);
	}

	// push the ClickLocAction to the actions stacks;
	excute () {
	
		// 场景切换
		if (this.activeBoard == 'modelEditor') {
			indexStore.dispatch('changeEditBoard', '2DmapEditor');
		}

		indexStore.dispatch('changeClickObj', this.newClickObj);

		if (this.newClickObj.longitude && this.newClickObj.latitude) {
			globalConfig.amapManager.getMap().setCenter([this.newClickObj.longitude, this.newClickObj.latitude]);
		}

	}

	// undo the action
	undo () {

		// 触发点击当前的选中对象
		indexStore.dispatch('changeClickObj', this.oldClickObj);
		console.log('撤销到前一步的选中对象的类型是: ----- ', this.oldClickObj.clickType);

		// 场景切换
		if (this.activeBoard == 'modelEditor') {
			indexStore.dispatch('changeEditBoard', '2DmapEditor');
		}
	}

	// redo action
	redo () {
		this.excute();
	}

}

export default ClickLocAction;
