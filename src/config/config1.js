
//从toml里读设置
//https://cloud.tencent.com/document/api/583/17244#Code

const base_dir=`/q/web/code/python/cf/wasm/scf/scf-cli/`
const CONFIG_FILE=base_dir+"/config.toml"

const R=require('ramda')
const {
    read_toml,
    json2env,
}=require("../fp")


const configs=read_toml(CONFIG_FILE)
const {
  env: {
    app: { SecretId, SecretKey, Region},
    code: { CodeSources, CodeSource, DemoId},
    cos: {
      Bucket,
      Prefix,
      COS_HOST,
      maxFileSize,
      CosBucketName,
      CosObjectName,
      CosBucketRegion,
      TempCosObjectName,
    },
    git,
  },
  ns: { NS},
  fn: {
    file: { TMP_DIR, ZipFile , FN  },
    public_settings,
    private_settings,
  }
}=configs

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

let FN_CONFIG={
    ...public_settings,
    Environment:pub_env,
}
let FN_ENV=private_settings
let GIT=git

const fn_zip=(Namespace="test")=>FN.map(x=>({
    FunctionName:x,
    ZipFile:TMP_DIR+x+".zip",
    Namespace,
}))

const fn_detail=(Namespace="test")=>FN.map(x=>({
    FunctionName:x,
    ZipFile:TMP_DIR+x+".zip",
    env:FN_ENV[x]||{},
    Namespace,
}))

module.exports={
    configs,
    FN,
    TMP_DIR,
    FN_ENV,
    NS,
    FN_CONFIG,
    GIT,
}
