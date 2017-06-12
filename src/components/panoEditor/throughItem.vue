<template>
	<div class="arrowBox" :labelId="throughProps.id" v-bind:style="{top:throughProps.top+'px', left:throughProps.left + 'px' }" style="position: absolute;padding:5px;text-align:center;color:#fff;">
		<h6 class="arrowName"  @click.stop.prevent="onH6Click" style="padding:0 6px;text-align:center;height:30px;line-height:30px;background-color:rgba(0,0,0,0.5);border-radius:5px;">{{throughProps.locationList}}</h6>
		<img class="arrowImg" src="../../../static/img/arrowBtn.png" style="margin:0 auto;display:block;height:60px;width:60px;transform: rotateX(50deg);">
	</div>
</template>

<script>
	import "../../assets/style/css/pano.css"
	import { mapActions, mapGetters, mapState} from 'vuex'
	import globalConfig from '../../store/dataConfig/globalConfig'

	export default {
		name: 'ThroughItem',
		props: ['throughProps'],
		computed: {
			formatNewModel () {
				this.throughProps.clickType = 'labelProp';
				return 	this.throughProps;	
			},
			...mapGetters({
				canThroughArray: 'getNearPanoArray'
			}),
		},
		methods: {
			onH6Click(event){
				$(event.target).parent().addClass("shine_border").siblings().removeClass('shine_border');
				/*if(globalConfig.locationListMap){
					console.log("触发了if");
					
				}else{
					console.log("globalConfig.locationListMap",globalConfig.locationListMap);
					globalConfig.locationListMap = this.canThroughArray;
					console.log("this.canThroughArray",this.canThroughArray);
					console.log("globalConfig.locationListMap",globalConfig.locationListMap);
				}*/
				this.$store.dispatch('changeClickObj', this.formatNewModel);
			}
		},
	}
</script>