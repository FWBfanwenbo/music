<template>
    <transition name="slide">
        <DMusicList :title="title" :bgImage="bgImage" :songs="songs"></DMusicList>
    </transition>
</template>

<script type="text/ecmascript-6">
    import DMusicList from '@/components/singer/MusicList'
    import { getSongList } from 'api/recommend'
    import { ERR_OK } from 'api/config'
    import { mapGetters } from 'vuex'
    import { createSong, isValidMusic, processSongsUrl } from 'js/song'

    export default {
        name:'Disc',
        components:{
            DMusicList
        },
        data(){
          return {
              songs:[]
          }
        },
        created(){
            this._getSongList()
        },
        computed:{
            title(){
              return this.disc.dissname
            },
            bgImage(){
                return this.disc.imgurl
            },
            ...mapGetters([
                'disc'
            ])
        },
        methods:{
            // 数据抓取
            _getSongList(){
                if(!this.disc.dissid){
                    this.$router.push({
                        path:'/recommend'
                    });
                    return
                }
                getSongList(this.disc.dissid).then((res)=>{
                    if(res.code===ERR_OK){
                        let data=res.cdlist[0].songlist;
                        processSongsUrl(this._normalizeSongs(data)).then((song)=>{
                           this.songs=song
                        })
                    }
                })
            },
            _normalizeSongs(list){
                let ret=[];
                list.forEach((musicData)=>{
                    if(isValidMusic(musicData)){
                        ret.push(createSong(musicData))
                    }
                })
                return ret;
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .slide-enter-active, .slide-leave-active
        transition: all 0.3s

    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)
</style>