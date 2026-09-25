import type { DisplayStyle, ExhibitType, RoomId } from "@/lib/types";
import type { Locale, Widened } from "./types";

/**
 * The English table is the source of truth for the shape of a dictionary:
 *
 * - Its room / type / display-style maps are checked against the real domain
 *   enums (`satisfies Record<RoomId, string>`), so no room can be forgotten.
 * - `Widened<typeof en>` then becomes the type every other locale must match,
 *   which catches a missing or misspelled key at compile time.
 *
 * Only Cuseum's own interface text lives here. Exhibit titles, personal notes,
 * Open Graph text, URLs, and hostnames are user content and are never
 * translated.
 */
const en = {
  brand: {
    name: "Cuseum",
    tagline: "Your personal museum of the internet.",
  },
  meta: {
    description:
      "Cuseum is a quiet place to put the things you find on the internet on display. Everything is kept in your own browser.",
  },
  nav: {
    label: "Museum sections",
    rooms: "Rooms",
    collection: "Collection",
    addExhibit: "Exhibit",
  },
  skipLink: "Skip to the exhibition",
  language: {
    label: "Change language",
    names: { ko: "한국어", en: "English" } satisfies Record<Locale, string>,
    short: { ko: "KO", en: "EN" } satisfies Record<Locale, string>,
  },
  loading: {
    museum: "Opening the museum…",
    gallery: "Opening the gallery…",
    exhibit: "Finding the exhibit…",
    register: "Opening the register…",
    doors: "Unlocking the doors…",
  },
  count: {
    exhibits: (count: number) =>
      count === 0 ? "No exhibits" : `${count} exhibit${count === 1 ? "" : "s"}`,
    emptyRoom: "Empty",
  },
  lobby: {
    privacy: "Everything here belongs to you, and stays in this browser",
    roomsHeading: "The rooms",
    roomsNote: "Five rooms, in the order of the building",
    takeMe: "Take me somewhere",
    walking: "Walking…",
    takeMeCaption:
      "One exhibit, chosen at random, from anywhere in the building.",
    firstExhibit: "Place the first exhibit",
    emptyMuseum:
      "The museum is empty. Every collection starts with one thing you could not stop thinking about.",
    collectionLink: "The collection list",
    collectedSince: (month: string) => `Collected since ${month}`,
  },
  rooms: {
    marker: (numeral: string) => `Room ${numeral}`,
    names: {
      music: "Music",
      web: "Web",
      images: "Images",
      objects: "Objects",
      archive: "Archive",
    } satisfies Record<RoomId, string>,
    taglines: {
      music: "A collection of sounds worth keeping.",
      web: "Pages I kept coming back to.",
      images: "Pictures that stayed with me.",
      objects: "Things I would keep on a shelf.",
      archive: "Records, papers, and things I want to remember.",
    } satisfies Record<RoomId, string>,
    emptyLines: {
      music: "Nothing is playing in here yet.",
      web: "No pages have been hung here yet.",
      images: "The walls are still bare.",
      objects: "No objects are on display yet.",
      archive: "The archive drawers are empty.",
    } satisfies Record<RoomId, string>,
    emptyLine: "A room becomes a room the moment something is put in it.",
    emptyAction: "Add the first exhibit",
    addToRoom: "Add to this room",
    openInCollection: "Open in the collection list",
    nextRoom: "Next room",
  },
  exhibitTypes: {
    labels: {
      website: "Website",
      image: "Image",
      music: "Music",
      object: "Object",
      memory: "Memory",
    } satisfies Record<ExhibitType, string>,
    hints: {
      website: "A page, essay, or corner of the internet.",
      image: "A photograph, drawing, or picture.",
      music: "A song, album, or recording.",
      object: "A thing: a product, a tool, an artefact.",
      memory: "Something that is not really a link at all.",
    } satisfies Record<ExhibitType, string>,
  },
  displayStyles: {
    labels: {
      frame: "Frame",
      poster: "Poster",
      object: "Object",
      screen: "Screen",
      document: "Document",
    } satisfies Record<DisplayStyle, string>,
    hints: {
      frame: "Matted and hung on the wall.",
      poster: "Printed flat and pinned large.",
      object: "Placed on a plinth, lit from above.",
      screen: "Shown on a small digital display.",
      document: "Laid out like a sheet in the archive.",
    } satisfies Record<DisplayStyle, string>,
  },
  exhibit: {
    pageTitle: "Exhibit",
    labelType: "Type",
    labelAdded: "Added",
    labelRoom: "Room",
    labelSource: "Source",
    whyHere: "Why it is here",
    visitOriginal: "Visit original",
    edit: "Edit exhibit",
    position: (position: number, total: number) =>
      `${position} of ${total} in this room`,
    moreInRoom: (room: string) => `More exhibits in ${room}`,
    previous: "Previous",
    next: "Next",
    noSource: "no source",
    plateNoSource: "Nothing to link to",
    missingEyebrow: "Not on display",
    missingTitle: "This exhibit is no longer in the museum.",
    missingBody:
      "It may have been withdrawn, or the address may be slightly off. The rest of the collection is still where you left it.",
    seeCollection: "See the collection",
    backToLobby: "Back to the lobby",
  },
  newExhibit: {
    eyebrow: "New exhibit",
    title: "What did you find?",
    intro:
      "Start with the address. Cuseum asks the page to describe itself, and you can correct anything it gets wrong.",
    fields: {
      url: "URL",
      title: "Title",
      image: "Image",
      description: "Description",
      room: "Room",
      type: "Type",
      displayStyle: "Display style",
      note: "Personal note",
    },
    hints: {
      url: "Paste an address and the museum will try to read the title, image, and description from the page. If it cannot, type them in yourself — nothing here is required but the title.",
      image:
        "A direct link to an image, or a path inside this site such as /samples/airports.svg. Leave it empty and the title becomes the artwork.",
      description: "What the work is, in the words of the museum.",
      room: "Which part of the building it hangs in.",
      type: "What kind of thing this is, printed on the label.",
      displayStyle: "How it is mounted when someone stands in front of it.",
      note: "The only part of the label that is entirely yours. A short record of why this is here.",
    },
    placeholders: {
      title: "What is this called?",
      image: "https://…/image.jpg",
      description: "A sentence or two about it…",
      note: "Why did you keep this?",
    },
    lookUp: "Look up details",
    lookupReading: "Reading the page…",
    lookupDone: (hostname: string) => `Details read from ${hostname}.`,
    lookupFailed: "Could not read this page. You can enter the details manually.",
    lookupInvalid:
      "That does not look like a web address. You can type the details in yourself.",
    lookupPrivate:
      "That address is on a private network, so it cannot be read. You can type the details in yourself.",
    submit: "Add to museum",
    submitting: "Placing it on the wall…",
    untitled: "Untitled exhibit",
    cancel: "Cancel",
    error: "The exhibit could not be placed in the museum.",
  },
  editExhibit: {
    eyebrow: "Edit exhibit",
    title: "Adjust the label.",
    intro: "Change how this work is described, or move it to another room.",
    submit: "Update exhibit",
    submitting: "Keeping the changes…",
    withdrawHeading: "Withdraw exhibit",
    withdrawBody: (title: string, date: string, room: string) =>
      `${title} was added on ${date} and hangs in ${room}. Withdrawing it deletes it from this browser, and there is no copy anywhere else.`,
    withdrawConfirm: "Withdraw this exhibit from Cuseum?",
    withdrawAction: "Yes, withdraw it",
    withdrawKeep: "Keep it",
    withdrawStart: "Withdraw this exhibit",
    withdrawing: "Withdrawing…",
    missingEyebrow: "Not on display",
    missingTitle: "There is no exhibit here to edit.",
    seeCollection: "See the collection",
  },
  collection: {
    eyebrow: "Collection",
    title: "Everything, in one list",
    intro:
      "For finding, correcting, and withdrawing exhibits. To look at them properly, walk the rooms instead.",
    searchLabel: "Search",
    searchAria: "Search the collection",
    searchPlaceholder: "Title, note, description, or address…",
    legends: { room: "Room", type: "Type", order: "Order" },
    allRooms: "All rooms",
    allTypes: "All types",
    newest: "Newest first",
    oldest: "Oldest first",
    byTitle: "A — Z",
    clear: "Clear the filters",
    edit: "Edit",
    remove: "Remove",
    removeConfirm: "Withdraw it",
    keep: "Keep",
    removing: "Withdrawing…",
    emptyMuseumTitle: "The register is empty.",
    emptyMuseumLine:
      "Once something is on display it is listed here as well — quietly.",
    emptyFilterTitle: "Nothing matches that.",
    emptyFilterLine: "Try a different word, or widen the filters.",
    addToMuseum: "Add to museum",
  },
  roomsIndex: {
    eyebrow: "The building",
    title: "Rooms",
    intro:
      "Five rooms, in the order of the building. Everything you place in the museum hangs in one of them.",
    collectionPrompt: "Looking for a list instead?",
    collectionLink: "The collection",
  },
  samples: {
    heading: "Sample exhibits",
    body: "A development fixture, not part of your collection. Ten sample exhibits are flagged so they can be withdrawn together at any time.",
    place: "Place a few sample exhibits",
    placed: (count: number) => `${count} sample exhibits placed.`,
    placeNoop: "The sample exhibits are already on display.",
    withdraw: (count: number) => `Withdraw the ${count} samples`,
    withdrawn: (count: number) =>
      `${count} sample exhibit${count === 1 ? "" : "s"} withdrawn.`,
    error: "The sample exhibits could not be changed.",
  },
  footer: {
    storage: "Kept in this browser only",
    collection: "Collection",
  },
  notFound: {
    eyebrow: "Not on display",
    title: "There is nothing hanging in this room.",
    body: "The page you asked for is not part of the museum. It may have been withdrawn, or the address may be slightly off.",
    lobby: "Back to the lobby",
    everything: "See everything",
  },
  errors: {
    storage: "Cuseum cannot reach this browser's local storage right now.",
    storageHint:
      "Private browsing windows sometimes refuse to keep a museum; opening this page in an ordinary window usually solves it.",
  },
};

