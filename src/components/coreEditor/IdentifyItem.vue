<template>
	<li>
		<a href="javacript:void(0)" class="marker event-item"  v-bind:class="activeClassObj" @click="changeClickIdentifyObj(formatNewModel)">
			<span class="fa"></span>
			<span class="txt"> {{ model && model.name }} </span>
			<img src="../../../static/img/delete.png" class="deletebtn" v-on:click.stop.prevent="deleteBoundIdentifyInstance">
		</a>
	</li>
</template>

<script>
	import { mapActions, mapGetters, mapState } from 'vuex'
	import { actionManager } from '../../store/index' 
	import ClickIdentifyInstanceAction from '../../operActions/actions/ClickIdentifyInstanceAction'
	import DeleteBoundIdentifyInstanceAction from '../../operActions/actions/DeleteBoundIdentifyInstanceAction'

	export default {
		name: 'IdentifyItem',
		props: ['model', 'bindLoc'],
		mounted () {
			var that = this;
			// 标志物接受呈现物的绑定
			// 使用闭包保存当前实例的this 数据
			(function(arg) {
				$(arg.$el).find('.event-item').first().droppable({
					accept: '.assert-draggable',
					hoverClass: "ui-state-highlight",
					tolerance: "pointer",
					drop: function(event, ui) {
						console.log('当前放置的资源信息是: ------ ', arg.dragAssertObj);
						// 绑定信息的合法性判定
						that.checkCanBind(arg);
					}
						
				});
			}(that))
		},
		computed: {
			...mapGetters({
				dragAssertObj: 'getCurDragAssert'
			}),
			...mapState({
				curClickObj: state => state.curClickObj
			}),
			formatNewModel () {
				this.model.clickType = 'identify';
				return this.model;	
			},

			activeClassObj () {
				return  {
					'drag-active': this.curClickObj && this.model.id === this.curClickObj.id
				}
				
			}
		},
		methods: {

			changeClickIdentifyObj (curIdentify) {
				actionManager.excute(new ClickIdentifyInstanceAction(this.curClickObj, curIdentify, this.bindLoc));
			},

			checkCanBind (thisObj) {
				console.log('当前标志物所在的地点ID 是: ------- ', thisObj.bindLoc.id);
				var that = this;
				var dropIdentify = thisObj.model;
				var dragRole = thisObj.dragAssertObj;

				var checkArray = dropIdentify.roles ? dropIdentify.roles : [];
				var checkResult = checkArray.findIndex(function(elem, index, array) {
					return parseInt(elem.id) == parseInt(dragRole.id);
				});

				console.log('绑定合法性检测的index 是: ----- ', checkResult);
				if (checkResult !== -1) {
					this.$store.dispatch('setErrorInfo', {
						tip: '绑定失败',
						reason: '同一标志物不能绑定重复的呈现物!'
					});

					setTimeout(function () {
						that.$store.dispatch('setErrorInfo', null);
					}, 3000);
					return false;
				}

				// 触发绑定的action
				this.$store.dispatch('orgObjBindAction', {
					drag: {
						type: 'Role',
						data: dragRole,
					},
					drop: {
						type: 'Identify',
						data: dropIdentify,
					},
					locID: thisObj.bindLoc.id,
				})
			},

			// 删除地点绑定的标志物
			deleteBoundIdentifyInstance () {
				// 执行删除的绑定标志物的Action
				actionManager.excute(new DeleteBoundIdentifyInstanceAction(this.model, this.bindLoc));
			},

		}
	}
</script>