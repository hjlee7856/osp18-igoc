<style src='../../assets/style.css'/>

<template lang='html'>
    <transition name='modal'>
        <div class='modal-mask' v-on:keyup.esc='$emit("close")'>
            <div class='modal-wrapper'>
                <div class='modal-container'>
                    <div class='modal-header'>
                        <slot name='modal-header'>
                        </slot>
                    </div>

                    <div class='modal-body'>
                        <slot name='modal-body'>
                        </slot>
                    </div>

                    <div class='modal-footer'>
                        <slot name='modal-footer'>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>