/** Every locale must provide exactly these keys. */
export type Translation = Widened<typeof en>;

/**
 * Korean. Written as museum signage rather than a literal translation: short
 * sentences, no exclamation marks, and no "저장/북마크" vocabulary anywhere.
 * `Cuseum` and every internal id stay exactly as they are.
 */
const ko: Translation = {
  brand: {
    name: "Cuseum",
    tagline: "인터넷에서 발견한 것들을 위한 나만의 박물관.",
  },
  meta: {
    description:
      "Cuseum은 인터넷에서 발견한 것들을 조용히 전시해 두는 개인 박물관입니다. 모든 기록은 이 브라우저에만 남습니다.",
  },
  nav: {
    label: "박물관 안내",
    rooms: "전시실",
    collection: "컬렉션",
    addExhibit: "전시 추가",
  },
  skipLink: "전시장으로 건너뛰기",
  language: {
    label: "언어 변경",
    names: { ko: "한국어", en: "English" },
    short: { ko: "KO", en: "EN" },
  },
  loading: {
    museum: "박물관 문을 여는 중…",
    gallery: "전시장을 여는 중…",
    exhibit: "전시를 찾는 중…",
    register: "목록을 불러오는 중…",
    doors: "문을 여는 중…",
  },
  count: {
    exhibits: (count: number) => (count === 0 ? "전시 없음" : `전시 ${count}점`),
    emptyRoom: "비어 있음",
  },
  lobby: {
    privacy: "이곳의 모든 것은 당신의 것이며, 이 브라우저에만 남습니다",
    roomsHeading: "전시실",
    roomsNote: "건물 순서대로 놓인 다섯 개의 전시실",
    takeMe: "어딘가로 데려가 줘",
    walking: "이동하는 중…",
    takeMeCaption: "건물 안 어디에서든 무작위로 고른 전시 한 점.",
    firstExhibit: "첫 전시 배치하기",
    emptyMuseum:
      "박물관이 비어 있습니다. 모든 컬렉션은 자꾸 떠오르는 한 가지에서 시작됩니다.",
    collectionLink: "컬렉션 목록",
    collectedSince: (month: string) => `${month}부터 수집`,
  },
  rooms: {
    marker: (numeral: string) => `전시실 ${numeral}`,
    names: {
      music: "음악",
      web: "웹",
      images: "이미지",
      objects: "오브젝트",
      archive: "아카이브",
    },
    taglines: {
      music: "간직할 만한 소리들의 모음.",
      web: "자꾸 다시 찾게 되는 페이지.",
      images: "마음에 남은 그림.",
      objects: "선반 위에 두고 싶은 물건.",
      archive: "기록과 종이, 그리고 기억하고 싶은 것.",
    },
    emptyLines: {
      music: "아직 이곳에서는 아무 소리도 나지 않습니다.",
      web: "아직 걸린 페이지가 없습니다.",
      images: "벽이 아직 비어 있습니다.",
      objects: "아직 전시된 오브젝트가 없습니다.",
      archive: "기록 서랍이 비어 있습니다.",
    },
    emptyLine: "무언가 놓이는 순간, 그곳은 전시실이 됩니다.",
    emptyAction: "첫 전시 추가하기",
    addToRoom: "이 전시실에 전시 추가",
    openInCollection: "컬렉션 목록에서 보기",
    nextRoom: "다음 전시실",
  },
  exhibitTypes: {
    labels: {
      website: "웹사이트",
      image: "이미지",
      music: "음악",
      object: "오브젝트",
      memory: "기억",
    },
    hints: {
      website: "인터넷 어딘가에 있는 페이지.",
      image: "사진, 그림, 또는 이미지.",
      music: "노래, 앨범, 또는 녹음.",
      object: "제품, 도구, 또는 사물.",
      memory: "링크로 남길 수 없는 기억.",
    },
  },
  displayStyles: {
    labels: {
      frame: "액자",
      poster: "포스터",
      object: "전시대",
      screen: "스크린",
      document: "문서",
    },
    hints: {
      frame: "벽에 여백을 두고 걸어둡니다.",
      poster: "평평하게 크게 붙여둡니다.",
      object: "전시대 위에 올려둡니다.",
      screen: "작은 화면에 띄워 보여줍니다.",
      document: "기록 보관소의 한 장처럼 놓습니다.",
    },
  },
  exhibit: {
    pageTitle: "전시",
    labelType: "종류",
    labelAdded: "추가한 날짜",
    labelRoom: "전시실",
    labelSource: "출처",
    whyHere: "이곳에 전시한 이유",
    visitOriginal: "원본 보기",
    edit: "전시 수정",
    position: (position: number, total: number) => `${total}점 중 ${position}번째`,
    moreInRoom: (room: string) => `${room} 전시실의 다른 전시`,
    previous: "이전",
    next: "다음",
    noSource: "출처 없음",
    plateNoSource: "연결된 주소 없음",
    missingEyebrow: "전시되지 않음",
    missingTitle: "이 전시는 더 이상 박물관에 없습니다.",
    missingBody:
      "철회되었거나 주소가 조금 다를 수 있습니다. 나머지 컬렉션은 그대로 있습니다.",
    seeCollection: "컬렉션 보기",
    backToLobby: "로비로 돌아가기",
  },
  newExhibit: {
    eyebrow: "새 전시",
    title: "무엇을 발견하셨나요?",
    intro:
      "주소부터 입력하세요. Cuseum이 페이지에서 정보를 읽어오고, 잘못 읽은 부분은 직접 고칠 수 있습니다.",
    fields: {
      url: "URL",
      title: "제목",
      image: "이미지",
      description: "설명",
      room: "전시실",
      type: "종류",
      displayStyle: "전시 방식",
      note: "개인 메모",
    },
    hints: {
      url: "주소를 붙여넣으면 페이지에서 제목과 이미지, 설명을 읽어옵니다. 읽지 못하면 직접 입력하면 됩니다. 제목만 있어도 전시할 수 있습니다.",
      image:
        "이미지 주소나 이 사이트 안의 경로(예: /samples/airports.svg)를 입력하세요. 비워두면 제목이 작품이 됩니다.",
      description: "작품에 붙는 박물관의 설명.",
      room: "어느 전시실에 걸어둘지 정합니다.",
      type: "라벨에 인쇄될 종류입니다.",
      displayStyle: "관람자가 앞에 섰을 때 어떻게 놓여 보일지 정합니다.",
      note: "라벨에서 유일하게 당신의 문장으로 남는 부분입니다. 이 전시를 왜 남겨두었는지 짧게 적어둡니다.",
    },
    placeholders: {
      title: "이 전시의 제목",
      image: "https://…/image.jpg",
      description: "두어 문장이면 충분합니다…",
      note: "왜 이걸 남겨두었나요?",
    },
    lookUp: "정보 불러오기",
    lookupReading: "페이지 정보 불러오는 중…",
    lookupDone: (hostname: string) => `${hostname}에서 정보를 읽었습니다.`,
    lookupFailed: "페이지 정보를 불러오지 못했습니다. 직접 입력할 수 있습니다.",
    lookupInvalid: "웹 주소 형식이 아닙니다. 직접 입력할 수 있습니다.",
    lookupPrivate: "내부 네트워크 주소는 읽을 수 없습니다. 직접 입력할 수 있습니다.",
    submit: "박물관에 전시",
    submitting: "벽에 걸고 있습니다…",
    untitled: "제목 없는 전시",
    cancel: "취소",
    error: "전시를 박물관에 놓지 못했습니다.",
  },
  editExhibit: {
    eyebrow: "전시 수정",
    title: "라벨을 고칩니다.",
    intro: "이 작품을 어떻게 설명할지, 어느 전시실에 걸어둘지 바꿉니다.",
    submit: "수정 완료",
    submitting: "고치는 중…",
    withdrawHeading: "전시 철회",
    withdrawBody: (title: string, date: string, room: string) =>
      `${date}에 추가되어 ${room} 전시실에 걸려 있는 《${title}》입니다. 철회하면 이 브라우저에서 완전히 지워지며, 다른 곳에 복사본은 없습니다.`,
    withdrawConfirm: "이 전시를 Cuseum에서 철회할까요?",
    withdrawAction: "네, 철회합니다",
    withdrawKeep: "그만두기",
    withdrawStart: "이 전시 철회하기",
    withdrawing: "철회하는 중…",
    missingEyebrow: "전시되지 않음",
    missingTitle: "수정할 전시가 없습니다.",
    seeCollection: "컬렉션 보기",
  },
  collection: {
    eyebrow: "컬렉션",
    title: "모든 전시를 한 목록에",
    intro:
      "전시를 찾고, 고치고, 철회하는 곳입니다. 작품을 제대로 보려면 전시실을 걸어보세요.",
    searchLabel: "검색",
    searchAria: "전시 검색",
    searchPlaceholder: "제목, 메모, 설명, 주소",
    legends: { room: "전시실", type: "종류", order: "정렬" },
    allRooms: "모든 전시실",
    allTypes: "모든 종류",
    newest: "최근 추가순",
    oldest: "오래된 순",
    byTitle: "제목순",
    clear: "필터 초기화",
    edit: "수정",
    remove: "철회",
    removeConfirm: "철회하기",
    keep: "유지",
    removing: "철회하는 중…",
    emptyMuseumTitle: "아직 기록된 전시가 없습니다.",
    emptyMuseumLine: "전시가 하나라도 걸리면 이곳에도 조용히 함께 기록됩니다.",
    emptyFilterTitle: "조건에 맞는 전시가 없습니다.",
    emptyFilterLine: "다른 단어로 찾아보거나 필터를 넓혀보세요.",
    addToMuseum: "박물관에 전시",
  },
  roomsIndex: {
    eyebrow: "건물 안내",
    title: "전시실",
    intro:
      "다섯 개의 전시실이 건물 순서대로 놓여 있습니다. 박물관에 놓은 모든 것은 이 중 한 곳에 걸립니다.",
    collectionPrompt: "목록이 필요하신가요?",
    collectionLink: "컬렉션",
  },
  samples: {
    heading: "샘플 전시",
    body: "개발용 예시이며 컬렉션의 일부가 아닙니다. 샘플 전시 10점은 따로 표시되어 있어 언제든 함께 철회할 수 있습니다.",
    place: "샘플 전시 배치하기",
    placed: (count: number) => `${count}점의 샘플 전시를 배치했습니다.`,
    placeNoop: "샘플 전시는 이미 전시되어 있습니다.",
    withdraw: (count: number) => `샘플 전시 ${count}점 철회하기`,
    withdrawn: (count: number) => `샘플 전시 ${count}점을 철회했습니다.`,
    error: "샘플 전시를 변경하지 못했습니다.",
  },
  footer: {
    storage: "이 브라우저에만 보관됩니다",
    collection: "컬렉션",
  },
  notFound: {
    eyebrow: "전시되지 않음",
    title: "이 전시실에는 아무것도 걸려 있지 않습니다.",
    body: "요청한 페이지는 박물관에 없습니다. 철회되었거나 주소가 조금 다를 수 있습니다.",
    lobby: "로비로 돌아가기",
    everything: "전체 보기",
  },
  errors: {
    storage: "지금은 이 브라우저의 저장 공간에 접근할 수 없습니다.",
    storageHint:
      "시크릿 창에서는 박물관을 보관하지 못할 때가 있습니다. 일반 창에서 열면 보통 해결됩니다.",
  },
};

/** Every locale of Cuseum. Indexed by the locale itself. */
export const translations: Record<Locale, Translation> = { ko, en };

