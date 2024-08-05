const {ipcRenderer, webContents} =require ('electron')
const {$} = require ('./helper.js')
const path = require('path')
let musicAudio =new Audio()

const {remote} = require ('electron')
const pw = remote.getCurrentWindow().getParentWindow();
ipcRenderer.setMaxListeners(Infinity);

let musicData ={};
//全局变量id
let currentPlayId=0;

function newCPI(id) {
    currentPlayId =id;
    
}
function gCPI(){
    return currentPlayId;
}
//是否继续播放
let idc =null;
function idC(id){
    idc =id
}
function idCf(){
    return idc;
}
//数据库信息接收
ipcRenderer.on('receive-files', (event,files) => {
    musicData =files
    displayMusicData();

});

function displayMusicData(){
    const trackList = document.querySelector('#tracksList');
    const trackListHTML = Object.entries(musicData).reduce((html, [key, value]) => {
      
        html+=`
         <span class="file-info">               
         <span class="file-id">${key}</span> <!-- 显示文件ID -->                
         <span class="file-name">${path.basename(value)}</span> <!-- 显示文件名 -->            
         </span>            
         <span class="file-actions">                
         <button class="btn btn-play" title="播放">                    
         <i class="fa fa-play" data-id="${key}" data-path="${value}"></i> <!-- 如果使用Font Awesome -->                    
         <!-- 或者使用字符实体 -->                    
         <!-- <span>&#9654;</span> -->                
         </button>                
         <button class="btn btn-trash" title="删除">                    
         <i class="fa fa-trash" trash-id="${key}"></i> <!-- 如果使用Font Awesome -->                    
         <!-- 或者使用字符实体 -->                    
         <!-- <span>&#128465;</span> -->                
         </button>            
         </span>
        `
        return html;
    },'');
    trackList.innerHTML =`<ul class="list-group">${trackListHTML}</ul>;`


    
}

//播放
function playMusic(address,id){
    
    if(idCf()==id){
        musicAudio.play()
    }else{
    pw.webContents.send('show play',address)
    musicAudio.src = address;
    musicAudio.play()
    }
    idC(id)
    
    
    
   
}

//点击监听
document.addEventListener('click', function(event) {
    
    if (event.target.classList.contains('fa-play')) {
        
        const fileId =event.target.getAttribute('data-id');
      
        const filePath =event.target.getAttribute('data-path')
        
        event.target.classList.replace('fa-play','fa-pause')
        newCPI(fileId)
        becomePause(fileId)
        playMusic(filePath,fileId);

    }
    // 暂停键
    else if(event.target.classList.contains('fa-pause')){
        event.target.classList.replace('fa-pause','fa-play')
        
        musicAudio.pause()
        
        

        
    }
    else if(event.target.classList.contains('fa-trash')){
         const fileId =event.target.getAttribute('trash-id');
         ipcRenderer.send('delete-music',fileId)
         ipcRenderer.on('delete-success',()=>{
            ipcRenderer.send('load')
         })

         
    }

});

//通过id获取value
function idGetValue(id){
    return musicData[id];
   
}


//上一首
ipcRenderer.on('bd',()=>{
    let back = gCPI()
    if(back>1){
       back=back-1;
       becomePause(back)
       newCPI(back)
       playMusic(idGetValue(back),back);
    }else{
       
        becomePause(back)
        playMusic(idGetValue(back),back)
    }
})
ipcRenderer.on('fd',()=>{
    let back= gCPI()
    let as =Object.keys(musicData);
    let nKey =as.length;
    if (back<nKey) {
        let b =parseInt(back) +1;
        
        becomePause(b)
        newCPI(b)
        playMusic(idGetValue(b),b);
    }else{
        becomePause(back)
        playMusic(idGetValue(back),back)
    }

    
})



// 请求文件信息
$('loadFilesButton').addEventListener('click',()=>{
    ipcRenderer.send('load')
})

//更新信息
function becomePause(id) {
    const players =document.querySelectorAll('.fa-pause');
    players.forEach(player=>{
       if(player!==id){
         player.classList.replace('fa-pause','fa-play');
       }
    })
  
    var iconElement = document.querySelector(`i[data-id="${id}"]`);
    iconElement.classList.remove('fa-play');
    iconElement.classList.add('fa-pause');
   
}

//判断循环和单体
var insertC =false;
function insertCt() {
    insertC=true;
}
function insertCf(){
    insertC=false;
}
function insertCReturn(){
    return insertC;
}
ipcRenderer.on('ncp',()=>{
    insertCt();
})
ipcRenderer.on('cp',()=>{
    insertCf();
})

   

function continuePlay(){
    musicAudio.play();
}
//音乐播放结束判断
musicAudio.onended=function(){
    if(insertCReturn()){
        let as =Object.keys(musicData);
        let nKey =as.length;
      
       
        if(gCPI()<nKey){
             let g =gCPI();
             let i =parseInt(g)+1
             alert(i)
             newCPI(i);
             
             becomePause(i)
             playMusic(idGetValue(i),i)
             

        }
        else if(gCPI()==nKey){
            newCPI(1);
            becomePause(1)
            playMusic(idGetValue(1),1)
        }
    }
    else{
    musicAudio.play()
    }
}

//我真牛逼


















