import { Action } from '../action'
import SubmitObjPropsApis from '../../store/apis/submitObjPropsApi'

// 设置面板中所有对象的名称属性
var SetLocNameAction =  class SetLocNameAction extends Action {
	constructor(object, newName) {

		super( 'SetLocNameAction', 'set value');
		this.object = object; //  当前修改的对象
		this.newName = newName;
		this.oldName = this.object.name;
	}
	

	// push the SetLocNameAction to the actions stacks;
	excute () {
		this.object.name = this.newName;
		SubmitObjPropsApis.submitLocProps(this.object.id, 'name', this.newName);
	}

	// undo the action
	undo () {
		this.object.name = this.oldName;
		SubmitObjPropsApis.submitLocProps(this.object.id, 'name', this.oldName);
	}

	redo () {
		this.excute();
	}
}

export default SetLocNameAction;