# 3Peace 公式サイト（コーポレート兼採用サイト）

広島市西区を拠点とするエアコン工事会社「3Peace」の公式サイトです。
工事のご依頼獲得と、エアコン工事スタッフの採用応募獲得の2つを目的としています。

- 対策キーワード：`広島 エアコン工事`
- 技術構成：Next.js 16（App Router）/ React 19 / TypeScript / Tailwind CSS v4 / Zod
- ホスティング：Vercel を想定

---

## 🚨 公開前に必ず設定するもの

**`NEXT_PUBLIC_SITE_URL` が未設定のあいだ、robots.txt は全ページ Disallow（検索エンジンに拒否）になります。**
canonical・OG画像・sitemap も出力されません。これは Vercel のプレビューURLが誤って
インデックスされるのを防ぐための仕様です。本番公開時は必ず設定してください。

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

メール関連の3つが未設定でもビルドは成功します。その場合フォームは送信停止状態になり、
画面には電話・Instagram からの問い合わせ案内のみが表示されます。

---

## 情報の編集場所

すべての事実情報は `src/data/` に集約しています。**コンポーネントに直接書かないでください。**

| ファイル | 内容 |
| --- | --- |
| `src/data/site.ts` | 会社名・代表者名・住所・電話番号・Instagram・営業時間・定休日・対応エリア・Googleマップ・問い合わせ受付状態 |
| `src/data/services.ts` | 業務案内（対応工事）と料金についての表記 |
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

対応エリアは `serviceAreas` で管理します。`published: true` のものだけが画面と
`HVACBusiness` の `areaServed` に出力されます。

```ts
export const serviceAreas: ServiceArea[] = [
  { name: '広島市', published: true },
  { name: '山口県', published: false },  // 対応範囲を確認したら true にする
]
```

> ℹ️ Instagram のプロフィールには「広島県・福岡県・山口県」と記載がありますが、
> エアコン工事としての出張対応範囲が確認できていないため、現在は広島市のみを公開しています。

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
| 営業時間 | ✅ 9:00〜18:00（`businessHours.weekday`） |
| 定休日 | ✅ 不定休（`closedDays`） |
| 郵便番号 | ❌ 未確認（`address.postalCode`） |
| 問い合わせ先メールアドレス | ❌ 未確認（`email`） |
| 対応エリア（広島市以外） | ❌ 未確認（`serviceAreas`） |
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

## 公開前チェック項目

- [ ] `NEXT_PUBLIC_SITE_URL` に本番ドメインを設定した
- [ ] `https://ドメイン/robots.txt` が `Allow: /` になっている
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
```

---

## 構造化データ

| ページ | 出力する JSON-LD |
| --- | --- |
| 全ページ（共通） | `Organization` / `WebSite` / `HVACBusiness` |
| 下層ページすべて | `BreadcrumbList` |
| トップ | `FAQPage` |
| 業務案内（詳細） | `Service` / `FAQPage` |
| 施工事例（詳細） | `CreativeWork` |
| お知らせ（詳細） | `Article` |
| よくある質問 | `FAQPage` |
| 求人詳細 | `JobPosting`（必須項目がすべて揃っている場合のみ） |

営業時間・価格帯・評価・口コミ件数・緯度経度・設立日・従業員数・資格などは
確認できていないため出力していません。確認できるまで追加しないでください。
