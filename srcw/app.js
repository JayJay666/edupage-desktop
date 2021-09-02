const {app, BrowserWindow} = require('electron')

const BASE_URL = 'https://portal.edupage.org/';

function createWindow() {
    const win = new BrowserWindow({
        width: 1350,
        height: 800,
        // icon: __dirname + '/public/icon.icns'
    })

    // win.webContents.openDevTools()

    win.loadURL(BASE_URL)

    // Prevent open new window
    win.webContents.on('new-window', (event, url) => {
        event.preventDefault()
        win.loadURL(url)
    })

    // On main page remove default footer
    win.webContents.on('did-finish-load', () => {
        let code = `var footer = document.getElementById("dolnyPas");
            footer.remove();`;
        win.webContents.executeJavaScript(code);
    });

    // Prevent to go default login screen
    win.webContents.on('did-navigate', function (event, url) {
        // If in logout page, open again BASE_URL
        if (url.includes('edupage.org/login/index.php?out=1')) {
            win.loadURL(BASE_URL);
        }
    });
}

app.setName('Edupage Desktop');

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
