/**
 * ═══════════════════════════════════════════════════════════════════════
 *  BIRTHDAY SITE — CENTRAL CONTENT
 *  ─────────────────────────────────────────────────────────────────────
 *  Edit this ONE file to customize the entire site for a different friend.
 *  Swap the friend, the photos, the messages — without touching any
 *  component logic in src/scenes/* or src/components/*.
 *
 *  Structure:
 *    friendName        — English name (Scene 02 reveal headline)
 *    friendNameCN      — Chinese name (final card salutation)
 *    senderName        — Signature under the final card
 *    birthdayMessages  — per-scene text content (opening, letter, map, etc.)
 *    memories          — scrapbook items (Scene 03 · nostalgia)
 *    photos            — casual desk polaroids (held in reserve for humor scene)
 *    funnyCaptions     — short funny captions for the casual desk scene
 *    wishList          — notebook items (Scene 05 · hope)
 *    finalMessage      — multi-line message on the final birthday card
 *    card              — final card chrome (caption + replay label)
 *    music             — background audio file + display title
 *    meta              — document <title> + date stamp
 *
 *  Visual rules encoded here (used across all scenes by components):
 *    tapeColor ∈ 'blush' | 'lavender' | 'rose' | 'peach' | 'champagne'
 *    tone      ∈ 'warm'  | 'cool' | 'mono'    (mono = B&W → color reveal)
 *    style     ∈ 'polaroid' | 'print' | 'frame' | 'note'
 *    size      ∈ 'sm' | 'md' | 'lg'
 * ═══════════════════════════════════════════════════════════════════════
 */

// ── Memory photos (relative imports so Vite bundles them) ──────
import imgFirstMeeting from '../img/初次认识.png';
import imgChristmasPrep from '../img/准备圣诞的过程.jpg';
import imgChristmasResult from '../img/圣诞的结果.jpg';
import imgGameRecord from '../img/游戏的记录.jpg';
import imgChatFrequency from '../img/火热与冷淡.jpg';
import imgHeartHands from '../img/她的爱心手势.jpg';

