// Status shown on every project: the label, and whether its dot reads as live, award or quiet.
export const STATUS = {
  shipped: { label: "Shipped", tone: "live" },
  building: { label: "Building", tone: "build" },
  live: { label: "Live demo", tone: "live" },
  finalist: { label: "Finalist", tone: "award" },
  thesis: { label: "Thesis, A+", tone: "quiet" },
  coursework: { label: "Coursework", tone: "quiet" },
} as const;

export const EMAIL = "muftasimhossain@gmail.com";
export const GITHUB = "https://github.com/sayem-112";
export const LINKEDIN = "https://www.linkedin.com/in/mofftasim-hossain-sayem";
export const CV = "/cv/Mofftasim_Hossain_Sayem_CV.pdf";

// Photos for the dithered frame, all NASA public domain; swap the files in public/frame.
// The caption is read by screen readers only.
export const FRAME_PHOTOS = [
  { src: "/frame/carina.webp", caption: "The Cosmic Cliffs of the Carina Nebula, from the James Webb Space Telescope" },
  { src: "/frame/pillars.webp", caption: "The Pillars of Creation, from Hubble" },
  { src: "/frame/moon.webp", caption: "The full Moon" },
  { src: "/frame/crab.webp", caption: "The Crab Nebula, from Hubble" },
  { src: "/frame/blue-marble.webp", caption: "Earth, the Blue Marble" },
  { src: "/frame/andromeda.webp", caption: "The Andromeda Galaxy" },
  { src: "/frame/deep-field.webp", caption: "Thousands of distant galaxies in a Hubble deep field" },
];
