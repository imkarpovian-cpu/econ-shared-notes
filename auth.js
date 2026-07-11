(function() {
  var VALID_ID = 'ku';
  var VALID_PASS = 'econ';
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
    '#auth-overlay{position:fixed;inset:0;z-index:99999;background:#f8fafc;display:flex;align-items:center;justify-content:center;font-family:"Hiragino Kaku Gothic ProN","Yu Gothic UI","Meiryo",sans-serif}' +
    '.auth-box{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:40px 36px;width:100%;max-width:380px;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,.06)}' +
    '.auth-box h2{margin:0 0 6px;font-size:1.3em;color:#1f2937}' +
    '.auth-box p{margin:0 0 24px;font-size:.88em;color:#6b7280}' +
    '#auth-form input{display:block;width:100%;padding:12px 14px;margin:0 0 12px;border:1px solid #e5e7eb;border-radius:10px;font:inherit;font-size:.95em;background:#f8fafc;outline:none;transition:border-color .15s}' +
    '#auth-form input:focus{border-color:#2563eb;background:#fff}' +
    '#auth-form button{display:block;width:100%;padding:13px;border:none;border-radius:10px;background:#2563eb;color:#fff;font:inherit;font-weight:700;font-size:1em;cursor:pointer;transition:background .15s}' +
    '#auth-form button:hover{background:#1e40af}' +
    '#auth-error{color:#ef4444;font-size:.85em;margin-top:10px;min-height:1.2em}';

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
