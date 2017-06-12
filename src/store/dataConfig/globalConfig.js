// 获取当前的域名
function getCurProVersion () {
	var apiUrl = 'http://api.scoope.net/';
	var adminUrl = 'http://localhost:8080/';
	var curHost = window.location.hostname;
	var version = -1; 
	console.log('当前的域名是: -------- ', curHost);
	var regLocal = new RegExp('.net$');
	var regDev = new RegExp('.jinglian.com$');
	var regPre = new RegExp('.chinarcsd.com$');
	var regFormal = new RegExp('.jinglianwang.cn$');
	var localHost = new RegExp('.localhost$');
	if (curHost.match(regLocal)){ 
		version = 0;
		apiUrl = 'http://api.scoope.net/';
		adminUrl = 'http://admin.scoope.net/';
	} 
	else if (curHost.match(regDev)) { 
		version = 1;
		apiUrl = 'http://scp-api.jinglian.com/';
		adminUrl = 'http://scp-admin.jinglian.com/';
	}
	else if (curHost.match(regPre)) { 
		version = 2;
		apiUrl = 'https://scp-api.chinarcsd.com/';
		adminUrl = 'http://scp-admin.chinarcsd.com/';
	}
	else if (curHost.match(regFormal)) { 
		version = 3;
		apiUrl = 'https://scp-api.jinglianwang.cn/';
		adminUrl = 'http://scp-admin.jinglianwang.cn/';
	} else if (curHost.match(localHost)) { 
		version = 4;
		apiUrl = 'http://api.scoope.net/';
		adminUrl = curHost;
	}

	return {
		version: version,
		apiUrl: apiUrl,
		adminUrl: adminUrl
	};
}

import { AMapManager } from 'vue-amap';
let amapManager = new AMapManager();
let modelScene = null;

