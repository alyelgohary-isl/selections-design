/* Named on the client's current site under "Trusted by top Canadian brands", which also shows their logos.
   Logo files are in public/assets/logos/. `h` is a relative display height (1 = standard), so wide wordmarks
   and tall crests read at a similar weight.
   CONFIRM: permission to display each organisation's logo, and replace these with files the client supplies:
   several are low-resolution copies from public sources. */
export const clients = [
  { name: "University of Toronto", sector: "Education", logo: "uoft.png", h: 1.35 },
  { name: "Toronto Metropolitan University", sector: "Education", logo: "tmu.svg", h: 1.05 },
  { name: "Dufferin-Peel Catholic District School Board", sector: "Education", logo: "dpcdsb.png", h: 1 },
  { name: "Metrolinx", sector: "Transit", logo: "metrolinx.svg", h: 0.42 },
  { name: "City of Mississauga", sector: "Municipal", logo: "mississauga.svg", h: 1 },
  { name: "City of Brampton", sector: "Municipal", logo: "brampton.png", h: 0.8 },
  { name: "Snug Harbour", sector: "Restaurant", logo: "snug-harbour.png", h: 1.3 },
  { name: "Hero Certified Burgers", sector: "Restaurant", logo: "hero.png", h: 1.3 },
  { name: "Mucho Burrito", sector: "Restaurant", logo: "mucho-burrito.png", h: 1.35 },
  { name: "Baskin Robbins", sector: "Restaurant", logo: "baskin-robbins.svg", h: 1.2 },
];
