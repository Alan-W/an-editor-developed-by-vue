<template>
	<li class="obj-id">
		<div>
			<span class="props-name">{{propNameMap[propName]}}</span>
			<span class="id-value">{{propValue}}</span>
		</div>
	</li>
</template>

<script>
	import globalConfig from '../../../store/dataConfig/globalConfig'
	 
	export default {
		name: 'SimpleShowProp',
		props: ['propName', 'propValue'],
		data () {
			return {
				propNameMap: globalConfig.propNameMap,
			}
		},
	}
</script>