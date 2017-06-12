import { Action } from '../action'
import SubmitObjPropsApis from '../../store/apis/submitObjPropsApi'

// set base prop value action extend the Action class
var SetLocPosAction = class SetLocPosAction extends Action {
	constructor(object, newValue, posType, tempMarkerPos) {
		super( 'setLocPposAction', 'set value');
		this.object = object;
		this.newValue = newValue;
		this.posType = posType; // 从属性栏更改的时候是单独更改经度或者是纬度, 但是直接从地图上拖拽操作的时候是同时更改两个属性值的
		this.oldValue = posType ? this.object[posType] : {lng: tempMarkerPos.longitude, lat: tempMarkerPos.latitude};
	}

	// push the setLocPposAction to the actions stacks;
	excute () {
		if (this.posType) { // 单独修改的经度或者是纬度
			this.object[this.posType] = this.newValue;
			SubmitObjPropsApis.submitLocProps(this.object.id, this.posType, this.newValue);
		} else { //地图上直接拖拽修改的
			this.object.longitude = this.newValue.lng;
			this.object.latitude = this.newValue.lat;
			SubmitObjPropsApis.submitLocProps(this.object.id, 'longitude', this.newValue.lng);
			SubmitObjPropsApis.submitLocProps(this.object.id, 'latitude', this.newValue.lat);
		}
		
	}


	// undo the action
	undo () {

		if (this.posType) { // 单独修改的经度或者是纬度
			this.object[this.posType] = this.oldValue;
			SubmitObjPropsApis.submitLocProps(this.object.id, this.posType, this.oldValue);
		} else { //地图上直接拖拽修改的
			this.object.longitude = this.oldValue.lng;
			this.object.latitude = this.oldValue.lat;
			SubmitObjPropsApis.submitLocProps(this.object.id, 'longitude', this.oldValue.lng);
			SubmitObjPropsApis.submitLocProps(this.object.id, 'latitude', this.oldValue.lat);
		}
		
	}

	redo () {
		this.excute();
	}

}

export default SetLocPosAction;
