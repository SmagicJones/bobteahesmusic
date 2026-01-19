export interface Feature {
  id: number;
  title: string;
  intro: string;
  img_url: string;
  img_alt: string;
  comment: string;
  slug: string;
  link1: string;
  link2: string;
}

export const features: Feature[] = [
  {
    id: 0,
    title: "Finance Calculator",
    intro: "A finance calculator to help you work out your monthly payments",
    img_url: "/images/finance-calc.jpg",
    img_alt: "Finance Calculator",
    comment:
      "This is a finance calculator that I created for a client, it allows users to calculate their monthly payments based on the amount they want to borrow, the interest rate, and the term of the loan.",
    slug: "finance-calculator",
    link1: "https://3dgbire.com/pages/finance-your-machine",
    link2: "https://3dgbire.com/products/ultimaker-s8-pro-bundle",
  },
];
