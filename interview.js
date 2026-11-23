// 面接練習の画面部品。ワーク②の「面接練習」タブで使う。
// 必要なもの: prompt.js / common.js

// コピーボタン（成功・失敗の表示つき）。成功後は、AIを開くボタンを出す
function makeCopy(getText, label) {
  const wrap = el('div');
  const btn = el('button', 'primary', label);
  btn.type = 'button';
  const st = el('p', 'status');
  st.setAttribute('role', 'status'); st.setAttribute('aria-live', 'polite');
  const after = el('div');
  btn.addEventListener('click', async () => {
    const ok = await copyText(getText());
    btn.textContent = ok ? '✓ コピーしました！' : 'コピーできませんでした';
    btn.classList.toggle('copied', ok);
    const left = /（ここに/.test(getText());
    after.replaceChildren();
    if (!ok) {
      st.textContent = '表示されている文章を選んで、手動でコピーしてください。';
      st.className = 'status';
    } else if (left) {
      st.textContent = '「（ここに…）」の部分が残っています。書きかえてから、もう一度コピーしてください。';
      st.className = 'status';
    } else {
      st.textContent = '次は、AIを開いて入力欄に貼り付け、送信してください。';
      st.className = 'status success';
      after.appendChild(aiOpenLinks());
    }
    setTimeout(() => { btn.textContent = label; btn.classList.remove('copied'); }, 4000);
  });
  wrap.append(btn, st, after);
  return wrap;
}

// 10分タイマー
function makeTimer() {
  const tm = el('div', 'timer');
  const tmLabel = el('span', 'timer-label', '⏱ 面接練習タイマー');
  const tmTime = el('span', 'timer-time', '10:00');
  tmTime.setAttribute('aria-hidden', 'true');
  const tmBtn = el('button', 'ghost', 'スタート');
  tmBtn.type = 'button';
  const tmMsg = el('span', 'timer-msg', '');
  tmMsg.setAttribute('role', 'status'); tmMsg.setAttribute('aria-live', 'polite');
  let remain = 600, handle = null;
  const draw = () => { tmTime.textContent = String(Math.floor(remain / 60)).padStart(2, '0') + ':' + String(remain % 60).padStart(2, '0'); };
  tmBtn.addEventListener('click', () => {
    if (handle) { clearInterval(handle); handle = null; remain = 600; draw(); tmMsg.textContent = ''; tm.classList.remove('done'); tmBtn.textContent = 'スタート'; return; }
    tmBtn.textContent = 'リセット'; tmMsg.textContent = '';
    handle = setInterval(() => {
      remain -= 1; draw();
      if (remain <= 0) { clearInterval(handle); handle = null; tm.classList.add('done'); tmMsg.textContent = '時間です。途中でも終わりでOKです。'; tmBtn.textContent = 'もう一度'; remain = 600; }
    }, 1000);
  });
  tm.append(tmLabel, tmTime, tmBtn, tmMsg);
  return tm;
}

function renderInterview() {
  const root = el('section', 'interview-wrap');

  // 左：種類の選択
  const left = el('div');
  left.append(
    el('h3', '', 'AIと面接の練習をする'),
    buildSafetyPanel(),
    el('p', 'why', '練習のしかたを選びます。迷ったら「基本の面接」でOKです。練習は10分で区切ります。質問が全部終わらなくても、時間になったら終わりでOKです。')
  );
  const fs = el('fieldset', 'choices');
  buildModeChoices(fs, window.INTERVIEW_MODES[0].key);
  left.appendChild(fs);
  left.appendChild(buildEnvNote());
  const det = el('details');
  det.append(el('summary', '', '練習用の指示を確認する'));
  const pre = el('pre'); det.appendChild(pre);
  left.appendChild(det);

  // 右：基本は「PCで文字で練習」。声で練習したい方は、スマホで声でも練習できる
  const right = el('div', 'interview-side');
  const copyArea = el('div');
  const steps = el('ol', 'pc-steps');
  ['左で練習のしかたを選ぶ', '「練習用の指示をコピー」を押す', 'AIの新しい会話に貼り付けて送信する', '質問に、文字で答える（10分で区切ります）']
    .forEach(t => steps.appendChild(el('li', '', t)));
  const pcPane = el('div', 'pc-pane');
  const logout = el('div', 'warn', '共用のパソコンでは、終わったら必ずAIからログアウトし、パソコンをシャットダウンしてください（履歴が残るためです）。');
  pcPane.append(el('p', 'check-cap', '💻 PCで文字で練習（基本）'), steps, copyArea, logout);

  // 声で練習したい方へ（スマホ・イヤホン）
  const voice = el('details', 'voice-fold');
  voice.append(el('summary', '', '🎤 声で練習したい方へ（スマホ・イヤホン）'));
  const qrBox = el('div', 'qr-card');
  const img = el('img'); img.width = 220; img.height = 220;
  const qname = el('p', '');
  qname.style.fontWeight = '700';
  qrBox.append(img, qname);
  voice.append(
    el('p', 'how', 'スマホでQRコードを読み取ると、練習用の指示をコピーできます。AIの音声会話に貼り付けて、声に出して練習できます。講座中でも、講座のあと自宅でも使えます。'),    qrBox,
    el('p', 'how', '🎧 声で練習するときは、イヤホンがあるとやりやすくなります（なくても大丈夫です。文字でも練習できます）。')
  );
  right.append(pcPane, voice, makeTimer());

  function update() {
    const k = fs.querySelector('input:checked').value;
    const name = window.INTERVIEW_PROMPTS[k].label;
    img.src = 'qr-' + k + '.svg';
    img.alt = name + 'のQRコード';
    qname.textContent = '選択中：' + name;
    pre.textContent = window.INTERVIEW_PROMPTS[k].text;
    copyArea.replaceChildren(makeCopy(() => window.INTERVIEW_PROMPTS[k].text, '練習用の指示をコピー'));
  }
  fs.addEventListener('change', update);
  update();

  root.append(left, right);
  return root;
}
