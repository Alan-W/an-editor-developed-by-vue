<template>
	<section class="modal fade in" id="materialSource" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
			<div class="modal-dialog modal-lg" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">×</span>
						</button>
						<h4 class = "modal-title">素材资源</h4>
						<h6 class = "clearfix"><span class ="btn btn-success" id="prevFolder">返回上一级</span></h6>
					</div>
					<div class="modal-body" >
						<ul class="clearfix row fileList" id="materialList"> 
							
						</ul>
					</div>
				
				</div>
			</div>
		</section>
</template>

<script>
	export default {
		 
	}
</script>