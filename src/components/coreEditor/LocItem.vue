<!-- 地点类型的文件树-->
<template id="LocItem">
	<li class="layer" v-bind:class="operTreeClass" :key="this.model.id">
		<a href="javascript:void(0)" v-bind:class="locClassObj" v-on:click.stop.prevent="changeCurActiveLocObj(formatNewModel, activeMode)">
			<span class="fa fa-plus-square"></span>
			<span class="txt">{{ locName() }}</span>
			<img class="add-loc-ing" v-bind:src="imgPath('add-loc')" v-on:click.stop.prevent="showAddNewLocWrap">
			<img class="edit-ing" v-bind:src="imgPath('pencile')" v-on:click.stop.prevent="showEditLocNameWrap">
			<img class="delte-loc-ing" v-bind:src="imgPath('delte-loc')" v-on:click.stop.prevent="deleteLoc">
			<p class="edit-loc-wrap" v-bind:style="{display: this.showEditNameBlock}" v-bind:class="{'edit-loc-show': this.isShowEditLocName}">
				<input class="edit-input form-control" type="text" v-model="editLocNewName" v-on:change.stop.prevent="changeLocName" v-on:enter.stop.prevent="changeLocName"> 
				<img class="edit-cancel" v-bind:src="imgPath('delete')" v-on:click.stop.prevent="hideEditLocNameWrap"> 
				<img class="edit-ok" v-bind:src="imgPath('save')" v-on:click.stop.prevent="changeLocName">
			</p>
			<p class="add-loc-wrap" v-bind:style="{display: this.showAddBlock}" v-bind:class="{'edit-loc-show': this.isShowAddLoc}" >
				<input type="text" class="edit-input form-control" v-model="newLocName" v-on:change.stop.prevent="createNewLoc" v-on:enter.stop.prevent="createNewLoc">
				<img v-bind:src="imgPath('delete')" class="add-cancel" v-on:click.stop.prevent="hidenAddNewLocWrap">
				<img class="add-loc-btn" v-bind:src="imgPath('save')" v-on:click.stop.prevent="createNewLoc">
			</p>
		</a>
		
		<!-- 遍历子地点 -->
		<ul v-show="open" v-if="model.child && model.child.length > 0" class="layer collapse in">
			<LocItem v-for="(childLoc, index) in model.child" v-bind:model='childLoc' :key="index"></LocItem>
		</ul>
		<!-- 遍历LBS 呈现物 -->
		<ul v-show="open" v-if="model.locationRoles && model.locationRoles.length > 0" class="layer collapse in">
			<RoleItem v-for="(locRole, rIndex) in model.locationRoles" v-bind:model="locRole" :key="rIndex" :bindLoc="formatLocObj"></RoleItem>
		</ul>
		<!-- 遍历标志物 -->
		<ul v-show="open" v-if="model && model.identifiers.length > 0" class="layer collapse in">
			<IdentifyItem v-for="(identify, idIndex) in model.identifiers" v-bind:model="identify" :bindLoc="formatLocObj" :key="idIndex"></IdentifyItem>
		</ul>
	</li>
	
</template>

