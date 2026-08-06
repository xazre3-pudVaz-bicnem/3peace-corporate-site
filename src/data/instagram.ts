/**
 * トップページの Instagram 紹介セクションで表示する静的サムネイル。
 *
 * Instagram の埋め込みスクリプトは使用していません（表示速度への影響が大きいため）。
 * 掲載してよい写真を public/images/instagram/ へ配置し、alt を具体的に記入してください。
 *
 * ファイルが存在しない画像は自動的に除外され、
 * 1枚も存在しない場合は Instagram へのリンクのみを表示します。
 */

export type InstagramThumb = {
  src: string
  /** 何が写っているかを具体的に書く（キーワードの詰め込みはしない） */
  alt: string
}

export const instagramThumbs: InstagramThumb[] = [
  { src: '/images/instagram/post-01.jpg', alt: '壁に取り付けた室内機と配管の仕上がり' },
  { src: '/images/instagram/post-02.jpg', alt: 'ベランダに設置した室外機と接続配管' },
  { src: '/images/instagram/post-03.jpg', alt: 'エアコン工事で使用する工具と部材' },
  { src: '/images/instagram/post-04.jpg', alt: '配管の接続作業を行っている様子' },
  { src: '/images/instagram/post-05.jpg', alt: '室外機を据え付けている作業の様子' },
  { src: '/images/instagram/post-06.jpg', alt: '養生を行った室内の作業スペース' },
]
