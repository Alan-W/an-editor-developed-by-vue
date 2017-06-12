<template>
	<li class="img-type-prop">
		<div class="logo">
			<span class="props-name">{{ propNameMap[propName] }}</span>
			<span class="img-scan">
				<img v-bind:src="propValue" >
			</span>
			<button class="btn btn-success change-img-btn map-choose-img" v-bind:disabled="canEdit">选择</button>
			<button class="btn btn-danger clear-image" v-bind:disabled="canEdit">清除</button>
		</div>
	</li>
</template>

<script>
	import { mapActions, mapGetters, mapState } from 'vuex'
	import globalConfig from '../../../store/dataConfig/globalConfig'

	export default {
		name: 'MapImageProp',
		props: ['propName', 'propValue'],
		data () {
			return {
				propNameMap: globalConfig.propNameMap,
			}
		},

		computed: {
			...mapState ({
				toolBarViewState: state => parseInt(state.activeToolbarBtn.viewBtn)
			}),

			canEdit() {
				return (this.toolBarViewState == 2 ? false : 'disabled')
			} 
		}

	}
</script>