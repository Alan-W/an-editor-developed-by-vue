<template>
	<div class="textDiv" @click="changeClickObj(formatNewModel)" :labelId="labelProps.id" v-bind:style="{top:labelProps.top+'px', left:labelProps.left + 'px' }" style="position: absolute; height: 55px; padding: 5px 5px 5px 35px; margin-left: -15px; margin-top: -50px; border-radius: 5px;">
		<img  class="oImg" v-bind:src="labelProps.icon" style="position:absolute;left:3px;height:30px;width:30px;">
		<img src="../../../static/img/circle.png" style="position:absolute;left:3px;height:50px;width:30px;">
		<input class="panoTextarea" type="text" @click="onInputClick($event)" @change="updateMessage($event,formatNewModel)" @enter="updateMessage($event,formatNewModel)" @keydown="onInputKeydown($event)" v-model="labelProps.text" v-bind:style="{fontSize:labelProps.size, color:labelProps.colour}" style="position:relative;width:60px;height:30px;line-height:30px;text-align:center;overflow-y:visible;border-radius:5px;border:1px solid #ccc;background-color: rgba(0, 0, 0, 0.5)">
	</div>
</template>

<script>
	import "../../assets/style/css/pano.css"
	import { mapActions, mapGetters, mapState} from 'vuex'
	import globalConfig from '../../store/dataConfig/globalConfig'

	export default {
		name: 'LabelItem',
		props: ['labelProps'],
		computed: {
			formatNewModel () {
				this.labelProps.clickType = 'labelProp';
				return this.labelProps;	
			},
		},
		methods: {
			...mapActions({
				onInputClick: 'onInputClick',
				changeClickObj:'changeClickObj',
				updateMessage:'updateMessage',
				onInputKeydown:'onInputKeydown',
			})

		},
	}
</script>