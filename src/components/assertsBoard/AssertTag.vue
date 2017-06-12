<template>
	<li class="layer active">
		<a href="javascript:void(0)" v-bind:class="checkIsActiveClass(curAssertObj.id, assertType)" @click="changeActiveTag(assertType, curAssertObj)">
			<span class="fa fa-plus-square"></span>
			<span class="txt">{{curAssertObj.tagName}}</span>
			<img src="../../../static/img/delete.png" class="deletebtn">
		</a>
		<ul class="layer collapse in" v-if="curAssertObj && curAssertObj.child.length > 0">
			<AssertTag v-for="(assert, index) in curAssertObj.child" :curAssertObj="assert" :assertType="assertType" :key="assert.id"></AssertTag>
		</ul>
	</li>
</template>

<script>
	import { mapGetters } from 'vuex'

	export default {
		name: 'AssertTag',
		props: ['curAssertObj', 'assertType'],
		
		computed: {
			...mapGetters({
				curActiveTag: 'getCurActiveTag'
			}),
		},

		methods: {
			changeActiveTag (type, assertObj) {
				console.log(' the type is : ----- ', type);
				console.log(' the assertObj is : ----- ', assertObj);
				var tagInfo = {};
				// 子文件夹
				tagInfo.folderChild = assertObj.child; 
				// 当前文件夹下的普通资源
				tagInfo.assertsChild = assertObj[type];
				// 当前选中的标签的ID
				tagInfo.id = assertObj.id; 
				// 当前选中的标签的类型
				tagInfo.type = type;
				console.log('当前标签下的资源信息是: -- ---- ', tagInfo);
				this.$store.dispatch('changeCurAssertTag', tagInfo)
			},
			checkIsActiveClass (id, type) {
				return {
					'tag-active': id == this.curActiveTag.id && type == this.curActiveTag.type
				}
			},
		}
	}
</script>