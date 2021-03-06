import jsonp from 'js/jsonp'
import {commonParams,options} from 'api/config';
import {ERR_OK} from 'api/config'

// 搜索
export function getHotKey() {
    const url='https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';
    const data=Object.assign({},commonParams,{
        g_tk: 5381,
        uin: 0,
        platform: 'h5',
        needNewCode: 1
    });
    return jsonp(url,data,options)
}

// 搜索检索
export function search(query,page,zhida,perpage) {
    const url='https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';
    const data=Object.assign({},commonParams,{
        g_tk: 5381,
        uin: 0,
        platform: 'h5',
        needNewCode: 1,
        w: query,
        zhidaqu: 1,
        catZhida: zhida ? 1 : 0,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        perpage: perpage,
        n: perpage,
        p: page,
        remoteplace: 'txt.mqq.all',
    });
    return jsonp(url,data,options)
}