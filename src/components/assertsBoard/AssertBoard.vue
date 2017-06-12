<template>
	<div class="edit-bottom horizational-view">
		<section class="resourceBox assertsBox">
			<div class="search-wrapepr">
				<p class="title">
					<span>资源</span>
					<span class="asserts-model-btn-wrapper asserts-list-modal asserts-list-modal-off assertsListBtn" >
						<img src="../../../static/img/list.png" height="12" width="15" alt="" class="list-off">
						<img src="../../../static/img/list-on.png" alt="" class="list-on">
					</span>
					<span class="asserts-model-btn-wrapper asserts-scan-mode asserts-scan-mode-off assertsScanBtn" >
						<img src="../../../static/img/glasses.png" alt="" class="scan-off">
						<img src="../../../static/img/glasses-on.png" alt="" class="scan-on">
					</span>

				</p>
				<div class="add-assert-tag" data-toggle="modal" data-target="#addAssertModal"></div>
				<div class="assert-serach">
					<p class="search-wrap">
						<input type="text" class="form-control" id="searchAssert">
						<span class="search-btn" id="searchLocBtn">搜索</span>
						<img src="../../../static/img/search.png" class="search"/>
					</p>
					<p class="assert-btn-wrap">
						<input type="text" class="assert-tag-name form-control" id="tagNameInput">
						<img src="../../../static/img/delte-loc.png" id="cancelAssertTag" class="tag-name-oper-btn"/>
						<img src="../../../static/img/save.png" id="submitAssertTag" class="tag-name-oper-btn"/>
						<img src="../../../static/img/plus.png" id="addAssertTag" class="toolbar-mode scan-mode"/>
						<span class="switch-btn-wrapper" id="bottomSwitchOpen">
						<span class="switch-open"></span>
					</span>
					</p>
					
				</div>
			</div>
			<ul class="tree-list assertsListBox" id="asserts">
				<li class="layer active">
					<a href="javascript:void(0)" @click="changeActiveTag('identifiers', false)" v-bind:class="checkIsActiveClass('identifiers0', 'identifiers')">
						<span class="fa fa-plus-square"></span>
						<span class="txt">标识物</span>
					</a>
					<ul class="layer collapse in" v-if="assertsObj && assertsObj.identifierList && assertsObj.identifierList.tag">
						<AssertTag v-for="(assert, index) in assertsObj.identifierList.tag" :curAssertObj="assert" :assertType="'identifiers'" :key="index" ></AssertTag>
					</ul>
				</li>
				<li class="layer active">
					<a href="javascript:void(0)"  @click="changeActiveTag('role', false)" v-bind:class="checkIsActiveClass('role0', 'role')">
						<span class="fa fa-plus-square"></span>
						<span class="txt">呈现物</span>
					</a>
					<ul class="layer collapse in" v-if="assertsObj && assertsObj.roleList && assertsObj.roleList.tag">
						<AssertTag v-for="(assert, index) in assertsObj.roleList.tag" :curAssertObj="assert" :assertType="'role'" :key="index"></AssertTag>
					</ul>
				</li>
			</ul>
			<div class="asserts-left-wrapper">
				<div class="assert-resources assert-resources-icon-mode">
					<ul class="detail-tags-wrapper in new-add assert-tag-detail-show-wrapper" v-if="curActiveTag">

						<li class="detail-tag" v-for="(curAssert, index) in curActiveTag.folderChild" :key="curAssert.id">
							<a class="assert-folder"  @click="changeActiveTag(false, curAssert)">
								<img src="../../../static/img/assert-folder.png" class="folder-img-icon">
								<span class="txt">{{ curAssert.tagName }}</span>
							</a>
						</li>
						<AssertItem v-for="(curAssert, index) in curActiveTag.assertsChild" :key="curAssert.id" :curAssert="curAssert" :assertType="curActiveTag && curActiveTag.type"></AssertItem>
						
					</ul>
				</div>
				<div class="assert-resources assert-resources-list-mode">
					
				</div>
			</div>
		</section>
	</div>
</template>

<script>
	import { mapActions, mapGetters, mapState } from 'vuex'
	import '../../assets/style/sass/assertboard.scss'
	import AssertTag from './AssertTag'
	import AssertItem from './AssertItem'

	export default {
		created () {
			this.$store.dispatch('getAssertsInfo')
		},

		components: {
			AssertTag,
			AssertItem
		},
		computed: {
			...mapGetters({
				assertsObj: 'getAsserts',
				curActiveTag: 'getCurActiveTag'
			}),
			...mapState({
				canEdit: state => state.activeToolbarBtn.viewBtn,
				curTagInfo: state => state.curActiveAssertTag,
			}),
		},
		methods: {
			changeActiveTag (type, assertObj) {
				var tagInfo = {};
				if (!assertObj) { // 点击的是第一层
					var firstLayerType = ((type.indexOf('role') === -1) ? 'identifierList' : 'roleList');
					var typeInfo = ((type.indexOf('role') === -1) ? 'identifiers' : 'role');
					// 子文件夹
					tagInfo.folderChild = this.assertsObj[firstLayerType].tag; 
					// 当前文件夹下的普通资源
					tagInfo.assertsChild = this.assertsObj[firstLayerType].noTag;
					tagInfo.type = typeInfo;
					tagInfo.id = typeInfo+'0'; // 标志物或呈现物的的第一层
				} else { // 点击的是具体的资源标签文件夹, 
					// 子文件夹
					tagInfo.folderChild = assertObj.child; 
					// 当前文件夹下的普通资源
					tagInfo.assertsChild = assertObj.role || assertObj.identifiers;
					tagInfo.type = (assertObj.identifiers ? 'identifiers' : 'role');
					tagInfo.id = assertObj.id; // 呈现物的第一层
				}
				console.log('当前标签下的资源信息是: -- ---- ', tagInfo);
				this.$store.dispatch('changeCurAssertTag', tagInfo)
			},
			checkIsActiveClass (id, type) {
				return {
					'tag-active': id == this.curActiveTag.id && type == this.curActiveTag.type
				}
			}
		}
	}
</script>