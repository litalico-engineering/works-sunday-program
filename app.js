const copyBtn = document.getElementById('copy');
const status = document.getElementById('copy-status');
const manualBox = document.getElementById('manual');
const DEFAULT_LABEL = '練習用の指示をコピー';

function current() {
  const key = document.querySelector('input[name="mode"]:checked').value;
  return window.INTERVIEW_PROMPTS[key];
}

function refresh() {
  const p = current();
  document.getElementById('prompt-preview').textContent = p.text;
  document.getElementById('manual-text').value = p.text;
  document.getElementById('ver').textContent = p.label + ' ' + p.version;
  copyBtn.textContent = DEFAULT_LABEL;
  copyBtn.classList.remove('copied');
  status.textContent = 'このページに回答を入力する必要はありません。';
  status.className = 'status';
  manualBox.hidden = true;
}

document.querySelectorAll('input[name="mode"]').forEach(r => r.addEventListener('change', refresh));

copyBtn.addEventListener('click', async () => {
  const p = current();
  const ok = await copyText(p.text);
  if (ok) {
    copyBtn.textContent = '✓ コピーしました（' + p.label + '）';
    copyBtn.classList.add('copied');
    status.textContent = '次は、普段使うAIを開いて貼り付けてください。';
    status.className = 'status success';
    manualBox.hidden = true;
  } else {
    status.textContent = '自動コピーが使えません。下の文章からコピーしてください。';
    status.className = 'status';
    manualBox.hidden = false;
  }
});

// PC画面のQRから開いたとき、選んだ種類を最初から選んでおく
const initial = new URLSearchParams(location.search).get('mode');
// 値をセレクターに埋め込まず、用意した選択肢と一致するものだけを選ぶ
const initialRadio = Array.from(document.querySelectorAll('input[name="mode"]')).find(r => r.value === initial);
if (initialRadio) initialRadio.checked = true;

refresh();
