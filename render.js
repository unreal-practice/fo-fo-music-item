  const {ipcRenderer, webContents} =require ('electron')
const {$,convertDuration} = require ('./helper.js')
const path = require('path');
const { tourContentEmits } = require('element-plus');
ipcRenderer.setMaxListeners(Infinity);
$('aaa').addEventListener('click',()=>{
  ipcRenderer.send('add-music')
})
$('tc').addEventListener('click',()=>{
  ipcRenderer.send('close-win')
})

$('zxh').addEventListener('click',()=>{
  ipcRenderer.send('small-win')
})
$('fff').addEventListener('click',()=>{
  ipcRenderer.send('new win')
})

var birdN =$('text-bird');
var textC=$('text-content');
birdN.addEventListener('click',function(){
  
  var files=[
             "感觉很无聊？不如来看看鸟巢吧，这样你就会更无聊了",
             "in whisper hopes where journey's begun",
             "你好！这里没有彩蛋",
             "一定要给作者好评",
             "跟夜风一样的声音，心碎得很好听",
             "来来往往就这么几句话，因为我想不到该说什么",
             "鸟巢有时不会说话,不是bug,是作者故意的",
             "再好听的歌，听多也会腻的",
             "听说下次作者会开发小游戏，真的吗？",
             
             "",
             "",
             ""
  ]
  var randomIndex =files[Math.floor(Math.random()*files.length)];
  
  
  
  textC.textContent=randomIndex;
  
  textC.style.opacity =1;
 
  setTimeout(function () {
    textC.style.opacity=0;
  },3000)
})



const renderListHTML =(paths)=>{
  
  const musicList =$('musicList')
  const musicItemsHTML=paths.reduce((html,music)=>{
   
    html += `<li class ="list-group-item">${path.basename(music)}</li>
             
             
             <i class="fa fa-step-backward"></i>
             <i class="fa fa-play-circle"></i>
             <i class="fa fa-step-forward"></i>
             
             
             
             
            
    `
    return html

  },'')
  musicList.innerHTML=`<ul class="list-group">${musicItemsHTML}</ul>`
  
}



ipcRenderer.on('show play',(event,path)=>{
  const arr = [path]
  renderListHTML(arr);
   
   

})






ipcRenderer.on('select-file',(event,u)=>{
  ipcRenderer.send('add-tracks',u)
})




ipcRenderer.on('hide play',()=>{
  
  const playIcons = document.getElementsByClassName('fa-pause');


  for (let i = 0; i < playIcons.length; i++) {

  
    playIcons[i].classList.replace('fa-pause','fa-play');
    
    
    
  
 }})






 
  document.body.addEventListener('click', (event) => {
    
    
   
    if (event.target.classList.contains('fa-step-forward')) {
      ipcRenderer.send('forward')

    }
    else if (event.target.classList.contains('fa-step-backward')){
      ipcRenderer.send('backward')
 
    }
    else if(event.target.classList.contains('fa-play-circle')){
      ipcRenderer.send('not-circle-play')
      event.target.classList.replace('fa-play-circle','fa-repeat')

    }
    else if(event.target.classList.contains('fa-repeat')){
      ipcRenderer.send('circle-play')
      event.target.classList.replace('fa-repeat','fa-play-circle')
    }
    
  });

