<template>
	<div>
		<div id="canvas-frame"></div>
		<div id="fixed-canvas"></div>
		<div class="sceneul" v-if="curClickObj && curClickObj.clickType == 'identify'">
			<p class="mode-item">2D</p>
			<p class="mode-item">3D</p>
		</div>
		<!-- 当前点击的标志物绑定的呈现物的列表 -->
		<div class="identifiers-bind-list" v-if="curClickObj && curClickObj.clickType == 'identify'">
			<ul class="list-group">
				<li class="list-group-item list-group-item-success" v-for="(role, index) in curClickObj.roles">
					<a href="javascript:void(0)" class="event-item">
						<span class="txt">{{ role.title }}</span>
						<img v-bind:src="delImg" class="deletebtn" v-on:click.stop.prevent="deleteIdentifyBindRoleInstance(role)">
					</a>
				</li>	
			</ul>
		</div>
	</div>
</template>

<script>
	
	import { mapActions, mapState, mapGetters } from 'vuex'
	import globalConfig  from '../../store/dataConfig/globalConfig'
	import Scene from './Scene'
	import {actionManager} from '../../store/index'
	import DeleteIdentifyBoundRoleInstanceAction from '../../operActions/actions/DeleteIdentifyBoundRoleInstanceAction'

	export default {
		mounted () {
			// 初始化场景
			globalConfig.modelScene = new Scene({
				"container": document.getElementById('canvas-frame'),
				"coordContainer": document.getElementById('fixed-canvas'),
			});

			globalConfig.modelScene.init();
		},
		data () {
			return {
				delImg: globalConfig.imgLoadPath + 'delete.png'
			}
		},
		computed: {
			...mapState({
				curClickObj: state => state.curClickObj,
				idenfityActiveState: state => state.identifyActiveMode, 
			}),
			
		},
		methods: {
			// 点击删除标志物绑定的呈现物实例
			deleteIdentifyBindRoleInstance (role) {
				console.log('点击删除当前标志物绑定的呈现物');
				actionManager.excute(new DeleteIdentifyBoundRoleInstanceAction(role, this.curClickObj));
			}
		}
	}
</script>