import jsonp from 'js/jsonp'
import {commonParams,options} from 'api/config';
import {ERR_OK} from 'api/config'

export function getTopList() {
    const url='https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';
    const data=Object.assign({},commonParams,{
        g_tk: 67232076,
        uin: 0,
        platform: 'h5',
        needNewCode: 1,
    })
    return jsonp(url,data,options);
}

export function getMusicList(topid) {
   const url='https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';
    const data=Object.assign({},commonParams,{
        g_tk: 5381,
        uin: 0,
        platform: 'h5',
        needNewCode: 1,
        tpl: 3,
        page: 'detail',
        type: 'top',
        topid: topid,
    })

    return jsonp(url,data,options)
}