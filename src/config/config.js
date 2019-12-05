//https://cloud.tencent.com/document/api/583/17244#Code

//从环境变量里读设置
const R=require('ramda')
const {
    read_toml,
    json2env,
    format_kv,
}=require("../fp")

const {
    SecretId,
    SecretKey,
    Region,
    Bucket,
    Prefix,
    COS_HOST,
    maxFileSize,

    CosBucketName,
    CosObjectName,
    CosBucketRegion,

    ZipFile,
    CodeSource,
    DemoId,
    TempCosObjectName,

    GitUrl,
    GitUserName,
    GitPassword,
    GitPasswordSecret,
    GitBranch,
    GitDirectory,
    GitCommitId,
    GitUserNameSecret

}=process.env

const NS=[
       {
           Namespace:"test",
           Region,
           Description:"test"
       },
       {
           Namespace:"release",
           Region,
           Description:"release"
       },
]

let TMP_DIR="/tmp/dep/"
let FN=["user","token"]

const ENV={
    SecretId,
    SecretKey,
    Bucket,
    Region,
    Prefix,
    maxFileSize,
    COS_HOST,
}


let pub_env=json2env(ENV)
const FN_CONFIG={
        FunctionName:'hello',
        Description:"hello",
        Handler: "index.main_handler",
        Region,
        Namespace:"default",
        Publish:'TRUE',
        L5Enable:'TRUE',
        Runtime: "Nodejs8.9",
        Role: "QCS_SCFExcuteRole",
        Timeout: 30,
        MemorySize:128*2,
        Environment:pub_env,
}

let FN_ENV={
    "user":{
        ux:1,
        uy:2,
    },
    "token":{
        tx:1,
        ty:2,
    },
}

let GIT={
    GitUrl,
    GitUserName,
    GitPassword,
    GitPasswordSecret,
    GitBranch,
    GitDirectory,
    GitCommitId,
    GitUserNameSecret
}

const fn_zip=(Namespace="test")=>FN.map(x=>({
    FunctionName:x,
    ZipFile:TMP_DIR+x+".zip",
    Namespace,
}))

const fn_detail=(Namespace="test")=>FN.map(x=>({
    FunctionName:x,
    ZipFile:TMP_DIR + x + ".zip",
    env:FN_ENV[x]||{},
    Namespace,
}))



module.exports={
    FN,
    TMP_DIR,
    FN_ENV,
    NS,
    FN_CONFIG,
    GIT,
    fn_zip,
    fn_detail,

}
