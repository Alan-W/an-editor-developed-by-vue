import axios from 'axios';
import PanoOperation from '../../components/panoEditor/PanoOperation';
import globalConfig from '../dataConfig/globalConfig';
import PanoFactory from '../../coreFactory/PanoFactory';
import * as MutationTypes from '../mutation-types';

// 需要维护的状态
const state = {
	mouseupFlag: true,
	mousemoveFlag: true,
	scenicName: '',
	NearPanoArray: [],
	curTags: {
		labelArray: [],
		throughArray: [],
	}
};

// getters
const getters = {
	getScenicName: state => state.scenicName,
	getMouseupFlag: state => state.mouseupFlag,
	getMousemoveFlag: state => state.mousemoveFlag,
	getCurTags: state => state.curTags,
	getNearPanoArray: state => state.NearPanoArray
}

//mutation
const mutations = {
	//点击全景canvas时
	[MutationTypes.ON_PANOCLICK](state, {
		event,
		btnType
	}) {
		var curDiv = event.target.nodeName.toUpperCase() == 'DIV' ? event.target : event.target.parentNode;
		$(curDiv).addClass("shine_border").siblings().removeClass('shine_border');
		if ($(event.target).is("canvas") && btnType) {
			console.log("添加标签状态");
			var newObj = null,
				labelType, defaultText;
			PanoOperation.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			PanoOperation.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
			PanoOperation.raycaster.setFromCamera(PanoOperation.mouse, PanoOperation.camera);
			var intersects = PanoOperation.raycaster.intersectObjects(PanoOperation.scene.children);
			var zuobiao = PanoOperation.toScreenPosition(intersects[0].point);
			console.log("坐标----", zuobiao);
			if (btnType == 12) {
				console.log("添加自定义文本标签状态");
				labelType = 1;
				defaultText = "Text";
			} else if (btnType == 13) {
				console.log("添加穿越地点标签状态");
				labelType = 2;
				defaultText = "选择目标地点：";
			}
			$.ajax({
				url: globalConfig.apiUrl + '?r=panorama-property/static&expand=addPanoPro',
				type: 'POST',
				data: {
					panorama_id: PanoOperation.panoId,
					icon: PanoOperation.defaultIcon,
					text: defaultText,
					colour: PanoOperation.defaultColour,
					size: PanoOperation.defaultSize,
					coord: '{"x":"' + intersects[0].point.x + '","y":"' + intersects[0].point.y + '","z":"' + intersects[0].point.z + '"}',
					location_id: '',
					type: labelType
				},
				success: function(resp) {
					console.log('创建标签的返回值是----', resp);
					if (resp.addPanoPro.success) {
						resp = resp.addPanoPro.data;
						if (btnType == 13) {
							newObj = {
								id: resp.id,
								left: zuobiao.left,
								top: zuobiao.top,
								coord: resp.coord,
								locationList: resp.text,
								type: resp.type
							}
							state.curTags.throughArray.push(newObj);
						} else if (btnType == 12) {
							newObj = {
								id: resp.id,
								left: zuobiao.left,
								top: zuobiao.top,
								coord: resp.coord,
								text: resp.text,
								icon: resp.icon,
								colour: resp.colour,
								size: resp.size,
								type: resp.type
							}
							state.curTags.labelArray.push(newObj);
						}
						PanoOperation.labelArray.push(newObj);
						console.log("state.curTags---", state.curTags);
					}
				},
				error: function(e, x, r) {
					console.log("panoInforError---", e);
				}
			});
		}
	},
	[MutationTypes.GET_LABEL_LIST](state, {
		labelList,
		panoId,
		scenicName
	}) {
		console.log(' the labelList is : ------ ', labelList);
		console.log(' the scenicName is : ------ ', scenicName);
		state.scenicName = scenicName;
		state.curTags.throughArray = [];
		state.curTags.labelArray = [];
		for (var i = 0; i < labelList.length; i++) {
			var thisItem = labelList[i];
			var newItem;
			var zuobiao = PanoOperation.toScreenPosition(JSON.parse(thisItem.coord));
			if (thisItem.type == 2) {
				newItem = {
					id: thisItem.id,
					left: zuobiao.left,
					top: zuobiao.top,
					coord: thisItem.coord,
					locationList: thisItem.text,
					type: thisItem.type
				}
				state.curTags.throughArray.push(newItem);
			} else {
				newItem = {
					id: thisItem.id,
					left: zuobiao.left,
					top: zuobiao.top,
					coord: thisItem.coord,
					text: thisItem.text,
					icon: thisItem.icon,
					colour: thisItem.colour,
					size: thisItem.size,
					type: thisItem.type
				}
				state.curTags.labelArray.push(newItem);
			}
			console.log("state.curTags---",state.curTags);
			PanoOperation.labelArray.push(thisItem);
		}
	},
	[MutationTypes.GET_PANO_LIST](state, {
		panoId,
		panoList
	}) {
		state.NearPanoArray = [];
		for (var i = 0; i < panoList.length; i++) {
			var curItem = panoList[i];
			if (curItem.pano_id) {
				console.log("curItem.name is ---", curItem.name, "state.scenicName is ---", state.scenicName);
				if (curItem.pano_id == panoId) {
					console.log(curItem.name);
					continue;
				}
				state.NearPanoArray.push(curItem);
				console.log(' the state.NearPanoArray is : ------ ', state.NearPanoArray);
			}
		}
	},
	[MutationTypes.ON_CONTAINER_MOUSEDOWN](state, event) {
		state.mouseupFlag = true;
		PanoOperation.isUserInteracting = true;
		PanoOperation.onPointerDownPointerX = event.clientX;
		PanoOperation.onPointerDownPointerY = event.clientY;
		PanoOperation.onPointerDownLon = Number(PanoOperation.lon);
		PanoOperation.onPointerDownLat = Number(PanoOperation.lat);
	},
	[MutationTypes.ON_CONTAINER_MOUSEMOVE](state, event) {
		if (PanoOperation.isUserInteracting === true && event.which == 1) {
			PanoOperation.lon = (PanoOperation.onPointerDownPointerX - event.clientX) * 0.1 + PanoOperation.onPointerDownLon;
			PanoOperation.lat = (event.clientY - PanoOperation.onPointerDownPointerY) * 0.1 + PanoOperation.onPointerDownLat; //move跟随鼠标移动的位置
			PanoOperation.loop();
		}
	},
	[MutationTypes.ON_CONTAINER_MOUSEUP](state, event) {
		PanoOperation.isUserInteracting = false;
		PanoOperation.isMoveleft = false;
		PanoOperation.isMoveright = false;
		PanoOperation.isMovetop = false;
		PanoOperation.isMovedown = false;
		state.mouseupFlag = false;
	},
	[MutationTypes.ON_CONTAINER_MOUSEWHEEL](state, event) {
		PanoOperation.camera.fov += event.deltaY * 0.05;
		if (PanoOperation.camera.fov <= 5) {
			PanoOperation.camera.fov = 5;
		} else if (PanoOperation.camera.fov >= 150) {
			PanoOperation.camera.fov = 150;
		} else {
			PanoOperation.camera.fov += event.deltaY * 0.05;
		}
		PanoOperation.camera.updateProjectionMatrix();
		//实时更新已有文本在场景中的坐标
		PanoOperation.update();
	},
	[MutationTypes.ON_INPUT_CLICK](state, event) {
		console.log("点击了Input框,无法在此处添加标签！！！");
		$(event.target).parent().addClass("shine_border").siblings().removeClass('shine_border');
	},
	[MutationTypes.ON_INPUT_KEYDOWN](state, event) {
		$(event.target).width(PanoOperation.textWidth($(event.target).val()));
	},
	[MutationTypes.ON_INPUT_UPDATEMESSAGE](state, {
		event,
		curLabelData
	}) {
		console.log("curLabelData----:", curLabelData);
		event.target.blur();
		var oldObj = state.curTags.labelArray;
		var curLabelId = curLabelData.id;
		var value = $(event.target).val();
		for (var i = 0; i < oldObj.length; i++) {
			var curItem = oldObj[i];
			if (curItem.id == curLabelId) {
				PanoFactory.changeLabelProp(curLabelId, "text", value);
			}
		}
	},
	/*[MutationTypes.ON_H6_CLICK](state, event) {
		console.log("点击了h6标签,无法在此处添加标签！！！");
		$(event.target).parent().addClass("shine_border").siblings().removeClass('shine_border');
	},*/
	[MutationTypes.ON_ARROWIMG_CLICK](state, event) {
		console.log("点击了箭头方位按钮！实现穿越");
	},

}

