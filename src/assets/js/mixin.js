import {mapGetters,mapMutations,mapActions} from 'vuex';
import {playMode} from "js/config";
import {shuffle} from "js/until";
export const playlistMixin={
  computed:{
      ...mapGetters([
          'playlist'
      ])
  },
  mounted(){
      this.onHandlePlaylist(this.playlist)
  },
  activated(){
      this.onHandlePlaylist(this.playlist)
  },
  watch:{
      playlist(newVal){
          this.onHandlePlaylist(newVal)
      }
  },
  methods:{
      onHandlePlaylist(){
          throw new Error('Component must implement onHandlePlaylist method')
      }
  }
};

export const playerMixin={
    computed:{
        // 播放模式
        iconMode(){
            return this.mode===playMode.sequence?'icon-sequence':this.mode===playMode.loop?'icon-loop':'icon-random';
        },
        ...mapGetters([
            'playlist',
            'currentSong',
            'playing',
            'currentIndex',
            'mode',
            'sequenceList',
            'favoriteList'
        ])
    },
    methods:{
        // 点击改变播放模式
        changeMode(){
            let mode=(this.mode+1)%3;
            this.setPlayMode(mode);
            let list=null;
            if(mode===playMode.random){
                list=shuffle(this.sequenceList);
            }else{
                list=this.sequenceList
            }
            this.resetCurrentIndex(list)
            this.setPlaylist(list);
        },
        resetCurrentIndex(list){
            let index=list.findIndex((item)=>{
                return item.id===this.currentSong.id
            });
            this.setCurrentIndex(index)
        },
        getFavorite(song){
            if(this.isFavorite(song)){
                return 'icon-favorite'
            }
            return 'icon-not-favorite'
        },
        toggleFavorite(song){
            if(this.isFavorite(song)){
                this.deleteFavoriteList(song)
            }else{
                this.saveFavoriteList(song)
            }

        },
        isFavorite(song){
          let index=this.favoriteList.findIndex((item)=>{
              return song.id===item.id
          });
            return index > -1
        },
        ...mapMutations({
            setPlayingState:'SET_PLAYING_STATE',
            setCurrentIndex:'SET_CURRENT_INDEX',
            setPlayMode:'SET_PLAY_MODE',
            setPlaylist:'SET_PLAYLIST'
        }),
        ...mapActions([
            'saveFavoriteList',
            'deleteFavoriteList'
        ])
    }
};

export const searchMixin={
    data(){
        return {
            query:'',
            refreshDelay:100
        }
    },
    computed:{
        ...mapGetters([
            'searchHistory'
        ])
    },
    methods:{
        addQuery(str){
            this.$refs.searchBox.setQuery(str)
        },
        // 监听搜索词
        onQueryChange(query){
            this.query=query
        },
        // 搜索滚动收起键盘监听
        blurInput(){
            this.$refs.searchBox.blur()
        },
        // 保存搜索历史
        saveSearch(){
            this.saveSearchHistory(this.query)
        },
        // 删除搜索历史
        deleteOne(item){
            this.deleteSearchHistory(item)
        },
        ...mapActions([
            'saveSearchHistory',
            'deleteSearchHistory',
        ]),
    }
};