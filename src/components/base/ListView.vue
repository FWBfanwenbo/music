<template>
    <ListScroll
            class="list-view"
            :data="data"
            @scroll="scroll"
            :listenScroll="listenScroll"
            ref="listView"
            :probeType="probeType"
    >
        <ul>
            <li v-for="group in data" class="list-group" ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li v-for="item in group.items"
                        class="list-group-item"
                        @click="selectItem(item)">
                        <img v-lazy="item.avatar" alt="" class="avatar">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
            <ul>
                <li :data-index="index"
                    class="item"
                    :class="{'current':currentIndex===index}"
                    v-for="(item,index) in shortcutList"
                >
                    {{item}}
                </li>
            </ul>
        </div>
        <div class="list-fixed" ref="fixed" v-show="fixedTitle">
            <div class="fixed-title">{{fixedTitle}} </div>
        </div>
        <div v-show="!data.length" class="loading-container">
            <LLoading></LLoading>
        </div>
    </ListScroll>
</template>

<script>
    import ListScroll from '@/components/base/Scroll'
    import LLoading from '@/components/base/Loading'
    import {getData} from 'js/dom'

    const ANCHOR_HEIGHT = 18;
    const TITLE_HEIGHT=30;

    export default {
        name: "ListView",
        components:{
            ListScroll,
            LLoading
        },
        props:{
            data:{
                type:Array,
                default:[],
            }
        },
        data(){
            return {
                scrollY:-1,
                currentIndex:0,
                diff:-1
            }
        },
        created(){
            this.touchs={};
            this.listHeight=[];
            this.listenScroll=true;
            this.probeType=3
        },
        computed:{
            shortcutList(){
                return this.data.map((group)=>{
                    return group.title.substring(0,1)
                })
            },
            fixedTitle(){
                return  this.data[this.currentIndex]?this.data[this.currentIndex].title:''
            }
        },
        watch:{
            data(){
                setTimeout(()=>{
                    this._calculateHeight()
                },20)
            },
            scrollY(newY){
                const listHeight=this.listHeight;
                // 当滚动到顶部，newY>0
                  if(newY>0){
                      this.currentIndex=0;
                      return
                  }
                // 在中间部分滚动
                for(let i=0;i<listHeight.length-1;i++){
                    let height1=listHeight[i];
                    let height2=listHeight[i+1];
                    if((-newY>=height1&&-newY<height2)){
                        this.currentIndex=i;
                        this.diff=height2+newY;
                        return
                    }
                }
                // 当滚动到底部，且-newY大于最后一个元素的上限
                this.currentIndex = listHeight.length - 2
            },
            diff(newVal){
                let fixedTop=(newVal>0&&newVal<TITLE_HEIGHT)?newVal-TITLE_HEIGHT:0
                if(this.fixedTop===fixedTop){
                    return
                }
                this.fixedTop=fixedTop;
                this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
            }
        },
        methods:{
            selectItem(item){
                this.$emit('select',item)
            },
            onShortcutTouchStart(e){
                var shortcutIndex=getData(e.target,'index');
                const firstTouch=e.touches[0];
                this.touchs.y1=firstTouch.pageY;
                this.touchs.shortcutIndex=shortcutIndex;
                this._scrollTo(shortcutIndex)
            },
            onShortcutTouchMove(e){
                const firstTouch=e.touches[0];
                this.touchs.y2=firstTouch.pageY;
                const delta=(this.touchs.y2-this.touchs.y1)/ANCHOR_HEIGHT | 0;
                let shortcutIndex=parseInt(this.touchs.shortcutIndex)+delta;
                this._scrollTo(shortcutIndex)
            },
            scroll(pos){
               this.scrollY=pos.y
            },
            refresh(){
                this.$refs.listView.refresh()
            },
            _scrollTo(index){
                if (!index && index !== 0) {
                    return
                }
                if(index<0){
                    index=0
                }else if(index>this.listHeight.length - 2){
                    index=this.listHeight.length - 2
                }
                this.scrollY=-this.listHeight[index]
                this.$refs.listView.scrollToElement(this.$refs.listGroup[index],0)
            },
            _calculateHeight(){
                this.listHeight=[];
                let height=0;
                this.listHeight.push(height);
                for(let i=0;i<this.$refs.listGroup.length;i++){
                    let item=this.$refs.listGroup[i];
                    height+=item.clientHeight;
                    this.listHeight.push(height);
                }
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~stylus/variable"

    .list-view
        position: relative
        width: 100%
        height: 100%
        overflow: hidden
        background: $color-background
        .list-group
            padding-bottom: 30px
            .list-group-title
                height: 30px
                line-height: 30px
                padding-left: 20px
                font-size: $font-size-small
                color: $color-text-l
                background: $color-highlight-background
            .list-group-item
                display: flex
                align-items: center
                padding: 20px 0 0 30px
                .avatar
                    width: 50px
                    height: 50px
                    border-radius: 50%
                .name
                    margin-left: 20px
                    color: $color-text-l
                    font-size: $font-size-medium
        .list-shortcut
            position: absolute
            z-index: 30
            right: 0
            top: 50%
            transform: translateY(-50%)
            width: 20px
            padding: 20px 0
            border-radius: 10px
            text-align: center
            background: $color-background-d
            font-family: Helvetica
            .item
                padding: 3px
                line-height: 1
                color: $color-text-l
                font-size: $font-size-small
                &.current
                    color: $color-theme
        .list-fixed
            position: absolute
            top: -2px
            left: 0
            width: 100%
            .fixed-title
                height: 30px
                line-height: 30px
                padding-left: 20px
                font-size: $font-size-small
                color: $color-text-l
                background: $color-highlight-background
        .loading-container
            position: absolute
            width: 100%
            top: 50%
            transform: translateY(-50%)
</style>