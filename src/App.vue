<template>
  <div id="app2">
      <router-link to='/' exact><h1>Redlines</h1></router-link>
    <router-view></router-view>
  </div>
</template>

<script>
import Home from './components/Home'

export default {
  name: 'app2',
  components: {
    'home': Home
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

#app2 {
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

a  {
  &:link, &:visited, &:active {
    text-decoration:  none;
    color: #666666;
  }
}


h1 {
  position: fixed;
  top: -5px;
  left: 50px;
  z-index: 100;
  display: inline;
  font-size: 18px;
  font-weight: lighter;
  transform: translateX(0px);
  transition: transform 0.3s;
}

a.router-link-active h1{
  transform: translateX(-30px);
}

router-view {
  margin-top: 800px;
}
</style>
