<template>
	<li class="detail-tag" >
		<a class="assert-item assert-draggable"  v-bind:assertObj="curAssert">
			<img v-bind:src="curAssert.url || curAssert.logo" >
			<span class="txt">{{ curAssert.name || curAssert.title }}</span>
		</a>
	</li>
</template>

<script>
	export default {
		tempValue: null,
		name: 'AssertItem',
		props: ['curAssert', 'assertType'],
		mounted () {
			var that = this;
			//  使用闭包去保存当前的数据对象
			(function (arg) {
				$(arg.$el).find('.assert-draggable').first().draggable({
					addClasses: true,
					helper: "clone",
					opacity: 0.5,
					zIndex: 3000,
					scroll: false,
					classes: {
						"ui-draggable": "highlight"
					},
					start: function () {
						// 触发切换资源栏当前选中的资源对象信息
						arg.curAssert['assertType'] = arg.assertType;
						that.$store.dispatch('changeCurDragAssertObj', arg.curAssert);
					}
				})
			}(that))
		},
		
	}
</script>