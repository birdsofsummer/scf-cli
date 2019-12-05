//https://cloud.tencent.com/document/api/583/17235

const R=require('ramda')
const tencentcloud=require('tencentcloud-sdk-nodejs')
const {
    para,
    format_kv,
    json2env,
    add_vars,
    promisify_all,
    conn,
    create_req,
}=require('./fp')

const {
    NS,
    FN_CONFIG,
    GIT,
}=require("./config/config1")


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


let {
    SecretId,
    SecretKey,
    Region, //'ap-hongkong'
    Bucket,
    Prefix,
    maxFileSize,
    COS_HOST,
    CodeSource
}=process.env


//------------------------------------------------------------------------------------


//https://cloud.tencent.com/document/api/583/18580
//'{"Variables":[{"Key":"k1","Value":"v1"},{"Key":"k2","Value":"v2"}]}'
// {RequestId: '1856d711-26b9-4166-94dd-744cdf3434d3'}
const set_env=async (c,config={FunctionName:"hello"},d={})=>{
    let env=add_vars(d,FN_CONFIG.Environment)
    let d1={
        ...FN_CONFIG,
        Environment:env,
        ...config,
    }
    let req=create_req(UpdateFunctionConfigurationRequest,d1)
    let r=await c._UpdateFunctionConfiguration(req)
    let {FunctionName}=config
    let r1=await c._GetFunction({FunctionName})
    console.log(r)
    console.log(r1)
    return r1
}

const set_env_yaml=(c,file_name='template.yaml')=>{
    const {read_env}=require("./env")
    let {name,props,Timeout}=read_env(file_name)
    let vars=props.Environment.Variables
    let e=add_vars(vars,FN_CONFIG.Environment)
    let d1={
        ...FN_CONFIG,
        ...props,
        FunctionName:name,
        Timeout,
        Environment:e,
    }
    let req=create_req(UpdateFunctionConfigurationRequest,d1)
    console.log(req)
    return c._UpdateFunctionConfiguration(req)
}

const list_fn=async (d={})=>{
  let  c=conn()
   return c._ListFunctions(d)
}


//https://cloud.tencent.com/document/api/583/18586
const zip_create_fn=async ({ FunctionName, ZipFile , env={}, ...config})=>{
    if(!FunctionName) {
        throw "no fn name"
    }
    let c=conn()
    let code=create_req(Code,{ZipFile})
    let d={
        ...FN_CONFIG,
        CodeSource,
        Type:"HTTP", //Event
        Code:code,
        ...config,
        FunctionName,
    }
    let req=create_req(CreateFunctionRequest,d)
    let r=await c._CreateFunction(req)
    let r1=await set_env(c,d,env)
    let r2=await c._GetFunction({FunctionName})

    console.log(r)
    console.log(r1)
    console.log(r2)
    return r2
}


const git_create_fn=async ({FunctionName,env={},git=GIT,...config})=>{
    if(!FunctionName) {
        throw "no fn name"
    }
    let c=conn()
    let code=create_req(Code,git)
    let d={
        ...FN_CONFIG,
        CodeSource:"Git",
        Type:"HTTP", //Event
        Code:code,
        ...config,
        FunctionName,
    }

    let req=create_req(CreateFunctionRequest,d)
    let r=await c._CreateFunction(req)
    let r1=await set_env(c,d,env)
    let r2=await c._GetFunction({FunctionName})

    console.log(r)
    console.log(r1)
    console.log(r2)
    return r2
}

const copy_fn=async (d={})=>{
    let c=conn()
    let req=create_req(CopyFunctionRequest,d)
    return c._CopyFunction(req)
}

const publish_fn=(config={FunctionName:"hello",Description:""})=>{
    let c=conn()
    let req=create_req(PublishVersionRequest,FN_CONFIG,config)
    return c._PublishVersion(req)
}

const del_fn=(config={FunctionName:"hello",Namespace:"test"})=>{
    let c=conn()
    let req=create_req(DeleteFunctionRequest,config)
    return c._DeleteFunction(req)

}
//https://cloud.tencent.com/document/api/583/18581
const zip_update_fn=({
        FunctionName,
        Description="",
        Namespace="test",
        ZipFile,
        ...config
    })=>{
    let c=conn()
    let code=create_req(Code,{ZipFile})
    let d={
        ...FN_CONFIG,
        FunctionName,
        Description,
        Namespace,
      //  CosBucketName: null,
      //  CosObjectName: null,
      //  CosBucketRegion: null,
      //  EnvId: null,
        Publish: "TRUE",
        ZipFile ,
        Code: code,
        CodeSource,
        ...config,
    }
    let req=create_req(PublishVersionRequest,d)
    return c._UpdateFunctionCode(req)
}

const git_update_fn=({FunctionName,...config})=>{
    let c=conn()
    let code=create_req(Code,{
        ...GIT,
        ...config,
      //  GitUrl,
      //  GitUserName,
      //  GitPassword,
      //  GitPasswordSecret,
      //  GitBranch,
      //  GitDirectory,
      //  GitCommitId,
      //  GitUserNameSecret
    })
    let d={
        ...FN_CONFIG,
        FunctionName,
        Description,
      //  Namespace: null,
      //  CosBucketName: null,
      //  CosObjectName: null,
      //  CosBucketRegion: null,
      //  EnvId: null,
        Publish: "TRUE",
      //  ZipFile: file_name,
        Code: code,
        CodeSource:"Git",
    }
    let req=create_req(PublishVersionRequest,d)
    return c._UpdateFunctionCode(req)
}


const init_ns=async (ns=NS)=>{
       let c=conn()
       //let req=await para(c._DeleteNamespace,ns)
       let req=await para(c._CreateNamespace,ns)
       let ns_list1=await c._ListNamespaces()
       console.log(req)
       console.log(ns_list1)
       return ns_list1
}

const check_ns=async (c,ns1,ns2)=>{
       let {Namespaces,TotalCount}=await c._ListNamespaces({})
       if (TotalCount<1||Namespaces.filter(x=>x.Namespace==ns1)==0 ){
           throw "no source ns"
       }else if(Namespaces.filter(x=>x.Namespace==ns2)==0){
           return c._CreateNamespace({
                "Namespace": ns2,
                "Description":ns2,
           })
       }

}

const copy_ns=async (ns1,ns2,{Region}=process.env)=>{
       let c=conn()
       await check_ns(c,ns1,ns2)
       let r=await c._ListFunctions({"Namespace":ns1})
       let d=r.Functions.map(x=>({
			"FunctionName": x.FunctionName,
			"NewFunctionName": x.FunctionName,
			"Namespace": ns1,
			"TargetNamespace": ns2,
			"Description": x.Description,
			"TargetRegion": Region,
			"Override": "TRUE",
			"CopyConfiguration": "TRUE",
        }))
       return para(copy_fn,d)
}



const test_copy_fn=()=>{
    let cfg={
			"FunctionName": "pan-php",
			"NewFunctionName": "pan-php-tttt",
			"Namespace": "default",
			"TargetNamespace": "test1",
			"Description": "ddd",
			"TargetRegion": Region,
			"Override": "TRUE",
			"CopyConfiguration": "TRUE",
    }
    return  copy_fn(cfg)
}



module.exports={
    set_env,
    set_env_yaml,
    list_fn,
    del_fn,
    copy_fn,
    publish_fn,
    zip_create_fn,
    zip_update_fn,
    git_create_fn,
    git_update_fn,
    init_ns,
    copy_ns,
}
