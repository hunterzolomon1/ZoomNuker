console.log("SALAM SHOMA VAREDE ZOOM NUKER SHODID VA SCRIPTE APP FA'AL SHOD")


function randomnumber(limit){
    return Math.floor(Math.random()*limit)
}


function load(){
    let music = new Audio(`musics/${randomnumber(6)}.mp3`)
    music.play()
    document.getElementById("shutup").onclick = ()=>{
        music.pause()
    }
}


function ask(prompt){
    let controlpanel = document.getElementById("controlpanel")
    controlpanel.innerHTML = ""
    if (prompt.includes("name")){
        let newinput = document.createElement("input")
        newinput.type="text"
        newinput.placeholder = "enter the name here"
        newinput.id = "name"
        controlpanel.appendChild(newinput)
    }
    if (prompt.includes("count")){
        let newinput = document.createElement("input")
        newinput.type="number"
        newinput.placeholder = "how many times should i do this?"
        newinput.id = "count"
        controlpanel.appendChild(newinput)
    }
    if (prompt.includes("content")){
        let newinput = document.createElement("input")
        newinput.type="text"
        newinput.placeholder = "enter the content here"
        newinput.id = "content"
        controlpanel.appendChild(newinput)
    }
}


function answer(func){
    newbutt = document.createElement("button")
    newbutt.style.fontSize = "26"
    newbutt.innerHTML = "Action!"
    newbutt.onclick = func
    newbutt.style.margin = "20px"
    newbutt.style.padding = "20px"
    newbutt.style.color = "black"
    newbutt.id = "actionbutton"
    document.getElementById("controlpanel").appendChild(newbutt)
}


function set_token(){
    let token = document.getElementById("token").value
    if (document.getElementById("bot").checked){
        fetch("http://localhost:25565/set-token",{
            headers:{"Content-Type":"application/json"},
            method:"POST",
            body:JSON.stringify({token:token,guild:document.getElementById("guildid").value})
        })
    }else{
        fetch("http://localhost:25565/set-token",{
            headers:{"Content-Type":"application/json"},
            method:"POST",
            body:JSON.stringify({token:`Bot ${token}`,guild:document.getElementById("guildid").value})
        })
    }
    document.getElementById("loginpage").remove()
}


window.onload = load


let logs = {}

logs.write = (prompt)=>{
    document.getElementById("logs").value = document.getElementById("logs").value + prompt + "\n"
    document.getElementById("logs").scrollTo({top:document.getElementById("logs").scrollHeight,behavior:"smooth"})
}
logs.clear = ()=>{
    document.getElementById("logs").value = ""
}

const ws = new WebSocket("ws://localhost:25566")

ws.onmessage = (message)=>{
    logs.write(message.data)
}




function clear_channels(){
    fetch("http://localhost:25565/action",{
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({action:"clear_channels"}),
        method:"POST"
    })
}

function clear_roles(){
    fetch("http://localhost:25565/action",{
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({action:"clear_roles"}),
        method:"POST"
    })
}

function create_channel(){
    fetch("http://localhost:25565/action",{
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({action:"create_channel",name:document.getElementById("name").value,count:document.getElementById("count").value}),
        method:"POST"
    })
}

function create_role(){
    fetch("http://localhost:25565/action",{
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({action:"create_role",name:document.getElementById("name").value,count:document.getElementById("count").value}),
        method:"POST"
    })
}

function spam_message(){
    fetch("http://localhost:25565/action",{
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({action:"spam_message",count:document.getElementById("count").value,content:document.getElementById("content").value}),
        method:"POST"
    })
}

function rename(){
    fetch("http://localhost:25565/action",{
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({action:"rename",name:document.getElementById("name").value}),
        method:"POST"
    })
}

function prune(){
    fetch("http://localhost:25565/action",{
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({action:"prune"}),
        method:"POST"
    })
}