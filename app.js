// スマホ用ページ（mobile.html）。QRから開くと ?mode=basic などで種類を選んだ状態になる
const copyBtn = document.getElementById('copy');
const status = document.getElementById('copy-status');
const manualBox = document.getElementById('manual');
const aiArea = document.getElementById('ai-open-area');
const DEFAULT_LABEL = '練習用の指示をコピー';

// 種類の選択肢は prompt.js の定義から作る（値は用意した種類だけ）
const modeFs = document.getElementById('choices');
buildModeChoices(modeFs, modeFromQuery());

function current() {
  const key = modeFs.querySelector('input:checked').value;
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
  aiArea.replaceChildren();
}

modeFs.addEventListener('change', refresh);

copyBtn.addEventListener('click', async () => {
  const p = current();
  const ok = await copyText(p.text);
  aiArea.replaceChildren();
  if (ok) {
    copyBtn.textContent = '✓ コピーしました（' + p.label + '）';
    copyBtn.classList.add('copied');
    status.textContent = '次は、AIを開いて貼り付けてください。';
    status.className = 'status success';
    manualBox.hidden = true;
    aiArea.appendChild(aiOpenLinks());
  } else {
    status.textContent = '自動コピーが使えません。下の文章からコピーしてください。';
    status.className = 'status';
    manualBox.hidden = false;
  }
});

refresh();
