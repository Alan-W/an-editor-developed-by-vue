import { Action } from '../action'
import SubmitObjPropsApis from '../../store/apis/submitObjPropsApi'


// 地点绑定标志物的ACTION
var LocBindRoleAction = class LocBindRoleAction extends Action {
	constructor( bindInfo) {
		super( 'LocBindRoleAction', 'loc bind identify');
		this.dropLoc = bindInfo.drop.data; // 放置的地点
		this.dragRole = bindInfo.drag.data; // 拖拽的呈现物
	}

	// push the LocBindRoleAction to the actions stacks;
	excute () {
		
		this.dropLoc.locationRoles.push(this.dragRole);
		// 向后台提交数据
		SubmitObjPropsApis.orgBindSubmit('role_id', this.dropLoc.id, this.dragRole.id, this.dragRole);
	}


	// undo the action
	undo () {
		var that = this;
		var findResult = this.dropLoc.locationRoles.findIndex(function (elem, index) {
			return parseInt(elem.id) == parseInt(that.dragRole.id);
		});
		console.log('the findResult is : ----- --- ', findResult);
		this.dropLoc.locationRoles.splice(findResult, 1);
		// 向后台提交数据
		SubmitObjPropsApis.orgUnBindSubmit('role_id', this.dropLoc.id, this.dragRole.id);
	}

	redo () {
		this.excute();
	}

}

export default LocBindRoleAction;
