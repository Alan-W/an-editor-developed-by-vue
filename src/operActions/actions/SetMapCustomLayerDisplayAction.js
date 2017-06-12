'use strict';


// set base prop value action extend the Action class
var SetMapCustomLayerDisplayAction = class SetMapCustomLayerDisplayAction extends Action {
	constructor(newState) {
		super( 'SetMapCustomLayerDisplayAction', 'set value');
		this.newState = newState;
		this.oldState = sceneClass.curMapInfo.show_map_custom_image_layer;

		console.log(' the new map state is : ------- ', this.newState);
		console.log(' the old state is : ----- ', this.oldState);
	}
	/**/

	// push the SetMapCustomLayerDisplayAction to the actions stacks;
	excute () {

		var switchDom = $('.show_map_custom_image_layer').find('.switch-btn-wrapper').first();
		console.log(' the switchDom is : ------- ', switchDom);

		// 设置当前地图信息
		sceneClass.curMapInfo.show_map_custom_image_layer = this.newState;


		if (this.newState > 0) { // 当前是显示，点击以关闭
			switchDom.removeClass('switch-off');
			switchDom.addClass('switch-active');
			editor.setMapLayerShow(true);
		} else { // 当前是关闭，点击以显示
			switchDom.removeClass('switch-active');
			switchDom.addClass('switch-off');
			editor.setMapLayerShow(false);
			
		}

		$(this.dom).attr('data-switch-state', this.newState);

		// 设置缓存数据
		editor.localStorageMapInfo.showMapCustomMapLayer = this.newState;
		localStorage.setItem('localMapInfo', JSON.stringify(editor.localStorageMapInfo));

		// 通知3D 场景
		editory.tellMappage({"type": "mapbaseimg","value": this.newState}); //底图是否显示 1是显示 0 是不显示
	}


	// undo the action
	undo () {
		
		var switchDom = $('.show_map_custom_image_layer').find('.switch-btn-wrapper').first();
		console.log(' the switchDom is : ------- ', switchDom);

		// 设置当前地图信息
		sceneClass.curMapInfo.show_map_custom_image_layer = this.oldState;

		var state = this.oldState;

		if (this.oldState > 0) { 
			switchDom.removeClass('switch-off');
			switchDom.addClass('switch-active');
			editor.setMapLayerShow(true);
		} else { // 当前是关闭，点击以显示
			state = this.oldState + 1;
			switchDom.removeClass('switch-active');
			switchDom.addClass('switch-off');
			editor.setMapLayerShow(false);
			
		}

		$(this.dom).attr('data-switch-state', this.oldState);

		// 设置缓存数据
		editor.localStorageMapInfo.showMapCustomMapLayer = this.oldState;
		localStorage.setItem('localMapInfo', JSON.stringify(editor.localStorageMapInfo));

		// 通知3D 场景
		editory.tellMappage({"type": "mapbaseimg","value": this.oldState}); //底图是否显示 1是显示 0 是不显示

	}

	// redo the action
	redo () {
		this.excute();
	}

}
