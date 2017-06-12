import {Action} from '../action'
import SubmitObjPropsApis from '../../store/apis/submitObjPropsApi'


// 设置该机构涉及经纬度两个点的数据
var SetOrgDoublePropDataAction = class SetOrgDoublePropDataAction extends Action {
	constructor(object, newValue, propType) {

		super( 'SetOrgDoublePropDataAction', 'set value');
		this.object = object; //  当前修改的对象
		this.newValue = newValue; // 编辑器中用的地图属性都是被处理过的对象
		this.oldValue = this.object[propType]; // 编辑器中用的地图属性都是被处理过的对象
		this.propType = propType;
		console.log('当前传递的新数据是: ---- ', this.newValue);
		console.log('修改机构范围数据的就数据是: ---- ', this.oldValue);
	}

	// push the SetOrgDoublePropDataAction to the actions stacks;
	excute () {
		this.object[this.propType] = this.newValue;
		SubmitObjPropsApis.submitMapProps(this.object.id, this.propType, JSON.stringify(this.newValue));
	}

	// undo the action
	undo () {
		this.object[this.propType] = this.oldValue;
		SubmitObjPropsApis.submitMapProps(this.object.id, this.propType, JSON.stringify(this.oldValue));
	}

	redo () {
		this.excute();
	}
}

export default SetOrgDoublePropDataAction;

