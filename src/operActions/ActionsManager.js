// 该文件夹放置整个编辑器操作的actions


var ActionsManager =  class ActionsManager {
	constructor() {
			// this.actionsStack = [];
			this.undos = []; // save the undo cmds
			this.redos = []; // save the redo cmds
			this.actions = [];
			this.curPosition = -1; // savr the cur cmd index
			// this.prevPosition = -1; // save tht preve cmd index
			this.canRedo = false;
			this.canUndo = false; // whether has thr history
			this.idCounter = -1; // save the actions count
			this.curActionID = null; // 保存当前正在操作的action的ID
		}

	// excute the action cmd
	excute (action, optionName) {
		var lastAction = this.undos[ this.undos.length - 1 ];
		// console.log('ActionsManager.js----------EXCUTE当前执行的命令是： ------ ', action);
		// add the new actions to the undos array
		$('#undoBtn').parent('li').addClass('active');

		var isUpdatableAction = lastAction &&
			// lastAction.updatable &&
			action.updatable &&
			// lastAction.object === action.object &&
			lastAction.type === action.type

		if (isUpdatableAction) { // 同一个命令更改值
			// lastAction.update();
		} else {// 新增加的命令ID
			// action.id = ++ this.idCounter;
		}

		// set the canUndo value
		this.canUndo = true;
		this.undos.push(action);
		console.log('当前的操作数组是i: ------- ', this.undos);

		// invoke the cmd func
		action.excute();

		// clear the redo array when excute
		this.redos = [];
	}

	// undo the action(又撤销才会有重做)
	undo () {
		var act = undefined;
		console.log('UNDO 中操作数组是:------ ', this.undos);
		if (this.undos.length > 0) { //  judge whether can undo 
			// this.undos.pop(); // 当前的步骤
			act = this.undos.pop();
			console.log('上一步的操作是i: ------ ', act);

			if (this.undos.length == 0) {
				$('#undoBtn').parent('li').removeClass('active');
			}
		} else {
			$('#undoBtn').parent('li').removeClass('active');
			return;
		};

		if (act !== undefined) {
			act.undo(); // 执行具体命令的undo 函数
			this.redos.push(act); // 将当前撤销的命令加入redo 的数组
			$('#redoBtn').parent('li').addClass('active');
			if (this.redos.length > 0) {
				$('#redoBtn').parent('li').addClass('active');
			} else {
				return;
				$('#redoBtn').parent('li').removeClass('active');
			}
		};

		return act;
	}

	// redo the action
	redo () {

		var act = undefined;
		console.log('当前的REDO 数组是: ------------ ', this.redos);
		if (this.redos.length == 0) {
			$('#redoBtn').parent('li').removeClass('active');
			return;
		} else {
			$('#redoBtn').parent('li').addClass('active');
			act = this.redos.pop(); // get the last redo action
		};

		if (act !== undefined) {
			act.excute();
			if (this.redos.length == 0) {
				$('#redoBtn').parent('li').removeClass('active');
				return;
			} else {
				$('#redoBtn').parent('li').addClass('active');
				// act = this.redos.pop(); // get the last redo action
			};
			this.undos.push(act); // 重做的时候将重做的命令加入redo命令数组
		};

		return act;
	}

	// whether can undo
	canUndo () {
		if (this.curPosition == -1) return false;
		return true;
	}

	// whether can redo
	canRedo () {
		if (this.prevPosition == -1) return false;
		return true;
	}
}

export default ActionsManager;


