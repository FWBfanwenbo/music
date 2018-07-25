<template>
    <SScroll ref="suggest"
             class="suggest"
             @scrollToEnd="searchMore"
             @beforeScroll="listScroll"
             :pullup="pullup"
             :beforeScroll="beforeScroll"
    >
        <ul class="suggest-list">
            <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
                <div class="icon">
                    <i :class="getIconClass(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getSingerText(item)"></p>
                </div>
            </li>
            <SLoading v-show="hasMore" :title="title"></SLoading>
        </ul>
        <div v-show="!hasMore && !result.length" class="no-result-wrapper">
            <SNoResult title="抱歉，暂无搜索结果"></SNoResult>
        </div>
    </SScroll>
</template>

<script type="text/ecmascript-6">
    import SLoading from '@/components/base/Loading'
    import SScroll from '@/components/base/Scroll'
    import SNoResult from '@/components/base/NoResult'
    import { ERR_OK } from 'api/config'
    import {search} from "api/search";
    import { createSong, isValidMusic, processSongsUrl } from 'js/song'
    import Singer from 'js/singer'
    import { mapMutations, mapActions } from 'vuex'
    const TYPE_SINGER='singer';
    const PERPAGE=20;
    export default {
        name:'Suggest',
        components:{
            SScroll,
            SLoading,
            SNoResult
        },
        props:{
            query:{
                type:String,
                default:''
            },
            showSinger:{
                type:Boolean,
                default:true
            }
        },
        data(){
            return {
                page:1,
                result:[],
                pullup:true,
                hasMore:true,
                title:'',
                beforeScroll:true
            }
        },
        watch:{
          query(){
              this.search()
            }
        },
        methods:{
            refresh(){
                this.$refs.suggest.refresh()
            },
            selectItem(item){
               if(item.type===TYPE_SINGER){
                   const singer=new Singer({
                       id: item.singermid,
                       name:item.singername
                   });
                   this.$router.push({
                       path: `/search/${singer.id}`
                   });
                   this.setSinger(singer)
                }else{
                   this.insertSong(item)
               }
               this.$emit('select')
            },
            search(){
                this.hasMore=true;
                // 重置page、窗口位置
                this.page=1;
                this.$refs.suggest.scrollTo(0,0);
                search(this.query,this.page,this.showSinger,PERPAGE).then((res)=>{
                    if(res.code===ERR_OK){
                        this._getResult(res.data).then((result)=>{
                            this.result = result
                        });
                        this._searchMore(res.data)
                    }
                })
            },
            // 搜索更多
            searchMore(){
                if(!this.hasMore){
                    return
                }
                this.page++;
                search(this.query,this.page,this.showSinger,PERPAGE).then((res)=>{
                    if(res.code===ERR_OK){
                        this._getResult(res.data).then((result)=>{
                            let results;
                            if(result[0].type===TYPE_SINGER){
                                results=result.slice(1)
                            }else{
                                results=result
                            }
                            this.result = this.result.concat(results);
                        });
                        this._searchMore(res.data)
                    }
                })
            },
            // 根据type类型判断歌手或者歌名
            getIconClass(item){
                if(item.type===TYPE_SINGER){
                    return 'icon-mine'
                }else{
                    return 'icon-music'
                }
            },
            getSingerText(item){
                if(item.type===TYPE_SINGER){
                    return item.singername
                }else{
                    return `${item.name}-${item.singer}`
                }
            },
            // 搜索滚动收起键盘监听
            listScroll(){
                this.$emit('listScroll')
            },
            // 归一搜索
            _normalizeSongs(list){
                let ret=[];
                list.forEach((musicData)=>{
                    if(isValidMusic(musicData)){
                        ret.push(createSong(musicData))
                    }
                });
                return ret;
            },
            _searchMore(data){
                const res=data.song;
                if(!res.list.length || (res.curnum+(res.curpage - 1)*PERPAGE)>=res.totalnum){
                    this.hasMore=false
                }
            },
            _getResult(data){
                let ret=[];
                if(data.zhida && data.zhida.singermid){
                    ret.push({...data.zhida,...{type:TYPE_SINGER}})
                }
                return processSongsUrl(this._normalizeSongs(data.song.list)).then((song)=>{
                    ret=ret.concat(song);
                    return ret
                })
            },
            ...mapMutations({
                setSinger:'SET_SINGER'
            }),
            ...mapActions([
                'insertSong'
            ])
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~stylus/variable"
    @import "~stylus/mixin"

    .suggest
        height: 100%
        overflow: hidden
        .suggest-list
            padding: 0 30px
            .suggest-item
                display: flex
                align-items: center
                padding-bottom: 20px
            .icon
                flex: 0 0 30px
                width: 30px
                [class^="icon-"]
                    font-size: 14px
                    color: $color-text-d
            .name
                flex: 1
                font-size: $font-size-medium
                color: $color-text-d
                overflow: hidden
                .text
                    no-wrap()
        .no-result-wrapper
            position: absolute
            width: 100%
            top: 50%
            transform: translateY(-50%)
</style>