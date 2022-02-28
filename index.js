const site = require('./config/siteInfo');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

if(!fs.existsSync(path.resolve(__dirname, './profile'))){
    fs.mkdirSync(path.resolve(__dirname, './profile'));
}

var links = [];

const getProfile = async (biliId, key) => {
    https.get(`https://xysbtn.xiaoblogs.cn/userinfo?mid=${biliId}`, (res) => {
        res.on("data", (data) => {
            links.push({uid: biliId, link: JSON.parse(data.toString()).data.face});
        })
        res.on("end", () => {
            if(key === site.site.supports.length - 1){
                console.log("获取了所有的profile data");
                getJPG();
            }
        })
    }).on('error', ()=>{})
}

const getJPG = () => {
    links.map((v, k) => {
        http.get(v.link, (res) => {
            let imgdata = "";
            res.setEncoding("binary");
            res.on("data", (data) => {
                imgdata += data;
            })
            res.on("end", () => {
                fs.writeFileSync(path.resolve(__dirname, './profile', `${v.uid}.jpg`), imgdata, "binary", (err) => {
                    if (err){
                        throw err;
                    }
                })
            })
        }).on("error", () => {})
    })
}

const mainFunction = () => {
    site.site.supports.map((v, k) => {
        getProfile(v.uid, k);
    })
}

mainFunction();