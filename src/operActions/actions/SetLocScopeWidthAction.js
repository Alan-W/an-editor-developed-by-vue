import { Action } from '../action'
import SubmitObjPropsApis from '../../store/apis/submitObjPropsApi'


// 设置面板中地点的范围宽度的属性
var SetLocScopeWidthAction = class SetLocScopeWidthAction extends Action {
	constructor(object, newScopeWidth) {

		super( 'SetLocScopeWidthAction', 'set value');
		this.object = object; //  当前修改的对象
		this.newScopeWidth = newScopeWidth;
		this.oldScopeWidth = this.object.scope_width;
	}

	// push the SetLocScopeWidthAction to the actions stacks;
	excute () {
		this.object.scope_width = this.newScope;
		SubmitObjPropsApis.submitLocProps(this.object.id, 'scope_width', this.newScope);
	}


	// undo the action
	undo () {

		this.object.scope_width = this.oldScope;
		SubmitObjPropsApis.submitLocProps(this.object.id, 'scope_width', this.oldScope);

	}

	redo () {
		this.excute();
	}

}

export default SetLocScopeWidthAction;
