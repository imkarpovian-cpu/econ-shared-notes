(function() {
  var VALID_ID = '[redacted]';
  var VALID_PASS = '[redacted]';
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
    if (id === VALID_ID && pass === VALID_PASS) {
      sessionStorage.setItem(KEY, 'ok');
      overlay.remove();
      style.remove();
    } else {
      document.getElementById('auth-error').textContent = 'IDまたはパスワードが違います';
      document.getElementById('auth-pass').value = '';
      document.getElementById('auth-pass').focus();
    }
  });
})();
