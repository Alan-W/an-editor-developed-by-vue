import { Action } from '../action'
import SubmitObjPropsApis from '../../store/apis/submitObjPropsApi'


// 创建新地点的action
var DeleteLocAction =  class DeleteLocAction extends Action {
	constructor(locsList, locObj) {

		super( 'DeleteLocAction', 'set value');
		this.locsList = locsList; // 当前组左侧的文件树列表
		this.locObj = locObj;
		this.findLoc = null;
		console.log('当前操作的地点数组是: ------ ', )
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
	}
	

	// undo the action
	excute () {
		var that = this;
		
		if (parseInt(this.locObj.parent_id) == 0) {
			var findResult = this.locsList.findIndex(function(data) {
				return data.id == that.locObj.id;
			});
			console.log('DeleteLocAction.js-----undo func ,findResult is : ----- ', findResult);
			if (findResult !== -1) this.locsList.splice(findResult, 1);
			
		} else {
			var loc = this.getOperLocArray();
			if (loc) {
				var childLocFindResult = loc.child.findIndex(function(data) {
					return data.id == that.locObj.id;
				});
				console.log('DeleteLocAction.js-----undo func ,childLocFindResult is : ----- ', childLocFindResult);
				if (childLocFindResult !== -1) loc.child.splice(childLocFindResult, 1);
			}
		};

		// 提交删除地点的接口
		SubmitObjPropsApis.deleteLoc(that.locObj.id);
			
	}

	// push the DeleteLocAction to the actions stacks;
	undo () {

		if (parseInt(this.locObj.parent_id) == 0) {
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

		SubmitObjPropsApis.createNewLoc(this.locObj.name, this.locObj.parent_id, this.newLocObj);
	}

	redo () {
		this.excute();
	}

	getOperLocArray (locsArray) {
		var findThisLoc = null;
		var locs = locsArray ? locsArray : this.locsList;
		for (var i = 0; i < locs.length; i++) {
			var loc = locs[i];
			if (loc.id == this.locObj.parent_id) {
				this.findLoc = loc;
				console.log('找到的loc 是: ----- ', loc);
				break;
			};
			if (loc.child && loc.child.length > 0) this.getOperLocArray(loc.child);
		};

		return this.findLoc;
	}
}

export default DeleteLocAction;