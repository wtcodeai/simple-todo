<template>
  <div>
    <div class="container">
      <h1>Simple ToDo</h1>
      <div class="row">
        <div class="col-6">
          <button
            v-if="!newCard"
            class="btn btn-primary mt-4"
            type="button"
            @click="showAddCard()"
          >
            <span>Add todo</span>
          </button>
        </div>
        <div class="col-6">
          Filter todo by type:
          <select
            class="form-control"
            v-model="filter"
          >
            <option :value="null">
              None
            </option>
            <option
              v-for="(type, index) in cardTypes"
              v-bind:value="type.name"
              :key="index"
            >
              {{ type.name }}
            </option>
          </select>
        </div>
      </div>
      <div
        v-if="newCard"
        class="row text-center"
      >
        <div class="col-12 form-group">
          <label for="taskName">Task name</label>
          <input
            v-model="onEdit.name"
            class="form-control"
            id="taskName"
          />
        </div>
        <div class="col-12 form-group">
          <label for="taskText">Task text</label>
          <textarea
            v-model="onEdit.text"
            class="form-control"
            id="taskText"
          />
        </div>
        <div class="col-12 form-group">
          Task type:
          <select
            class="form-control"
            v-model="onEdit.type"
          >
            <option
              v-for="(type, index) in cardTypes"
              v-bind:value="type.name"
              :key="index"
            >
              {{ type.name }}
            </option>
          </select>
        </div>
        <div class="col-12 form-group">
          <button
            class="btn btn-primary float-right"
            type="button"
            @click="addCard(onEdit)"
            :disabled="onEdit.name.length <= 0 || onEdit.text.length <= 0"
          >
            <span>Add todo</span>
          </button>
          <button
            class="btn btn btn-secondary float-right"
            type="button"
            @click="newCard = false"
          >
            <span>Cancel</span>
          </button>
        </div>
      </div>
      <div
        v-if="completedCards.length > 0"
        class="form-check"
      >
        <input
          v-model="completedEnabled"
          type="checkbox"
          class="form-check-input"
          id="enabled"
        >
        <label class="form-check-label" for="enabled">Show completed</label>
      </div>
      <div class="row">
        <div v-bind:class="[completedEnabled && completedCards.length > 0 ? 'col-6' : 'col-12']">
          <div class="row">
            <div
              v-for="(card, index) in notCompletedCards"
              v-bind:class="[completedEnabled && completedCards.length > 0 ? 'col-12' : 'col-6']"
              :key="index"
            >
              <div
                v-if="!card.editing"
                class="m-3 card red-border"
                :style="{'background-color': getCardBackground(card.type)}"
              >
                <div class="card-body">
                  <h3>
                    {{ card.name }}
                  </h3>
                  <p>
                    {{ card.text }}
                  </p>
                  <p>
                    {{ 'Date created: ' + (new Date(card.dateCreated)).toUTCString()}}
                  </p>
                  <p v-if="card.dateEdited">
                    {{ 'Date edited: ' + (new Date(card.dateEdited)).toUTCString()}}
                  </p>
                  <button
                    class="btn btn-primary"
                    type="button"
                    @click="showEditCard(card)"
                  >
                    <span>Edit</span>
                  </button>
                  <button
                    class="btn btn btn-success"
                    type="button"
                    @click="setCardCompleted(card.id)"
                  >
                    <span>Mark complete</span>
                  </button>
                </div>
              </div>
              <div
                v-if="card.editing"
                class="m-3 card blue-border"
                :style="{'background-color': getCardBackground(card.type)}"
              >
                <div class="card-body">
                  <div class="col-12 form-group">
                    <label for="taskName">Task name</label>
                    <input
                      v-model="onEdit.name"
                      class="form-control"
                      id="taskName"
                    />
                  </div>
                  <div class="col-12 form-group">
                    <label for="taskText">Task text</label>
                    <textarea
                      v-model="onEdit.text"
                      class="form-control"
                      id="taskText"
                    />
                  </div>
                  <div class="col-12 form-group">
                    Task type:
                    <select
                      class="form-control"
                      v-model="onEdit.type"
                    >
                      <option
                        v-for="(type, index) in cardTypes"
                        v-bind:value="type.name"
                        :key="index"
                      >
                        {{ type.name }}
                      </option>
                    </select>
                  </div>
                  <button
                    class="btn btn-primary"
                    type="button"
                    @click="cancelEdit(card)"
                  >
                    <span>Cancel</span>
                  </button>
                  <button
                    class="btn btn-success"
                    type="button"
                    @click="editCard(onEdit, card.id)"
                  >
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="completedEnabled && completedCards.length > 0"
          class="col-6"
        >
          <div class="row">
            <div
              v-for="(card, index) in completedCards"
              class="col-12"
              :key="index"
            >
              <div
                class="m-3 card green-border"
                :style="{'background-color': getCardBackground(card.type)}"
              >
                <div class="card-body">
                  <h3>
                    {{ card.name }}
                  </h3>
                  <p>
                    {{ card.text }}
                  </p>
                  <p>
                    {{ 'Date created: ' + (new Date(card.dateCreated)).toUTCString()}}
                  </p>
                  <p v-if="card.dateEdited">
                    {{ 'Date edited: ' + (new Date(card.dateEdited)).toUTCString()}}
                  </p>
                  <button
                    class="btn btn-danger"
                    type="button"
                    @click="deleteCard(card.id)"
                  >
                    <span>Delete</span>
                  </button>
                  <button
                    class="btn btn-warning"
                    type="button"
                    @click="setCardIncompleted(card.id)"
                  >
                    <span>Mark incomplete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import firebase from 'firebase/app'
