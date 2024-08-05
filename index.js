const { app, BrowserWindow, ipcMain, dialog, webContents,Menu } = require('electron');
const path = require('path');

const fs = require('fs')
const sqlite3 = require('sqlite3');
const { error } = require('console');
const cxkData = ('./database.sqlite');
ipcMain.setMaxListeners(Infinity)
function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 760,
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
    
    frame:false,
    autoHideMenuBar:true,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),

      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
      enablePreferredSizeMode: true,
       
      
      


      resizable: true,
      webSecurity: false,


      webviewTag: true,

    }
    
  })
  win.setMenuBarVisibility(false)
  
  win.loadFile('./index.html')
  ipcMain.on('close-win',()=>{
    win.close()
  })
  ipcMain.on('small-win',()=>{
    win.minimize()
  })    
  ipcMain.on('new win',()=>{
    
    const fileWin = new BrowserWindow({
      
      width: 350,
      height: 600,
      x:win.getBounds().x -350,
      y:win.getBounds().y +160,
      titleBarStyle: 'hidden',
      frame:false,
      titleBarOverlay: true,
      
      webPreferences: {
        
  
        nodeIntegration: true,
        contextIsolation: false,
        sandbox: false,
        enablePreferredSizeMode: true,
  
  
  
  
  
        resizable: true,
        webSecurity: false,
  
  
        webviewTag: true,
  
      },
      parent:win
      
      
      
    })
    fileWin.setMenuBarVisibility(false)
    
    let co = fileWin.webContents
    ipcMain.on('main-pause',(event,pause)=>{
      
        co.send('pause',pause)
        
      
    
      
    })
    ipcMain.on('main-play',(event,play)=>{
      
        co.send('mp',play)
    })
    ipcMain.on('backward',()=>{
      co.send('bd')
    })
    ipcMain.on('forward',()=>{
      co.send('fd')
    })
    ipcMain.on('not-circle-play',()=>{
      co.send('ncp')
    })
    ipcMain.on('circle-play',()=>{
      co.send('cp')
    })
   


   

 


    fileWin.loadFile('./newPage.html');
   

   
    
   
    
    fileWin.once('ready-to-show',()=>{
      fileWin.show();
    })
  
  
  })

  //创建数据库，如果有就不创建
  ipcMain.on('add-music', (event) => {
    
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Music', extensions: ['mp3'] }]
    }).then((result) => {
      // 确保你选择了文件
      if (!result.canceled) {

        event.sender.send('select-file', result.filePaths);
        console.log(result.filePaths);

        
      }
    })
  });
  

    
  


  ipcMain.on('add-tracks', (event, tracks) => {
    const db = new sqlite3.Database(cxkData)
    
    

    const dbPath = String(tracks)


    
  


     
    
     
      


    


      // 创建用户表
      db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      address TEXT UNIQUE NOT NULL
      )`, (err) => {
        if (err) {
          return;
        }
        const sql = 'SELECT id FROM users'; // 替换为你的表名

      // 执行查询并遍历结果
        db.all(sql, [], (err, rows) => {
        
        let i = rows.length+1

        db.run(`INSERT INTO users (id,address) VALUES (?,?)`, [i,dbPath], (err) => {
          if (err) {

            
            db.close();
            return;
          }

         

        });
           
           
          
        
      });



        











      });
  ;
  })





 
  




 





}

app.on('ready', () => {
  Menu.setApplicationMenu(null)
  createWindow()
})
ipcMain.on('load', (event) => {
  
 
  const db = new sqlite3.Database(cxkData, (err) => {
    if (err) {
      
      return;
    }
  });
 
  const sqlSelect = 'SELECT id, address FROM users';
  db.all(sqlSelect, [], (err, rows) => {
    if (err) {
      
      return;
    }

    // 将查询结果转换为键值对形式
    const addresses = rows.reduce((acc, row) => {
      acc[row.id] = row.address;
      return acc;
    }, {});

    // 发送数据到渲染进程
    
    event.sender.send('receive-files', addresses);
  });
});


ipcMain.on('play-music', (event, id) => {
  const db = new sqlite3.Database(cxkData, (err) => {
    if (err) {
      
      return;
    }
  });

  const sqlSelect = 'SELECT address FROM users WHERE id = ?';
  db.get(sqlSelect, [id], (err, row) => {
    if (err) {
      
      db.close();
      return;
    }
    if (!row) {
     
      db.close();
      return;
    }

    const address = row.address;
    event.sender.send('play-address', address);

    db.close();
  });
});



  
  ipcMain.on('delete-music', (event, musicId) => {
    const db = new sqlite3.Database(cxkData)
    // 删除指定ID的记录
    const deleteSql = 'DELETE FROM users WHERE id = ?';
    db.run(deleteSql, [musicId], function(err) {
      if (err) {
        
        return;
      }
  
      // 更新剩余记录的ID
      const updateSql = 'UPDATE users SET id = id - 1 WHERE id > ?';
      db.run(updateSql, [musicId], function(err) {
        if (err) {
          
          return;
        }
  
        // 发送成功删除和更新的消息回渲染进程
        event.reply('delete-success', `Music with ID ${musicId} deleted and IDs updated.`);
      });
    });
  });








  ipcMain.on('go', (event, id) => {
    const db = new sqlite3.Database(cxkData, (err) => {
      if (err) {
       
        return;
      }
    });
  
    const sqlSelect = 'SELECT address FROM users WHERE id = ?';
    db.get(sqlSelect, [id], (err, row) => {
      if (err) {
        
        db.close();
        return;
      }
      if (!row) {
        
        db.close();
        return;
      }
  
      const address = row.address;
      event.sender.send('go1', address);
  
      db.close();
    });
  });














 