<template>
	<section class="scoope-cloud">
		<section class="edit-wrap">
			<div id="index" >
				<ToolBar></ToolBar>
				<div class="edit-left clearfix" v-if="activeMode!=='panoEditor' ">
					<FileTree></FileTree>	
				</div>			
			</div>
			
		</section>

		<div class="sceneul" v-if="activeMode !== 'modelEditor'">
			<p class="mode-item" v-bind:class="{active: activeMode == '2DmapEditor'}" @click="changeEditBoard('2DmapEditor')">2D</p>
			<p class="mode-item" v-bind:class="{active: activeMode == '3DmapEditor'}" @click="changeEditBoard('3DmapEditor')">3D</p>
			<p class="mode-item disabled" v-bind:class="{active: activeMode == 'panoEditor'}" @click="changeEditBoard('panoEditor')">全</p>
		</div>
		<PropsWrap></PropsWrap>
		<AMapComponent v-show="activeMode=='2DmapEditor'"></AMapComponent>
		<ThreeDMapEditor v-if="activeMode=='3DmapEditor'"></ThreeDMapEditor>
		<PanoEditor v-if="activeMode=='panoEditor'"></PanoEditor>
		<AssertBoard v-show="activeMode !== 'panoEditor' && activeMode !== '3DmapEditor' && activeViewBtn == '2' "></AssertBoard>
		<ModelEditorComponent v-show="activeMode == 'modelEditor'"></ModelEditorComponent>
		<MaterialBoard></MaterialBoard>
		<ErrorTip v-if="errorData"></ErrorTip>
	</section>
</template>


<script>
	import "./assets/style/sass/_common.scss"
	import "./assets/style/font-awesome-4.7.0/scss/font-awesome.scss"
	import { mapActions, mapGetters, mapState } from 'vuex'
	
	import ToolBar from './components/coreEditor/ToolBar'
	import FileTree from './components/coreEditor/FileTree'
	import ThreeDMapEditor from './components/3DmapEditor/index'
	import PanoEditor from './components/panoEditor/index'
	import PropsWrap from './components/coreEditor/PropsWrap'
	import AMapComponent from './components/2DmapEditor/AmapComponent'
	import AssertBoard from './components/assertsBoard/AssertBoard'
	import ModelEditorComponent from './components/modelEditor/ModelEditorComponent'
	import ErrorTip from './components/coreEditor/ErrorTip'
	import MaterialBoard from './components/coreEditor/material/MaterialBoard'

	export default {
		components: {
			ToolBar,
			FileTree,
			ThreeDMapEditor,
			PanoEditor,
			PropsWrap,
			AMapComponent,
			AssertBoard,
			ModelEditorComponent,
			ErrorTip,
			MaterialBoard
		},

		computed: {
			...mapState ({
				activeMode: state => state.curEditMode,
				activeViewBtn: state => state.activeToolbarBtn.viewBtn,
				errorData: state => state.errorInfoObj
			})
		},

		methods: {
			...mapActions([
				'changeEditBoard',
			]),
		}
	}
</script>