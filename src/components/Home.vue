<template>
  <div id='home'>
    <div id='homeContent'>
    <div id='searchBox'>
      <input type='text' v-model='search' placeholder='Search project or designer name...'>
      <div id='searchIcon'></div>
    </div>
    <div id='refreshButton'  @click='addNewProjects'>
      <div class='icon'></div>
      <span id='addButtonText'>Refresh</span>
    </div>
    <div id='addButton'  @click='openAddModal'>
      <div class='icon'></div>
      <span id='addButtonText'>Add project</span>
    </div>
    <ul id='tabs'>
      <li class='tab' @click='filter = ""' :class="{ 'active-tab': filter == '' }">All</li>
      <li class='tab' @click='filter = "PowerApps Studio";' :class="{ 'active-tab': filter == 'PowerApps Studio' }">Studio</li>
      <li class='tab' @click='filter = "PowerApps Portal";' :class="{ 'active-tab': filter == 'PowerApps Portal' }">Portal</li>
      <li class='tab' @click='filter = "PowerApps Player";' :class="{ 'active-tab': filter == 'PowerApps Player' }">Player</li>
      <li class='tab' @click='filter = "Admin Center"' :class="{ 'active-tab': filter == 'Admin Center' }">Admin Center</li>
      <li class='tab' @click='filter = "Dynamics 365"' :class="{ 'active-tab': filter == 'Dynamics 365' }">Dynamics 365</li>
      <li class='tab' @click='filter = "Patterns"' :class="{ 'active-tab': filter == 'Patterns' }">Patterns</li>
      <li class='tab' @click='filter = "CDS"' :class="{ 'active-tab': filter == 'CDS' }">CDS</li>
      <li class='tab' @click='filter = "Flow"' :class="{ 'active-tab': filter == 'Flow' }">Flow</li>
    </ul>
    <transition-group name="list" tag="div">
      <Block v-for='project in searchedProjects' :key="project['.key']" :project='project' @getImage='getImage' @deleteProject='deleteProject'  @copyLink='copyLink' @updateTitle='updateTitle' @updateDesigner='updateDesigner' @updateNote='updateNote' @updateProduct='updateProduct'></Block>
    </transition-group>
    </div>
    <header id='homeHeader'></header>
    <sweet-modal id='addModal' ref="addModal">
      <form-wizard color="#666" finish-button-text="Done" @on-complete="closeAddModal">
        <h2 slot="title">Export redlines from Sketch</h2>
        <tab-content title="Install plugin">
          <a href="/Installer.zip" id='downloadButton'><img src="/static/images/SketchPlugin.png" alt="Download installer">
          <div>Download Redline Tool plugin</div></a>
        </tab-content>
        <tab-content title="Export redlines">
          <div class='instructionText'>
            In Sketch, select Plugins -> Redline Tool -> Export Redlines
          </div>
            <img class='instructionImage' src="/static/images/plugin.png">
            <div class='instructionText'>
              Review your formats and artboards then click Export
            </div>
            <img class='instructionImage' id='settingsImage' src="/static/images/settings.png">
            <img class='instructionImage' id='settingsImage' src="/static/images/selectartboards.png">
            <div class='instructionText'>
              Enter the project's name and click Export
            </div>
            <img class='instructionImage' src="/static/images/filename.png">
         </tab-content>
         <tab-content title="Add info">
           <div class='instructionText'>
             Once your project is uploaded, click Refresh to see it listed on the page
           </div>
           <img class='instructionImage' id='settingsImage' src="/static/images/refresh.png">
           <div class='instructionText'>
             Enter more information to make it more searchable
           </div>
           <img class='instructionImage' id='settingsImage' src="/static/images/project.png">
         </tab-content>
      </form-wizard>
    </sweet-modal>
  </div>
</template>

<script>
import axios from 'axios'
import Block from './Block'
import { SweetModal } from 'sweet-modal-vue'
import {FormWizard, TabContent} from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

