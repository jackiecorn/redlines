<template>
  <div id="designerName">
    <canvas id='avatar' v-bind:class="{ active: hasDesigner }" width='300' height='300'></canvas>
    <input placeholder='Enter designer name' id='name' v-bind:class="{ initial: !hasDesigner }" type="text" v-model='designer' @keyup='display' @change='updateDesigner' ref='designerInput' @keyup.enter='$refs.designerInput.blur()'>
  </div>
</template>

<script>
export default {
  name: 'DesignerName',
  props: ['project'],
  data () {
    return {
      designer: this.project.designer,
      colors: ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#f39c12', '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d']
    }
  },
  computed: {
    hasDesigner () {
      return this.designer !== ''
    }
  },
  methods: {
    display () {
      var name = this.designer
      if (name !== '') {
        var nameSplit
        var initials
        var colorIndex
        if (name.indexOf(' ') >= 0) {
          nameSplit = name.split(' ')
          if (nameSplit[1] !== '') {
            initials = nameSplit[0].charAt(0).toUpperCase() + nameSplit[1].charAt(0).toUpperCase()
            var charIndex = initials.charCodeAt(0) - 65
            var charIndex2 = initials.charCodeAt(1) - 65
            colorIndex = (charIndex + charIndex2) % 19
          } else {
            initials = nameSplit[0].charAt(0).toUpperCase()
            charIndex = initials.charCodeAt(0) - 65
            colorIndex = charIndex % 19
          }
        } else {
          nameSplit = [name, ' ']
          initials = nameSplit[0].charAt(0).toUpperCase()
          charIndex = initials.charCodeAt(0) - 65
          colorIndex = charIndex % 19
        }
        var canvas = this.$el.querySelector('#avatar')
        var context = canvas.getContext('2d')
        var canvasWidth = 300
        var canvasHeight = 300
        var canvasCssWidth = canvasWidth
        var canvasCssHeight = canvasHeight
        context.fillStyle = this.colors[colorIndex]
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.font = '150px Arial'
        context.textAlign = 'center'
        context.fillStyle = '#FFF'
        context.fillText(initials, canvasCssWidth / 2, canvasCssHeight / 1.5)
      }
    },
    updateDesigner () {
      this.$emit('updateDesigner', this.designer)
    }
  },
  mounted () {
    this.display()
  },
  updated () {
    this.display()
  }
}
</script>

<style lang="scss" scoped>
#designerName {
  position: absolute;
  text-align: left;
  max-width: 170px;
  bottom: 12px;
  left: 16px;
}
#avatar {
  width: 24px;
  height: 24px;
  border-radius: 24px;
  display: inline-block;
  opacity: 0;
  transition: opacity 0.25s;
  -webkit-transition-delay: .1s; /* Safari */
    transition-delay: .1s;
}
#avatar.active {
  opacity: 1;
  -webkit-transition-delay: 0s; /* Safari */
    transition-delay: 0s;
}
#name {
  background-color: transparent;
  font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: #666;
  display: inline-block;
  position: absolute;
  left: 30px;
  top: 2px;
  font-size: 14px;
  text-overflow: ellipsis;
  width: 130px;
  white-space: nowrap;
  overflow: hidden;
  padding: 0;
  border: none;
  border: 1px dashed transparent;
  margin-top: -1px;
  transform: translateX(0px);
  transition: border .2s, color .2s, transform .2s;
  &::-webkit-input-placeholder { /* Chrome */
    color: #a6a6a6;
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
#name.initial {
  transform: translateX(-30px);
  -webkit-transition-delay: .1s; /* Safari */
    transition-delay: .1s;
}
</style>
