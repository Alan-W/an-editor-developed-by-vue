<template>
	<div class="pano-editor panoWrapper"><!--  -->
		<div id="panoContainer" @click.stop.prevent="onpanoClick($event)"  @mousedown="onDocumentMouseDown($event)" @mousemove="mousemoveFlag && onDocumentMouseMove($event)" @mouseup="mouseupFlag && onDocumentMouseUp($event)" @mousewheel="onDocumentMouseWheel($event)">
			<LabelItem v-for="(item , index) in curTags.labelArray" :labelProps="item" v-bind:key="index"></LabelItem>
			<throughItem v-for="(item , index) in curTags.throughArray" :throughProps="item" v-bind:key="index"></throughItem>
		</div>
		<div class="scenicName" id="scenicName">{{scenicName}}</div>
		<!-- <div id="turnoffLabel" class="turnoffLabel-btn hideLabel" style="display: block;">
			<span class="turnoffLabel-close showLabel"></span>
		</div> -->
		<!-- 底部附近地点全景图的轮播 -->
		<NearPanoList></NearPanoList>
	</div>
</template>

<script>
	import "../../assets/style/css/pano.css"
	import { mapActions, mapGetters, mapState} from 'vuex'
	import PanoOperation from './PanoOperation'
	import LabelItem from './LabelItem'
	import ThroughItem from './ThroughItem'
	import NearPanoList from './NearPanoList'
	import { swiper, swiperSlide } from 'vue-awesome-swiper'

	export default { 
	
		components: {
			LabelItem,
			ThroughItem,
			NearPanoList,
			swiper,
    		swiperSlide
		},
		mounted () {
			PanoOperation.initPanoScence(this.curClickObj.pano_id);
			this.$store.dispatch('getLabelList', {panoId:this.curClickObj.pano_id,scenicName:this.curClickObj.name});
		},
		computed: {
			...mapState({
				curClickObj: state => state.curClickObj,
				activeToolbarBtn: state => state.activeToolbarBtn
			}),
			...mapGetters ({
				scenicName:'getScenicName',
				mouseupFlag:"getMouseupFlag",
				mousemoveFlag:'getMousemoveFlag',
				curTags: 'getCurTags',
			})
		},
		methods: {
			...mapActions({
				onpanoClick: 'onpanoClick',
				onDocumentMouseDown:'onDocumentMouseDown',
				onDocumentMouseMove:'onDocumentMouseMove',
				onDocumentMouseUp:'onDocumentMouseUp',
				onDocumentMouseWheel:'onDocumentMouseWheel',
			})
		},

	}
</script>