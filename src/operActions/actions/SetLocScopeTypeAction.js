import {Action} from '../action'
import SubmitObjPropsApis from '../../store/apis/submitObjPropsApi'


// 设置面板中地点的范围类型的属性
var SetLocScopeTypeAction = class SetLocScopeTypeAction extends Action {
	constructor(object, newType) {

		super( 'SetLocScopeTypeAction', 'set value');
		this.object = object; //  当前修改的对象
		this.newType = newType;
		this.oldType = this.object.scope_type;
	}

	// push the SetLocScopeTypeAction to the actions stacks;
	excute () {
		this.object.scope_type = this.newType;
		SubmitObjPropsApis.submitLocProps(this.object.id, 'scope_type', this.newType);
	}

	// undo the action
	undo () {
		this.object.scope_type = this.oldType;
		SubmitObjPropsApis.submitLocProps(this.object.id, 'scope_type', this.oldType);
	}

	redo () {
		this.excute();
	}

}

export default SetLocScopeTypeAction;