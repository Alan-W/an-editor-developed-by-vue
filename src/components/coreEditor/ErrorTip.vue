<template>
	<div class="alert alert-danger alert-dismissible error-tip-info" role="alert">
		<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
		<h4>{{ error.errorTip }}</h4>
		<p> {{ error.errorReason }} </p>
	</div>
</template>

<script>
	import { mapState } from 'vuex'

	export default {
		name: 'ErrorTip',
		computed: {
			...mapState({
				errorInfo: state => state.errorInfoObj,
			}),

			error () {
				return {
					errorTip: this.errorInfo && this.errorInfo.tip,
					errorReason: this.errorInfo && this.errorInfo.reason
				}
			}
			
		},
	}
</script>