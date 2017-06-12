import { Action } from '../action'
import SubmitObjPropsApis from '../../store/apis/submitObjPropsApi'
import globalConfig from '../../store/dataConfig/globalConfig'
import ToolFactory from '../../coreFactory/ToolFactory'

// 模型编辑器位移数据修改
var SetRoleRotationInModelEditorAction = class SetRoleRotationInModelEditorAction extends Action {
	constructor(object, newValue, boundIdentifyID, changeValueType, isCtrlOper) {
		super( 'SetRoleProtationnModelEditorAction', 'set value');
		this.object = object || null; //  当前更改的模型对象
		this.newRotation = newValue;
		this.oldRotation = this.object.property && this.object.property.rotation ? this.object.property.rotation : JSON.stringify({x: 0, y: 0, z: 0});
		// 去获取场景中的模型
		this.roleModelInfo = globalConfig.modelScene.getRoleModelByUuid(this.object.id);
		// 当前呈现物绑定过的类型
		this.roleBindType = this.object.clickType ? 1 : 2;
		// 当前呈现物被绑定的标志物的ID (如果是LBS 类型的,此值为null)
		this.boundIdentifyID = boundIdentifyID;
		// 修改的是哪一个轴上的数据
		this.changeValueType = changeValueType;  
		// 当前的修改是控制器操作的还是属性栏手动更改的
		this.isCtrlOper = isCtrlOper;
	}

	// push the setMarkerPposAction to the actions stacks;
	excute () {
		if (!this.isCtrlOper) { // 属性栏操作的
			this.object.property.rotation = this.newRotation; // 这里都没有转化，全部都是json串

			// 向后台提交呈现物的三维属性数据
			if (this.roleBindType == 1) { // LBS 呈现物
				SubmitObjPropsApis.submitLBSRoleThreedProps(this.object.bind_id, 'rotation', this.newRotation);
			} else if (this.roleBindType == 2) { // 标志物绑定的呈现物
				SubmitObjPropsApis.submitIdentifyBindRoleThreedProps(this.boundIdentifyID, this.object.id, 'rotation', this.newRotation);
			}

			// 操作场景中的模型
			// three 中的旋转数据用的是弧度制
			var modelUseData = this.roleModelInfo.model.rotation;
		
			modelUseData[this.changeValueType] = ToolFactory.covertAngleToRadians(JSON.parse(this.newRotation)[this.changeValueType]);
			console.log('3D模型使用的旋转数据是: ----- ', modelUseData);
			this.roleModelInfo.model && this.roleModelInfo.model.rotation.copy( modelUseData );
			this.roleModelInfo.model && this.roleModelInfo.model.updateMatrixWorld( true );
			this.roleModelInfo.ctrl && this.roleModelInfo.ctrl.update();

		} else { // 控制器操作的
			// 那么当前传入的新数据是弧度制的, 并且是json对象
			var formatData = {
				x: Math.round(ToolFactory.covretRadiansToAngle(this.newRotation.x)),
				y: Math.round(ToolFactory.covretRadiansToAngle(this.newRotation.y)),
				z: Math.round(ToolFactory.covretRadiansToAngle(this.newRotation.z)),
			};
			console.log('控制器操作的旋转数据是: ----- ', formatData);
			this.object.property.rotation = JSON.stringify(formatData);
			this.roleModelInfo.model && this.roleModelInfo.model.rotation.copy( this.newRotation );
			this.roleModelInfo.model && this.roleModelInfo.model.updateMatrixWorld( true );
			this.roleModelInfo.ctrl && this.roleModelInfo.ctrl.update();

			// 向后台提交呈现物的三维属性数据
			if (this.roleBindType == 1) { // LBS 呈现物
				SubmitObjPropsApis.submitLBSRoleThreedProps(this.object.bind_id, 'rotation', JSON.stringify(formatData));
			} else if (this.roleBindType == 2) { // 标志物绑定的呈现物
				SubmitObjPropsApis.submitIdentifyBindRoleThreedProps(this.boundIdentifyID, this.object.id, 'rotation', JSON.stringify(formatData));
			}
		}
		
	}


	// undo the action
	undo () {

		this.object.property.rotation = this.oldRotation; // 这里都没有转化，全部都是json串

		if (!this.isCtrlOper) {
				// 设置当前的数据对象的旋转至是角度制
			
			// 向后台提交呈现物的三维属性数据
			if (this.roleBindType == 1) { // LBS 呈现物
				SubmitObjPropsApis.submitLBSRoleThreedProps(this.object.bind_id, 'rotation', this.oldRotation);
			} else if (this.roleBindType == 2) { // 标志物绑定的呈现物
				SubmitObjPropsApis.submitIdentifyBindRoleThreedProps(this.boundIdentifyID, this.object.id, 'rotation', this.oldRotation);
			}

			// 操作场景中的模型
			// three 中的旋转数据用的是弧度制
			var modelUseData = this.roleModelInfo.model.rotation;
		
			modelUseData[this.changeValueType] = ToolFactory.covertAngleToRadians(JSON.parse(this.oldRotation)[this.changeValueType]);
			console.log('3D模型使用的旋转数据是: ----- ', modelUseData);
			this.roleModelInfo.model && this.roleModelInfo.model.rotation.copy( modelUseData );
			this.roleModelInfo.model && this.roleModelInfo.model.updateMatrixWorld( true );
			this.roleModelInfo.ctrl && this.roleModelInfo.ctrl.update();
		} else {
			console.log('旧的旋转数据是: ----- ', this.oldRotation);
			// 那么当前传入的新数据是弧度制的，并且是json对象
			var formatData = {
				x: ToolFactory.covertAngleToRadians(JSON.parse(this.oldRotation).x),
				y: ToolFactory.covertAngleToRadians(JSON.parse(this.oldRotation).y),
				z: ToolFactory.covertAngleToRadians(JSON.parse(this.oldRotation).z),
			};
			console.log('aaaaa控制器操作的旋转数据是: ----- formatData: ', formatData);
			this.object.property.rotation = this.oldRotation;

			this.roleModelInfo.model && this.roleModelInfo.model.rotation.set( formatData.x,formatData.y, formatData.z );
			this.roleModelInfo.model && this.roleModelInfo.model.updateMatrixWorld( true );
			this.roleModelInfo.ctrl && this.roleModelInfo.ctrl.update();

			// 向后台提交呈现物的三维属性数据
			if (this.roleBindType == 1) { // LBS 呈现物
				SubmitObjPropsApis.submitLBSRoleThreedProps(this.object.bind_id, 'rotation', this.oldRotation);
			} else if (this.roleBindType == 2) { // 标志物绑定的呈现物
				SubmitObjPropsApis.submitIdentifyBindRoleThreedProps(this.boundIdentifyID, this.object.id, 'rotation', this.oldRotation);
			}
		}
		 
		
	}

	redo () {
		this.excute();
	}

}

export default SetRoleRotationInModelEditorAction;
