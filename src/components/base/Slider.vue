<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot></slot>
        </div>
        <div class="dots">
            <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots"></span>
        </div>
    </div>
</template>

<script>
    import {addClassName} from 'js/dom'
    import BScroll from 'better-scroll';
    export default {
        name: "Slider",
        data(){
            return {
                dots:[],
                currentPageIndex:0
            }
        },
        props: {
            loop: {
                type: Boolean,
                default: true
            },
            autoPlay: {
                type: Boolean,
                default: true
            },
            interval: {
                type: Number,
                default: 4000
            }
        },
        methods:{
            // 初始化slider样式
            _setSliderWidth(bool){
                this.children=this.$refs.sliderGroup.children;
                let width=0;
                let sliderWidth=this.$refs.slider.clientWidth;
               for(let i=0;i<this.children.length;i++){
                   let child = this.children[i];
                   addClassName(child, 'slider-item');
                   child.style.width = sliderWidth + 'px';
                   width += sliderWidth
               }
               if(this.loop&&!bool){
                   width += 2*sliderWidth
               }
                this.$refs.sliderGroup.style.width = width + 'px'
            },
            // 初十一配置
            _initSlider() {
                this.slider = new BScroll(this.$refs.slider, {
                    scrollX: true,
                    scrollY: false,
                    momentum: false,   //关闭或者打开惯性运动的执行
                    snap: {
                        loop: this.loop, // 循环
                        threshold: 0.3,
                        speed: 400 // 轮播间隔
                    }    //滑动的时间
                });
                this.slider.on('scrollEnd',()=>{
                    let pageIndex = this.slider.getCurrentPage().pageX;
                    this.currentPageIndex=pageIndex;
                    if(this.autoPlay){
                        clearTimeout(this.timer)
                        this._play();
                    }
                })
            },
            // 初始化dots个数
            _initDots() {
                this.dots = new Array(this.children.length-2)
            },
            // 自动轮播
            _play(){
                clearTimeout(this.timer)
                this.timer=setTimeout(()=>{
                    this.slider.next()
                },this.interval)
            }
        },
        mounted(){
            setTimeout(()=>{
                this._setSliderWidth();
                this._initSlider();
                this. _initDots();
                if (this.autoPlay) {
                    this._play()
                }
            },20)
            window.addEventListener('resize',()=>{
                if(!this.slider){
                    return
                }
                this._setSliderWidth(true);
                this.slider.refresh()
            })
        },
        destroyed(){
            clearTimeout(this.timer)
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~stylus/variable"

    .slider
        min-height: 1px
        .slider-group
            position: relative
            overflow: hidden
            white-space: nowrap
            .slider-item
                float: left
                box-sizing: border-box
                overflow: hidden
                text-align: center
                a
                    display: block
                    width: 100%
                    overflow: hidden
                    text-decoration: none
                img
                    display: block
                    width: 100%
        .dots
            position: absolute
            right: 0
            left: 0
            bottom: 12px
            transform: translateZ(1px)
            text-align: center
            font-size: 0
            .dot
                display: inline-block
                margin: 0 4px
                width: 8px
                height: 8px
                border-radius: 50%
                background: $color-text-l
                &.active
                    width: 20px
                    border-radius: 5px
                    background: $color-text-ll
</style>