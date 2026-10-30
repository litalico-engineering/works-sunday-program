// クリップボードにコピーする共通関数。成功したら true を返す
async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (_) { /* 下の互換方式に進む */ }
  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px;';
  document.body.appendChild(field);
  field.focus(); field.select(); field.setSelectionRange(0, field.value.length);
  let ok = false;
  try { ok = document.execCommand('copy'); } catch (_) {}
  field.remove();
  return ok;
}
