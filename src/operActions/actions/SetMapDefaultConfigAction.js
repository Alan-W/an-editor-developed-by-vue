import {Action} from '../action'
import globalConfig from '../../store/dataConfig/globalConfig'

// 设置地图名称属性的Action
var SetMapDefaultConfigAction = class SetMapDefaultConfigAction extends Action {
	constructor(object, newValue, propName) {

		super( 'SetMapDefaultConfigAction', 'set value');
		this.object = object; //  当前修改的对象
		this.newValue = newValue;
		this.oldValue = this.object[propName];
		this.propName = propName; // 当前修改的属性名
	}

	// push the SetMapDefaultConfigAction to the actions stacks;
	excute () {
		this.object[this.propName] = this.newValue;
		// 不提交后台数据, 走浏览器的缓存数据
		var oldValueObj = localStorage.getItem(globalConfig.amapConfig.localStorageName);
		oldValueObj = JSON.parse(oldValueObj);
		oldValueObj[this.propName] = this.newValue;
		localStorage.setItem(globalConfig.amapConfig.localStorageName, JSON.stringify(oldValueObj));
	}

	// undo the action
	undo () {
		this.object[this.propName] = this.oldValue;
		var oldValueObj = localStorage.getItem(globalConfig.amapConfig.localStorageName);
		oldValueObj = JSON.parse(oldValueObj);
		oldValueObj[this.propName] = this.oldValue;
		localStorage.setItem(globalConfig.amapConfig.localStorageName, JSON.stringify(oldValueObj));
	}

	redo () {
		this.excute();
	}

}

export default SetMapDefaultConfigAction;