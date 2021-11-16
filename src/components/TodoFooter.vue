<style src='../assets/style.css'/>

<template>
    <footer class='footer-wrapper'>
        <div class='filter-wrapper'>
            <div class='filter-container'>
                <button>
                    <b>IMPORTANCE</b>
                    <i class='fas fa-caret-up'/>
                </button>

                <div class='filter-content'>
                    <div v-on:click='SelectImportanceFilter(IMPORTANCE_LOW)'>
                        <b>Low</b>
                        <i v-if='selectedImportanceFilters.includes(IMPORTANCE_LOW)' class='fas fa-check'/>
                    </div>

                    <div v-on:click='SelectImportanceFilter(IMPORTANCE_MIDDLE)'>
                        <b>Middle</b>
                        <i v-if='selectedImportanceFilters.includes(IMPORTANCE_MIDDLE)' class='fas fa-check'/>
                    </div>

                    <div v-on:click='SelectImportanceFilter(IMPORTANCE_HIGH)'>
                        <b>High</b>
                        <i v-if='selectedImportanceFilters.includes(IMPORTANCE_HIGH)' class='fas fa-check'/>
                    </div>
                </div>
            </div>

            <div class='filter-container'>
                <button>
                    <b>STATE</b>
                    <i class='fas fa-caret-up'/>
                </button>

                <div class='filter-content'>
                    <div v-on:click='SelectStateFilter(STATE_TODO)'>
                        <b>To-Do</b>
                        <i v-if='selectedStateFilters.includes(STATE_TODO)' class='fas fa-check'/>
                    </div>

                    <div v-on:click='SelectStateFilter(STATE_DOING)'>
                        <b>Doing</b>
                        <i v-if='selectedStateFilters.includes(STATE_DOING)' class='fas fa-check'/>
                    </div>

                    <div v-on:click='SelectStateFilter(STATE_COMPLETION)'>
                        <b>Completion</b>
                        <i v-if='selectedStateFilters.includes(STATE_COMPLETION)' class='fas fa-check'/>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
import { STATE }      from '../assets/constant.js'
import { IMPORTANCE } from '../assets/constant.js'

export default {
    data() {
        return {
            STATE_TODO: STATE.TODO,
            STATE_DOING: STATE.DOING,
            STATE_COMPLETION: STATE.COMPLETION,

            IMPORTANCE_LOW: IMPORTANCE.LOW,
            IMPORTANCE_MIDDLE: IMPORTANCE.MIDDLE,
            IMPORTANCE_HIGH: IMPORTANCE.HIGH,

            selectedStateFilters: [],
            selectedImportanceFilters: []
        }
    },

    methods: {
        SelectStateFilter(state) {
            for (var index = 0; index < this.selectedStateFilters.length; ++index) {
                if (this.selectedStateFilters[index] == state) {
                    this.selectedStateFilters.splice(index, 1);
                    this.$store.dispatch('FilterToDo', { selectedStateFilters: this.selectedStateFilters, selectedImportanceFilters: this.selectedImportanceFilters });
                    return;
                }
            }

            this.selectedStateFilters.push(state);
            this.$store.dispatch('FilterToDo', { selectedStateFilters: this.selectedStateFilters, selectedImportanceFilters: this.selectedImportanceFilters });
        },

        SelectImportanceFilter(importance) {
            for (var index = 0; index < this.selectedImportanceFilters.length; ++index) {
                if (this.selectedImportanceFilters[index] == importance) {
                    this.selectedImportanceFilters.splice(index, 1);
                    this.$store.dispatch('FilterToDo', { selectedStateFilters: this.selectedStateFilters, selectedImportanceFilters: this.selectedImportanceFilters });
                    return;
                }
            }

            this.selectedImportanceFilters.push(importance);
            this.$store.dispatch('FilterToDo', { selectedStateFilters: this.selectedStateFilters, selectedImportanceFilters: this.selectedImportanceFilters });
        }
    }
}
</script>