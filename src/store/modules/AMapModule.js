import axios from 'axios'
import globalConfig from '../dataConfig/globalConfig';
import * as MutationTypes from '../mutation-types';

// 获取缓存中关于地图显示属性的数据
function getLocalStorageOperData () {
	var localStorageMapInfo = localStorage.getItem('localMapInfo');
	console.log('当前缓存中的地图操作信息是: ------ ', localStorageMapInfo);
	if (localStorageMapInfo) localStorageMapInfo =  JSON.parse(localStorageMapInfo);
	else { // 没有缓存，默认是打开，设置缓存
		var operData = {
			showMapDefaultMarker: 1, // 1代表的是打开的状态(默认是显示高德地图上默认的地点的)
			showMapCustomMapLayer: 1, // 1代表的是打开的状态(默认是显示高德地图的手绘地图的)
		};

		localStorageMapInfo = operData;
		localStorage.setItem('localMapInfo', JSON.stringify(operData));
	};
	return localStorageMapInfo;
}

// 递归列表拿到所有的地点
let tempArray = [];
function getAllLocsList (data) {
	for (var i = 0; i < data.length; i++) {
		var loc = data[i];
		tempArray.push(loc);
		if (loc.child && loc.child.length > 0) {
			getAllLocsList(loc.child);
		}
	}
	return tempArray;
}


// 需要维护的状态
const state = {
	// 初始化当机构的数据
	orgInfo: {
		id: null,
		name: '',
		center: globalConfig.amapConfig.defMapCenter,
		map_image: globalConfig.amapConfig.defMapImageUrl,
		south_west: {lng:globalConfig.amapConfig.defMapBounds[0][0] ,lat: globalConfig.amapConfig.defMapBounds[0][1]},
		north_east: {lng:globalConfig.amapConfig.defMapBounds[1][0] ,lat: globalConfig.amapConfig.defMapBounds[1][1]},
		map_south_west: {
			lng: globalConfig.amapConfig.defMapBounds[0][0],
			lat: globalConfig.amapConfig.defMapBounds[0][1]
		},
		map_north_east: {
			lng:globalConfig.amapConfig.defMapBounds[1][0],
			lat: globalConfig.amapConfig.defMapBounds[1][1]
		},
		show_map_default_marker: getLocalStorageOperData().showMapDefaultMarker, // 从缓存中获取，当前是否是显示高德地图的默认地点标签
		show_map_custom_image_layer: getLocalStorageOperData().showMapCustomMapLayer, // 从环缓存获取， 当前是否显示高德地图的手绘地图图层
		clickType: 'map',
		
	}, 
	allLocsList:[], // 当前的所有地点
};

// getters
const getters = {
	getOrgInfo: state => state.orgInfo,

	// 获取当前所有的地点，递归将所有的地点拿出来
	getAllLocs (state, getters, rootState) {
		state.allLocsList = getAllLocsList(rootState.FileTreeModule.locationList);
		return state.allLocsList;
	}
}

//mutation
const mutations = {
	// 获取机构绑定关系数据	
	[MutationTypes.GET_ORGANIZATION_INFO] (state, orgData) {
		var northEastData = orgData.north_east ? JSON.parse(orgData.north_east) : state.orgInfo.north_east;
		var southWestData = orgData.south_west ? JSON.parse(orgData.south_west) : state.orgInfo.south_west;
		var mapNorthEastData = orgData.map_north_east ? JSON.parse(orgData.map_north_east) : state.orgInfo.map_north_east;
		var mapSouthWestData = orgData.map_south_west ? JSON.parse(orgData.map_south_west) : state.orgInfo.map_south_west;
		northEastData.lng = Number(northEastData.lng);
		northEastData.lat = Number(northEastData.lat);
		southWestData.lng = Number(southWestData.lng);
		southWestData.lat = Number(southWestData.lat);
		mapNorthEastData.lng = Number(mapNorthEastData.lng);
		mapNorthEastData.lat = Number(mapNorthEastData.lat);
		mapSouthWestData.lng = Number(mapSouthWestData.lng);
		mapSouthWestData.lat = Number(mapSouthWestData.lat);

		state.orgInfo.id = orgData.id;
		state.orgInfo.name = orgData.name;
		state.orgInfo.map_image = orgData.map_image && orgData.map_image;
		state.orgInfo.north_east = northEastData;
		state.orgInfo.south_west = southWestData;
		state.orgInfo.map_south_west = mapSouthWestData;
		state.orgInfo.map_north_east = mapNorthEastData;
		state.orgInfo.center = [((southWestData.lng + northEastData.lng) /2).toFixed(7), ((southWestData.lat + northEastData.lat) / 2).toFixed(7)];
	}
}

//actions
const actions = {
	getOrganizationInfo ({commit}) {
		axios.get(globalConfig.apiUrl, {
			params: {
				r: 'organization/view',
				id: globalConfig.oid
			}
		})
		.then(function (resp) {
			console.log(' getOrgInfo success: ---- ', resp);
			if (resp) {
				commit('GET_ORGANIZATION_INFO', resp.data)
			}
			
		})
		.catch(function (err) {
			console.log(' getOrgInfo error : ---- ', err);
		})
	}
}

export default  {
	state,
	actions,
	getters,
	mutations
}