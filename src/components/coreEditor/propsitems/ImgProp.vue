<template>
	<li class="img-type-prop" >
		<div class="logo">
			<span class="props-name">{{propNameMap[propName]}}</span>
			<span class="img-scan">
				<img class="img-scan" v-bind:src="propValue">
			</span>
			<button class="btn btn-success change-img-btn" v-bind:disabled="canEdit">选择</button>
		</div>
	</li>
</template>

<script>
	import globalConfig from '../../../store/dataConfig/globalConfig'
	import { mapActions, mapState } from 'vuex'; 
	
	export default {
		name: 'ImgProp',
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