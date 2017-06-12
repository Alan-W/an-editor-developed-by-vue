<template>
	<div class="three-mode">
        <div id="threesection"></div>
        <div id="wowoo"></div>
        <div>{{getLoc}}</div>
	</div>

</template>

<script>
    import { mapActions, mapGetters } from 'vuex'
    import '../../assets/style/sass/threeedit.scss'

	export default {
        name: 'scene-edit-block11',
        data () {
            return {};
        },
        mounted () {
            //console.log("初始化3d场景",this.$store);
            //console.log('mounted挂在结束状态',this.$store,this.$store.state);
            this.$store.dispatch('initThree',this.$store);
        },
        methods: {
            ...mapGetters([
                'getLoc'
            ]),
            ...mapActions([
                'changeClickObj'
            ])
        }
	}
</script> 