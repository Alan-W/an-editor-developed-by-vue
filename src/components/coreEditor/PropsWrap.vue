<template>
	<section class="props-wrap" v-bind:style="styleObj">
		<div class="props-header">
			<p class="title">属性</p>
			<span class="switch-btn-wrapper" id="rightSwitchOpen">
				<span class="switch-open"></span>
			</span>
		</div>
		
		<section class="list-wrap" v-if="curClickObj">
			<PropItemsWrap v-bind:objProps="formatObjData" :objType="formatObjData.clickType"></PropItemsWrap>
			<!-- 根据点击的类型, 去显示不同对象的属性 -->

			<!-- 当前点击的是地点并且在3d 模式下显示LBS模型呈现物属性的模块 -->
			<PropItemsWrap v-if="formatObjData && formatObjData.locationRoles && formatObjData.locationRoles.length > 0 && activeMode =='3DmapEditor' && loopObjProps.type == '1' " v-for="(loopObjProps, index) in formatObjData.locationRoles"  :objProps="loopObjProps" :objType="roleTypeMap[parseInt(loopObjProps.type)]+'Role'" :key="index" ></PropItemsWrap>
			
			<!-- 当前点击的是标志物, 并且处于2D地图模式, 遍历当前标志物下的所有呈现物的属性 -->
			<PropItemsWrap v-if="formatObjData && formatObjData.roles && formatObjData.roles.length > 0" v-for="(idRoleloopObjProps, idRoleIndex) in formatObjData.roles"  :objProps="idRoleloopObjProps" :objType="roleTypeMap[parseInt(idRoleloopObjProps.type)]+'Role'" :key="idRoleIndex" ></PropItemsWrap>
		</section>

		<!-- 进入全景编辑器时属性栏的操作按钮 -->
		<div class="pano-oper-wrap" v-if="activeMode == 'panoEditor' && curClickObj && curClickObj.clickType === 'loc'">
			<button class="btn btn-success">重设视角方位</button>
			<button class="btn btn-warning">回到初始方位</button>
		</div>
		
	</section>

</template>

<script>
	import '../../assets/style/sass/props.scss' 

	import PropItemsWrap from './PropItemsWrap'
	import { mapActions, mapGetters, mapState } from 'vuex'
	import globalConfig from '../../store/dataConfig/globalConfig'

	export default {
		data () {
			return {
				roleTypeMap: globalConfig.roleTypeMap
			}
		},
		components: {
			PropItemsWrap,
		},

		computed: {
			...mapGetters({
				curActiveObj: 'getCurClickObj'
			}),
			...mapState({
				activeMode: state => state.curEditMode,
				curClickObj: state => state.curClickObj
			}),
			styleObj() {
				return {
					height: $(window).height() + 'px',
					maxHeight: $(window).height() + 'px',
				}
			},
			formatObjData () {
				// 主要是为了把标志物的scale 属性换掉
				var formatData = {};
				if (this.curClickObj.clickType == 'identify') {
					for (var p in this.curClickObj) {
						if (p !== 'scale') {
							formatData[p] = this.curClickObj[p];
						} else formatData.aspect = this.curClickObj.scale;
						
					}
				} else formatData = this.curClickObj
				return formatData;
			}
		},

		methods: {
			...mapActions([
				'getCurClickObj'
			]),
		}
	}
</script>