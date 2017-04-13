var fs = require('fs');
//先判断一些必要的文件或文件夹是否存在
function checkfile(path) {
    path.map((item)=> {
        fs.stat(item, (err, stats)=> {
            if (err) {
                console.log(err);
            }
        });
    })
}

checkfile(['./source', './views', './routes', './bin']);
//判断public assets的文件是否存在并与server里的文件名的hash值进行对比
fs.stat('./public/assets', (err, stats)=> {
    if (err) {
        console.log(err);
    } else {
        let fileHash='';
        fs.readdir('./public/assets','utf8',(err,files)=>{
            if(err){
                console.log(err);
            }else{
                filehash=files[0].split('.').length>1?files[0].split('.')[1]:files[1].split('.')[1];
            }
        });
        fs.stat('./server/static.prod.json', (err, stats)=> {
            if (err) {
                console.log(err);
            } else {
                fs.readFile('./server/static.prod.json','utf8',(err,data)=>{
                    if(err){
                        console.log(err);
                    }else{
                        let names=JSON.parse(data),hash='';
                        for(let key in names){
                            console.log(names[key]);
                            hash=names[key].js[0].split('\\')[1].split('.')[1];
                        }
                        if(hash!=filehash){
                            console.log('ERROR:请重新打包文件');
                        }
                    }
                })
            }
        })
    }
});


