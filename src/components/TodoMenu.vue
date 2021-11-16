<style src='../assets/style.css'/>

<template>
    <div class='menu-wrapper'>
        <span class='menu-add-container' v-on:click='showInputModal = true'>
            <i class='menu-add-button fas fa-plus' aria-hidden='true'/>
        </span>

        <span class='menu-clear-container' v-on:click='ClearToDo'>
            <i class='menu-clear-button fas fa-trash-alt' aria-hidden='true'/>
        </span>

        <modal v-if='showInputModal == true' v-on:close='showInputModal = false'>
            <h3 slot='modal-header'>To-Do</h3>

            <span slot='modal-body'>
                <b>[TITLE]</b><br/>
                <input type='text' v-model='todoTitle' placeholder='TITLE' v-on:keyup.enter='AddToDo'><br/>

                <b>[CONTENT]</b><br/>
                <textarea v-model='todoContent' placeholder='CONTENT'></textarea><br/>

                <b>[DUE DATE]</b><br/>
                <datepicker calendar-class='calendar' v-model='todoDueDate' placeholder='0000-00-00' format='yyyy-MM-dd'></datepicker><br/>
            </span>

            <span slot='modal-footer'>
                <i style='color:green' class='modal-button fas fa-check' aria-hidden='true' v-on:click='AddToDo'/>
                <i style='color:red' class='modal-button fas fa-times' aria-hidden='true' v-on:click='showInputModal = false'/>
            </span>
        </modal>

        <modal v-if='showTitleWarning == true' v-on:close='showTitleWarning = false'>
            <h3 slot='modal-header'>Warning</h3>

            <span slot='modal-body'>
                <b>Please Enter Title</b>
                <i style='color:red' class='modal-button fas fa-times' aria-hidden='true' v-on:click='showTitleWarning = false'/>
            </span>
        </modal>

        <modal v-if='showContentWarning == true' v-on:close='showContentWarning = false'>
            <h3 slot='modal-header'>Warning</h3>

            <span slot='modal-body'>
                <b>Please Enter Content</b>
                <i style='color:red' class='modal-button fas fa-times' aria-hidden='true' v-on:click='showContentWarning = false'/>
            </span>
        </modal>

        <modal v-if='showDueDateWarning == true' v-on:close='showDueDateWarning = false'>
            <h3 slot='modal-header'>Warning</h3>

            <span slot='modal-body'>
                <b>Please Enter Valid Due Date</b>
                <i style='color:red' class='modal-button fas fa-times' aria-hidden='true' v-on:click='showDueDateWarning = false'/>
            </span>
        </modal>
    </div>
</template>

<script>
import { STATE }      from '../assets/constant.js'
import { IMPORTANCE } from '../assets/constant.js'

import Datepicker     from 'vuejs-datepicker'
import Modal          from './common/Modal.vue'
import moment         from 'moment'

export default {
    data() {
        return {
            todoTitle: '',
            todoContent: '',
            todoDueDate: '',

            showInputModal: false,
            showTitleWarning: false,
            showContentWarning: false,
            showDueDateWarning: false
        }
    },

    methods: {
        AddToDo() {
            this.todoDueDate = moment(this.todoDueDate).format('YYYY-MM-DD');

            if (this.todoTitle === '') {
                this.showTitleWarning = true;
            }
            else if (this.todoContent === '') {
                this.showContentWarning = true;
            }
            else if (this.todoDueDate === '' || !this.CheckValidDate(this.todoDueDate)) {
                this.showDueDateWarning = true;
            }
            else {
                var todoTitleValue   = this.todoTitle   && this.todoTitle.trim();
                var todoContentValue = this.todoContent && this.todoContent.trim();
                var todoDueDateValue = this.todoDueDate && this.todoDueDate.trim();

                this.showInputModal = false;
                this.$store.dispatch('AddToDo', { todoState: STATE.TODO, todoImportance: IMPORTANCE.LOW, todoTitle: todoTitleValue, todoContent: todoContentValue, todoDueDate: todoDueDateValue });
                this.ClearInput();
            }
        },

        ClearToDo() {
            this.$store.dispatch('ClearToDo');
        },

        ClearInput() {
            this.todoTitle   = '';
            this.todoContent = '';
            this.todoDueDate = '';
        },

        CheckValidDate(dateString) {
            var dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            var date      = null;

            if (!dateString.match(dateRegex)) {
                return false;
            }

            date = new Date(dateString);

            if (Number.isNaN(date.getTime())) {
                return false;
            }

            return date.toISOString().slice(0, 10) === dateString;
        }
    },

    components: {
        Datepicker: Datepicker,
        Modal: Modal
    }
}
</script>