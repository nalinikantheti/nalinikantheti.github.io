// Keep failures recoverable without exposing file-hosting links.
document.querySelectorAll('.video-frame video').forEach(video => {
  const status=document.createElement('div');status.className='video-retry';status.hidden=true;status.setAttribute('role','status');
  const message=document.createElement('span');message.textContent='This video could not load.';
  const retry=document.createElement('button');retry.type='button';retry.textContent='Retry Video';
  retry.addEventListener('click',()=>{status.hidden=true;video.load();});
  status.append(message,retry);video.closest('.video-frame').append(status);
  video.addEventListener('error',()=>{status.hidden=false;},true);
  video.addEventListener('loadeddata',()=>{status.hidden=true;});
});
