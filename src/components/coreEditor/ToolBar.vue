<template>
	<header class="edit-head"> 
		<ul class="nav-bar">
			<li v-for="(btn, index) in btns" v-bind:class="btnItemClass(btn)" v-if="btn.isShow || btn.showCon.indexOf(activeMode) !== -1 ">
				<span class="btnlink" @click="changeToolBtnActive(btn)">
					<img v-bind:src="imgPath(index)">
					<span class="nav-btn-name">{{ btn.name }}</span>
				</span>
			</li>
		</ul>
	</header>
	
</template>

<script>
	import "../../assets/style/sass/toolbar.scss";
	import { mapActions, mapGetters, mapState } from 'vuex'
	import globalConfig from '../../store/dataConfig/globalConfig'

	import { actionManager } from '../../store/index'
	console.log(' the actionManager is : ------ ', actionManager);

	let ToolBarConfig = {
		look: {
			name: '查看',
			hasBorder: false,
			value: 1,
			type: 'viewBtn',
			isShow: true,
		},
		edit: {
			name: '编辑',
			hasBorder: false,
			value: 2,
			type: 'viewBtn',
			isShow: true,
		},
		test: {
			name: '测试',
			hasBorder: false,
			value: 3,
			type: 'viewBtn',
			isShow: true,
		},
		copy: {
			name: '复制',
			hasBorder: true,
			value: 4,
			type: 'operBtn',
			isShow: true,
		},
		cute: {
			name: '剪切',
			hasBorder: false,
			value: 5,
			type: 'operBtn',
			isShow: true,
		},
		paste: {
			name:'粘贴',
			hasBorder: false,
			value: 6,
			type: 'operBtn',
			isShow: true,
		},
		undo: {
			name: '撤销',
			hasBorder: true,
			value: 6,
			type: 'historyBtn',
			isShow: true,
		},
		redo: {
			name: '重做',
			value: 7,
			type: 'historyBtn',
			isShow: true,
		},
		createModel: {
			name: '创建',
			hasBorder: true,
			value: 8,
			type: 'modelBtn',
			showCon: '3DmapEditor'
		},
		translate: {
			name: '位移',
			ename: 'translate',
			hasBorder: false,
			value: 9,
			type: 'modelBtn',
			showCon: 'modelEditorOr3DmapEditor',
			isShow: false,
		},
		rotate: {
			name: '旋转',
			ename: 'rotate',
			hasBorder: false,
			value: 10,
			type: 'modelBtn',
			showCon: 'modelEditorOr3DmapEditor',
			isShow: false,
		},
		scale: {
			name: '缩放',
			ename: 'scale',
			hasBorder: false,
			value: 11,
			type: 'modelBtn',
			showCon: 'modelEditorOr3DmapEditor',
			isShow: false,
		},
		createText: {
			name: '创建',
			hasBorder: true,
			value: 12,
			type: 'panoBtn',
			showCon: 'panoEditor',
			isShow: false,
		},
		passThrough: {
			name: '穿越',
			hasBorder: false,
			value: 13,
			type: 'panoBtn',
			showCon: 'panoEditor',
			isShow: false,
		},
	}

	export default {
		data () {
			return {
				btns: ToolBarConfig,
			}
		},
		computed: {
			...mapState({
				activeMode: state => state.curEditMode,
				curActiveBtnInfo: state => state.activeToolbarBtn
			}),
		},
		methods: {
			changeToolBtnActive (btn) {
				console.log(' the btn is : ------ ', btn);
				console.log(' this is : ----- ', this);
				// 根据类型执行不同的函数
				this[btn.type+'ModeChange'] && this[btn.type+'ModeChange'](btn.value);
				this.$store.dispatch('changeToolbarActiveState', btn);
			},
			
			btnItemClass (btn) {
				return {
					'has-border': btn.hasBorder,
					'item-active': btn.value == this.curActiveBtnInfo[btn.type]
				}
			},
			imgPath (type) {
				return (globalConfig.imgLoadPath +type+'.png')
			},
			// 点击history 的action
			historyBtnModeChange (newValue) {
				newValue == 6 ? actionManager.undo() : actionManager.redo();
			},

			// 点击位移，缩放, 旋转按钮
			modelBtnModeChange (newValue) {

				// 设置当前场景中的控制器的模式
				globalConfig.modelScene.setCurCtrlMode(parseInt(newValue));
			}

		}
	}
</script>