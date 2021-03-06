<template>
    <transition name="slide">
        <div class="user-center">
            <div class="back" @click="back">
                <i class="icon-back"></i>
            </div>
            <div class="switches-wrapper">
                <USwitches :switches="switches"
                           :currentIndex="currentIndex"
                           @switch="switchItem"></USwitches>
            </div>
            <div ref="playBtn" class="play-btn" @click="random">
                <i class="icon-play"></i>
                <span class="text">随机播放全部</span>
            </div>
            <div class="list-wrapper" ref="listWrapper">
                <UScroll ref="favoriteList"
                         class="list-scroll"
                         :data="favoriteList"
                         v-if="currentIndex===0">
                    <div class="list-inner">
                        <USongList :songs="favoriteList"  @select="selectSong"></USongList>
                    </div>
                </UScroll>
                <UScroll class="list-scroll"
                         ref="playList"
                         :data="playHistory"
                         v-if="currentIndex===1">
                    <div class="list-inner">
                        <USongList :songs="playHistory"  @select="selectSong"></USongList>
                    </div>
                </UScroll>
            </div>
            <div class="no-result-wrapper" v-show="noResult">
                <UNoResult :title="noResultDesc"></UNoResult>
            </div>
        </div>
    </transition>
</template>

<script>
    import USwitches from '@/components/base/Switches'
    import UScroll from '@/components/base/Scroll'
    import USongList from '@/components/base/SongList'
    import UNoResult from '@/components/base/NoResult'
    import {mapGetters,mapActions} from 'vuex'
    import Song from 'js/song'
    import {playlistMixin} from 'js/mixin'
    export default {
        name: "UserCenter",
        mixins:[playlistMixin],
        components:{
            USwitches,
            UScroll,
            USongList,
            UNoResult
        },
        data(){
            return {
                switches:[
                    {name:'我喜欢的'},
                    {name:'最近听到'}],
                currentIndex:0
            }
        },
        computed:{
            noResult(){
                if(this.currentIndex===0){
                    return !this.favoriteList.length;
                }else {
                    return !this.playHistory.length;
                }
            },
            noResultDesc(){
                if(this.currentIndex===0){
                    return '暂无收藏歌曲'
                }else{
                    return '你还没有听过歌曲'
                }
            },
            ...mapGetters([
                'favoriteList',
                'playHistory'
            ])
        },
        methods:{
            onHandlePlaylist(playlist){
                const bottom=playlist.length>0?'60px':'';
                this.$refs.listWrapper.style.bottom=bottom;
                this.$refs.favoriteList && this.$refs.favoriteList.refresh();
                this.$refs.playList && this.$refs.playList.refresh();
            },
            back(){
                this.$router.back()
            },
            switchItem(index){
                this.currentIndex=index
            },
            selectSong(item){
                this.insertSong(new Song(item));
            },
            random(){
                let list=this.currentIndex===0?this.favoriteList:this.playHistory;
                if (list.length === 0) {
                    return
                }
                list=list.map((item)=>{
                    return new Song(item)
                });
                this.randomPlay({list})
            },
            ...mapActions([
                'insertSong',
                'randomPlay'
            ])
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~stylus/variable"

    .user-center
        position: fixed
        top: 0
        bottom: 0
        z-index: 100
        width: 100%
        background: $color-background
        &.slide-enter-active, &.slide-leave-active
            transition: all 0.3s
        &.slide-enter, &.slide-leave-to
            transform: translate3d(100%, 0, 0)
        .back
            position absolute
            top: 0
            left: 6px
            z-index: 50
            .icon-back
                display: block
                padding: 10px
                font-size: $font-size-large-x
                color: $color-theme
        .switches-wrapper
            margin: 10px 0 30px 0
        .play-btn
            box-sizing: border-box
            width: 135px
            padding: 7px 0
            margin: 0 auto
            text-align: center
            border: 1px solid  $color-text-l
            color: $color-text-l
            border-radius: 100px
            font-size: 0
            .icon-play
                display: inline-block
                vertical-align: middle
                margin-right: 6px
                font-size: $font-size-medium-x
            .text
                display: inline-block
                vertical-align: middle
                font-size: $font-size-small
        .list-wrapper
            position: absolute
            top: 110px
            bottom: 0
            width: 100%
            .list-scroll
                height: 100%
                overflow: hidden
                .list-inner
                    padding: 20px 30px
        .no-result-wrapper
            position: absolute
            width: 100%
            top: 50%
            transform: translateY(-50%)
</style>