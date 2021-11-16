<style src='../assets/style.css'/>

<template>
    <div class='login-wrapper'>
        <div class='login-container shadow'>
            <b>LOGIN</b>

            <button class='button google' v-on:click='LoginWithGoogle()'>
                <span class='fab fa-google'></span> Google
            </button>

            <button class='button github' v-on:click='LoginWithGithub()'>
                <span class='fab fa-github'></span> GitHub
            </button>
        </div>
    </div>
</template>

<script>
import { AUTH_PROVIDER } from '../assets/constant.js'

import { authReference } from '../store/database.js'

export default {
    beforeCreate() {
        authReference.onAuthStateChanged((user) => {
            if (user) {
                this.$router.push('/content');
            }
        });
    },

    methods: {
        LoginWithGoogle() {
            this.$store.dispatch('Login', { authProvider: AUTH_PROVIDER.GOOGLE });
        },

        LoginWithGithub() {
            this.$store.dispatch('Login', { authProvider: AUTH_PROVIDER.GITHUB });
        }
    }
}
</script>