'use strict';


// set base prop value action extend the Action class
var SetMapImageLayerAction = class SetMapImageLayerAction extends Action {
	constructor(newImageLayerUrl) {
		super( 'SetMapImageLayerAction', 'set value');
		this.newImageLayerUrl = newImageLayerUrl;
		this.oldImageLayerUrl = sceneClass.curMapInfo.map_image;

		console.log(' the new org name is : ------- ', this.newImageLayerUrl);
		console.log(' the old name is : ----- ', this.oldImageLayerUrl);
	}
	/**/

	// push the SetMapImageLayerAction to the actions stacks;
	excute () {
		// 更改当前地图的数据值, 如果是null 的话代表当前清除了当前地图的底图数据
		sceneClass.curMapInfo.map_image = this.newImageLayerUrl ? this.newImageLayerUrl : editor.configs.defMapImageUrl; // 修改当前地图的属性

		editor.changeOrgArrayData('map_image', this.newImageLayerUrl, sceneClass.curMapInfo.id);

		// 更改DOM 的显示
		var mapImg = $('.img-type-prop').find('.img-scan').find('img');
		if (mapImg[0]) {
			mapImg[0].src = (this.newImageLayerUrl ? this.newImageLayerUrl : editor.configs.noImageUrl);
		};

		// 移除清除按钮的disabled 属性
		var clearBtn = $('#clearImageBtn');
		console.log('当前找到的清除按钮的DOM 是: ----- ', clearBtn);
		clearBtn.removeAttr('disabled');

		// 修改地图的显示
		if (this.newImageLayerUrl) {
			sceneClass.initMapInfo(sceneClass.curMapInfo, sceneClass.curMapInfo.id, false, false);

			// 无论是否有隐藏，都显示当前的图层
			editor.setMapLayerShow(true);

			// 提交数据
			sceneClass.submitMapData('map_image', this.newImageLayerUrl, sceneClass.curMapInfo.id);
		} else {
			// 修改地图图层的显示
			editor.setMapLayerShow(false);

			clearBtn.attr('disabled', 'disabled');

			// 提交数据
			sceneClass.submitMapData('map_image', null, sceneClass.curMapInfo.id);
		}


		// 通知3D 场景中修改地图的底图
		editory.dropBaseMap('map_image', this.newImageLayerUrl, sceneClass.curMapInfo.id);

	}


	// undo the action
	undo () {
		// 更改当前地图的数据值, 如果是null 的话代表当前清除了当前地图的底图数据
		sceneClass.curMapInfo.map_image = this.oldImageLayerUrl; // 修改当前地图的属性

		editor.changeOrgArrayData('map_image', this.oldImageLayerUrl, sceneClass.curMapInfo.id);

		// 更改DOM 的显示
		var mapImg = $('.img-type-prop').find('.img-scan').find('img');
		if (mapImg[0]) {
			mapImg[0].src = ((this.oldImageLayerUrl != editor.configs.defMapImageUrl) ? this.oldImageLayerUrl : editor.configs.noImageUrl);
		};

		// 移除清除按钮的disabled 属性
		var clearBtn = $('#clearImageBtn');
		console.log('当前找到的清除按钮的DOM 是: ----- ', clearBtn);
		clearBtn.removeAttr('disabled');

		// 修改地图的显示
		if (this.oldImageLayerUrl != editor.configs.defMapImageUrl) {
			sceneClass.initMapInfo(sceneClass.curMapInfo, sceneClass.curMapInfo.id, false, false);

			// 无论是否有隐藏，都显示当前的图层
			editor.setMapLayerShow(true);

			// 提交数据
			sceneClass.submitMapData('map_image', this.oldImageLayerUrl, sceneClass.curMapInfo.id);
		} else {
			// 修改地图图层的显示
			editor.setMapLayerShow(false);

			clearBtn.attr('disabled', 'disabled');

			// 提交数据
			sceneClass.submitMapData('map_image', null, sceneClass.curMapInfo.id);
		}


		// 通知3D 场景中修改地图的底图
		editory.dropBaseMap('map_image', this.oldImageLayerUrl, sceneClass.curMapInfo.id);
	}

	// redo the action
	redo () {
		this.excute();
	}

}
