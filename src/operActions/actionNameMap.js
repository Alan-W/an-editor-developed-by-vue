import SetLocNameAction from './actions/SetLocNameAction'
import SetIdentifyNameAction from './actions/SetIdentifyNameAction'
import SetRoleTitleAction from './actions/SetRoleTitleAction'
import SetLocPosAction from './actions/SetLocPosAction'
import SetLocScopeTypeAction from './actions/SetLocScopeTypeAction'
import SetLocScopeAction from './actions/SetLocScopeAction'
import SetLocScopeWidthAction from './actions/SetLocScopeWidthAction'
import LocBindIdentifyAction from './actions/LocBindIdentifyAction'
import LocBindRoleAction from './actions/LocBindRoleAction'
import IdentifyBindRoleAction from './actions/IdentifyBindRoleAction'
import ClickRoleInstanceAction from './actions/ClickRoleInstanceAction'
import SetMapNameAction from './actions/SetMapNameAction'
import SetOrgDoublePropDataAction from './actions/SetOrgDoublePropDataAction'
import SetMapDefaultConfigAction from './actions/SetMapDefaultConfigAction'

//全景编辑模式下的文件引入
import SetLabelpropTextAction from './actions/panoAction/SetLabelpropTextAction'
import SetLabelpropColourAction from './actions/panoAction/SetLabelpropColourAction'
import SetLabelpropSizeAction from './actions/panoAction/SetLabelpropSizeAction'

import SetRolePosInModelEditorAction from './actions/SetRolePosInModelEditorAction'
import SetRoleScaleInModelEditorAction from './actions/SetRoleScaleInModelEditorAction'
import SetRoleRotationInModelEditorAction from './actions/SetRoleRotationInModelEditorAction'

// 更改地点名称的action映射
export const Set_Loc_Name_Action = function (obj, newName) {
	return new SetLocNameAction(obj, newName);
}

// 更改标志物名称的action映射
export const Set_Identify_Name_Action = function (obj, newName) {
	return new SetIdentifyNameAction(obj, newName);	
}

// 更改百科呈现物名称的action映射
export const Set_Baikerole_Title_Action = function (obj, newTitle) {
	return new SetRoleTitleAction(obj, newTitle);	
}

// 更改视频呈现物名称的action映射
export const Set_Videorole_Title_Action = function (obj, newTitle) {
	return new SetRoleTitleAction(obj, newTitle);	
}

// 更改模型呈现物名称的action映射
export const Set_Modelrole_Title_Action = function (obj, newTitle) {
	return new SetRoleTitleAction(obj, newTitle);	
}

// 更改地点经度的action映射
export const Set_Loc_Longitude_Action = function (obj, newValue, tempMarkerPos) {
	return new SetLocPosAction(obj, newValue, 'longitude', tempMarkerPos);	
}

// 更改地点纬度的action映射
export const Set_Loc_Latitude_Action = function (obj, newValue, tempMarkerPos) {
	return new SetLocPosAction(obj, newValue, 'latitude', tempMarkerPos);	
}

// 更改地点范围形状的action 映射
export const Set_Loc_Scope_type_Action = function (obj, newType) {
	return new SetLocScopeTypeAction (obj, newType);
}

// 更改地点scope 数据的action 映射
export const Set_Loc_Scope_Action = function (obj, newValue) {
	return new SetLocScopeAction(obj, newValue);
}

// 更改地点scope_width 数据的action 映射
export const Set_Scope_width_Action = function (obj, newValue) {
	return new SetLocScopeWidthAction(obj, newValue);
}

// 地点绑定标志物
export const Loc_Bind_Identify_Action = function (bindInfo) {
	return new LocBindIdentifyAction(bindInfo);
}

// 地点绑定呈现物
export const Loc_Bind_Role_Action = function (bindInfo) {
	return new LocBindRoleAction(bindInfo);
}

// 标志物绑定呈现物   
export const Identify_Bind_Role_Action = function (bindInfo) {
	return new IdentifyBindRoleAction(bindInfo);
}

// 点击呈现物Action
export const Click_Modelrole_Action = function (stateObj, clickObj) {
	return new ClickRoleInstanceAction(stateObj, clickObj);
}
export const Click_Baikerole_Action = function (stateObj, clickObj) {
	return new ClickRoleInstanceAction(stateObj, clickObj);
}
export const Click_Videorole_Action = function (stateObj, clickObj) {
	return new ClickRoleInstanceAction(stateObj, clickObj);
}
// 在模型编辑器下更改呈现物地点属性的action
export const Set_Modelrole_Position_Action = function (obj, newValue, boundIdentifyID) {
	return new SetRolePosInModelEditorAction(obj, newValue, boundIdentifyID);
}
// 在模型编辑器下更改呈现物的缩放值Action
export const Set_Modelrole_Scale_Action = function (obj, newValue, boundIdentifyID) {
	return new SetRoleScaleInModelEditorAction(obj, newValue, boundIdentifyID);
}
// 在模型编辑器下更改呈现物的旋转值Action
export const Set_Modelrole_Rotation_Action = function (obj, newValue, boundIdentifyID, changeValueType, isCtrlOper) {
	return new SetRoleRotationInModelEditorAction(obj, newValue, boundIdentifyID, changeValueType, isCtrlOper);
}
// 更改地图名称Action
export const Set_Map_Name_Action = function (obj, newValue) {
	return new SetMapNameAction (obj, newValue);
}
// 更改机构范围数据 (西南点的经纬度, 注意数据时二维的, 但是修改是按照一维走的)
export const Set_Map_South_west_Action = function (obj, newValue) {
	return new SetOrgDoublePropDataAction(obj, newValue, 'south_west');
}
export const Set_Map_North_east_Action = function (obj, newValue) {
	return new SetOrgDoublePropDataAction(obj, newValue, 'north_east');
}

// 更改手绘地图两个点的数据 (西南点的经纬度, 注意数据时二维的, 但是修改是按照一维走的)
export const Set_Map_Map_south_west_Action = function (obj, newValue) {
	return new SetOrgDoublePropDataAction(obj, newValue, 'map_south_west');
}
export const Set_Map_Map_north_east_Action = function (obj, newValue) {
	return new SetOrgDoublePropDataAction(obj, newValue, 'map_north_east');
}
// 设置关于地图的一些默认属性: 显示高德地图默认的地点, 是否显示手绘地图的图片
export const Set_Map_Show_map_default_marker_Action = function (obj, newValue) {
	return new SetMapDefaultConfigAction(obj, newValue, 'show_map_default_marker')
}
export const Set_Map_Show_map_custom_image_layer_Action = function (obj, newValue) {
	return new SetMapDefaultConfigAction(obj, newValue, 'show_map_custom_image_layer')
}

//全景编辑器下的更改操作

// 更改文本标签的text内容的action 映射
export const Set_Labelprop_Text_Action = function (obj, newType) {
	return new SetLabelpropTextAction (obj, newType);
}
// 更改文本标签的颜色的action 映射
export const Set_Labelprop_Colour_Action = function (obj, newType) {
	return new SetLabelpropColourAction (obj, newType);
}
// 更改文本标签的字体大小的action 映射
export const Set_Labelprop_Size_Action = function (obj, newType) {
	return new SetLabelpropSizeAction (obj, newType);
}