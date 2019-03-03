<template>
  <div>
    <template v-if="mode === MODE_LIST">
      <!-- FAB BUTTON -->
      <button
        class="mdc-fab app-fab--absolute"
        aria-label="Добавить заметку"
        title="Добавить заметку"
        @click="showForm"
      >
        <span class="mdc-fab__icon material-icons">add</span>
      </button>
      <!-- LOADING -->
      <progress-circular v-if="loading"/>
      <!-- LIST -->
      <template v-else>
        <div class="list">
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
          <div
            v-else
            style="
              margin-top: 40%;
              text-align: center;
            "
          >
            <p style="margin-bottom: 2em;"><big>Данных пока нет</big>,<br> но вы можете добавить первую запись.</p>
          </div>
        </div>
      </template>
    </template>
    <template v-if="mode === MODE_FORM">
      <!-- FORM -->
      <div class="form window-overlay">
        <div class="mdc-layout-grid">
          <div class="mdc-layout-grid__inner">
            <div class="mdc-layout-grid__cell">
              <button
                @click="showList"
                class="mdc-icon-button"
                aria-label="Закрыть"
                aria-hidden="true"
                aria-pressed="false"
                style="float: right; clear: both;"
              >
                <i class="material-icons mdc-icon-button__icon">close</i>
              </button>
              <h1>Новая заметка</h1>
              <mdc-textarea
                label="Текст"
                v-model="form.content"
                rows="6"
                autofocus="autofocus"
                required
              />
              <mdc-submit
                :loading="loading"
                @click="saveNote"
              >
                Сохранить
              </mdc-submit>
            </div>
          </div>
        </div>
      </div>
    </template>
    <!-- NOTE -->
    <template v-if="mode === MODE_NOTE">
      <p v-html="note.parsedContent"/>
      <p>
        {{ note.date.toLocaleDateString() }}
      </p>
      <button
        @click="showList"
        class="mdc-button mdc-button--outlined mdc-ripple-upgraded"
        aria-label="Вернуться"
        aria-hidden="true"
        aria-pressed="false"
      >
        <i class="material-icons mdc-button__icon">arrow_back</i>
        <span class="mdc-button__label">Вернуться</span>
      </button>
    </template>
  </div>
</template>

<script>
  import { firestore } from '@/config'
  import ProgressCircular from '@/components/common/progress-circular'
  import MdcTextarea from '@/components/mdc/textarea'
  import MdcSubmit from '@/components/mdc/submit'
  import NoteModel from '@/models/note'

  export default {
    components: {
      MdcTextarea,
      MdcSubmit,
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
        list: null,
        note: null,
        form: null,
        loading: false
      }
    },

    watch: {
      vehicle () {
        this.loadNotes()
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
      async loadNotes () {
        this.loading = true
        const snapshot = await this.notesRef.orderBy('date', 'desc').get()
        this.list = snapshot.empty
          ? null 
          : snapshot.docs.map(doc => new NoteModel(doc.data()))
        this.loading = false
      },

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
      await this.loadNotes()
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/variables.scss";
  
  @import "@material/fab/mdc-fab";
  @import "@material/icon-button/mdc-icon-button";

  .mdc-list li {
    cursor: pointer;
  }
</style>
