import { Action } from '../action'
import SubmitObjPropsApis from '../../store/apis/submitObjPropsApi'


// 设置面板中地点的范围属性
var SetLocScopeAction = class SetLocScopeAction extends Action {
	constructor(object, newScope, tempValue) {

		super( 'SetLocScopeAction', 'set value');
		this.object = object; //  当前修改的对象
		this.newScope = newScope;
		this.oldScope = tempValue ? tempValue : this.object.scope;
	}

	// push the SetLocScopeAction to the actions stacks;
	excute () {
		this.object.scope = this.newScope;
		SubmitObjPropsApis.submitLocProps(this.object.id, 'scope', this.newScope);
	}


	// undo the action
	undo () {
		this.object.scope = this.oldScope;
		SubmitObjPropsApis.submitLocProps(this.object.id, 'scope', this.oldScope);
	}

	redo () {
		this.excute();
	}
}

export default SetLocScopeAction;
