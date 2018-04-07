/* eslint-disable global-require */

import Vue from "vue";
import Vuex from "vuex";
import svc from "shrimp-vue-components";
import example from "./module-example";
// import fbSubscriptions from "./fbSubscriptions";


Vue.use(svc, {
    cms: {
        disable: true
    },
    firebaseAuthentication: {
        fbConfig: {
            apiKey: "AIzaSyBLsueqLNsELcsooFYlqVWHI8wmBzwf9gg",
            authDomain: "warmingn-5dbc7.firebaseapp.com",
            databaseURL: "https://warmingn-5dbc7.firebaseio.com",
            projectId: "warmingn-5dbc7",
            storageBucket: "warmingn-5dbc7.appspot.com",
            messagingSenderId: "435300133523"
        }
    }
})


Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        example,
        fbSubscriptions: require("./fbSubscriptions").default
    }
});

export default store;
