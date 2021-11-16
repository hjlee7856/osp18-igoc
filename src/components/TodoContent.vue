<style src='../assets/style.css'/>

<template>
    <div>
        <TodoHeader></TodoHeader>
        <TodoMenu></TodoMenu>
        <TodoList></TodoList>
        <TodoFooter></TodoFooter>
    </div>
</template>

<script>
import { authReference } from '../store/database.js'

import TodoHeader        from './TodoHeader.vue'
import TodoMenu          from './TodoMenu.vue'
import TodoList          from './TodoList.vue'
import TodoFooter        from './TodoFooter.vue'

export default {
    beforeCreate() {
        authReference.onAuthStateChanged((user) => {
            if (!user) {
                this.$router.push('/');
            }
            else {
                this.$store.commit('Login', { userID: user.uid });
                this.$store.dispatch('LoadDatabase', { userID: user.uid });
            }
        });
    },

    components: {
        'TodoHeader': TodoHeader,
        'TodoMenu': TodoMenu,
        'TodoList': TodoList,
        'TodoFooter': TodoFooter
    }
}
</script>