import axios from 'axios'
import globalConfig from '../store/dataConfig/globalConfig';

var PanoFactory = {
	changeLabelProp:function(labelId, name, value){
		var subData = {}; 
		subData['id'] = labelId;
        subData[name] = value;
        //http://api.scoope.net/?r=panorama-property/static&expand=updatePanoPro
        $.ajax({
            url: globalConfig.apiUrl+'?r=panorama-property/static&expand=updatePanoPro',
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
}

export default PanoFactory