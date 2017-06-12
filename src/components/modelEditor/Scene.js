import globalConfig from '../../store/dataConfig/globalConfig'
import ToolFactory from '../../coreFactory/ToolFactory'
import IndexStore from '../../store/index'
import SetRolePosInModelEditorAction from '../../operActions/actions/SetRolePosInModelEditorAction'
import SetRoleRotationInModelEditorAction from '../../operActions/actions/SetRoleRotationInModelEditorAction'
import SetRoleScaleInModelEditorAction from '../../operActions/actions/SetRoleScaleInModelEditorAction'
import { actionManager } from '../../store/index'

// scene in the modelEditor
export default class Scene {
	constructor ( options = {} ) {
		let defaultOptions = {
			"active": options.active || true,
			"width": options.width || window.innerWidth,
			"height": options.height || window.innerHeight,
			"container": options.container || document.body,
			"coordContainer": options.coordContainer,
			"backgroundColor": 0xdcdcdc,
			"coordBackgroundColor": 0xffffff,
		};

		// 主场景中的变量
		this.options = defaultOptions;
		this.scene = null;
		this.camera = null;
		this.renderer = null;
		this.container = defaultOptions.container;
		this.controls = null;
		this.modelObjects = []; // 当前场景中加载的模型,无论是标志物还是呈现物的模型
		this.modelCtrls = []; // 当前场景中对象绑定的控制器,只有呈现物的模型会绑定控制器
		this.clones = [];
		this.clock = null;
		this.light = null;

		// 右上角坐标系中的场景
		this.coordContainer = defaultOptions.coordContainer;
		this.coordScene = null;
		this.coordCamera = null;
		this.coordRenderer = null;
		this.coordControls = null;
		this.coordLight = null;
		this.coordAxes = null; // 坐标系中的文字

		this.ctrlModeMap = {
			9: 'translate',
			10: 'rotate',
			11: 'scale'
		};
	}

	init () {

		// 初始化场景
		this.scene = new THREE.Scene();
		this.coordScene = new THREE.Scene();

		// 初始化渲染器
		this.initRenderer();

		// 初始化相机
		this.initCamera();

		// 初始化场景中的坐标系
		this.initGrid();

		// 初始化场景中的灯光
		this.initLight();

		// 初始化场景中的全局控制器
		this.initControls();

		// 创建坐标系场景中的文字和坐标系
		this.createCoordSceneContent();

		this.addListeners();

		this.animate();
	}

	initCamera () {
		// 主场景中的camera
		this.camera = new THREE.PerspectiveCamera(80, this.options.width / this.options.height, 1, 10000);
		this.camera.lookAt({x: 0, y: 1, z: 0});
		this.camera.position.set(0, 300, 600);

		// 坐标系中的相机
		this.coordCamera = new THREE.PerspectiveCamera(25, 150 / 150, 1, 10000);
		this.coordCamera.up = this.camera.up; // 左上角中的场景相机是跟随主场景中的相机的

		this.scene.add(this.camera);
		this.coordScene.add(this.coordCamera);

	}

	initRenderer () {
		// 主场景中的renderer
		this.renderer = new THREE.WebGLRenderer({
			antialias : true
		});

		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor(this.options.backgroundColor);
		this.container.appendChild(this.renderer.domElement);

		// 坐标系中的渲染器
		this.coordRenderer = new THREE.WebGLRenderer({
			alpha: true,
		});

		this.coordRenderer.setSize(150, 150);
		this.coordRenderer.setClearColor(0xffffff, 0);
		this.coordContainer.appendChild(this.coordRenderer.domElement);
	}

	initGrid () {
		let helper = new THREE.GridHelper( this.options.width, 25, 0x000000, 0x808080);
    	this.scene.add( helper );
	}

	initLight () {
		let light = new THREE.AmbientLight(0xffffff);
		light.position.set(0, 0, -10);
		this.scene.add(light);
	}

