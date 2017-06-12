import { Action } from '../action'
import SubmitObjPropsApis from '../../store/apis/submitObjPropsApi'

// 地点绑定标志物的ACTION
var LocBindIdentifyAction = class LocBindIdentifyAction extends Action {
	constructor(bindInfo) {
		super( 'LocBindIdentifyAction', 'loc bind identify');
		this.dropLoc = bindInfo.drop.data; // 放置的地点
		this.dragIdentify = bindInfo.drag.data; // 拖拽的标志物
	}

	// push the LocBindIdentifyAction to the actions stacks;
	excute () {
		this.dropLoc.identifiers.push(this.dragIdentify);
		this.dragIdentify.roles = [];
		// 向后台提交数据
		SubmitObjPropsApis.orgBindSubmit('identifier_id', this.dropLoc.id, this.dragIdentify.id);
	}


	// undo the action
	undo () {

		var that = this;
		var findResult = this.dropLoc.identifiers.findIndex(function (elem, index) {
			return parseInt(elem.id) == parseInt(that.dragIdentify.id);
		});
		console.log('the findResult is : ----- --- ', findResult);
		this.dropLoc.identifiers.splice(findResult, 1);
		// 向后台提交数据
		SubmitObjPropsApis.orgUnBindSubmit('identifier_id', this.dropLoc.id, this.dragIdentify.id);
	}

	// redo action
	redo () {
		this.excute();
	}

}

export default LocBindIdentifyAction;
