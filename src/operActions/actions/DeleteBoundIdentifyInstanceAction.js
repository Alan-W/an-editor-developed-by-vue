import { Action } from '../action'
import SubmitObjPropsApis from '../../store/apis/submitObjPropsApi'
import globalConfig from '../../store/dataConfig/globalConfig'
import IndexStore from '../../store/index'

// 地点绑定标志物的ACTION
var DeleteBoundIdentifyInstanceAction = class DeleteBoundIdentifyInstanceAction extends Action {
	constructor(unBindIdentify, bindLoc) {
		super( 'DeleteBoundIdentifyInstanceAction', 'loc unbind identify');
		this.unBindIdentify = unBindIdentify;
		this.bindLoc = bindLoc;
	}

	// push the DeleteBoundIdentifyInstanceAction to the actions stacks;
	excute () {

		var that = this;
		if (this.bindLoc.identifiers) {
			var findResult = this.bindLoc.identifiers.findIndex(function(data) {
				return data.id == that.unBindIdentify.id;
			});

			console.log('删除绑定标志物时找到的结果是: ----- ', findResult);
			if (findResult !== -1) { // 找到了对应的呈现物
				// 向后台提交数据
				SubmitObjPropsApis.orgUnBindSubmit('identifier_id', this.bindLoc.id, this.unBindIdentify.id);
				
				this.bindLoc.identifiers.splice(findResult, 1); // 删除该呈现物
			}
		};

		// 如果当前的编辑模式是模型编辑器
		if (IndexStore.state.curEditMode == 'modelEditor') {
			// 清除场景中的虽所有模型
			globalConfig.modelScene.clear();
		}

		// 如果当前删除的标志物刚好是选中获得焦点的状态, 那么将state 中的curClickObj 置为null
		var boardActiveObj = IndexStore.state.curClickObj;
		if (boardActiveObj && boardActiveObj.clickType && boardActiveObj.clickType && this.unBindIdentify.clickType && this.unBindIdentify.clickType ==  boardActiveObj.clickType) {
			if (boardActiveObj.id == this.unBindIdentify.id) {
				IndexStore.dispatch('changeClickObj', null);	
			}	
		}
	}
	


	// undo the action
	undo () {
		this.bindLoc.identifiers.push(this.unBindIdentify);
		// 向后台提交数据
		SubmitObjPropsApis.orgBindSubmit('identifier_id', this.bindLoc.id, this.unBindIdentify.id);

		// 若当前的编辑模式是模型编辑器, 那么加载删除的标志物模型和该标志物绑定的呈现物模型
		console.log('编辑器当前的编辑模式是: ---- ', IndexStore.state.curEditMode);
		if (IndexStore.state.curEditMode == 'modelEditor') {
			var loadIdentifyType = 'create' + globalConfig.identifyTypeMap[this.unBindIdentify.resource_type]+'IdentifyModel';
			console.log('场景中要加载的标志物的名称是: ----- ', loadIdentifyType);
			globalConfig.modelScene[loadIdentifyType](this.unBindIdentify);

			// 加载该标志物绑定的呈现物
			if (this.unBindIdentify.roles && this.unBindIdentify.roles.length > 0) {
				for (var i = 0; i < this.unBindIdentify.roles.length; i++) {
					var role = this.unBindIdentify.roles[i];
					// 加载当前的3D 模型
					if (role.type == 1) {
						globalConfig.modelScene.loadObjModel(role);
					}
				}
			}
		}

		// 如果当前删除的标志物刚好是选中获得焦点的状态, 那么将state 中的curClickObj 置为null
		var boardActiveObj = IndexStore.state.curClickObj;
		if (boardActiveObj && boardActiveObj.clickType && boardActiveObj.clickType && this.unBindIdentify.clickType && this.unBindIdentify.clickType ==  boardActiveObj.clickType) {
			if (boardActiveObj.id == this.unBindIdentify.id) {
				IndexStore.dispatch('changeClickObj', this.unBindIdentify);	
			}	
		}
	}

	redo () {
		this.excute();
	}

}

export default DeleteBoundIdentifyInstanceAction;
