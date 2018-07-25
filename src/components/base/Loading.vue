<template>
    <div class="loading">
        <img width="24" height="24" :src="loading">
        <p class="desc">{{title}}</p>
    </div>
</template>

<script>
    export default {
        name: "Loading",
        props: {
            title: {
                type: String,
                default: '正在载入...'
            }
        },
        data(){
            return {
                loading:require('gif/loading.gif')
            }
        }
    }
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
    @import "~stylus/variable"

    .loading
        width: 100%
        text-align: center
        .desc
            line-height: 20px
            font-size: $font-size-small
            color: $color-text-l
</style>