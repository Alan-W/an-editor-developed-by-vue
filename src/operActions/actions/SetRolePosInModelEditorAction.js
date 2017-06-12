import { Action } from '../action'
import SubmitObjPropsApis from '../../store/apis/submitObjPropsApi'
import globalConfig from '../../store/dataConfig/globalConfig'

// 模型编辑器位移数据修改
var SetRolePosInModelEditorAction = class SetRolePosInModelEditorAction extends Action {
	constructor(object, newValue, boundIdentifyID) {
		super( 'SetRolePosInModelEditorAction', 'set value');
		this.object = object || null; //  当前更改的模型对象
		this.newPos = newValue;
		this.oldPos = this.object.property && this.object.property.position ? this.object.property.position : JSON.stringify({x: 0, y: 0, z: 0});
		// 去获取场景中的模型
		this.roleModelInfo = globalConfig.modelScene.getRoleModelByUuid(this.object.id);
		// 当前呈现物绑定过的类型
		this.roleBindType = this.object.clickType ? 1 : 2;
		// 当前呈现物被绑定的标志物的ID (如果是LBS 类型的,此值为null)
		this.boundIdentifyID = boundIdentifyID;
	}

	// push the setMarkerPposAction to the actions stacks;
	excute () {
		this.object.property.position = this.newPos; // 这里都没有转化，全部都是json串

		// 向后台提交呈现物的三维属性数据
		if (this.roleBindType == 1) { // LBS 呈现物
			SubmitObjPropsApis.submitLBSRoleThreedProps(this.object.bind_id, 'position', this.newPos);
		} else if (this.roleBindType == 2) { // 标志物绑定的呈现物
			SubmitObjPropsApis.submitIdentifyBindRoleThreedProps(this.boundIdentifyID, this.object.id, 'position', this.newPos);
		}

		// 操作场景中的模型
		this.roleModelInfo.model && this.roleModelInfo.model.position.copy( JSON.parse(this.newPos) );
		this.roleModelInfo.model && this.roleModelInfo.model.updateMatrixWorld( true );
		this.roleModelInfo.ctrl && this.roleModelInfo.ctrl.update();
	}


	// undo the action
	undo () {
		
		this.object.property.position = this.oldPos; // 这里都没有转化，全部都是json串

		// 向后台提交呈现物的三维属性数据
		if (this.roleBindType == 1) { // LBS 呈现物
			SubmitObjPropsApis.submitLBSRoleThreedProps(this.object.bind_id, 'position', this.oldPos);
		} else if (this.roleBindType == 2) { // 标志物绑定的呈现物
			SubmitObjPropsApis.submitIdentifyBindRoleThreedProps(this.boundIdentifyID, this.object.id, 'position', this.oldPos);
		}

		// 操作场景中的模型
		this.roleModelInfo.model && this.roleModelInfo.model.position.copy( JSON.parse(this.oldPos) );
		this.roleModelInfo.model && this.roleModelInfo.model.updateMatrixWorld( true );
		this.roleModelInfo.ctrl && this.roleModelInfo.ctrl.update();
	}

	redo () {
		this.excute();
	}

}

export default SetRolePosInModelEditorAction;
