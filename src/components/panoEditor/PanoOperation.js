import axios from 'axios'
import globalConfig from '../../store/dataConfig/globalConfig';
var PanoOperation = {
    panoId:'',
    scenicId:'',
    labelArray:[],
    scenicArray:[],
    container:null,
    isUserInteracting:true,
    onMouseDownMouseX:0,
    onMouseDownMouseY:0,
    onMouseDownLon:0,
    onMouseDownLat:0,
    onPointerDownLon:0,
    onPointerDownLat:0,
    onPointerDownPointerX:0,
    onPointerDownPointerY:0,
    phi:0,
    theta:0,
    lon:0,
    lat:0,
    backLon:0,
    backLat:0,
    backTarget:null,
    radius:500,//半径
    scene:null,
    renderer:null,
    mesh:null,
    camera:null,     
    raycaster:new THREE.Raycaster(),
    mouse:new THREE.Vector2(),
    dragMouse:new THREE.Vector2(),
    defaultIcon:'http://ocv5g6yqi.bkt.clouddn.com/scp/material/测试/图标/20170216030325-9827.png',
    defaultText:'Text',
    defaultColour:'#ffffff',
    defaultSize:'10px',
    isMoveleft:false,
    isMoveright:false,
    isMovetop:false,
    isMovedown:false,
    initPanoScence:function(panoId){ 
        PanoOperation.container = document.getElementById( 'panoContainer' );
        PanoOperation.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
        PanoOperation.scene = new THREE.Scene();
        PanoOperation.renderer = new THREE.WebGLRenderer();
        PanoOperation.renderer.setPixelRatio( window.devicePixelRatio );
        PanoOperation.renderer.setSize( window.innerWidth, window.innerHeight );
        PanoOperation.container.appendChild( PanoOperation.renderer.domElement );
        this.changeScenePano(panoId);
        
    },
    changeScenePano:function (panoId) {
        console.log("PanoOperation.labelArray---",PanoOperation.labelArray);
        console.log("the panoId is ----:",panoId);
        PanoOperation.isUserInteracting = true;
        PanoOperation.labelArray = [];
        axios.get(globalConfig.apiUrl, {
            params: {
                r:'panorama/view',
                id:panoId
            }
        })
        .then(function (resp) {
            console.log(' getPanoInfor success: ---- ', resp);
            if (resp && resp.data) {
                resp = resp.data; 
                var panoTarget;
                if(resp.default_point == null){
                    panoTarget = {x:0,y:0,z:0};
                }else{
                    panoTarget = JSON.parse(resp.default_point);
                }
                if(resp.default_lat == null || resp.default_lon == null ){
                    resp.default_lat = 0;
                    resp.default_lon = 0;
                    panoTarget = {x:0,y:0,z:0};
                }
                console.log("panoTarget.x,panoTarget.y, panoTarget.z----",panoTarget.x,panoTarget.y, panoTarget.z);
                PanoOperation.camera.target = new THREE.Vector3( panoTarget.x,panoTarget.y, panoTarget.z);
                PanoOperation.lat = Number( resp.default_lat );
                PanoOperation.lon = Number( resp.default_lon );
                //设置保存全景回到正方位属性值
                PanoOperation.backTarget = JSON.stringify({x:panoTarget.x,y:panoTarget.y,z:panoTarget.z});
                PanoOperation.backLat = Number( resp.default_lat );
                PanoOperation.backLon = Number( resp.default_lon );
                var panoUrl = resp.url+'?imageslim';
                var geometry = new THREE.SphereGeometry( PanoOperation.radius, 60, 40 );
                geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );//沿x轴进行-1的scale，让球体的面朝内（因为我们将从球内进行观看）。
                var material = new THREE.MeshBasicMaterial( {
                    map: new THREE.TextureLoader().load(panoUrl)
                } );
                PanoOperation.mesh = new THREE.Mesh( geometry, material );
                PanoOperation.scene.add( PanoOperation.mesh );
                //全景编辑下绑定全景move事件
                window.setTimeout(function(){
                    PanoOperation.loop();
                    PanoOperation.addEvent();
                },1000)        
            }
            
        })
        .catch(function (err) {
            console.log(' getLabelList error : ---- ', err);
        })
    },
    addEvent:function () {
        //window.addEventListener('keydown', PanoOperation.onAddkeyBtn);
        window.addEventListener( 'resize', PanoOperation.onWindowResize, false );
    },
    onWindowResize:function() {
        PanoOperation.camera.aspect = window.innerWidth / window.innerHeight;
        PanoOperation.camera.updateProjectionMatrix();
        PanoOperation.renderer.setSize( window.innerWidth, window.innerHeight );
        //实时更新已有文本在场景中的坐标
        PanoOperation.renderLabel();
    },
    onAddkeyBtn:function(event){
        event = event || window.event;
        event.preventDefault();
        var keyCode = event.keyCode;
        if( keyCode == 37 || keyCode == 38 || keyCode == 39 || keyCode == 40){
            if(keyCode == 38) {//按下上建
                //console.log("按下上键");
                PanoOperation.lat = Number(PanoOperation.lat) + 1;
            }else if(keyCode == 37) {//按下左建
                //console.log("按下左键");
                PanoOperation.lon = Number(PanoOperation.lon) - 1;
            }else if(keyCode ==39) {//按下右建
                //console.log("按下右键");
                PanoOperation.lon = Number(PanoOperation.lon) + 1;
            }else if(keyCode == 40) {//按下下建
                //console.log("按下下键");
                PanoOperation.lat = Number(PanoOperation.lat) - 1;
            }
            PanoOperation.loop();    
        }
    },
    onpanoClick:function( event ){
        console.log("event",event.target);
        event.stopPropagation();
        event.preventDefault();
        if(($(event.target).is("canvas") && $("#creatText").hasClass("active")) || ($("#arrowBtn").hasClass("active") && $(event.target).is("canvas"))){
            console.log("添加标签状态");
            var type,cursorAt = {};
            var div = document.createElement("div");
            PanoOperation.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            PanoOperation.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            PanoOperation.raycaster.setFromCamera(PanoOperation.mouse, PanoOperation.camera);
            var intersects = PanoOperation.raycaster.intersectObjects(PanoOperation.scene.children);
            console.log("mouse-pointer",intersects[0].point);
            var zuobiao = PanoOperation.toScreenPosition(intersects[0].point);
            intersects[0].dom = div;
            if($("#creatText").hasClass("active")){
                console.log("添加自定义文本标签状态");
                type = 1;
                cursorAt = { left: 18, bottom: 0 };
                intersects[0].dom.setAttribute("class","textDiv");
                intersects[0].dom.setAttribute("style","position:absolute;padding:5px 5px 5px 35px;height:55px;top:"+(zuobiao.top-50)+"px;left:"+(zuobiao.left-18)+"px;border-radius:5px;");
                //创建图片
                var oImg = document.createElement("img");
                oImg.className = "oImg";
                oImg.src = PanoOperation.defaultIcon;
                oImg.setAttribute("style","position:absolute;left:3px;height:30px;width:30px;");
                intersects[0].dom.appendChild( oImg );
                var oImg1 = document.createElement("img");
                oImg1.src ='../adminStyles/img/pano/circle.png';;
                oImg1.setAttribute("style","position:absolute;left:3px;height:50px;width:30px;");
                intersects[0].dom.appendChild( oImg1 );
                //创建文本
                var oInput = document.createElement('input');
                oInput.className = "panoTextarea";
                $(oInput).val(PanoOperation.defaultText);
                oInput.setAttribute("type","text");
                oInput.setAttribute("style","position:relative;width:60px;height:30px;line-height:30px;text-align:center;overflow-y:visible;border-radius:5px;border:1px solid #ccc;font-size:"+PanoOperation.defaultSize+";color:"+PanoOperation.defaultColour+";background-color: rgba(0, 0, 0, 0.5)");     
                intersects[0].dom.appendChild( oInput );
            }else if($("#arrowBtn").hasClass("active")){
                console.log("添加自定义箭头标签状态");
                type = 2;
                cursorAt = { left: 30, bottom: 50 };
                intersects[0].dom.className = "arrowBox";
                //创建地点提示文字
                var arrowName = document.createElement("h6");
                arrowName.className = "arrowName";
                arrowName.setAttribute("style","text-align:center;height:30px;line-height:30px;background-color:rgba(0,0,0,0.5);border-radius:5px;");
                arrowName.innerHTML = "选择目标地点：";
                intersects[0].dom.appendChild( arrowName );
                //创建图片
                var arrowImg = document.createElement("img");
                arrowImg.className = "arrowImg";
                arrowImg.src = '../adminStyles/img/pano/arrowBtn.png';
                arrowImg.setAttribute("style","margin:0 auto;display:block;height:60px;width:60px;transform: rotateX(50deg);");
                intersects[0].dom.appendChild( arrowImg );
                PanoOperation.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                PanoOperation.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
                PanoOperation.raycaster.setFromCamera(PanoOperation.mouse, PanoOperation.camera);
                intersects[0].dom.setAttribute("style","position:absolute;top:"+(zuobiao.top-50)+"px;left:"+(zuobiao.left-30)+"px;padding:5px;text-align:center;color:#fff;");
            }
            document.getElementById("panoContainer").appendChild( intersects[0].dom );
            //创建成功后后台保存文本信息接口http://scp-api.jinglian.com/?r=panorama-property/static&expand=addPanoPro
            $.ajax({
                url: sceneClass.configs.apiUrl+'?r=panorama-property/static&expand=addPanoPro',
                type: 'POST',
                data: {
                    panorama_id:PanoOperation.panoId,
                    icon:PanoOperation.defaultIcon,
                    text:PanoOperation.defaultText,
                    colour:PanoOperation.defaultColour,
                    size:PanoOperation.defaultSize,
                    coord:'{"x":"'+intersects[0].point.x+'","y":"'+intersects[0].point.y+'","z":"'+intersects[0].point.z+'"}',
                    location_id:'',
                    type:type
                },
                success:function(resp){
                    console.log('创建标签的返回值是----',resp);
                    $("#creatText").removeClass("active");//创建成功后，创建按钮弹起
                    if(resp.addPanoPro.success){
                        resp = resp.addPanoPro.data;
                        if(!resp.location_id){
                           resp.location_id = null; 
                        }
                        resp.dom = intersects[0].dom;
                        PanoOperation.labelArray.push(resp);
                        intersects[0].dom.id = resp.id;
                        intersects[0].dom.setAttribute("data-id",resp.id);
                        intersects[0].dom.setAttribute("data-text",resp.text);
                        intersects[0].dom.setAttribute("data-colour",resp.colour);
                        intersects[0].dom.setAttribute("data-size",resp.size);
                        intersects[0].dom.setAttribute("data-icon",resp.icon);
                        intersects[0].dom.setAttribute("data-coord",resp.coord);
                        intersects[0].dom.setAttribute("data-locationid",resp.location_id);
                        intersects[0].dom.setAttribute("data-type",resp.type);
                        // panoEdit.resetPropersList();//重置右侧标签属性栏
                        // $('.props-container').css('display', 'none');//隐藏右侧地点属性栏
                        // panoEdit.panoPropersList(resp.id,resp.text,resp.colour,resp.size,resp.icon);
                    }
                },
                error:function(e,x,r){
                    console.log("panoInforError---",e);
                }
            });  
            //鼠标键盘控制上下左右移动事件
            $(div).bind("keydown", function(event){
                event = event || window.event;
                var keyCode = event.keyCode;
                if( keyCode == 37 || keyCode == 38 || keyCode == 39 || keyCode == 40){
                    console.log("修改前",intersects[0].point);
                    if(keyCode == 38) {//按下上建
                        intersects[0].point.y = intersects[0].point.y + 10;
                    }else if(keyCode == 37) {//按下左建
                        intersects[0].point.z = intersects[0].point.z + 10;
                    }else if(keyCode ==39) {//按下右建
                        intersects[0].point.z = intersects[0].point.z - 10;
                    }else if(keyCode == 40) {//按下下建
                        intersects[0].point.y = intersects[0].point.y - 10;
                    }
                    //移动后修改场景中的3D坐标
                    for(var i = 0;i < PanoOperation.labelArray.length;i++){
                        var thisMove = PanoOperation.labelArray[i];
                        if($(this).attr("data-id") == thisMove.id){                             
                            thisMove.coord = JSON.stringify(intersects[0].point);
                            console.log("修改后",thisMove.coord);
                            //拖拽后修改标签坐标http://api.scoope.net/?r=panorama-property/update&id=1
                            panoEdit.changeLabelProOne($(this).attr('data-id'),"coord",thisMove.coord);
                        }
                    };
                }
            });
            $(div).bind("keyup", function(event){
                PanoOperation.renderLabel();
            });
            $(div).draggable({
                cursor:"move",
                cursorAt: cursorAt,
                start:function () {
                    PanoOperation.isMoveleft = false;
                    PanoOperation.isMoveright = false;
                    PanoOperation.isMovetop = false; 
                    PanoOperation.isMovedown = false;
                    PanoOperation.isUserInteracting = false;
                    $(PanoOperation.container).unbind( 'mousemove', PanoOperation.onDocumentMouseMove);  
                },
                stop:function(dragEvent, ui){
                    $(this).children("input").focus();
                    console.log("fsdifjdf",dragEvent.clientX,dragEvent.clientY);
                    PanoOperation.dragMouse.x = (dragEvent.clientX / window.innerWidth) * 2 - 1;
                    PanoOperation.dragMouse.y = -(dragEvent.clientY / window.innerHeight) * 2 + 1;
                    PanoOperation.raycaster.setFromCamera(PanoOperation.dragMouse, PanoOperation.camera);
                    var dragIntersects = PanoOperation.raycaster.intersectObjects(PanoOperation.scene.children);
                    console.log("dragMouse-pointer",dragIntersects[0].point);
                    console.log("arrayarray",PanoOperation.labelArray);
                    for(var i = 0;i < PanoOperation.labelArray.length;i++){
                        var thisDrag = PanoOperation.labelArray[i];
                        if($(this).attr("data-id") == thisDrag.dom.id){                             
                            thisDrag.coord = JSON.stringify(dragIntersects[0].point);
                            console.log("修改后",thisDrag.coord);
                            //拖拽后修改标签坐标http://api.scoope.net/?r=panorama-property/update&id=1
                            panoEdit.changeLabelProOne($(dragEvent.target).attr('data-id'),"coord",thisDrag.coord);
                        }
                    }
                    $(PanoOperation.container).bind( 'mousemove', PanoOperation.onDocumentMouseMove);
                }
            });                     
        }else if($(event.target).is("canvas")){
            $(event.target).siblings().removeClass('shine_border');//点击全景空白处，取消标签选中样式
            var panoContainer = document.getElementById("panoContainer");
            var locationLists = panoContainer.getElementsByClassName("location-item");
            for(var i = 0; i < locationLists.length; i++){
                var thisLocation = locationLists[i];
                var locationId = thisLocation.getAttribute("data-obj-id");
                if(locationId == PanoOperation.scenicId){
                    console.log(locationId);
                    $('.panoBox').css('display', 'none');//隐藏右侧地点属性栏
                    var objInfo = {
                        id:  $(thisLocation).attr('data-obj-id'),
                        name: $(thisLocation).attr('data-obj-name'),
                        type: $(thisLocation).attr('data-obj-type'),
                        classname: 'baseProps',
                        focusDom: $(thisLocation),
                    };
                    console.log('点击地点后，当前地点的ID 是: ----- ', $(thisLocation).attr('data-obj-id'));
                    var locPropsArray = sceneClass.locsObj[''+$(thisLocation).attr('data-obj-id')+''];
                    console.log('点击对象的属性数组是: - --- ', locPropsArray);
                    //  执行焦点切换的撤销重做
                    editor.excute(new ChangeFocusObjAction(objInfo, locPropsArray, $(thisLocation), 'panoEditor'));
                }
            } 
        }else if($(event.target).is("input")){
            console.log("点击了input区域,无法在此处添加标签！！！");
            $("#creatText").removeClass("active");//无法创建标签，创建按钮弹起
            $(event.target).unbind();
            $(event.target).parent().addClass("shine_border").siblings().removeClass('shine_border');
            /*//文本区域全部选中状态
            if($(event.target).focus()){
                $(event.target).select();  
            };*/
            var type = $(event.target).parent().attr("data-type");
            var labelId = $(event.target).parent().attr("data-id");
            var oldText = $(event.target).parent().attr("data-text");
            var oldColour = $(event.target).parent().attr("data-colour");
            var oldSize = $(event.target).parent().attr("data-size");
            var oldIcon = $(event.target).parent().attr("data-icon");
            var oldCoord = $(event.target).parent().attr("data-coord");
            var locationId = $(event.target).parent().attr("data-locationid");
            console.log(labelId,oldText,oldColour,oldSize,oldIcon,oldCoord);
            panoEdit.resetPropersList();//重置右侧标签属性栏
            $('.props-container').css('display', 'none');//隐藏右侧地点属性栏
            panoEdit.panoPropersList(type,labelId,oldText,oldColour,oldSize,oldIcon,locationId);
            //实时监听textarea值的变化
            $(event.target).bind('change', function() { 
                var labelId = $(event.target).parent().attr("data-id");
                var panoText = $(event.target).val();
                console.log(panoText);
                panoEdit.changeLabelProOne(labelId,'text',panoText);
                editor.excute(new setMarkerTextAction(oldText,$(this).val(),$(this).parent()));
            });
            //文本区域随输入的内容自动增加高度
            $("input").unbind('keydown').bind('keydown', function(){
                $(this).width(PanoOperation.textWidth($(this).val()));
            });
        }else if($(event.target).is("h6")){
            console.log("点击了h6区域,无法在此处添加标签！！！");
            $("#arrowBtn").removeClass("active");//无法创建标签，创建按钮弹起
            $(event.target).unbind();
            $(event.target).parent().addClass("shine_border").siblings().removeClass('shine_border');
            var type = $(event.target).parent().attr("data-type");
            var labelId = $(event.target).parent().attr("data-id");
            var oldText = $(event.target).parent().attr("data-text");
            var oldColour = $(event.target).parent().attr("data-colour");
            var oldSize = $(event.target).parent().attr("data-size");
            var oldIcon = $(event.target).parent().attr("data-icon");
            var oldCoord = $(event.target).parent().attr("data-coord");
            var locationId = $(event.target).parent().attr("data-locationid");
            panoEdit.resetPropersList();//重置右侧标签属性栏
            $('.props-container').css('display', 'none');//隐藏右侧地点属性栏
            panoEdit.panoPropersList(type,labelId,oldText,oldColour,oldSize,oldIcon,locationId);
        } 
    },
    textWidth: function(text){ 
        var sensor = $('<pre>'+ text +'</pre>').css({display: 'none'}); 
        $('body').append(sensor); 
        var width = sensor.width();
        sensor.remove(); 
        return width;
    },
    onArrowImgClick:function(){
        $('#panoContainer').on('click','.arrowImg',function(event) {
            event.stopPropagation();
            console.log("点击了箭头方位按钮！"); 
            var eventId = $(event.target).parent().attr("data-locationid");
            console.log(eventId);
            //http://api.scoope.net/?r=location/view&id=711&fields=pano_id
            $.ajax({
                url: sceneClass.configs.apiUrl+'?r=location/view',
                type: 'GET',
                data:{
                    'id':eventId,
                    'fields':'pano_id'
                },
                success:function(resp){
                    console.log("获取全景id的返回值----",resp);
                    PanoOperation.initPanoScence(resp.pano_id,eventId);
                },
                error:function(e,x,r){
                    console.log("panoInforError---",e);
                }
            });
        });
    },  
    onLocsClick: function( event ) {
        $('#panoContainer').on('click' ,'.location-item', function(event) {
            event.stopPropagation();
            $(this).addClass("shine_border").siblings().removeClass('shine_border');
            $('.panoBox').css('display', 'none');//隐藏右侧地点属性栏
            var objInfo = {
                id:  $(this).attr('data-obj-id'),
                name: $(this).attr('data-obj-name'),
                type: $(this).attr('data-obj-type'),
                classname: 'baseProps',
                focusDom: $(this),
            };
            console.log('点击地点后，当前地点的ID 是: ----- ', $(this).attr('data-obj-id'));
            var locPropsArray = sceneClass.locsObj[''+$(this).attr('data-obj-id')+''];
            console.log('点击对象的属性数组是: - --- ', locPropsArray);
            //  执行焦点切换的撤销重做
            editor.excute(new ChangeFocusObjAction(objInfo, locPropsArray, $(this), 'panoEditor'));
        });
    },
    loop:function () {
        if(PanoOperation.isUserInteracting){
            requestAnimationFrame(PanoOperation.loop);
        }
        PanoOperation.update();
    },
    renderLabel:function(){
        //实时更新已有文本在场景中的坐标
        for(var j = 0;j < PanoOperation.labelArray.length;j++){
            var labelItem = PanoOperation.labelArray[j];
            var coord = JSON.parse(labelItem.coord);
            var coordItem = PanoOperation.toScreenPosition(coord);
            $("div[labelId$='"+labelItem.id+"']").css({'top':coordItem.top+'px','left':coordItem.left+'px'});
        }
    },
    update:function() {
        PanoOperation.lat = Math.max( - 85, Math.min( 85, PanoOperation.lat ) );
        PanoOperation.phi = THREE.Math.degToRad( 90 - PanoOperation.lat );
        PanoOperation.theta = THREE.Math.degToRad( PanoOperation.lon );//将度转换为弧度
        //console.log("PanoOperation.camera.target.x---",PanoOperation.camera.target.x);
        PanoOperation.camera.target.x = PanoOperation.radius * Math.sin( PanoOperation.phi ) * Math.sin( PanoOperation.theta );//添加负号，改变相机视角位置。
        PanoOperation.camera.target.y = PanoOperation.radius * Math.cos( PanoOperation.phi );
        PanoOperation.camera.target.z = PanoOperation.radius * Math.sin( PanoOperation.phi ) * Math.cos( PanoOperation.theta );
        PanoOperation.camera.lookAt( PanoOperation.camera.target );//相机看向哪个坐标位置
        PanoOperation.renderLabel();
        PanoOperation.renderer.render( PanoOperation.scene, PanoOperation.camera );
    },
    toScreenPosition:function( pos ){
        //根据上一步中记录的位置生成一个向量
        var vector  = new THREE.Vector3(pos.x, pos.y, pos.z);
        //将这个向量映射到镜头的平面上
        vector.project(PanoOperation.camera);
        //将位置信息还原成以左上角为原点的位置信息
        var screenPos = {
          left: Math.round((   vector.x + 1 ) * window.innerWidth/ 2),
          top: Math.round(( -vector.y + 1 ) * window.innerHeight/ 2),
          z:vector.z
        };
        //console.log(screenPos.z);
        if(screenPos.z < 1){
            return screenPos;
        }else{
            return screenPos = {left: -100,top: -100,z:vector.z};
        }
    },
    toScreen:function(pos){
        //根据上一步中记录的位置生成一个向量
        var vector  = new THREE.Vector3(pos.x, pos.y, pos.z);
        //将这个向量映射到镜头的平面上
        vector.project(camera);
        //将位置信息还原成以左上角为原点的位置信息
        var screenPos = {
          left: Math.round((   vector.x + 1 ) * window.innerWidth/ 2),
          top: Math.round(( -vector.y + 1 ) * window.innerHeight/ 2)
        };
        return screenPos;
    },
}

export default PanoOperation