const electron = require("electron")

function create_window(){
    const win = new electron.BrowserWindow({
        width: 1200,
        height: 600,
        autoHideMenuBar: true,
        resizable: false,
        title:"Zoom Nuk3r"
    })
    win.loadFile("res/index.html")
}

electron.app.on("ready",()=>{
    create_window()

    electron.app.on("activate",()=>{
        if (electron.BrowserWindow.getAllWindows().length === 0) create_window()
    })
})

electron.app.on("window-all-closed",()=>{
    electron.app.quit()
})