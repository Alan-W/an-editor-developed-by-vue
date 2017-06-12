import {Action} from '../action'
import SubmitObjPropsApis from '../../store/apis/submitObjPropsApi'


// 设置地图名称属性的Action
var SetMapNameAction = class SetMapNameAction extends Action {
	constructor(object, newName) {

		super( 'SetMapNameAction', 'set value');
		this.object = object; //  当前修改的对象
		this.newName = newName;
		this.oldType = this.object.name;
	}

	// push the SetMapNameAction to the actions stacks;
	excute () {
		this.object.name = this.newName;
		SubmitObjPropsApis.submitMapProps(this.object.id, 'name', this.newName);
	}

	// undo the action
	undo () {
		this.object.name = this.oldType;
		SubmitObjPropsApis.submitMapProps(this.object.id, 'name', this.oldType);
	}

	redo () {
		this.excute();
	}

}

export default SetMapNameAction;