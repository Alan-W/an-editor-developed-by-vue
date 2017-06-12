<template>
	<el-amap class="amap-wrap" :vid="'amapContainer'" 
		:zoom="zoom" 
		:center="mapObjData.center" 
		:map-manager="amapManager" 
		:zooms="zooms" 
		:zIndex = "zIndex"
		:events = "mapEvents()" 
		:expandZoomRange="expandZoomRange">
		<!-- 自定义底图 -->
		<el-amap-ground-image v-for="(groundimage, index) in mapObjData.groundimages" 
			:key="index" 
			:url="groundimage.url" 
			:zIndex="120" 
			:bounds="groundimage.bounds"
		></el-amap-ground-image>
		<!-- 创建具备经纬度数据的marker -->
		<el-amap-marker v-for="(marker, index) in locsList" 
			:key="index" 
			:position="[marker.longitude,marker.latitude]" 
			:cursor= "'pointer'" 
			:zIndex = "13000" 
			:content = "initMarkerStyle(marker)"
			:offset = "offset"
			:events = "markerEvents(marker)"
			:draggable= "canEdit == '2' ? true : false" 
			v-if="marker.longitude && marker.latitude"
		></el-amap-marker>
		<!-- 创建地点范围 -->
		<el-amap-circle v-for="(circle, index) in locsList" 
			:key="index"
			:center="[circle.longitude, circle.latitude]"
			:radius="circle.scope || 30"
			:strokeColor="strokeColor" 
			:strokeOpacity="strokeOpacity" 
			:strokeWeight="strokeWeight"
			:fillColor="fillColor"
			:fillOpacity="fillOpacity"
			:zIndex= '3000'
			:editable = "canEdit == '2' && curClickObj && curClickObj.clickType=='loc' && curClickObj.id == circle.id"
			:visible="showCurCircle(circle)"
			:events = "circleEvents(circle)"
			v-if="circle.longitude && circle.latitude"
			></el-amap-circle>
	</el-amap>
</template>


<script>
	import { mapActions, mapGetters, mapState } from 'vuex'
	import '../../assets/style/sass/amap.scss'
	import globalConfig from '../../store/dataConfig/globalConfig'
	import { actionManager } from '../../store/index'
	import SetLocScopeAction from '../../operActions/actions/SetLocScopeAction'
	import SetLocPosAction from '../../operActions/actions/SetLocPosAction'
	import DragLocToAmapAction from '../../operActions/actions/DragLocToAmapAction'

	export default {
		created () {
			console.log*(' the map has created!');
			this.$store.dispatch('getOrganizationInfo');
			this.curOrgInfo.clickType = 'map';
			this.$store.dispatch('changeClickObj', this.curOrgInfo);
		},

		mounted () {
			var that = this;
			console.log('高德地图所在的DOM 是: ----- ', this.$el);
			$(this.$el).droppable({
				accept: '.loc',
				hoverClass: "ui-state-highlight",
				tolerance: "pointer",
				drop: function(event, ui) {
					console.log('当前放置的地点信息是: ------ ', that.curDragLoc);
					// 执行拖拽地点的Action
					var map = that.amapManager.getMap();
					var pixel = new AMap.Pixel(event.clientX, event.clientY);
					var markerLngLat  = map.containerToLngLat(pixel, map.getZoom()); // 传入当前地图的缩放级别
					actionManager.excute(new DragLocToAmapAction(that.curDragLoc, markerLngLat));
				}
			});
		},
		data () {
			return {
				resizeEnable: true,
				zoom: 18,
				level: 18,
				zIndex: 100,
				zooms: [3, 20],
				offset: [-11, -11],
				expandZoomRange: true,
				amapManager: globalConfig.amapManager,
				strokeColor: '#00B7EE', //  线的颜色
				strokeOpacity: 0, // 线的透明度
				strokeWeight: 1, // 线的粗细程度
				fillColor: '#00B7EE', // 填充颜色
				fillOpacity: 0.3, // 填充的透明度 
			}
		},
		computed: {
			...mapGetters({
				curOrgInfo: 'getOrgInfo',
				locsList: 'getAllLocs',
				curDragLoc: 'getCurDragLoc',
			}),
			...mapState({
				curClickObj: state => state.curClickObj,
				canEdit: state => state.activeToolbarBtn.viewBtn
			}),
			mapObjData () {
				return {
					center: this.curOrgInfo && this.curOrgInfo.center,
					groundimages: (this.curOrgInfo && !this.curOrgInfo.map_north_east || !this.curOrgInfo.map_south_west) ? [] : [
						{
							url: this.curOrgInfo && this.curOrgInfo.map_image,
							bounds: this.curOrgInfo && [[this.curOrgInfo.map_south_west.lng,this.curOrgInfo.map_south_west.lat], [this.curOrgInfo.map_north_east.lng,this.curOrgInfo.map_north_east.lat]],
							zooms: [3, 20]
						}
					]
				}
			},

			// 设置圆的编辑
			
		},
		methods: {
			initMarkerStyle (markerData) {
				var active = (markerData.id === this.curClickObj.id) ? true : false;
				var iconUrl = active ? globalConfig.amapConfig.defMarkerIcon : globalConfig.amapConfig.defMarkerIcon;
				var titleStyle = active ? 'marker-title-active' : '';
				
				var lockState = parseInt(markerData.lock);
				var lockShow = '';
				if (lockState > 0) { // 解锁的状态, 小锁按钮不显示
					lockShow = 'hide-lock'
				};
				return (
					'<article class="marker draw">' + 
						'<div class= "marker-title ' + titleStyle +' ">' + 
							'<span class="marker-icon-wrap btn-style circle">' + 
								'<img src=" '+ iconUrl +' " class="marker-icon">' + 
							'</span>' + 
							'<img src="'+globalConfig.amapConfig.lockImg+'" class="loc-lock-img '+lockShow+' ">' + 
							'<span class="marker-name">' + markerData.name + '</span>' + 
						'</div>' + 
					'</artcle>'
				)	
			},

			showCurCircle (circle) {
				return (this.curClickObj && this.curClickObj.clickType == 'loc' && circle.id == this.curClickObj.id)
			},

			// 地图的点击事件
			mapEvents () {
				return {
					click: () => {
						this.$store.dispatch('changeClickObj', this.curOrgInfo);
					}
				}
			},

			// 地点marker 的点击事件
			markerEvents (marker) {
				var tempMarker = {};
				tempMarker.longitude = marker.longitude;
				tempMarker.latitude = marker.latitude;
				return {
					click: () => {
						this.amapManager.getMap().setCenter([marker.longitude, marker.latitude]);
						marker.clickType = 'loc';
						this.$store.dispatch('changeClickObj', marker);
					},

					dragging: (eventOptions) => {
						marker.longitude = eventOptions.lnglat.lng;
						marker.latitude = eventOptions.lnglat.lat;
					},

					dragend: (eventOptions) => {
						// 拖拽结束之后执行修改属性的action
						// 拖拽的时候是同时更改经纬度
						console.log('执行拖拽结束的函数！');
						console.log(' the tempMarker is : ---- ', tempMarker);
						actionManager.excute(new SetLocPosAction(marker, eventOptions.lnglat, null, tempMarker))
					}
				}
				
			},

			// 圆的点击事件
			circleEvents (circle) {
				return {
					click: () => {
						this.$store.dispatch('changeClickObj', this.curOrgInfo);
					},

					adjust: (event) => {
						actionManager.excute(new SetLocScopeAction(circle, event.radius))
					},
				}
			},

		}
		
	}
</script>