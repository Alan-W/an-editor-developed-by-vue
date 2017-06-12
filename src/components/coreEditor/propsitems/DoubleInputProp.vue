<template>
	<li>
		<div class="props-lnglat-wrapper">
			<span class="props-name"> {{ propNameMap[propName] }}</span>
			<div class="props-lnglat">
				<span>经度</span>
				<input type="number" class="form-control" v-bind:value="lngVal"  v-bind:disabled="canEdit" @change="changePropValue('lng')" @enter="changePropValue('lng')">
			</div>
			<div class="props-lnglat">
				<span>纬度</span>
				<input type="number" class="form-control" v-bind:value="latVal" v-bind:disabled="canEdit" @change="changePropValue('lat')" @enter="changePropValue('lat')">
			</div>
		</div>
	</li>
</template>

<script>
	import globalConfig from '../../../store/dataConfig/globalConfig'
	import { mapActions, mapState } from 'vuex'

	export default {
		name: 'DropdownListProp',
		props: ['propName', 'propValue', 'objInfo'],
		data() {
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
			},

			lngVal() {
				return this.propValue && this.propValue.lng
			},

			latVal() {
				return this.propValue && this.propValue.lat
			}
		},

		methods: {
			changePropValue (type) {
				event.target.blur();
				console.log(' the objInfo is : ----- ', this.objInfo);
				console.log('当前的属性名称是: ---- ', this.propName);
				var tempValue = {
					lng: null,
					lat: null,
				};
				tempValue.lng = this.propValue.lng;
				tempValue.lat = this.propValue.lat;
				tempValue[type] = event.target.value;
				console.log('修改地图属性的时候传递的tempVlaue 是: ---- ', tempValue);
				// 调用action 修改整个model 的属性
				this.$store.dispatch('changeObjSimpleInputValue', {
					editObj: this.objInfo,
					newValue: tempValue,
					editPropType: this.propName
				})
			}
		}
	}
</script>