export default {
  name: 'home',
  props: ['projects', 'projectsRef'],
  data () {
    return {
      search: '',
      filter: '',
      selected: ''
    }
  },

  components: {
    'Block': Block,
    'sweetModal': SweetModal,
    FormWizard,
    TabContent
  },

  methods: {
    addNewProjects () {
      var self = this
      axios.get('https://redlines.azurewebsites.net/projects/').then(function (response) {
        var s = response.data
        var startIndex = s.search('<pre>') + 5 + 45
        var endIndex = s.search('</pre>')
        var slicedString = s.slice(startIndex, endIndex).replace(/<br>/g, '')
        var htmlObject = document.createElement('div')
        htmlObject.innerHTML = slicedString
        var nodesObject = htmlObject.childNodes
        for (var j = 0; j < nodesObject.length; j += 2) {
          var projectName = nodesObject[j + 1].text
          var projectDate = new Date(nodesObject[j].data.trim()).toString()
          var found = false
          var hasUpdated = false
          var childKey
          var updateIndex
          for (var i = 0; i < self.projects.length; i++) {
            if (projectName === self.projects[i].name) {
              found = true
              childKey = self.projects[i]['.key']
              // console.log(childKey)
              updateIndex = self.projects[i].updates.length
              if (projectDate !== self.projects[i].updates[ 0 ].date) {
                hasUpdated = true
              }
            }
          }
          if (hasUpdated) {
            // console.log(projectName + ' has been updated')
            // self.projectsRef.child(childKey).child('updates').child(updateIndex).set({date: projectDate, note: ''})
            self.projectsRef.child(childKey).child('updates').child(updateIndex).set({date: projectDate, note: ''})
            hasUpdated = false
            // var newTitle2 = projectName.replace(/_/g, ' ').replace(/([A-Z]+)/g, ' $1').trim().replace('  ', ' ')
            // self.$toasted.show(newTitle2 + ' has updated', {
            //   theme: 'primary',
            //   position: 'bottom-center',
            //   duration: 5000
            // })
          }
          if (!found) {
            // console.log('added ' + projectName)
            var newTitle = projectName.replace(/_/g, ' ').replace(/([A-Z]+)/g, ' $1').trim().replace('  ', ' ')
            self.projectsRef.push({
              name: projectName,
              title: newTitle,
              designer: '',
              product: '',
              thumbnail: '',
              updates: [{date: projectDate, note: 'First upload'}]
            })
            self.$toasted.show(newTitle + ' added', {
              theme: 'primary',
              position: 'bottom-center',
              duration: 5000
            })
          }
        }
      })
    },

    getImage (project) {
      var self = this
      axios.get('https://redlines.azurewebsites.net/projects/' + project.name + '/preview/').then(function (response) {
        var s = response.data
        var startIndex = s.search('<pre>') + 5
        var endIndex = s.search('</pre>')
        var slicedString = s.slice(startIndex, endIndex).replace(/<br>/g, '')
        var htmlObject = document.createElement('div')
        htmlObject.innerHTML = slicedString
        var innerNodesObject = htmlObject.querySelectorAll('a')
        var imageName = innerNodesObject[1].text
        self.projectsRef.child(project['.key']).child('thumbnail').set(imageName)
      })
    },
    deleteProject (project) {
      this.$toasted.show(project.title + ' deleted', {
        theme: 'primary',
        position: 'bottom-center',
        duration: 5000
      })
      this.projectsRef.child(project['.key']).remove()
    },
    copyLink () {
      this.$toasted.show('Copied link to clipboard', {
        theme: 'primary',
        position: 'bottom-center',
        duration: 4000
      })
    },
    updateTitle (project) {
      this.projectsRef.child(project['.key']).child('title').set(project.title)
    },
    updateDesigner (project, designer) {
      this.projectsRef.child(project['.key']).child('designer').set(designer)
    },
    updateNote (project, updates) {
      this.projectsRef.child(project['.key']).child('updates').set(updates)
    },
    updateProduct (project, product) {
      this.projectsRef.child(project['.key']).child('product').set(product)
    },
    openAddModal () {
      this.$refs.addModal.open()
    },
    closeAddModal () {
      this.$refs.addModal.close()
    }
  },

  mounted () {
    // this.addNewProjects()
    this.$emit('sendRef', this.projects)
  },

  computed: {
    filteredProjects () {
      var filteredArray = this.projects.filter((project) => {
        // console.log(project)
        return project.product.match(this.filter)
      })
      return filteredArray
    },
    searchedProjects () {
      var searchedArray = this.filteredProjects.filter((project) => {
        return project.title.toLowerCase().match(this.search.toLowerCase()) || project.designer.toLowerCase().match(this.search.toLowerCase())
      })
      return searchedArray.sort((b, a) => {
        return new Date(a.updates[0].date) - new Date(b.updates[0].date)
      })
    }
  }
}
</script>

<style lang='scss'>
#homeHeader {
  background:white;
  z-index: 20;
  height: 40px;
  width: 100%;
  position: fixed;
  top:0;
  box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.05);
}

#homeContent {
	font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
  font-weight: normal;
  font-style: normal;
	-webkit-font-smoothing: antialiased;
	color: #666666;
  max-width: 1020px;
  margin: 0 auto;
  position: relative;
  top: 40px;
  -webkit-user-select: none; /* Chrome/Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+ */
  -o-user-select: none;
  user-select: none;
}

#tabs {
  padding-left: 20px;
  margin-top: 16px;
  margin-bottom: 0;
}

.tab {
  display: inline;
  margin-right: 30px;
  cursor: pointer;
  padding-bottom: 2px;
  border-bottom: 2px solid transparent;
  transition: border 0.3s;
}

