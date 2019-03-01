<template>
  <div>
    <template v-if="mode === MODE_LIST">
      <div class="fab">
        <button
          class="mdc-fab"
          aria-label="Добавить заметку"
          title="Добавить заметку"
          @click="showForm"
        >
          <span class="mdc-fab__icon material-icons">add</span>
        </button>
      </div>
      <div class="list">
        <progress-circular
          v-if="loading"
        />
        <ul
          v-if="list"
          class="mdc-list mdc-list--two-line"
        >
          <li
            v-for="(o, i) in list"
            :key="`item-${i}`"
            class="mdc-list-item"
            @click="showNote(o)"
          >
            <span class="mdc-list-item__text">
              <span class="mdc-list-item__primary-text">{{ o.content }}</span>
              <span class="mdc-list-item__secondary-text">{{ o.date.toLocaleDateString() }}</span>
            </span>
          </li>
        </ul>
      </div>
    </template>
    <template v-if="mode === MODE_FORM">
      <div class="form">
        <h2>
          <button
            @click="showList"
            class="mdc-icon-button"
            aria-label="Вернуться"
            aria-hidden="true"
            aria-pressed="false"
          >
            <i class="material-icons mdc-icon-button__icon">arrow_back</i>
          </button>
          Новая заметка
        </h2>
        <mdc-textarea
          label="Заметка"
          v-model="form.content"
          rows="10"
          autofocus="autofocus"
          required
        />
        <mdc-button
          :loading="loading"
          @click="saveNote"
        >
          Сохранить
        </mdc-button>
      </div>
    </template>
    <template v-if="mode === MODE_NOTE">
      <h2>
        <button
          @click="showList"
          class="mdc-icon-button"
          aria-label="Вернуться"
          aria-hidden="true"
          aria-pressed="false"
        >
          <i class="material-icons mdc-icon-button__icon">arrow_back</i>
        </button>
        {{ note.date.toLocaleDateString() }}
      </h2>
      <p v-html="note.parsedContent"/>
    </template>
  </div>
</template>

<script>
  import { firestore } from '@/config'
  import ProgressCircular from '@/components/common/progress-circular'
  import MdcTextarea from '@/components/mdc/textarea'
  import MdcButton from '@/components/mdc/button'
  import NoteModel from '@/models/note'

  export default {
    components: {
      MdcTextarea,
      MdcButton,
      ProgressCircular
    },

    name: 'VehicleNotes',
    props: ['vehicle'],

    data () {
      return {
        MODE_LIST: 'list',
        MODE_FORM: 'form',
        MODE_NOTE: 'note',
        mode: 'list',
        list: [],
        note: null,
        form: null,
        loading: false
      }
    },

    computed: {
      notesRef () {
        return firestore
          .collection('users').doc(this.$store.state.user.uid)
          .collection('vehicles').doc(this.vehicle.id)
          .collection('notes')
      }
    },

    methods: {
      showList () {
        this.mode = this.MODE_LIST
      },

      showForm () {
        this.form = {
          content: null
        }
        this.mode = this.MODE_FORM
      },

      showNote (note) {
        this.note = note
        this.mode = this.MODE_NOTE
      },

      saveNote () {
        if (this.form.content) {
          // Build model
          const noteModel = new NoteModel({
            date: new Date(),
            content: this.form.content
          })
          // Save to databse
          this.loading = true

          this.notesRef.add(noteModel.json)
            .then(() => {
              this.list.unshift(noteModel)
              this.mode = this.MODE_LIST
            })
            .catch(() => {
              // error
            })
            .finally(() => {
              this.loading = false
            })
        }
      },
    },

    async created () {
      this.loading = true
      // this.notes = await this.notesRef.orderBy('date').get()
      const querySnapshot = await this.notesRef.orderBy('date', 'desc').get()
      this.loading = false
      this.list = []
      querySnapshot.forEach(doc => this.list.push(new NoteModel(doc.data())))
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/style.scss";
  @import "@material/fab/mdc-fab";
  @import "@material/icon-button/mdc-icon-button";

  .fab {
    margin-bottom: 2em;
  }

  @media (max-width: 500px) {
    .fab {
      position: absolute;
      right: 5%;
      bottom: 0;
    }
  }
</style>
