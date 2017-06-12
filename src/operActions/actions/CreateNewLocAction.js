import { Action } from '../action'
import SubmitObjPropsApis from '../../store/apis/submitObjPropsApi'


// 创建新地点的action
var CreateNewLocAction =  class CreateNewLocAction extends Action {
	constructor(locsList, locName, parentID) {

		super( 'CreateNewLocAction', 'set value');
		this.locsList = locsList; // 当前组左侧的文件树列表
		this.locName = locName;
		this.parentID = parentID;
		this.newLocObj = {
			id: null,
	        parent_id: null,
	        oid: null,
	        name: null,
	        pano_id: null,
	        logo: null,
	        longitude: null,
	        latitude: null,
	        desc: "",
	        type_id: null,
	        scope_type: 1,
	        scope: 30,
	        scope_width: 30,
	        lock: 0,
	        panorama: null,
	        locationRoles: [],
	        identifiers: [],
	        child: []
		};
		this.findLoc = null;
		console.log('当前操作的地点数组是: ------ ', )
	}

	// push the CreateNewLocAction to the actions stacks;
	excute () {

		if (parseInt(this.parentID) == 0) {
			this.locsList.push(this.newLocObj);
			// 左侧的滚动条滚动到创建的地点位置
			if (document.getElementById('orglocsList')) {
				$('#orglocsList').animate({
				    scrollTop: $('#orglocsList')[0].scrollHeight
				});
			}
		} else {
			var findLocObj = this.getOperLocArray();
			console.log('找到的结果是: ----- ', findLocObj);
			findLocObj && findLocObj.child.push(this.newLocObj);
		}

		SubmitObjPropsApis.createNewLoc(this.locName, this.parentID, this.newLocObj);
	}

	// undo the action
	undo () {
		var that = this;
		var r = confirm('确定删除该地点吗?');
		if (r) {
			if (this.newLocObj.identifiers.length > 0 || this.newLocObj.locationRoles.length > 0) {
				alert('当前地点绑定了对象, 不允许删除！');
				return false;
			} else {
				if (parseInt(this.parentID) == 0) {
					var findResult = this.locsList.findIndex(function(data) {
						return data.id == that.newLocObj.id;
					});
					console.log('CreateNewLocAction.js-----undo func ,findResult is : ----- ', findResult);
					if (findResult !== -1) this.locsList.splice(findResult, 1);
					
				} else {
					var loc = this.getOperLocArray();
					if (loc) {
						var childLocFindResult = loc.child.findIndex(function(data) {
							return data.id == that.newLocObj.id;
						});
						console.log('CreateNewLocAction.js-----undo func ,childLocFindResult is : ----- ', childLocFindResult);
						if (childLocFindResult !== -1) loc.child.splice(childLocFindResult, 1);
					}
				};

				// 提交删除地点的接口
				SubmitObjPropsApis.deleteLoc(that.newLocObj.id);
			}
		}
	}

	redo () {
		this.excute();
	}

	getOperLocArray (locsArray) {
		var findThisLoc = null;
		var locs = locsArray ? locsArray : this.locsList;
		for (var i = 0; i < locs.length; i++) {
			var loc = locs[i];
			if (loc.id == this.parentID) {
				this.findLoc = loc;
				console.log('找到的loc 是: ----- ', loc);
				break;
			};
			if (loc.child && loc.child.length > 0) this.getOperLocArray(loc.child);
		};

		return this.findLoc;
	}
}

export default CreateNewLocAction;