export const birthday = {
  /* ── PEOPLE ─────────────────────────────────────────────────── */
  /** English name — used in the Scene 02 reveal headline. */
  friendName: '李晓婷',
  /** Chinese name — used in the final card salutation. */
  friendNameCN: '李晓婷',
  /** Signature that appears under the final card. */
  senderName: 'lbw',

  /* ── BIRTHDAY MESSAGES (per scene) ──────────────────────────── */
  birthdayMessages: {
    /* Scene 01 — Opening (mystery · candle) ─────────────────────
     * Timed reveal sequence (delays from mount):
     *   0.0s background · 0.3s dust · 0.5s heyLine · 1.3s waitLine
     *   2.3s revealLine · 3.2s hint candle · 4.0s inviteLabel
     * On click: flame brightens → warm glow → particles gather
     *   → okLine → showLine → paper reveal → next scene */
    opening: {
      // Top-right entry hint label.
      entryLabel: '给特别的你',
      // Staged center text — premium serif Chinese (font-zh).
      heyLine: '嘿。',
      waitLine: '先别急着往下看。',
      revealLine: '这里有一份东西，\n是偷偷准备给你的。',
      // Bottom interaction prompt.
      inviteLabel: '打开这份小惊喜',
      // Click response sequence (two short lines).
      okLine: '好吧。',
      showLine: '那就给你看看吧。',
    },

    /* Scene 02 — Reveal (curiosity · envelope + letter) ──────── */
    reveal: {
      envelopeTo: '李晓婷',
      // First line is the salutation (handwritten cherry).
      // Subsequent lines are body text revealed line by line.
      letterLines: [
        '嗨，李晓婷。',
        '我想了想，',
        '今年还是想送你一点特别的东西。',
      ],
      headline: 'Happy Birthday,',
      nameReveal: '李晓婷',
      timings: {
        afterPrelude: 2.4,
        afterHeadline: 2.8,
        afterName: 2.4,
      },
    },

    /* Scene 04 — Blessings (hope · life map) ──────────────────── */
    blessings: {
      sectionLabel: 'CHAPTER 04 · A MAP FOR THE NEW YEAR',
      prelude: '如果新的一岁是一张地图，',
      // Three cinematic sentences, appear one after another as the user scrolls.
      lines: [
        '希望你可以\n去更多自己想去的地方。',
        '见更多想见的人。',
        '做更多真正让自己开心的事。',
      ],
      // Four destination labels along the path.
      markers: ['想去的地方', '想做的事情', '想见的人', '还没发生的故事'],
      coda: '至于要去哪里，\n你慢慢写就好。',
    },

    /* Scene 06 — Interactive (surprise · gift box) ────────────── */
    interactive: {
      sectionLabel: 'CHAPTER 06 · ONE MORE THING',
      prompt: '还有一个。',
      promptConfirm: '真的。',
      promptOpen: '打开看看？',
      tapHint: '点击打开',
      afterReveal: '送给你的。',
      climaxLine: '生日快乐。',
      // Wishes that fly out of the gift box once it's opened.
      giftWishes: [
        '愿你被这个世界温柔以待。',
        '所求皆如愿，所行化坦途。',
        '新的一岁，万事胜意。',
        '平安喜乐，得偿所愿。',
        '眼里有光，心中有爱。',
      ],
    },

    /* Scene 07 — Cake (anticipation · candles) ────────────────── */
    cake: {
      sectionLabel: 'CHAPTER 07 · MAKE A WISH',
      prompt: '好了。',
      promptConfirm: '现在轮到你了。',
      promptWish: '许个愿吧。',
      candleCount: 5,
      tapHint: '轻触 · 或长按 · 吹灭蜡烛',
      afterBlow: '许好了。',
      // Blessing that appears after all candles are blown out.
      blessing: '愿望已悄悄生效。\n愿你新的一岁，平安、欢喜。',
      // Optional: detect microphone blowing. If false, tap only.
      enableMic: true,
    },

    /* Scene 08 — Finale (emotional climax · stars) ───────────── */
    finale: {
      headline: 'Happy Birthday',
      name: '李晓婷',
      blessing: '愿你新的一岁，\n有很多值得期待的事情。',
      signoff: '— from Y.',
    },
  },

  /* ── MEMORIES (Scene 03 — nostalgia · scrapbook) ─────────────── */
  memories: {
    sectionLabel: 'MEMORIES · 一些瞬间',
    sectionTitle: '一些和你的回忆,',
    sectionTitleAccent: 'just for you.',

    // Narrative captions placed between cards (handwritten).
    captions: [
      '那时候我们还不知道，\n后来会有这么多故事。',
      '一些看起来很普通的日子。',
      '后来想想，\n好像都挺值得记住。',
    ],

    // Each card is absolutely positioned on the desk — no grid.
    // size: 'sm' | 'md' | 'lg' | 'note'
    // style: 'polaroid' | 'print' | 'note' | 'frame'
    // tone: 'warm' | 'cool' | 'mono' (starts B&W, reveals color)
    // aspect: natural image aspect ratio (w/h) — drives the card's photo frame
    //         so the image fills it without letterboxing or cropping.
    //
    // Narrative order (left to right, top to bottom):
    //   1. first meeting  → 2. christmas prep  → 3. christmas result
    //   4. game record    → 5. hot & cold chat → [note: 时间会证明...]
    //   6. heart hands
    items: [
      {
        src: imgFirstMeeting,
        caption: '第一次认识的聊天截图。',
        year: '认识',
        style: 'print',
        size: 'md',
        aspect: 1437 / 863,
        tone: 'warm',
        top: '8%',
        left: '2%',
        rotate: -3,
        tape: 'top-left',
        tapeColor: 'blush',
      },
      {
        src: imgChristmasPrep,
        caption: '第一年一起准备圣诞。',
        year: '圣诞',
        style: 'print',
        size: 'sm',
        aspect: 404 / 803,
        tone: 'warm',
        top: '4%',
        right: '4%',
        left: 'auto',
        rotate: 2,
        tape: 'top-right',
        tapeColor: 'lavender',
      },
      {
        src: imgChristmasResult,
        caption: '圣诞的结果。',
        year: '圣诞',
        style: 'print',
        size: 'md',
        aspect: 1280 / 1536,
        tone: 'warm',
        top: '4%',
        left: '50%',
        rotate: -1,
        tape: 'top-left',
        tapeColor: 'peach',
      },
      {
        src: imgGameRecord,
        caption: '一起玩游戏的记录。',
        year: '游戏',
        style: 'print',
        size: 'md',
        aspect: 2160 / 1944,
        tone: 'warm',
        top: '60%',
        right: '-20%',
        left: 'auto',
        rotate: -2.5,
        tape: 'top-right',
        tapeColor: 'champagne',
      },
      {
        src: imgChatFrequency,
        caption: '聊天从火热到冷淡，又回归正常。',
        year: '日常',
        style: 'frame',
        size: 'sm',
        aspect: 786 / 803,
        tone: 'warm',
        top: '72%',
        left: '4%',
        rotate: -1.2,
        tape: 'top-left',
        tapeColor: 'rose',
      },
      {
        type: 'note',
        text: '时间会证明，\n我们的友谊不会中断。',
        top: '0%',
        left: '0%',
        rotate: 1.5,
      },
      {
        src: imgHeartHands,
        caption: '你的爱心手势。',
        year: '现在',
        style: 'polaroid',
        size: 'sm',
        aspect: 960 / 1280,
        tone: 'warm',
        top: '64%',
        left: '28%',
        rotate: -2.0,
        tape: 'top-right',
        tapeColor: 'blush',
      },
    ],
  },

  /* ── PHOTOS — casual desk polaroids (held in reserve) ─────────── */
  // These are the "thrown polaroids" for the playful desk / humor scene.
  // Currently held out of the App.tsx scene order; bring them back by
  // mounting CasualScrap between two existing scenes.
  photos: {
    sectionLabel: 'BEFORE YOU READ FURTHER',
    sectionTitle: 'A few things',
    sectionTitleAccent: 'we need to talk about.',
    items: [],
  },

  /* ── FUNNY CAPTIONS — for the casual desk scene ──────────────── */
  // Small editorial captions placed near each thrown polaroid.
  funnyCaptions: [],

  /* ── WISH LIST (Scene 05 — hope · notebook) ──────────────────── */
  wishList: {
    sectionLabel: 'CHAPTER 05 · A SMALL NOTEBOOK',
    headline: 'This year,',
    headlineAccent: 'maybe —',
    items: [
      '去一次一直想去的地方',
      '学会一件新的事情',
      '好好吃很多顿饭',
      '拍很多照片',
      '遇见一些有趣的人',
    ],
    finalItem: '继续做那个很酷的自己',
    coda: '这一页留给你。',
  },

  /* ── FINAL MESSAGE — multi-line poetry on the final card ─────── */
  finalMessage: [
    '最后',
    '再次祝你生日快乐',
    '愿你一直开心',
    '做自己喜欢的事情',
    '见想见的人',
    '期待的事情正在发生',
  ],

  /* ── CARD chrome (final scene · warmth) ──────────────────────── */
  card: {
    // Bottom small caption.
    caption: 'Made especially for you',
    // Replay prompt (minimal, below the card).
    replayLabel: '再看一次',
  },

  /* ── MUSIC ──────────────────────────────────────────────────── */
  music: {
    src: '/music/%E7%89%B9%E5%88%AB%E7%9A%84%E4%BA%BA-%E6%96%B9%E5%A4%A7%E5%90%8C.aac',
    title: '特别的人',
  },

  /* ── META ───────────────────────────────────────────────────── */
  meta: {
    title: 'For You — A Small Birthday',
    date: new Date().toISOString().slice(0, 10),
  },
};

export type BirthdayData = typeof birthday;
