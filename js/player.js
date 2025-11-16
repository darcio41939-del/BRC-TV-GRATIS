// player.js - player personalizado com controles básicos e playlist navigation
(function(){
  const video = document.getElementById('player');
  const btnPlay = document.getElementById('btnPlay');
  const btnNext = document.getElementById('btnNext');
  const btnPrev = document.getElementById('btnPrev');
  const seek = document.getElementById('seek');
  const volume = document.getElementById('volume');
  const btnMute = document.getElementById('btnMute');
  const btnFs = document.getElementById('btnFs');

  let playlist = [];
  let currentIndex = 0;
  let userPaused = false;

  function updatePlayButton(){
    btnPlay.textContent = video.paused ? '►' : '❚❚';
  }

  video.addEventListener('timeupdate', ()=>{
    if(!isNaN(video.duration)){
      const p = (video.currentTime / video.duration) * 100;
      seek.value = p;
    }
  });

  seek.addEventListener('input', ()=>{
    if(!isNaN(video.duration)){
      video.currentTime = (seek.value/100) * video.duration;
    }
  });

  volume.addEventListener('input', ()=>{ video.volume = volume.value; });

  btnMute.addEventListener('click', ()=>{
    video.muted = !video.muted;
    btnMute.textContent = video.muted ? '🔇' : '🔈';
  });

  btnPlay.addEventListener('click', ()=>{ if(video.paused) video.play(); else video.pause(); updatePlayButton(); });
  video.addEventListener('play', updatePlayButton);
  video.addEventListener('pause', updatePlayButton);

  btnNext.addEventListener('click', ()=> playIndex(currentIndex+1));
  btnPrev.addEventListener('click', ()=> playIndex(currentIndex-1));

  btnFs.addEventListener('click', ()=>{
    if(!document.fullscreenElement) playerRequestFull(); else document.exitFullscreen();
  });

  function playerRequestFull(){
    const pc = document.getElementById('playerContainer');
    if(pc.requestFullscreen) pc.requestFullscreen();
  }

  function ensureVideoSource(url){
    // set src and type if possible
    video.src = url;
    video.load();
  }

  function playIndex(i){
    if(i < 0) i = playlist.length -1;
    if(i >= playlist.length) i = 0;
    currentIndex = i;
    const item = playlist[currentIndex];
    ensureVideoSource(item.url);
    video.play().catch(()=>{});
  }

  // Public API for app
  window.player = {
    loadMediaListAndPlay(item, allChannels){
      // item may be single channel or the list (channels array)
      // build playlist: start from channels of same folder
      playlist = allChannels.slice();
      // sort it by title
      playlist.sort((a,b)=> (a.title||'').localeCompare(b.title||''));
      // find index of selected item by id
      currentIndex = Math.max(0, playlist.findIndex(x=>x.id === item.id));
      playIndex(currentIndex);
    }
  };
})();