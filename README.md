# 3Peace 公式サイト（コーポレート兼採用サイト）

広島市西区を拠点とするエアコン工事会社「3Peace」の公式サイトです。
工事のご依頼獲得と、エアコン工事スタッフの採用応募獲得の2つを目的としています。

- 対策キーワード：`広島 エアコン工事`
- 技術構成：Next.js 16（App Router）/ React 19 / TypeScript / Tailwind CSS v4 / Zod
- ホスティング：Vercel を想定

---

## 🚨 いま設定が必要なもの

本番ドメイン **`https://www.3peace-hiroshima.com`** を Vercel に接続済みですが、
`NEXT_PUBLIC_SITE_URL` が未設定のため、canonical・OG・サイトマップのURLが
`3peace-corporate-site.vercel.app` のままになっています。
この状態では、独自ドメインではなく vercel.app のURLが検索エンジンに評価されます。

**Vercel の Settings → Environment Variables で次を追加し、再デプロイしてください。**

```env
NEXT_PUBLIC_SITE_URL=https://www.3peace-hiroshima.com
```

- Environment は **Production / Preview / Development すべて** にチェックを入れてください
- **必ず `www` 付きで設定してください。** このサイトは apex（wwwなし）から www へ
  リダイレクトされるため、www なしを設定するとリダイレクトが循環します
- 環境変数はビルド時に読み込まれるため、**追加後に再デプロイが必要**です

設定後、次を確認してください。

```bash
curl -s https://www.3peace-hiroshima.com/robots.txt          # Host / Sitemap が独自ドメインか
curl -s https://www.3peace-hiroshima.com/ | grep canonical    # canonical が独自ドメインか
curl -I https://3peace-corporate-site.vercel.app/             # 308 で独自ドメインへ転送されるか
```

### ブログの自動投稿を動かすには

