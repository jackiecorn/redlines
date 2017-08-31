<template>
  <div id="block">
      <router-link :to="{ path: '/' + project.name }">
        <div id="image" v-bind:style="{backgroundImage: 'url(' + 'http://redlines.azurewebsites.net/projects/' + project.name + '/preview/' + project.thumbnail + '.png' + ')'}"></div>
      </router-link>
      <!-- <a :href="'http://redlines.azurewebsites.net/projects/' + project.name">

      </a> -->
      <div id="info">
        <input id='title' type="text" placeholder='Enter project title' v-model='project.title' @change='updateTitle' ref='titleInput' @keyup.enter='$refs.titleInput.blur()'>
        <div id="updateDate" @click='openUpdatesModal'>Update: {{ convertedDate }}</div>
      </div>
      <designerName :project="project" @updateDesigner='updateDesigner'></designerName>
      <div id="icons">
        <!-- <div class='icon' id='updateButton' v-tooltip.bottom='"Update redlines"'></div> -->
        <div class='icon' id='linkButton' v-clipboard:copy="'http://redlines.azurewebsites.net/projects/' + project.name" v-clipboard:success="copyLink" v-tooltip.bottom='"Copy link to clipboard"'></div>
        <div class='icon' id='deleteButton' @click='openDeleteModal' v-tooltip.bottom='"Delete"'></div>
      </div>

      <sweet-modal ref="deleteModal" icon="warning">
        Are you sure you want to delete {{project.title}}?
        <button type="button" slot="button" class='button' id='delete' @click='deleteProject'>Delete Project</button>
        <button type="button" slot="button" class='button' v-on:click="closeDeleteModal">Cancel</button>
      </sweet-modal>

      <sweet-modal ref="updatesModal" title='Update log'>
        <ul>
          <li v-for='(update, index) in sortedUpdates'>
            <span id='dateHeader'>{{convertedTime(update)}}</span>
            <textarea id='dateNote' placeholder='Add notes' wrap="hard"  v-model='project.updates[index].note' @change='updateNote'></textarea>
          </li>
        </ul>
        <button type="button" slot="button" class='button' v-on:click="closeUpdatesModal">Done</button>
      </sweet-modal>
  </div>
</template>

<script>
import axios from 'axios'
import { SweetModal } from 'sweet-modal-vue'
import DesignerName from './DesignerName'

export default {
  name: 'block',
  props: ['project'],
  components: {
    'designerName': DesignerName,
    'sweetModal': SweetModal
  },
  methods: {
    showData () {
      console.log(this.project)
    },
    deleteProject () {
      var self = this
      var fileName = this.project.name
      self.$refs.deleteModal.close()
      axios.get('http://redlines.azurewebsites.net/delete.php?file=projects/' + fileName).then(function (response) {
        self.$emit('deleteProject', self.project)
      })
    },
    convertedTime (update) {
      var currentDt = new Date(update.date)
      var mm = currentDt.getMonth() + 1
      var dd = currentDt.getDate()
      var yyyy = currentDt.getFullYear()
      var hh = currentDt.getHours()
      var m = currentDt.getMinutes()
      var convertedTime = mm + '/' + dd + '/' + yyyy + ' ' + hh + ':' + m
      return convertedTime
    },
    openDeleteModal () {
      this.$refs.deleteModal.open()
    },
    closeDeleteModal () {
      this.$refs.deleteModal.close()
    },
    openUpdatesModal () {
      this.$refs.updatesModal.open()
    },
    closeUpdatesModal () {
      this.$refs.updatesModal.close()
    },
    copyLink () {
      this.$emit('copyLink')
    },
    updateTitle () {
      this.$emit('updateTitle', this.project)
    },
    updateDesigner (designer) {
      this.$emit('updateDesigner', this.project, designer)
    },
    updateNote () {
      this.$emit('updateNote', this.project, this.project.updates)
    }
  },
  computed: {
    convertedDate () {
      var currentDt = new Date(this.project.updates[this.project.updates.length - 1].date)
      var mm = currentDt.getMonth() + 1
      var dd = currentDt.getDate()
      var yyyy = currentDt.getFullYear()
      var convertedDate = mm + '/' + dd + '/' + yyyy
      return convertedDate
    },
    sortedUpdates () {
      this.project.updates.sort((b, a) => {
        return new Date(a.date) - new Date(b.date)
      })
      return this.project.updates
    }
  },
  created () {
    if (this.project.thumbnail === '') {
      this.$emit('getImage', this.project)
    }
  }
}
</script>

<style lang="scss" scoped>
#block {
  text-align: left;
  position: relative;
  width: 300px;
  height: 300px;
  // border: 1px solid #DCDCDC;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.15);
  background: white;
  margin: 20px;
  display: inline-block;
  transition: all 0.2s;
  text-align: left;

  &:hover{
    box-shadow: 0 2px 16px 0 rgba(0,0,0,0.2);

    #icons {
      transform: translateY(0px);
      opacity: 1;
    }
  }
}

#image {
  width: 300px;
  height: 186px;
  background-size: 100%;
  background-clip: content-box;
  background-position: center;
  opacity: 1;
  transition: background 0.3s, opacity 0.3s;
  &:hover {
    background-size: 105%;
    opacity: 0.8;
  }
}

#info {
  padding: 16px;

  a {
    color: #666;
    text-decoration: none;
  }
}

#title {
  background-color: transparent;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 220px;
  font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
  font-size: 16px;
  color: #666;
  font-weight: bold;
  border: none;
  padding: 0;
  border-bottom: 1px dashed transparent;
  transition: border 0.2s, color 0.2s;
  margin-bottom: -1px;
  &::-webkit-input-placeholder { /* Chrome */
    color: #a6a6a6;
    font-weight: normal;
  }
  &:hover {
    border-bottom: 1px dashed #c8c8c8;
    color: #888;
  }
  &:active, &:focus {
    color: #888;
    outline: none;
    border-bottom: 1px dashed #888;
  }
}

#updateDate {
  margin-top: 4px;
  font-size: 14px;
  font-weight: normal;
  color: #A6A6A6;
  cursor: pointer;
  &:hover {
    color: #666;
  }
}

#icons {
  position: absolute;
  bottom: 16px;
  right: 16px;
  cursor: default;
  opacity: 0;
  transform: translateY(10px);
  transition: transform 0.3s, opacity 0.2s;
}

.icon {
  &:hover {
    opacity: 1;
  }
}

.button {
  background-color: #F4F4F4;
  font-size: 14px;
  padding: 0 16px;
  line-height: 32px;
  min-width: 100px;
  color: #333;
  border: none;
  outline: none;
  height: 32px;
  margin-left: 8px;
  transition: background-color 0.1s;
  cursor: pointer;
  &:hover {
    background-color: #eaeaea;
  }
}

#delete {
  background-color: #d83b01;
  color: white;
  &:hover {
    background-color: #BF3300;
  }
}
#dateHeader {
  margin: 8px 0;
  font-weight: bold;
  font-size: 14px;
  margin-right: 24px;
}

textarea {
  border: none;
  resize: none;
  font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: #666;
  height: 56px;
  padding: 0;
  width: 75%;
  vertical-align: text-top;
  &::-webkit-input-placeholder { /* Chrome */
    color: #a6a6a6;
    font-weight: normal;
  }
  &:active, &:focus {
    outline: none;
  }
}
</style>
