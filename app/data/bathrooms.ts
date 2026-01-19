export interface Bathroom {
  id: number;
  title: string;
  subtitle: string;
  short_content: string;
  long_content: string;
  features: string[];
  slug: string;
  images: string[];
  completionDate: string;
  location: string;
}

export const bathrooms: Bathroom[] = [
  {
    id: 0,
    title: "Willowbrook Spa",
    subtitle: "Luxury wetroom with rainfall shower and underfloor heating",
    short_content:
      "Transform your daily routine into a spa experience with this stunning wetroom conversion featuring premium fixtures and bespoke tiling.",
    long_content:
      "This complete bathroom renovation turned a dated en-suite into a luxurious wetroom sanctuary. Working closely with the clients, we designed a space that maximized natural light while incorporating high-end fixtures throughout. The large format porcelain tiles create a seamless look from floor to ceiling, while the bespoke glass screen keeps the space feeling open and airy. Underfloor heating ensures comfort year-round, and the rainfall shower with body jets provides that hotel-luxury feel at home.",
    features: [
      "Walk-in wetroom design",
      "Rainfall shower with body jets",
      "Underfloor heating throughout",
      "Large format porcelain tiles",
      "Bespoke frameless glass screen",
      "LED mood lighting",
      "Heated towel rail",
    ],
    slug: "willowbrook-spa",
    images: [
      "/images/bathrooms/willowbrook-1.jpg",
      "/images/bathrooms/willowbrook-2.jpg",
      "/images/bathrooms/willowbrook-3.jpg",
      "/images/bathrooms/willowbrook-4.jpg",
    ],
    completionDate: "March 2024",
    location: "Ribble Valley, Lancashire",
  },
  {
    id: 1,
    title: "Victorian Elegance",
    subtitle:
      "Period features meet modern convenience in this heritage restoration",
    short_content:
      "Respecting the original character of a Grade II listed property while adding all the comforts of contemporary living.",
    long_content:
      "This project required careful planning and approval from conservation officers to ensure we honored the building's heritage. We sourced period-appropriate fixtures including a stunning roll-top bath and traditional basin taps, while discreetly integrating modern plumbing and heating systems. The metro tiles and black-and-white floor tiles are faithful reproductions of Victorian designs, while hidden LED lighting and a concealed cistern provide modern functionality. The result is a bathroom that feels authentically period while offering all the reliability and efficiency of 21st-century engineering.",
    features: [
      "Restored original sash window",
      "Cast iron roll-top bath with ball feet",
      "Traditional basin with chrome taps",
      "Metro tile walls with contrasting grout",
      "Black and white checkerboard floor tiles",
      "Period-style radiator",
      "Concealed cistern with traditional chain pull",
      "Marble countertop",
    ],
    slug: "victorian-elegance",
    images: [
      "/images/bathrooms/victorian-1.jpg",
      "/images/bathrooms/victorian-2.jpg",
      "/images/bathrooms/victorian-3.jpg",
    ],
    completionDate: "November 2023",
    location: "Lancaster City Centre",
  },
  {
    id: 2,
    title: "Coastal Retreat",
    subtitle: "Light and airy family bathroom inspired by seaside living",
    short_content:
      "Soft blues, natural textures, and plenty of storage make this the perfect family bathroom for a busy household.",
    long_content:
      "With three children and limited space, our clients needed a bathroom that was both practical and calming. We chose a palette of soft blues and warm whites to create that coastal feel, paired with natural oak accents for warmth. A custom-built vanity unit provides ample storage for all the family's toiletries, while the large mirror makes the most of the natural light. The bath-shower combination saves space without compromising on functionality, and non-slip tiles throughout ensure safety for younger family members. Clever storage solutions, including a recessed medicine cabinet and corner shelving, keep the space clutter-free.",
    features: [
      "Custom oak vanity unit with soft-close drawers",
      "Bath-shower combination with glass screen",
      "Coastal blue and white tile scheme",
      "Chrome rainfall shower head",
      "Recessed medicine cabinet with mirror",
      "Built-in corner shelving",
      "Non-slip ceramic floor tiles",
      "Window roller blind with moisture-resistant fabric",
    ],
    slug: "coastal-retreat",
    images: [
      "/images/bathrooms/coastal-1.jpg",
      "/images/bathrooms/coastal-2.jpg",
      "/images/bathrooms/coastal-3.jpg",
      "/images/bathrooms/coastal-4.jpg",
      "/images/bathrooms/coastal-5.jpg",
    ],
    completionDate: "June 2024",
    location: "Morecambe",
  },
  {
    id: 3,
    title: "Urban Industrial",
    subtitle: "Exposed brick and concrete create an edgy city loft aesthetic",
    short_content:
      "Bold design choices and raw materials transform a compact cloakroom into a statement space.",
    long_content:
      "This downstairs cloakroom renovation embraced the industrial aesthetic of the converted warehouse apartment. We exposed and sealed the original brick wall, paired it with polished concrete-effect tiles, and added black matte fixtures for maximum impact. The wall-hung toilet and basin keep the floor clear, making the small space feel larger. Edison-style filament bulbs and copper pipe details add warmth to the industrial materials, while the large circular mirror becomes a focal point. Despite its compact size, this cloakroom packs a serious design punch and never fails to impress visitors.",
    features: [
      "Exposed brick feature wall",
      "Polished concrete-effect floor tiles",
      "Matte black fixtures throughout",
      "Wall-hung toilet and basin",
      "Copper pipe towel rail",
      "Edison bulb lighting",
      "Large circular mirror with black frame",
      "Industrial-style tap",
    ],
    slug: "urban-industrial",
    images: [
      "/images/bathrooms/urban-1.jpg",
      "/images/bathrooms/urban-2.jpg",
      "/images/bathrooms/urban-3.jpg",
    ],
    completionDate: "February 2024",
    location: "Preston Docklands",
  },
  {
    id: 4,
    title: "Scandi Minimalist",
    subtitle:
      "Clean lines and natural materials create a serene Scandinavian sanctuary",
    short_content:
      "Less is more in this beautifully restrained bathroom where every element serves both form and function.",
    long_content:
      "Inspired by Scandinavian design principles, this bathroom renovation focused on simplicity, functionality, and natural materials. We kept the color palette neutral with soft grays and warm wood tones, allowing the quality of the materials to shine. The freestanding bath sits beneath a skylight, flooding the space with natural light. Matte white tiles cover the walls, while pale oak flooring adds warmth underfoot. Hidden storage keeps surfaces clear, and the floating vanity creates a sense of space. Plants and natural textures soften the minimalist aesthetic, making the room feel welcoming rather than stark. Every fixture was chosen for its clean lines and quality craftsmanship.",
    features: [
      "Freestanding oval bath beneath skylight",
      "Pale oak engineered wood flooring",
      "Matte white wall tiles",
      "Floating oak vanity with integrated basin",
      "Frameless walk-in shower enclosure",
      "Concealed storage with push-to-open drawers",
      "Chrome fixtures with minimal design",
      "Wall-mounted toilet",
      "Natural plants and greenery",
    ],
    slug: "scandi-minimalist",
    images: [
      "/images/bathrooms/scandi-1.jpg",
      "/images/bathrooms/scandi-2.jpg",
      "/images/bathrooms/scandi-3.jpg",
      "/images/bathrooms/scandi-4.jpg",
    ],
    completionDate: "August 2024",
    location: "Clitheroe",
  },
  {
    id: 5,
    title: "Art Deco Revival",
    subtitle:
      "Geometric patterns and metallic accents bring 1920s glamour to life",
    short_content:
      "Step back in time with this show-stopping Art Deco-inspired bathroom featuring bold patterns and luxe finishes.",
    long_content:
      "Our clients fell in love with the Art Deco period after visiting several heritage hotels, and wanted to recreate that sense of glamour in their own home. We designed a bathroom that captures the opulence of the 1920s while incorporating modern comforts. The centerpiece is a stunning geometric floor tile pattern in black, white, and gold, complemented by metro tiles arranged in a classic brick pattern with black grout. A clawfoot bath painted in navy sits proudly in the center of the room, while gold fixtures add that essential touch of luxury. The vanity unit features fluted detailing, and the large beveled mirror is framed with Art Deco-style wall sconces. Rich navy paint on the lower walls creates drama and depth.",
    features: [
      "Geometric Art Deco floor tiles",
      "Navy painted clawfoot bath with gold feet",
      "Gold fixtures and fittings throughout",
      "Metro tile walls with black grout",
      "Fluted vanity unit with marble top",
      "Beveled edge mirror",
      "Art Deco wall sconces",
      "Navy wainscoting on lower walls",
      "Chrome and glass shower enclosure",
    ],
    slug: "art-deco-revival",
    images: [
      "/images/bathrooms/artdeco-1.jpg",
      "/images/bathrooms/artdeco-2.jpg",
      "/images/bathrooms/artdeco-3.jpg",
      "/images/bathrooms/artdeco-4.jpg",
      "/images/bathrooms/artdeco-5.jpg",
    ],
    completionDate: "October 2023",
    location: "Lytham St Annes",
  },
];
