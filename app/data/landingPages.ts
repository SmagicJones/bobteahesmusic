import type { StringToBoolean } from "class-variance-authority/types";

export interface LandingPage {
  id: number;
  title: string;
  intro: string;
  img_url: string;
  img_alt: string;
  comment: string;
  slug: string;
  link: string;
}

export const landingPages: LandingPage[] = [
  {
    id: 11,
    title: "Filamentive",
    intro: "A landing page for Filamentive Filaments",
    img_url: "/images/filamentive-logo.svg",
    img_alt: "Filamentive Logo",
    comment:
      "A landing page for filamentive filaments.  I am pleased with this page - how it looks to the eye and under the surface how tidy the code is. It is likely one of the tidiest pages - codewise - on the entire site",
    slug: "filamentive-landing-page",
    link: "https://3dgbire.com/pages/filamentive",
  },
  {
    id: 0,
    title: "Bambu Range",
    intro: "Landing page for Bambu Lab 3D Printers",
    img_url: "/images/bambu-landing.jpg",
    img_alt: "A Bambu Lab 3D printer",
    comment:
      "A Landing page in keeping with the rest of the site for Bambu Lab 3D Printers",
    slug: "bambu-landing-page",
    link: "https://www.createeducation.com/bambu-range/",
  },
  {
    id: 1,
    title: "Creality Range",
    intro: "Landing page for Creality 3D Printers",
    img_url: "/images/creality-landing.webp",
    img_alt: "Creality K2 Plus Combo 3D Printer",
    comment:
      "A Landing page for Creality - a new brand to the company -  in keeping with the rest of the site and produced with very few resources",
    slug: "creality-landing-page",
    link: "https://3dgbire.com/pages/creality",
  },
  {
    id: 2,
    title: "UltiMaker Range",
    intro: "Landing page for UltiMaker 3D Printers",
    img_url: "/images/s6-landing.webp",
    img_alt: "UltiMaker S6 3D Printer",
    comment:
      "A Landing page for UltiMaker 3D Printers that also reflects the rest of the site",
    slug: "ultimaker-landing-page",
    link: "https://www.createeducation.com/ultimaker-range/",
  },
  {
    id: 3,
    title: "Tectonic Materials",
    intro: "Landing page for Tectonic Materials",
    img_url: "/images/tectonic-landing.webp",
    img_alt: "UltiMaker S6 3D Printer",
    comment:
      "A Landing page for Tectonic Materials - here I've aimed to take elements of Tectonic's style on their site to better represent them whilst also making a page that is in keeping with the rest of the site.",
    slug: "tectonic-landing-page",
    link: "https://3dgbire.com/pages/tectonic",
  },
];
