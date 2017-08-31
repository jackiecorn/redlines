<template>
  <div id="mainApp">
      <router-link to='/' exact><h1>Redlines</h1></router-link>
      <header id='masterHeader'></header>
      <transition name="fade">
    <router-view @sendRef='sendRef' :projects='this.projects' :projectsRef='this.projectsRef'></router-view>
  </transition>
  </div>
</template>

<script>
import Firebase from 'firebase'

var config = {
  apiKey: 'AIzaSyCrl-0_Kv0KP16NvWrkL5YFQ7Mhvrg6P1c',
  authDomain: 'redlines-27008.firebaseapp.com',
  databaseURL: 'https://redlines-27008.firebaseio.com',
  projectId: 'redlines-27008',
  storageBucket: 'redlines-27008.appspot.com',
  messagingSenderId: '1506816515'
}

var app = Firebase.initializeApp(config)
var db = app.database()
var projectsReference = db.ref('Projects')

export default {
  name: 'mainApp',
  firebase: {
    projects: projectsReference
  },
  data () {
    return {
      projectsRef: db.ref('Projects')
    }
  },
  methods: {
    sendRef (projects) {
      this.projects = projects
    }
  }
}
</script>

<style lang="scss">
@font-face {
  font-family: 'Segoe UI';
  src: url('/static/fonts/SegoeUI.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
 }
@font-face {
font-family: 'Segoe UI';
src: url('/static/fonts/SegoeUI-Semibold.ttf') format('truetype');
font-weight: bold;
font-style: normal;
 }
@font-face {
font-family: 'Segoe UI';
src: url('/static/fonts/SegoeUI-Semilight.ttf') format('truetype');
font-weight: lighter;
font-style: normal;
}
@font-face {
    font-family: 'FullMDL2';
    src: url('/static/fonts/FullMDL2.ttf') format('truetype');
}

#mainApp {
	font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
  font-weight: normal;
  font-style: normal;
	-webkit-font-smoothing: antialiased;
	color: #666666;
  margin: 0 auto;
  -webkit-user-select: none; /* Chrome/Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+ */
  -o-user-select: none;
  user-select: none;
}

header#masterHeader {
  // z-index: 1;
  background:white;
  height: 40px;
  width: 100%;
  position: fixed;
  top:0;
  box-shadow: 0 0px 8px 0 rgba(0,0,0,.1);
  // z-index: 10;
}
a  {
  &:link, &:visited, &:active {
    text-decoration:  none;
    color: #666666;
  }
}

h1 {
  position: fixed;
  background: white;
  top: -7px;
  left: 42px;
  z-index: 100;
  display: inline;
  font-size: 18px;
  font-weight: lighter;
  transform: translateX(0px);
  transition: transform 0.3s, background 0.2s;
  padding: 2px 8px;
  &:hover {
    background: #f4f4f4;
  }
}

a.router-link-active h1{
  transform: translateX(-30px);
  &:hover {
    background: white;
    cursor: default;
  }
}

router-view {
  margin-top: 800px;
}

.fade-enter-active, .fade-leave-active {
transition-property: opacity;
transition-duration: .3s;
}

.fade-enter-active {
transition-delay: .3s;
}

.fade-enter, .fade-leave-active {
opacity: 0
}
</style>
