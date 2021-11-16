<style src='../assets/style.css'/>

<template>
    <div>
        <draggable v-model='todoItems' :move='MoveToDoOrder'>
            <transition-group name='list' tag='ul'>
                <li v-for='(todoItem, index) in todoItems' :key='index' v-if='filterMask.length == 0 || filterMask[index] == true' class='list-item-wrapper shadow'>
                    <span class='list-state-button' type='button' v-on:click='ChangeToDoState(index)'>
                        <i v-if='todoItem.todoState == STATE_TODO' style='color:red' class='fas fa-times-circle' aria-hidden='true'/>
                        <i v-if='todoItem.todoState == STATE_DOING' style='color:#62ACDE' class='fas fa-chevron-circle-right' aria-hidden='true'/>
                        <i v-if='todoItem.todoState == STATE_COMPLETION' style='color:green' class='fas fa-check-circle' aria-hidden='true'/>
                    </span>

                    <span class='list-importance-button' type='button' v-on:click='ChangeToDoImportance(index)'>
                        <i v-if='todoItem.todoImportance == IMPORTANCE_LOW' class='fas fa-dice-one' aria-hidden='true'/>
                        <i v-if='todoItem.todoImportance == IMPORTANCE_MIDDLE' class='fas fa-dice-two' aria-hidden='true'/>
                        <i v-if='todoItem.todoImportance == IMPORTANCE_HIGH' class='fas fa-dice-three' aria-hidden='true'/>
                    </span>

                    <div class='list-item-container' v-on:click='OpenDetailModal(index)'>
                        <input v-if='todoItem.todoState == STATE_TODO || todoItem.todoState == STATE_DOING' type='text' v-model='todoItem.todoTitle' readonly>
                        <input v-else-if='todoItem.todoState == STATE_COMPLETION' type='text' style='color:#D3D3D3' v-model='todoItem.todoTitle' readonly>
                    </div>

                    <span class='list-copy-button' type='button' v-on:click='CopyToDo(index)'>
                        <i class='far fa-clone' aria-hidden='true'/>
                    </span>

                    <span class='list-edit-button' type='button' v-on:click='OpenEditModal(index)'>
                        <i class='far fa-edit' aria-hidden='true'/>
                    </span>

                    <span class='list-remove-button' type='button' v-on:click='RemoveToDo(index)'>
                        <i class='far fa-trash-alt' aria-hidden='true'/>
                    </span>
                </li>
            </transition-group>
        </draggable>

        <modal v-if='showDetailModal == true' v-on:close='CloseDetailModal()'>
            <h3 slot='modal-header'>To-Do</h3>

            <span slot='modal-body'>
                <b>[TITLE]</b><br/>
                <input type='text' v-model='todoTitle' readonly><br/>

                <b>[CONTENT]</b><br/>
                <textarea v-model='todoContent' readonly></textarea><br/>

                <b>[DUE DATE]</b><br/>
                <input type='text' v-model='todoDueDate' readonly><br/>
            </span>

            <span slot='modal-footer'>
                <i style='color:red' class='modal-button fas fa-times' aria-hidden='true' v-on:click='CloseDetailModal()'/>
            </span>
        </modal>

        <modal v-if='showEditModal == true' v-on:close='CloseEditModal()'>
            <h3 slot='modal-header'>To-Do</h3>

            <span slot='modal-body'>
                <b>[TITLE]</b><br/>
                <input type='text' v-model='todoTitle' placeholder='TITLE' v-on:keyup.enter='EditToDo()'><br/>

                <b>[CONTENT]</b><br/>
                <textarea v-model='todoContent' placeholder='CONTENT'></textarea><br/>

                <b>[DUE DATE]</b><br/>
                <datepicker calendar-class='calendar' v-model='todoDueDate' placeholder='0000-00-00' format='yyyy-MM-dd'></datepicker><br/>
            </span>

            <span slot='modal-footer'>
                <i style='color:green' class='modal-button fas fa-check' aria-hidden='true' v-on:click='EditToDo()'/>
                <i style='color:red' class='modal-button fas fa-times' aria-hidden='true' v-on:click='CloseEditModal()'/>
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
import draggable      from 'vuedraggable'
import Modal          from './common/Modal.vue'
import moment         from 'moment'

export default {
    data() {
        return {
            STATE_TODO: STATE.TODO,
            STATE_DOING: STATE.DOING,
            STATE_COMPLETION: STATE.COMPLETION,

            IMPORTANCE_LOW: IMPORTANCE.LOW,
            IMPORTANCE_MIDDLE: IMPORTANCE.MIDDLE,
            IMPORTANCE_HIGH: IMPORTANCE.HIGH,

            detailIndex: -1,
            editIndex: -1,

            todoTitle: '',
            todoContent: '',
            todoDueDate: '',

            showDetailModal: false,
            showEditModal: false,
            showTitleWarning: false,
            showContentWarning: false,
            showDueDateWarning: false
        }
    },

    computed: {
        todoItems: {
            get() {
                return this.$store.state.todoItems;
            },

            set(value) {
                this.$store.dispatch('ChangeToDoOrder', { todoItems: value });
            }
        },

        filterMask: {
            get() {
                return this.$store.state.filterMask;
            }
        }
    },

    methods: {
        EditToDo() {
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

                this.$store.dispatch('EditToDo', { index: this.editIndex, todoState: this.todoItems[this.editIndex].todoState, todoImportance: this.todoItems[this.editIndex].todoImportance, todoTitle: todoTitleValue, todoContent: todoContentValue, todoDueDate: todoDueDateValue });
                this.CloseEditModal();
            }
        },

        ChangeToDoState(index) {
            this.todoItems[index].todoState = (++this.todoItems[index].todoState) % 3;
            this.$store.dispatch('ChangeToDoState', { index: index, todoState: this.todoItems[index].todoState });
        },

        ChangeToDoImportance(index) {
            this.todoItems[index].todoImportance = (++this.todoItems[index].todoImportance) % 3;
            this.$store.dispatch('ChangeToDoImportance', { index: index, todoImportance: this.todoItems[index].todoImportance });
        },

        MoveToDoOrder() {
            return this.filterMask.length == 0;
        },

        RemoveToDo(removeIndex) {
            this.$store.dispatch('RemoveToDo', { index: removeIndex });
        },

        CopyToDo(copyIndex) {
            this.$store.dispatch('CopyToDo', { index: copyIndex });
        },

        OpenDetailModal(index) {
            this.detailIndex = index;

            this.todoTitle   = this.todoItems[index].todoTitle;
            this.todoContent = this.todoItems[index].todoContent;
            this.todoDueDate = this.todoItems[index].todoDueDate;

            this.showDetailModal = true;
        },

        CloseDetailModal() {
            this.detailIndex = -1;

            this.todoTitle   = '';
            this.todoContent = '';
            this.todoDueDate = '';

            this.showDetailModal = false;
        },

        OpenEditModal(index) {
            this.editIndex = index;

            this.todoTitle   = this.todoItems[index].todoTitle;
            this.todoContent = this.todoItems[index].todoContent;
            this.todoDueDate = this.todoItems[index].todoDueDate;

            this.showEditModal = true;
        },

        CloseEditModal() {
            this.editIndex = -1;

            this.todoTitle   = '';
            this.todoContent = '';
            this.todoDueDate = '';

            this.showEditModal = false;
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
        Draggable: draggable,
        Modal: Modal
    }
}
</script>