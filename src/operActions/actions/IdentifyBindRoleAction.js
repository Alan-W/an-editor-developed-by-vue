import { Action } from '../action'
import SubmitObjPropsApis from '../../store/apis/submitObjPropsApi'

// 地点绑定标志物的ACTION
var IdenfityBindRoleAction = class IdenfityBindRoleAction extends Action {
	constructor(bindInfo) {
		super( 'IdenfityBindRoleAction', 'idenfity bind role');
		console.log('标志物绑定呈现物的bindInfo 是:----- ', bindInfo);
		this.dropIdentify = bindInfo.drop.data; // 放置的标志物
		this.dragRole = bindInfo.drag.data; // 拖拽的呈现物
		this.locID = bindInfo.locID; // 标志物所在的呈现物
	}

	// push the IdenfityBindRoleAction to the actions stacks;
	excute () {

		// 当前拖放的地点ID
		if (this.dropIdentify.roles) this.dropIdentify.roles.push(this.dragRole);
		else this.dropIdentify.roles = [this.dragRole];

		// 提交绑定关系的数据
		SubmitObjPropsApis.identifyBindRoleSubmit(this.locID, this.dropIdentify.id, this.dragRole);
		
	}

	// undo the action
	undo () {
		var that = this;
		var findResult = this.dropIdentify.roles.findIndex(function (elem, index) {
			return parseInt(elem.id) == parseInt(that.dragRole.id);
		});
		console.log('in IdenfityBindRoleAction, the findResult is : ----- --- ', findResult);
		this.dropIdentify.roles.splice(findResult, 1);
		// 向后台提交数据
		SubmitObjPropsApis.identifyUnBindRoleSubmit(this.locID, this.dropIdentify.id, this.dragRole.id);
	}

	redo () {
		this.excute();
	}

}

export default IdenfityBindRoleAction;