GitHub リポジトリの Secrets に `ANTHROPIC_API_KEY` を1件登録するだけです。
詳しくは「[ブログの自動投稿](#ブログの自動投稿claude-api--github-actions)」を参照してください。
未登録のあいだは毎日のワークフローが失敗するだけで、サイトの表示には影響しません。

---

## サイトURLの解決方法（SEOの土台）

canonical・OG・sitemap・robots・JSON-LD・RSS のURLは、すべて次の順で解決した
「サイトURL」から生成しています。URLをコードに直接書いている箇所はありません。

| 優先 | 参照する値 | 使う場面 |
| --- | --- | --- |
| 1 | `NEXT_PUBLIC_SITE_URL` | 独自ドメインを使う場合。設定すればこれが最優先されます |
| 2 | `VERCEL_PROJECT_PRODUCTION_URL`（Vercelが自動で渡す） | 未設定時の保険。`*.vercel.app` になることがあります |
| 3 | 解決できない | canonical / sitemap を出力せず、robots.txt は全ページ Disallow |

3 になるのはプレビュー環境（`VERCEL_ENV=preview`）とローカルです。
プレビューURLが検索結果に出ることを防いでいます。

**独自ドメインへ移行・変更するときは、`NEXT_PUBLIC_SITE_URL` を変更するだけで
canonical・sitemap・robots・OG・JSON-LD・RSS のURLがすべて切り替わります。**

### 重複コンテンツの防止

`NEXT_PUBLIC_SITE_URL` に独自ドメインを設定すると、本番デプロイでは
`*.vercel.app` へのアクセスが正規ドメインへ 308 リダイレクトされます
（`next.config.ts` の `redirects()`）。同じ内容が2つのURLで見られる状態を防ぐためです。

プレビューデプロイは閲覧できる必要があるため、リダイレクトの対象外です。

---

## Google Search Console の設定手順

公開後、次の順で進めてください。

1. **プロパティを登録する**
   [Search Console](https://search.google.com/search-console) を開き、「URLプレフィックス」に
   本番URLを入力します。独自ドメインを使う場合は「ドメイン」プロパティのほうが、
   www有無やhttp/httpsをまとめて扱えるため扱いやすくなります。
2. **所有権を確認する**
   HTMLタグによる確認を選び、表示された `content` の値を環境変数
   `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` に設定して再デプロイします。
   （`<meta name="google-site-verification">` が自動で出力されます）
3. **サイトマップを送信する**
   「サイトマップ」から `sitemap.xml` を送信します。
   送信後、ステータスが「成功しました」になり、検出されたURL数が表示されることを確認します。
4. **主要ページをURL検査する**
   トップ、`/service`、各工事ページ、`/area/hiroshima-nishi`、`/column` を
   URL検査ツールで確認します。「URLはGoogleに登録されていません」と出た場合は
   「インデックス登録をリクエスト」を実行します。
5. **canonical を確認する**
   URL検査の「ユーザーが指定した正規URL」と「Googleが選択した正規URL」が
   一致しているかを見ます。ずれている場合は内容の重複が疑われます。
6. **ページのインデックス登録状況を確認する**
   数日後に「ページ」レポートを開き、登録済みのページ数と、除外された理由を確認します。
   意図せず「noindex タグによって除外されました」に入っていないかを見てください。
   施工事例（`/works`）とお知らせ（`/news`）は、データが0件のあいだ意図的に noindex です。
7. **Core Web Vitals を確認する**
   「ウェブに関する主な指標」で LCP・CLS・INP を確認します。
   データが集まるまで数週間かかります。

あわせて、専門コラムのRSS（`/feed.xml`）も公開しています。

---

## セットアップ

```bash
npm install
cp .env.example .env.local   # 値を入力する
npm run dev                  # http://localhost:3000
```

### コマンド

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm run start` | ビルド結果をローカルで起動 |
| `npm run lint` | ESLint |
| `npm run typecheck` | 型チェック（`tsc --noEmit`） |
| `npm run blog:generate` | ブログ記事を1本生成して `content/blog/` に保存（要 `ANTHROPIC_API_KEY`） |

### Vercel へのデプロイ

1. GitHub リポジトリを Vercel にインポートする（Framework は Next.js が自動検出されます）
2. Project Settings → Environment Variables に下記の環境変数を登録する
   （`NEXT_PUBLIC_SITE_URL` は Production / Preview / Development すべてに設定してください）
3. 本番ドメインを Vercel に追加し、DNS を設定する
4. デプロイ後、`https://ドメイン/robots.txt` が `Allow: /` になっていることを確認する
5. Google Search Console でサイトマップ `https://ドメイン/sitemap.xml` を送信する

### 環境変数一覧

| 変数名 | 必須 | 内容 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | ✅ | 本番URL（末尾スラッシュなし）。例：`https://example.jp` |
| `RESEND_API_KEY` | フォーム利用時 | [Resend](https://resend.com/) の API キー |
| `CONTACT_TO_EMAIL` | フォーム利用時 | 問い合わせ・応募の受信先メールアドレス |
| `CONTACT_FROM_EMAIL` | フォーム利用時 | 送信元メールアドレス（Resend で認証済みのドメイン） |
| `NEXT_PUBLIC_GA_ID` | 任意 | Google Analytics 4 の測定ID（`G-XXXXXXX`） |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | 任意 | Search Console の所有権確認コード |
| `ANTHROPIC_API_KEY` | ブログ自動投稿時 | Claude API のキー。**Vercel ではなく GitHub Secrets に登録します** |
| `ANTHROPIC_MODEL` | 任意 | 生成に使うモデル。未設定なら `claude-haiku-4-5-20251001` |

メール関連の3つが未設定でもビルドは成功します。その場合フォームは送信停止状態になり、
画面には電話・Instagram からの問い合わせ案内のみが表示されます。

> ⚠️ **環境変数を追加・変更したら、必ず再デプロイしてください。**
> お問い合わせページと採用ページは静的生成されるため、フォームを表示するかどうかは
> **ビルド時**の環境変数で決まります。Vercel の管理画面で後から環境変数を追加しても、
> 再デプロイするまでフォームは表示されません。

---

## 情報の編集場所

すべての事実情報は `src/data/` に集約しています。**コンポーネントに直接書かないでください。**

| ファイル | 内容 |
| --- | --- |
| `src/data/site.ts` | 会社名・代表者名・住所・電話番号・Instagram・営業時間・定休日・Googleマップ・問い合わせ受付状態 |
| `src/data/areas.ts` | 地域ページ（公開する地域と、その地域固有の本文） |
| `src/data/services.ts` | 業務案内（対応工事）と料金についての表記 |
| `src/data/columns/` | エアコン工事専門コラム（1記事1ファイル＋`index.ts`） |
| `src/data/works.ts` | 施工事例 |
| `src/data/about.ts` | 「3Peaceについて」本文・代表挨拶 |
| `src/data/recruit.ts` | 採用ページ本文・応募受付設定・一日の流れ・入社後のステップ・数字・インタビュー |
| `src/data/jobs.ts` | 求人（募集要項・JobPosting のもとになるデータ） |
| `src/data/faq.ts` | よくある質問（お客様向け／求職者向け） |
| `src/data/news.ts` | お知らせ |
| `src/data/instagram.ts` | トップページに表示する Instagram サムネイル |
| `src/data/nav.ts` | ヘッダー・フッターのナビゲーション |

### データが未入力のときの共通ルール

- 空文字・`undefined` の項目は、画面にも構造化データにも出力されません
- `[要入力]` のようなプレースホルダーを本番画面に出しません
- 架空の情報で埋めません
- 未入力の項目は、この README の「未入力情報一覧」で管理します

---

## 会社情報を編集する

`src/data/site.ts` を編集します。値を空にした項目は、会社概要テーブルから**行ごと消えます**。

```ts
businessHours: { weekday: '9:00〜18:00' },  // 入力済み
closedDays: '不定休',                        // 入力済み
email: 'info@example.jp',                   // 確認できたら入力する
```

> ℹ️ 営業時間は画面（会社概要）に表示していますが、定休日が「不定休」で
> 曜日を特定できないため、構造化データの `openingHours` には出力していません。
> 曜日ごとの営業時間が確定したら `src/lib/schema.ts` に追加できます。
>
> ⚠️ **「対応エリア」は掲載していません。**
> どこまで出張しているかが確認できていないため、会社概要には所在地（＝拠点）のみを
> 載せています。サイト全体でも「広島市西区己斐上を拠点に」という事実の範囲で表現しており、
> 「広島市全域に対応」といった断定は使っていません。
> 出張範囲が確定したら、下記の地域ページを公開してください。

---

## 地域ページを追加する

`src/data/areas.ts` で管理します。**薄い地域ページの大量生成は避けてください。**

現在公開しているのは、事業所の所在地から確認できる `広島市西区` のみです。
他の区は `enabled: false` で登録してあり、ページは生成されません。

```ts
{ slug: 'hiroshima-naka', name: '広島市中区', shortName: '中区', enabled: false, index: false }
```

公開するときは次を行ってください。

1. `enabled: true` と `index: true` にする
2. `content` にその地域固有の本文（`description` / `intro` / `points` / `flow` / `faqIds`）を書く
3. **他の地域ページと同じ文章を使い回さない**（自動生成ページとみなされる原因になります）

`enabled: true` かつ `content` があるページだけが生成され、`index: true` のものだけが
サイトマップと `HVACBusiness` の `areaServed` に出力されます。

---

## サービス情報を編集する

`src/data/services.ts` の `enabled` で表示を切り替えます。

```ts
{ slug: 'commercial', title: '業務用エアコン工事', enabled: false }  // 対応可否が確認できたら true
```

`enabled: false` のサービスは、一覧・詳細ページ・サイトマップ・お問い合わせフォームの
「お問い合わせ種別」からも自動的に除外されます。

料金は `priceNotice` の1箇所で管理しています。架空の料金表は作らないでください。

---

## 施工事例を追加する

1. 掲載の許可を得た写真を `public/images/works/` に置く（例：`nishiku-living-01.jpg`）
2. `src/data/works.ts` の `works` 配列に追加する（フォーマットはファイル内のコメント参照）
3. `published: true` にする

- 1件目を追加すると、ヘッダーの「施工事例」リンク、トップページの施工事例セクション、
  サイトマップへの登録が**自動的に有効**になります
- 絞り込みUI（工事種別・建物種別・エリア）は、実際に登録されている値からのみ生成されます。
  候補が1つ以下の項目は表示されません
- 0件のあいだ `/works` は `noindex` になり、サイトマップからも除外されます
- Instagram の文章・画像を自動取得する仕組みは入れていません。転載は許可を得たものだけにしてください

---

## 求人を追加・編集する

`src/data/jobs.ts` を編集します。`published: true` の求人だけがページ・サイトマップに出ます。

### JobPosting 構造化データが出力される条件

次を**すべて**満たしたときだけ、求人詳細ページに `JobPosting` が1件出力されます。

1. `src/data/recruit.ts` の `recruitmentSettings.showJobPostingSchema` が `true`
2. その求人の `published` と `acceptingApplications` が `true`
3. 次の項目がすべて入力されている
   - `salary`（`unit` と `min` または `max`）
   - `employmentType`
   - `workingHours`
   - `holidays`
   - `benefits`
   - `trialPeriod`
   - `qualifications`
   - `responsibilities`
   - `datePosted`
4. `validThrough` が未設定、または未来の日付

条件を満たさない場合、画面には「募集内容 準備中」と表示され、JSON-LD は出力されません。
**求人一覧ページ（`/recruit`）には JobPosting を出力しません。**
画面表示と JSON-LD は同じデータから生成しているため、内容は常に一致します。

### 応募受付を開始する

```ts
// src/data/recruit.ts
export const recruitmentSettings = {
  acceptingApplications: true,   // 応募フォームを開く
  showJobPostingSchema: true,    // 条件を満たした求人に JobPosting を出力する
}
```

あわせて `src/data/jobs.ts` の該当求人も `acceptingApplications: true` にしてください。

### 募集を終了する

次のいずれかを選べます。

- `published: false` にする（ページごと非公開・サイトマップからも除外）
- `acceptingApplications: false` にする（募集終了表示へ切り替え・応募フォームを閉じる）
- `validThrough` を過去日にする（JobPosting が自動的に出力されなくなる）

---

## 専門コラムの記事を追加する

`src/data/columns/` に1記事1ファイルで置き、`index.ts` の `allColumns` へ追加します。
`published: true` にすると、一覧・詳細ページ・サイトマップ・RSS（`/feed.xml`）へ
自動的に反映されます。

### 記事を書くときのルール

- **1記事につき検索意図を1つに絞る。** 複数の意図を混ぜると、どのキーワードでも
  評価されにくくなります。
- **他の記事やサービスページと同じ文章を使い回さない。** 共通のテーマ（真空引き、
  ドレン排水、電源など）も、その記事の視点から書き分けています。
- **対応可否が確認できていないことを「できます」と書かない。** 一般的な仕組みの説明と、
  「現場を確認したうえでご案内します」を使い分けてください。
- **監修表記は「3Peace 代表 面出 洋平」まで。** 資格・経験年数・施工件数は
  確認できていないため書かないでください。
- `relatedServices` と `relatedColumns` を必ず埋めてください。ここが内部リンクになります。

### 記事の構成

`sections` に `heading` と `id` を書くと、目次が自動生成されます。
本文は `body`（段落）・`list`（箇条書き）・`steps`（手順）・`subsections`（H3）・
`note`（注意書き）・`image`（写真）を組み合わせて構成します。

---

## ブログの自動投稿（Claude API + GitHub Actions）

毎日 **12:10（日本時間）** に記事を1本生成し、`content/blog/` へ Markdown で保存して
`main` へ直接コミットします。Vercel が変更を検知して自動でデプロイされます。

### 使うために必要な設定（1つだけ）

GitHub リポジトリの **Settings → Secrets and variables → Actions → New repository secret** で、
次の1件だけを登録してください。

| 名前 | 値 |
| --- | --- |
| `ANTHROPIC_API_KEY` | [Anthropic Console](https://console.anthropic.com/) で発行した API キー |

これ以外の Secret は不要です。Vercel 側の設定変更もありません。

### モデルとコスト

コストを抑えるため、既定では **`claude-haiku-4-5-20251001`** を使います。
GitHub の **Settings → Secrets and variables → Actions → Variables** に
`ANTHROPIC_MODEL` を追加すると、そちらが優先されます。
実行時に使用したモデル名が Actions のログに出力されます。

> 毎日の自動生成に Sonnet / Opus は使いません。品質を上げたい記事は
> `ANTHROPIC_MODEL` を一時的に変更したうえで `workflow_dispatch` で手動実行してください。

### 動作の仕組み

| ファイル | 役割 |
| --- | --- |
| `.github/workflows/daily-blog.yml` | 毎日 03:10 UTC（＝12:10 JST）に起動。手動実行も可能 |
| `scripts/blog-topics.ts` | 記事テーマの一覧（36件）と、本文で使ってよい内部リンクの許可リスト |
| `scripts/generate-daily-post.ts` | Claude API を呼び、Markdown を組み立てて保存 |
| `src/lib/blog.ts` | `content/blog/*.md` の読み込み（frontmatter が壊れた記事は自動でスキップ） |
| `src/app/blog/` | 一覧 `/blog`、詳細 `/blog/[slug]`、カテゴリー `/blog/category/[category]` |

1. `content/blog/` の既存記事から `topicId` を集め、**まだ使っていないテーマ**を選びます
   （全部使い切ったら、最後に使ってから最も日が経ったテーマに戻ります）
2. Claude API を構造化出力（JSON Schema）で呼び出し、記事の各パーツを受け取ります
3. frontmatter と Markdown は**スクリプト側で組み立てます**（書式が崩れないようにするため）
4. 保存前に禁止表現をチェックし、1つでも見つかったら**保存せずに終了**します
5. 変更がなければコミットせずに正常終了します

### 生成された記事に含めない内容（自動チェック付き）

プロンプトで禁止したうえで、保存直前にも次のパターンを機械的に検査しています。
検出された場合はファイルを書き出さずにジョブが失敗します。

- 金額（`〇〇円`）
- 「広島で一番」「地域最安」などの根拠のない最上級表現
- 「必ず取り付けできます」といった対応可否の断定
- 「即日対応」「最短〇分」などの確認できない約束
- 創業年・施工実績件数
- 時給・月給・賞与など未確定の求人条件
- 許可リストにない内部リンク（リンク切れ防止）

### 記事を手直しする・取り下げる

生成物は普通の Markdown ファイルです。`content/blog/` のファイルを直接編集してコミットすれば反映されます。

- 公開を取り消す → frontmatter の `published: true` を `false` に変える
- 更新日を出す → `updated: "2026-08-20"` を追加する
- 削除する → ファイルごと消す

### 専門コラム（`/column`）との使い分け

| | `/column` 専門コラム | `/blog` ブログ |
| --- | --- | --- |
| 作り方 | 手作業（`src/data/columns/` の TypeScript） | Claude API で毎日1本 |
| 役割 | 体系的な解説。検索の受け皿となる主要記事 | 個別の疑問に答える記事。更新頻度を担う |
| 本数 | 10本（増やすときは手動） | 毎日1本ずつ増える |

同じキーワードを2つのページで奪い合わないよう、テーマが重なるトピックには
`scripts/blog-topics.ts` の `relatedColumn` を設定してあります。
その場合、ブログ側は概要にとどめてコラムへ内部リンクするようプロンプトで指示しています。

### カテゴリーページの扱い

カテゴリー一覧（`/blog/category/[category]`）は、記事が **3本以上**たまるまで `noindex` にし、
サイトマップにも載せません（内容の薄い一覧ページを検索結果に出さないため）。
しきい値は `src/lib/blog.ts` の `MIN_POSTS_FOR_INDEXING` で変更できます。

### ローカルで試す

```bash
# APIを呼ばずに、次に選ばれるテーマとプロンプトだけを確認する（キー不要・ファイルは作られません）
npx tsx scripts/generate-daily-post.ts --dry-run

# 実際に1本生成する
export ANTHROPIC_API_KEY=sk-ant-...
npm run blog:generate      # content/blog に1本増える
npm run build              # 表示を確認
```

---

## お知らせを追加する

`src/data/news.ts` の `news` 配列に追加し、`published: true` にします。
1件目を追加すると、トップページのお知らせセクションとフッターのリンクが自動的に表示されます。
0件のあいだ `/news` は `noindex` になり、サイトマップからも除外されます。

---

## 画像

サイトで使う画像のパスと `alt` は **`src/data/images.ts` で一元管理**しています。
実ファイルは `public/images/` 配下です。

| ディレクトリ | 用途 | 状態 |
| --- | --- | --- |
| `public/images/hero/` | トップページのヒーロー背景 | ✅ 配置済み |
| `public/images/home/` | トップページ本文中の写真 | ✅ 配置済み（4点） |
| `public/images/services/` | 業務案内の見出し・工事別の写真 | ✅ 配置済み（6点） |
| `public/images/works/` | 施工事例ページの見出し／施工事例の写真 | ✅ 見出しのみ配置済み・**事例写真は未配置** |
| `public/images/recruit/` | 採用ページの写真 | ✅ 配置済み（4点） |
| `public/images/company/` | 会社ページの写真・代表写真 | ✅ 会社写真のみ配置済み・**代表写真は未配置** |
| `public/images/instagram/` | Instagram サムネイル（`post-01.webp` 〜 `post-06.webp`） | ❌ 未配置 |
| `public/images/news/` | お知らせのアイキャッチ | ❌ 未配置 |
| `public/images/og/` | OGP画像（`3peace-og.jpg` / 1200×630） | ✅ 配置済み |
| `public/logo/` | ロゴ（`3peace-logo.png`） | ❌ 未配置 |

### ⚠️ 現在の写真について

**現在配置している写真は、エアコン工事の内容を伝えるためのイメージ写真です。
3Peaceが実際に施工した現場の写真ではありません。** そのため、次の用途には使用していません。

| 用途 | 理由 |
| --- | --- |
| 施工事例（`/works` の各事例） | 実績の裏付けになるため、実際に施工した現場の写真のみを使います |
| 代表者の写真（`/message`） | 実在する面出洋平氏の写真として、別人の写真は使えません |
| スタッフインタビューの写真 | 同上 |
| Instagram サムネイル | 実際に投稿されている写真ではないため |

実際の現場写真が用意できたら、**同じファイル名で差し替えるだけ**で反映されます。

### 画像を追加・差し替える

1. 元画像を `_originals/`（.gitignore 済み）に置く
2. `scripts/optimize-images.mjs` の `MAP` に「元ファイル名の一部 → 出力先」を追記する
3. `node scripts/optimize-images.mjs` を実行する（幅1600のWebPへ変換。OG画像のみJPEG）
4. 新しい用途の画像であれば `src/data/images.ts` にパスと `alt` を追加する

### 画像の扱い方

- ファイルが存在しない画像は自動的に非表示になります（404やレイアウト崩れは発生しません）
- 開発サーバーでは、未配置のヒーロー画像に「画像が未配置です」というパス表示が出ます。
  本番ビルドでは表示されません
- ロゴとOG画像は、実ファイルがある場合だけ構造化データ・OGPに出力されます
- `alt` にはキーワードを詰め込まず、何が写っているかを具体的に書いてください
- 業務用エアコンを写した3点（`services/commercial` / `recruit/recruit-teamwork` /
  `company/company-outdoor-units`）は、業務用工事への対応が未確認のため**どこにも表示していません**

---

## お問い合わせメールの設定

1. [Resend](https://resend.com/) でアカウントを作成し、送信ドメインを認証する
2. API キーを発行する
3. `.env.local`（および Vercel の環境変数）に登録する

```env
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_TO_EMAIL=info@example.jp
CONTACT_FROM_EMAIL=noreply@example.jp
```

実装上の対策：

- 送信は Server Action 経由（Next.js が同一オリジンを検証するため CSRF 対策になります）
- Zod によるサーバー側バリデーション（クライアント側の検証をすり抜けても弾かれます）
- honeypot（隠しフィールド）と、表示から送信までの経過時間によるスパム判定
- 送信中はボタンを無効化して二重送信を防止
- 入力内容はログに出力しません（メール本文としてのみ使用）

---

## 未入力情報一覧

以下は**確認できていないため、サイトに記載していない項目**です。
確認できたものから、対応するデータファイルへ入力してください。

### 会社情報（`src/data/site.ts`）

| 項目 | 状態 |
| --- | --- |
| 営業時間 | ⚠️ 9:00〜18:00 を掲載中（2026-08-06にご提供いただいた情報）。相違があればお知らせください |
| 定休日 | ⚠️ 不定休を掲載中（同上） |
| 郵便番号 | ❌ 未確認（`address.postalCode`） |
| 問い合わせ先メールアドレス | ❌ 未確認（`email`） |
| 対応エリア（出張範囲） | ❌ 未確認（掲載していません。`src/data/areas.ts`） |
| 正式な事業内容 | △ エアコン工事のみ記載（`businessSummary`） |
| 会社の設立年・沿革 | ❌ 未確認（現在サイトに記載なし） |
| 法人格の有無・正式名称 | ❌ 未確認 |
| 本番ドメイン | ❌ 未確認（`NEXT_PUBLIC_SITE_URL`） |

### サービス（`src/data/services.ts`）

| 項目 | 状態 |
| --- | --- |
| 室外機設置・架台設置の単独受注 | ❌ 未確認（`enabled: false`） |
| 配管工事・化粧カバーの単独受注 | ❌ 未確認（`enabled: false`） |
| 業務用エアコン工事の対応可否 | ❌ 未確認（`enabled: false`） |
| エアコン本体の販売可否 | ❌ 未確認（FAQ `supply-unit` が非公開） |
| 法人・管理会社からの受注可否 | ❌ 未確認（FAQ `corporate` が非公開） |
| 支払い方法 | ❌ 未確認（FAQ `payment` が非公開） |
| 施工保証の有無・内容 | ❌ 未確認（FAQ `warranty` が非公開） |
| 保有資格・メーカー認定 | ❌ 未確認（現在サイトに記載なし） |
| 料金・価格帯 | ❌ 未確認（現場確認後にご案内する表記のみ） |

### 施工実績（`src/data/works.ts`）

| 項目 | 状態 |
| --- | --- |
| 施工事例 | ❌ 0件（写真と掲載許可が必要） |
| 施工件数 | ❌ 未確認（現在サイトに記載なし） |

### 採用（`src/data/jobs.ts` / `src/data/recruit.ts`）

| 項目 | 状態 |
| --- | --- |
| 採用中の職種 | ❌ 未確認（`aircon-installer` のみ公開・募集受付は停止中） |
| 雇用形態 | ❌ 未入力（`employmentType`） |
| 給与 | ❌ 未入力（`salary`） |
| 勤務時間 | ❌ 未入力（`workingHours`） |
| 休日 | ❌ 未入力（`holidays`） |
| 福利厚生 | ❌ 未入力（`benefits`） |
| 試用期間 | ❌ 未入力（`trialPeriod`） |
| 必要資格・応募資格 | ❌ 未入力（`qualifications`） |
| 選考方法 | ❌ 未入力（`selectionProcess`） |
| 求人公開日 | ❌ 未入力（`datePosted`） |
| 求人終了日 | ❌ 未入力（`validThrough`） |
| 従業員数・平均年齢・残業時間・休日数・未経験比率 | ❌ 未確認（`recruitNumbers` が全て空のためセクション非表示） |
| スタッフインタビュー | ❌ 未取材（`interviews` が空のためセクション非表示） |
| 研修制度・資格取得支援・独立支援 | ❌ 未確認（記載していません） |
| 代表挨拶の文章 | △ 方向性のみの土台（`about.ts` の `message.isDraft: true`）。本人の言葉へ差し替えてください |

### 未配置・差し替えが必要な画像

| 項目 | 状態 |
| --- | --- |
| 施工事例の写真 | ❌ 未配置（掲載許可を得た実際の現場写真が必要） |
| 代表の写真 | ❌ 未配置（`public/images/company/representative.jpg`） |
| Instagram サムネイル（最大6点） | ❌ 未配置（実際に投稿した写真を配置してください） |
| ロゴ画像 | ❌ 未配置（`public/logo/3peace-logo.png`） |
| ヒーロー・業務案内・採用・会社の写真 | △ イメージ写真を配置済み。実際の現場写真への差し替えを推奨 |

---

## SEOの設計方針

### ページごとの検索意図（カニバリ防止）

同じキーワードを複数ページで奪い合わないよう、役割を分けています。
新しいページを追加するときは、この表に重ならない意図を割り当ててください。

| ページ | 主な検索意図 |
| --- | --- |
| `/` | 広島 エアコン工事 |
| `/service` | 広島 エアコン工事（工事の種類を選ぶ段階） |
| `/service/installation` | 広島市 エアコン取り付け・新設 |
| `/service/replacement` | 広島 エアコン交換・買い替え |
| `/service/relocation` | 広島 エアコン移設・引越し |
| `/service/removal` | 広島 エアコン取り外し |
| `/area/hiroshima-nishi` | 広島市西区 エアコン工事 |
| `/column/*` | 情報収集（依頼前に調べていること） |
| `/works` | 施工事例を見て業者を選びたい |
| `/recruit` | 広島 エアコン工事 求人 |

### title の付け方

`src/app/layout.tsx` の `title.template` が `%s｜3Peace` を自動で付与します。
**各ページの `title` に「｜3Peace」を自分で付けないでください。**
付けると `｜3Peace｜3Peace` と二重になります。

トップページだけは template が適用されない仕様のため、
`buildMetadata({ absoluteTitle: true })` で完全形のタイトルを指定しています。

### 内部リンクのルール

- 「詳しくはこちら」のような、リンク先が分からないアンカーテキストは使わない
- 「広島市のエアコン取り付け工事について詳しく見る」のように、リンク先の内容が分かる文言にする
- 各ページ下部に「関連するエアコン工事」「関連する施工事例」「関連記事」を置く

---

## 公開前チェック項目

- [ ] `https://ドメイン/robots.txt` が `Allow: /` になっている（`Disallow: /` ならサイトURLが解決できていません）
- [ ] 独自ドメインを使う場合は `NEXT_PUBLIC_SITE_URL` を設定した
- [ ] `https://ドメイン/feed.xml` が RSS として返る
- [ ] title に `｜3Peace｜3Peace` の二重表記がない
- [ ] `https://ドメイン/sitemap.xml` に想定どおりのURLが並んでいる
- [ ] 各ページの canonical が本番ドメインになっている（プレビューURLが出ていない）
- [ ] ロゴを配置した（`public/logo/3peace-logo.png`）
- [ ] イメージ写真を実際の現場写真へ差し替えた（またはイメージ写真のままで問題ないと判断した）
- [ ] 営業時間・定休日・対応エリアを確認して入力した（または未入力のまま非表示でよいと判断した）
- [ ] `RESEND_API_KEY` / `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` を設定し、テスト送信で受信を確認した
- [ ] お問い合わせフォーム・応募フォームの送信テストを行った
- [ ] 求人を公開する場合、募集要項の必須項目をすべて入力した
- [ ] [リッチリザルトテスト](https://search.google.com/test/rich-results)で構造化データを確認した
- [ ] Google Search Console にサイトマップを送信した
- [ ] スマートフォンで横スクロールが発生しないことを確認した
- [ ] `npm run lint` / `npm run typecheck` / `npm run build` がすべて成功する

---

## ディレクトリ構成

```text
src/
  app/
    page.tsx                    トップページ
    service/page.tsx            業務案内
    service/[slug]/page.tsx     業務案内（工事別の詳細）
    works/page.tsx              施工事例一覧（絞り込み対応）
    works/[slug]/page.tsx       施工事例詳細
    about/page.tsx              3Peaceについて
    message/page.tsx            代表挨拶
    recruit/page.tsx            採用情報
    recruit/jobs/[slug]/page.tsx 求人詳細（JobPosting 出力箇所）
    faq/page.tsx                よくある質問
    contact/page.tsx            お問い合わせ
    news/page.tsx               お知らせ一覧
    news/[slug]/page.tsx        お知らせ詳細
    column/page.tsx             専門コラム一覧（手作業）
    column/[slug]/page.tsx      専門コラム詳細
    blog/page.tsx               ブログ一覧（自動投稿）
    blog/[slug]/page.tsx        ブログ詳細
    blog/category/[category]/page.tsx  ブログのカテゴリー別一覧
    area/[slug]/page.tsx        地域ページ
    feed.xml/route.ts           RSS（コラム＋ブログ）
    privacy/page.tsx            プライバシーポリシー
    actions/contact.ts          フォーム送信の Server Action
    sitemap.ts / robots.ts
    not-found.tsx / error.tsx
  components/
    layout/                     Header / Footer / MobileCta / PageHero
    sections/                   トップページなどのセクション
    forms/                      フォーム部品
    ui/                         汎用UI（Section / Button / Photo / JsonLd ほか）
  data/                         すべての情報の単一ソース
  lib/
    seo.ts                      metadata・canonical の生成
    schema.ts                   JSON-LD の生成
    jobPosting.ts               JobPosting の出力条件判定
    validation.ts               Zod スキーマ
    mail.ts                     Resend 送信
    images.ts                   画像の存在チェック
    blog.ts                     content/blog の Markdown 読み込み

content/
  blog/                         自動投稿された記事（Markdown）

scripts/
  blog-topics.ts                記事テーマ一覧と内部リンク許可リスト
  generate-daily-post.ts        Claude API による記事生成
  optimize-images.mjs           画像の WebP 変換

.github/workflows/
  daily-blog.yml                毎日12:10（JST）の自動投稿
```

---

## 構造化データ

| ページ | 出力する JSON-LD |
| --- | --- |
| 全ページ（共通） | `Organization` / `WebSite`（`alternateName` 付き）/ `HVACBusiness` |
| 下層ページすべて | `BreadcrumbList` |
| トップ | `FAQPage` |
| エアコン工事（一覧・詳細） | `Service`（`hasOfferCatalog` 付き）/ `FAQPage` |
| 地域ページ | `Service` / `FAQPage` |
| 専門コラム（詳細） | `Article`（`reviewedBy` に代表者名）/ `FAQPage` |
| ブログ（詳細） | `Article`（`reviewedBy` に代表者名）/ `FAQPage`（本文に「よくある質問」がある場合） |
| 施工事例（詳細） | `Article` |
| お知らせ（詳細） | `Article` |
| よくある質問 | `FAQPage` |
| 求人詳細 | `JobPosting`（必須項目がすべて揃っている場合のみ） |

営業時間・価格帯・評価・口コミ件数・緯度経度・設立日・従業員数・資格などは
確認できていないため出力していません。確認できるまで追加しないでください。
