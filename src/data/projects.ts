/* Work page. Titles describe what the photographs show; nothing here claims a location,
   a date, a material species or a scope the source material does not give.
   The first image of each project is the lead: it has a drawing (<src>-line.webp) and is
   cut in from that drawing when the row scrolls into view. `ar` is width/height. */
export type Shot = { src: string; ar: string; alt: string; cap?: string };
export type Project = { no: string; title: string; type: "residential" | "commercial"; tags: string; desc: string; shots: Shot[] };

const L = "3/2", P = "2/3";

export const projects: Project[] = [
  {
    no: "A-101", title: "Black-and-oak kitchen", type: "residential", tags: "Residential · Kitchen, powder room",
    desc: "Handle-free fronts in black and white under a run of pale wood uppers, with a full-height veined backsplash and an island that seats four.",
    shots: [
      { src: "kitchen", ar: L, alt: "Kitchen seen straight on: a long black island with four stools, white base cabinets and pale wood uppers" },
      { src: "kitchen-p", ar: P, alt: "White handle-free drawer bank under a pale wood canopy with a veined slab backsplash" },
      { src: "kitchen-3", ar: L, alt: "The island from the end, with black tall cabinets and integrated appliances behind" },
      { src: "powder", ar: P, alt: "Powder room with a stone trough vanity on a pale wood cabinet and full-height wood panelling" },
      { src: "powder-2", ar: P, alt: "The stone trough vanity seen from the door" },
    ],
  },
  {
    no: "A-102", title: "Classic cream kitchen", type: "residential", tags: "Residential · Kitchen",
    desc: "Raised-panel cabinetry with fluted pilasters, fretwork glass doors, a carved mantel hood and a dark stained island on carved corbels.",
    shots: [
      { src: "classic", ar: P, alt: "Cream raised-panel kitchen with fretwork glass upper doors and a carved hood" },
      { src: "classic-2", ar: P, alt: "Carved corbel on the dark stained island" },
      { src: "classic-3", ar: P, alt: "The island with pendant lights and the integrated appliance wall beyond" },
      { src: "classic-4", ar: P, alt: "Integrated refrigerator panels beside a stacked oven tower" },
      { src: "classic-5", ar: P, alt: "The kitchen seen from the dining table" },
    ],
  },
  {
    no: "A-103", title: "The white suite", type: "residential", tags: "Residential · Wardrobe, kitchen, vanity",
    desc: "Mirrored wardrobe doors overlaid with painted fretwork, a stone-wrapped kitchen peninsula, an open display tower and a reeded vanity.",
    shots: [
      { src: "wardrobe", ar: L, alt: "Bedroom with a wall of mirrored fretwork wardrobe doors" },
      { src: "wardrobe-p", ar: P, alt: "The run of mirrored fretwork doors seen along its length" },
      { src: "marble", ar: P, alt: "Stone-wrapped peninsula in a white kitchen" },
      { src: "suite-4", ar: P, alt: "Open pale wood display tower with a wine fridge at the end of the kitchen" },
      { src: "suite-5", ar: P, alt: "Reeded vanity with a framed mirror" },
      { src: "suite-6", ar: P, alt: "Bedroom with built-in cabinets over the window wall" },
    ],
  },
  {
    no: "A-104", title: "Library wall", type: "residential", tags: "Residential · Built-ins",
    desc: "Painted built-ins either side of a fireplace, with coloured backs, glazed lower doors and a matching unit on the return wall.",
    shots: [
      { src: "library", ar: L, alt: "Painted built-in bookcases with blue backs either side of a fireplace and television" },
      { src: "library-2", ar: "2000/1385", alt: "The built-ins seen square on" },
      { src: "library-p", ar: P, alt: "The matching bookcase on the return wall" },
    ],
  },
  {
    no: "A-105", title: "Snug Harbour", type: "commercial", tags: "Commercial · Restaurant",
    // CONFIRM: exactly which elements of the restaurant Selections built
    desc: "Bar and dining room millwork for the Snug Harbour restaurant.",
    shots: [
      { src: "harbour", ar: L, alt: "The long bar at Snug Harbour with stools and a lit back bar" },
      { src: "harbour-2", ar: L, alt: "Dining room at Snug Harbour with a stone feature wall" },
      { src: "harbour-3", ar: L, alt: "Dining room at Snug Harbour looking toward the water" },
    ],
  },
  {
    no: "A-106", title: "Grey loft kitchen", type: "residential", tags: "Residential · Kitchen",
    desc: "A compact kitchen in matte grey and stainless steel, with flush wall panelling that keeps the storage out of sight.",
    shots: [
      { src: "loft", ar: L, alt: "Compact grey kitchen with stainless appliances and a steel island" },
      { src: "loft-2", ar: L, alt: "Flush grey wall panelling with a recessed niche" },
      { src: "loft-3", ar: L, alt: "The kitchen seen from the sofa" },
      { src: "loft-4", ar: L, alt: "Hallway lined with flush grey panels" },
    ],
  },
  {
    no: "A-107", title: "Floating vanity", type: "residential", tags: "Residential · Bathroom",
    desc: "A wall-hung vanity with under-lighting, fluted side panels and a lit display tower.",
    shots: [
      { src: "vanity", ar: "4/3", alt: "Wall-hung dark wood vanity with a backlit mirror, fluted panels and a lit shelf tower" },
      { src: "vanity-concept", ar: "1195/896", alt: "Concept render of a bathroom with a fluted vanity and lit shelf tower", cap: "Concept render" },
    ],
  },
  {
    no: "A-108", title: "Retail and office fixtures", type: "commercial", tags: "Commercial · From the archive",
    desc: "Earlier commercial work: a lit display wall, curved showcase plinths and an office storage wall.",
    shots: [
      { src: "archive-1", ar: "2166/1380", alt: "Wood display wall with lit glass shelves in a shop" },
      { src: "archive-3", ar: L, alt: "Curved wood and steel showcase plinths in a shop window" },
      { src: "archive-2", ar: L, alt: "Office storage wall with open and glazed compartments" },
    ],
  },
];
