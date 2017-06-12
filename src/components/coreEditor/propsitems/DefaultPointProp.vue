<template>
	<li class="default-point" v-if="activeMode == 'panoEditor' ">
		<div class="input-group">
			<span class="props-name">{{ propNameMap[propName] }} </span>
			<div class="input-wrap">
				<p class="input-group">
					<span class="point-name">X:</span>
					<input type="number" class="form-control" value="xVal" v-bind:disabled="canEdit">
				</p>
				<p class="input-group">
					<span class="point-name">Y:</span>
					<input type="number" class="form-control" value="yVal" v-bind:disabled="canEdit">
				</p>
				<p class="input-group">
					<span class="point-name">Z:</span>
					<input type="number" class="form-control" value="zVal" v-bind:disabled="canEdit">
				</p>
			</div>
		</div>
	</li>
</template>

<script>
	import { mapActions, mapGetters, mapState } from 'vuex'
	import globalConfig from '../../../store/dataConfig/globalConfig'

	export default {
		name: 'DefaultPointProp',
		props: ['propName', 'propValue'],
		data () {
			return {
				propNameMap: globalConfig.propNameMap,
				xVal: this.propValue && JSON.parse(this.propValue).x,
				yVal: this.propValue && JSON.parse(this.propValue).y,
				zVal: this.propValue && JSON.parse(this.propValue).z,
			}
		},
		computed: {
			...mapState ({
				activeMode: state => state.curEditMode,
				toolBarViewState: state => parseInt(state.activeToolbarBtn.viewBtn)
			}),

			canEdit: this.toolBarViewState == 2 ? true : false,
		},

		methods: {
			...mapActions([
				'changeEditBoard'
			]),
		}
	}
</script>