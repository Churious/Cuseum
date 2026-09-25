import type { Exhibit } from "./types";

/** Fixed timestamps keep the sample set stable between reloads. */
function on(isoDate: string): number {
  return Date.parse(`${isoDate}T12:00:00Z`);
}

/**
 * Development sample exhibits.
 *
 * These are NOT part of the database schema and are never inserted
 * automatically. The visitor adds them from the lobby ("Place a few sample
 * exhibits"), and every record is flagged with `sample: true` so they can be
 * withdrawn again in one step. Artwork lives in /public/samples as SVG so the
 * set works offline.
 */
export const SAMPLE_EXHIBITS: readonly Exhibit[] = [
  {
    id: "sample-music-airports",
    title: "Ambient 1: Music for Airports",
    type: "music",
    room: "music",
    url: "https://en.wikipedia.org/wiki/Ambient_1:_Music_for_Airports",
    imageUrl: "/samples/airports.svg",
    description:
      "Brian Eno's record made for a place that is only ever waited in. Six loops, no beginning, no end.",
    personalNote:
      "I keep playing this in the half hour before a flight. It makes the airport feel like a room instead of a delay.",
    displayStyle: "poster",
    createdAt: on("2026-09-03"),
    sample: true,
  },
  {
    id: "sample-music-kankyo",
    title: "Kankyō Ongaku: Japanese Ambient, Environmental & New Age Music",
    type: "music",
    room: "music",
    url: "https://lightintheattic.net/releases/3826-kankyo-ongaku-japanese-ambient-environmental-new-age-music-1980-1990",
    imageUrl: "/samples/kankyo.svg",
    description:
      "A compilation of music written for showrooms, train stations, and television idents between 1980 and 1990.",
    personalNote: "Found it in a record shop in Busan and listened to the whole thing standing up.",
    displayStyle: "poster",
    createdAt: on("2026-09-11"),
    sample: true,
  },
  {
    id: "sample-web-ubuweb",
    title: "UbuWeb",
    type: "website",
    room: "web",
    url: "https://www.ubu.com/",
    imageUrl: "/samples/ubuweb.svg",
    description:
      "An enormous, deliberately unstyled archive of avant-garde film, sound, and concrete poetry.",
    personalNote:
      "The opposite of a designed product. Proof that a website can just be a door to a room full of things.",
    displayStyle: "screen",
    createdAt: on("2026-09-05"),
    sample: true,
  },
  {
    id: "sample-web-mjt",
    title: "The Museum of Jurassic Technology",
    type: "website",
    room: "web",
    url: "https://www.mjt.org/",
    imageUrl: "/samples/mjt.svg",
    description:
      "A museum in Los Angeles where the exhibits sit somewhere between scholarship and fiction.",
    personalNote: "The website is dim and slow in exactly the right way.",
    displayStyle: "screen",
    createdAt: on("2026-09-19"),
    sample: true,
  },
  {
    id: "sample-image-vivian-maier",
    title: "Vivian Maier, street photographs",
    type: "image",
    room: "images",
    url: "https://www.vivianmaier.com/",
    imageUrl: "/samples/photograph.svg",
    description:
      "Rolls of film found in a storage locker after her death. A century of strangers, seen kindly.",
    personalNote: "The square format and the low angle. I look at these when I want to go outside.",
    displayStyle: "frame",
    createdAt: on("2026-09-07"),
    sample: true,
  },
  {
    id: "sample-image-seascapes",
    title: "Seascapes",
    type: "image",
    room: "images",
    url: "https://www.sugimotohiroshi.com/",
    imageUrl: "/samples/seascape.svg",
    description:
      "Hiroshi Sugimoto's horizon line, photographed in the same six minutes of light everywhere on earth.",
    personalNote: "A single line dividing the frame in two. Nothing else is needed.",
    displayStyle: "frame",
    createdAt: on("2026-09-21"),
    sample: true,
  },
  {
    id: "sample-object-et66",
    title: "Braun ET66 calculator",
    type: "object",
    room: "objects",
    url: "https://en.wikipedia.org/wiki/Dieter_Rams",
    imageUrl: "/samples/et66.svg",
    description:
      "Dieter Rams' pocket calculator. The buttons are the colour of what they do.",
    personalNote: "The object that taught me that a surface can explain itself.",
    displayStyle: "object",
    createdAt: on("2026-09-09"),
    sample: true,
  },
  {
    id: "sample-object-tps-l2",
    title: "Sony Walkman TPS-L2",
    type: "object",
    room: "objects",
    url: "https://en.wikipedia.org/wiki/Walkman",
    imageUrl: "/samples/tps-l2.svg",
    description:
      "Two headphone jacks, one hotline button for sharing. The first machine that made listening private and public at once.",
    personalNote: "I would put this on a plinth next to the calculator and let them talk.",
    displayStyle: "object",
    createdAt: on("2026-09-16"),
    sample: true,
  },
  {
    id: "sample-archive-whole-earth",
    title: "Whole Earth Catalog",
    type: "memory",
    room: "archive",
    url: "https://wholeearth.info/",
    imageUrl: "/samples/whole-earth.svg",
    description:
      "A mail-order catalog of tools and ideas, described by its editor as a way to do your own thing better.",
    personalNote: "The original internet, printed on newsprint and mailed to a farm.",
    displayStyle: "document",
    createdAt: on("2026-09-13"),
    sample: true,
  },
  {
    id: "sample-memory-gyeongju",
    title: "A summer afternoon in Gyeongju",
    type: "memory",
    room: "archive",
    url: "",
    imageUrl: "",
    description: "The sound of a sprinkler, a paper ticket, and the shade of a very old tree.",
    personalNote: "Nothing to link to. I just wanted some place in the museum to keep it.",
    displayStyle: "document",
    createdAt: on("2026-09-24"),
    sample: true,
  },
];