	initControls () {
		// 主场景中的控制器
		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
		this.controls.addEventListener('change', this.render.bind(this), false);
	}

	createCoordSceneContent () {
		this.coordControls = new THREE.TransformControls(this.coordCamera, this.coordRenderer.domElement);
		this.coordControls.dispose(); // 禁止右上角坐标系的任何事件
		let transparentGeometry = new THREE.BoxBufferGeometry(10, 10, 10);
		let transparentMaterial = new THREE.MeshLambertMaterial({color: 0x0000ff, transparent: true, opacity: 0});
		let transparentCube = new THREE.Mesh(transparentGeometry, transparentMaterial);
		this.coordScene.add(transparentCube);
        transparentCube.position.set(-5, -5, 0);
        this.coordControls.attach(transparentCube); // 将事件和模型绑定
        this.coordScene.add(transparentCube);
        this.coordScene.add(this.coordControls); 

        // 创建坐标轴上的文字
        this.initAxesText();
	}

	initAxesText () {
		let loader = new THREE.FontLoader();
		let that = this;
   		loader.load('../../../static/lib/js/threejs/font.json', function(font) {
   			let container = document.createElement('div');
   			that.coordContainer.appendChild( container );
	   		let textMaterialX = new THREE.MeshBasicMaterial({
	   			color: 0xff0000
	   		});
	   		let textMaterialY = new THREE.MeshBasicMaterial({
	   			color: 0x00ff00
	   		});
	   		let textMaterialZ = new THREE.MeshBasicMaterial({
	   			color: 0x0000ff
	   		});

	   		let textGeoX = new THREE.TextGeometry('X', {
	   			font: font,
	   			size: 3,
	   			height: 1,
	   			weight: 'normal'
	   		});
	   		let textGeoY = new THREE.TextGeometry('Y', {
	   			font: font,
	   			size: 3,
	   			height: 1,
	   			weight: 'normal'
	   		});
	   		let textGeoZ = new THREE.TextGeometry('Z', {
	   			font: font,
	   			size: 3,
	   			height: 1,
	   			weight: 'normal'
	   		});

	   		let textMeshX = new THREE.Mesh( textGeoX, textMaterialX);
	   		let textMeshY = new THREE.Mesh( textGeoY, textMaterialY);
	   		let textMeshZ = new THREE.Mesh( textGeoZ, textMaterialZ);

	   		textMeshX.position.set(16, -6, 0);
	   		textMeshY.position.set(-5, 16, 0);
	   		textMeshZ.position.set(-6, -6, 20);
	   		that.coordScene.add(textMeshX);
	   		that.coordScene.add(textMeshY);
	   		that.coordScene.add(textMeshZ);
   		});
	}

	animate () {
		this.controls.update();
		this.coordControls.update();
		requestAnimationFrame(this.animate.bind(this));
		this.coordCamera.position.copy(this.camera.position);
		this.coordCamera.position.setLength(100);
		this.coordCamera.lookAt( this.coordScene.position );
		this.coordCamera.updateProjectionMatrix();
		this.render();
	}

	render () {
		this.renderer.render(this.scene, this.camera);
		this.coordRenderer.render(this.coordScene, this.coordCamera);
	}

	addListeners() {
		window.addEventListener( 'resize', this.onWindowResize.bind( this ), false );
	}

