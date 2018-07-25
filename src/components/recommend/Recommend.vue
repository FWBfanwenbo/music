<template>
    <div class="recommend" ref="recommendFwb">
        <BScrollHeight ref="scroll" class="recommend-content" :data="discList">
            <div>
                <div v-if="recommends.length" class="slider-wrapper">
                    <VSlider>
                        <div v-for="item in recommends">
                            <a :href="item.linkUrl">
                                <img class="needsclick" @load="loadImage" :src="item.picUrl" alt="">
                            </a>
                        </div>
                    </VSlider>
                </div>
                <div class="recommend-list">
                    <h1 class="list-title">热门歌单推荐</h1>
                    <ul class="ul-wrapper">
                        <li @click="selectItem(item)" class="item" v-for="item in discList">
                            <div class="icon">
                                <img v-lazy="item.imgurl" width="60" height="60">
                            </div>
                            <div class="text">
                                <h2 class="name" v-html="item.creator.name"></h2>
                                <p class="desc" v-html="item.dissname"></p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="loading-wrapper" v-show="getDiscListLength">
                <BLoading></BLoading>
            </div>
        </BScrollHeight>
        <router-view></router-view>
    </div>
</template>

<script>
    import {getRecommend,getDiscList} from 'api/recommend'
    import VSlider from '@/components/base/Slider'
    import BScrollHeight from '@/components/base/Scroll'
    import BLoading from '@/components/base/Loading'
    import {mapMutations} from 'vuex'
    import {playlistMixin} from 'js/mixin'
    import {ERR_OK} from 'api/config'
    export default {
        mixins:[playlistMixin],
        name: "Recommend",
        components:{
            VSlider,
            BScrollHeight,
            BLoading
        },
        data(){
            return {
                recommends:[],
                discList:[]
            }
        },
        created(){
            this._getRecommend();
            this._getDiscList();
        },
        computed:{
            getDiscListLength(){
                return !this.discList.length
            }
        },
        methods:{
            selectItem(item){
               this.$router.push({
                   path: `/recommend/${item.dissid}`
               })
                this.setDisc(item)
            },
            onHandlePlaylist(playlist){
                const bottom=playlist.length>0?'60px':'';
                this.$refs.recommendFwb.style.bottom=bottom;
                this.$refs.scroll.refresh();
            },
            _getRecommend(){
                getRecommend().then((res)=>{
                    if(res.code===ERR_OK){
                        this.recommends=res.data.slider
                    }
                })
            },
            _getDiscList(){
                getDiscList().then((res)=>{
                    if(res.code===ERR_OK){
                       this.discList=res.data.list;
                    }
                })
            },
            loadImage(){
                if(!this.checkBlock){
                   this.$refs.scroll.refresh();
                   this.checkBlock=true;
                }
            },
            ...mapMutations({
                setDisc:'SET_DISC'
            })
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~stylus/variable"
    .recommend
      position: fixed
      width: 100%
      top: 88px
      bottom: 0
      .recommend-content
        height: 100%
        overflow: hidden
        .slider-wrapper
          position: relative
          width: 100%
          overflow: hidden
        .recommend-list
          .list-title
            height: 65px
            line-height: 65px
            text-align: center
            font-size: $font-size-medium
            color: $color-theme
          .ul-wrapper
            .item
              display: flex
              box-sizing: border-box
              align-items: center
              padding: 0 20px 20px 20px
              .icon
                flex: 0 0 60px
                width: 60px
                padding-right: 20px
              .text
                display: flex
                flex-direction: column
                justify-content: center
                flex: 1
                line-height: 20px
                overflow: hidden
                font-size: $font-size-medium
                .name
                  margin-bottom: 10px
                  color: $color-text
                .desc
                  color: $color-text-d
        .loading-wrapper
          position: absolute
          width: 100%
          top: 50%
          transform: translateY(-50%)
</style>