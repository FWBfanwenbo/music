<template>
    <transition name="slide">
        <SMusicList :bgImage="bgImage" :songs="songs" :title="title"></SMusicList>
    </transition>
</template>

<script>
    import SMusicList from '@/components/singer/MusicList'
    import {mapGetters} from 'vuex'
    import {getSingerDetail} from 'api/singer'
    import {createSong,isValidMusic,processSongsUrl} from 'js/song'
    import {ERR_OK} from 'api/config'
    export default {
        name: "SingerDetail",
        components:{
            SMusicList
        },
        computed:{
            bgImage(){
                return this.singer.avatar
            },
            title(){
                return this.singer.name
            },
            ...mapGetters([
               'singer'
            ])
        },
        data(){
            return {
                songs:[]
            }
        },
        created(){
            this._getSingerDetail()
        },
        methods:{
            _getSingerDetail(){
                if(!this.singer.id){
                    this.$router.push({
                        path:'/singer'
                    })
                    return
                }
                getSingerDetail(this.singer).then((res)=>{
                    if(res.code===ERR_OK){
                        processSongsUrl(this._normalizeSongs(res.data.list)).then((songs)=>{
                            this.songs=songs;
                        });
                    }
                })
            },
            _normalizeSongs(list){
                const ret=[];
                list.forEach((item)=>{
                    let {musicData}=item;
                    if(isValidMusic(musicData)){
                        ret.push(createSong(musicData))
                    }
                });
                return ret
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~stylus/variable.styl"
      &.slide-enter-active,&.slide-leave-active
        transition: all 0.5s
      &.slide-enter, &.slide-leave-to
        transform: translate3d(100%, 0, 0)

</style>