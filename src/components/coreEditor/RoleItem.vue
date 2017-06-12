<template>
	<li>
		<a href="javascript:void(0)" class="model event-item" v-bind:class="roleTypeClass" @click="changeClickRoleObj(formatNewModel)">
			<span class="fa"></span>
			<span class="txt"> {{ model && model.title }} </span>
			<img src="../../../static/img/delete.png"  alt="delete" class="deletebtn" v-on:click.stop.prevent="delteBoundRoleInstance">
		</a>
	</li>
</template>

<script>
	import { mapActions, mapState, mapGetters } from 'vuex'
	import globalConfig from '../../store/dataConfig/globalConfig'
	import { actionManager } from '../../store/index' 
	import ClickRoleInstanceAction from '../../operActions/actions/ClickRoleInstanceAction'
	import DeleteBoundLBSRoleInstanceAction from '../../operActions/actions/DeleteBoundLBSRoleInstanceAction'

	export default {
		name: 'RoleItem',
		props: ['model', 'bindLoc'],
		computed: {
			
			...mapState({
				curClickObj: state => state.curClickObj
			}),
			roleTypeClass () {
				return {
					'model-role': this.model && parseInt(this.model.type) == 1,
					'video-role': this.model && parseInt(this.model.type) == 2,
					'baike-role': this.model && parseInt(this.model.type) == 3,
					'drag-active': this.curClickObj && this.model.bind_id === this.curClickObj.bind_id
				}
			},
			formatNewModel () {
				this.model.clickType = globalConfig.roleTypeMap[parseInt(this.model.type)]+'Role';
				return this.model;	
			},

		},
		methods: {
			
			changeClickRoleObj (curRole) {
				// 修改当前选中的对象
				actionManager.excute(new ClickRoleInstanceAction(this.curClickObj, curRole));
			},

			// 删除已经绑定的呈现物, 这里的呈现物肯定是LBS 类型的，因为左侧俩表已经不显示标志物绑定的呈现物了
			delteBoundRoleInstance () {

				// 执行删除的绑定LBS 呈现物的Action
				actionManager.excute(new DeleteBoundLBSRoleInstanceAction(this.model, this.bindLoc));
			}
		}

	}
</script>