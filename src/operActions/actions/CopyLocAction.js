'use strict';


// 复制操作的action
var CopyLocAction = class CopyLocAction extends Action {
	constructor(locID) {
		super( 'CopyLocAction', 'copy loc');
		this.locID = locID;
	}

	// push the CopyLocAction to the actions stacks;
	excute () {
		
	}


	// undo the action
	undo () {
	}

	redo () {
		this.excute();
	}

}
