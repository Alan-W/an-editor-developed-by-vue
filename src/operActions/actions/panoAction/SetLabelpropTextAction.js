import { Action } from '../../action'
import SubmitObjPropsApis from '../../../store/apis/submitObjPropsApi'

// 设置面板中所有对象的名称属性
var SetLabelpropTextAction =  class SetLabelpropTextAction extends Action {
	constructor(object, newName) {

		super( 'SetLabelpropTextAction', 'set value');
		this.object = object; //  当前修改的对象
		this.newName = newName;
		this.oldName = this.object.text;
	}
	

	// push the SetLabelpropTextAction to the actions stacks;
	excute () {
		this.object.text = this.newName;
		SubmitObjPropsApis.submitLabelProps(this.object.id, 'text', this.newName);
	}

	// undo the action
	undo () {
		this.object.text = this.oldName;
		SubmitObjPropsApis.submitLabelProps(this.object.id, 'text', this.oldName);
	}

	redo () {
		this.excute();
	}
}

export default SetLabelpropTextAction;