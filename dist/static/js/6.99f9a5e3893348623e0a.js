webpackJsonp([6],{"08Pt":function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var i=e("Dd8w"),s=e.n(i),c=e("qX9s"),o=e("6HuL"),a=e("F70A"),r=e("NYxO"),u=e("G3uJ"),f={name:"TopList",components:{TMusicList:c.a},data:function(){return{songs:[],rank:!0}},created:function(){this._getMusicList()},computed:s()({title:function(){return this.topList.topTitle},bgImage:function(){return this.songs.length?this.songs[0].image:""}},Object(r.c)(["topList"])),methods:{_getMusicList:function(){var t=this;this.topList.id?Object(o.a)(this.topList.id).then(function(n){if(n.code===a.a){var e=n.songlist;Object(u.d)(t._normalizeSongs(e)).then(function(n){t.songs=n})}}):this.$router.push({path:"/rank"})},_normalizeSongs:function(t){var n=[];return t.forEach(function(t){var e=t.data;Object(u.c)(e)&&n.push(Object(u.a)(e))}),n}}},g={render:function(){var t=this.$createElement,n=this._self._c||t;return n("transition",{attrs:{name:"slide"}},[n("TMusicList",{attrs:{title:this.title,rank:this.rank,bgImage:this.bgImage,songs:this.songs}})],1)},staticRenderFns:[]};var p=e("VU/8")(f,g,!1,function(t){e("t9sd")},"data-v-130b98e5",null);n.default=p.exports},"6HuL":function(t,n,e){"use strict";n.b=function(){var t=s()({},o.b,{g_tk:67232076,uin:0,platform:"h5",needNewCode:1});return Object(c.a)("https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg",t,o.c)},n.a=function(t){var n=s()({},o.b,{g_tk:5381,uin:0,platform:"h5",needNewCode:1,tpl:3,page:"detail",type:"top",topid:t});return Object(c.a)("https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg",n,o.c)};var i=e("woOf"),s=e.n(i),c=e("cQcd"),o=e("F70A")},t9sd:function(t,n){}});
//# sourceMappingURL=6.99f9a5e3893348623e0a.js.map