'use strict';


// set base prop value action extend the Action class
var SetMapDefaultMarkerDisplayAction = class SetMapDefaultMarkerDisplayAction extends Action {
	constructor(newState) {
		super( 'SetMapDefaultMarkerDisplayAction', 'set value');
		this.newState = newState;
		this.oldState = sceneClass.curMapInfo.show_map_default_marker;

		console.log(' the new map state is : ------- ', this.newState);
		console.log(' the old state is : ----- ', this.oldState);
	}
	/**/

	// push the SetMapDefaultMarkerDisplayAction to the actions stacks;
	excute () {

		var switchDom = $('.show_map_default_marker').find('.switch-btn-wrapper').first();
		console.log(' the switchDom is : ------- ', switchDom);

		// 设置当前地图信息
		sceneClass.curMapInfo.show_map_default_marker = this.newState;

		var state = this.newState;

		if (this.newState > 0) { // 当前是显示，点击以关闭
			state = this.newState - 1;
			switchDom.removeClass('switch-off');
			switchDom.addClass('switch-active');
		} else { // 当前是关闭，点击以显示
			state = this.newState + 1;
			switchDom.removeClass('switch-active');
			switchDom.addClass('switch-off');
			
		}

		$(this.dom).attr('data-switch-state', this.newState);

		// 设置缓存数据
		editor.localStorageMapInfo.showMapDefaultMarker = this.newState;
		localStorage.setItem('localMapInfo', JSON.stringify(editor.localStorageMapInfo));
		editor.setMapDefaultMarkerDisplay(this.newState);

		// 同步3D 场景
		editory.tellMappage({"type": "mapplace","value":  this.newState}); //控制高德地图默认地点是否显示的  1是显示 0 是不显示
	}


	// undo the action
	undo () {
		
		var switchDom = $('.show_map_default_marker').find('.switch-btn-wrapper').first();
		console.log(' the switchDom is : ------- ', switchDom);

		// 设置当前地图信息
		sceneClass.curMapInfo.show_map_default_marker = this.oldState;

		var state = this.oldState;

		if (this.oldState > 0) {
			state = this.oldState - 1;
			switchDom.removeClass('switch-off');
			switchDom.addClass('switch-active');
		} else { // 当前是关闭，点击以显示
			state = this.oldState + 1;
			switchDom.removeClass('switch-active');
			switchDom.addClass('switch-off');
		}

		$(this.dom).attr('data-switch-state', this.oldState);

		// 设置缓存数据
		editor.localStorageMapInfo.showMapDefaultMarker = this.oldState;
		localStorage.setItem('localMapInfo', JSON.stringify(editor.localStorageMapInfo));
		editor.setMapDefaultMarkerDisplay(this.oldState);

		// 同步3D 场景
		editory.tellMappage({"type": "mapplace","value":  this.oldState}); //控制高德地图默认地点是否显示的  1是显示 0 是不显示

	}

	// redo the action
	redo () {
		this.excute();
	}

}