	onWindowResize() {
		this.options.width = window.innerWidth;
		this.options.height = window.innerHeight;
		this.camera.aspect = this.options.width / this.options.height;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight); // 重置整个场景的大小
	}


	// 设置场景中所有控制器的模式
	setCurCtrlMode (value) {
		console.log('模型编辑器场景中对象绑定的所有控制器是: ------ ', this.modelCtrls);
		var ctrls = this.modelCtrls;
		for (var i = 0; i < ctrls.length; i++) {
			var ctrl = ctrls[i];
			ctrl.setMode(this.ctrlModeMap[value])
		}
	}

	// 导入OBJ 格式的模型
    loadObjModel (role) {
		let that = this;
		let modelLoader = null;
		console.log('当前加载的模型的role是： ------- ', role);
		let modelResourceID = role.model_resource_id;
		let basePath = 'static/upload/model_resource/' + modelResourceID + '/';
		let objModelPath = basePath + modelResourceID + '.obj';
		
		let manager = new THREE.LoadingManager();
		let texture = new THREE.Texture();
		manager.onProgress = function(item, loaded ,total) {
		};
		let onProgress = function(xhr) {
			if ( xhr.lengthComputable ) {
				let percentComplete = xhr.loaded / xhr.total * 100;
				console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
			}
		};
		let onError = function(xhr) {
			console.log(' the on error func1');
		};

		let mtlLoader = new THREE.MTLLoader(); // 加载有材质的物体
		console.log('the mtlLoader is : ---- ', mtlLoader);
		let bBox = null;
		mtlLoader.setPath(globalConfig.modelLoadPath); // 设置.mtl所在的路径
		// 加载材质
		mtlLoader.setTexturePath(basePath); // 设置材质路径,也就是图片的路径
		mtlLoader.setCrossOrigin(''); // 允许跨域请求资源
		mtlLoader.load(basePath + modelResourceID + '.mtl', function(materials) {
			materials.preload();
			modelLoader = new THREE.OBJLoader(); // load the mesh
			// modelLoader.setPath(that.configs.modelPath);
			modelLoader.setMaterials(materials);
			modelLoader.load(objModelPath, function(object) {
				if (object instanceof THREE.Object3D) {
					object.traverse (function(mesh) {
						if (mesh instanceof THREE.Mesh) { // 转换后的模型是子元素是mesh
							mesh.geometry.computeBoundingBox();
							bBox = mesh.geometry.boundingBox;
						}
					})
				}
				object.uuid = role.id;
				object.modeled = true;
				object.is_ob = true; // 设置这个属性是为了删除用
				let pos = {x: 0, y: 0, z: 0};
				let rotation = {x: 0, y: 0, z: 0};
				let scale = {x: 1, y: 1, z: 1};
				try {
					pos = (role.property.position && JSON.parse(role.property.position)) || pos;
					rotation = (role.property.rotation && JSON.parse(role.property.rotation)) || rotation;
					scale = (role.property.scale && JSON.parse(role.property.scale)) || scale;
				} catch (error) {
					console.log('加载模型转化位移, 缩放, 旋转数据时报错: --- -' , error)
				}

				// if (resourceType == 4) { // 当前是圆柱体, 加载的模型得按照圆柱体的高度放大
				// 	object.iscylinder = true; // 标记圆柱体
				// 	object.baseAspect = cyLinderHeight; // 系数
				// } else object.iscylinder = false;

				object.position.set(pos.x, pos.y, pos.z);
				let newRotate = { // 将角度转换为弧度制
					x: ToolFactory.covertAngleToRadians(rotation.x),
					y: ToolFactory.covertAngleToRadians(rotation.y),
					z: ToolFactory.covertAngleToRadians(rotation.z),
				}
				object.rotation.set(newRotate.x, newRotate.y, newRotate.z);
				object.scale.set(scale.x, scale.y, scale.z);
				that.scene.add(object);
				that.modelObjects.push(object);
				// 为每个模型绑定控制器
				that.attachCtrlToObj(pos, rotation, scale, object, role);
				
			}, onProgress, onError);
		}, onProgress, function() { 
			IndexStore.dispatch('setErrorInfo', {
				tip: '呈现物模型加载失败！',
				reason: '没找到该呈现物的资源数据！'
			});
			setTimeout(function () {
				IndexStore.dispatch('setErrorInfo', null);
			}, 5000);
			
			return false;
		});
    }

	// 给当前加载的每个模型创建控制器
	attachCtrlToObj (pos, rotation, scale, object, role) {
		let that = this;
		let modelID = role.id;
		let modelTransformCtrl = new THREE.TransformControls( this.camera, this.renderer.domElement);
		this.modelCtrls.push(modelTransformCtrl);
		modelTransformCtrl.is_ob = true;
		modelTransformCtrl.uuid = modelID + 'ctrl';

		

		modelTransformCtrl.addEventListener('mouseDown', function(e) { 
			console.log('触发了mouseDown 事件！');
			var toolBarEditMode = parseInt(IndexStore.state.activeToolbarBtn.viewBtn);
			console.log('当前的编辑模式是: ----- ', toolBarEditMode);

			if (toolBarEditMode == 2) { // 编辑模式
				modelTransformCtrl._dragging = true;
			} 
			return false;
		});

		modelTransformCtrl.attach(object); // 将控制和当前的模型绑定
		// modelTransformCtrl.position.set(pos.x, pos.y, pos.z);
		
		// modelTransformCtrl.rotation.set(rotation.x, rotation.y, rotation.z);
		// modelTransformCtrl.scale.set(scale.x, scale.y, scale.z);
		modelTransformCtrl.update();
		modelTransformCtrl.setMode(this.ctrlModeMap[parseInt(IndexStore.state.activeToolbarBtn.modelBtn)]);
    	this.scene.add(modelTransformCtrl);
		
		modelTransformCtrl.addEventListener('mouseUp', function(e) { //  这个时候是可以修改位置信息的
			var ctrlMode = modelTransformCtrl.getMode();
			
			var editType = (e.target.axis).toLowerCase();
			console.log('当前编辑的轴是: ----- ', )
			var boundIdentifyID = (IndexStore.state.curClickObj && IndexStore.state.curClickObj.clickType == 'identify') ? IndexStore.state.curClickObj.id : null;
			// console.log('当前编辑的坐标轴是: -------- ', editType.toLowerCase());

			if (parseInt(IndexStore.state.activeToolbarBtn.viewBtn) == 2) { // 在编辑的状态
				var thisModel = modelTransformCtrl.object;
				console.log(' this mdoel is : ------ ', thisModel);
				switch(ctrlMode) {
					case 'translate':
						// 执行保存数据的action
						actionManager.excute(new SetRolePosInModelEditorAction(role, JSON.stringify(thisModel.position), boundIdentifyID));
						break;
					case 'rotate':
						actionManager.excute(new SetRoleRotationInModelEditorAction(role, thisModel.rotation, boundIdentifyID, null, true));
						break;
					case 'scale':
						// 缩放是等比的缩放
						var newScale = {
							x: 1, 
							y: 1,
							z: 1
						}
						if (editType.indexOf('x') !== -1) { //X 轴参与了变化
							newScale.x = parseInt(thisModel.scale.x);
							newScale.y = parseInt(thisModel.scale.x);
							newScale.z = parseInt(thisModel.scale.x);
						} else if (editType.indexOf('y') !== -1) { //Y 轴参与了变化
							newScale.x = parseInt(thisModel.scale.y);
							newScale.y = parseInt(thisModel.scale.y);
							newScale.z = parseInt(thisModel.scale.y);
						} else if (editType.indexOf('z') !== -1) { //Z 轴参与了变化
							newScale.x = parseInt(thisModel.scale.z);
							newScale.y = parseInt(thisModel.scale.z);
							newScale.z = parseInt(thisModel.scale.z);
						}
						actionManager.excute(new SetRoleScaleInModelEditorAction(role, JSON.stringify(newScale), boundIdentifyID));
						break;
				}
				
			} else {
				return false;
			}
		
		}, false);
		
	}

	// 创建2D类型的图片标志物模型
	createImageIdentifyModel (identifyData) {
		// 标志物的ID
		var underLogo = identifyData.pics; // 2D类型的标志物使用pics加载标志物，不再使用LOGO
		console.log('标志物的LOPGO是: ----- ', underLogo);
		// $('#curIdentifyImg').attr('src', underLogo); // 当前标志物的src赋值
		if (!underLogo || underLogo == '' ) {
			underLogo = globalConfig.modelFaceImage;
			IndexStore.dispatch('setErrorInfo', {
				tip: '标志物加载警告',
				reason: '当前的2D标志物没有pics数据, 编辑器将使用默认图片, 请检查您上传的标志物数据！'
			});
			setTimeout(function () {
				IndexStore.dispatch('setErrorInfo', null);
			}, 5000);
		}
		var aspect = identifyData.scale; 
		if (!aspect) aspect = '1:1';
		
		console.log('图片占用格子的比例是: ----- ', aspect);
		aspect = aspect.split(':');
		
		var width = 100 * aspect[0];
		var height = 100 * aspect[1];

		var geometry = new THREE.PlaneGeometry(width, height);
		geometry.vertices[0].uv = new THREE.Vector2(0, 0);
		geometry.vertices[1].uv = new THREE.Vector2(1, 0);
		geometry.vertices[2].uv = new THREE.Vector2(1, 1);
		geometry.vertices[3].uv = new THREE.Vector2(0, 1);

		// 纹理
		var texture = new THREE.ImageUtils.loadTexture(underLogo, null, function(t){});
		var material = new THREE.MeshBasicMaterial({map: texture});
		var mesh = new THREE.Mesh(geometry, material);
		mesh.rotation.x = -90 * Math.PI / 180; // 平铺
		mesh.uuid = identifyData.id;
		mesh.is_ob = true; // 设置这个属性是为了删除用
		this.scene.add(mesh);
		this.modelObjects.push(mesh);
	}

	// 创建圆柱体类型的标志物，模型
	createCylinderIdentifyModel (identifyData) {
		console.log('创建的圆柱体标志物数据是: ----- ', identifyData);

		if (!identifyData.scale || identifyData.scale == '') {
			IndexStore.dispatch('setErrorInfo', {
				tip: '标志物加载失败！',
				reason: '该圆柱体类型的标志物没有scale比例数据, 请检查您上传的圆柱体！'
			});

			setTimeout(function () {
				IndexStore.dispatch('setErrorInfo', null);
			}, 5000);

			return false;
		}

		var aspect = JSON.parse(identifyData.scale);
		var radiusTop = 100 * Number(aspect.topDiameter / 2);
		var radiusBottom = 100 * Number(aspect.bottomDiameter / 2);
		var height = 100 * Number(aspect.sideLength);
		
		// 获取立方体每个面的图片资源信息
		console.log('3D立方体每个面的图片信息', pics);
		var pics = identifyData.pics;
		if (!pics || pics == '') {
			IndexStore.dispatch('setErrorInfo', {
				tip: '标志物加载警告！',
				reason: '该圆柱体类型的标志物没有pics数据, 编辑器将使用默认图片, 请检查您上传的圆柱体数据！'
			});

			setTimeout(function () {
				IndexStore.dispatch('setErrorInfo', null);
			}, 5000);
		};

		pics = JSON.parse(pics);
		var defImage = globalConfig.modelFaceImage;

		var faceTop = pics.Top ? pics.Top : defImage;
		var faceBody = pics.Body ? pics.Body : defImage;
		var faceBottom = pics.Bottom ? pics.Bottom : defImage;

		var textureArray = [faceBody, faceTop , faceBottom]; 
		console.log('the textArray is : ---- ', textureArray);

		var materials = [];
		for (var i = 0; i < textureArray.length; i++) {
			var tu = new THREE.MeshBasicMaterial({
				map: THREE.ImageUtils.loadTexture(textureArray[i])
			});
			materials.push(tu);
		}
		var geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 100)  /*rT, rB, height*/
		var material  = new THREE.MeshFaceMaterial(materials);
		var cylinder = new THREE.Mesh( geometry, material );

		cylinder.is_ob = true;
		cylinder.uuid = identifyData.id;
		this.scene.add(cylinder);
		this.modelObjects.push(cylinder);
	}

	// 创建3D复杂物体标志物
	createComplexObjIdentifyModel (identifyData) {
		// 复杂物体只需要拿到scale 长宽高的比例然后创建立方体就可以了

		if (!identifyData.scale || identifyData.scale == '') {
			IndexStore.dispatch('setErrorInfo', {
				tip: '标志物加载失败！',
				reason: '该3D复杂物体类型的标志物没有scale比例数据, 请检查您上传的数据文件！'
			});

			setTimeout(function () {
				IndexStore.dispatch('setErrorInfo', null);
			}, 5000);

			return false;
		}

		var aspect = identifyData.scale; // 这里是将scale 转化为了aspect
		var logo = identifyData.logo;
		
		// 根据比例值获取计算立方体的长宽高
		var formatScale = aspect.split(':');

		if (formatScale.length < 3) {
			IndexStore.dispatch('setErrorInfo', {
				tip: '标志物加载失败！',
				reason: '该3D类型的标志物scale比例数据不全, 请检查您上传的数据！'
			});

			setTimeout(function () {
				IndexStore.dispatch('setErrorInfo', null);
			}, 5000);
			return false;
		}
		
		var length = 100, width = 100, height = 100; // 默认的长宽高值
		length = length * formatScale[0];
		width = width * formatScale[1];
		height = height * formatScale[2];
		
		var defImage = logo ? logo : globalConfig.modelFaceImage;
		
		var textureArray = [defImage, defImage, defImage, defImage, defImage, defImage]; // 材质资源 // three.js 中材质数组的顺序是right, left, top, bottom, front, back

		var materials = [];
		// 先加载立方体的材质
		for (var i = 0; i < textureArray.length; i++) {
			var tu = new THREE.MeshBasicMaterial({
				map: THREE.ImageUtils.loadTexture(textureArray[i])
			});
			materials.push(tu);
		}

		// 立方体
		var cube = new THREE.Mesh(
			new THREE.BoxGeometry(length, height, width ), 
			new THREE.MeshFaceMaterial(materials)
		);

		cube.uuid = identifyData.id;
		cube.is_ob = true;

		this.scene.add(cube);
		this.modelObjects.push(cube);
    		
	}

	// 创建3D 立方体类型的标志物
	createCuboidIdentifyModel (identifyData) {
		console.log(' the --- ',identifyData);
		var aspect = identifyData.scale;
		if (!aspect || aspect == '') {
			IndexStore.dispatch('setErrorInfo', {
				tip: '标志物加载失败！',
				reason: '当前的立方体标志物没有scale数据, 请检查您上传的标志物数据！'
			});

			setTimeout(function () {
				IndexStore.dispatch('setErrorInfo', null);
			}, 5000);

			return false;
			
		};
		
		aspect = JSON.parse(aspect);
		// 根据比例值获取计算立方体的长宽高
		var length = 100, width = 100, height = 100; // 默认的长宽高值
		var lenHeiAspect = aspect.Back || aspect.Front || null; // 长高比
		var lenWidAspect = aspect.Top || aspect.Bottom || null; // 长宽比
		var widHeiAspect = aspect.Left || aspect.Right || null; // 宽高比

		if (lenHeiAspect) lenHeiAspect = lenHeiAspect.split(':'); 
		if (lenWidAspect) lenWidAspect = lenWidAspect.split(':'); 
		if (widHeiAspect) widHeiAspect = widHeiAspect.split(':'); 

		console.log('split 后的数据是: ---- ', lenHeiAspect, lenWidAspect, widHeiAspect);

		if (lenHeiAspect && lenWidAspect) { // 根据长高比和长宽比计算长宽高
			length = length * Number(lenHeiAspect[0]); // 长度数据
			height = height * Number(lenHeiAspect[1]); // 高度数据
			width = width * Number(lenWidAspect[1]); // 宽度数据
		} else if (lenHeiAspect && widHeiAspect) { // 根据长高比和宽高比计算长宽高
			length = length * Number(lenHeiAspect[0]); // 长度数据
			height = height * Number(lenHeiAspect[1]); // 高度数据
			width = width * Number(widHeiAspect[0]); // 宽度数据
		} else if (lenWidAspect && widHeiAspect) { // 根据长宽比和宽高比计算长宽高
			length = length * Number(lenWidAspect[0]); // 长度数据
			height = height * Number(widHeiAspect[1]); // 高度数据
			width = width * Number(widHeiAspect[0]); // 宽度数据
		} else {
				IndexStore.dispatch('setErrorInfo', {
				tip: '标志物加载失败！',
				reason: '当前的立方体标志物提供的scale数据错误,计算不出立方体的长宽高数据！'
			});

			setTimeout(function () {
				IndexStore.dispatch('setErrorInfo', null);
			}, 5000);

			return false;
		};

		// 获取立方体每个面的图片资源信息
		var pics = identifyData.pics;
		if (!pics) {
			IndexStore.dispatch('setErrorInfo', {
				tip: '标志物加载警告！',
				reason: '当前的立方体标志物没有pics数据, 编辑器将使用默认图片加载, 请检查您上传的标志物数据！'
			});

			setTimeout(function () {
				IndexStore.dispatch('setErrorInfo', null);
			}, 5000);

		};
		
		var defImage = globalConfig.modelFaceImage;
		var faceTop = pics.Top ? pics.Top : defImage;
		var faceBottom = pics.Bottom ? pics.Bottom : defImage;
		var faceLeft = pics.Left ? pics.Left : defImage;
		var faceRight = pics.Right ? pics.Right : defImage;
		var faceFront = pics.Front ? pics.Front : defImage;
		var faceBack = pics.Back ? pics.Back : defImage;
		var textureArray = [faceRight, faceLeft, faceTop, faceBottom, faceFront, faceBack]; // 材质资源 // three.js 中材质数组的顺序是right, left, top, bottom, front, back

		var materials = [];
		// 先加载立方体的材质
		for (var i = 0; i < textureArray.length; i++) {
			var tu = new THREE.MeshBasicMaterial({
				map: THREE.ImageUtils.loadTexture(textureArray[i])
			});
			materials.push(tu);
		}

		// 立方体
		var cube = new THREE.Mesh(
			new THREE.BoxGeometry(length, height, width), 
			new THREE.MeshFaceMaterial(materials)
		);
	
		cube.uuid = id;
		cube.is_ob = true;
		this.scene.add(cube);
		this.modelObjects.push(cube);
		
	}

	// 重置场景
	clear () {
		let models = this.modelObjects;
		let ctrls = this.modelCtrls;
		for (var i = 0; i < models.length; i++) {
			this.scene.remove(models[i]);
		};

		for (var j = 0; j < ctrls.length; j++) {
			this.scene.remove(ctrls[j]);
		}

		this.modelObjects.length = 0;
		this.modelCtrls.length = 0;
	}

	// 删除指定的模型
	removeProperModel (modelInfo) {
		this.scene.remove(modelInfo.model);
		this.scene.remove(modelInfo.ctrl);
	}

	// 返回场景中指定uUid 的object
	getRoleModelByUuid (id) {
		let objs = this.scene.children;
		let editInfo = {
			model: null,
			ctrl: null,
		};
		for (let i = 0; i < objs.length; i++) {
			let obj = objs[i];
			if (obj.uuid == id) editInfo.model = obj;
			if (obj.uuid == (id + 'ctrl')) editInfo.ctrl = obj;
			
			console.log('the object is :------ ', objs[i]);
		};
		return editInfo;
	}
}
