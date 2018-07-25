<template>
    <div class="player" v-show="playlist.length>0">
        <transition name="normal"
                    @enter="enter"
                    @after-enter="afterEnter"
                    @leave="leave"
                    @after-leave="afterLeave"
        >
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img width="100%" height="100%" :src="currentSong.image">
                </div>
                <div class="top">
                    <div class="back" @click="back">
                        <i class="icon-back"></i>
                    </div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subtitle" v-html="currentSong.singer"></h2>
                </div>
                <div class="middle"
                     @touchstart.prevent="onMiddleTouchStart"
                     @touchmove.prevent="onMiddleTouchMove"
                     @touchend="onMiddleTouchEnd"
                >
                    <div class="middle-l" ref="middleL">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd">
                                <img class="image" :src="currentSong.image" :class="cdClass">
                            </div>
                        </div>
                        <div class="playing-lyric-wrapper">
                            <div class="playing-lyric">{{playingLyric}}</div>
                        </div>
                    </div>
                    <PScroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
                        <div class="lyric-wrapper">
                            <div v-if="currentLyric">
                                <p ref="lyricLine"
                                   class="text"
                                   :class="{'current':currentLineNum===index}"
                                   v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
                            </div>
                        </div>
                    </PScroll>
                </div>
                <div class="bottom">
                    <div class="dot-wrapper">
                        <span class="dot" :class="{'active':currentShow==='cd'}"></span>
                        <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
                    </div>
                    <div class="progress-wrapper">
                        <span class="time time-l">{{format(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <PProgressBar :percent="percent" @progressChange="onProgressChange"></PProgressBar>
                        </div>
                        <span class="time time-r">{{format(currentSong.duration)}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left" @click="changeMode">
                            <i :class="iconMode"></i>
                        </div>
                        <div class="icon i-left" :class="disableClass">
                            <i @click="prev" class="icon-prev"></i>
                        </div>
                        <div class="icon i-center" :class="disableClass">
                            <i :class="playIcon" @click="togglePlaying" class="needsclick"></i>
                        </div>
                        <div class="icon i-right" :class="disableClass">
                            <i @click="nextv" class="icon-next"></i>
                        </div>
                        <div class="icon i-right">
                            <i @click="toggleFavorite(currentSong)" class="icon" :class="getFavorite(currentSong)"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click="open">
                <div class="icon">
                    <div class="imgWrapper">
                        <img :class="cdClass" width="40" height="40" :src="currentSong.image">
                    </div>
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control">
                    <PProgressCircle :radius="radius" :percent="percent">
                        <i :class="miniIcon" class="icon-mini" @click.stop="togglePlaying"></i>
                    </PProgressCircle>
                </div>
                <div class="control" @click.stop="showPlaylist">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>
        <PPlayList ref="playlist"></PPlayList>
        <audio :src="currentSong.url"
               ref="audio"
               @play="ready"
               @error="error"
               @timeupdate="updateTime"
               @ended="end"
        >
        </audio>
    </div>
</template>

<script>
    import PProgressBar from '@/components/base/ProgressBar'
    import PProgressCircle from '@/components/base/ProgressCircle'
    import PScroll from '@/components/base/Scroll'
    import PPlayList from '@/components/playlist/PlayList'
    import {mapGetters,mapMutations,mapActions} from 'vuex'
    import Animations from 'create-keyframe-animation'
    import {playMode} from "js/config";
    import {prefixStyle} from 'js/dom'
    import {shuffle} from "js/until";
    import {playerMixin} from "js/mixin";
    import LyricParser from 'lyric-parser'

    const transform=prefixStyle('transform');
    const transitionDuration=prefixStyle('transitionDuration');
    const TIME=300;
    const RADIUS=32;
    export default {
        name: "Player",
        mixins:[playerMixin],
        components:{
            PProgressBar,
            PProgressCircle,
            PScroll,
            PPlayList
        },
        data(){
            return {
                songReady:false,
                currentTime:0,
                radius:RADIUS,
                currentLyric:null,
                currentLineNum:0,
                playingLyric:'',
                currentShow:'cd'
            }
        },
        created(){
            this.touch={}
        },
        computed:{
            // 播放百分比
            percent(){
              return this.currentTime/this.currentSong.duration
            },
            // 播放或暂停
            playIcon(){
              return this.playing?'icon-pause':'icon-play'
            },
            // 播放或暂停
            miniIcon(){
              return this.playing?'icon-pause-mini':'icon-play-mini'
            },
            // 图片旋转
            cdClass(){
                return this.playing?'play':'pause'
            },
            // 当网络不好禁用
            disableClass(){
                return this.songReady?'':'disable'
            },
            ...mapGetters([
                'fullScreen'
            ])
        },
        watch:{
            currentSong(newSong,oldSong){
                if(!newSong.id){
                    return
                }
                if(newSong.id===oldSong.id){
                    return
                }
                if(this.currentLyric){
                    this.currentLyric.stop()
                    // 重置为null
                    this.currentLyric = null;
                    this.currentTime = 0;
                    this.playingLyric = '';
                    this.currentLineNum = 0
                }
                clearTimeout(this.timer);
                this.timer=setTimeout(()=>{
                    this.$refs.audio.play();
                    this.getLyric()
                },1000)
            },
            playing(newPlaying){
                const audio=this.$refs.audio;
                this.$nextTick(()=>{
                    newPlaying?audio.play():audio.pause()
                })
            }
        },
        methods:{
            back(){
                this.setFullScreen(false)
            },
            open(){
                this.setFullScreen(true)
            },
            enter(el,done){
                const {scale,x,y}=this._getPosAndScale();
                let animation={
                    0:{
                        transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
                    },
                    60:{
                        transform:`translate3d(0,0,0) scale(1.1)`
                    },
                    100:{
                        transform:`translate3d(0,0,0) scale(1)`
                    }
                };
                Animations.registerAnimation({
                    name: 'move',
                    animation,
                    presets: {
                        duration: 400,
                        easing: 'linear'
                    }
                })
                Animations.runAnimation(this.$refs.cdWrapper,'move',done)
            },
            afterEnter(){
                Animations.unregisterAnimation('move');
                this.$refs.cdWrapper.animation=""
            },
            leave(el,done){
                this.$refs.cdWrapper.style.transition='all 0.4s';
                const {scale,x,y}=this._getPosAndScale();
                this.$refs.cdWrapper.style[transform]=`translate3d(${x}px,${y}px,0) scale(${scale})`;
                this.$refs.cdWrapper.addEventListener('transitionend',done)
            },
            afterLeave(){
                this.$refs.cdWrapper.style.transition='';
                this.$refs.cdWrapper.style[transform]=''
            },
            // 点击播放
            togglePlaying(){
                if(!this.songReady){
                    return
                }
                this.setPlayingState(!this.playing)
                if(this.currentLyric){
                    this.currentLyric.togglePlay()
                }
            },
            // 上一首
            prev(){
                if(!this.songReady){
                    return
                }
                if(this.playing.length===1){
                    this.loop();
                    return
                }else{
                    let index=this.currentIndex-1;
                    if(index===-1){
                        index=this.playlist.length-1
                    }
                    this.setCurrentIndex(index)
                    if(!this.playing){
                        this.togglePlaying()
                    }
                }
                this.songReady=false
            },
            // 播放结束
            end(){
              if(this.mode===playMode.loop){
                  this.loop()
              }else{
                  this.nextv()
              }
            },
            // 循环播放
            loop(){
                this.$refs.audio.currentTime=0;
                this.$refs.audio.play();
                if(this.currentLyric){
                    this.currentLyric.seek(0)
                }
            },
            // 下一首
            nextv(){
                if(!this.songReady){
                    return
                }
                if(this.playlist.length===1){
                    this.loop();
                    return
                }else{
                    let index=this.currentIndex+1;
                    if(index===this.playlist.length){
                        index=0
                    }
                    this.setCurrentIndex(index);
                    if(!this.playing){
                        this.togglePlaying()
                    }
                }
                this.songReady=false
            },
            ready(){
               this.songReady=true;
               this.savePlayHistory(this.currentSong)
            },
            // 当网络出错，保证歌曲能够正常播放
            error(){
                this.songReady=true
            },
            // 当前播放时间
            updateTime(e){
               this.currentTime=e.target.currentTime
            },
            // 将时间戳转换为分秒
            format(interval){
                interval=interval|0;
                let minute=interval/60|0;
                let second=this._pad(interval% 60);
                return `${minute}:${second}`
            },
            // 手拖拽监听播放时间
            onProgressChange(percent){
              const currentTime= this.currentSong.duration*percent;
              this.$refs.audio.currentTime=currentTime;
              if(!this.playing){
                  this.togglePlaying()
              }
                if(this.currentLyric){
                    this.currentLyric.seek(currentTime*1000)
                }
            },
            // 获取歌词
            getLyric(){
                this.currentSong.getLyric().then((lyric)=>{
                    if (this.currentSong.lyric !== lyric) {
                        return
                    }
                    this.currentLyric=new LyricParser(lyric,this.handleLyric);
                    if(this.playing){
                        this.currentLyric.play()
                    }
                }).catch(()=>{
                    this.currentLyric=null;
                    this.currentLineNum=0;
                    this.playingLyric='';
                })
            },
            // 歌词滚动
            handleLyric({lineNum,txt}){
                this.currentLineNum=lineNum;
                if(lineNum>5){
                    let lyricEl=this.$refs.lyricLine[lineNum-5];
                    this.$refs.lyricList.scrollToElement(lyricEl,1000)
                }else{
                    this.$refs.lyricList.scrollTo(0,0,1000)
                }
                this.playingLyric=txt;
            },
            // touch事件
            onMiddleTouchStart(e){
                this.touch.initiated=true;
                const touch=e.touches[0];
                this.touch.startX=touch.pageX;
                this.touch.startY=touch.pageY;
            },
            onMiddleTouchMove(e){
                if(!this.touch.initiated){
                    return
                }
                const touch=e.touches[0];
                let deltaX=touch.pageX-this.touch.startX;
                let deltaY=touch.pageY-this.touch.startY;
                if(Math.abs(deltaY)>Math.abs(deltaX)){
                    return
                }
                let left=this.currentShow==='cd'?0:-window.innerWidth;
                const offsetWidth=Math.min(0,Math.max(-window.innerWidth,deltaX+left));
                this.touch.percent=Math.abs(offsetWidth/window.innerWidth);
                this.$refs.lyricList.$el.style[transform]=`translate3d(${offsetWidth}px,0,0)`;
                this.$refs.lyricList.$el.style[transitionDuration]=0;
                let opacity=1-this.touch.percent;
                this.$refs.middleL.style.opacity=opacity;
                this.$refs.middleL.style[transitionDuration]=0
            },
            onMiddleTouchEnd(){
                let width;
                let opacity;
                if(this.currentShow==='cd'){
                    if(this.touch.percent>0.1){
                        width=-window.innerWidth;
                        this.currentShow='lyric'
                        opacity=0;
                    }else{
                        width=0;
                        opacity=1;
                    }
                }else{
                    if(this.touch.percent<0.9){
                        width=0;
                        this.currentShow='cd';
                        opacity=1;
                    }else{
                        width=-window.innerWidth;
                        opacity=0;
                    }
                }
                this.$refs.lyricList.$el.style[transform]=`translate3d(${width}px,0,0)`;
                this.$refs.lyricList.$el.style[transitionDuration]=`${TIME}ms`
                this.$refs.middleL.style.opacity=opacity;
                this.$refs.middleL.style[transitionDuration]=`${TIME}ms`
            },
            // 展示播放列表
            showPlaylist(){
              this.$refs.playlist.show()
            },
            // 隐藏播放列表
            // 补0
            _pad(num,n=2){
                let len=num.toString().length;
                while (len<n){
                    num='0'+num;
                    len++
                }
                return num;
            },
            // 计算动画坐标
            _getPosAndScale(){
               const targetWidth=40;
               const paddingLeft=40;
               const paddingBottom=30;
               const paddingTop=80;
               const width=window.innerWidth*0.8;
               const scale=targetWidth/width;
               const x=-(window.innerWidth/2-paddingLeft);
               const y=(window.innerHeight-paddingTop-width/2-paddingBottom);
               return {scale,x,y}
            },
            ...mapMutations({
                setFullScreen:'SET_FULL_SCREEN',
                setPlayingState:'SET_PLAYING_STATE',
                setCurrentIndex:'SET_CURRENT_INDEX',
                setPlayMode:'SET_PLAY_MODE',
                setPlaylist:'SET_PLAYLIST'
            }),
            ...mapActions([
                'savePlayHistory'
            ])
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~stylus/variable"
    @import "~stylus/mixin"

    .player
        .normal-player
            position: fixed
            left: 0
            right: 0
            top: 0
            bottom: 0
            z-index: 150
            background: $color-background
            .background
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                z-index: -1
                opacity: 0.6
                filter: blur(20px)
            .top
                position: relative
                margin-bottom: 25px
                .back
                    position absolute
                    top: 0
                    left: 6px
                    z-index: 50
                    .icon-back
                        display: block
                        padding: 9px
                        font-size: $font-size-large-x
                        color: $color-theme
                        transform: rotate(-90deg)
                .title
                    width: 70%
                    margin: 0 auto
                    line-height: 40px
                    text-align: center
                    no-wrap()
                    font-size: $font-size-large
                    color: $color-text
                .subtitle
                    line-height: 20px
                    text-align: center
                    font-size: $font-size-medium
                    color: $color-text
            .middle
                position: fixed
                width: 100%
                top: 80px
                bottom: 170px
                white-space: nowrap
                font-size: 0
                .middle-l
                    display: inline-block
                    vertical-align: top
                    position: relative
                    width: 100%
                    height: 0
                    padding-top: 80%
                    .cd-wrapper
                        position: absolute
                        left: 10%
                        top: 0
                        width: 80%
                        box-sizing: border-box
                        height: 100%
                        .cd
                            width: 100%
                            height: 100%
                            border-radius: 50%
                            .image
                                position: absolute
                                left: 0
                                top: 0
                                width: 100%
                                height: 100%
                                box-sizing: border-box
                                border-radius: 50%
                                border: 10px solid rgba(255, 255, 255, 0.1)
                            .play
                                animation: rotate 20s linear infinite
                    .playing-lyric-wrapper
                        width: 80%
                        margin: 30px auto 0 auto
                        overflow: hidden
                        text-align: center
                        .playing-lyric
                            height: 20px
                            line-height: 20px
                            font-size: $font-size-medium
                            color: $color-text-l
                .middle-r
                    display: inline-block
                    vertical-align: top
                    width: 100%
                    height: 100%
                    overflow: hidden
                    .lyric-wrapper
                        width: 80%
                        margin: 0 auto
                        overflow: hidden
                        text-align: center
                        .text
                            line-height: 32px
                            color: $color-text-l
                            font-size: $font-size-medium
                            &.current
                                color: $color-text
                        .pure-music
                            padding-top: 50%
                            line-height: 32px
                            color: $color-text-l
                            font-size: $font-size-medium
            .bottom
                position: absolute
                bottom: 50px
                width: 100%
                .dot-wrapper
                    text-align: center
                    font-size: 0
                    .dot
                        display: inline-block
                        vertical-align: middle
                        margin: 0 4px
                        width: 8px
                        height: 8px
                        border-radius: 50%
                        background: $color-text-l
                        &.active
                            width: 20px
                            border-radius: 5px
                            background: $color-text-ll
                .progress-wrapper
                    display: flex
                    align-items: center
                    width: 80%
                    margin: 0px auto
                    padding: 10px 0
                    .time
                        color: $color-text
                        font-size: $font-size-small
                        flex: 0 0 30px
                        line-height: 30px
                        width: 30px
                        &.time-l
                            text-align: left
                        &.time-r
                            text-align: right
                    .progress-bar-wrapper
                        flex: 1
                .operators
                    display: flex
                    align-items: center
                    .icon
                        flex: 1
                        color: $color-theme
                        &.disable
                            color: $color-theme-d
                        i
                            font-size: 30px
                    .i-left
                        text-align: right
                    .i-center
                        padding: 0 20px
                        text-align: center
                        i
                            font-size: 40px
                    .i-right
                        text-align: left
                    .icon-favorite
                        color: $color-sub-theme
            &.normal-enter-active, &.normal-leave-active
                transition: all 0.4s
                .top, .bottom
                    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
            &.normal-enter, &.normal-leave-to
                opacity: 0
                .top
                    transform: translate3d(0, -100px, 0)
                .bottom
                    transform: translate3d(0, 100px, 0)
        .mini-player
            display: flex
            align-items: center
            position: fixed
            left: 0
            bottom: 0
            z-index: 180
            width: 100%
            height: 60px
            background: $color-highlight-background
            &.mini-enter-active, &.mini-leave-active
                transition: all 0.4s
            &.mini-enter, &.mini-leave-to
                opacity: 0
            .icon
                flex: 0 0 40px
                width: 40px
                height: 40px
                padding: 0 10px 0 20px
                .imgWrapper
                    height: 100%
                    width: 100%
                    img
                        border-radius: 50%
                        &.play
                            animation: rotate 10s linear infinite
                        &.pause
                            animation-play-state: paused
            .text
                display: flex
                flex-direction: column
                justify-content: center
                flex: 1
                line-height: 20px
                overflow: hidden
                .name
                    margin-bottom: 2px
                    no-wrap()
                    font-size: $font-size-medium
                    color: $color-text
                .desc
                    no-wrap()
                    font-size: $font-size-small
                    color: $color-text-d
            .control
                flex: 0 0 30px
                width: 30px
                padding: 0 10px
                .icon-play-mini, .icon-pause-mini, .icon-playlist
                    font-size: 30px
                    color: $color-theme-d
                .icon-mini
                    font-size: 32px
                    position: absolute
                    left: 0
                    top: 0

    @keyframes rotate
        0%
            transform: rotate(0)
        100%
            transform: rotate(360deg)
</style>