export default {
	version: getCurProVersion().version, 
	apiUrl: getCurProVersion().apiUrl,
	adminUrl: getCurProVersion().adminUrl,
	oid: 4,

	// 属性名对应的组件名 映射 
	propsMapVueObj: {

		id: "SimpleShowProp",
		aspect: "SimpleShowProp",
		lt_id: "SimpleShowProp",
		bind_id: "SimpleShowProp",
		model_resource_id: "ModelResourceIDProp",
		name: "SimpleInputProp",
		title: "SimpleInputProp",
		longitude: 'SimpleInputProp',
		latitude: 'SimpleInputProp',
		scope: 'SimpleInputProp',
		scope_width: 'SimpleInputProp',
		logo: 'ImgProp',
		map_image: 'MapImageProp',
		scope_type: 'DropDownListProp',
		south_west: 'DoubleInputProp',
		north_east: 'DoubleInputProp',
		map_north_east: 'DoubleInputProp',
		map_south_west: 'DoubleInputProp',
		default_point: 'DefaultPointProp',
		position: 'ModelThreeDProp',
		rotation: 'ModelThreeDProp',
		scale: 'ModelThreeDProp',
		show_map_default_marker: 'SwitchBtnProp',
		show_map_custom_image_layer: 'SwitchBtnProp',
		text: 'SimpleInputProp',
		colour:'SimpleInputProp',
		size:'DropDownListProp',
		icon:'ImgProp',	
		location:'DropDownListProp',
	},

	// 属性名称字段和中文的映射
	propNameMap: {
		id: 'ID',
		bind_id: '实例ID',
		lt_id: '类型',
		model_resource_id: '资源',
		name: '名称',
		title: '名称',
		longitude: '经度',
		latitude: '纬度',
		logo: '图标',
		scope: '范围',
		aspect: '比例',
		map_image: '底图',
		scope_width: '宽度',
		scope_type: '范围形状',
		south_west: '机构西南点',
		north_east: '机构东北点',
		map_north_east: '手绘东北点',
		map_south_west: '手绘西南点',
		default_point: '全景视角方位',
		position: '位移',
		rotation: '旋转',
		scale: '缩放',
		show_map_default_marker: '显示高德地图地点',
		show_map_custom_image_layer: '显示地图底图图层',
		text:'文本内容',
		colour:'字体颜色',
		size:'字体大小',
		icon:'LOGO选择',
		location:'目标地点'
	},

	// 属性栏标题映射
	curObjTypeMap: {
		'map': '地图',
		'loc': '地点',
		'identify': '标志物',
		'modelRole': '模型呈现物',
		'baikeRole': '百科呈现物',
		'videoRole': '视频呈现物',
		'labelProp':'标签属性'
	},

	// 地点类型下拉菜单
	scope_typeListMap: [
		{
			itemKey: 1,
			itemValue: '圆形'
		},
		{
			itemKey: 2,
			itemValue: '矩形'
		}
	],

	// 呈现物类型的数据映射
	roleTypeMap: {
		1: 'model',
		2: 'video',
		3: 'baike'
	},
	//字体大小的映射
	sizeListMap:[
		{
			itemKey: '8px',
			itemValue: '8px'
		},
		{
			itemKey: '9px',
			itemValue: '9px'
		},
		{
			itemKey: '10px',
			itemValue: '10px'
		},
		{
			itemKey: '11px',
			itemValue: '11px'
		},
		{
			itemKey: '12px',
			itemValue: '12px'
		},
		{
			itemKey: '13px',
			itemValue: '13px'
		},
		{
			itemKey: '14px',
			itemValue: '14px'
		},
		{
			itemKey: '15px',
			itemValue: '15px'
		},
		{
			itemKey: '16px',
			itemValue: '16px'
		},
	],
	//目标定位地点标签的映射
	locationListMap:[
		{
			itemKey: '龙潭公园',
			itemValue: '龙潭公园'
		},
		{
			itemKey: '龙潭公园',
			itemValue: '龙潭公园'
		},
	],

	// 标志物的类型映射
	identifyTypeMap: {
		1: 'Image', // 图案
		2: 'Image', // 照片
		3: 'Cuboid', // 长方体,
		4: 'Cylinder', // 圆柱体
		5: 'Image', // VueMark 加载类型仍然是按照2D图片类型
		6: 'ComplexObj', // 复杂物体
	},
	// 模型默认的图片
	modelFaceImage: 'http://ocv5g6yqi.bkt.clouddn.com/scp/material/测试/图标/20170103012115-8693.jpg',
	// 高得key
	amapKey: 'b2039047a296e061bb55d105adcaaf15',
	amapConfig: {
		defMapImageUrl: getCurProVersion().version != -1 ? './new-editor/static/img/defmapbg.jpg' : './static/img/defmapbg.jpg', // 地图自定义贴图的默认图片
		defMapCenter: [116.424472, 39.877496], // 加载地图默认的中心点经纬度坐标
		defMapBounds: [
			[116.421324,39.874984],
			[116.4276210,39.880008]
		], //  加载地图默认的贴图坐标数组
		defMarkerIcon: getCurProVersion().version != -1 ? './new-editor/static/img/scene1.png' : './static/img/scene1.png',
		lockImg: getCurProVersion().version != -1 ? './new-editor/static/img/lock.png' : './static/img/lock.png',
		localStorageName: 'localMapInfo', // 地图属性信息在缓存中的名称
	},
	amapManager: amapManager,

	modelScene: modelScene,

	imgLoadPath: getCurProVersion().version != -1 ? './new-editor/static/img/' : './static/img/',

	resourceLoadPath: getCurProVersion().version != -1 ? './new-editor/static/fonts/' : './static/fonts/',

	// 模型加载的路径配置
	modelLoadPath: getCurProVersion().adminUrl, // 加载模型的路径

	// 地点默认的属性对象
	locDefPropsObj: {
		id: null,
        parent_id: null,
        oid: null,
        name: null,
        pano_id: null,
        logo: null,
        longitude: null,
        latitude: null,
        desc: "",
        type_id: null,
        scope_type: 1,
        scope: 30,
        scope_width: 30,
        lock: 0,
        panorama: null,
        locationRoles: [],
        identifiers: [],
	}
}