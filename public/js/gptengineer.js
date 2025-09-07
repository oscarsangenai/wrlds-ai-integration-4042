// Async script loader with timeout cleanup
(function(){
  const s = document.createElement('script');
  let done = false;
  s.src = 'https://cdn.gpteng.co/gptengineer.js';
  s.async = true;
  s.defer = true;
  s.onload = () => { done = true };
  s.onerror = () => {};
  const timeout = setTimeout(() => { if (!done) s.remove(); }, 5000);
  document.head.appendChild(s);
})();