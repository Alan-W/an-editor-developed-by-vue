//  左侧文件树的数据, 独自成为一个模块自己去管理自己的状态


import axios from 'axios'
import globalConfig from '../dataConfig/globalConfig';
import * as MutationTypes from '../mutation-types';
import { actionManager } from '../index'
import * as ActionNameMap from '../../operActions/actionNameMap'


// 需要维护的状态
const state = {
	locationList: [], // 当前的地点列表数组
	curDragLoc: null, // 当前拖拽的地点
};

// getters
const getters = {
	getLocsList: state => state.locationList,
	getCurDragLoc: state => state.curDragLoc
}

//mutation
const mutations = {
	// 获取机构绑定关系数据	
	[MutationTypes.GET_LOCATION_LIST] (state, locationList) {
		state.locationList = locationList;
	},

	// 左侧关系的绑定:(地点绑定标志物, 地点绑定呈现物, 标志物绑定呈现物)
	[MutationTypes.ORG_OBJ_BIND] (state, bindInfo) {
		var actionName = bindInfo.drop.type + '_Bind_' + bindInfo.drag.type + 
		'_Action';
		console.log('the actionName is : ------ ', actionName);
		var excuteActionInstance = ActionNameMap[actionName](bindInfo);
		console.log(' the actionManager is : ----- ', actionManager);
		excuteActionInstance && actionManager.excute(excuteActionInstance);
	},

	// 拖拽地点到高德地图
	[MutationTypes.DRAG_LOC_TO_AMAP] (state, locObj) {
		state.curDragLoc = locObj;
	}
}

//actions
const actions = {
	getLocationList ({commit}) {
		axios.get(globalConfig.apiUrl, {
			params: {
				r: 'organization/static',
				fields: null,
				expand: 'getLocationList',
				oid: globalConfig.oid
			}
		})
		.then(function (resp) {
			console.log(' getLocationList success: ---- ', resp);
			if (resp && resp.data && resp.data.getLocationList && resp.data.getLocationList.data) {
				commit('GET_LOCATION_LIST', resp.data.getLocationList.data)
			}
		})
		.catch(function (err) {
			console.log('getLocationList error : ---- ', err);
		})
	},

	orgObjBindAction ({commit}, bindInfo) {
		commit('ORG_OBJ_BIND', bindInfo);
	},

	// 拖拽地点到高德地图
	dragLocToAmap ({commit}, locObj) {
		commit('DRAG_LOC_TO_AMAP', locObj)
	}
}

export default  {
	state,
	actions,
	getters,
	mutations
}