<script>
	import { mapActions, mapGetters, mapState } from 'vuex'
	import RoleItem  from './RoleItem'
	import IdentifyItem from './IdentifyItem'
	import globalConfig from '../../store/dataConfig/globalConfig'
	import { actionManager } from '../../store/index'
	import ClickLocAction from '../../operActions/actions/ClickLocAction'
	import DeleteLocAction from '../../operActions/actions/DeleteLocAction'
	import CreateNewLocAction from '../../operActions/actions/CreateNewLocAction'
	import SetLocNameAction from '../../operActions/actions/SetLocNameAction'

	export default {
		name: 'LocItem',
		props: ['model'],
		components: {
			RoleItem,
			IdentifyItem,
		},
		mounted () {
			var that = this;
			//  地点接受标志物或者是呈现物的绑定
			//  使用闭包去保存当前的数据对象
			(function(arg) {
				$(arg.$el).find('.loc').first().droppable({
					accept: '.assert-draggable',
					hoverClass: "ui-state-highlight",
					tolerance: "pointer",
					drop: function(event, ui) {
						console.log('当前放置的资源信息是: ------ ', arg.dragAssertObj);
						// 绑定信息的合法性判定
						that.checkCanBind(arg);
					}
				});

				if (!arg.lontitude || !arg.latitude) { // 不存在经纬度数据,可以拖拽
					$(arg.$el).find('.loc').first().draggable({
						addClasses: false, // 默认不添加拖拽的类
						helper: "clone",
						opacity: 0.5,
						zIndex: 3000,
						scroll: false,
						classes: {
						    "ui-draggable": "highlight"
						},
						distance: 100,
						cursorAt: { left: 60, top: 5}, // 鼠标所在的位置
						start: function () {
							if (parseInt(that.curActiveBtnInfo.viewBtn) == 1) return false;
							that.$store.dispatch('dragLocToAmap', arg.model);
						}

					})
				}
				
			}(that))
		},
		data () {
			return {
				options: {
					animation: 150,
					group: {
						name: 'bind-list',
						pull: this.pullAssert,
					},
					ghostClass: ".sortable-ghost", 
					dragClass: ".sortable-drag",
					scroll: false,
				},
				open: true,
				newLocName: '',
				isShowAddLoc: false,
				showAddBlock: '',
				showEditNameBlock: '',
				isShowEditLocName: false,
				editLocNewName: this.model.name,
				formatLocObj: this.model
			}
		},

		computed: {
			...mapGetters({
				dragAssertObj: 'getCurDragAssert',
				locsList: 'getLocsList'
			}),
			...mapState({
				curClickObj: state => state.curClickObj,
				activeMode: state => state.curEditMode,
				curActiveBtnInfo: state => state.activeToolbarBtn
			}),
			
			locClassObj () {
				return {
					'loc': true,
					'draggable': true, // 是否是可以拖动的, 这里默认的值给的是true, 但其实后来改判断如果地图上存在该地点，则不再能拖动
					'has-pos-data': this.model.longitude && this.model.latitude,
					'drag-active': this.curClickObj && this.model.id === this.curClickObj.id
				}
			},
			isFolder () {
				return this.model.child && this.model.child.length > 0
			},
			formatNewModel () {
				this.model.clickType = 'loc';
				return this.model;	
			},
			operTreeClass () {
				return {
					'active': true/*this.model && (this.model.child.length > 0 || this.model.locationRoles.length > 0 || this.model.identifiers.length > 0)*/ 
				}
			},

			showInputWrap () {
				return {
					'block': this.isShowAddLoc
				}
			},

		},
		
		methods: {
			locName () {
				return ((this.curClickObj && this.model.id == this.curClickObj.id && this.model.clickType == this.curClickObj.clickType) ? this.curClickObj.name : this.model.name);
			},

			thisLocID () {
				return this.model.id;
			},

			imgPath (name) {
				return (globalConfig.imgLoadPath +name+'.png')
			},


			changeCurActiveLocObj (objData, activeMode) {
				// 地图的中心点自动定位到当前点击的地点
				// 执行当前的点击action
				actionManager.excute(new ClickLocAction(this.curClickObj, objData, activeMode));
			},

			// 检测当前地点是否可以绑定标志物或者是呈现物
			checkCanBind (thisObj) { // 当前组件的this 指向

				var that = this;
				var dropLoc = thisObj.model;
				var dragObj = thisObj.dragAssertObj;

				var checkArray = (dragObj.assertType == 'identifiers' ? dropLoc.identifiers : dropLoc.locationRoles);
				var bindType = dragObj.assertType == 'identifiers' ? '标志物' : '呈现物';
				var formatType = dragObj.assertType == 'identifiers' ? 'Identify' : 'Role';
				var checkResult = checkArray.findIndex(function(elem, index, array) {
					return parseInt(elem.id) == parseInt(dragObj.id);
				});

				if (checkResult !== -1) {
					this.$store.dispatch('setErrorInfo', {
						tip: '绑定失败',
						reason: '同一地点不能绑定重复的' + bindType + '!'
					});

					setTimeout(function () {
						that.$store.dispatch('setErrorInfo', null);
					}, 5000);
					return false;
				}

				// 触发绑定的action
				this.$store.dispatch('orgObjBindAction', {
					drag: {
						type: formatType,
						data: dragObj,
					},
					drop: {
						type: 'Loc',
						data: dropLoc,
					}
				})
			},

			// input 的focus 事件
			inputFocusEvent () {
				return false;
			},

			// 点击显示创建新地点
			showAddNewLocWrap () {
				this.showAddBlock = 'block';
				var that = this;
				setTimeout(function(){
					that.isShowAddLoc = true;
				},100)
			},

			// 点击取消添加地点
			hidenAddNewLocWrap () {
				var that = this;
				this.isShowAddLoc = false;
				setTimeout(function(){
					that.showAddBlock = '';
				},100)
			},

			// 点击删除地点
			deleteLoc () {
				var r = confirm('确定删除该地点吗?');
				if (r) {
					if (this.model.identifiers.length > 0 || this.model.locationRoles.length > 0) {
						alert('当前地点绑定了对象, 不允许删除！');
						return false;
					} else {
						// 执行删除地点的action
						actionManager.excute(new DeleteLocAction(this.locsList, this.model));
					}
				}
			},

			// 创建新地点
			createNewLoc () {
				console.log('新地点的名称是: ----- ', this.newLocName);
				actionManager.excute(new CreateNewLocAction(this.locsList, this.newLocName, this.model.id));
				this.hidenAddNewLocWrap();
			},

			// 点击显示添加地点的wrap
			showEditLocNameWrap () {
				this.showEditNameBlock = 'block';
				var that = this;
				setTimeout(function(){
					that.isShowEditLocName = true;
				},100)
			},

			// 点击隐藏编辑地点名称的wrap
			hideEditLocNameWrap () {
				var that = this;
				this.isShowEditLocName = false;
				setTimeout(function(){
					that.showEditNameBlock = '';
				},100)
			},

			// 修改当前地点的名称
			changeLocName () {
				console.log('当前编辑完的新地点名称是: ------ ', this.editLocNewName);
				actionManager.excute(new SetLocNameAction(this.model, this.editLocNewName));
				this.hideEditLocNameWrap();
			},
		}
	}
</script>