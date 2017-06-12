<template>
	<li class="source-id-item" v-if="curClickObj && curClickObj.cliclType ==='loc' ">
		<div class="source-id">
			<span class="props-name"> {{propNameMap[propName]}} </span>
			<div class="props-con source-id-prop-item">
				<input type="text" class="form-control" value="propValue" v-model="propValue" v-bind:disabled="canEdit">
				<button class="btn btn-success view-zip-resource" v-bind:disabled="canEdit">选择</button>
			</div>
		</div>
	</li>
</template>

<script>
	import { mapActions, mapState } from 'vuex'; 
	import globalConfig from '../../../store/dataConfig/globalConfig'

	export default {
		name: 'ModelResourceIDProp',
		props: ['propName', 'propValue'],
		data () {
			return {
				propNameMap: globalConfig.propNameMap,
			}
		},
		computed: {
			...mapState({
				curClickObj: state => state.curClickObj,
				toolBarViewState: state => parseInt(state.activeToolbarBtn.viewBtn)
			}),
			canEdit() {
				return (this.toolBarViewState == 2 ? false : 'disabled')
			} 
		},
		methods: {
			...mapActions([
				'getCurClickObj'
			])
		}
	}
</script>