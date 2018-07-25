<template>
    <div class="rank" ref="rank">
        <TScroll :data="topList" class="toplist" ref="toplist">
            <ul>
                <li class="item" v-for="item in topList" @click="selectItem(item)">
                    <div class="icon">
                        <img v-lazy="item.picUrl" width="100" height="100"/>
                    </div>
                    <ul class="songlist">
                        <li class="song" v-for="(song,index) in item.songList">
                            <span>{{index + 1}}</span>
                            <span>{{song.songname}}-{{song.singername}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
            <div class="loading-container" v-show="!topList.length">
                <TLoading></TLoading>
            </div>
        </TScroll>
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
    import TScroll from '@/components/base/Scroll'
    import TLoading from '@/components/base/Loading'
    import {playlistMixin} from 'js/mixin'
    import {getTopList} from 'api/rank';
    import {mapMutations} from 'vuex'
    import {ERR_OK} from 'api/config'
    export default {
        mixins:[playlistMixin],
        name:'Rank',
        components:{
            TScroll,
            TLoading
        },
        data(){
          return {
              topList:[]
          }
        },
        created(){
            this._getTopList()
        },
        computed:{
        },
        methods:{
            selectItem(item){
                this.$router.push({
                    path: `/rank/${item.id}`
                })
                this.setTopList(item)
            },
            onHandlePlaylist(playlist){
                const bottom=playlist.length>0?'60px':0;
                this.$refs.rank.style.bottom=bottom;
                this.$refs.toplist.refresh();
            },
            _getTopList(){
                getTopList().then((res)=>{
                    if(res.code===ERR_OK){
                        this.topList=res.data.topList;
                    }
                })
            },
            ...mapMutations({
                setTopList:'SET_TOP_LIST'
            })
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~stylus/variable"
    @import "~stylus/mixin"

    .rank
        position: fixed
        width: 100%
        top: 88px
        bottom: 0
        .toplist
            height: 100%
            overflow: hidden
            .item
                display: flex
                margin: 0 20px
                padding-top: 20px
                height: 100px
                &:last-child
                    padding-bottom: 20px
                .icon
                    flex: 0 0 100px
                    width: 100px
                    height: 100px
                .songlist
                    flex: 1
                    display: flex
                    flex-direction: column
                    justify-content: center
                    padding: 0 20px
                    height: 100px
                    overflow: hidden
                    background: $color-highlight-background
                    color: $color-text-d
                    font-size: $font-size-small
                    .song
                        no-wrap()
                        line-height: 26px
            .loading-container
                position: absolute
                width: 100%
                top: 50%
                transform: translateY(-50%)
</style>