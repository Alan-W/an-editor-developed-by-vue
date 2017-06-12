//import Loader from './Loader';
var Editory = function(){
    this.DEFAULT_CAMERA = new THREE.PerspectiveCamera( 
        45,
        window.innerWidth / window.innerHeight,
        1,
        10000);

    this.DEFAULT_CAMERA.name = 'Camera';
    //this.DEFAULT_CAMERA.position.set( 0, -100, 100 );
    //this.DEFAULT_CAMERA.position.set( 20, 10, 20 );

    this.DEFAULT_CAMERA.position.set( 0, 1000, 1000 );
    this.DEFAULT_CAMERA.lookAt( new THREE.Vector3() );

    this.signals = {
        transformModeChanged: new signals.Signal(),
        addFromTwo: new signals.Signal(),//页面初始化时添加所有景点
        selecdTobject: new signals.Signal(),//选中对象
        bindModelToScenic: new signals.Signal(),//把加载进来的模型 绑定到对应景点上到
        addBaseMap: new signals.Signal(),//铺上底图
        sceneCleared: new signals.Signal(),//清空场景
        changeObjcolor: new signals.Signal(),//给选中对象着色
        toSpacePosition: new signals.Signal(),//2d坐标转化成3d坐标
        viewMode: new signals.Signal(),//查看模式
        editorMode: new signals.Signal(),//编辑模式
        deleteSceneobj: new signals.Signal(),//删除地点或模型对象
    };
    this.selected = null;

    this.scene = new THREE.Scene();
    this.cssScene = new THREE.Scene();

    this.sceneHelpers = new THREE.Scene();

    this.camera = this.DEFAULT_CAMERA.clone();

    //this.loader = new Loader( this );
    //this.Dom = [];
    this.organizationlist = [];
    this.currentOrganization = null;

    //是否自己创建 模式
    this.createself = false;
    this.createtype = "box";//default

    this.objects = [];
    //是查看模式还是编辑模式
    this.itviewmode = false;

    this.onSuccess = function(xhr){
        //console.log("load material success");
    };
    this.onProgress = function(xhr){
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            //console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
        }
    };
    this.onError = function(xhr){
        //console.log("load material error",xhr);
    };

}

Editory.prototype = {
    
    select: function(object){
        if(object!==null){
            this.selected = object;
        }
    },
    clear: function () {//清空场景
        this.signals.sceneCleared.dispatch();
    },
    changeObjPro: function(obj){//2d同步3d (位移)
        this.signals.changeObjPro.dispatch(obj);
    },
    scopeTypeChange: function(obj){//范围类型切换

        var editobj = this.selected;
        
        //console.log("更改范围类型时 拿到的参数",obj,editobj);
        this.signals.addFromTwo.dispatch(obj);//添加

        this.signals.selecdTobject.dispatch(editobj.placeid);//选中
        
        this.selected.scale.z=this.selected.scale.x;
        this.selected.modelobj = editobj.modelobj;
        this.selected.modelobjarray = editobj.modelobjarray;
        document.getElementById("threescenic").removeChild(editobj.dombox);
        this.scene.remove(editobj);
    },
    addFromTwo: function(objs){//页面加载时初始化场景中该有的数据
        //console.log("add from 2d------",objs);
        this.signals.addFromTwo.dispatch(objs);
        //console.log("接收到的对象属性",objs);
        //var olng = 116.334381,  olat = 39.942739;//测试
        
    },
    selecdTobject: function(id){//(2d选中对象时 让3d也选中; 3d选中对象时 让 2d也选中  23d通知是一个环路)
        this.signals.selecdTobject.dispatch(id);
    },
    //3d点坐标转化成 2d 坐标
    toScreenPosition: function(pos,camera){
        //根据上一步中记录的位置生成一个向量
        var vector  = new THREE.Vector3(pos.x, 0, pos.z)
        //将这个向量映射到镜头的平面上
        vector.project(camera)
        //将位置信息还原成以左上角为原点的位置信息
        return {
          x: Math.round((   vector.x + 1 ) * window.innerWidth/ 2),
          y: Math.round(( -vector.y + 1 ) * window.innerHeight/ 2)
        }
    },
    //平面坐标转化成空间坐标
    toSpacePosition: function(event,type){
        var ss = this.signals.toSpacePosition.dispatch(event,type);
        //console.log("焦点焦点",ss);
    },
    bindModel: function(pid,modelobj){
        //in use
        var self = this;
        //console.log("模型要绑定的景点的id",pid);
        //console.log("模型属性数据",modelobj);
        var modelid = modelobj.model_resource_id;//模型资源id
        //console.log("模型资源id",modelid);
        var bindid = modelobj.bind_id;//模型绑定关系id（实例id）
        var mid = modelobj.id;//模型id（模板id）
        /*var modelid = 47;
        var pid = 369;*/
        //http://scp-admin.jinglian.com/
        var baseurl ='http://localhost:8080/' + 'static/upload/model_resource/'+ modelid + '/',
        objurl = 'http://localhost:8080/' + 'static/upload/model_resource/'+ modelid + '/' + modelid + '.obj';
        var mtlLoader = new THREE.MTLLoader(); // 加载有材质的物体

        //mtlLoader.setBaseUrl( baseurl );
        mtlLoader.setPath(  baseurl  );
        mtlLoader.load( modelid+".mtl", function(materials) {
            materials.preload();
            var modelLoader = new THREE.OBJLoader(); // load the mesh
            modelLoader.setMaterials(materials);
            modelLoader.load( objurl, function(object) {
                if (object instanceof THREE.Object3D) {
                    object.modeled = true;
                    object.pid = pid;
                    //object.mid = mid;//模型id
                    object.selfid = bindid;//模型绑定关系id
                    object.pospoint = modelobj;

                    //模型绑定景点 同时添加到场景
                    self.signals.bindModelToScenic.dispatch(object, pid, modelobj);
                }else{
                    console.log("不是object3d");
                }
            },self.onSuccess, self.onProgress, self.onError);
        },self.onSuccess,self.onProgress, self.onError)
    },
    //铺上底图
    addBaseMap: function(obj){//当前机构 对象（数据）
        console.log("当前的机构信息",obj);
        this.signals.addBaseMap.dispatch(obj);
    },

    //更改机构初始化 3d 场景
    editorBaseMap:function(id){
        alert("这个函数没有用到");
        //先清空场景
        this.signals.sceneCleared.dispatch();
        console.log("要更改到的机构的id",id);
        var obj = this.organizationlist;
        for(var i=0,l=obj.length;i<l;i++){
            if(obj[i].id==id){
                this.currentOrganization = obj[i];
                this.signals.addBaseMap.dispatch(obj[i]);
            }
        }
    },
    // change color of selected object
    changeObjcolor: function(id){
        this.signals.changeObjcolor.dispatch(id);
    },
    //add model binded
    scenicBindModel: function(){
        this.signals.changeObjcolor.dispatch(id);
    },

    //get parent obj
    getParentObj: function(obj){
        var objects = this.objects;
        for(var i = 0,l=objects.length; i<l ; i++ ){
            if(objects[i].placeid == obj.pid){
                return objects[i];
            }
        }                  
    },
    viewMode: function(){
        //移除场景中的 所有事件
        this.signals.viewMode.dispatch();
    },
    editorMode: function(){
        //添加场景中的 所有事件
        this.signals.editorMode.dispatch();
    },

    //删除 地点 或 模型
    deleteSceneobj: function(obj){
        this.signals.deleteSceneobj.dispatch(obj);
    },  
}

export default Editory
