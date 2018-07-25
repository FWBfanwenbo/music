<template>
    <div class="better-scroll" ref="betterScroll">
        <slot></slot>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'
    export default {
        name: "Scroll",
        props:{
            probeType:{
                type:Number,
                default:1
            },
            click:{
                type:Boolean,
                default:true
            },
            data:{
                type:Array,
                default:null
            },
            listenScroll:{
                type:Boolean,
                default:false
            },
            // 上拉刷新
            pullup:{
                type:Boolean,
                default:false
            },
            // 搜索滚动收起键盘
            beforeScroll:{
                type:Boolean,
                default:false
            },
            // 列表延迟
            refreshDelay:{
                type:Number,
                default:20
            }
        },
        watch:{
            data(){
                setTimeout(()=>{
                    this.refresh();
                })
            }
        },
        methods:{
            _initScroll(){
                if(!this.$refs.betterScroll){
                    return;
                }
                this.scroll=new BScroll(this.$refs.betterScroll,{
                    probeType:this.probeType,
                    click:this.click
                });
                if(this.listenScroll){
                    var that=this;
                    this.scroll.on('scroll',(pos)=>{
                        that.$emit('scroll',pos)
                    })
                }
                if(this.pullup){
                    var that=this;
                    this.scroll.on('scrollEnd',()=>{
                        if(this.scroll.y<=(this.scroll.maxScrollY+50)){
                            that.$emit('scrollToEnd')
                        }
                    })
                }
                if(this.beforeScroll){
                    let that=this;
                    this.scroll.on('beforeScrollStart',()=>{
                        that.$emit('beforeScroll')
                    })
                }
            },
            enable(){
                this.scroll && this.scroll.enable()
            },
            disable(){
                this.scroll && this.scroll.disable()
            },
            refresh(){
                this.scroll && this.scroll.refresh() // 刷新后重新计算高度
            },
            scrollTo(){
                this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments)
            },
            scrollToElement(){
                this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments)
            }
        },
        mounted(){
            setTimeout(()=>{
                this._initScroll()
            },this.refreshDelay)
        }
    }
</script>

<style scoped>

</style>