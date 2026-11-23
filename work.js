// ワーク①②のタブ画面。
// 直リンク：work1.html#product / #relax / #outing、work2.html#company / #interview
// 必要なもの: prompt.js / common.js / interview.js

const WORKS = {
  work1: {
    heading: 'ワーク①　日常編',
    lead: 'テーマ①は全員で取り組みます。テーマ②は、リラックスかお出かけを選びましょう。早く終わったら、もう一方も試せます。',
    next: { href: 'work2.html', label: '次は ワーク②（就活編）へ →' },
    tabs: [
      { key: 'product', label: '🛒 テーマ① 気になる製品（全員）', blocks: [{
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
      { key: 'relax', label: '🌙 テーマ② リラックス（選ぶ）', blocks: [{
        title: 'リラックス方法を考えてもらう（練習用）',
        why: '練習用の例文です。実際の悩みは入力しなくて大丈夫です。気が進まないときは「お出かけ」を選んでください。',
        text: 'あなたは、やさしく話を聞いてくれる相談役です。\n家で5分でできる、かんたんな気分転換やリラックス方法を3つ教えてください。\nむずかしい言葉は使わないでください。',
        checks: ['言葉づかいは、読みやすいですか', 'やってみたいと思えますか', '「もっと短く」と頼むと、どう変わりますか']
      }] },
      { key: 'outing', label: '🚶 テーマ② お出かけ（選ぶ）', blocks: [{
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
      { key: 'company', label: '🏢 テーマ① 会社の整理', blocks: [{
        title: '会社のホームページを整理してもらう',
        why: '会社案内などの文章をコピーして、下の（　）の部分に貼りかえます。公式サイトに載っている会社名だけ入れ、応募の予定や選考の状況は書きません。',
        text: 'あなたは、キャリアアドバイザーです。\n下の文章は、【会社名】の公式サイトの情報です。\n書いてあることだけをもとに、この会社の「強み」と「今後期待される事業」を、3つずつ箇条書きで教えてください。\n書いていないことは「書かれていません」と答えてください。\n\n【公式サイトの文章】\n（ここに、公式サイトの文章を貼ります）',
        checks: ['貼った文章に書いてあることですか', '想像で答えていませんか', '公式サイトで、自分の目でも確かめましたか']
      }] },
      { key: 'interview', label: '🎤 テーマ② 面接練習', interview: true }
    ]
  }
};

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
    // 確かめるポイントは、スライドでも説明するので折りたたんでおく
    const det = el('details', 'check-fold');
    det.append(el('summary', '', '確かめるポイント'));
    const ul = el('ul', 'checks');
    b.checks.forEach(c => ul.appendChild(el('li', '', c)));
    det.appendChild(ul);
    right.appendChild(det);
  }
  sec.append(left, right);
  return sec;
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

  function select(i, fromHash) {
    btns.forEach((b, j) => { b.setAttribute('aria-selected', j === i ? 'true' : 'false'); b.tabIndex = j === i ? 0 : -1; });
    panel.replaceChildren();
    const t = data.tabs[i];
    if (t.interview) panel.appendChild(renderInterview());
    else t.blocks.forEach(b => panel.appendChild(renderBlock(b)));
    panel.setAttribute('aria-labelledby', 'tab-' + i);
    if (!fromHash && history.replaceState) history.replaceState(null, '', '#' + t.key);
  }

  // URLの # に合うタブの番号（なければ 0）
  function indexFromHash() {
    const h = location.hash.replace('#', '');
    const i = data.tabs.findIndex(t => t.key === h);
    return i < 0 ? 0 : i;
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

  if (data.next) {
    const a = el('a', 'next-work', data.next.label);
    a.href = data.next.href;
    panel.after(a);
  }

  window.addEventListener('hashchange', () => select(indexFromHash(), true));
  select(indexFromHash(), true);
})();
