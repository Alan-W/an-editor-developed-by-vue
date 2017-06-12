<template>
	<li class="map-prop-oper">
		<div class="oper-wrap show_map_default_marker">
			<span class="props-name">{{propNameMap[propName]}}</span>
			<span class="switch-btn-wrapper toolbar-mode" v-bind:class="btnState">
				<span class="switch-open"></span>
				<span class="switch-close"></span>
			</span>
		</div>
	</li>
</template>

<script>
	import globalConfig from '../../../store/dataConfig/globalConfig'

	export default {
		name: 'SwitchBtnProp',
		props: ['propName', 'propValue'],
		data () {
			return {
				propNameMap: globalConfig.propNameMap,
				btnState: ((this.propValue && this.propValue == 1) ? 'switch-active' : 'switch-off'),
			}
		}
	}
</script>