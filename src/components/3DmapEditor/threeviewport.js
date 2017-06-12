var Threeviewport = function(editor,store){
    var signals = editor.signals;

    var container,
    camera = editor.camera,
    scene = editor.scene,//场景是公用的
    cssScene = editor.cssScene;

    var renderer, 
    cssRenderer,
    transformControls,
    controls;

    var topplane,//放页面的板子
    topcssObject;//页面中的元素（放地图的）

    var objects = editor.objects//[];//场景中的对象们
    var otherobjects = [];// 放置 底面
    var basemap = [];//底图
    var scenedom = [];//场景中的 dom
    //底图的 经纬度 the map zoom level
    var olng,olat,zooml = 18;
    //记录鼠标按下 放开的 位置
    var onDownPosition = new THREE.Vector2();
    var onUpPosition = new THREE.Vector2();
    var movecenter = new THREE.Vector3(0, 0, 0);
        
    // create WebGL Renderer
    function createGlRenderer(){
        var glRenderer = new THREE.WebGLRenderer({alpha:true});
        glRenderer.setClearColor( 0xECF8FF );//0xECF8FF
        glRenderer.setPixelRatio( window.devicePixelRatio );
        glRenderer.setSize(window.innerWidth, window.innerHeight );
        glRenderer.domElement.style.position = 'absolute';
        glRenderer.domElement.style.zIndex = 0;
        glRenderer.domElement.style.top = 0;
        return glRenderer;
    }

    // create CSS Rendererg
    function createCssRenderer(){
        var cssRenderer = new THREE.CSS3DRenderer();
        cssRenderer.setSize(window.innerWidth, window.innerHeight);
        cssRenderer.domElement.style.position = 'absolute';
        cssRenderer.domElement.style.zIndex = 0;
        cssRenderer.domElement.style.top = 0;
        return cssRenderer;
    }

    //create control
    function createControl(){
        //var controls = new THREE.EditorControls( camera, container );
        var controls = new THREE.EditorControls( camera, document.getElementById("threesection") );
        controls.addEventListener( 'change', function (obj) {
            //console.log("触发了 controls的change事件");
            //console.log("controls网格",obj);
            //更改所有盒子的名字/图标位置
            for(var i=0,l=objects.length;i<l;i++){
                if(!objects[i].modeled){

                    //console.log("要调整的",objects[i]);

                    var zuobiao = editor.toScreenPosition(objects[i].position,camera);
                    objects[i].dom.style.top = (zuobiao.y+5)+"px";
                    objects[i].dom.style.left = (zuobiao.x-50)+"px";

                    objects[i].orginpoint.style.top = (zuobiao.y-5)+"px";
                    objects[i].orginpoint.style.left = (zuobiao.x-5)+"px";
                }
            }

            transformControls.update();
            render();
        } );
        return controls; 
    }

    //create TransformControls
    function createTransformControls(){
        transformControls = new THREE.TransformControls( camera, container );
        //shield no used transform
        transformControls.children[0].handles.children[2].visible=false;
        transformControls.children[0].handles.children[3].visible=false;
        transformControls.children[0].handles.children[6].visible=false;
        transformControls.children[0].handles.children[7].visible=false;
        transformControls.children[0].handles.children[8].visible=false;

        transformControls.children[1].handles.children[0].visible=false;
        transformControls.children[1].handles.children[2].visible=false;
        transformControls.children[1].handles.children[3].visible=false;
        transformControls.children[1].handles.children[4].visible=false;


        console.log("查看transformControls",transformControls);
        transformControls.addEventListener( 'change', function () {
            //console.log("transformControls-change");
            //场景中 景点上绑定多个呈现物时 移动景点 只有一个呈现物跟着景点动 
            transformControls.children[2].handles.children[2].visible=false;
            transformControls.children[2].handles.children[3].visible=false;

            var obj = transformControls.object;
            if(obj){
                if(obj.modeled){//如果是 绑定的 模型
                    
                    
                    transformControls.children[0].handles.children[2].visible=true;
                    transformControls.children[0].handles.children[3].visible=true;
                    transformControls.children[1].handles.children[2].visible=true;
                    transformControls.children[1].handles.children[3].visible=true;

                    transformControls.children[2].handles.children[0].visible=false;
                    transformControls.children[2].handles.children[1].visible=false;
                    transformControls.children[2].handles.children[4].visible=false;
                    transformControls.children[2].handles.children[5].visible=false;
                    transformControls.children[2].handles.children[6].visible=true;

                    /*//调节 size 大的对象缩放的灵敏度
                    if(transformControls.getMode == "scale"&&!controls.enabled){
                        obj.scale.x = obj.scale.x/100;
                        obj.scale.y = obj.scale.y/100;
                        obj.scale.z = obj.scale.z/100;
                    }*/

                    //更改属性框的值 更改store
                    //console.log("模型属性",obj.pospoint);
                    //console.log(obj.pospoint.property.position,obj.pospoint.property.rotation,obj.pospoint.property.scale);
                    obj.pospoint.property.position = JSON.stringify(obj.position);
                    obj.pospoint.property.rotation = JSON.stringify(obj.rotation);
                    obj.pospoint.property.scale = JSON.stringify(obj.scale);

                    
                }else{//是景点
                    //更改属性框的值 更改store
                    var lng = parseFloat((obj.position.x/(46547*Math.pow(2,(zooml-16)))+olng).toFixed(6));//lng
                    var lat = parseFloat((olat-obj.position.z/(60124*Math.pow(2,(zooml-16)))).toFixed(6));//lat
                    obj.pospoint.longitude = lng;
                    obj.pospoint.latitude = lat;
                    if(obj.pospoint.scope_type==1){
                        obj.pospoint.scope = obj.pospoint.scope_width = parseInt(obj.scale.x);
                    }else{
                        obj.pospoint.scope = parseInt(obj.scale.x);
                        obj.pospoint.scope_width = parseInt(obj.scale.z);
                    }

                    //只能按y轴旋转
                    obj.rotation.x = 0;
                    obj.rotation.z = 0;
                    //close limit
                    transformControls.children[0].handles.children[2].visible=false;
                    transformControls.children[0].handles.children[3].visible=false;
                    transformControls.children[1].handles.children[2].visible=false;
                    transformControls.children[1].handles.children[3].visible=false;

                    transformControls.children[2].handles.children[0].visible=true;
                    transformControls.children[2].handles.children[1].visible=true;
                    transformControls.children[2].handles.children[4].visible=true;
                    transformControls.children[2].handles.children[5].visible=true;
                    transformControls.children[2].handles.children[6].visible=false;

                    obj.position.y = obj.scale.y/2;
                    var zuobiao = editor.toScreenPosition(obj.position,camera);
                    obj.dom.style.top = (zuobiao.y+5)+"px";
                    obj.dom.style.left = (zuobiao.x-50)+"px";
                    obj.orginpoint.style.top = (zuobiao.y-5)+"px";
                    obj.orginpoint.style.left = (zuobiao.x-5)+"px";

                    if(obj.modelobj){//如果有 绑定模型
                        //景点绑定的所有模型都要随之更改位置
                        for(var i=0,l=obj.modelobjarray.length;i<l;i++){
                            //console.log("景点绑定的其一模型");
                            //console.log(obj.modelobjarray[i].position.x);
                            obj.modelobjarray[i].position.x = obj.position.x-(obj.old.x - obj.modelobjarray[i].position.x);
                            obj.modelobjarray[i].position.z = obj.position.z-(obj.old.z - obj.modelobjarray[i].position.z);
                            
                            //缩放不能为负数
                            if(obj.modelobjarray[i].scale.x<=0){
                                obj.modelobjarray[i].scale.x=0.1;
                            }
                            if(obj.modelobjarray[i].scale.y<=0){
                                obj.modelobjarray[i].scale.y=0.1;
                            }
                            if(obj.modelobjarray[i].scale.z<=0){
                                obj.modelobjarray[i].scale.z=0.1;
                            }
                        }
                        
                        //记录老位置 以便计算相对距离
                        obj.old = {};
                        obj.old.x = obj.position.x;obj.old.z = obj.position.z;
                        //缩放不能为负数
                        if(obj.modelobj.scale.x<=0){
                            obj.modelobj.scale.x=0.1;
                        }
                        if(obj.modelobj.scale.y<=0){
                            obj.modelobj.scale.y=0.1;
                        }
                        if(obj.modelobj.scale.z<=0){
                            obj.modelobj.scale.z=0.1;
                        }
                    }
                }

                //圆柱不能操作 x z
                if(!obj.modeled&&obj.geometry.type == "CylinderBufferGeometry"){
                    if(obj.modelobj){//有绑定的模型

                        var box = new THREE.Box3().setFromObject( obj.modelobj ); 
                        var modelsize = box.size();//模型的大小
                        ///console.log("大小...",modelsize.x,modelsize.y,modelsize.z);
                        if(obj.scale.x < ((modelsize.x>modelsize.z)?modelsize.x:modelsize.z) || obj.scale.z < ((modelsize.x>modelsize.z)?modelsize.x:modelsize.z)){
                            obj.scale.x = obj.scale.z = (modelsize.x>modelsize.z)?modelsize.x:modelsize.z;
                        }else{
                            if(obj.scale.x>obj.oldscale.x){
                                obj.scale.z = obj.scale.x ;
                            }if(obj.scale.x<obj.oldscale.x){
                                obj.scale.z = obj.scale.x ;
                            }if(obj.scale.z>obj.oldscale.z){
                                obj.scale.x = obj.scale.z ;
                            }if(obj.scale.z<obj.oldscale.z){
                                obj.scale.x = obj.scale.z ;
                            }
                        }

                    }else{
                        if(obj.scale.x>obj.oldscale.x){
                            obj.scale.z = obj.scale.x ;
                        }if(obj.scale.x<obj.oldscale.x){
                            obj.scale.z = obj.scale.x ;
                        }if(obj.scale.z>obj.oldscale.z){
                            obj.scale.x = obj.scale.z ;
                        }if(obj.scale.z<obj.oldscale.z){
                            obj.scale.x = obj.scale.z ;
                        }
                    }

                    obj.oldscale.x = obj.scale.x;
                    obj.oldscale.z = obj.scale.z;
                }

                

                //缩放不能为负数
                if(obj.scale.x<=0){
                    obj.scale.x=0.1;
                }
                if(obj.scale.y<=0){
                    obj.scale.y=0.1;
                }
                if(obj.scale.z<=0){
                    obj.scale.z=0.1;
                }

                render();
            }
        } );
        transformControls.addEventListener( 'mouseDown', function () {
            var obj = transformControls.object;
            console.log("111",obj.scale.x);
            if(transformControls.getMode == "scale"&&obj.modeled){
                obj.scale.x = obj.scale.x*100;
                obj.scale.y = obj.scale.y*100;
                obj.scale.z = obj.scale.z*100;
            }
            //console.log("222",obj.scale.x);
            
            //console.log("按下鼠标控制的元素",obj);
            controls.enabled = false;
        } );
        transformControls.addEventListener( 'mouseUp', function () {
            controls.enabled = true;

            var obj = transformControls.object;
            //console.log("放开鼠标控制的元素",obj);
            
        } );
        return transformControls;
    }

    //create CSS object
    function createCssObject(w,h,position,rotation,url){
        var imageLayer = new AMap.ImageLayer({
            url: url.map_img,
            bounds: new AMap.Bounds(
                [url.sw_lng, url.sw_lat],
                [url.ne_lng, url.ne_lat]
            ),
            zIndex: 1000,
            //zooms: [15, 18],
            visible: true
        });
        
        var map = new AMap.Map("wowoo", {
            resizeEnable: true,
            center: [url.olng,url.olat],
            zoom: url.zooml, //地图显示的缩放级别
            layers: [
                new AMap.TileLayer(),
                imageLayer
            ]
        });
        console.log("地图-----",map);
       
        var div =  document.getElementById("wowoo");
        div.style = "width:"+w+"px;height:"+h+"px";

        var cssObject = new THREE.CSS3DObject(div);
        cssObject.position.x = position.x;
        cssObject.position.y = position.y;
        cssObject.position.z = position.z;
        cssObject.rotation.x = rotation.x;
        cssObject.rotation.y = rotation.y;
        cssObject.rotation.z = rotation.z;
        console.log("cssObject对象",cssObject);
        return cssObject;
    }

    // create plane mesh 
    function createPlane(w,h,position,rotation,obj){
        var material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            opacity: 0.0,
            side: THREE.DoubleSide
        });
        var geometry = new THREE.PlaneGeometry(w, h);
        var mesh = new THREE.Mesh(geometry, material);
        mesh.pospoint = obj;
        mesh.position.x = position.x;
        mesh.position.y = position.y;
        mesh.position.z = position.z;
        mesh.rotation.x = rotation.x;
        mesh.rotation.y = rotation.y;
        mesh.rotation.z = rotation.z;
        return mesh;
    }

    //create 3d webpage object(既创建plane 又创建cssobj)
    function create3dPage(w,h,position,rotation,url,obj){
        if(topplane){
            scene.remove(topplane);
            cssScene.remove(topcssObject);
        }
        topplane = createPlane(w,h,position,rotation,obj);
        scene.add(topplane);
        otherobjects.push(topplane);//方便获取 点击 板子（看似 点击地图）事件
        topcssObject = createCssObject(w,h,position,rotation,url);
        cssScene.add(topcssObject);
        render();
    }

    // signals 场景中的事件处理函数
    function addSignalEvent(){
        //控制对象的模式
        signals.transformModeChanged.add( function ( mode ) {
            transformControls.setMode( mode );
        } );
        // init the original scenic 页面加载时初始化场景中该有的数据（一个个添加到场景中）
        signals.addFromTwo.add( function(objs){//
            //console.log("接收到的对象属性",objs);
            //var olng = 116.334381,  olat = 39.942739;//测试
            var textureimg;
            //处理的objs是对象
            for(var index in objs){
                if(index == "name"){
                    if(objs[index]){
                        var objname = objs[index];
                    }else{
                        var objname = "未命名";
                    }
                }else if(index == "id"){
                    if(objs[index]){
                        var objid = objs[index];
                    }else{
                        var objid = "未命名";
                    }
                }else if(index == "longitude"){
                    if(objs[index]){
                        var xx = parseFloat((objs[index] - olng)*46547)*Math.pow(2,(zooml-16)).toFixed(2);
                    }else{
                        var xx = 0;
                    }
                }else if(index == "latitude"){
                    if(objs[index]){
                        var zz = parseFloat((olat - objs[index])*60124)*Math.pow(2,(zooml-16)).toFixed(2);
                    }else{
                        var zz = 0;
                    }
                }else if(index == "scope"){
                    if(objs[index]){
                        var scalex = objs[index];
                    }else{
                        var scalex = 10;
                    }
                }else if(index == "logo"){
                    if(objs[index]){
                        textureimg = objs[index];
                    }else{
                        textureimg = "http://ocv5g6yqi.bkt.clouddn.com/scp/material/20161207014644-8447.png";
                    }
                }else if(index == "scope_type"){
                    if(objs[index]){
                        var scopetype = objs[index];
                    }else{
                        var scopetype = 1;
                    }
                }else if(index == "scope_width"){
                    if(objs[index]){
                        var scopewidth = objs[index];
                    }else{
                        var scopewidth = 0;
                    }
                }
            }
            if(!textureimg){
                textureimg = "http://ocv5g6yqi.bkt.clouddn.com/scp/material/20161207014644-8447.png";
            }

            if(scopetype==1){
                //console.log("是圆形",scalex);
                //圆柱
                var radiusTop = 0.5;
                var radiusBottom = 0.5;
                var height = 1;
                var radiusSegments = 32;
                var heightSegments = 1;
                var openEnded = true;
                var geometry = new THREE.CylinderBufferGeometry( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded );
                var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
                mesh.scale.x = scalex/1;
                mesh.scale.y = 10;//scalex/1;
                mesh.scale.z = scalex/1;

            }else{
                //console.log("是矩形",scalex,scopewidth);
                //方盒子
                var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
                var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
                mesh.scale.x = scalex/1;
                mesh.scale.y = 10;//scalex/1;
                mesh.scale.z = scopewidth/1;
            }
            
            
            mesh.material['side'] = 2;
            
            mesh.material['emissive'].b = 0;//0.6078431372549019;// 
            mesh.material['emissive'].g = 1;//0.9607843137254902;//
            mesh.material['emissive'].r = 0.5019607843137255;//0.5450980392156862
            mesh.material['transparent'] = true;
            mesh.material['opacity'] = 0.7;

            mesh.placeid = objid ;

            //存放景点属性的引用类型

            mesh.pospoint = objs;

            mesh.position.x = parseFloat(xx);
            mesh.position.y = 5;//scalex/2;
            mesh.position.z = parseFloat(zz);
            

            mesh.modelobjarray = [];//存放景点的多个模型
            
            //为了帮助圆的 scale-x scale-z 同步
            mesh.oldscale = {};
            mesh.oldscale.x = mesh.scale.x;
            mesh.oldscale.z = mesh.scale.z;

            //更改范围类型时用到了
            mesh.old = {};
            mesh.old.x = mesh.position.x;mesh.old.z = mesh.position.z;
            mesh.visible = false;
            if(xx!=0&&zz!=0){
                scene.add( mesh )
                objects.push( mesh );
                mesh.dombox = document.createElement("div");
                mesh.dombox.className = "threescenic";
                
                var zuobiao = editor.toScreenPosition(mesh.position,camera);
                mesh.dom = document.createElement("p");
                mesh.dom.setAttribute("data-id",objid);
                mesh.dom.className = "threescenicname";
                mesh.dom.innerHTML = objname;
                mesh.dom.setAttribute("style","position:absolute;color:#0B245E;font-size:10px;font-weight:600;text-align:center;width:100px;text-shadow: 1px 1px 1px #FFFFFF;");
                mesh.dom.style.top = (zuobiao.y+5)+"px";
                mesh.dom.style.left = (zuobiao.x-50)+"px";

                mesh.orginpoint = document.createElement("img");
                mesh.orginpoint.className = "threescenicimg";
                mesh.orginpoint.setAttribute("data-id",objid);
                mesh.orginpoint.draggable="false";
                mesh.orginpoint.setAttribute("style","width: 10px;height: 10px; border-radius: 5px;position:absolute");
                mesh.orginpoint.src = textureimg;
                mesh.orginpoint.style.top = (zuobiao.y-5)+"px";
                mesh.orginpoint.style.left = (zuobiao.x-5)+"px";

                mesh.dombox.appendChild(mesh.dom);
                mesh.dombox.appendChild(mesh.orginpoint);
                
                //添加点击事件 
                mesh.orginpoint.addEventListener("click",clickImgName,false);
                scenedom.push( mesh.dombox );//记录场景中的 dom
                document.getElementById("threescenic").appendChild(mesh.dombox);
            }
            
        } )
        
        //选中对象
        /*signals.selecdTobject.add(function(id,pid){
            //console.log("执行选中");
            for(var i=0,l=objects.length;i<l;i++){
                if(!objects[i].modeled){//不是模型 是景点
                    if(objects[i].placeid == parseInt(id)){
                        //属性栏切换到当前选中  更改store
                        store.dispatch('changeClickObj',objects[i].pospoint);
                        
                        //之前选中的景点隐藏
                        console.log("666",editor.selected);
                        if(editor.selected){
                            editor.selected.visible = false;
                            for(var s=0,n=editor.selected.modelobjarray?editor.selected.modelobjarray.length:0;s<n;s++){
                                editor.selected.modelobjarray[s].visible=false;
                            }
                        }
                        
                        //显示该景点的范围
                        objects[i].visible = true;
                        //显示该景点下的模型
                        for(var s = 0,n=objects[i].modelobjarray?objects[i].modelobjarray.length:0;s<n;s++){
                            objects[i].modelobjarray[s].visible = true;
                        }

                        editor.select(objects[i]);
                        
                        var centertop = document.getElementById("threescenic").offsetHeight/2,
                        centerleft = document.getElementById("threescenic").offsetWidth/2,
                        curtop = parseInt(objects[i].orginpoint.style.top.replace("px","")) + 5,
                        curleft = parseInt(objects[i].orginpoint.style.left.replace("px","")) + 5;
                      
                        //controls.pan( new THREE.Vector3( curleft-centerleft,centertop-curtop,0 ) );
                        //改为 平滑移动
                        for(var q=0;q<50;q++){
                            setTimeout( function(){
                                controls.pan( new THREE.Vector3( (curleft-centerleft)/50,(centertop-curtop)/50,0 ) );
                            },300 );
                            
                        }
                        controls.pan( new THREE.Vector3( 0,0,0 ) );
                        

                        
                        objects[i].material['emissive'].b = 0;//0.6078431372549019;// 
                        objects[i].material['emissive'].g = 1;//0.9607843137254902;//
                        objects[i].material['emissive'].r = 0.5019607843137255;//0.5450980392156862

                        //更改选中样式
                        $(".threescenic").removeClass('active');
                        $(objects[i].dom).parent().addClass('active');
                        
                        
                        if(!editor.itviewmode){//是编辑模式 并且 是 解锁状态
                            transformControls.attach( objects[i] );
                        }

                        render();
                    }else{
                        

                        objects[i].material['emissive'].b = 0;//0.6078431372549019;// 
                        objects[i].material['emissive'].g = 1;//0.9607843137254902;//
                        objects[i].material['emissive'].r = 0.5019607843137255;//0.5450980392156862
                    }


                }
                
            }
        })*/

        //把模型绑定到 景点上
        signals.bindModelToScenic.add(function(model,id,modeldata){//id为景点 id
            //console.log("绑定模型到景点",modeldata);
            //处理模型数据的 position rotate scale
            var defaultdata_pr = {x: 0,y: 0,z: 0},
            defaultdata_s = {x: 1,y: 1,z: 1};
            var thismodel = {};
            thismodel.position = modeldata.property.position ? JSON.parse( modeldata.property.position ) : defaultdata_pr 
            thismodel.rotation = modeldata.property.rotation ? JSON.parse( modeldata.property.rotation ) : defaultdata_pr;
            thismodel.scale = modeldata.property.scale ? JSON.parse( modeldata.property.scale ) : defaultdata_s;
            for(var i=0,l=objects.length;i<l;i++){
                if(objects[i].placeid == id){
                    //console.log( "绑定到这个对象上",objects[i] );
                    model.visible = false;//设置模型不可见
                    scene.add( model )
                    objects.push( model );
                    objects[i].modelobj = model;

                    objects[i].modelobjarray.push(model);//存放景点的多个模型
                    
                    //模型的 大小(模型的大小)
                    var box = new THREE.Box3().setFromObject( model ); 
                    var modelsize = box.size();//模型的大小
                    //console.log("模型的大小是",modelsize.x,modelsize.y,modelsize.z);
                    if(modelsize.x>modelsize.z){
                        var modelscalesize = modelsize.x; 
                    }else{
                        var modelscalesize = modelsize.z; 
                    }

                    
                    objects[i].modelobj.scale.x = thismodel.scale.x; //0.5;
                    objects[i].modelobj.scale.y = thismodel.scale.y; //0.5;
                    objects[i].modelobj.scale.z = thismodel.scale.z; //0.5;
                    
                    objects[i].modelobj.rotation.x = thismodel.rotation.x * THREE.Math.DEG2RAD;
                    objects[i].modelobj.rotation.y = thismodel.rotation.y * THREE.Math.DEG2RAD;
                    objects[i].modelobj.rotation.z = thismodel.rotation.z * THREE.Math.DEG2RAD;

                    objects[i].modelobj.position.x = parseFloat(thismodel.position.x)+parseFloat(objects[i].position.x);
                    objects[i].modelobj.position.y = parseFloat(thismodel.position.y);
                    objects[i].modelobj.position.z = parseFloat(thismodel.position.z)+parseFloat(objects[i].position.z);
                    //记录对象的 旧位置
                    objects[i].old = {};
                    objects[i].old.x = objects[i].position.x;
                    objects[i].old.z = objects[i].position.z;
                    
                    //记录绑定的 模型的 老位置
                    model.old = {};
                    model.old.x = objects[i].modelobj.position.x;
                    model.old.z = objects[i].modelobj.position.z;
                    model.oldscale = {};
                    model.oldscale.x = objects[i].modelobj.scale.x;
                    model.oldscale.y = objects[i].modelobj.scale.y;
                    model.oldscale.z = objects[i].modelobj.scale.z;

                    render();

                }
            }
        });
        //铺上 底图
        signals.addBaseMap.add(function(obj){
            //更改经纬度 原点 
            var ne_lng = obj.north_east.lng,
            ne_lat = obj.north_east.lat,
            sw_lng = obj.south_west.lng,
            sw_lat = obj.south_west.lat;

            olng = (parseFloat(ne_lng)+parseFloat(sw_lng))/2;
            olat = (parseFloat(ne_lat)+parseFloat(sw_lat))/2;

            var neadobj = {
                olng: olng,
                olat: olat,
                ne_lng: ne_lng,
                ne_lat: ne_lat,
                sw_lng: sw_lng,
                sw_lat: sw_lat,
                zooml: zooml,
                map_img: obj.map_image
            }
            create3dPage(4500, 3500,new THREE.Vector3(0, 0, 0),new THREE.Vector3(-90 * Math.PI / 180, 0, 0),neadobj,obj);
            
        });
        
        //清空场景
        signals.sceneCleared.add(function(){
            //清空 对象
            for(var i=0,l=objects.length;i<l;i++){
                scene.remove(objects.pop());

            }
            //清空底图
            for(var i=0,l=basemap.length;i<l;i++){
                scene.remove(basemap.pop());
            }

            //清空 场景中的dom
            for(var i=0,l=scenedom.length;i<l;i++){
                //document.getElementById("threesection").removeChild(scenedom.pop());
                document.getElementById("threescenic").removeChild(scenedom.pop());
            }

            render();
        })
        //选中的对象显示不同的颜色 change color of object
        signals.changeObjcolor.add(function(id){
            for(var i=0,l=objects.length;i<l;i++){
                if(!objects[i].modeled){
                    if(objects[i].placeid == id){
                        /*objects[i].material['emissive'].b = 0.9176470588235294;//0.47843137254901963;//
                        objects[i].material['emissive'].g = 0.8941176470588236;//0.13725490196078433;//
                        objects[i].material['emissive'].r = 0.7254901960784313;//0.8313725490196079;*///

                        objects[i].material['emissive'].b = 0;//0.6078431372549019;// 
                        objects[i].material['emissive'].g = 1;//0.9607843137254902;//
                        objects[i].material['emissive'].r = 0.5019607843137255;//0.5450980392156862
                    }else{
                        /*objects[i].material['emissive'].b = 0.7529411764705882;// 
                        objects[i].material['emissive'].g = 0.7529411764705882;//
                        objects[i].material['emissive'].r = 0.7529411764705882;//*/

                        objects[i].material['emissive'].b = 0;//0.6078431372549019;// 
                        objects[i].material['emissive'].g = 1;//0.9607843137254902;//
                        objects[i].material['emissive'].r = 0.5019607843137255;//0.5450980392156862
                    }
                }
            }
        })
        
        //2d坐标转 3d坐标
        signals.toSpacePosition.add(function(event,type){
            var raycaster = new THREE.Raycaster();
            var mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            var intersects = raycaster.intersectObjects( otherobjects );
            console.log("焦点，，，，，，",intersects[0].point,type);
            switch(type){
                case "box":
                    createBox(intersects[0].point);
                    break;
                case "Cylinder":
                    createCylinder(intersects[0].point);
                    break;
                case "Sphere":
                    createSphere(intersects[0].point);
                    break;
                default:
                    break;
            } 
        })
        //进入查看模式
        signals.viewMode.add(function(){
            console.log("3d进入查看模式");
            //移除之前选中对象的 操作轴
            transformControls.detach();
            render();
            editor.itviewmode = true;
        })
        //进入编辑模式
        signals.editorMode.add(function(){
            console.log("3d进入编辑模式");
            editor.itviewmode = false;
        })

        //删除地点或模型
        signals.deleteSceneobj.add(function(obj){
            console.log("删除接收到的参数！！！",obj);
            if(obj.type=="loc"){
                //console.log("删除地点");
                for(var i=0;i<objects.length;i++){
                    if(objects[i].placeid == obj.id){
                        //console.log("删除此地点");
                        var curscenic = objects.splice(i,1);
                        document.getElementById("threescenic").removeChild(curscenic[0].dombox);
                        scene.remove(curscenic[0]);
                        render();
                    }
                }
            }else if(obj.type=="model"){
                console.log("删除模型");
                for(var i=0;i<objects.length;i++){
                    if( objects[i].mid == obj.id && objects[i].pid == obj.pid){
                        console.log( "要删除这个模型",objects[i] );
                        var curscenic = objects.splice(i,1);
                        scene.remove(curscenic[0]);
                        render();
                    }
                }
            }
        })

    }
    //场景中图标 和 名字的点击事件 处理函数
    function clickImgName(event){
        console.log("根状态",store.state.activeToolbarBtn.viewBtn);
        console.log("点击场景中对象的图片和名字");
        
        var id = $(event.currentTarget).attr("data-id");

        //场景中选中
        //editor.selecdTobject(id);//自己去选中
        for(var i=0,l=objects.length;i<l;i++){
            if(!objects[i].modeled){//不是模型 是景点
                if(objects[i].placeid == parseInt(id)){
                    //属性栏切换到当前选中  更改store
                    store.dispatch('changeClickObj',objects[i].pospoint);
                    
                    //显示该景点的范围
                    objects[i].visible = true;
                    //显示该景点下的模型
                    for(var s = 0,n=objects[i].modelobjarray?objects[i].modelobjarray.length:0;s<n;s++){
                        objects[i].modelobjarray[s].visible = true;
                    }

                    editor.select(objects[i]);
                    
                    var centertop = document.getElementById("threescenic").offsetHeight/2,
                    centerleft = document.getElementById("threescenic").offsetWidth/2,
                    curtop = parseInt(objects[i].orginpoint.style.top.replace("px","")) + 5,
                    curleft = parseInt(objects[i].orginpoint.style.left.replace("px","")) + 5;
                  
                    controls.pan( new THREE.Vector3( curleft-centerleft,centertop-curtop,0 ) );
                    //改为 平滑移动
                    for(var q=0;q<50;q++){
                        setTimeout( function(){
                            controls.pan( new THREE.Vector3( (curleft-centerleft)/50,(centertop-curtop)/50,0 ) );
                        },300 );
                    }
                    //controls.pan( new THREE.Vector3( 0,0,0 ) );
                    
                    objects[i].material['emissive'].b = 0;//0.6078431372549019;// 
                    objects[i].material['emissive'].g = 1;//0.9607843137254902;//
                    objects[i].material['emissive'].r = 0.5019607843137255;//0.5450980392156862

                    //更改选中样式
                    $(".threescenic").removeClass('active');
                    $(objects[i].dom).parent().addClass('active');
                    
                    transformControls.detach();
                    if(store.state.activeToolbarBtn.viewBtn==2){//编辑模式 解锁状态 可选中
                        transformControls.attach( objects[i] );
                    }
                    render();
                }else{
                    objects[i].material['emissive'].b = 0;//0.6078431372549019;// 
                    objects[i].material['emissive'].g = 1;//0.9607843137254902;//
                    objects[i].material['emissive'].r = 0.5019607843137255;//0.5450980392156862
                }
            }
        }
    }
    //create box
    function createBox(positionsself){
        console.log("添加BOX");
        var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
        var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial(0xff0000) );
        
        mesh.position.x = positionsself.x;
        mesh.position.y = positionsself.y;
        mesh.position.z = positionsself.z;
        mesh.scale.x = 10;
        mesh.scale.y = 10;
        mesh.scale.z = 10;
        mesh.material['side'] = 2;
        mesh.material['emissive'].b = 0.7529411764705882;
        mesh.material['emissive'].g = 0.7529411764705882;
        mesh.material['emissive'].r = 0.7529411764705882;
        mesh.material['transparent'] = true;
        mesh.material['opacity'] = 0.5;
        //增加到场景中 并选中
        mesh.created = true;
        mesh.dom = document.createElement("div");
        var zuobiao = editor.toScreenPosition(mesh,camera);
        //console.log(zuobiao);
        mesh.dom.innerHTML = "我是新盒子";
        mesh.dom.setAttribute("style","position:absolute;color: #d4237a;");
        mesh.dom.style.top = zuobiao.y+"px";
        mesh.dom.style.left = zuobiao.x+"px";
        document.getElementById("threesection").appendChild(mesh.dom);

        mesh.orginpoint = document.createElement("div");
        var zuobiao = editor.toScreenPosition(mesh,camera);
        //console.log(zuobiao);
        mesh.orginpoint.innerHTML = "我是新盒子";
        mesh.orginpoint.setAttribute("style","position:absolute;color: #d4237a;");
        mesh.orginpoint.style.top = zuobiao.y+"px";
        mesh.orginpoint.style.left = zuobiao.x+"px";
        document.getElementById("threesection").appendChild(mesh.orginpoint);

        editor.addObject(mesh);
        editor.createself = false;
        document.getElementById("createtab").className = "transform-action";
        document.getElementsByClassName("tabaddul")[0].style.display = "none";
    }
    //create Cylinder
    function createCylinder(positionsself){
        var radiusTop = 0.5;
        var radiusBottom = 0.5;
        var height = 1;
        var radiusSegments = 32;
        var heightSegments = 1;
        var openEnded = true;

        var geometry = new THREE.CylinderBufferGeometry( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded );
        var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
        mesh.position.x = positionsself.x;
        mesh.position.y = positionsself.y;
        mesh.position.z = positionsself.z;
        mesh.scale.x = 10;
        mesh.scale.y = 10;
        mesh.scale.z = 10;
        mesh.material['side'] = 2;//
        mesh.material['emissive'].b = 0.7529411764705882;
        mesh.material['emissive'].g = 0.7529411764705882;
        mesh.material['emissive'].r = 0.7529411764705882;
        mesh.material['transparent'] = true;
        mesh.material['opacity'] = 0.5;

        mesh.created = true;
        mesh.dom = document.createElement("div");
        var zuobiao = editor.toScreenPosition(mesh,camera);
        mesh.dom.innerHTML = "我是新范围";
        mesh.dom.setAttribute("style","position:absolute;color: #d4237a;");
        mesh.dom.style.top = zuobiao.y+"px";
        mesh.dom.style.left = zuobiao.x+"px";
        document.getElementById("threesection").appendChild(mesh.dom);

        mesh.orginpoint = document.createElement("div");
        var zuobiao = editor.toScreenPosition(mesh,camera);
        mesh.orginpoint.innerHTML = "我是新范围";
        mesh.orginpoint.setAttribute("style","position:absolute;color: #d4237a;");
        mesh.orginpoint.style.top = zuobiao.y+"px";
        mesh.orginpoint.style.left = zuobiao.x+"px";
        document.getElementById("threesection").appendChild(mesh.orginpoint);

        //增加到场景中 并选中
        editor.addObject(mesh);

        editor.createself = false;

        document.getElementById("createtab").className = "transform-action";
        document.getElementsByClassName("tabaddul")[0].style.display = "none";
    }
    //create Sphere
    function createSphere(positionsself){
        
        console.log("添加球");
        var radius = 0.5;
        var widthSegments = 32;
        var heightSegments = 16;
        var phiStart = 0;
        var phiLength = Math.PI * 2;
        var thetaStart = 0;
        var thetaLength = Math.PI;

        var geometry = new THREE.SphereBufferGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength );
        var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
        mesh.position.x = positionsself.x;
        mesh.position.y = positionsself.y;
        mesh.position.z = positionsself.z;
        mesh.scale.x = 10;
        mesh.scale.y = 10;
        mesh.scale.z = 10;
        mesh.material['side'] = 2;//
        mesh.material['emissive'].b = 0.7529411764705882;
        mesh.material['emissive'].g = 0.7529411764705882;
        mesh.material['emissive'].r = 0.7529411764705882;
        mesh.material['transparent'] = true;
        mesh.material['opacity'] = 0.5;

        mesh.created = true;
        mesh.dom = document.createElement("div");
        var zuobiao = editor.toScreenPosition(mesh,camera);
        console.log(zuobiao);
        mesh.dom.innerHTML = "我是新球";
        mesh.dom.setAttribute("style","position:absolute;color: #d4237a;");
        mesh.dom.style.top = zuobiao.y+"px";
        mesh.dom.style.left = zuobiao.x+"px";
        document.getElementById("threesection").appendChild(mesh.dom);

        mesh.orginpoint = document.createElement("div");
        var zuobiao = editor.toScreenPosition(mesh,camera);
        console.log(zuobiao);
        mesh.orginpoint.innerHTML = "我是新球";
        mesh.orginpoint.setAttribute("style","position:absolute;color: #d4237a;");
        mesh.orginpoint.style.top = zuobiao.y+"px";
        mesh.orginpoint.style.left = zuobiao.x+"px";
        document.getElementById("threesection").appendChild(mesh.orginpoint);

        //增加到场景中 并选中
        editor.addObject(mesh);
        editor.createself = false;
        document.getElementById("createtab").className = "transform-action";
        document.getElementsByClassName("tabaddul")[0].style.display = "none";
    }
    // add dom event 
    function addDomEvent(){
        window.addEventListener( 'resize', onWindowResize, false );

        //初始化时 是查看模式 可选中 不可编辑
        container.addEventListener( 'mousedown', onMouseDown, false );//能够点击地图显示地图属性

        //禁止用户选中页面上的内容
        var elem = document.getElementById('threesection');
        elem.onselectstart = function(){
            return false;
        }

        //三种控制变换 添加快捷键 WER
        document.onkeydown=function(event) {//87 69 82
            if(event.keyCode == 87){
                editor.signals.transformModeChanged.dispatch( 'translate' );
            }else if(event.keyCode == 69){
                editor.signals.transformModeChanged.dispatch( 'rotate' );
            }else if(event.keyCode == 82){
                editor.signals.transformModeChanged.dispatch( 'scale' );
            }
        }
    }
    //
    function onWindowResize() {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( container.offsetWidth, container.offsetHeight );
        cssRenderer.setSize( container.offsetWidth, container.offsetHeight );
        for(var i=0,l=objects.length;i<l;i++){
            if(!objects[i].modeled){
                var zuobiao = editor.toScreenPosition(objects[i].position,camera);
                objects[i].dom.style.top = (zuobiao.y+5)+"px";
                objects[i].dom.style.left = (zuobiao.x-50)+"px";

                objects[i].orginpoint.style.top = (zuobiao.y-5)+"px";
                objects[i].orginpoint.style.left = (zuobiao.x-5)+"px";
            }
        }
        render();
    }
    
    //获取点击到的对象们 get current object
    function getIntersects( point, objects ) {
        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();
        mouse.set( ( point.x * 2 ) - 1, - ( point.y * 2 ) + 1 );
        raycaster.setFromCamera( mouse, camera );

        //Break up group
        var gotucheckObject = objects;
        for(var i=0,l=objects.length;i<l;i++){
            if(objects[i].type=="Group"){
                for(var j=0,n=objects[i].children.length;j<n;j++){
                    objects[i].children[j].groupid = objects[i].selfid;
                    objects[i].children[j].ppid = objects[i].pid;
                }
                //gotucheckObject = objects.concat( objects[i].children );
                gotucheckObject = gotucheckObject.concat( objects[i].children )
            }
        }
        return raycaster.intersectObjects( gotucheckObject );
    }
    
    //场景中的点击事件
    function handleClick(e) {
        //console.log("场景点击页面",e);
        if ( onDownPosition.distanceTo( onUpPosition ) === 0 ) {
            var intersects = getIntersects( onUpPosition, objects.concat(otherobjects) );//otherobjects放置底面
            if ( intersects.length > 0 ) {
                //console.log("点击时选中的对象数组",intersects);
                var object = intersects[ 0 ].object;
                console.log("点击时选中的 对象",object);
                
                //隐藏之前选中景点以及景点下的模型 -- （选中的是模型 不隐藏）
                if(editor.selected&&editor.selected.geometry&&editor.selected.geometry.type!="PlaneGeometry"&&!object.groupid){//editor.selected 之前选中的对象是景点
                    editor.selected.visible = false;
                    for(var s = 0;s<editor.selected.modelobjarray.length;s++){
                        editor.selected.modelobjarray[s].visible = false;
                    }
                }
                
                if(object.groupid){// one in group 是模型的一部分
                    console.log("是模型的一部分",object);
                    for(var i=0,l=objects.length;i<l;i++){
                        if(objects[i].modeled){
                            if( objects[i].selfid&&objects[i].selfid == object.groupid ){//selfid groupid (绑定关系id) 
                                if(store.state.activeToolbarBtn.viewBtn==2){//编辑模式可选中
                                    transformControls.detach();
                                    transformControls.attach( objects[i]  );
                                }
                                console.log("模型是",objects[i]);
                                break;//找到一个就退出
                            }
                        }
                    }
                }else if(object.geometry.type=="PlaneGeometry"){//是地图
                    console.log("点击的是地图");
                    //show map info
                    if(editor.createself){//box Cylinder Sphere
                        //console.log("创建盒子");
                        editor.toSpacePosition(e,editor.createtype);
                    }else{//是显示 地图还是创建盒子
                        console.log("显示地图信息");
                        //更改 store
                        store.dispatch('changeClickObj',object.pospoint);
                        console.log("显示地图信息完毕");
                        transformControls.detach();
                        editor.select( object );
                    }
                    
                }else{//是景点
                    //不能让圆柱等 阻碍 模型的 点选
                    console.log("点选时 击中的 对象们", intersects );//从中 选出模型
                    for(var j=0;j<intersects.length;j++){
                        if(intersects[j].object.groupid){
                            console.log("穿透圆柱找到了 模型");
                            var theobj = intersects[j].object;//这是找到的模型的一部分
                           
                            for(var i=0,l=objects.length;i<l;i++){
                                if(objects[i].modeled){
                                    if( objects[i].selfid&&objects[i].selfid == theobj.groupid ){
                                        //如果组中的每一项有绑定到的景点id 这一项的pid等于组的ppid  
                                        if(store.state.activeToolbarBtn.viewBtn==2){//编辑模式可选中
                                            transformControls.detach();
                                            transformControls.attach( objects[i]  );
                                        }
                                        console.log("是模型",objects[i])
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
            } else {
                transformControls.detach();
                console.log("没击中任何对象");
                editor.select( null );
            }
            render();
        }
    }

    function onMouseDown( event ) {
        //event.preventDefault();
        var array = getMousePosition( container, event.clientX, event.clientY );
        onDownPosition.fromArray( array );
        document.addEventListener( 'mouseup', onMouseUp, false );
    }

    function onMouseUp( event ) {
        var array = getMousePosition( container, event.clientX, event.clientY );
        onUpPosition.fromArray( array );//fromArray转化成数组
        handleClick(event);
        document.removeEventListener( 'mouseup', onMouseUp, false );
    }
    //获取鼠标位置
    function getMousePosition( dom, x, y ) {
        var rect = dom.getBoundingClientRect();
        return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];
    }

    function render() {
        scene.updateMatrixWorld();
        cssRenderer.render(cssScene, camera);
        renderer.render(scene, camera);
        //requestAnimationFrame(render);
    }

    //监听属性栏的 改变
    function watchInput() {
        setInterval(function(){
            if(editor.selected){
                if(editor.selected.pospoint){
                    //console.log("watchInput",editor.selected);
                    //console.log("watchInput",editor.selected.geometry);
                    if(editor.selected.type == "Group"){

                    }else if(editor.selected.geometry.type=="PlaneGeometry"){//底面

                    }else{//景点
                        //名字
                        editor.selected.dom.innerHTML = editor.selected.pospoint.name;
                        //范围
                        if(editor.selected.pospoint.scope_type==1){
                            editor.selected.scale.x = editor.selected.pospoint.scope;
                            editor.selected.scale.z = editor.selected.pospoint.scope;
                        }else{
                            editor.selected.scale.x = editor.selected.pospoint.scope;
                            editor.selected.scale.z = editor.selected.pospoint.scope_width;
                        }
                        //位置
                    }
                }
            }
            render();
        },100);
    }

    //初始化场景
    function initScene(){
        renderer = createGlRenderer();
        cssRenderer = createCssRenderer();
        container = document.createElement( 'div' );
        container.id = "threescenic";
        container.setAttribute("style","position: absolute; top:0px; bottom: 0px; left: 0px; right: 0px;");
        document.getElementById("threesection").appendChild( container );
        container.appendChild( cssRenderer.domElement );
        container.appendChild( renderer.domElement );

        transformControls = createTransformControls();
        controls = createControl();

        // add transformControls
        scene.add( transformControls );

        // Light
        var light = new THREE.AmbientLight( 0xffffff );
        scene.add( light );

        console.log("执行到此---初始化场景");
        addSignalEvent();
        addDomEvent();// 创建的景点拖拽到场景和地图中
        //监听input框的变化
        watchInput();
        onWindowResize();
        render();
    }

    
    
    initScene();   
}

export default Threeviewport




