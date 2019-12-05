```bash

    export SecretId=****
    export SecretKey=****
    export Region=****
    export Bucket=****
    export Prefix=****
    export COS_HOST=****
    export maxFileSize=****
    export CosBucketName=****
    export CosObjectName=****
    export CosBucketRegion=****
    export ZipFile=****
    export CodeSource=****
    export DemoId=****
    export TempCosObjectName=****
    export GitUrl="https://github.com/xxx/xxx"
    export GitRepository=****
    export GitUserName=****
    export GitPassword=****
    export GitPasswordSecret=****
    export GitBranch=****
    export GitDirectory=****
    export GitCommitId=****
    export GitUserNameSecret=****

    #....


    # npm install scf-cli
    # scf-cli init
    # scf-cli update
    # scf-cli publish

```
[]( https://cloud.tencent.com/document/api/583/17235)

```bash
sdk
pip3 install tencentcloud-sdk-python
cnpm install tencentcloud-sdk-nodejs --save
go get -u github.com/tencentcloud/tencentcloud-sdk-go

```


```javascript

test_scf_sdk=async ()=>{
   c=conn()
   fn_list=await c._ListFunctions({})
   r=await c._GetFunction({"FunctionName":'pan-php'})

   console.log(r)
   name=r.FunctionName
   env=r.Environment.to_json_string()

   c.ListFunctions
   c.ListNamespaces
   c.ListVersionByFunction

   c.CopyFunction
   c.CreateFunction
   c.CreateNamespace
   c.CreateTrigger

   c.UpdateFunctionCode
   c.UpdateFunctionConfiguration
   c.UpdateNamespace

   c.DeleteFunction
   c.DeleteNamespace
   c.DeleteTrigger

   c.formatRequestData
   c.formatSignString
   c.request
   c.doRequest
   c.failRequest
   c.succRequest

   c.getEndpoint
   c.GetFunction
   c.GetFunctionAddress
   c.GetFunctionLogs

   c.Invoke
   c.isPrototypeOf

   c.mergeData
   c.propertyIsEnumerable
   c.PublishVersion
}


```

