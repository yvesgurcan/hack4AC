import Vue from "vue"
import * as M from "./mutationTypes"

const fbApp = Vue.fbApps.app;
const db = fbApp.database()

/* just a type! */
function PathMapEntry({ path, requester, dispatch }) {
    this.path = path;
    this.ref = db.ref(path);
    this.requesters = [requester];
    const onValue = (snap) => {
        const data = snap.val()
        dispatch("setData", { path, data })
        this.requesters.forEach((r) => {
            if(!r)
                return

            if(!r.zsubData){
                r.zsubData = { [path]: data }
            }
            else {
                r.zsubData[path] = data
            }
        })
    }

    this.ref.on("value", onValue)
    this.off = () => this.ref.off("value", onValue)
    return this;
}

function subToPath({ state, commit, dispatch, requester, path }) {
    const { pathMap, data } = state;
    const mapEntry = pathMap[path];
    if(mapEntry) {
        commit(M.PATHMAP_ADD_REQUESTER, { requester, path })
        const val = data[path]
        if(!requester.zsubData) {
            requester.zsubData = { [path]: val }
        }
        else {
            requester.zsubData[path] = val
        }
    }
    else {
        commit(M.PATHMAP_ADD_ENTRY, new PathMapEntry({ path, requester, dispatch }))
        commit(M.INSTANCEMAP_ADD, { requester, path })
    }
}

const actions = {
    subscribe({ state, commit, dispatch }, { requester, subs }) {
        subs.forEach(path => subToPath({ state, commit, dispatch, requester, path }))
    },
    unsubscribe({ state, commit }, { requester }) {
        // go thru the map & find this requester everywhere!
        const { instanceMap, pathMap } = state
        const instanceMapEntry = instanceMap[requester];
        if(!instanceMapEntry){
            return;
        }

        // console.log("Unsub called on", instanceMapEntry)
        instanceMapEntry.forEach((path) => {
            commit(M.PATHMAP_REMOVE_REQUSTER, { path, requester })
            const mapEntry = pathMap[path];
            if(!mapEntry.requesters.length){
                commit(M.PATHMAP_REMOVE_ENTRY, { path })
                commit(M.DATA_SET, { path, data: null })
            }
        })
        commit(M.INSTANCEMAP_REMOVE, { requester })
    },
    setData({ commit }, { path, data }){
        commit(M.DATA_SET, { path, data })
    }
}

export default actions
