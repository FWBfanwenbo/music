<template>
    <div class="singer" ref="singer">
        <BListView :data="singer" @select="singerSelect" ref="list"></BListView>
        <router-view></router-view>
    </div>
</template>

<script>
    import {getSingerList} from 'api/singer'
    import BListView from '@/components/base/ListView'
    import {mapMutations} from 'vuex'
    import {ERR_OK} from 'api/config'
    import Singer from 'js/singer'
    import {playlistMixin} from 'js/mixin'

    const HOT_NAME='热门';
    const HOT_SINGER_LEN=10;

    export default {
        mixins:[playlistMixin],
        name: "Singer",
        components:{
            BListView
        },
        data(){
            return {
                singer:[]
            }
        },
        created(){
            this._getSingerList()
        },
        methods:{
            onHandlePlaylist(playlist){
                const bottom=playlist.length>0?'60px':'';
                this.$refs.singer.style.bottom=bottom;
                this.$refs.list.refresh();
            },
            singerSelect(singer){
                this.$router.push({
                    path: `/singer/${singer.id}`
                })
                this.setSinger(singer)
            },
            _getSingerList(){
                getSingerList().then((res)=>{
                    if(res.code===ERR_OK){
                        this.singer=this._normalizeSinger(res.data.list);
                    }
                })
            },
            _normalizeSinger(list){
                let map={
                    hot:{
                        title: HOT_NAME,
                        items:[]
                    }
                };
                list.forEach((item, index)=>{
                    if(index<HOT_SINGER_LEN){
                        map.hot.items.push(new Singer({
                            id:item.Fsinger_mid,
                            name:item.Fsinger_name
                        }))
                    };
                    const key=item.Findex;
                    if(!map[key]){
                        map[key]={
                            title:key,
                            items:[]
                        }
                    }
                    map[key].items.push(new Singer({
                        id:item.Fsinger_mid,
                        name:item.Fsinger_name
                    }))
                })
                // 为了得到有序列表，我们需要处理 map
                var hot=[];
                var ret=[];
                for(let key in map){
                    if(map[key].title.match(/[A-Za-z]/)){
                        ret.push(map[key])
                    }else if(map[key].title===HOT_NAME){
                        hot.push(map[key])
                    }
                }
                ret.sort((a,b)=>{
                    return a.title.charCodeAt(0)-b.title.charCodeAt(0)
                });
                return hot.concat(ret)
            },
            ...mapMutations({
                setSinger:'SET_SINGER'
            })
        }
    }
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
    .singer
      position: fixed
      top: 88px
      bottom: 0
      width: 100%
</style>