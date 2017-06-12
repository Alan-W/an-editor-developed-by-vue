// store 中存放全局需要更改的state 数据

import Vue from 'vue'
import Vuex from 'vuex'
import FileTreeModule from './modules/FileTreeModule'
import PanoEditorModule from './modules/PanoEditorModule'

import AMapModule from './modules/AMapModule'
import AssertsMoudle from './modules/AssertsMoudle'
import ModelModule from './modules/ModelModule'
import ThreeDModule from './modules/ThreeDModule'
import * as MutationTypes from './mutation-types'

import ActionManager from '../operActions/ActionsManager'
import * as ActionNameMap from '../operActions/actionNameMap'

import SetLocNameAction from '../operActions/actions/SetLocNameAction'

import ToolFactory from '../coreFactory/ToolFactory'

Vue.use(Vuex);
export let actionManager = new ActionManager ();
console.log('the actionManger is : ----- ', actionManager);

function getViewBtnFromLocalStorage () {
	// 从缓存中工具栏中viewBtn 类型的按钮组的选中状态
	var localViewMode = localStorage.getItem('editViewMode');
	localViewMode = localViewMode ? JSON.parse(localViewMode) : null;
	console.log('从缓存中拿到的编辑模式是: ------ ', localViewMode);

	var localActiveState = 1;

	if (!localViewMode) { // 缓存中没有模式的数据, 则放入缓存
		var storageData = {
			time: Date.parse(new Date()),
			viewMode: localActiveState, // 缓存中没有，默认就是查看
		};
		// 存入缓存
		window.localStorage.setItem('editViewMode', JSON.stringify(storageData));
	} else { // 缓存中存在查看模式的数据
		var curTime = Date.parse(new Date());
		if (curTime - localViewMode.time > 24 * 3600000) { // 时间超过一天，回到默认的查看模式, 清除缓存
			window.localStorage.removeItem('editViewMode');
		} else { // 一天之内，则回到缓存中的模式下
			localActiveState = parseInt(localViewMode.viewMode);
		}
	};

	return localActiveState;
}

var editorBoardType = {
	twoD: '2DmapEditor',
	threeD: '3DmapEditor',
	model: 'modelEditor', 
	pano: 'panoEditor'
}

var editObjTypeMap = {
	loc: 'loc',
	identify: 'identify',
	role: 'role',
}

// 需要维护的状态
const state = {
	curEditMode: editorBoardType.twoD, // 整个编辑器当前正在操作的模式；2DmapEditor,3DmapEditor,modelEditor,panoEditor
	activeToolbarBtn: {
		viewBtn: getViewBtnFromLocalStorage(), // 当前工具栏关于视图选中的按钮状态
		operBtn: '', // 当前工具栏关于剪贴板的按钮状态
		historyBtn: '', // 当前工具栏关于撤销重做选中的按钮状态
		modelBtn: 9, // 当前工具栏关于模型选中的按钮状态
		panoBtn: '', // 当前工具栏关于全景操作选中的按钮状态
	},
	curClickObj: null, // 当前面板选中的对象, 
	errorInfoObj: null, // 面板中当前需要提示的错误信息
};

//getters
const getters = {
	// 当前激活的编辑面板
	getActiveEditMode: state => state.curEditMode,
	// 当前点击的左侧对象
	getCurClickObj: state => state.curClickObj,
}

//mutation
const mutations = {
	// 更改当前的编辑面板	
	[MutationTypes.CHANGE_EDIT_BOARD] (state, curEditMode) {
		state.curEditMode = curEditMode;
	},

	// 更改当前面板中点击的对象
	[MutationTypes.CHANGE_CLICK_OBJ] (state, clickObj) {
		state.curClickObj = clickObj;
	},

	// 更改工具栏当前的选中状态
	[MutationTypes.CHANGE_TOOLBAR_ACTIVE_BTN] (state, activeBtn) {
		state.activeToolbarBtn[activeBtn.type] = activeBtn.value

	},

	// 更改简单属性
	[MutationTypes.CHANGE_OBJ_SIMPLE_INPUT_VALUE] (state, editObjInfo) {
		var actionName = 'Set_'+ ToolFactory.firstUpperCase(editObjInfo.editObj.type) + '_' + ToolFactory.firstUpperCase(editObjInfo.editPropType) + '_Action';
		console.log('the action name is : ----- ', actionName);
		var excuteActionInstance = ActionNameMap[actionName](editObjInfo.editObj.objProps, editObjInfo.newValue);
		excuteActionInstance && actionManager.excute(excuteActionInstance);
	},

	// 设置当前面板上的错误信息
	[MutationTypes.SET_ERROR_DATA_INFO] (state, errorData) {
		console.log('当前面板上的错误信息是: ------ ', errorData);
		state.errorInfoObj = errorData; 
	}	

	
}

//actions
const actions = {
	// change edit board mode
	changeEditBoard ({commit}, board) {
		commit('CHANGE_EDIT_BOARD', board)
	},

	// return the obj that has selected 
	changeClickObj ({commit}, dataObj) {
		console.log(' 当前点击的对象的属性是: ----- ', dataObj);
		// 执行切换对象的action
		console.log('切换选中对象的action中, 传递的dataObj 是: ----- ', dataObj);
		commit('CHANGE_CLICK_OBJ', (dataObj && dataObj.clickObj) || dataObj);
		// dataObj.board && commit('CHANGE_EDIT_BOARD', dataObj.board);
	},

	// change the toolbar active btn state
	changeToolbarActiveState ({commit,state}, activeBtn) {
		console.log('工具栏当前选中的按钮是:-------- ', activeBtn);
		commit('CHANGE_TOOLBAR_ACTIVE_BTN', activeBtn);
		commit(MutationTypes.CHANGE_MODE,state.curEditMode,activeBtn.ename);
	},

	// change obj name prop value
	changeObjSimpleInputValue ({commit}, editObjInfo) {
		console.log(' the new name is : ----- ', editObjInfo);
		commit('CHANGE_OBJ_SIMPLE_INPUT_VALUE', editObjInfo);
	},

	// set board error info
	setErrorInfo ({commit}, errorObj) {
		console.log(' the errorObj is : ------- ', errorObj);
		commit('SET_ERROR_DATA_INFO', errorObj);
	}
}


export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
	modules: {
		FileTreeModule,
		PanoEditorModule,
		AMapModule,
		AssertsMoudle,
		ModelModule,
		ThreeDModule
	}
});