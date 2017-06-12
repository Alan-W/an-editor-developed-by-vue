<template>
	<swiper :options="swiperOption" class="nearbyWraper">
		<swiper-slide v-for="(slide, index) in swiperSlides" v-bind:key="index">
			<a href="javascript:void(0);" class="pano_photo_item" :scenicName="slide.name" :panoId = "slide.pano_id" @click="onNearPanoClick($event, slide.pano_id, slide.name)">
				<img :src="slide.logo"></img>
				<span class="pano_photo_decs">{{slide.name}}</span>
			</a>
		</swiper-slide>
		<div class="swiper-pagination" slot="pagination"></div>
		<div class="swiper-button-prev" slot="button-prev"></div>
		<div class="swiper-button-next" slot="button-next"></div>
	</swiper>
</template>

<script>
	import "../../assets/style/css/pano.css"
	import { mapActions, mapGetters, mapState} from 'vuex'
	import globalConfig from '../../store/dataConfig/globalConfig'
	import PanoOperation from './PanoOperation'
	export default {
	    name: 'NearPanoList',
	    data() {
		    return {
		        swiperOption: {
					nextButton: '.swiper-button-next',
	                prevButton: '.swiper-button-prev',
	                slidesPerView: 4,
	                paginationClickable: true,
	                spaceBetween: 20,
		        },
		    }
	    },
	    created () {
			this.$store.dispatch('getPanoList',this.curClickObj.pano_id);
		},
		computed: {
			...mapState({
				curClickObj: state => state.curClickObj,
			}),
			...mapGetters({
				swiperSlides: 'getNearPanoArray'
			}),
		}, 
	    methods: {
	    	onNearPanoClick (event, panoId, scenicName) {
	    		console.log(' 点击了附近全景图片，实现穿越的 panoId is : ---- ', panoId);
	    		console.log(' 点击了附近全景图片，实现穿越的 scenicName is : ---- ', scenicName);
	    		PanoOperation.changeScenePano(panoId);
	    		this.$store.dispatch('getLabelList', {panoId:panoId,scenicName:scenicName});
	    		this.$store.dispatch('getPanoList', panoId);
	    	}
		},
	}
</script>