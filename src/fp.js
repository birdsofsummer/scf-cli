const R=require('ramda')
const tencentcloud=require('tencentcloud-sdk-nodejs')
const fs=require('fs')
const toml=require("toml")
const crypto = require('crypto');

const {
    AccessInfo,
    Code,
    CopyFunctionRequest,
    CopyFunctionResponse,
    CreateFunctionRequest,
    CreateFunctionResponse,
    CreateNamespaceRequest,
    CreateNamespaceResponse,
    CreateTriggerRequest,
    CreateTriggerResponse,
    DeleteFunctionRequest,
    DeleteFunctionResponse,
    DeleteNamespaceRequest,
    DeleteNamespaceResponse,
    DeleteTriggerRequest,
    DeleteTriggerResponse,
    EipOutConfig,
    Environment,
    Filter,
    //Function,
    FunctionLog,
    FunctionVersion,
    GetFunctionAddressRequest,
    GetFunctionAddressResponse,
    GetFunctionLogsRequest,
    GetFunctionLogsResponse,
    GetFunctionRequest,
    GetFunctionResponse,
    InvokeRequest,
    InvokeResponse,
    ListFunctionsRequest,
    ListFunctionsResponse,
    ListNamespacesRequest,
    ListNamespacesResponse,
    ListVersionByFunctionRequest,
    ListVersionByFunctionResponse,
    LogFilter,
    LogSearchContext,
    Namespace,
    PublishVersionRequest,
    PublishVersionResponse,
    Result,
    Tag,
    Trigger,
    UpdateFunctionCodeRequest,
    UpdateFunctionCodeResponse,
    UpdateFunctionConfigurationRequest,
    UpdateFunctionConfigurationResponse,
    UpdateNamespaceRequest,
    UpdateNamespaceResponse,
    Variable,
    VpcConfig
}=tencentcloud.scf.v20180416.Models

const promisify=fn=>(arg={})=>new Promise((a,b)=>fn(arg,(e=null,d={})=>e ? b(e):a(d)))
const promisify_all=(c,m=["ListFunctions"])=>{
    m.forEach(x=>{
        c["_"+x]=promisify(c[x].bind(c))
    })
    return c
}

const para=(f,d=[])=>Promise.all(d.map(x=>f(x)))
const clean=R.pickBy((v,k)=>!R.isNil(v))
const join=(d={})=>Object.entries(d).sort().map(x=>x.join('=')).join('&')

const format_kv=(d={})=>R.toPairs(d).map(([k,v])=>({Key:k,Value:v}))
const json2env=(d={})=>{
    let env=new Environment()
    env.deserialize({Variables:format_kv(d)})
    return env
}

//add_vars({x:1,y:2},json2env({g:123,h:234}))
const add_vars=(d={},env,)=>{
    if (env) {
        env.Variables.push(format_kv(d))
        return env
    }else{
        return json2env(d)
    }
}

const create_req=(fn,d1={},d2={})=>{
    let req=new fn()
    let d=R.merge(d1,d2)
    Object.assign(req,d)
    return req
}

const conn=({SecretId,SecretKey,Region}=process.env)=>{
   const {Credential} = tencentcloud.common;
   let cred=new Credential(SecretId,SecretKey)
   let c=new tencentcloud.scf.v20180416.Client(cred,Region)
//   let m= R.keys(tencentcloud.scf.v20180416.Models).filter(x=>/resp/i.test(x)).map(x=>x.replace(/resp.*/i,'')).sort()
   let m=[
        "ListFunctions",
        "ListNamespaces",
        "ListVersionByFunction",

        "GetFunction",
        "GetFunctionAddress",
        "GetFunctionLogs",

        "CopyFunction",
        "CreateFunction",
        "CreateNamespace",
        "CreateTrigger",

        "PublishVersion",
        "UpdateFunctionCode",
        "UpdateFunctionConfiguration",
        "UpdateNamespace",

        "DeleteFunction",
        "DeleteNamespace",
        "DeleteTrigger",

        "doRequest",
        "failRequest",
        "formatRequestData",
        "formatSignString",
        "getEndpoint",
        "mergeData",
        "request",
        "succRequest",
        "Invoke",
    ]
   return promisify_all(c,m)
}

const export_sdk=()=>{
   let dd= {
            "CopyFunction": "复制函数",
            "CreateFunction": "创建函数",
            "DeleteFunction": "删除函数",
            "GetFunction": "获取函数详细信息",
            "GetFunctionLogs": "获取函数运行日志",
            "Invoke": "运行函数",
            "ListFunctions": "获取函数列表",
            "ListVersionByFunction": "查询函数版本",
            "PublishVersion": "发布新版本",
            "UpdateFunctionCode": "更新函数代码",
            "UpdateFunctionConfiguration": "更新函数配置",
            "CreateNamespace": "创建命名空间",
            "DeleteNamespace": "删除命名空间",
            "ListNamespaces": "列出命名空间列表",
            "UpdateNamespace": "更新命名空间",
            "CreateTrigger": "设置函数触发方式",
            "DeleteTrigger": "删除触发器",
            "GetFunctionAddress": "获取函数代码下载地址"
   }
   const m=tencentcloud.scf.v20180416.Models
   let d=R.fromPairs(R.keys(m)
       .filter(x=>/req/i.test(x))
       .map(x=>[
        x.replace(/req.*/i,""),
        {
        action:x.replace(/req.*/i,""),
        name:dd[x.replace(/req.*/i,"")]|| "",
        method:"post",
        req:x,
        res:x.replace(/req.*/i,"Response"),
        data0:(new m[x]),
        data1:new m[x.replace(/req.*/i,"Response")],
    }]))
    fs
      .createWriteStream('d.json')
      .write(JSON.stringify(d,null,'\t'))
}

const cp=(x={})=>JSON.parse(JSON.stringify(x))
const read_toml=(file_name='../config.toml')=>{
    let s=fs.readFileSync(file_name,"utf-8")
    return cp(toml.parse(s))
}


//-----------------手写sdk------------------------------------------------------------------------------------------------
const sign=(s="",
           signMethod="HmacSHA256",
           {SecretKey}=process.env
      )=> {
        let signMethodMap = {
            HmacSHA1: "sha1",
            HmacSHA256: "sha256"
        };
        let m=signMethodMap[signMethod]
        let hmac = crypto.createHmac(m , SecretKey);
        return hmac
            .update(Buffer.from(s, 'utf8'))
            .digest('base64')
}

const formatSignString= ( url="ssss", method="POST", params={}, path="/")=>method.toLocaleUpperCase() + url + path + "?" + join(params)

module.exports={
    para,
    format_kv,
    json2env,
    add_vars,
    promisify_all,
    read_toml,
    clean,
    sign,
    formatSignString,
    create_req,
    conn,
}

