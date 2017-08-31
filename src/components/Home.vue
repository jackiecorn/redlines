<template>
  <div id='home'>
    <header id='homeHeader'></header>
    <div id='homeContent'>
    <div id='searchBox'>
      <input type='text' v-model='search' placeholder='Search project or designer name...'>
      <div id='searchIcon'></div>
    </div>
    <transition-group name="list" tag="div">
      <Block v-for='project in filteredProjects' :key="project['.key']" :project='project' @getImage='getImage' @deleteProject='deleteProject'  @copyLink='copyLink' @updateTitle='updateTitle' @updateDesigner='updateDesigner' @updateNote='updateNote'></Block>
    </transition-group>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Block from './Block'

export default {
  name: 'home',
  props: ['projects', 'projectsRef'],
  data () {
    return {
      search: ''
    }
  },

  components: {
    'Block': Block
  },

  methods: {
    addNewProjects () {
      var self = this
      if (self.projects[0]) {
        setTimeout(function () {
          axios.get('http://redlines.azurewebsites.net/projects/').then(function (response) {
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
                console.log(projectName + ' has updated')
                self.projectsRef.child(childKey).child('updates').child(updateIndex).set({date: projectDate, note: ''})
                hasUpdated = false
              }
              if (!found) {
                console.log('found ' + projectName)
                self.projectsRef.push({
                  name: projectName,
                  title: projectName.replace(/_/g, ' ').replace(/([A-Z]+)/g, ' $1').trim().replace('  ', ' '),
                  designer: '',
                  thumbnail: '',
                  updates: [{date: projectDate, note: 'First upload'}]
                })
              }
            }
          })
        }, 3000)
      }
    },

    getImage (project) {
      var self = this
      axios.get('http://redlines.azurewebsites.net/projects/' + project.name + '/preview/').then(function (response) {
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
    }
  },

  mounted () {
    this.addNewProjects()
    this.$emit('sendRef', this.projects)
  },

  computed: {
    filteredProjects: function () {
      var filteredArray = this.projects.filter((project) => {
        return project.title.toLowerCase().match(this.search.toLowerCase()) || project.designer.toLowerCase().match(this.search.toLowerCase())
      })
      return filteredArray.sort((b, a) => {
        return new Date(a.updates[0].date) - new Date(b.updates[0].date)
      })
    }
  }
}
</script>

<style lang='scss'>
#homeHeader {
  background:white;
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
  z-index: -100px;
}

ul {
  padding: 0;
  margin: 0;
}
li {
  list-style: none;
  text-align: left;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 24px;
  padding-top: 24px;

  &:last-child {
    border-bottom: none;
  }
}

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
</style>
