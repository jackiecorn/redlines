<template>
  <div id="block">
    <div id='loaderBlock' :class='{ active: deleting }'>
      <div id='loader'></div>
    </div>
      <router-link :to="{ path: '/' + project.name }">
        <div id="image" v-bind:style="{backgroundImage: 'url(' + 'https://redlines.azurewebsites.net/projects/' + project.name + '/preview/' + project.thumbnail + '.png' + ')'}"></div>
      </router-link>
      <div id="info">
        <input id='title' type="text" placeholder='Enter project title' v-model='project.title' @change='updateTitle' ref='titleInput' @keyup.enter='$refs.titleInput.blur()'>
        <!-- <div id="updateDate" @click='openUpdatesModal'>Update: {{ convertedDate }}</div> -->
        <multiselect v-model="product" :options="productOptions" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Select product" @input='updateProduct'></multiselect>
      </div>
      <designerName :project="project" @updateDesigner='updateDesigner'></designerName>
      <div id="icons">
        <!-- <div class='icon' id='updateButton' v-tooltip.bottom='"Update redlines"'></div> -->
        <div class='icon' id='linkButton' v-clipboard:copy="'https://redlines.azurewebsites.net/' + project.name" v-clipboard:success="copyLink" v-tooltip.bottom='"Copy link to clipboard"'></div>
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
import Multiselect from 'vue-multiselect'

export default {
  name: 'block',
  data () {
    return {
      deleting: false,
      product: '',
      productOptions: ['PowerApps Studio', 'PowerApps Portal', 'PowerApps Player', 'Admin Center', 'Dynamics 365', 'Patterns', 'CDS']
      // productOptions: ['PowerApps Studio', 'PowerApps Portal', 'PowerApps Player', 'Flow', 'Power BI Desktop', 'Power BI Service', 'Admin Center']
    }
  },
  props: ['project'],
  components: {
    'designerName': DesignerName,
    'sweetModal': SweetModal,
    Multiselect
  },
  methods: {
    showData () {
      console.log(this.project)
    },
    deleteProject () {
      var self = this
      var fileName = this.project.name
      this.deleting = true
      self.$refs.deleteModal.close()
      axios.get('https://redlines.azurewebsites.net/delete.php?file=projects/' + fileName).then(function (response) {
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
    },
    updateProduct () {
      this.$emit('updateProduct', this.project, this.product)
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
    this.product = this.project.product
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
    text-decoration: underline;
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


#loaderBlock {
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  background: white;
  z-index: 50;
}

#loaderBlock.active {
  display: block;
}

#loader {
  color: #666;
 font-size: 90px;
 text-indent: -9999em;
 overflow: hidden;
 width: 1em;
 height: 1em;
 border-radius: 50%;
 position: absolute;
  top: 35%;
  left: 35%;
  z-index: 100;
  -webkit-transform: translateZ(0);
 -ms-transform: translateZ(0);
 transform: translateZ(0);
  transform: translate(-50%, -50%);
 -webkit-animation: load6 1.7s infinite ease, round 1.7s infinite ease;
 animation: load6 1.7s infinite ease, round 1.7s infinite ease;
}

@-webkit-keyframes load6 {
  0% {
    box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
  5%,
  95% {
    box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
  10%,
  59% {
    box-shadow: 0 -0.83em 0 -0.4em, -0.087em -0.825em 0 -0.42em, -0.173em -0.812em 0 -0.44em, -0.256em -0.789em 0 -0.46em, -0.297em -0.775em 0 -0.477em;
  }
  20% {
    box-shadow: 0 -0.83em 0 -0.4em, -0.338em -0.758em 0 -0.42em, -0.555em -0.617em 0 -0.44em, -0.671em -0.488em 0 -0.46em, -0.749em -0.34em 0 -0.477em;
  }
  38% {
    box-shadow: 0 -0.83em 0 -0.4em, -0.377em -0.74em 0 -0.42em, -0.645em -0.522em 0 -0.44em, -0.775em -0.297em 0 -0.46em, -0.82em -0.09em 0 -0.477em;
  }
  100% {
    box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
}
@keyframes load6 {
  0% {
    box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
  5%,
  95% {
    box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
  10%,
  59% {
    box-shadow: 0 -0.83em 0 -0.4em, -0.087em -0.825em 0 -0.42em, -0.173em -0.812em 0 -0.44em, -0.256em -0.789em 0 -0.46em, -0.297em -0.775em 0 -0.477em;
  }
  20% {
    box-shadow: 0 -0.83em 0 -0.4em, -0.338em -0.758em 0 -0.42em, -0.555em -0.617em 0 -0.44em, -0.671em -0.488em 0 -0.46em, -0.749em -0.34em 0 -0.477em;
  }
  38% {
    box-shadow: 0 -0.83em 0 -0.4em, -0.377em -0.74em 0 -0.42em, -0.645em -0.522em 0 -0.44em, -0.775em -0.297em 0 -0.46em, -0.82em -0.09em 0 -0.477em;
  }
  100% {
    box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
}
@-webkit-keyframes round {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes round {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>

<style lang="scss">
.multiselect {
  font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
  font-size: 14px;
  position: relative;
  width: 120px;
  margin-top: 2px;
  &:active,&:focus {
    outline: none;
  }
}

.multiselect__single {
  border: none;
  padding: 0;
  color: #A6A6A6;
  font-size: 14px;
  transition: color 0.2s;
  cursor: pointer;
  &:hover {
    color: #666;
  }
  &::-webkit-input-placeholder { /* Chrome */
    color: #a6a6a6;
  }
}

.multiselect__content-wrapper {
  z-index: 10;
  position: absolute;
  background: white;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.15);
  margin-top: 8px;
  margin-left: -16px;
  margin-top: -23px;
}

.multiselect__element {
  list-style: none;
  // margin: 8px 0;
  color: #666;
  cursor: pointer;
}

.multiselect__option{
  display: block;
  padding: 4px 16px;
  min-width: 140px;
  cursor: pointer;
  &.multiselect__option--highlight {
    background: #f4f4f4;
  }
  &.multiselect__option--selected {
    background: #eaeaea;
    color: #333;
  }
}

.multiselect__content {
  padding:0;
  margin: 0px 0;
}

</style>
