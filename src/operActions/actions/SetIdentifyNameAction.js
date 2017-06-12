import { Action } from '../action'
import SubmitObjPropsApis from '../../store/apis/submitObjPropsApi'

// 设置面板中所有对象的名称属性
var SetIdentifyNameAction =  class SetIdentifyNameAction extends Action {
	constructor(object, newName) {

		super( 'SetIdentifyNameAction', 'set value');
		this.object = object; //  当前修改的对象
		this.newName = newName;
		this.oldName = this.object.name;
		console.log('set obj name ,the obj info is : --- ', this.object);
	}

	// push the SetIdentifyNameAction to the actions stacks;
	excute () {
		this.object.name = this.newName;
		SubmitObjPropsApis.submitIdentifyProps(this.object.id, 'name', this.newName);
	}

	// undo the action
	undo () {
		this.object.name = this.oldName;
		SubmitObjPropsApis.submitIdentifyProps(this.object.id, 'name', this.oldName);
	}

	redo () {
		this.excute();
	}
}

export default SetIdentifyNameAction;