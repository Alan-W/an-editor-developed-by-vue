<template>
	<article class="props-container base-props" v-bind:class="objType">
		<div class="props-title">
			<span class="obj-con">{{objProps && (objProps.name || objProps.title)}}</span>
			<span class="obj-name">{{ objProps && '('+curObjType[objType]+')' }}</span>
			<span class="menu">
				<img src="../../../static/img/menu-open.png"  alt="" class="open scale1">
				<img src="../../../static/img/menu-close.png"  alt="" class="open scale0">
			</span>
		</div>
		<ul class="props-list">
			<component v-for='(com, index) in objProps' :key="index" :is="comNameMap[index]" :propName="index" :propValue="com" :objInfo="curObjInfo">
			</component>
			<component v-for='(roleCom, rIndex) in objProps.property' :key="rIndex" v-if="objProps && objProps.type == '1' && objProps.property && rIndex !== 'id' " :is="comNameMap[rIndex]" :propName="rIndex" :propValue="roleCom" :objInfo="curObjInfo">
			</component>
		</ul>
	</article>
</template>

<script>
	import SimpleShowProp from './propsitems/SimpleShowProp'
	import SimpleInputProp from './propsitems/SimpleInputProp'
	import ImgProp from './propsitems/ImgProp'
	import DropDownListProp from './propsitems/DropdownListProp'
	import DoubleInputProp from './propsitems/DoubleInputProp'
	import DefaultPointProp from './propsitems/DefaultPointProp'
	import ModelThreeDProp from './propsitems/ModelThreeDProp'
	import ModelResourceIDProp from './propsitems/ModelResourceIDProp'
	import MapImageProp from './propsitems/MapImageProp'
	import SwitchBtnProp from './propsitems/SwitchBtnProp'

	import globalConfig from '../../store/dataConfig/globalConfig'

	import { mapActions, mapGetters, mapState } from 'vuex'

	export default {
		name: 'PropItemsWrap',
		props: ['objProps', 'objType'],

		data () {
			console.log(' the objProps is : ----- ', this.objProps);
			return {
				comNameMap: globalConfig.propsMapVueObj,
				propNameMap: globalConfig.propNameMap,
				curObjType: globalConfig.curObjTypeMap,
				
			}
		},
		
		components: {
			"SimpleShowProp": SimpleShowProp,
			"ImgProp": ImgProp,
			"SimpleInputProp": SimpleInputProp,
			"DropDownListProp": DropDownListProp,
			"DefaultPointProp": DefaultPointProp,
			"DoubleInputProp": DoubleInputProp,
			"ModelThreeDProp": ModelThreeDProp,
			"ModelResourceIDProp": ModelResourceIDProp,
			"MapImageProp": MapImageProp,
			"SwitchBtnProp": SwitchBtnProp,

		},
		computed: {
			...mapState({
				activeMode: state => state.curEditMode
			}),
			curObjInfo() {
				return {
					objProps: this.objProps,
					type: this.objType,
				}
			}
		},
		methods: {
			...mapActions([
				'getCurClickObj', 'changeEditBoard'
			])
		}

	}
</script>