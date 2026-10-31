(function() {
  // ID とパスワードは平文で置かず、SHA-256("ID:パスワード") だけを置く。
  // 変更するときは python -c "import hashlib;print(hashlib.sha256(b'ID:パスワード').hexdigest())" の結果に差し替える
  var VALID_HASH = '1a07f1d80ad255835bb625dad291045d6926ec064f5f32340061dbd84bd969cc';
  var KEY = 'shared_note_auth';

  if (sessionStorage.getItem(KEY) === 'ok') return;

  var overlay = document.createElement('div');
  overlay.id = 'auth-overlay';
  overlay.innerHTML =
    '<div class="auth-box">' +
      '<h2>経済学部・共有ノート</h2>' +
      '<p>閲覧にはIDとパスワードが必要です</p>' +
      '<form id="auth-form">' +
        '<input id="auth-id" type="text" placeholder="ID" autocomplete="username" required>' +
        '<input id="auth-pass" type="password" placeholder="パスワード" autocomplete="current-password" required>' +
        '<button type="submit">ログイン</button>' +
        '<div id="auth-error"></div>' +
      '</form>' +
    '</div>';

  var style = document.createElement('style');
  style.textContent =
    '#auth-overlay{position:fixed;inset:0;z-index:99999;background:#f9f9ff;display:flex;align-items:center;justify-content:center;padding:16px;font-family:"Noto Sans JP","Hiragino Kaku Gothic ProN","Yu Gothic UI","Meiryo",sans-serif;color:#1a1c22}' +
    '.auth-box{background:#f2f3fb;border-radius:28px;padding:40px 32px 32px;width:100%;max-width:380px;text-align:center}' +
    '.auth-box h2{margin:0 0 6px;font-size:1.4em;font-weight:400}' +
    '.auth-box p{margin:0 0 28px;font-size:.875em;color:#454852}' +
    '#auth-form input{display:block;width:100%;height:56px;padding:0 16px;margin:0 0 12px;border:1px solid #757782;border-radius:12px;font:inherit;font-size:1em;background:#fff;color:inherit;outline:none;box-sizing:border-box}' +
    '#auth-form input:focus{border-color:#2357c9;box-shadow:0 0 0 1px #2357c9}' +
    '#auth-form button{display:block;width:100%;height:48px;margin-top:20px;border:none;border-radius:99px;background:#2357c9;color:#fff;font:inherit;font-weight:500;font-size:1em;cursor:pointer;transition:box-shadow .15s}' +
    '#auth-form button:hover{box-shadow:inset 0 0 0 100vmax rgba(255,255,255,.1)}' +
    '#auth-form button:active{box-shadow:inset 0 0 0 100vmax rgba(255,255,255,.16)}' +
    '#auth-error{color:#ba1a1a;font-size:.85em;margin-top:12px;min-height:1.2em}';

  document.documentElement.appendChild(style);
  document.documentElement.appendChild(overlay);

  document.getElementById('auth-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var id = document.getElementById('auth-id').value.trim();
    var pass = document.getElementById('auth-pass').value;
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(id + ':' + pass)).then(function(buf) {
      var hex = Array.prototype.map.call(new Uint8Array(buf), function(b) {
        return ('0' + b.toString(16)).slice(-2);
      }).join('');
      if (hex === VALID_HASH) {
        sessionStorage.setItem(KEY, 'ok');
        // ログイン画面を下へスライドさせて消す（動きを減らす設定ならすぐ消す）
        var done = function() { overlay.remove(); style.remove(); };
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return done();
        document.activeElement && document.activeElement.blur();
        overlay.style.pointerEvents = 'none';
        overlay.style.transition = 'transform .45s cubic-bezier(.3,0,.8,.15)';
        overlay.style.transform = 'translateY(100%)';
        overlay.addEventListener('transitionend', done);
        setTimeout(done, 700); // transitionend が来なかったとき用
      } else {
        document.getElementById('auth-error').textContent = 'IDまたはパスワードが違います';
        document.getElementById('auth-pass').value = '';
        document.getElementById('auth-pass').focus();
      }
    });
  });
})();
