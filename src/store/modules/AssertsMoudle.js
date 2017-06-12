import axios from 'axios'
import globalConfig from '../dataConfig/globalConfig'
import * as MutationTypes from '../mutation-types'

const state = {
	assertsObj: null,
	curActiveAssertTag: {
		folderChild: [],
		assertsChild: [],
		id: null, // 当前选中的资源标签的ID
		type: null, // 当前选中的标签的类型
	},
	curDragAssertObj: null, // 当前资源蓝鼠标拖拽的对象信息
}

// getters
const getters = {
	getAsserts: state => state.assertsObj,
	getCurActiveTag: state => state.curActiveAssertTag,
	getCurDragAssert: state => state.curDragAssertObj
}

// mutations
const mutations = {
	// 获取机构下的标志物和呈现物的资源
	[MutationTypes.GET_ASSERTS_INFO] (state, asserstData) {
		console.log(' the assertsData is: ---- ', asserstData);
		state.assertsObj = asserstData;
	},

	// 更改资源栏当前选中的资源对象信息
	[MutationTypes.CHANGE_CUR_ACTIVE_ASSERT_TAG] (state, tagObj) {
		console.log('当前点击选中的资源的标签信息是: - ---- ', tagObj);
		state.curActiveAssertTag = tagObj;
	},

	// 更改当前拖拽的资源对象信息
	[MutationTypes.CHANGE_CUR_DRAG_ASSERT_OBJ] (state, assertObj) {
		console.log('当前资源栏拖拽的对象是: ------ ', assertObj);
		state.curDragAssertObj = assertObj;
	}
}

// actions
const actions = {
	// 获取机构下的资源信息
	getAssertsInfo ({commit}) {
		axios.get(globalConfig.apiUrl, {
			params: {
				r: 'organization/static',
				fields: 'null',
				expand: 'getResources',
				oid: globalConfig.oid
			}
		})
		.then(function (resp) {
			console.log('getAssertsObj success: --- ', resp);
			if (resp && resp.data && resp.data.getResources) {
				commit('GET_ASSERTS_INFO', resp.data.getResources);
			}
		})
		.catch(function(err) {
			console.log('getAsserts error : ----- ', err);
		})
	},

	// 切换当前选中的资源标签信息
	changeCurAssertTag ({commit}, curTagInfo) {
		commit('CHANGE_CUR_ACTIVE_ASSERT_TAG', curTagInfo);
	},

	// 切换当前拖拽的资源对象信息
	changeCurDragAssertObj ({commit}, curAssertInfo) {
		commit('CHANGE_CUR_DRAG_ASSERT_OBJ', curAssertInfo);
	}
}

export default {
	state,
	actions,
	getters,
	mutations
}