//actions
const actions = {
	//点击全景地图
	onpanoClick({
		commit,
		state,
		rootState
	}, $event) {
		var btnType = rootState.activeToolbarBtn.panoBtn;
		commit('ON_PANOCLICK', {
			event: $event,
			btnType: btnType
		})
	},
	onDocumentMouseDown({
		commit
	}, $event) {
		commit('ON_CONTAINER_MOUSEDOWN', $event)
	},
	onDocumentMouseMove({
		commit
	}, $event) {
		commit('ON_CONTAINER_MOUSEMOVE', $event)
	},
	onDocumentMouseUp({
		commit
	}, $event) {
		commit('ON_CONTAINER_MOUSEUP', $event)
	},
	onDocumentMouseWheel({
		commit
	}, $event) {
		commit('ON_CONTAINER_MOUSEWHEEL', $event)
	},
	getLabelList({
		commit
	}, {
		panoId,
		scenicName
	}) {
		axios.get(globalConfig.apiUrl, {
				params: {
					r: 'panorama/view',
					id: panoId
				}
			})
			.then(function(resp) {
				console.log("the panoId is ---", panoId);
				console.log("the scenicName is ---", scenicName);
				console.log(' getLabelList success: ---- ', resp);
				if (resp && resp.data && resp.data.property) {
					commit('GET_LABEL_LIST', {
						labelList: resp.data.property,
						scenicName: scenicName
					})
				}

			})
			.catch(function(err) {
				console.log(' getLabelList error : ---- ', err);
			})
	},
	getPanoList({
		commit
	}, panoId) {
		axios.get(globalConfig.apiUrl, {
				params: {
					r: 'organization/static',
					fields: 'null',
					expand: 'getLocationList',
					oid: globalConfig.oid
				}
			})
			.then(function(resp) {
				console.log(' getPanoList success: ---- ', resp);
				console.log("the nearBox panoId is---", panoId);
				if (resp && resp.data && resp.data.getLocationList && resp.data.getLocationList.data) {
					commit('GET_PANO_LIST', {
						panoList: resp.data.getLocationList.data,
						panoId: panoId
					})
				}

			})
			.catch(function(err) {
				console.log(' getPanoList error : ---- ', err);
			})
	},
	onInputClick({
		commit
	}, $event) {
		commit('ON_INPUT_CLICK', $event)
	},
	onInputKeydown({
		commit
	}, $event) {
		commit('ON_INPUT_KEYDOWN', $event)
	},
	updateMessage({
		commit,
		state,
		rootState
	}, $event) {
		var curLabelData = rootState.curClickObj;
		commit('ON_INPUT_UPDATEMESSAGE', {
			event: $event,
			curLabelData: curLabelData
		})
	},
	onH6Click({
		commit
	}, $event) {
		commit('ON_H6_CLICK', $event)
	},
	onArrowImgClick({
		commit
	}, $event) {
		commit('ON_ARROWIMG_CLICK', $event)
	},
}

export default {
	state,
	actions,
	getters,
	mutations
}