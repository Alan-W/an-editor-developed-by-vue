window.panoEdit = {
    raycaster:new THREE.Raycaster(),
    domMouse:new THREE.Vector2(),
    labelObj: {},
    saveLabelObjInfo:function(labels){
        var that = this;
        for (var i = 0; i < labels.length; i++) {
            var thisLable = labels[i];
            var labelProps = {
                id: thisLable.id,
                text: thisLable.text,
                colour: thisLable.colour,
                size: thisLable.size,
                icon: thisLable.icon
            };
            var labelProps = that.covertObjProps(locProps);
            that.labelObj[''+thisLable.id+''] = labelProps; // 使用ID 来保存地点的属性
        }  
        return this.labelObj;  
    },
    panoPropersList:function(type,labelId,text,color,size,logo,locationId) {
        console.log("panoPropersList---locationId",locationId);
        var that = this;
        //右侧编辑栏列表添加
        var panoBox = document.createElement("div");
        panoBox.className = "panoBox";
        panoBox.setAttribute("style","padding:15px 0;background: rgba(255, 255, 255, 0.5);")
        var panoUl = document.createElement("ul");
        panoUl.className = "panoUl";
        panoUl.setAttribute("style","padding:0 10px;text-align:left;");
        //标识ID
        var textIdLi = document.createElement("li");
        textIdLi.setAttribute("style","margin-top:5px");
        panoUl.appendChild(textIdLi);
        var idText = document.createElement("span");
        idText.setAttribute("style","width:30px;height:30px;line-height:30px;font-size:13px;font-weight:400;color:#555;display:inline-block");  
        idText.innerHTML = 'ID：';
        textIdLi.appendChild(idText);
        var idSpan = document.createElement("span");
        idSpan.setAttribute("style","width:80px;height:30px;line-height:30px;font-size:13px;font-weight:400;color:#555;display:inline-block");  
        idSpan.innerHTML = labelId;
        textIdLi.appendChild(idSpan);
        var delImg = document.createElement("img");
        $(delImg).bind('click',function(event) {
            $(".delBox").css("display","block");
        });
        delImg.src = "../../adminStyles/img/edit/delete.png";
        delImg.setAttribute("style","float:right;margin-top:5px;margin-right:30px;width:15px;height:15px;cursor:pointer;display:inline-block"); 
        textIdLi.appendChild(delImg);
        //删除标签dom
        var delBox = document.createElement("div");
        delBox.setAttribute("style","display:none;position:absolute;top:100px;left:85px;width:150px;height:100px;background: rgba(0,0,0,0.8);padding:10px;border-radius: 10px;");
        delBox.className = "delBox";
        var delTitle = document.createElement("div");
        delTitle.className = "delBox-title";
        delTitle.innerHTML = "确定要删除吗?";
        delTitle.setAttribute("style","width:150px;height:40px;line-height:30px;color:#fff;text-align:center;padding:5px;");
        delBox.appendChild(delTitle);
        var delSure = document.createElement("div");
        delSure.className = "delBox-content";
        var sureBtn = document.createElement("span");
        //点击确定按钮
        $(sureBtn).bind('click',function(event) {
            var deleteID = $(this).parent().parent().siblings().children('li').eq(0).children('span').eq(1).html();
            that.deleteLabel(deleteID);
        });
        sureBtn.className = "btn btn-success";
        sureBtn.innerHTML = "确定";
        delSure.appendChild(sureBtn);
        var cancleBtn = document.createElement("span");
        //点击取消按钮
        $(cancleBtn).bind('click',function(event) {
            $(".delBox").css("display","none");
        });
        cancleBtn.className = "btn btn-danger fr";
        cancleBtn.innerHTML = "取消";
        delSure.appendChild(cancleBtn);
        delBox.appendChild(delSure);
        panoBox.appendChild( delBox );
        if(type == 1){
            //文本内容代码
            var contentLi = document.createElement("li");
            contentLi.className = "contentLi";
            contentLi.setAttribute("style","margin-top:5px");
            panoUl.appendChild(contentLi);
            var contentAttr = document.createElement("div");
            contentLi.appendChild(contentAttr);
            var contentSpan = document.createElement("span");
            contentSpan.setAttribute("style","width:80px;height:30px;line-height:30px;font-size:13px;font-weight:400;color:#555;display:block");  
            contentSpan.innerHTML = "文本内容：";
            contentAttr.appendChild(contentSpan);
            var contentArea = document.createElement( 'textarea' );
            $(contentArea).bind('input',function(){
                console.log($(this).val());
                that.changeLabelProOne(labelId,'text',$(this).val());           
            });
            //文本区域随输入的内容自动增加高度
            $(contentArea).bind("keyup keydown", function(){
                $(this).height(this.scrollHeight);
            });
            //文本区域全部选中状态
            $(contentArea).bind("focus", function(){
                $(event.target).select();
            });
            contentArea.className = "editTextarea";
            contentArea.id = "editTextarea";
            contentArea.setAttribute("style","margin:0 auto;width:260px;max-width:260px;overflow-y:visible;font-size:8px;color:#000000;border-radius:4px;border:1px solid #ccc;display:block;");
            contentArea.innerText = text;
            contentAttr.appendChild(contentArea);

            //字体颜色代码  
            var colorLi = document.createElement("li");
            colorLi.className = "colorLi";
            colorLi.setAttribute("style","margin-top:5px");
            panoUl.appendChild(colorLi);
            var colorAttr = document.createElement("div");
            colorLi.appendChild(colorAttr);
            var colorSpan = document.createElement("span");
            colorSpan.setAttribute("style","width:80px;height:30px;line-height:30px;font-size:13px;font-weight:400;color:#555;display:inline-block");  
            colorSpan.innerHTML = "字体颜色：";
            colorAttr.appendChild(colorSpan);
            var colorText = document.createElement( 'input' );
            colorText.id="colorText";
            colorText.setAttribute("style","color:"+color+";width:100px;height:30px;line-height:30px;text-align:center;font-size:13px;border-radius:4px;border:1px solid #ccc;display:inline-block;");
            colorText.value = color.toString();
            colorAttr.appendChild(colorText);
            var colorImg = document.createElement("img");
            colorImg.src = "../adminStyles/img/pano/colorpicker.png";
            colorImg.id = "cp3";
            colorImg.setAttribute("style","width:30px;height:30px;line-height:30px;cursor:pointer;vertical-align: middle;display:inline-block;margin-left:10px;");
            colorAttr.appendChild(colorImg);
            //颜色选择的实现代码
            $(colorImg).colorpicker({
                fillcolor:true,  
                event:'click',
                target:$(colorText),
                success:function(o,newColor){
                    $(colorText).css("color",newColor);
                    that.changeLabelProOne(labelId,'colour',newColor);
                    editor.excute(new setMarkerColourAction(color,newColor,labelId));
                }
            });        
            //字体大小代码
            var sizeLi = document.createElement("li");
            sizeLi.className = "sizeLi";
            sizeLi.setAttribute("style","margin-top:5px");
            panoUl.appendChild(sizeLi);
            var sizeAttr = document.createElement("div");
            sizeLi.appendChild(sizeAttr);
            var sizeSpan = document.createElement("span");
            sizeSpan.setAttribute("style","width:80px;height:30px;line-height:30px;font-size:13px;font-weight:400;color:#555;display:inline-block");  
            sizeSpan.innerHTML = "字体大小：";
            sizeAttr.appendChild(sizeSpan);
            var sizeSelect = document.createElement("select");
            sizeSelect.className = "sizeSelect";
            sizeSelect.id = "sizeSelect";
            sizeSelect.setAttribute("style","border-radius:4px;width:100px;height:30px;line-height:30px;text-align:center;");
            sizeSelect.innerHTML = "<option>8px</option><option>9px</option><option>10px</option><option>11px</option><option>12px</option><option>13px</option><option>14px</option><option>15px</option><option>16px</option><option>17px</option><option>18px</option><option>19px</option><option>20px</option>";
            sizeAttr.appendChild(sizeSelect);
            //默认显示选中字体大小
            $(sizeSelect).val(size);
            //监测字体大小值改变
            $(sizeSelect).change(function(){
                console.log("size--change");
                that.changeLabelProOne(labelId,'size',$(this).val());
                editor.excute(new setMarkerSizeAction(size,$(this).val(),labelId));
            });
            //图片大小代码
            var imgLi = document.createElement("li");
            imgLi.className = "imgLi";
            imgLi.setAttribute("style","margin-top:5px");
            panoUl.appendChild(imgLi);
            var imgAttr = document.createElement("div");
            imgLi.appendChild(imgAttr);
            var imgSpan = document.createElement("span");
            imgSpan.setAttribute("style","width:80px;height:30px;line-height:30px;font-size:13px;font-weight:400;color:#555;display:inline-block");  
            imgSpan.innerHTML = 'LOGO选择：';
            imgAttr.appendChild(imgSpan);
            var imgSrc = document.createElement("img");
            imgSrc.id = "imgSrc";
            imgSrc.src = logo;
            imgSrc.setAttribute("data-target","#materialSource");
            imgSrc.setAttribute("data-toggle","modal");
            imgSrc.setAttribute("style","width:100px;height:100px;border:none;padding:10px;");
            imgAttr.appendChild(imgSrc);

            /*//开始----xyz全景坐标代码
            var coordLi =  document.createElement("li");
            coordLi.className = "coordLi";
            panoUl.appendChild(coordLi);
            var xAttr = document.createElement("div");
            xAttr.innerHTML = "X:";
            xAttr.setAttribute("style","height:30px;line-height:30px;text-align:center;");
            coordLi.appendChild(xAttr);
            var xSpan = document.createElement("span");
            xSpan.id = "xSpan";
            xSpan.setAttribute("style","margin-left:20px;border: 1px solid #ccc;");
            xSpan.innerHTML = panoOperation.camera.target.x;
            xAttr.appendChild(xSpan);
            var titleAttr = document.createElement("div");
            titleAttr.setAttribute("style","height:30px;line-height:30px;");
            coordLi.appendChild(titleAttr);
            titleAttr.innerHTML = "相机坐标Y:";
            var ySpan = document.createElement("span");
            ySpan.id = "ySpan";
            ySpan.setAttribute("style","margin-left:20px;border: 1px solid #ccc;");
            ySpan.innerHTML = panoOperation.camera.target.y;
            titleAttr.appendChild(ySpan);
            var zAttr = document.createElement("div");
            zAttr.setAttribute("style","height:30px;line-height:30px;text-align:center;");
            zAttr.innerHTML = "Z:";
            titleAttr.appendChild(zAttr);
            var zSpan = document.createElement("span");
            zSpan.id = "zSpan";
            zSpan.setAttribute("style","margin-left:20px;border: 1px solid #ccc;");
            zSpan.innerHTML = panoOperation.camera.target.z;
            zAttr.appendChild(zSpan);
            coordLi.appendChild(zAttr);
            //下方按钮样式
            var lookBtnLi = document.createElement("li");
            lookBtnLi.className = "lookBtnLi";
            lookBtnLi.setAttribute("style","margin-top:5px");
            panoUl.appendChild(lookBtnLi);
            var lockBtn = document.createElement("span");
            lockBtn.className = "lockBtn";
            lockBtn.innerHTML = "重设全景正方向";
            lockBtn.setAttribute("style","margin-right:6%;width:47%;display:inline-block;height:30px;line-height:30px;border:1px solid #ccc;text-align:center;border-radius: 5px;cursor:pointer;");
            lookBtnLi.appendChild(lockBtn);
            var backBtn = document.createElement("span");
            backBtn.innerHTML = "回到全景正方向";
            backBtn.setAttribute("style","width:47%;display:inline-block;height:30px;line-height:30px;border:1px solid #ccc;text-align:center;border-radius: 5px;cursor:pointer;");
            lookBtnLi.appendChild(backBtn);
            //点击锁定全景图方位按钮
            $(lockBtn).bind('click',function(event) {
                var point = {x:panoOperation.camera.target.x,y:panoOperation.camera.target.y,z:panoOperation.camera.target.z};
                point = JSON.stringify(point);
                that.changePanoLonLat(panoOperation.panoId,panoOperation.lat,panoOperation.lon,point);
            });
            //点击回到全景图方位按钮
            $(backBtn).bind('click',function(event) {
                panoOperation.lon = panoOperation.backLon;
                panoOperation.lat = panoOperation.backLat;
                var cCoord = panoOperation.backTarget;
                cCoord = JSON.parse(cCoord);
                panoOperation.camera.target = new THREE.Vector3(cCoord.x,cCoord.y,cCoord.z);
                panoOperation.isUserInteracting = true;
                panoOperation.loop();
            });
            */
            //将新增的标签添加到panoBox中
            panoBox.appendChild(panoUl);
            document.getElementsByClassName("list-wrap")[0].appendChild( panoBox );
        }else{
            var scenicLi = document.createElement("li");
            scenicLi.setAttribute("style","margin-top:10px;width:100%;height:30px;line-height:30px;font-size:12px;"); 
            panoUl.appendChild(scenicLi); 
            var scenicSpan = document.createElement("span");
            scenicSpan.innerHTML = "目标地点：";
            scenicSpan.setAttribute("style","display:inline-block;height:30px;line-height:30px;font-size:14px;"); 
            scenicLi.appendChild(scenicSpan);
            var scenicSelect = document.createElement("select");
            scenicSelect.setAttribute("style","text-align:center;height:30px;line-height:30px;font-size:12px;"); 
            var initOption = document.createElement("option");
            initOption.setAttribute("data-panoId",'');
            initOption.setAttribute("data-locationId",'');
            initOption.innerHTML = "请选择目标地点---";
            scenicSelect.appendChild(initOption);
            $.ajax({
                url: sceneClass.configs.apiUrl,
                type: 'GET',
                data: {
                    r: 'organization/static',
                    fields: 'null',
                    expand: 'getLocationList',
                    oid: sceneClass.configs.oid
                },
                success:function(resp){
                    console.log('获取当前机构下的景区列表成功的返回值是： ------ ', resp);
                    if (resp && resp.getLocationList) {
                        var locationLists = resp.getLocationList.data;
                        for(var i = 0; i < locationLists.length; i++){
                            var itemLocation = locationLists[i];
                            if(itemLocation.pano_id){
                                if(itemLocation.pano_id == panoOperation.panoId){
                                    continue;
                                }
                                var scenicOption = document.createElement("option");
                                scenicOption.setAttribute("data-locationId",itemLocation.id);
                                scenicOption.innerHTML = itemLocation.name;
                                scenicSelect.appendChild(scenicOption);
                            }
                        }
                        scenicLi.appendChild(scenicSelect);
                        panoUl.appendChild(scenicLi);  
                        panoBox.appendChild(panoUl); 
                        document.getElementsByClassName("list-wrap")[0].appendChild( panoBox );
                        $(scenicSelect).change(function(){
                            var changeLocId = $(this).find("option:selected").attr("data-locationid");
                            $("div[data-id$='"+labelId+"']").attr("data-locationid",changeLocId);
                            $("div[data-id$='"+labelId+"']").children('h6').html($(this).val());
                            //http://api.scoope.net/?r=panorama-property/static&expand=updatePanoPro
                            $.ajax({
                                url: sceneClass.configs.apiUrl+'?r=panorama-property/static&expand=updatePanoPro',
                                type: 'POST',
                                data:{
                                    'id':labelId,
                                    'text':$(this).val(),
                                    'location_id':changeLocId
                                },
                                success:function(resp){
                                    console.log("修改箭头标签属性的返回值----",resp);
                                },
                                error:function(e,x,r){
                                    console.log("panoInforError---",e);
                                }
                            });
                        });
                    }
                },
                error:function(e){
                    console.log("error");
                }
            });
        }
    },
    addPanoCameraAttr:function(){
        //开始----xyz全景坐标代码
        var coordLi =  document.createElement("li");
        coordLi.className = "coordLi";
        document.getElementsByClassName("props-list")[0].appendChild(coordLi);
        var xAttr = document.createElement("div");
        xAttr.innerHTML = "X:";
        xAttr.setAttribute("style","height:30px;line-height:30px;text-align:center;");
        coordLi.appendChild(xAttr);
        var xSpan = document.createElement("span");
        xSpan.id = "xSpan";
        xSpan.setAttribute("style","margin-left:20px;border: 1px solid #ccc;");
        xSpan.innerHTML = panoOperation.camera.target.x;
        xAttr.appendChild(xSpan);
        var titleAttr = document.createElement("div");
        titleAttr.setAttribute("style","height:30px;line-height:30px;");
        coordLi.appendChild(titleAttr);
        titleAttr.innerHTML = "相机坐标Y:";
        var ySpan = document.createElement("span");
        ySpan.id = "ySpan";
        ySpan.setAttribute("style","margin-left:20px;border: 1px solid #ccc;");
        ySpan.innerHTML = panoOperation.camera.target.y;
        titleAttr.appendChild(ySpan);
        var zAttr = document.createElement("div");
        zAttr.setAttribute("style","height:30px;line-height:30px;text-align:center;");
        zAttr.innerHTML = "Z:";
        titleAttr.appendChild(zAttr);
        var zSpan = document.createElement("span");
        zSpan.id = "zSpan";
        zSpan.setAttribute("style","margin-left:20px;border: 1px solid #ccc;");
        zSpan.innerHTML = panoOperation.camera.target.z;
        zAttr.appendChild(zSpan);
        coordLi.appendChild(zAttr);
        //下方按钮样式
        var lookBtnLi = document.createElement("li");
        lookBtnLi.className = "lookBtnLi";
        lookBtnLi.setAttribute("style","margin-top:5px");
        document.getElementsByClassName("props-list")[0].appendChild(lookBtnLi);
        var lockBtn = document.createElement("span");
        lockBtn.className = "lockBtn";
        lockBtn.innerHTML = "重设全景正方向";
        lockBtn.setAttribute("style","margin-right:6%;width:47%;display:inline-block;height:30px;line-height:30px;border:1px solid #ccc;text-align:center;border-radius: 5px;cursor:pointer;");
        lookBtnLi.appendChild(lockBtn);
        var backBtn = document.createElement("span");
        backBtn.innerHTML = "回到全景正方向";
        backBtn.setAttribute("style","width:47%;display:inline-block;height:30px;line-height:30px;border:1px solid #ccc;text-align:center;border-radius: 5px;cursor:pointer;");
        lookBtnLi.appendChild(backBtn);
        //点击锁定全景图方位按钮
        $(lockBtn).bind('click',function(event) {
            var point = {x:panoOperation.camera.target.x,y:panoOperation.camera.target.y,z:panoOperation.camera.target.z};
            point = JSON.stringify(point);
            that.changePanoLonLat(panoOperation.panoId,panoOperation.lat,panoOperation.lon,point);
        });
        //点击回到全景图方位按钮
        $(backBtn).bind('click',function(event) {
            panoOperation.lon = panoOperation.backLon;
            panoOperation.lat = panoOperation.backLat;
            var cCoord = panoOperation.backTarget;
            cCoord = JSON.parse(cCoord);
            panoOperation.camera.target = new THREE.Vector3(cCoord.x,cCoord.y,cCoord.z);
            panoOperation.isUserInteracting = true;
            panoOperation.loop();
        });
        if($(".pano-scene").hasClass('active')){//判断当前是什么场景 隐藏不需要的属性
            $(".attriul").hide();
        }else{
            $(".attriul").show();
        }
    },
    //修改全景图视图方位属性
    changePanoLonLat:function( panoId, lat, lon, point){
        //http://api.scoope.net/?r=panorama/update&id=89
        var psData = {}; 
        psData.default_point = point;
        psData.default_lat = lat;
        psData.default_lon = lon;
        console.log("psData---",psData);
        $.ajax({
            url: sceneClass.configs.apiUrl+'?r=panorama/update&id='+panoId,
            type: 'POST',
            data:psData,
            success:function(resp){
                console.log("修改全景标签属性的返回值----",resp);
                panoOperation.backTarget = resp.default_point;
                panoOperation.backLat = Number( resp.default_lat );
                panoOperation.backLon = Number( resp.default_lon );
            },
            error:function(e,x,r){
                console.log("panoInforError---",e);
            }
        });
    },  
    // 重置属性栏所有的属性
    resetPropersList:function(){
        $('.panoBox').remove();
    },
    changeLabelProOne:function(labelId,name,value){
        $("div[data-id$='"+labelId+"']").attr('data-'+name,value);
        var subData = {};   
        if(name == "icon"){
            $("div[data-id$='"+labelId+"']").children('img').attr('src',value);
        }else if(name == "colour"){
            $("#colorText").val(value);
            $("#colorText").css("color",value);
            $("div[data-id$='"+labelId+"']").children('input').css("color",value);
        }else if(name == "size"){
            $("#sizeSelect").val(value);
            $("div[data-id$='"+labelId+"']").children('input').css("font-size",value);
        }else if(name == "text"){
            $("#editTextarea").val(value);
            $("div[data-id$='"+labelId+"']").children('input').val(value);  
        }else if(name == "coord"){
            var position = panoOperation.toScreenPosition(JSON.parse(value));
            if($("div[data-id$='"+labelId+"']").attr("data-type") == 2){
                $("div[data-id$='"+labelId+"']").css({"top":(position.top-50)+"px","left":(position.left-30)+"px"});
            }else{
                $("div[data-id$='"+labelId+"']").css({"top":(position.top-50)+"px","left":(position.left-18)+"px"});
            }
        }
        subData['id'] = labelId;
        subData[name] = value;
        //http://api.scoope.net/?r=panorama-property/static&expand=updatePanoPro
        $.ajax({
            url: sceneClass.configs.apiUrl+'?r=panorama-property/static&expand=updatePanoPro',
            type: 'POST',
            data:subData,
            success:function(resp){
                console.log("修改全景标签属性的返回值----",resp);
            },
            error:function(e,x,r){
                console.log("panoInforError---",e);
            }
        });
    },
    changeLabelProsAll:function(labelId,text,icon,colour,size,coord,locationId){
        var that = this;
        $.ajax({
            url: sceneClass.configs.apiUrl+'?r=panorama-property/static&expand=updatePanoPro',
            type: 'POST',
            data: {
                icon:icon,
                text:text,
                colour:colour,
                size:size,
                coord:coord,
                id:labelId,
                location_id:locationId
            },
            success:function(resp){
                console.log("修改全景标签所有属性的返回值----",resp);
                that.resetPropersList();
                that.panoPropersList(resp.id,resp.text,resp.colour,resp.size,resp.icon,resp.location_id);
            },
            error:function(e,x,r){
                console.log("panoInforError---",e);
            }
        })
    },
    //查看模式
    resetViewMode:function(){
        if(editor.getCurEditor() == 'panoEditor'){
            console.log("查看模式",editor.getCurEditor());
            $("#creatText").hide(); // 全景编辑器的查看模式，隐藏文本按钮
            $("#arrowBtn").hide(); // 全景编辑器的编辑模式,显示箭头方位按钮
            $("#creatText").removeClass("active");
            $("#arrowBtn").removeClass("active");
            $(".textDiv").removeClass('shine_border');
            $(".textDiv input").css({"background-color":"rgba(0, 0, 0, 0.5)","border":"none","resize":"none"});
            $(".textDiv input").attr("disabled","disabled");
            $(".maskLayer").css('display','block');
            //$(panoOperation.container).bind( 'mousemove', panoOperation.onDocumentMouseMove);
            $('#panoContainer').css('cursor', '-webkit-grab'); //更改鼠标指针
            //非编辑状态下解绑元素拖拽
            for(var i = 0;i < panoOperation.labelArray.length; i++){
                var itemDom = panoOperation.labelArray[i];
                //console.log("查看模式下禁止拖拽的元素",$(itemDom.dom));
                //$(itemDom.dom).draggable("destroy");// 解绑其拖动事件
                var itemDom = panoOperation.labelArray[i];
                if($(itemDom.dom).is(':data(ui-draggable)')){
                    //console.log("查看模式下已经绑定过了拖拽事件---",$(itemDom.dom).draggable());
                    $(itemDom.dom).draggable("destroy");// 解绑其拖动事件
                }
                $(itemDom.dom).unbind();
            }
        }
    },
    //编辑模式
    resetEditMode:function(){
        if(editor.getCurEditor() == 'panoEditor'){
            $("#arrowBtn").show(); // 全景编辑器的编辑模式,显示箭头方位按钮
            $("#creatText").show(); // 全景编辑器的编辑模式,显示创建文本按钮
            //设置可编辑文本样式
            $(".textDiv input").css({"background-color":"rgba(0, 0, 0, 0.5)","border":"none","resize":"both"});
            $(".textDiv input").removeAttr('disabled');
            $(".maskLayer").css('display','none');
            //$(panoOperation.container).unbind( 'mousemove', panoOperation.onDocumentMouseMove);
            $('#panoContainer').css('cursor', 'cell'); //更改鼠标指针
            console.log("编辑模式",panoOperation.labelArray);
            //场景中已有自定义标签添加拖拽
            for(var i = 0;i < panoOperation.labelArray.length; i++){
                var thisDom = panoOperation.labelArray[i];
                if(thisDom.type == 2){
                    cursorAt = { left: 30, bottom: 50 };
                }else{
                    cursorAt = { left: 18, bottom: 0 };
                }
                $(thisDom.dom).draggable({
                    cursor:"move",
                    cursorAt: cursorAt,
                    start:function (event, ui) {
                        panoOperation.isMoveleft = false;
                        panoOperation.isMoveright = false;
                        panoOperation.isMovetop = false; 
                        panoOperation.isMovedown = false;
                        panoOperation.isUserInteracting = false;
                        $(panoOperation.container).unbind( 'mousemove', panoOperation.onDocumentMouseMove);  
                    },
                    stop:function(dragEvent, ui){
                        $(this).children("input").focus();
                        console.log("dragEventdragEvent",dragEvent);
                        panoEdit.domMouse.x = (dragEvent.clientX / window.innerWidth) * 2 - 1;
                        panoEdit.domMouse.y = -(dragEvent.clientY / window.innerHeight) * 2 + 1;
                        console.log("domMouse",panoEdit.domMouse);
                        panoEdit.raycaster.setFromCamera(panoEdit.domMouse, panoOperation.camera);
                        var dragIntersects = panoEdit.raycaster.intersectObjects(panoOperation.scene.children);
                        for(var j = 0;j < panoOperation.labelArray.length; j++){
                            var thisDiv = panoOperation.labelArray[j];
                            console.log('$(this).attr("data-id")---',$(this).attr("data-id"),"thisDiv.id---",thisDiv.id);
                            if($(this).attr("data-id") == thisDiv.id){
                                thisDiv.coord = JSON.stringify(dragIntersects[0].point);
                                console.log("修改后",thisDiv.coord);
                                panoEdit.changeLabelProOne($(this).attr('data-id'),"coord",thisDiv.coord);
                            }
                        }
                        $(panoOperation.container).bind( 'mousemove', panoOperation.onDocumentMouseMove);
                    }
                });
                //鼠标键盘控制上下左右移动事件
                $(thisDom.dom).bind("keydown", function(event){
                    event = event || window.event;
                    var keyCode = event.keyCode;
                    for(var j = 0; j < panoOperation.labelArray.length; j++){
                        var thisMove = panoOperation.labelArray[j];
                        if($(this).attr("data-id") == thisMove.id){                             
                            var moveCoord = JSON.parse( thisMove.coord );
                            if( keyCode == 37 || keyCode == 38 || keyCode == 39 || keyCode == 40){
                                if(keyCode == 38) {//按下上建
                                    moveCoord.y = moveCoord.y + 10;
                                }else if(keyCode == 37) {//按下左建
                                    moveCoord.z = moveCoord.z + 10;
                                }else if(keyCode ==39) {//按下右建
                                    moveCoord.z = moveCoord.z - 10;
                                }else if(keyCode == 40) {//按下下建
                                    moveCoord.y = moveCoord.y - 10;
                                }
                                //"移动后元素坐标"
                                thisMove.coord = JSON.stringify( moveCoord ); 
                                panoEdit.changeLabelProOne($(this).attr('data-id'),"coord",thisMove.coord);
                            }
                        }
                    };
                });
                $(thisDom.dom).bind("keyup", function(event){
                    panoOperation.renderLabel();
                });
            }
        }
    },
    removeLabelDom:function(deleteID){
        var that = this;
        var thisLabel = $("div[data-id$='"+deleteID+"']");
        console.log('当前要移除的地点是: --- ', thisLabel);
        $(thisLabel).remove(); 
        that.resetPropersList();
    },
    // 删除标签提交数据
    deleteLabel: function(deleteID) {
        var that = this;
        console.log('当前删除标签的ID 是: --- ', deleteID);
        $.ajax({
            //http://scp-api.jinglian.com/?r=panorama-property/static&expand=setPanoDel&id=125
            url: sceneClass.configs.apiUrl,
            data:{
                r:'panorama-property/static',
                expand:'setPanoDel',
                id:deleteID
            },
            type: 'GET',
        })
        .done(function(resp) {
            console.log('删除标签成功！',resp);
            if (resp && resp.setPanoDel && resp.setPanoDel.success) {
                console.log('删除地点成功！');
                // 删除成功之后移除标签在全景中的显示
                that.removeLabelDom(deleteID);
            } else {
                alert('删除失败！');
            }
        })
        .fail(function(xhr) {
            console.log("删除标签失败的返回值是: 0---- ", xhr);
        });
    },
    //显示其他景点的目标定位标签
    scenicLabelsShow: function (locationId,oid) {
        console.log("locationId",locationId);
        var thisLatlng={};
        $.ajax({
            url: sceneClass.configs.apiUrl,
            type: 'GET',
            data: {
                r: 'organization/static',
                fields: 'null',
                expand: 'getLocationList',
                oid: oid
            },
            success:function(resp){
                console.log('获取当前机构下的景区列表成功的返回值是： ------ ', resp);
                if (resp && resp.getLocationList) {
                    var locationLists = resp.getLocationList.data;
                    var nearPanoDom = '',nearPanoName;
                    for(var i = 0; i < locationLists.length; i++){
                        var itemLocation = locationLists[i];
                        if(itemLocation.id == locationId){
                            $("#scenicName").html(itemLocation.name);
                            thisLatlng.lat = JSON.parse(itemLocation.latitude);
                            thisLatlng.lng = JSON.parse(itemLocation.longitude);
                        }
                    }
                    for(var j = 0; j < locationLists.length; j++){
                        //全景视图中的地点标签的显示
                        var thisLocation = locationLists[j];
                        var oSection = document.createElement("section");
                        oSection.className = "location-item";
                        oSection.setAttribute("data-obj-id",thisLocation.id);
                        oSection.setAttribute("data-obj-name",thisLocation.name);
                        oSection.setAttribute("data-obj-type","loc");
                        var div1 = document.createElement("div");
                        div1.className = "left";
                        div1.setAttribute("style","float:left;width:35px;height:35px;line-height:35px;");
                        oSection.appendChild( div1 );
                        var oImg1 = document.createElement("img");
                        oImg1.className = "leftImg";
                        //地点列表logo图片的显示
                        if(thisLocation.logo == "" || thisLocation.logo == null){
                            thisLocation.logo = "../../adminStyles/img/pano/img4.png";
                        };
                        oImg1.src = thisLocation.logo;
                        oImg1.setAttribute("style","width:35px;height:35px;vertical-align: middle;");
                        div1.appendChild( oImg1 );
                        var div2 = document.createElement("div");
                        div2.className = "right";
                        div2.setAttribute("style","float:right;width:85px;height:40px;");
                        oSection.appendChild( div2 );
                        var oTop = document.createElement("div");
                        oTop.className = "topDiv";
                        oTop.setAttribute("style","text-align:center;width:85px;height:20px;line-height:20px;");
                        div2.appendChild( oTop );
                        var oName = document.createElement("span");
                        nearPanoName = thisLocation.name;//底部轮播地点名称的显示
                        if(thisLocation.name.toString().length > 5){
                            thisLocation.name = thisLocation.name.toString().substr(0,5)+"...";
                        }
                        oName.innerHTML = thisLocation.name;
                        oName.className = "oName";
                        oName.setAttribute("style","color:#fff;");
                        oTop.appendChild( oName );
                        var oBottom = document.createElement("div");
                        oBottom.className = "oBottom";
                        oBottom.setAttribute("style","width:85px;height:20px;line-height:20px;text-align: center;");
                        div2.appendChild( oBottom );
                        var oImg3 = document.createElement("img");
                        oImg3.className = "location";
                        oImg3.src = "../../adminStyles/img/pano/pos.png";
                        oImg3.setAttribute("style","width:20px;height:20px;line-height:20px;");
                        oBottom.appendChild( oImg3 );
                        var oSpan = document.createElement("span");
                        oSpan.className = "distance";
                        oSpan.setAttribute("style","height:20px;line-height:20px;color:#fff;");
                        oBottom.appendChild( oSpan );
                        var oImg2 = document.createElement("img");
                        oImg2.className = "iconImg";
                        oImg2.setAttribute("data-panoId",thisLocation.pano_id);
                        oImg2.setAttribute("data-scenicId",thisLocation.id);
                        oImg2.src = "../../adminStyles/img/pano/panoIcon.png";
                        oImg2.setAttribute("style","width:20px;height:20px;vertical-align: middle;");
                        oBottom.appendChild( oImg2 );   
                        var scenicPos={},newPos={},distance;
                        newPos.coord = {};
                        scenicPos.coord = utils.desPointXY1(thisLatlng,{lat:JSON.parse(thisLocation.latitude),lng:JSON.parse(thisLocation.longitude)});
                        distance = utils.calculateLineDistance(thisLatlng,{lat:JSON.parse(thisLocation.latitude),lng:JSON.parse(thisLocation.longitude)});
                        oSpan.innerHTML = parseInt(distance)+"米";
                        newPos.coord.y = utils.desCoordY( thisLatlng.lat, thisLocation.latitude);
                        //console.log("thisName---",thisLocation.name,"thisLatlng.lat---",thisLatlng.lat,"thisLocation.latitude---",thisLocation.latitude,"纬度差值是",newPos.coord.y);
                        // newPos.coord.x = scenicPos.coord.x;
                        // newPos.coord.z = scenicPos.coord.y;
                        //console.log("测试测试测试",utils.desCoordY(39.878102,39.879881));
                        newPos.coord.x = scenicPos.coord.x;
                        newPos.coord.z = -scenicPos.coord.y;//z轴正方向是正北方
                        var stylePos = panoOperation.toScreenPosition(newPos.coord);
                        console.log("thisName---",thisLocation.name,"stylePosstylePos---",stylePos,"coord",newPos.coord);
                        newPos.dom= oSection;
                        panoOperation.scenicArray.push(newPos);
                        //console.log("panoOperation.scenicArraypanoOperation.scenicArray",panoOperation.scenicArray);
                        oSection.setAttribute("style","display:none;padding:5px;width:130px;font-size:12px;position:absolute;top:"+stylePos.top+"px;left:"+stylePos.left+"px;color:#fff;cursor:pointer;background:rgba(0,0,0,0.5);border-radius:6px;"); 
                        document.getElementById("panoContainer").appendChild( oSection );
                        //根据有无全景id，判断是否显示全景icon标签
                        if(thisLocation.pano_id == null || thisLocation.pano_id == undefined || thisLocation.pano_id == ""){
                            $(oImg2).css("display","none");    
                        }
                        //判断是否显示当前地点
                        if(thisLocation.id == locationId){
                            $(oSection).css("visibility","hidden");
                        };
                        //点击全景icon进入相应全景图
                        $(oImg2).bind("click",function(){
                            var eventId = $(this).attr("data-panoId");
                            var scenicId = $(this).attr("data-scenicId");
                            console.log("eventIdeventId",eventId,"----scenicId",scenicId);
                            panoOperation.initPanoScence( eventId,scenicId );//显示全景编辑器
                        });
                        //页面中地点周边的全景图片显示
                        if(thisLocation.pano_id){
                            if(thisLocation.id ==locationId){
                                nearPanoDom+=''; 
                            }else{
                                nearPanoDom+='<div class="swiper-slide">';
                                nearPanoDom+='<a href="javascript:void(0);" data-scenicId="'+thisLocation.id+'"; data-index="'+thisLocation.pano_id+'"; class="pano_photo_item">';
                                nearPanoDom+='<img src="'+thisLocation.logo+'"></img>';
                                nearPanoDom+='<span class="pano_photo_decs">'+nearPanoName+'</span>';
                                nearPanoDom+='</a>';
                                nearPanoDom+='</div>';
                            }   
                        }
                    }
                    $("#nearbyWraper").html(nearPanoDom);
                    //页面底部轮播图的显示
                    var swiper = new Swiper('.swiper-container', {
                        nextButton: '.swiper-button-next',
                        prevButton: '.swiper-button-prev',
                        slidesPerView: 4,
                        paginationClickable: true,
                        spaceBetween: 20,
                    }); 
                    //页面底部周边全景的点击事件
                    $(".swiper-slide a").bind("click",function(){
                        var panoId = $(this).attr("data-index");
                        var scenicId = $(this).attr("data-scenicId");
                        console.log("panoIdpanoId",panoId,"----scenicId",scenicId);
                        panoOperation.initPanoScence( panoId,scenicId );//显示全景编辑器
                    });
                }
            },
            error:function(e){
                console.log("error");
            }
        }) 
    },
    //右侧属性栏改变地点名称和icon属性
    changeScenicPropers:function(scenicId, property, value){
        if(property == "name"){
            console.log("changeName",property);
            $("section[data-obj-id$='"+scenicId+"']").attr('data-obj-name',value);
            $("section[data-obj-id$='"+scenicId+"']").children("div:last-child").children("div:first-child").children('span').html(value);
        }else if(property == "icon"){
            $("section[data-obj-id$='"+scenicId+"']").children("div:first-child").children('img').attr('src',value);
        }
    },
}

export default panoEdit