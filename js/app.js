// app.js - gerencia leitura de listas, render e auth (client-side)
const sampleChannelsKey = 'brc_tv_channels_v1';
const foldersEl = document.getElementById('folderList');
const channelsEl = document.getElementById('channelList');
const hero = document.getElementById('hero');
const playerContainer = document.getElementById('playerContainer');

let channels = []; // {id, title, folder, icon, url, type}

function loadFromStorage(){
  const raw = localStorage.getItem(sampleChannelsKey);
  if(raw){
    try{ channels = JSON.parse(raw); }catch(e){ channels = []; }
  } else {
    // seed sample channels
    channels = [
      {id:'ch1',title:'Sample MP4 Channel',folder:'Grátis',icon:'',url:'data/sample.mp4',type:'mp4'},
      {id:'ch2',title:'Sample Stream (m3u entry)',folder:'Grátis',icon:'',url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',type:'mp4'},
    ];
    localStorage.setItem(sampleChannelsKey, JSON.stringify(channels));
  }
}

function saveToStorage(){
  localStorage.setItem(sampleChannelsKey, JSON.stringify(channels));
}

function renderFolders(){
  const folders = Array.from(new Set(channels.map(c=>c.folder||'Sem Pasta')));
  foldersEl.innerHTML = '';
  folders.forEach(f=>{
    const li = document.createElement('li');
    li.textContent = f;
    li.addEventListener('click', ()=> renderChannels(f));
    foldersEl.appendChild(li);
  });
}

function renderChannels(folder){
  channelsEl.innerHTML = '';
  const list = channels.filter(c=> (folder? c.folder===folder : true));
  list.forEach(c=>{
    const li = document.createElement('li');
    li.textContent = c.title;
    li.title = c.url;
    li.addEventListener('click', ()=> openChannel(c.id));
    channelsEl.appendChild(li);
  });
}

function openChannel(id){
  const c = channels.find(x=>x.id===id);
  if(!c) return alert('Canal não encontrado');
  // show hero image & then play
  hero.classList.add('hidden');
  playerContainer.classList.remove('hidden');
  window.player.loadMediaListAndPlay(c, channels);
}

function init(){
  loadFromStorage();
  renderFolders();
  renderChannels();
}

window.addChannelList = function(newChannels){
  // newChannels = array of channel objects
  // merge by id
  const map = new Map(channels.map(c=>[c.id,c]));
  newChannels.forEach(n=>{
    map.set(n.id, n);
  });
  channels = Array.from(map.values());
  saveToStorage();
  renderFolders();
  renderChannels();
  alert('Canais importados: ' + newChannels.length);
}

init();
