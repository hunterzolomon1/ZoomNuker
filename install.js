const babyprocess = require("child_process");

setTimeout(() => {
    console.log("Welcome to Zoom Nuker installer")
    console.log("checking the packages...")
    const fs = require("fs")
    fs.readFile("package.json","utf8",async (err,data)=>{
        if (err){
            console.log("please create a package.json file first in order to install this app\nthe new window is going to open automatically")
            console.info("remember to re-run the installer after the package setup")
            
            babyprocess.execSync("start cmd /c npm init")
            return
        }
        let jsondata = JSON.parse(data)
        if (jsondata.dependencies){
            let dependencies = jsondata.dependencies
            if (!dependencies.electron){
                console.log("missing electron package... installing automatically")
                babyprocess.exec("npm install electron")
            }else console.log("electron is already installed")
            if (!dependencies.express){
                console.log("missing express package... installing automatically")
                babyprocess.exec("npm install express")
            }else console.log("express is already installed")
            if (!dependencies.ws){
                console.log("missing ws package... installing automatically")
                babyprocess.exec("npm install ws")
            }else console.log("ws is already installed")
        }else{
            console.log("no packages found. installing all one by one")
            babyprocess.exec("npm install electron")
            babyprocess.exec("npm install express")
            babyprocess.exec("npm install ws")
        }
    })
}, 4000);