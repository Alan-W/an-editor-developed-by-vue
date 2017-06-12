import { Action } from '../action'
import SubmitObjPropsApis from '../../store/apis/submitObjPropsApi'


// 创建新地点的action
var DragLocToAmapAction =  class DragLocToAmapAction extends Action {
	constructor(dragLocObj, posObj) {

		super( 'DragLocToAmapAction', 'set value');
		this.dragLocObj = dragLocObj;
		this.posObj = posObj;
	}
	

	// undo the action
	excute () {
		
		// 提交删除地点的接口
		// SubmitObjPropsApis.deleteLoc(that.locObj.id);
		this.dragLocObj.longitude = this.posObj.lng;
		this.dragLocObj.latitude = this.posObj.lat;
	}

	// push the DragLocToAmapAction to the actions stacks;
	undo () {

		this.dragLocObj.longitude = null;
		this.dragLocObj.latitude = null;
		// SubmitObjPropsApis.createNewLoc(this.locObj.name, this.locObj.parent_id, this.newLocObj);
	}

	redo () {
		this.excute();
	}
}

export default DragLocToAmapAction;