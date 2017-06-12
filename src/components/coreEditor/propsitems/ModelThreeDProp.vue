<template>
	<li class="threed-prop" >
		<div class="props-con-wrapper">
			<span class="props-name">{{ propNameMap[propName] }} </span>
			<div class="props-con">
				<span class="point-name">x</span>
				<input type="number" class="form-control" v-bind:value="Number(xVal)" v-bind:disabled="canEdit" @change="changePropValue('x')" @enter="changePropValue('x')">
				<span class="point-name">y</span>
				<input type="number" class="form-control" v-bind:value="Number(yVal)" v-bind:disabled="canEdit" @change="changePropValue('y')" @enter="changePropValue('y')">
				<span class="point-name">z</span>
				<input type="number" class="form-control" v-bind:value="Number(zVal)" v-bind:disabled="canEdit" @change="changePropValue('z')" @enter="changePropValue('z')">
			
			</div>
		</div>
	</li>
</template>

<script>
	import { mapActions, mapGetters, mapState } from 'vuex'
	import globalConfig from '../../../store/dataConfig/globalConfig'
	import ToolFactory from '../../../coreFactory/ToolFactory'

	const modelDataConfig = {
		position: {x: 0,y: 0, z: 0},
		rotation: {x: 0,y: 0, z: 0},
		scale: {x: 1,y: 1, z: 1},
	}

	export default {
		name: 'ModelThreeDProp',
		props: ['propName', 'propValue', 'objInfo'],
		created () {
			console.log(' 属性是: ----- ', this.propValue);
			console.log(' the objInfo is----- ', this.objInfo);
		},
		data () {
			return {
				propNameMap: globalConfig.propNameMap,
			}
		},
		computed: {
			...mapState ({
				activeMode: state => state.curEditMode,
				curClickObj: state => state.curClickObj,
				toolBarViewState: state => parseInt(state.activeToolbarBtn.viewBtn)
			}),

			xVal() {
				return (this.propValue ? JSON.parse(this.propValue).x: modelDataConfig[this.propName].x) 
			},
			yVal() {
				return (this.propValue ? JSON.parse(this.propValue).y : modelDataConfig[this.propName].y)
			},
			zVal() { 
				return (this.propValue ? JSON.parse(this.propValue).z : modelDataConfig[this.propName].z)
			},

			canEdit() {
				return (this.toolBarViewState == 2 ? false : 'disabled')
			} 
		},

		methods: {
			...mapActions([
				'changeEditBoard'
			]),

			changePropValue (type) {
				// vue 事件中不用传递参数event
				event.target.blur();
				console.log(' the type is : ------ ', type);
				var changeValue = this.propValue ? JSON.parse(this.propValue) : {x: 0, y: 0, z: 0};
				changeValue[type] = event.target.value;
				if (this.propName == 'scale') { // 缩放比目前是等比缩放
					changeValue.x = event.target.value;
					changeValue.y = event.target.value;
					changeValue.z = event.target.value;
				}
				
				console.log(' the originProps is : ----- ', changeValue);

				console.log('当前的编辑模式是: ----- ', this.activeMode);
				var dispatchName = 'changeRolePropIn'+ ToolFactory.firstUpperCase(this.activeMode);
				console.log(' the dispatch name is : ----- ', dispatchName);
				console.log('当前场景中选中的对象是: ----- ', this.curClickObj);
				// 当前呈现物被绑定的标志物的ID
				var thisRoleHasBoundIdenfityID = (this.curClickObj.clickType == 'identify') ? this.curClickObj.id : null;

				// 触发提交模型数据
				this.$store.dispatch(dispatchName, {
					editObj: this.objInfo,
					newValue: JSON.stringify(changeValue),
					editPropType: this.propName,
					changeValueType: type, // 对于三维属性, 当前修改的属性类型(x/y/z)
					thisRoleHasBoundIdenfityID: thisRoleHasBoundIdenfityID,
				})
			}
		}
	}
</script>