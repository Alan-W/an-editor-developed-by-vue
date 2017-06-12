<template>
	<li class="map-prop-oper">
		<div class="oper-wrap show_map_default_marker">
			<span class="props-name">{{propNameMap[propName]}}</span>
			<span class="switch-btn-wrapper toolbar-mode" v-bind:class="btnState" @click="changeSwitchBtnState">
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
		props: ['propName', 'propValue', 'objInfo'],
		data () {
			return {
				propNameMap: globalConfig.propNameMap,
			}
		},

		computed: {
			btnState () {
				return ((this.propValue && this.propValue == 1) ? 'switch-active' : 'switch-off')
			}
		},

		methods: {
			changeSwitchBtnState () {
				console.log('点击了开关按钮的事件!');
				console.log('当前的属性名是: ------ ', this.propName);
				console.log('当前的属性值是: ------ ', this.propValue);
				var newValue = (parseInt(this.propValue) == 1) ? 0 : 1;
				console.log('修改完之后的数据是: ----- ', newValue);

				// 调用action 修改地图对象的属性
				this.$store.dispatch('changeObjSimpleInputValue', {
					editObj: this.objInfo,
					newValue: newValue,
					editPropType: this.propName
				})
			}
		}
	}
</script>