import 'firebase/firestore'

const db = firebase.initializeApp({
  apiKey: 'AIzaSyDh5Ds5rVSzxNhQQmqcseMh4j3QC5Aw8ws',
  authDomain: 'pet-todo.firebaseapp.com',
  databaseURL: 'https://pet-todo.firebaseio.com',
  projectId: 'pet-todo',
  storageBucket: 'pet-todo.appspot.com',
  messagingSenderId: '216648045113',
  appId: '1:216648045113:web:55bfc415b0a0219a76b3e8'
}).firestore()

export default {
  name: 'ToDoList',
  data () {
    return {
      cards: [],
      types: [],
      newCard: false,
      completedEnabled: false,
      filter: null,
      onEdit: {
        name: '',
        text: '',
        type: 'other'
      }
    }
  },
  firestore: {
    cards: db.collection('todosapp'),
    types: db.collection('types')
  },
  computed: {
    notCompletedCards () {
      return this.cards.filter(card => !card.completed && (this.filter ? card.type === this.filter : true))
    },
    completedCards () {
      return this.cards.filter(card => card.completed && (this.filter ? card.type === this.filter : true))
    },
    cardTypes () {
      return this.types
    }
  },
  methods: {
    getCardBackground (type) {
      if (this.cardTypes.length > 0) return this.cardTypes.find(cardType => cardType.name === type).color
    },
    showAddCard () {
      this.newCard = true
      if (this.notCompletedCards.length > 0) {
        this.notCompletedCards.forEach(element => {
          element.editing = false
        })
      }
      this.onEdit = {
        name: '',
        text: '',
        type: 'other'
      }
    },
    addCard (data) {
      let id = Math.random().toString(36).substr(2, 9)
      let dateCreated = +new Date()
      db.collection('todosapp').doc(id).set({ ...data, id, dateCreated }).then(() => {
        this.newCard = false
      })
    },
    showEditCard (card) {
      this.newCard = false
      this.notCompletedCards.forEach(el => {
        if (el.id === card.id) {
          this.$set(el, 'editing', true)
        } else {
          this.$set(el, 'editing', false)
        }
      })
      this.onEdit = {
        name: card.name,
        text: card.text,
        type: card.type
      }
    },
    editCard (data, id) {
      let dateEdited = +new Date()
      db.collection('todosapp').doc(id).update({ ...data, dateEdited })
    },
    cancelEdit (card) {
      this.$set(card, 'editing', false)
    },
    setCardCompleted (id) {
      db.collection('todosapp').doc(id).update({ completed: true })
    },
    setCardIncompleted (id) {
      db.collection('todosapp').doc(id).update({ completed: false })
    },
    deleteCard (id) {
      db.collection('todosapp').doc(id).delete()
    }
  }
}
</script>

<style scoped>
.red-border {
  border: 1px red solid
}
.green-border {
  border: 1px green solid
}

.blue-border {
  border: 1px blue solid
}
</style>
