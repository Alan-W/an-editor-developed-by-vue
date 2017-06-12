import { Action } from '../action'
import SubmitObjPropsApis from '../../store/apis/submitObjPropsApi'

// 设置面板中所有对象的名称属性
var SetRoleTitleAction =  class SetRoleTitleAction extends Action {
	constructor(object, newTitle) {

		super( 'SetRoleTitleAction', 'set value');
		this.object = object; //  当前修改的对象
		// console.log(' the object clickType is : ----- ', this.object.clickType);
		this.newTitle = newTitle;
		this.oldTitle = this.object.title;
	}

	// push the SetRoleTitleAction to the actions stacks;
	excute () {
		this.object.title = this.newTitle;
		SubmitObjPropsApis.submitRoleProps(this.object.id, 'title', this.newTitle);
		
	}

	// undo the action
	undo () {
		this.object.title = this.oldTitle;
		SubmitObjPropsApis.submitRoleProps(this.object.id, 'title', this.oldTitle);
	}

	redo () {
		this.excute();
	}
}

export default SetRoleTitleAction;