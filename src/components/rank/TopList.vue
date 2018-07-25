<template>
    <transition name="slide">
        <TMusicList :title="title" :rank="rank" :bgImage="bgImage" :songs="songs"></TMusicList>
    </transition>
</template>

<script type="text/ecmascript-6">
    import TMusicList from '@/components/singer/MusicList'
    import { getMusicList } from 'api/rank'
    import { ERR_OK } from 'api/config'
    import { mapGetters } from 'vuex'
    import { createSong, isValidMusic, processSongsUrl } from 'js/song'

    export default {
        name:'TopList',
        components:{
            TMusicList
        },
        data(){
            return {
                songs:[],
                rank:true
            }
        },
        created(){
            this._getMusicList()
        },
        computed:{
            title(){
              return this.topList.topTitle
            },
            bgImage(){
                if(this.songs.length){
                    return this.songs[0].image
                }
               return ''
            },
            ...mapGetters([
                'topList'
            ])
        },
        methods:{
            _getMusicList(){
                if(!this.topList.id){
                    this.$router.push({
                        path:'/rank'
                    })
                    return
                }
                getMusicList(this.topList.id).then((res)=>{
                    if(res.code===ERR_OK){
                        const songList=res.songlist;
                        processSongsUrl(this._normalizeSongs(songList)).then((song)=>{
                            this.songs=song;
                        })
                    }
                })
            },
            _normalizeSongs(list){
                let ret=[];
                list.forEach((item)=>{
                    const musicData = item.data
                    if(isValidMusic(musicData)){
                        ret.push(createSong(musicData))
                    }
                });
                return ret;
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .slide-enter-active, .slide-leave-active
        transition: all 0.3s ease

    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)
</style>