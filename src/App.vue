<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style lang="stylus">
  @import 'common/stylus/index.styl';

  html
    width auto

  #app
    width: 100%
    height: 100%
</style>
