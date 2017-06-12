'use strict';


// 点击资源栏的具体标志物资源的action
var FocusIdentifyAssertAction = class FocusIdentifyAssertAction extends Action {
	constructor(id) {
		super( 'FocusIdentifyAssertAction', 'click to focus the identify assert');
		this.id = id;
		this.oldID = editor.getAssertFocusInfo();
		console.log('当前点击的标志物资源的ID 是: --- ', id);
		this.identifyAssertProps = sceneClass.identifiersAssertsObj[this.id];
		this.oldIdentifyAssertProps = sceneClass.identifiersAssertsObj[this.oldID];
		console.log('当前点击的标志物资源的属性数组是: ---- ', this.identifyAssertProps);
	}

	
	excute () {
		// 首先移除之前选中的样式
		$('.assert-draggable-active').removeClass('assert-draggable-active');
		$('#folderAsserts a.identify-assert-'+this.id+'').parent('li').addClass('assert-draggable-active');

		// 属性栏显示相应资源的属性
		editor.resetPropsList();
		var objInfo = {
			id: this.id,
			classname: 'baseProps',
			type: 'markerAssert',
			name: editor.getProperValue(this.identifyAssertProps, 'name'),
		};

		editor.createPropsList(this.identifyAssertProps, objInfo);
		editor.setAssertFocusInfo(this.id); // 设置新的选中资源ID

		// 属性栏显示标志物资源的预览
		if (!editor.assertsScanMode) { // 当前是预览模式
			$('.show-assert-wrapper').css('display', 'block');
			this.scanIdentifyAssert(this.identifyAssertProps);
		} else {
			$('.show-assert-wrapper').css('display', 'none');
		}

		// 请求该资源的反引用对象列表
		var identifyResourceID = editor.getProperValue(this.identifyAssertProps, 'identifySourceId');
		console.log('当前标志物绑定的ZIP 资源ID 是------ ', identifyResourceID);
		var quoteList = editor.getAssertQuoteObjsListInfo(identifyResourceID);
		console.log('反引用的对象列表是: ------- ', quoteList);
		
	}

	undo () {
		// 首先移除之前选中的样式
		$('.assert-draggable-active').removeClass('assert-draggable-active');
		$('#folderAsserts a.identify-assert-'+this.oldID+'').parent('li').addClass('assert-draggable-active');

		// 属性栏显示相应资源的属性
		editor.resetPropsList();

		if (!this.oldID) return;

		
		var objInfo = {
			id: this.oldID,
			classname: 'baseProps',
			type: 'markerAssert',
			name: editor.getProperValue(this.oldIdentifyAssertProps, 'name'),
		};

		editor.createPropsList(this.oldIdentifyAssertProps, objInfo);

		// 属性栏显示标志物资源的预览
		if (!editor.assertsScanMode) { // 当前是预览模式
			$('.show-assert-wrapper').css('display', 'block');
			this.scanIdentifyAssert(this.oldIdentifyAssertProps);
		} else {
			$('.show-assert-wrapper').css('display', 'none');
		}

		// 请求该资源的反引用对象列表
		var identifyResourceID = editor.getProperValue(this.oldIdentifyAssertProps, 'identifySourceId');
		console.log('当前标志物绑定的ZIP 资源ID 是------ ', identifyResourceID);
		var quoteList = editor.getAssertQuoteObjsListInfo(identifyResourceID);
		console.log('反引用的对象列表是: ------- ', quoteList);
	}

	redo () {
		this.excute();
	}

	scanIdentifyAssert (props) {
		console.log('当前预览的资源的属性是: --- -- ', props);

		$('#showVideo').css('display', 'none');
		// 首先判断标志物的资源类型(2D(图片, VueMark), 3D(立方体, 圆柱体))
		var resourceType = editor.getProperValue(props ,'resource_type');
		console.log('当前标志物的资源类型是: ----- ', resourceType);
		
		var cyLinderHeight = 1;
		var cyLinderData = 0;
		if (resourceType == 4) { // 圆柱体
			cyLinderData = editor.getProperValue(props, 'aspect');
			if (!cyLinderData) {
				$('#bindAssertsErrorTip').css('display', 'block');
				setTimeout(function() {
					$('#bindAssertsErrorTip').css('display', 'none');
				}, 3000);
				return;
			};
			console.log('当前圆柱体的数据: ---- ', cyLinderData);
			cyLinderHeight = Number(cyLinderData.sideLength); // 圆柱体的高

			// 创建圆柱体类型的标志物
			editor.modelEditor.resetScanScene();
			editor.create4identifyResource(props, editor.getProperValue(props, 'id'), true); // 第三个参数表示资源预览场景下的

			$('#show3DsceneAssert').css('display', 'block');
			$('#show2DIdentifyASssert').css('display', 'none');

		} else if (resourceType == 3) { // 正方体
			editor.modelEditor.resetScanScene();

			editor.create3identifyResource(props, editor.getProperValue(props, 'id'), true);
			$('#show3DsceneAssert').css('display', 'block');
			$('#show2DIdentifyASssert').css('display', 'none');

		} else if (resourceType == 2) { //2D 图片类型
			var sourceProp = editor.getProperValue(props, 'pics');
			$('#show2DIdentifyASssert').find('img').first().attr('src', sourceProp);
			$('#show3DsceneAssert').css('display', 'none');
			$('#show2DIdentifyASssert').css('display', 'block');
		}

		console.log('当前标志物的资源是- ------ ', sourceProp);
		
	}

}
