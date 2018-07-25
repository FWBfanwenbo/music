import {playMode} from 'js/config'
import {loadSearch,loadPlay,loadFavorite} from "js/catche";

const state={
    singer:{},
    playing:false, // 是否播放
    fullScreen:false, // 全屏
    playlist:[],// 播放列表
    sequenceList:[],// 顺序列表
    mode:playMode.sequence, // 播放样式
    currentIndex:-1, // 播放索引,
    disc:{},
    topList:{},// 排行榜数据
    searchHistory:loadSearch(),
    playHistory:loadPlay(),
    favoriteList:loadFavorite(),// 喜欢的
};
export default state