import { Action } from '../../action'
import SubmitObjPropsApis from '../../../store/apis/submitObjPropsApi'

// 设置面板中所有对象的名称属性
var SetLabelpropSizeAction =  class SetLabelpropSizeAction extends Action {
	constructor(object, newName) {

		super( 'SetLabelpropSizeAction', 'set value');
		this.object = object; //  当前修改的对象
		this.newName = newName;
		this.oldName = this.object.size;
	}
	

	// push the SetLabelpropSizeAction to the actions stacks;
	excute () {
		this.object.size = this.newName;
		SubmitObjPropsApis.submitLabelProps(this.object.id, 'size', this.newName);
	}

	// undo the action
	undo () {
		this.object.size = this.oldName;
		SubmitObjPropsApis.submitLabelProps(this.object.id, 'size', this.oldName);
	}

	redo () {
		this.excute();
	}
}

export default SetLabelpropSizeAction;