.active-tab {
  color: #333;
  border-bottom: 2px solid #888;
}
// ul {
//   padding: 0;
//   margin: 0;
// }
// li {
//   list-style: none;
//   text-align: left;
//   border-bottom: 1px solid #eaeaea;
//   padding-bottom: 24px;
//   padding-top: 24px;
//
//   &:last-child {
//     border-bottom: none;
//   }
// }

.icon {
  font-family: 'FullMDL2';
  font-size: 16px;
  color: #333;
  opacity: 0.5;
  display: inline-block;
  margin-left: 16px;
  cursor: pointer;
  transition: opacity 0.2s;
}

#searchBox {
  position: relative;
  margin: 20px;

  input {
    font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
    height: 32px;
    width: 300px;
    // padding-left: 38px;
    padding-left: 26px;
    font-size: 14px;
    // border:1px solid #dcdcdc;
    border: none;
    transition: all 0.2s;

    &::-webkit-input-placeholder { /* Chrome/Opera/Safari */
      color: #888;
    }

    &:focus, &:active {
      outline: none;
    }
  }
  &:before {
    content: '';
    display: block;
    position: absolute;
    width: 300px;
    height: 1px;
    background: #dcdcdc;
    bottom: 0px;
    left: 26px;
  }
  #searchIcon {
    font-family: 'FullMDL2';
    content: '';
    font-size: 16px;
    position: absolute;
    left: 0px;
    top: 10px;
    width: 16px;
    opacity: 1;
    transform-origin: left;
    transition: all 0.2s;
    -webkit-user-select: none; /* Chrome/Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+ */
    -o-user-select: none;
    user-select: none;
    cursor: default;
  }
}

#refreshButton {
  position: absolute;
  right: 150px;
  top: 10px;
  cursor: pointer;
  transition: opacity .2s;
  &:hover{
    opacity: 0.7;
  }
}

#addButton {
  position: absolute;
  right: 20px;
  top: 10px;
  cursor: pointer;
  transition: opacity .2s;
  &:hover{
    opacity: 0.7;
  }
}

#addButtonText {
  position: relative;
  top:-2px;
  margin-left: 4px;
}

#blockList {
  text-align: left;
  margin: 0 auto;
}

.tooltip {
  display: block !important;
  padding: 8px;
  z-index: 1;

  .tooltip-inner {
    font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
    background: rgba(0,0,0,0.7);
    font-size: 12px;
    color: white;
    border-radius: 2px;
    padding: 6px 8px;
  }

  .tooltip-arrow {
    display: none;
  }

  &[aria-hidden='true'] {
    opacity: 0;
    transition: opacity .2s, visibility .2s;
  }

  &[aria-hidden='false'] {
    opacity: 1;
    transition: opacity .2s, visibility .2s;
  }
}

.toasted.primary.default {
  background-color: rgba(0,0,0,0.7);
  color: white;
  font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
  font-weight: normal;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  font-size: 14px;
  padding: 8px 24px;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.2);
}

.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}

/*.vue-form-wizard .wizard-tab-content{
  min-height: 800px;
}*/

#addModal .sweet-modal.is-visible .sweet-buttons, #addModal .sweet-modal.is-visible .sweet-content{
  padding-bottom: 0px !important;
}

.vue-form-wizard .navbar .navbar-nav>li>a.wizard-btn.wizard-btn-wd, .vue-form-wizard .wizard-btn-wd{
  font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
  font-weight: normal !important;
  background-color: #F4F4F4 !important;
  border-radius: 0 !important;
  font-size: 14px !important;
  padding: 0 16px !important;
  line-height: 32px !important;
  min-width: 100px !important;
  color: #333 !important;
  border: none !important;
  outline: none !important;
  height: 32px !important;
  margin-left: 8px !important;
  transition: background-color 0.1s;
  cursor: pointer;
    &:hover {
      background-color: #eaeaea !important;
    }
}
.vue-form-wizard .wizard-card-footer {
    padding: 0 !important;
}

.vue-form-wizard .wizard-card-footer .wizard-footer-left {
  position: absolute;
  right: 142px;
}

#downloadButton {
  transition: opacity .2s;
  &:hover {
    opacity: 0.7;
  }
}

.instructionImage {
  width: 100%;
  margin-bottom: 24px;
}

.instructionText {
  margin-bottom: 8px;
}

#settingsImage {
  width: 265px;
}

.wizard-header {
  display: none;
}
.stepTitle {
  color: #c8c8c8;
  margin-top: 4px;
}
.vue-form-wizard .wizard-navigation .wizard-progress-with-circle {
  top: 36px;
}
.vue-form-wizard .wizard-nav-pills a, .vue-form-wizard .wizard-nav-pills li {
  padding: 0px;
  margin-bottom: 24px;
  border-bottom: none;
}
.vue-form-wizard .wizard-icon-circle .wizard-icon{
  font-style: normal;
  color: #888;
  font-weight: normal;
}
.vue-form-wizard .wizard-icon-circle {
  width: 60px;
  height: 60px;
}
</style>
