<template>
	<div class="tree-wrapper">
		<div class="scene-header">
			<div class="title">
				<span>景区</span>
				<span class="switch-btn-wrapper">
					<span class="switch-open"></span>
				</span>
			</div>
			<div class="search-box">
				<input type="text" class="form-control" id="searchLocInput">
				<img src="../../../static/img/search.png"  alt="search" class="search">
				<span class="search-btn" id="searchLocBtn">搜索</span>
				<img src="../../../static/img/plus.png" class="toolbar-mode scan-mode" id="addBaseScene" @click="toggleShowAddNewLocWrap">
			</div>
			
		</div>
		
		<div class="folder-box" v-bind:style="styleObj" id="orglocsList">
			<transition name="fade">
				<div class="add-new-loc-wrap" v-if="isShowAddLocWrap">
					<div class="arrow"></div>
					<div class="title">创建地点</div>
					<div class="content">
						<input type="text" class="form-control" v-model="locName" @enter="addNewLoc" @change="addNewLoc">
						<span class="btn btn-success" @click="addNewLoc">创建</span>
						<span class="btn btn-danger fr" @click="hideAddLocWrap">取消</span>
					</div>
				</div>
			</transition>	
			<ul id="files" class="tree-list">
				<LocItem v-for="(item, index) in locsList" v-bind:model="item" v-bind:key="index"></LocItem>
			</ul>
		</div>
		
	</div>
</template>

<script>
	import '../../assets/style/sass/filetree.scss'
	import { mapActions, mapState, mapGetters } from 'vuex'
	import LocItem  from './LocItem'
	import { actionManager } from '../../store/index'
	import CreateNewLocAction from '../../operActions/actions/CreateNewLocAction'
	
	export default {
	
		created () {
			this.$store.dispatch('getLocationList')
		}, 
		data () {
			return {
				isShowAddLocWrap: false,
				locName: ''
			}
		},
		computed: {
			...mapGetters({
				locsList: 'getLocsList'
			}),
			...mapState({
				activeMode: state => state.curEditMode
			}),
			styleObj () {
				var a =  {
					height: ($(window).height() - $('.scene-header').height() - $('.edit-bottom').height() - 225) + 'px', // 编辑模式下显示了资源栏
					maxHeight: ($(window).height() - $('.scene-header').height() - $('.edit-bottom').height() - 225) + 'px'
				};
			},
			
		},

		components: {
			LocItem,
		},
		methods : {
			// 点击出现新地点创建的tip 框
			toggleShowAddNewLocWrap () {
				this.isShowAddLocWrap = !this.isShowAddLocWrap;
			},

			hideAddLocWrap () {
				this.isShowAddLocWrap = false;
			},

			addNewLoc (event) {
				// 此时的创建是在机构下直接创建, 也就是说parent_id 是0 
				console.log('创建的地点名称是: ----- ', this.locName);
				event.target.blur();
				this.isShowAddLocWrap = false;
				// 执行创建新地点的action
				actionManager.excute(new CreateNewLocAction(this.locsList, this.locName, 0)); // 第三个参数表示的是parent_id

				
			}
		}
	}
</script>