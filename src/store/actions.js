import * as types from './mutation-types';
import {playMode} from "js/config";
import {shuffle} from "js/until";
import {
    saveSearch,
    deleteSearch,
    clearSearch,
    savePlay,
    saveFavorite,
    deleteFavorite} from "js/catche";

function findIndex(list,song) {
    return list.findIndex((item)=>{
        return item.id===song.id
    })
}
export const selectPlay=function ({commit,state},{list,index}) {
    commit(types.SET_SEQUENCE_LIST,list);
    if(state.mode===playMode.random){
        let randomList=shuffle(list);
        commit(types.SET_PLAYLIST,randomList);
        index=findIndex(randomList,list[index])
    }else{
        commit(types.SET_PLAYLIST,list);
    }
    commit(types.SET_CURRENT_INDEX,index);
    commit(types.SET_FULL_SCREEN,true);
    commit(types.SET_PLAYING_STATE,true)
};

// 随机播放
export const randomPlay=function ({commit},{list}) {
    commit(types.SET_SEQUENCE_LIST,list);
    commit(types.SET_PLAY_MODE,playMode.random);
    let randomList=shuffle(list);
    commit(types.SET_PLAYLIST,randomList);
    commit(types.SET_CURRENT_INDEX,0);
    commit(types.SET_FULL_SCREEN,true);
    commit(types.SET_PLAYING_STATE,true)
};

// 插入歌曲
export function insertSong({commit,state},song) {
    let playlist=state.playlist.slice();
    let sequenceList=state.sequenceList.slice();
    let currentIndex=state.currentIndex;
    // 记录当前歌曲
    let currentSong=playlist[currentIndex];
    // 查找当前歌曲的索引值
    let fpIndex=findIndex(playlist,song);
    // 因为要插入，索引+1
    currentIndex++;
    // 在当前索引处插入这首歌曲
    playlist.splice(currentIndex,0,song);
    // 如果包含了这首歌曲
    if(fpIndex > -1){
       // 若currentIndex>fpIndex
        if(currentIndex>fpIndex){
           playlist.splice(fpIndex,1);
           currentIndex--
        }else{
            playlist.splice(fpIndex+1,1);
        }
    }
    let currentSIndex=findIndex(sequenceList,currentSong)+1;
    let fsIndex=findIndex(sequenceList,song);
    sequenceList.splice(currentSIndex,0,song);
    if(fsIndex > -1){
        if(currentSIndex>fsIndex){
            sequenceList.splice(fsIndex,1)
        }else{
            sequenceList.splice(fsIndex+1,1)
        }
    }
    commit(types.SET_PLAYLIST,playlist);
    commit(types.SET_SEQUENCE_LIST,sequenceList);
    commit(types.SET_CURRENT_INDEX,currentIndex);
    commit(types.SET_FULL_SCREEN,true);
    commit(types.SET_PLAYING_STATE,true)
}

//搜索历史
export function saveSearchHistory({commit},query) {
    commit(types.SET_SEARCH_HISTORY,saveSearch(query))
}
// 删除搜索历史
export function deleteSearchHistory({commit},query) {
    commit(types.SET_SEARCH_HISTORY,deleteSearch(query))
}
// 删除所有搜索历史
export function clearSearchHistory({commit}) {
    commit(types.SET_SEARCH_HISTORY,clearSearch())
}
// 删除播放列表歌曲
export function deleteSong({commit,state},song) {
    let playlist=state.playlist.slice();
    let sequenceList=state.sequenceList.slice();
    let currentIndex=state.currentIndex;
    let fpIndex=findIndex(playlist,song);
    playlist.splice(fpIndex,1);
    let sIndex=findIndex(sequenceList,song);
    sequenceList.splice(sIndex,1);
    if(currentIndex>fpIndex || currentIndex===playlist.length){
        currentIndex--
    }
    commit(types.SET_PLAYLIST,playlist);
    commit(types.SET_SEQUENCE_LIST,sequenceList);
    commit(types.SET_CURRENT_INDEX,currentIndex);
    let playingSate=playlist.length>0;
    commit(types.SET_PLAYING_STATE,playingSate)
}
// 清空播放历史
export function deleteSongList({commit,state}) {
    commit(types.SET_PLAYLIST,[]);
    commit(types.SET_SEQUENCE_LIST,[]);
    commit(types.SET_CURRENT_INDEX,-1);
    commit(types.SET_PLAYING_STATE,false)
}

// 保存播放歌曲

export function savePlayHistory({commit,state},song) {
    commit(types.SET_PLAY_HISTORY,savePlay(song))
}
// 喜欢的
export function saveFavoriteList({commit},song) {
    commit(types.SET_FAVORITE_LIST,saveFavorite(song))
}
export function deleteFavoriteList({commit},song) {
    commit(types.SET_FAVORITE_LIST,deleteFavorite(song))
}