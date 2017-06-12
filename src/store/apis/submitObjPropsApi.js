import globalConfig from '../dataConfig/globalConfig'

export default {
	// 提交地图的默认属性
	submitMapProps (id, prop, value) {
		var that = this;
		var submitData = {};
		submitData[prop] = value;

		console.log('提交地图的数据是: ---- ', submitData);
		$.ajax({
			url: globalConfig.apiUrl + 'index.php?r=organization/update&id='+id,
			type: 'POST',
			data: submitData
		})
		.done(function(resp) {

			console.log("submitObjPropsApi: --- submitMapProps------success: --- ", resp);
		})
		.fail(function(xhr) {
			console.log("submitObjPropsApi------submitMapProps : error", xhr);
		});
	},

	// 提交地点的默认属性
	submitLocProps (id, prop, value) {
		var submitData = {};
		submitData[prop] = value;
		console.log('修改地点属性, 提交的数据是: ----- ', submitData);
		$.ajax({
			url: globalConfig.apiUrl + 'index.php?r=location/update&id=' + id,
			type: 'POST',
			data: submitData,
		})
		.done(function(resp) {
			console.log("submitObjPropsApi.js- ----submitLocProps() 成功的返回值 : ----- ", resp);
		})
		.fail(function(xhr) {
			console.log("submitObjPropsApi.js- ----submitLocProps() 失败的返回值: ---- ", xhr);
		});
	},

	// 提交标志物的属性
	submitIdentifyProps (id, prop, value) {
		var submitData = {};
		submitData[prop] = value;
		$.ajax({
			url: globalConfig.apiUrl + 'index.php?r=identifier/update&id='+ id,
			type: 'POST',
			data: submitData,
		})
		.done(function(resp) {
			console.log("submitObjPropsApi.js- ----submitIdentifyProps() 成功的返回值: ---- ", resp);
		})
		.fail(function(xhr, e, t) {
			console.log("submitObjPropsApi.js- ----submitIdentifyProps() 失败的返回值: ---- ", xhr);
		});
	},

	// 提交呈现物的默认属性
	submitRoleProps (id, prop, value) {
		var submitData = {};
		submitData[prop] = value;
		$.ajax({
			url: globalConfig.apiUrl + 'index.php?r=role/update&id='+ id,
			type: 'POST',
			data: submitData
		})
		.done(function(resp) {
			console.log('submitObjPropsApi.js- ----submitRoleProps() 成功的返回值: ---- ', resp);
		})
		.fail(function(xhr, e, t) {
			console.log('submitObjPropsApi.js- ----submitRoleProps() 失败的返回值: ', xhr);
		});
	},

	// 提交LBS呈现物的三维属性数据(呈现物分为LBS呈现物和标志物绑定的呈现物)
	submitLBSRoleThreedProps (bindID, prop, value) {
		var that = this;
		console.log('当前修改的属性是: ----- ', prop);
		console.log('当前的绑定ID 是: ---- ', bindID);
		console.log('当前要提交的LBS 属性的数据是: ---- ', value);

		var submitData = {
			r: 'organization/static',
			fields: null,
			expand: 'editorUpdateProperty',
			oid: globalConfig.oid,
			type: 1, // type 为1 代表当前的呈现物类型是地点绑定的
			bind_id: bindID,
		};
		submitData[prop] = value;
		console.log('submitLBSRoleThreedProps 属性向后台提交的数据是: ---- ', submitData);

		$.ajax({
			url: globalConfig.apiUrl,
			type: 'GET',
			data: submitData
		})
		.done(function(resp) {
			console.log("submitLBSRoleThreedProps--------resp", resp);
			if (resp && resp.editorUpdateProperty && resp.editorUpdateProperty.success) {
				console.log('提交标志物绑定的呈现物三维属性数据成功的返回值是:-------- ', resp);
			}
		})
		.fail(function(xhr) {
			console.log("submitLBSRoleThreedProps--------- error()", xhr);
			console.log('提交LBS呈现物三维属性数据失败的原因是----- ', xhr);
		});
	},

	// 提交标志物绑定的呈现物的三维属性数据(呈现物分为LBS呈现物和标志物绑定的呈现物)
	submitIdentifyBindRoleThreedProps (identifyID, roleID, prop, value) {
		var that = this;
		console.log('当前修改的属性是: ----- ', prop);
		console.log('当前的绑定ID 是: ---- ', roleID);
		console.log('当前要提交的LBS 属性的数据是: ---- ', value);

		var submitData = {
			r: 'organization/static',
			fields: 'null',
			expand: 'editorUpdateProperty',
			oid: globalConfig.oid,
			type: 2,
			identifier_id: identifyID,
			role_id: roleID
		};
		submitData[prop] = value;
		console.log('submitIdentifyBindRoleThreedProps 属性向后台提交的数据是: ---- ', submitData);

		$.ajax({
			url: globalConfig.apiUrl,
			type: 'GET',
			data: submitData
		})
		.done(function(resp) {
			console.log("submitIdentifyBindRoleThreedProps--------resp", resp);
			if (resp && resp.editorUpdateProperty && resp.editorUpdateProperty.success) {
				console.log('提交标志物绑定的呈现物三维属性数据成功的返回值是:-------- ', resp);
			}
		})
		.fail(function(xhr) {
			console.log("submitIdentifyBindRoleThreedProps--------- error()", xhr);
			console.log('提交标志物绑定的呈现物三维属性数据失败的原因是----- ', xhr);
		});
	},

	// 左侧机构绑定关系提交
	orgBindSubmit (bindType, locID, dragID, roleObj) {
		var submitData = {
			r: 'organization/static',
			fields: null,
			expand: 'setBindLocation',
			oid: globalConfig.oid,
			location_id: locID,
		};
		submitData[bindType] = dragID;
		console.log('绑定关系提交的数据是: ------ ', submitData);
		$.ajax({
			url: globalConfig.apiUrl,
			type: 'GET',
			data: submitData,
		})
		.done(function(resp) {
			console.log('submitObjPropsApi.js- ---- orgBindSubmit:success()', resp);
			if (resp && resp.setBindLocation && resp.setBindLocation.success) {
				console.log('绑定成功！');
				if (roleObj) roleObj.bind_id = resp.setBindLocation.data;
			}
		})
		.fail(function(xhr) {
			console.log("submitObjPropsApi.js- ---- orgBindSubmit:error", xhr);
		});
		
	},

	// 左侧关系解绑提交
	orgUnBindSubmit (dragType, locID, dragID) {
		var delInfo = {
			r: 'organization/static',
			fields: 'null',
			expand: 'setUnBindLocation',
			oid: globalConfig.oid,
			location_id: locID,
		};
		delInfo[dragType] = dragID;
		console.log('解绑关系时提交的数据是: --- ---- ', delInfo);
		$.ajax({
			url: globalConfig.apiUrl,
			type: 'GET',
			data: delInfo
		})
		.done(function(resp) {
			console.log("submitObjPropsApi.js------orgUnBindSubmit:success()", resp);
		})
		.fail(function(xhr) {
			console.log("submitObjPropsApi.js------orgUnBindSubmit:error()", xhr);
		});
	},

	// 标志物绑定呈现物的数据提交(单拉出来为了调用清楚)
	identifyBindRoleSubmit (locID, identifyID, roleObj) {
		$.ajax({
			url: globalConfig.apiUrl,
			type: 'GET',
			data: {
				r: 'organization/static',
				fields: null,
				expand: 'setBindLocation',
				oid: globalConfig.oid,
				location_id: locID,
				identifier_id: identifyID,
				role_id: roleObj.id
			},
		})
		.done(function(resp) {
			console.log("submitObjPropsApi.js------orgUnBindSubmit:success()", resp);
			if (resp && resp.setBindLocation && resp.setBindLocation.success) {
				roleObj.bind_id = resp.setBindLocation.data.id;
				console.log('标志物绑定呈现物成功!');
			} else alert(resp.setBindLocation.errcode);
		})
		.fail(function(xhr) {
			console.log("submitObjPropsApi.js------orgUnBindSubmit:error()", xhr);
		});
	},

	// 标志物解绑呈现物
	identifyUnBindRoleSubmit (locID, identifyID, roleID) {
		$.ajax({
			url: globalConfig.apiUrl,
			type: 'GET',
			data: {
				r: 'organization/static',
				fields: 'null',
				expand: 'setUnBindLocation',
				oid: globalConfig.oid,
				location_id: locID,
				identifier_id: identifyID,
				role_id: roleID
			}
		})
		.done(function(resp) {
			console.log("submitObjPropsApi.js------identifyUnBindRoleSubmit:success()", resp);
			console.log('标志物解绑呈现物成功！');
		})
		.fail(function(xhr) {
			console.log("submitObjPropsApi.js------identifyUnBindRoleSubmit:error()", xhr);
		});
	},

	// 创建新地点的接口
	createNewLoc (locName, parentID, newLocObj) {
		var that = this;
		$.ajax({
			url: globalConfig.apiUrl + 'index.php?r=location/create',
			type: 'POST',
			async: false,
			data: {
				name: locName,
				parent_id: parentID,
				oid: globalConfig.oid,
			},
		})
		.done(function(resp) {
			console.log("submitObjPropsApi-----createNewLoc:success()创建景点成功的返回值是: ---- ", resp);
			if (resp) {
				newLocObj.id = resp.id;
				newLocObj.parent_id = parentID;
				newLocObj.name = locName;
				newLocObj.oid = globalConfig.oid;
			}
			
		})
		.fail(function(xhr) {
			console.log("submitObjPropsApi-----createNewLoc:error()创建地点失败的返回值是: ---- ", xhr);
		});
	},

	// 删除地点的接口
	deleteLoc (id) {
		$.ajax({
			url: globalConfig.apiUrl + 'index.php',
			type: 'GET',
			data: {
				r: 'organization/static',
				fields: 'null',
				expand: 'delEditorLocation',
				location_id: id
			},
		})
		.done(function(resp) {
			if (resp && resp.delEditorLocation && resp.delEditorLocation.success) {
				console.log('submitObjPropsApi ----- deleteLoc:success()');
			} else {
				console.log('删除地点失败！');
			}
		})
		.fail(function(xhr) {
			console.log("删除地点失败的返回值是: 0---- ", xhr);
		});
	},
}