<template>
  <div id="app">
    <VHeader></VHeader>
    <VTab></VTab>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <VPlayer></VPlayer>
  </div>
</template>

<script>
  import VHeader from '@/components/home/Header'
  import VTab from '@/components/tab/Tab'
  import VPlayer from '@/components/player/Player'
export default {
  name: 'App',
  components:{
      VHeader,
      VTab,
      VPlayer
  }
}
</script>

<style>
</style>
