// ページ移動のスライド（View Transitions API。対応していないブラウザでは普通に切り替わる）
// 進むときは次のページが右から入り、戻るとき（トップへ・ブラウザの戻る）は逆向きに動く。
// 移動元と移動先の両方がこのファイルを <head> で読み込んでいる必要がある
(function() {
  var style = document.createElement('style');
  style.textContent =
    '@view-transition{navigation:auto}' +
    '@media (prefers-reduced-motion:reduce){@view-transition{navigation:none}}' +
    '::view-transition-group(root){animation-duration:.36s;animation-timing-function:cubic-bezier(.2,0,0,1)}' +
    '::view-transition-old(root),::view-transition-new(root){animation-duration:.36s;animation-timing-function:cubic-bezier(.2,0,0,1);animation-fill-mode:both;mix-blend-mode:normal}' +
    '::view-transition-old(root){animation-name:vt-out-left}' +
    '::view-transition-new(root){animation-name:vt-in-right}' +
    'html:active-view-transition-type(back)::view-transition-old(root){animation-name:vt-out-right;z-index:1}' +
    'html:active-view-transition-type(back)::view-transition-new(root){animation-name:vt-in-left}' +
    '@keyframes vt-in-right{from{transform:translateX(100%)}}' +
    '@keyframes vt-out-left{to{transform:translateX(-25%);filter:brightness(.92)}}' +
    '@keyframes vt-out-right{to{transform:translateX(100%)}}' +
    '@keyframes vt-in-left{from{transform:translateX(-25%);filter:brightness(.92)}}';
  document.head.appendChild(style);

  // 戻る向きか：ブラウザの戻る、または階層の浅いページ（例：資料 → トップ）への移動
  function depth(url) { return new URL(url).pathname.split('/').length; }
  window.addEventListener('pagereveal', function(e) {
    if (!e.viewTransition || !window.navigation || !navigation.activation) return;
    var a = navigation.activation;
    if (!a.from || !a.entry) return;
    var back = a.navigationType === 'traverse'
      ? a.entry.index < a.from.index
      : depth(a.entry.url) < depth(a.from.url);
    e.viewTransition.types.add(back ? 'back' : 'forward');
  });
})();
