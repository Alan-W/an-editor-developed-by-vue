<template>
	<li class="dropdown-select">
		<div class="input-group">
			<span class="props-name">{{ propNameMap[propName] }}</span>
			<div class="btn-group">
				<button class="btn btn-default btn-area">{{ keyValue}}</button>
				<button class="btn btn-default dropdown-toggle select-caret" data-toggle="dropdown" v-bind:disabled="canEdit">
					<span class="caret"></span>
					<span class="sr-only"></span>
				</button>
				<ul class="dropdown-menu" role="menu">
					<li v-for="(item, index) in list" key="index">
						<a href="javascript:void(0)" @click="changeLocType(propName, item.itemKey)">{{item.itemValue}}</a>
					</li>
				</ul>
			</div>
		</div>
	</li>
</template>

<script>
	import globalConfig from '../../../store/dataConfig/globalConfig'
	import { mapActions, mapGetters, mapState } from 'vuex'
	
	export default {
		name: 'DropdownList',
		props: ['propName', 'propValue', 'objInfo'],
		data () {
			return {
				propNameMap: globalConfig.propNameMap,
				list: globalConfig[this.propName+'ListMap'],
			}
		},

		computed: {
			keyValue: function () {
				var tempProp = this.propValue;
				var value = globalConfig[this.propName+'ListMap'].findIndex(function(elem, index, arr) {
					return elem.itemKey == tempProp;
				});
				var a = globalConfig[this.propName+'ListMap'][value].itemValue;
				return a;
			}
		},

		methods: {
			...mapState ({
				toolBarViewState: state => parseInt(state.activeToolbarBtn.viewBtn)
			}),

			canEdit() {
				return (this.toolBarViewState == 2 ? false : 'disabled')
			},

			changeLocType (propName, value) {
				// 调用action 修改整个model 的属性
				this.$store.dispatch('changeObjSimpleInputValue', {
					editObj: this.objInfo,
					newValue: value,
					editPropType: propName
				})
			}
		}
	}
</script>

