export interface Kitchen {
  id: number;
  title: string;
  subtitle: string;
  short_content: string;
  long_content: string;
  slug: string;
}

export const kitchens: Kitchen[] = [
  {
    id: 0,
    title: "Parkside",
    subtitle: "A welcoming and modern kitchen with bespoke fittings throughout",
    short_content:
      "A labour of love, a lot of time and consideration and not to mention coffee went into drawing up the plan for this one.",
    long_content:
      "Everyone deserves a place to feel at home and a place they want to cook in",
    slug: "parkside",
  },
  {
    id: 1,
    title: "Riverside Manor",
    subtitle: "Contemporary elegance meets traditional craftsmanship",
    short_content:
      "This project brought together the best of both worlds - sleek modern appliances nestled within handcrafted oak cabinetry.",
    long_content:
      "From the initial consultation to the final reveal, this kitchen transformation took six months of careful planning and execution. The clients wanted a space that honored the heritage of their Victorian home while providing all the functionality of a modern kitchen.",
    slug: "riverside-manor",
  },
  {
    id: 2,
    title: "The Gatehouse",
    subtitle: "Compact luxury in a charming countryside cottage",
    short_content:
      "Sometimes the smallest spaces require the biggest creativity. Every inch of this kitchen was designed with purpose.",
    long_content:
      "Working within the constraints of a listed building meant getting inventive with storage solutions and lighting. The result is a kitchen that feels spacious despite its modest footprint, with custom pull-out pantries and integrated appliances throughout.",
    slug: "the-gatehouse",
  },
  {
    id: 3,
    title: "Oakwood Heights",
    subtitle: "A family kitchen designed for making memories",
    short_content:
      "With three young children and a passion for hosting, our clients needed a kitchen that could handle it all.",
    long_content:
      "This generous open-plan kitchen features a central island that serves as the heart of the home. Durable materials were chosen throughout to withstand daily family life, while soft-close mechanisms and rounded edges ensure safety for little ones.",
    slug: "oakwood-heights",
  },
  {
    id: 4,
    title: "Ashford Place",
    subtitle: "Industrial chic meets warm minimalism",
    short_content:
      "Exposed brick, concrete worktops, and brass fixtures create an urban sanctuary for a pair of keen home cooks.",
    long_content:
      "The brief was clear: a kitchen that felt like it belonged in a New York loft but worked in a converted mill in Lancashire. We sourced reclaimed materials where possible and paired them with state-of-the-art appliances for a look that's both timeless and cutting-edge.",
    slug: "ashford-place",
  },
  {
    id: 5,
    title: "Meadowview",
    subtitle: "Light, bright, and effortlessly stylish",
    short_content:
      "Large skylights flood this extension kitchen with natural light, making it the perfect spot for morning coffee.",
    long_content:
      "Our clients wanted their new kitchen extension to blur the lines between indoor and outdoor living. Bi-fold doors open onto the garden, while the soft sage and cream color palette brings a sense of calm and nature inside year-round.",
    slug: "meadowview",
  },
];
