import { AUTH_PROVIDER }      from '../assets/constant.js'

import { authReference }      from './database.js'
import { databaseReference }  from './database.js'
import { googleAuthProvider } from './database.js'
import { githubAuthProvider } from './database.js'

import Toasted                from 'vue-toasted'
import Vue                    from 'vue'
import Vuex                   from 'vuex'

Vue.use(Toasted);
Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        userID: '',

        todoItems: [],
        filterMask: [],

        searchWord: '',

        selectedStateFilters: [],
        selectedImportanceFilters: []
    },

    mutations: {
        Login: (state, payload) => {
            state.userID = payload.userID;
        },

        Logout: (state) => {
            state.userID = '';
        },

        AddToDo: (state, payload) => {
            state.todoItems.push(payload.todoItem);
            localStorage.setItem(localStorage.length, JSON.stringify(state.todoItems[state.todoItems.length - 1]));
        },

        EditToDo: (state, payload) => {
            state.todoItems[payload.index] = payload.todoItem;
            localStorage.setItem(payload.index, JSON.stringify(state.todoItems[payload.index]));
        },

        ChangeToDoState: (state, payload) => {
            state.todoItems[payload.index].todoState = payload.todoState;
            localStorage.setItem(payload.index, JSON.stringify(state.todoItems[payload.index]));
        },

        ChangeToDoImportance: (state, payload) => {
            state.todoItems[payload.index].todoImportance = payload.todoImportance;
            localStorage.setItem(payload.index, JSON.stringify(state.todoItems[payload.index]));
        },

        ChangeToDoOrder: (state, payload) => {
            if (state.selectedStateFilters.length != 0 || state.selectedImportanceFilters.length != 0) {
                return;
            }

            for (var index = 0; index < localStorage.length; ++index) {
                localStorage.setItem(index, JSON.stringify(payload.todoItems[index]));
            }

            state.todoItems = payload.todoItems;
        },

        RemoveToDo: (state, payload) => {
            for (var index = payload.index; index < localStorage.length - 1; ++index) {
                localStorage.setItem(index, localStorage.getItem(index + 1));
            }

            state.todoItems.splice(payload.index, 1);
            localStorage.removeItem(localStorage.length - 1);
        },

        ClearToDo: (state) => {
            state.todoItems  = [];
            state.filterMask = [];
            localStorage.clear();
        },

        SearchToDo: (state, payload) => {
            state.filterMask = [];
            state.searchWord = payload.searchWord;
        },

        FilterToDo: (state, payload) => {
            state.filterMask                = [];
            state.selectedStateFilters      = payload.selectedStateFilters;
            state.selectedImportanceFilters = payload.selectedImportanceFilters;
        },

        CopyToDo: (state, payload) => {
            navigator.clipboard.writeText('[Title] ' + state.todoItems[payload.index].todoTitle + ' [Content] ' + state.todoItems[payload.index].todoContent + ' [Due Date] ' + state.todoItems[payload.index].todoDueDate);

            Vue.toasted.show('Copied to clipboard', {
                duration: '1500',
                position: 'bottom-center'
            });
        },

        UpdateSearchMask: (state) => {
            if (state.searchWord == '') {
                return;
            }

            for (var itemIndex = 0; itemIndex < state.todoItems.length; ++itemIndex) {
                if (state.selectedStateFilters.length == 0 && state.selectedImportanceFilters.length == 0) {
                    if (state.todoItems[itemIndex].todoTitle.match(state.searchWord) || state.todoItems[itemIndex].todoContent.match(state.searchWord)) {
                        state.filterMask.push(true);
                        continue;
                    }
                    else {
                        state.filterMask.push(false);
                        continue;
                    }
                }

                if (state.filterMask[itemIndex] == true && !state.todoItems[itemIndex].todoTitle.match(state.searchWord) && !state.todoItems[itemIndex].todoContent.match(state.searchWord)) {
                    state.filterMask[itemIndex] = false;
                }
            }
        },

        UpdateFilterMask: (state) => {
            if (state.selectedStateFilters.length == 0 && state.selectedImportanceFilters.length == 0) {
                return;
            }

            for (var itemIndex = 0; itemIndex < state.todoItems.length; ++itemIndex) {
                for (var filterIndex = 0; filterIndex < 3; ++filterIndex) {
                    if (((state.selectedStateFilters.length > filterIndex) ? (state.todoItems[itemIndex].todoState == state.selectedStateFilters[filterIndex]) : (false)) || ((state.selectedImportanceFilters.length > filterIndex) ? (state.todoItems[itemIndex].todoImportance == state.selectedImportanceFilters[filterIndex]) : (false))) {
                        state.filterMask.push(true);
                        continue;
                    }
                }

                if (state.filterMask.length < itemIndex + 1) {
                    state.filterMask.push(false);
                }
            }
        }
    },

    actions: {
        Login(context, payload) {
            if (payload.authProvider == AUTH_PROVIDER.GOOGLE) {
                authReference.signInWithPopup(googleAuthProvider).then((result) => {
                    context.commit('Login', { userID: result.user.uid });
                    databaseReference.doc(result.user.uid).collection('to-do').doc('initial').set({}, { merge: true });
                });
            }
            else if (payload.authProvider == AUTH_PROVIDER.GITHUB) {
                authReference.signInWithPopup(githubAuthProvider).then((result) => {
                    context.commit('Login', { userID: result.user.uid });
                    databaseReference.doc(result.user.uid).collection('to-do').doc('initial').set({}, { merge: true });
                });
            }
        },

        Logout(context) {
            authReference.signOut().then(() => {
                context.commit('Logout');
            });
        },

        LoadDatabase(context, payload) {
            databaseReference.doc(payload.userID).collection('to-do').onSnapshot((snapshot) => {
                context.commit('ClearToDo');

                snapshot.forEach((document) => {
                    var todoItem = new Object();

                    if (document.id == 'initial') {
                        return;
                    }

                    todoItem.todoState      = document.data().todoState;
                    todoItem.todoImportance = document.data().todoImportance;
                    todoItem.todoTitle      = document.data().todoTitle;
                    todoItem.todoContent    = document.data().todoContent;
                    todoItem.todoDueDate    = document.data().todoDueDate;

                    context.commit('AddToDo', { todoItem: todoItem });
                    context.commit('UpdateFilterMask');
                });
            });
        },

        AddToDo(context, payload) {
            var index    = context.state.todoItems.length;
            var todoItem = new Object();

            todoItem.todoState      = payload.todoState;
            todoItem.todoImportance = payload.todoImportance;
            todoItem.todoTitle      = payload.todoTitle;
            todoItem.todoContent    = payload.todoContent;
            todoItem.todoDueDate    = payload.todoDueDate;

            context.commit('AddToDo', { todoItem: todoItem });
            context.commit('UpdateFilterMask');

            databaseReference.doc(context.state.userID).collection('to-do').doc(String(index)).set(todoItem, { merge: true });
        },

        EditToDo(context, payload) {
            var todoItem = new Object();

            todoItem.todoState      = payload.todoState;
            todoItem.todoImportance = payload.todoImportance;
            todoItem.todoTitle      = payload.todoTitle;
            todoItem.todoContent    = payload.todoContent;
            todoItem.todoDueDate    = payload.todoDueDate;

            context.commit('EditToDo', { index: payload.index, todoItem: todoItem });
            context.commit('UpdateFilterMask');

            databaseReference.doc(context.state.userID).collection('to-do').doc(String(payload.index)).set(todoItem, { merge: true });
        },

        ChangeToDoState(context, payload) {
            context.commit('ChangeToDoState', { index: payload.index, todoState: payload.todoState });
            context.commit('UpdateFilterMask');

            databaseReference.doc(context.state.userID).collection('to-do').doc(String(payload.index)).set({ todoState: payload.todoState }, { merge: true });
        },

        ChangeToDoImportance(context, payload) {
            context.commit('ChangeToDoImportance', { index: payload.index, todoImportance: payload.todoImportance });
            context.commit('UpdateFilterMask');

            databaseReference.doc(context.state.userID).collection('to-do').doc(String(payload.index)).set({ todoImportance: payload.todoImportance }, { merge: true });
        },

        ChangeToDoOrder(context, payload) {
            context.commit('ChangeToDoOrder', { todoItems: payload.todoItems });
            context.commit('UpdateFilterMask');

            for (var index = 0; index < payload.todoItems.length; ++index) {
                databaseReference.doc(context.state.userID).collection('to-do').doc(String(index)).set(payload.todoItems[index], { merge: true });
            }
        },

        RemoveToDo(context, payload) {
            var todoItemNumber = context.state.todoItems.length;

            context.commit('RemoveToDo', { index: payload.index });
            context.commit('UpdateFilterMask');

            for (var index = payload.index; index < todoItemNumber - 1; ++index) {
                databaseReference.doc(context.state.userID).collection('to-do').doc(String(index)).set(context.state.todoItems[index], { merge: true });
            }
            databaseReference.doc(context.state.userID).collection('to-do').doc(String(todoItemNumber - 1)).delete();
        },

        ClearToDo(context) {
            var todoItemNumber = context.state.todoItems.length;

            context.commit('ClearToDo');

            for (var index = 0; index < todoItemNumber; ++index) {
                databaseReference.doc(context.state.userID).collection('to-do').doc(String(index)).delete();
            }
        },

        SearchToDo(context, payload) {
            context.commit('SearchToDo', { searchWord: payload.searchWord });
            context.commit('UpdateFilterMask');
            context.commit('UpdateSearchMask');
        },

        FilterToDo(context, payload) {
            context.commit('FilterToDo', { selectedStateFilters: payload.selectedStateFilters, selectedImportanceFilters: payload.selectedImportanceFilters });
            context.commit('UpdateFilterMask');
            context.commit('UpdateSearchMask');
        },

        CopyToDo(context, payload) {
            context.commit('CopyToDo', { index: payload.index });
        }
    }
});