const {para}=require("./fp")

const {
    NS,
    fn_zip,
    fn_detail,
}=require("./config/config")

const {
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
}=require("./scf")

//初始化
dep_first=async (ns="test")=>{
    await init_ns(NS)
    await para(zip_create_fn,fn_detail(ns))
}

//更新
update_fn=async (ns="test")=>{
   await para(zip_update_fn,fn_zip(ns))
}

//发布
publish_ns=async ()=>{
    let ns=R.map(R.prop("Namespace"))(NS)
    await copy_ns(ns[0],ns[1])
}


const run=(arg=process.argv)=>{
    const commander = require('commander');
    const program = new commander.Command();
    program.version('0.0.1')

    program
      .option('-n, --ns <name>', 'namespace')
      .option('-f, --first', 'init ns & deploy ')
      .option('-u, --update', 'deploy test ns')
      .option('-p, --publish', 'cp test_ns release_ns')


    let help=`
    node deploy.js -n "ccc" -f
    node deploy.js -n "ccc" -u
    node deploy.js -n "ccc" -p
    `
    program.on('--help', function(){
        console.log(help)
    });

    program.parse(arg);

    let ns=program.ns||"test"
    console.log("ns",ns)

    let {first,update,publish}=program

    if  (!(first || update || publish)){
        return console.log(help)
    }

    if (first){
        console.log('init ns & deploy test_ns')
        //dep_first(ns)
    }

    if (update){
        console.log('update test_ns')
        //update_fn(ns)
    }

    if (publish){
        console.log('cp test_ns release_ns')
        //publish()
    }
}

module.exports={run}
