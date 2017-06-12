import { Action } from '../../action'
import SubmitObjPropsApis from '../../../store/apis/submitObjPropsApi'

// 设置面板中所有对象的名称属性
var SetLabelpropColourAction =  class SetLabelpropColourAction extends Action {
	constructor(object, newName) {

		super( 'SetLabelpropColourAction', 'set value');
		this.object = object; //  当前修改的对象
		this.newName = newName;
		this.oldName = this.object.colour;
	}
	

	// push the SetLabelpropColourAction to the actions stacks;
	excute () {
		this.object.colour = this.newName;
		SubmitObjPropsApis.submitLabelProps(this.object.id, 'colour', this.newName);
	}

	// undo the action
	undo () {
		this.object.colour = this.oldName;
		SubmitObjPropsApis.submitLabelProps(this.object.id, 'colour', this.oldName);
	}

	redo () {
		this.excute();
	}
}

export default SetLabelpropColourAction;