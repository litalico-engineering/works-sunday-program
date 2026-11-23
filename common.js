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

// 要素を作る小さな関数
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

// コピーのあとに開くAIの一覧（別タブで開く）
const AI_LINKS = [
  { name: 'ChatGPT', url: 'https://chatgpt.com/' },
  { name: 'Gemini', url: 'https://gemini.google.com/' }
];

// 「ChatGPTを開く」「Geminiを開く」ボタンと、タブ移動の案内を作る
function aiOpenLinks() {
  const box = el('div', 'ai-open');
  const row = el('div', 'ai-open-row');
  AI_LINKS.forEach(a => {
    const link = el('a', 'ai-link', a.name + 'を開く');
    link.href = a.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    row.appendChild(link);
  });
  box.append(
    row,
    el('p', 'ai-open-note', '新しいタブで開きます。貼り付けて送信したら、このページに戻らなくても大丈夫です。'),
    logoutNote()
  );
  return box;
}

// 共用のパソコンを使うときの注意（会話の履歴は残るので、終わったらログアウトする）
function logoutNote() {
  return el('p', 'ai-open-note logout-note', '共用のパソコンでは、終わったら必ずAIからログアウトし、パソコンをシャットダウンしてください（学習オフにしても、会話の履歴は残ります）。');
}

// 面接の種類の選択肢を fieldset に作る。
// 「基本の面接」だけ前に出し、そのほかは「もっと練習したい方へ」にしまう
function buildModeChoices(fs, selected) {
  const modes = window.INTERVIEW_MODES;
  const legend = el('legend', 'sr-only', '練習のしかた');
  fs.replaceChildren(legend);
  const make = m => {
    const d = el('div', 'choice');
    const inp = el('input');
    inp.type = 'radio'; inp.name = 'mode'; inp.id = 'm-' + m.key; inp.value = m.key;
    inp.checked = m.key === selected;
    const lab = el('label'); lab.htmlFor = inp.id;
    const b = el('b', '', m.name);
    b.appendChild(el('span', m.primary ? 'tag default' : 'tag', m.tag));
    lab.append(b, el('small', '', m.desc));
    d.append(inp, lab);
    return d;
  };
  modes.filter(m => m.primary).forEach(m => fs.appendChild(make(m)));
  const others = modes.filter(m => !m.primary);
  if (others.length) {
    const det = el('details', 'more-modes');
    det.append(el('summary', '', 'もっと練習したい方へ'));
    const inner = el('div', 'more-modes-list');
    others.forEach(m => inner.appendChild(make(m)));
    det.appendChild(inner);
    det.open = others.some(m => m.key === selected);
    fs.appendChild(det);
  }
}

// URLの ?mode= が用意した種類と一致するときだけ、その種類を返す
function modeFromQuery() {
  const q = new URLSearchParams(location.search).get('mode');
  const hit = window.INTERVIEW_MODES.find(m => m.key === q);
  return hit ? hit.key : window.INTERVIEW_MODES[0].key;
}

// 面接練習の場所の案内。withEarphone を true にすると、イヤホンの案内も付く（スマホ用ページ）
function buildEnvNote(withEarphone) {
  const box = el('div', 'env-note');
  box.append(el('p', '', '📍 施設で練習するとき：他の利用者に配慮しつつ、スタッフの見える範囲で、部屋の隅に移動して練習してOKです。'));
  if (withEarphone) {
    box.append(el('p', '', '🎧 声で練習するとき：イヤホンがあると、やりやすくなります（なくても大丈夫です。文字でも練習できます）。'));
  }
  return box;
}

// 練習のお約束（4点）。面接練習のタブの先頭に常に表示する
function buildSafetyPanel() {
  const box = el('section', 'safety');
  box.setAttribute('aria-label', '練習のお約束');
  box.appendChild(el('h4', '', '練習を、安心して続けるためのお約束'));
  const ol = el('ol');
  [
    ['名前・住所・連絡先は、言いません。', '声でも、文字でも同じです。本名や会社名は仮名でかまいません。'],
    ['実在の人や会社の悪口は、言いません。', ''],
    ['つらくなったら、やめてOKです。', '答えたくない質問はパスでき、いつでも「待って」「終了」と伝えられます。'],
    ['AIの評価は、参考のひとつです。', '気になることは、支援員に相談してください。']
  ].forEach(([b, rest]) => {
    const li = el('li');
    li.append(el('b', '', b));
    if (rest) li.append(document.createTextNode(rest));
    ol.appendChild(li);
  });
  box.appendChild(ol);
  return box;
}
