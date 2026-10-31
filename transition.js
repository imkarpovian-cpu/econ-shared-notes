// ページ移動のスライド
// 進むときは次のページが右から入り、戻るとき（トップへ・ブラウザの戻る）は逆向きに動く。
// 基本は View Transitions API（移動元と移動先を重ねて動かす）。読み込みが遅くてブラウザが諦めたときや、
// 対応していないブラウザでは、移動先のページだけを同じ向きにスライドさせて表示する。
// 移動元と移動先の両方がこのファイルを <head> で読み込んでいる必要がある
(function() {
  var KEY = 'slide_nav';
  var EASE = 'cubic-bezier(.2,0,0,1)';
  var style = document.createElement('style');
  style.textContent =
    '@view-transition{navigation:auto}' +
    '@media (prefers-reduced-motion:reduce){@view-transition{navigation:none}}' +
    '::view-transition-group(root){animation-duration:.36s;animation-timing-function:' + EASE + '}' +
    '::view-transition-old(root),::view-transition-new(root){animation-duration:.36s;animation-timing-function:' + EASE + ';animation-fill-mode:both;mix-blend-mode:normal}' +
    '::view-transition-old(root){animation-name:vt-out-left}' +
    '::view-transition-new(root){animation-name:vt-in-right}' +
    'html:active-view-transition-type(back)::view-transition-old(root){animation-name:vt-out-right;z-index:1}' +
    'html:active-view-transition-type(back)::view-transition-new(root){animation-name:vt-in-left}' +
    '@keyframes vt-in-right{from{transform:translateX(100%)}}' +
    '@keyframes vt-out-left{to{transform:translateX(-25%);filter:brightness(.92)}}' +
    '@keyframes vt-out-right{to{transform:translateX(100%)}}' +
    '@keyframes vt-in-left{from{transform:translateX(-25%);filter:brightness(.92)}}' +
    // 代わりのスライド：移動先のページ（body）だけを動かす。終わったらクラスごと外す
    'html.slide-in{overflow-x:clip}' +
    'html.slide-in body{animation:slide-in-right .36s ' + EASE + ' backwards}' +
    'html.slide-in.back body{animation-name:slide-in-left}' +
    '@keyframes slide-in-right{from{transform:translateX(100%)}}' +
    '@keyframes slide-in-left{from{transform:translateX(-30%);opacity:0}}';
  document.head.appendChild(style);

  function depth(url) { return new URL(url, location.href).pathname.split('/').length; }
  function bare(url) { return new URL(url, location.href).href.split('#')[0]; }

  // 移動元：サイト内のリンクを押したら、行き先と向きを残しておく（Navigation API がないブラウザ用）
  document.addEventListener('click', function(e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target && a.target !== '_self' || a.hasAttribute('download') || a.origin !== location.origin) return;
    if (bare(a.href) === bare(location.href)) return; // 同じページ内のリンク
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ to: bare(a.href), back: depth(a.href) < depth(location.href), t: Date.now() }));
    } catch (err) {}
  }, true);

  // 移動先：どちら向きに来たか。サイト内の移動でなければ null
  function direction() {
    var a = window.navigation && navigation.activation;
    if (a) {
      if (!a.from || !a.entry || a.navigationType === 'reload') return null;
      return (a.navigationType === 'traverse' ? a.entry.index < a.from.index
                                              : depth(a.entry.url) < depth(a.from.url)) ? 'back' : 'forward';
    }
    try {
      var s = JSON.parse(sessionStorage.getItem(KEY));
      if (s && s.to === bare(location.href) && Date.now() - s.t < 30000) return s.back ? 'back' : 'forward';
    } catch (err) {}
    return null;
  }

  function slideIn(dir) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var html = document.documentElement;
    html.classList.add('slide-in');
    html.classList.toggle('back', dir === 'back');
    setTimeout(function() { html.classList.remove('slide-in', 'back'); }, 500);
  }

  function reveal(vt) {
    var dir = direction();
    try { sessionStorage.removeItem(KEY); } catch (err) {}
    if (!dir) return;
    var html = document.documentElement;
    if (vt) {
      vt.types.add(dir); // ブラウザのスライドが動く
      html.dataset.slide = 'vt-' + dir; // どちらで動いたかの記録（確認用）
      vt.ready.catch(function() { html.dataset.slide = 'fallback-' + dir; slideIn(dir); }); // 始まる前に取りやめられたら代わりにスライド
    } else {
      html.dataset.slide = 'fallback-' + dir;
      slideIn(dir); // 動かなかったので代わりにスライドさせる
    }
  }

  if ('onpagereveal' in window) {
    // 表示の直前に毎回届く（戻るボタンでキャッシュから復元したときも）
    window.addEventListener('pagereveal', function(e) { reveal(e.viewTransition); });
  } else {
    reveal(null);
    window.addEventListener('pageshow', function(e) { if (e.persisted) reveal(null); });
  }
})();
