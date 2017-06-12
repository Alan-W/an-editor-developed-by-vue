<template>
	<li>
		<div class="input-group">
			<span class="props-name">{{propNameMap[propName]}}</span>
			<input type="text" class="form-control" v-bind:disabled="canEdit" v-model="objPropValue" @change="changePropValue" @enter="changePropValue">
		</div>
	</li>
	
</template>

<script>
	import globalConfig from '../../../store/dataConfig/globalConfig'
	import { mapActions, mapState } from 'vuex'

	export default {
		name: 'SimpleInputProp',
		props: ['propName', 'propValue', 'objInfo'],
		data () {
			return {
				propNameMap: globalConfig.propNameMap,
			}
		},
		computed: {
			objPropValue (newValue) {
				return this.propValue;
			},

			...mapState ({
				toolBarViewState: state => parseInt(state.activeToolbarBtn.viewBtn)
			}),

			canEdit() {
				return (this.toolBarViewState == 2 ? false : 'disabled')
			} 
		},
		methods: {
			changePropValue (event) {
				event.target.blur();
				console.log(' the objInfo is : ----- ', this.objInfo);
				// 调用action 修改整个model 的属性
				this.$store.dispatch('changeObjSimpleInputValue', {
					editObj: this.objInfo,
					newValue: event.target.value,
					editPropType: this.propName
				})
			}
		}
	}
</script>