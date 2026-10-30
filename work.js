const MODE_NAMES = { basic: '基本の面接', deep: '深掘りありの面接', single: '1つの質問だけ練習', real: '本番を想定した面接' };

const WORKS = {
  work1: {
    heading: 'ワーク①　日常編',
    lead: 'テーマ①は全員で取り組みます。テーマ②は、リラックスかお出かけを選びましょう。早く終わったら、もう一方も試せます。',
    tabs: [
      { label: '🛒 テーマ① 気になる製品（全員）', blocks: [{
        title: '気になる製品のホームページを、やさしく解説してもらう',
        why: '興味のある製品やサービスの、公式ホームページのURLを使います（家電・文房具・アプリなど何でもOK）。ログインが必要なページや、個人情報が表示されるページは使いません。',
        steps: [
          '公式ホームページを開く',
          'ページ上部のURLをコピー',
          '例文の「（ここに…）」にURLを貼る',
          '「この例文をコピー」を押して、AIに貼って送信',
          '読めないと言われたら、ページの文章を貼る'
        ],
        text: 'あなたは、機械が苦手な人にも伝えるのが上手な説明役です。\n下のページの内容を、3つのポイントで、やさしい言葉で説明してください。\nわからない言葉があれば、かんたんに言いかえてください。\n書いていないことは「書かれていません」と答えてください。\n\n【ページのURL】\n（ここに、URLを貼ります）',
        checks: ['ポイントは3つになっていますか', 'むずかしい言葉は、やさしくなっていますか', 'ページにないことを、勝手に足していませんか（公式ページで確かめましょう）']
      }] },
      { label: '🌙 テーマ② リラックス（選ぶ）', blocks: [{
        title: 'リラックス方法を考えてもらう（練習用）',
        why: '練習用の例文です。実際の悩みは入力しなくて大丈夫です。気が進まないときは「お出かけ」を選んでください。',
        text: 'あなたは、やさしく話を聞いてくれる相談役です。最近、夜になかなか寝つけません。\n寝る前に5分でできる、かんたんなリラックス方法を3つ教えてください。\nむずかしい言葉は使わないでください。',
        checks: ['言葉づかいは、読みやすいですか', 'やってみたいと思えますか', '「もっと短く」と頼むと、どう変わりますか']
      }] },
      { label: '🚶 テーマ② お出かけ（選ぶ）', blocks: [{
        title: 'お出かけプランを考えてもらう',
        why: 'リラックス方法の代わりに選べます。',
        text: 'あなたは、やさしく案内してくれるプランナーです。\n休みの日に、1日でできる近場のお出かけプランを3つ考えてください。\nむずかしい言葉は使わないでください。',
        checks: ['言葉づかいは、読みやすいですか', 'やってみたいと思えますか', '「もっと短く」と頼むと、どう変わりますか']
      }] }
    ]
  },
  work2: {
    heading: 'ワーク②　就活編',
    lead: 'ご自身の就職活動で使える「お土産」を作ります。テーマ①→②の順に、全員で進めます。',
    tabs: [
      { label: '🏢 テーマ① 会社の整理', blocks: [{
        title: '会社のホームページを整理してもらう',
        why: '会社案内などの文章をコピーして、下の（　）の部分に貼りかえます。公式サイトに載っている会社名だけ入れ、応募の予定や選考の状況は書きません。',
        text: 'あなたは、キャリアアドバイザーです。\n下の文章は、【会社名】の公式サイトの情報です。\n書いてあることだけをもとに、この会社の「強み」と「今後期待される事業」を、3つずつ箇条書きで教えてください。\n書いていないことは「書かれていません」と答えてください。\n\n【公式サイトの文章】\n（ここに、公式サイトの文章を貼ります）',
        checks: ['貼った文章に書いてあることですか', '想像で答えていませんか', '公式サイトで、自分の目でも確かめましたか']
      }] },
      { label: '🎤 テーマ② 面接練習', interview: true }
    ]
  }
};

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

// コピーボタン（成功・失敗の表示つき）を作る
function makeCopy(getText, label) {
  const wrap = el('div');
  const btn = el('button', 'primary', label);
  btn.type = 'button';
  const st = el('p', 'status');
  st.setAttribute('role', 'status'); st.setAttribute('aria-live', 'polite');
  btn.addEventListener('click', async () => {
    const ok = await copyText(getText());
    btn.textContent = ok ? '✓ コピーしました！' : 'コピーできませんでした';
    btn.classList.toggle('copied', ok);
    const left = /（ここに/.test(getText());
    st.textContent = ok
      ? (left ? '「（ここに…）」の部分が残っています。書きかえてから送信してください。' : '次は、AIの入力欄に貼り付けて送信してください。')
      : '表示されている文章を選んで、手動でコピーしてください。';
    st.className = ok ? 'status success' : 'status';
    setTimeout(() => { btn.textContent = label; btn.classList.remove('copied'); }, 4000);
  });
  wrap.append(btn, st);
  return wrap;
}

