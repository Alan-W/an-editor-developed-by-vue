import { Action } from '../action'
import SubmitObjPropsApis from '../../store/apis/submitObjPropsApi'
import globalConfig from '../../store/dataConfig/globalConfig'


// 地点绑定标志物的ACTION
var DeleteBoundLBSRoleInstanceAction = class DeleteBoundLBSRoleInstanceAction extends Action {
	constructor(unbindRole, bindLoc) {

		super( 'DeleteBoundLBSRoleInstanceAction', 'loc unbind role');
		this.unBindRole = unbindRole; // 当前要解绑的呈现物的信息
		this.bindLoc = bindLoc; // 该呈现物绑定的地点
	}

	// 执行删除呈现物绑定
	excute () {
		var that = this;
		if (this.bindLoc.locationRoles) {
			var findResult = this.bindLoc.locationRoles.findIndex(function(data) {
				return data.id == that.unBindRole.id;
			});

			console.log('删除绑定呈现物时找到的结果是: ----- ', findResult);
			if (findResult !== -1) { // 找到了对应的呈现物
				// 向后台提交数据
				SubmitObjPropsApis.orgUnBindSubmit('role_id', this.bindLoc.id, this.unBindRole.id);
				
				this.bindLoc.locationRoles.splice(findResult, 1); // 删除该呈现物
			}
		};

		// 如果当前场景中有该呈现物的模型, 则删除场景中的该模型
		if (this.unBindRole.type && parseInt(this.unBindRole.type) == 1) { // 当前的呈现物是3D模型
			// 清除场景, 因为LBS 在场景中只可能是一个
			globalConfig.modelScene.clear();
		}
	}


	// undo the action
	undo () {

		this.bindLoc.locationRoles.push(this.unBindRole);
		// 向后台提交数据
		SubmitObjPropsApis.orgBindSubmit('role_id', this.bindLoc.id, this.unBindRole.id, this.unBindRole);

		// 加载被删除的模型
		if (this.unBindRole.type && parseInt(this.unBindRole.type) == 1) { // 当前的呈现物是3D模型
			globalConfig.modelScene.loadObjModel(this.unBindRole);
		}
	}

	redo () {
		this.excute();
	}

}

export default DeleteBoundLBSRoleInstanceAction;