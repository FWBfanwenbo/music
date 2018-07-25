<template>
    <transition name="list-fade">
        <div class="playlist" v-show="showFlag" @click.stop="hide">
            <div class="list-wrapper" @click.stop>
                <div class="list-header">
                    <h1 class="title">
                        <i class="icon" :class="iconMode" @click="changeMode"></i>
                        <span class="text">{{modeText}}</span>
                        <span class="clear" @click="clear">
                            <i class="icon-clear"></i>
                        </span>
                    </h1>
                </div>
                <PScroll :data="sequenceList"
                         ref="listContent"
                         :refreshDelay="refreshDelay"
                         class="list-content">
                    <transition-group ref="list" name="list" tag="ul">
                        <li :key="item.id"
                            class="item"
                            ref="listItem"
                            @click="selectItem(item,index)"
                            v-for="(item,index) in sequenceList">
                            <i class="current" :class="getCurrentIcon(item)"></i>
                            <span class="text" v-html="item.name"></span>
                            <span class="like" @click.stop="toggleFavorite(item)">
                              <i :class="getFavorite(item)"></i>
                            </span>
                            <span class="delete" @click.stop="deleteOne(item)">
                              <i class="icon-delete"></i>
                            </span>
                        </li>
                    </transition-group>
                </PScroll>
                <div class="list-operate">
                    <div class="add" @click="addSong">
                        <i class="icon-add"></i>
                        <span class="text">添加歌曲到队列</span>
                    </div>
                </div>
                <div @click="hide" class="list-close">
                    <span>关闭</span>
                </div>
            </div>
            <PConfirm ref="confirm"
                      text="是否清空所有播放历史"
                      confirmBtnText="清空"
                      @confirm="deleteAllSHistory"
            ></PConfirm>
            <PAddSong ref="addSong"></PAddSong>
        </div>
    </transition>
</template>

<script>
    import PScroll from '@/components/base/Scroll'
    import PConfirm from '@/components/base/Confirm'
    import PAddSong from '@/components/add-song/AddSong'
    import {playerMixin} from "js/mixin";
    import {mapMutations,mapActions} from 'vuex'
    import {playMode} from 'js/config'
    export default {
        name: "PlayList",
        mixins:[playerMixin],
        components:{
            PScroll,
            PConfirm,
            PAddSong
        },
        data(){
            return {
                showFlag:false,
                refreshDelay:100
            }
        },
        computed:{
            modeText(){
                return this.mode===playMode.random?'随机播放':this.mode===playMode.sequence?'顺序播放':'单曲循环'
            }
        },
        watch:{
            currentSong(newSong,oldSong){
                if(!this.showFlag || newSong.id===oldSong.id){
                    return
                }
                this.currentScroll(newSong)
            }
        },
        methods:{
            show(){
                this.showFlag=true;
                setTimeout(()=>{
                   this.$refs.listContent.refresh()
                    this.currentScroll(this.currentSong)
                },20)
            },
            hide(){
                this.showFlag=false
            },
            getCurrentIcon(item){
                if(this.currentSong.id===item.id){
                    return 'icon-play'
                }else{
                    return ''
                }
            },
            selectItem(list,index){
                if(this.mode===playMode.random){
                    index=this.playlist.findIndex((item)=>{
                        return item.id===list.id
                    })
                }
                this.setCurrentIndex(index);
                this.setPlayingState(true)
            },
            currentScroll(current){
                let index=this.playlist.findIndex((song)=>{
                    return song.id===current.id
                });
                this.$refs.listContent.scrollToElement(this.$refs.listItem[index],300)
            },
            deleteOne(item){
                this.deleteSong(item);
                if (!this.playlist.length) {
                    this.hide()
                }
            },
            clear(){
                this.$refs.confirm.show()
            },
            deleteAllSHistory(){
                this.deleteSongList();
                this.hide()
            },
            // 添加歌曲到队列
            addSong(){
                this.$refs.addSong.show()
            },
            ...mapMutations({
                'setCurrentIndex':'SET_CURRENT_INDEX',
                'setPlayingState':'SET_PLAYING_STATE'
            }),
            ...mapActions([
                'deleteSong',
                'deleteSongList'
            ])
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~stylus/variable"
    @import "~stylus/mixin"

    .playlist
        position: fixed
        left: 0
        right: 0
        top: 0
        bottom: 0
        z-index: 200
        background-color: $color-background-d
        &.list-fade-enter-active, &.list-fade-leave-active
            transition: opacity 0.3s
            .list-wrapper
                transition: all 0.3s
        &.list-fade-enter, &.list-fade-leave-to
            opacity: 0
            .list-wrapper
                transform: translate3d(0, 100%, 0)
        &.list-fade-enter
        .list-wrapper
            position: absolute
            left: 0
            bottom: 0
            width: 100%
            background-color: $color-highlight-background
            .list-header
                position: relative
                padding: 20px 30px 10px 20px
                .title
                    display: flex
                    align-items: center
                    .icon
                        margin-right: 10px
                        font-size: 30px
                        color: $color-theme-d
                    .text
                        flex: 1
                        font-size: $font-size-medium
                        color: $color-text-l
                    .clear
                        extend-click()
                        .icon-clear
                            font-size: $font-size-medium
                            color: $color-text-d
            .list-content
                max-height: 240px
                overflow: hidden
                .item
                    display: flex
                    align-items: center
                    height: 40px
                    padding: 0 30px 0 20px
                    overflow: hidden
                    &.list-enter-active, &.list-leave-active
                        transition: all 0.1s
                    &.list-enter, &.list-leave-to
                        height: 0
                    .current
                        flex: 0 0 20px
                        width: 20px
                        font-size: $font-size-small
                        color: $color-theme-d
                    .text
                        flex: 1
                        no-wrap()
                        font-size: $font-size-medium
                        color: $color-text-d
                    .like
                        extend-click()
                        margin-right: 15px
                        font-size: $font-size-small
                        color: $color-theme
                        .icon-favorite
                            color: $color-sub-theme
                    .delete
                        extend-click()
                        font-size: $font-size-small
                        color: $color-theme
            .list-operate
                width: 140px
                margin: 20px auto 30px auto
                .add
                    display: flex
                    align-items: center
                    padding: 8px 16px
                    border: 1px solid $color-text-l
                    border-radius: 100px
                    color: $color-text-l
                    .icon-add
                        margin-right: 5px
                        font-size: $font-size-small-s
                    .text
                        font-size: $font-size-small
            .list-close
                text-align: center
                line-height: 50px
                background: $color-background
                font-size: $font-size-medium-x
                color: $color-text-l
</style>