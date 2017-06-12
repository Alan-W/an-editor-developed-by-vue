// 模型编辑器的数据
import globalConfig from '../dataConfig/globalConfig'
import * as MutationTypes from '../mutation-types'
// import ModelSceneOper from '../../components/modelEditor/ModelSceneOper'
import ToolFactory from '../../coreFactory/ToolFactory'
import * as ActionNameMap from '../../operActions/actionNameMap'
import { actionManager } from '../index' 

const state = {
	// 当前在场景中渲染的模型对象
	modelInScene: {
		identify: [], // 标志物模型
		roles: [], //呈现物模型
	}, 
};

// mutations
const mutations = {
	[MutationTypes.CHANGE_MODELS_IN_SCENE] (state, modelsObj) {
		console.log('当前场景中的模型数据是: --- -- ', modelsObj);
		state.modelInScene = modelsObj;
	},

	// 更改模型编辑器中模型的三维属性数据
	[MutationTypes.CHANGE_ROLE_THREED_PROP_IN_MODELEDITOR] (state, editObjInfo) {
		console.log(' 执行了mutation');
		var actionName = 'Set_'+ ToolFactory.firstUpperCase(editObjInfo.editObj.type) + '_' + ToolFactory.firstUpperCase(editObjInfo.editPropType) + '_Action';
		console.log('当前要执行的action 的名称是: ----- ', actionName);
		var excuteActionInstance = ActionNameMap[actionName](editObjInfo.editObj.objProps, editObjInfo.newValue, editObjInfo.thisRoleHasBoundIdenfityID, editObjInfo.changeValueType);
		excuteActionInstance && actionManager.excute(excuteActionInstance);
	}
}

// actions 
const actions = {
	changeModelsInScene ({commit}, modelsObj) {
		commit('CHANGE_MODELS_IN_SCENE', modelsObj);
		// 加载当前场景中的模型
		// ModelSceneOper.loadModelsInScene(modelsObj);
	},

	// 更改模型编辑器中的模型三维数据
	changeRolePropInModeleditor ({commit}, editObjInfo) {
		console.log('触发了action');
		commit('CHANGE_ROLE_THREED_PROP_IN_MODELEDITOR', editObjInfo);
	}
}

export default {
	state, 
	actions,
	mutations,
}