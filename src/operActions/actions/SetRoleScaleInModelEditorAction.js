import { Action } from '../action'
import SubmitObjPropsApis from '../../store/apis/submitObjPropsApi'
import globalConfig from '../../store/dataConfig/globalConfig'

// 模型编辑器位移数据修改
var SetRoleScaleInModelEditorAction = class SetRoleScaleInModelEditorAction extends Action {
	constructor(object, newValue, boundIdentifyID) {
		super( 'SetRolePScalenModelEditorAction', 'set value');
		this.object = object || null; //  当前更改的模型对象
		this.newScale = newValue;
		this.oldScale = this.object.property && this.object.property.scale ? this.object.property.scale : JSON.stringify({x: 1, y: 1, z: 1});
		// 去获取场景中的模型
		this.roleModelInfo = globalConfig.modelScene.getRoleModelByUuid(this.object.id);
		// 当前呈现物绑定过的类型
		this.roleBindType = this.object.clickType ? 1 : 2;
		// 当前呈现物被绑定的标志物的ID (如果是LBS 类型的,此值为null)
		this.boundIdentifyID = boundIdentifyID;
	}

	// push the setMarkerPposAction to the actions stacks;
	excute () {
		this.object.property.scale = this.newScale; // 这里都没有转化，全部都是json串

		// 向后台提交呈现物的三维属性数据
		if (this.roleBindType == 1) { // LBS 呈现物
			SubmitObjPropsApis.submitLBSRoleThreedProps(this.object.bind_id, 'scale', this.newScale);
		} else if (this.roleBindType == 2) { // 标志物绑定的呈现物
			SubmitObjPropsApis.submitIdentifyBindRoleThreedProps(this.boundIdentifyID, this.object.id, 'scale', this.newScale);
		}

		// 操作场景中的模型
		this.roleModelInfo.model && this.roleModelInfo.model.scale.copy( JSON.parse(this.newScale) );
		this.roleModelInfo.model && this.roleModelInfo.model.updateMatrixWorld( true );
		this.roleModelInfo.ctrl && this.roleModelInfo.ctrl.update();
	}


	// undo the action
	undo () {
		
		console.log(' the old scale is : ----- ', this.oldScale);
		this.object.property.scale = this.oldScale; // 这里都没有转化，全部都是json串

		// 向后台提交呈现物的三维属性数据
		if (this.roleBindType == 1) { // LBS 呈现物
			SubmitObjPropsApis.submitLBSRoleThreedProps(this.object.bind_id, 'scale', this.oldScale);
		} else if (this.roleBindType == 2) { // 标志物绑定的呈现物
			SubmitObjPropsApis.submitIdentifyBindRoleThreedProps(this.boundIdentifyID, this.object.id, 'scale', this.oldScale);
		}

		// 操作场景中的模型
		this.roleModelInfo.model && this.roleModelInfo.model.scale.copy( JSON.parse(this.oldScale) );
		this.roleModelInfo.model && this.roleModelInfo.model.updateMatrixWorld( true );
		this.roleModelInfo.ctrl && this.roleModelInfo.ctrl.update();
	}

	redo () {
		this.excute();
	}

}

export default SetRoleScaleInModelEditorAction;
