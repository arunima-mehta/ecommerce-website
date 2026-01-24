import { Testimonials } from "./ui/testimonials"

const testimonials = [
  {
    image: '/new_frontend_assets/about_pfp.png',
    text: '"The pieces feel thoughtfully designed and easy to wear. Everything fits naturally into my wardrobe without feeling overdone."',
    name: "Alice Johnson",
    //username: "@alicejohnson",
    //social: "https://twitter.com",
  },
  {
    image: '/new_frontend_assets/about_pfp.png',
    text: '"The quality and attention to detail really stand out. These are pieces I find myself reaching for often."',
    name: "David Smith",
    //username: "@davidsmith",
    //social: "https://twitter.com",
  },
  {
    image: '/new_frontend_assets/about_pfp.png',
    text: '"Clean design, comfortable fits, and a refined feel throughout. The collection feels confident without being loud."',
    name: "Emma Brown",
    //username: "@emmabrown",
    //social: "https://twitter.com",
  },
  {
    image: '/new_frontend_assets/about_pfp.png',
    text: '"What I appreciate most is the consistency across collections. Each piece feels intentional and well considered."',
    name: "James Wilson",
    //username: "@jameswilson",
    //social: "https://twitter.com",
  },
  {
    image: '/new_frontend_assets/about_pfp.png',
    text: '"The designs feel current without chasing trends. There’s a quiet confidence in how everything is put together."',
    name: "Sophia Lee",
    //username: "@sophialee",
    //social: "https://twitter.com",
  },
  {
    image: '/new_frontend_assets/about_pfp.png',
    text: '"Versatile, well-made pieces that work across different settings. Styling feels effortless."',
    name: "Michael Davis",
    //username: "@michaeldavis",
    //social: "https://twitter.com",
  }
]

export function TestimonialsSection() {
  return (
    <div className="container py-10">
      <Testimonials testimonials={testimonials} />
    </div>
  )
}
