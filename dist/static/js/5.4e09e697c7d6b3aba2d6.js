webpackJsonp([5],{"6HuL":function(t,e,s){"use strict";e.b=function(){var t=n()({},o.b,{g_tk:67232076,uin:0,platform:"h5",needNewCode:1});return Object(a.a)("https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg",t,o.c)},e.a=function(t){var e=n()({},o.b,{g_tk:5381,uin:0,platform:"h5",needNewCode:1,tpl:3,page:"detail",type:"top",topid:t});return Object(a.a)("https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg",e,o.c)};var i=s("woOf"),n=s.n(i),a=s("cQcd"),o=s("F70A")},QEV6:function(t,e){},zOIG:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=s("Dd8w"),n=s.n(i),a=s("Edo8"),o=s("rUx+"),c=s("5jRo"),r=s("6HuL"),l=s("NYxO"),p=s("F70A"),u={mixins:[c.b],name:"Rank",components:{TScroll:a.a,TLoading:o.a},data:function(){return{topList:[]}},created:function(){this._getTopList()},computed:{},methods:n()({selectItem:function(t){this.$router.push({path:"/rank/"+t.id}),this.setTopList(t)},onHandlePlaylist:function(t){var e=t.length>0?"60px":0;this.$refs.rank.style.bottom=e,this.$refs.toplist.refresh()},_getTopList:function(){var t=this;Object(r.b)().then(function(e){e.code===p.a&&(t.topList=e.data.topList)})}},Object(l.d)({setTopList:"SET_TOP_LIST"}))},d={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{ref:"rank",staticClass:"rank"},[s("TScroll",{ref:"toplist",staticClass:"toplist",attrs:{data:t.topList}},[s("ul",t._l(t.topList,function(e){return s("li",{staticClass:"item",on:{click:function(s){t.selectItem(e)}}},[s("div",{staticClass:"icon"},[s("img",{directives:[{name:"lazy",rawName:"v-lazy",value:e.picUrl,expression:"item.picUrl"}],attrs:{width:"100",height:"100"}})]),t._v(" "),s("ul",{staticClass:"songlist"},t._l(e.songList,function(e,i){return s("li",{staticClass:"song"},[s("span",[t._v(t._s(i+1))]),t._v(" "),s("span",[t._v(t._s(e.songname)+"-"+t._s(e.singername))])])}))])})),t._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:!t.topList.length,expression:"!topList.length"}],staticClass:"loading-container"},[s("TLoading")],1)]),t._v(" "),s("router-view")],1)},staticRenderFns:[]};var f=s("VU/8")(u,d,!1,function(t){s("QEV6")},"data-v-b613b602",null);e.default=f.exports}});
//# sourceMappingURL=5.4e09e697c7d6b3aba2d6.js.map