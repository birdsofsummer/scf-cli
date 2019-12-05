//https://www.npmjs.com/package/yaml

const fs = require("fs")
const yaml = require("yaml")

//{Variables:{x:1,y:2}}
const fn_name=(b={})=>Object.keys(b.Resources.default).filter(x=>x!=='Type')[0]

const read_env=(file_name='template.yaml')=>{
    let a=fs.readFileSync(file_name,'utf8')
    let b=yaml.parse(a)
    let f=fn_name(b)
    let props=b.Resources.default[f].Properties
    let Timeout=b.Globals.Function.Timeout
    return {name:f,props,Timeout}
}

module.exports={
    read_env,
}
