import { Action } from '../action'
import SubmitObjPropsApis from '../../store/apis/submitObjPropsApi'
import globalConfig from '../../store/dataConfig/globalConfig'
import IndexStore from '../../store/index'


// 地点绑定标志物的ACTION
var DeleteIdentifyBoundRoleInstanceAction = class DeleteIdentifyBoundRoleInstanceAction extends Action {
	constructor(unBindRole, bindIdentify) {
		super( 'DeleteIdentifyBoundRoleInstanceAction', 'loc unbind identify');
		this.unBindRole = unBindRole; // 要解绑的呈现物
		this.bindIdentify = bindIdentify; // 绑定的标志物
		this.identifyBindLoc = bindIdentify.identifyBindLoc ? bindIdentify.identifyBindLoc.id : null; // 该标志物绑定的地点
	}

	// push the DeleteIdentifyBoundRoleInstanceAction to the actions stacks;
	excute () {
		var that = this;
		if (this.bindIdentify.roles) {
			var findResult = this.bindIdentify.roles.findIndex(function(data) {
				return data.id == that.unBindRole.id;
			});

			console.log('删除标志物绑定的呈现物时找到的结果是: ----- ', findResult);
			if (findResult !== -1) { // 找到了对应的呈现物
				// 向后台提交数据
				SubmitObjPropsApis.identifyUnBindRoleSubmit(this.identifyBindLoc.id, this.bindIdentify.id, this.unBindRole.id);
				this.bindIdentify.roles.splice(findResult, 1); // 删除该呈现物
			}
		};

		// 如果当前场景中有该呈现物的模型, 则删除场景中的该模型
		if (this.unBindRole.type && parseInt(this.unBindRole.type) == 1) { // 当前的呈现物是3D模型
			var roleModel = globalConfig.modelScene.getRoleModelByUuid(this.unBindRole.id);
			console.log('删除模型资源的时候，在场景中找到的3D模型是: ---- ', roleModel);
			if (roleModel.model || roleModel.ctrl) globalConfig.modelScene.removeProperModel(roleModel);
		}
	}


	// undo the action
	undo () {
		this.bindIdentify.roles.push(this.unBindRole);
		// 提交绑定关系的数据
		SubmitObjPropsApis.identifyBindRoleSubmit(this.identifyBindLoc.id, this.identifyBindLoc.id, this.unBindRole);

		// 若当前的编辑模式是模型编辑器, 那么加载该标志物绑定的该呈现物的模型
		console.log('编辑器当前的编辑模式是: ---- ', IndexStore.state.curEditMode);
		if (IndexStore.state.curEditMode == 'modelEditor') {
			if (parseInt(this.unBindRole.type) == 1) { // 刚才删除的呈现物是模型类型的
				globalConfig.modelScene.loadObjModel(this.unBindRole);
			}
		}
	}

	redo () {
		this.excute();
	}

}

export default DeleteIdentifyBoundRoleInstanceAction;