function renderBlock(b) {
  const sec = el('section', 'example-grid');
  const left = el('div');
  const ta = el('textarea', 'text');
  ta.value = b.text;
  ta.rows = Math.min(10, b.text.split('\n').length + 1);
  ta.setAttribute('aria-label', b.title + 'の例文（書きかえできます）');
  const reset = el('button', 'ghost', '元の例文に戻す');
  reset.type = 'button';
  reset.addEventListener('click', () => { ta.value = b.text; });
  const actions = el('div', 'actions');
  actions.append(makeCopy(() => ta.value, 'この例文をコピー'), reset);
  left.append(el('h3', '', b.title), el('p', 'edit-note', '例文は書きかえできます。「（　）」の部分は、自分の内容に入れかえてください。'), ta, actions);
  const right = el('div');
  right.append(el('p', 'why', b.why));
  if (b.steps) {
    right.append(el('p', 'check-cap', 'やり方'));
    const ol = el('ol', 'checks');
    b.steps.forEach(c => ol.appendChild(el('li', '', c)));
    right.appendChild(ol);
  }
  if (b.checks.length) {
    right.append(el('p', 'check-cap', '確かめるポイント'));
    const ul = el('ul', 'checks');
    b.checks.forEach(c => ul.appendChild(el('li', '', c)));
    right.appendChild(ul);
  }
  sec.append(left, right);
  return sec;
}

function renderInterview() {
  const root = el('section', 'interview-wrap');

  // 左：種類の選択
  const left = el('div');
  left.append(el('h3', '', 'AIと面接の練習をする'), el('p', 'why', '練習のしかたを選びます。迷ったら「基本の面接」でOKです。練習は10分で区切ります。質問が全部終わらなくても、時間になったら終わりでOKです。'));
  const fs = el('fieldset', 'choices');
  const lg = el('legend', '', '練習のしかた'); lg.style.cssText = 'position:absolute;left:-9999px';
  fs.appendChild(lg);
  const INFO = {
    basic: ['基本の質問を5問。最後に振り返りがあります。', 'おすすめ'],
    deep: ['お答えに合わせて、追加の質問があります。', '動作確認中'],
    single: ['練習したい質問を1つ選んで、じっくり練習します。', '動作確認中'],
    real: ['途中の助言なしで、最後に質問の時間もあります。', '動作確認中']
  };
  Object.keys(MODE_NAMES).forEach((k, i) => {
    const d = el('div', 'choice');
    const inp = el('input'); inp.type = 'radio'; inp.name = 'mode'; inp.id = 'm-' + k; inp.value = k; inp.checked = i === 0;
    const lab = el('label'); lab.htmlFor = inp.id;
    const b = el('b', '', MODE_NAMES[k]);
    b.appendChild(el('span', k === 'basic' ? 'tag default' : 'tag', INFO[k][1]));
    lab.append(b, el('small', '', INFO[k][0]));
    d.append(inp, lab); fs.appendChild(d);
  });
  left.appendChild(fs);

  // 右：QRとコピー（両方表示）
  const right = el('div', 'interview-side');
  const qrBox = el('div', 'qr-card');
  const img = el('img'); img.id = 'qr'; img.width = 220; img.height = 220;
  const qname = el('p', '', '');
  qname.style.fontWeight = '700';
  qrBox.append(img, qname);
  // 10分タイマー（時間で区切る）
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
  const how = el('p', 'how', 'スマホ：QRコードを読み取って練習 ／ PC：下のボタンでコピーして、AIに貼り付けて練習');
  const copyArea = el('div');
  right.append(qrBox, how, copyArea, tm);

  const det = el('details');
  det.append(el('summary', '', '練習用の指示を確認する'));
  const pre = el('pre'); det.appendChild(pre);
  left.appendChild(det);

  function update() {
    const k = fs.querySelector('input:checked').value;
    img.src = 'qr-' + k + '.svg';
    img.alt = MODE_NAMES[k] + 'のQRコード';
    qname.textContent = '選択中：' + MODE_NAMES[k];
    const p = window.INTERVIEW_PROMPTS[k];
    pre.textContent = p.text;
    copyArea.replaceChildren(makeCopy(() => window.INTERVIEW_PROMPTS[k].text, '練習用の指示をコピー（PC）'));
  }
  fs.addEventListener('change', update);
  update();

  root.append(left, right);
  return root;
}

(function () {
  const key = document.body.dataset.work;
  const data = WORKS[key];
  if (!data) return;
  document.getElementById('heading').textContent = data.heading;
  document.getElementById('lead').textContent = data.lead;
  const tabs = document.getElementById('tabs');
  const panel = document.getElementById('panel');
  const btns = [];

  function select(i) {
    btns.forEach((b, j) => { b.setAttribute('aria-selected', j === i ? 'true' : 'false'); b.tabIndex = j === i ? 0 : -1; });
    panel.replaceChildren();
    const t = data.tabs[i];
    if (t.interview) panel.appendChild(renderInterview());
    else t.blocks.forEach(b => panel.appendChild(renderBlock(b)));
    panel.setAttribute('aria-labelledby', 'tab-' + i);
  }

  data.tabs.forEach((t, i) => {
    const b = el('button', 'tab', t.label);
    b.type = 'button'; b.id = 'tab-' + i; b.setAttribute('role', 'tab');
    b.addEventListener('click', () => select(i));
    b.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const n = (i + (e.key === 'ArrowRight' ? 1 : data.tabs.length - 1)) % data.tabs.length;
        select(n); btns[n].focus();
      }
    });
    btns.push(b); tabs.appendChild(b);
  });
  select(0);
})();
