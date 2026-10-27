/* כפתור "התנתקות" גלוי בתפריט הצד (קורא לפונקציה הקיימת authLogout) */
(function(){
  var ICON='<svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><path d="M16 17l5-5-5-5"></path><path d="M21 12H9"></path></svg>';
  function ensure(){
    var nav=document.getElementById('nav'); if(!nav||nav.querySelector('.pk-logout'))return;
    var d=document.createElement('div'); d.className='nav-item pk-logout'; d.title='התנתקות'; d.innerHTML=ICON+'<span>התנתקות</span>';
    d.addEventListener('click',function(e){ e.stopPropagation(); try{ authLogout(); }catch(x){ console.error(x); } });
    nav.appendChild(d);
  }
  var tries=0, iv=setInterval(function(){
    var nav=document.getElementById('nav');
    if(nav){ ensure(); if(!nav.__pkLo){ nav.__pkLo=1; try{ new MutationObserver(ensure).observe(nav,{childList:true}); }catch(e){} } }
    if(++tries>120) clearInterval(iv);
  },500);
})();
