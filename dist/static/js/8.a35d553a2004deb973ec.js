webpackJsonp([8],{"2JT8":function(t,s){},"5FTE":function(t,s,e){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var i=e("Dd8w"),n=e.n(i),r=e("f0SW"),a=e("Edo8"),c=e("/y60"),o=e("Zw4C"),l=e("NYxO"),u=e("G3uJ"),d={name:"UserCenter",mixins:[e("5jRo").b],components:{USwitches:r.a,UScroll:a.a,USongList:c.a,UNoResult:o.a},data:function(){return{switches:[{name:"我喜欢的"},{name:"最近听到"}],currentIndex:0}},computed:n()({noResult:function(){return 0===this.currentIndex?!this.favoriteList.length:!this.playHistory.length},noResultDesc:function(){return 0===this.currentIndex?"暂无收藏歌曲":"你还没有听过歌曲"}},Object(l.c)(["favoriteList","playHistory"])),methods:n()({onHandlePlaylist:function(t){var s=t.length>0?"60px":"";this.$refs.listWrapper.style.bottom=s,this.$refs.favoriteList&&this.$refs.favoriteList.refresh(),this.$refs.playList&&this.$refs.playList.refresh()},back:function(){this.$router.back()},switchItem:function(t){this.currentIndex=t},selectSong:function(t){this.insertSong(new u.b(t))},random:function(){var t=0===this.currentIndex?this.favoriteList:this.playHistory;0!==t.length&&(t=t.map(function(t){return new u.b(t)}),this.randomPlay({list:t}))}},Object(l.b)(["insertSong","randomPlay"]))},f={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("transition",{attrs:{name:"slide"}},[e("div",{staticClass:"user-center"},[e("div",{staticClass:"back",on:{click:t.back}},[e("i",{staticClass:"icon-back"})]),t._v(" "),e("div",{staticClass:"switches-wrapper"},[e("USwitches",{attrs:{switches:t.switches,currentIndex:t.currentIndex},on:{switch:t.switchItem}})],1),t._v(" "),e("div",{ref:"playBtn",staticClass:"play-btn",on:{click:t.random}},[e("i",{staticClass:"icon-play"}),t._v(" "),e("span",{staticClass:"text"},[t._v("随机播放全部")])]),t._v(" "),e("div",{ref:"listWrapper",staticClass:"list-wrapper"},[0===t.currentIndex?e("UScroll",{ref:"favoriteList",staticClass:"list-scroll",attrs:{data:t.favoriteList}},[e("div",{staticClass:"list-inner"},[e("USongList",{attrs:{songs:t.favoriteList},on:{select:t.selectSong}})],1)]):t._e(),t._v(" "),1===t.currentIndex?e("UScroll",{ref:"playList",staticClass:"list-scroll",attrs:{data:t.playHistory}},[e("div",{staticClass:"list-inner"},[e("USongList",{attrs:{songs:t.playHistory},on:{select:t.selectSong}})],1)]):t._e()],1),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:t.noResult,expression:"noResult"}],staticClass:"no-result-wrapper"},[e("UNoResult",{attrs:{title:t.noResultDesc}})],1)])])},staticRenderFns:[]};var h=e("VU/8")(d,f,!1,function(t){e("2JT8")},"data-v-4099ea50",null);s.default=h.exports}});
//# sourceMappingURL=8.a35d553a2004deb973ec.js.map