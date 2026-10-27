/* מצב קל לאייפד ולנייד: ?lite=1 מכריח, ?lite=0 מבטל */
(function(){ try{
  var ua=navigator.userAgent||''; var touchMac=(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(/iPad|iPhone|iPod|Android/.test(ua)||touchMac||/[?&]lite=1/.test(location.search)) document.documentElement.classList.add('pk-lite');
  if(/[?&]lite=0/.test(location.search)) document.documentElement.classList.remove('pk-lite');
}catch(e){} })();
