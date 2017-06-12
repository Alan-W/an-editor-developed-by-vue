$(document).ready(function(){
    //查看模式下添加div禁止右侧属性操作
    var maskLayer = document.createElement("div");
    maskLayer.className = "maskLayer";
    maskLayer.setAttribute("style"," display:none;position: absolute;top: 50px;left: 0;width:300px;height:500px;z-index:33;cursor: not-allowed;");
    document.getElementsByClassName("list-wrap")[0].appendChild( maskLayer );
    //进入后创建文本按钮
    var creatText = document.createElement("li");
    creatText.id = "creatText";
    creatText.style.display = "none";
    creatText.innerHTML = '<a href="javascript:void(0)">'
                      +'<img src="../adminStyles/img/pano/text.png"/>'
                      +'<span class="nav-btn-name">创建</span>'
                      +'</a>';
    var arrowBtn = document.createElement("li");
    arrowBtn.id = "arrowBtn";
    arrowBtn.style.display = "none";
    arrowBtn.innerHTML = '<a href="javascript:void(0)">'
                      +'<img src="../adminStyles/img/pano/arrow.png"/>'
                       +'<span class="nav-btn-name">穿越</span>'
                      +'</a>';
    document.getElementsByClassName("nav-bar")[0].appendChild( creatText ); 
    document.getElementsByClassName("nav-bar")[0].appendChild( arrowBtn );                 
    creatText.addEventListener("click",function(){
        if($(this).hasClass("active")){
            creatText.className = ""; 
            arrowBtn.className = "active";  
        }else{
            arrowBtn.className = "";
            creatText.className = "active"; 
        }
    });  
    arrowBtn.addEventListener("click",function(){
        if($(this).hasClass("active")){
            arrowBtn.className = ""; 
            creatText.className = "active";  
        }else{
            arrowBtn.className = "active"; 
            creatText.className = "";   
        }
    });
    //显示地点标签的开关按钮点击事件
    $('#turnoffLabel').click(function(event) {
        if($(this).hasClass('hideLabel')){
            $(this).children('span').css({"float":"right","background-color":"#00B7EE"});
            $(this).removeClass("hideLabel");
            $(".location-item").css('display','block');//显示目标定位标签
        }else{
            $(this).children('span').css({"float":"left","background-color":"#ccc"});
            $(this).addClass("hideLabel");
            $(".location-item").css('display','none');//编辑模式下隐藏目标定位标签
        }   
    });
          
});