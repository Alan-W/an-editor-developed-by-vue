import Editory from '../../components/3DmapEditor/editory'
import Threeviewport from '../../components/3DmapEditor/Threeviewport'
import * as MutationTypes from '../mutation-types';

function traverseLocation (array,editory) {
    for(var i=0;i<array.length;i++){
        //通知场景标注景点
        editory.addFromTwo(array[i]);
        //遍历景点下的模型
        for(var j=0,n=array[i].locationRoles.length;j<n;j++){
            //通知场景标注模型
            var modelobj = array[i].locationRoles[j];
            if(modelobj.type==1){
                //console.log("模型属性数据",modelobj);
                editory.bindModel( array[i].id, modelobj);
            }
        }
        
        //遍历子景点
        if(array[i].child&&array[i].child.length>0){
            //arguments.callee(array.child);
            traverseLocation(array[i].child,editory);
        }

    } 
}

const state = {
    locationList: null,
    curOrgInfo: null,
    editory: null,
    viewport: null,
}

const getters = {
    getLoc: state => state.locationList,
}

const mutations = {
    //初始化场景
    [MutationTypes.INIT_THREE] (state, rootStore) {
        state.locationList = rootStore.state.FileTreeModule.locationList;
        state.curOrgInfo = rootStore.state.AMapModule.orgInfo;
        state.editory = new Editory();
        state.viewport = Threeviewport( state.editory, rootStore);
        console.log("初始化的editory",state.editory);
        console.log("getters属性",getters.getLoc);
        state.editory.addBaseMap(state.curOrgInfo);
        traverseLocation( state.locationList, state.editory );
    },
    //更改 transformControls mode
    [MutationTypes.CHANGE_MODE] (state, cureditmode, btnename) {
        if(cureditmode=='3DmapEditor'){
            state.editory.signals.transformModeChanged.dispatch( btnename );
        }
    }
}

const actions = {
    initThree ({state,commit,rootState},rootStore) {
        commit(MutationTypes.INIT_THREE,rootStore)
    },
}
export default {
    state,
    mutations,
    actions
}