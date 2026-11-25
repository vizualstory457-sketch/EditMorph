/**
 * EditMorph — Centralized Testimonial Wall Data
 * 
 * Edit this array to update, add, or replace client testimonials on the animated wall.
 * Each item maps to a card rendered in the 3-column vertical sliding wall.
 */
const EDITMORPH_TESTIMONIALS = [
  // Column 1 (Scrolls Upward)
  {
    column: 1,
    avatar: 'Clients/Devin.png',
    name: 'Devin Vance',
    label: 'EditMorph Client • Sample Review',
    headline: 'Our listing Reels finally look like high-end architectural cinema.',
    message: 'Before EditMorph, our turnaround times were killing our momentum. Now every property walkthrough is cut, color graded, and delivered ready to post in 48 hours.'
  },
  {
    column: 1,
    avatar: 'Clients/Dib.png',
    name: 'Marcus Reynolds',
    label: 'Luxury Broker • Sample Review',
    headline: 'Consistency is everything in luxury real estate branding.',
    message: '15 polished Reels every month without touching Premiere Pro once. Our inbound seller inquiries jumped noticeably within the first 60 days.'
  },
  {
    column: 1,
    avatar: 'Clients/Mota.png',
    name: 'Julian Mota',
    label: 'Content Creator • Sample Review',
    headline: 'The pacing and sound design feel like a million-dollar production.',
    message: 'Buyers notice the difference immediately. The sound design, dynamic zooms, and clean typography elevate every single property we film.'
  },
  {
    column: 1,
    avatar: 'Clients/Paritosh.png',
    name: 'Paritosh Sharma',
    label: 'Real Estate Agent • Sample Review',
    headline: 'Saved me at least 25 hours every single week.',
    message: 'I used to spend late nights trying to edit Reels myself. Outsourcing the entire pipeline to EditMorph freed me to focus on closing deals.'
  },

  // Column 2 (Scrolls Downward)
  {
    column: 2,
    avatar: 'Clients/Prateek.png',
    name: 'Prateek Mehta',
    label: 'Agency Founder • Sample Review',
    headline: 'The fastest revisions and smoothest Slack communication.',
    message: 'Feedback turnaround is practically instant. The team understands architectural framing, pacing, and what hooks viewers in the first 3 seconds.'
  },
  {
    column: 2,
    avatar: 'Clients/Shweena.png',
    name: 'Shweena Patel',
    label: 'Realtor • Sample Review',
    headline: 'Our Instagram engagement doubled within two months.',
    message: "Real estate content is crowded, but EditMorph's signature edits make our portfolio stand out on the Explore page every week."
  },
  {
    column: 2,
    avatar: 'Clients/Sonny.png',
    name: 'Sonny Chen',
    label: 'Commercial Developer • Sample Review',
    headline: 'A long-term creative partnership that actually delivers.',
    message: "They don't just cut clips—they build a cohesive brand identity for every development project we launch. Irreplaceable asset for our team."
  },
  {
    column: 2,
    avatar: 'Clients/Devin.png',
    name: 'Elena Rostova',
    label: 'Real Estate Group • Sample Review',
    headline: 'From raw iPhone/drone clips to viral-ready property showcases.',
    message: 'We film on location, upload our footage to Google Drive, and wake up to finished Reels that look like Netflix mini-docs.'
  },

  // Column 3 (Scrolls Upward)
  {
    column: 3,
    avatar: 'Clients/Dib.png',
    name: 'David Thorne',
    label: 'Residential Broker • Sample Review',
    headline: 'Turned our stale listings into high-converting video tours.',
    message: 'Sellers love seeing their homes featured in premium 4K vertical edits. It has become our strongest listing presentation pitch.'
  },
  {
    column: 3,
    avatar: 'Clients/Mota.png',
    name: 'Chloe Bennett',
    label: 'Real Estate Influencer • Sample Review',
    headline: 'The color grading alone is worth the subscription.',
    message: 'Golden hour skies, interior balancing, and true-to-life greens. The visual fidelity in their color grade is unmatched.'
  },
  {
    column: 3,
    avatar: 'Clients/Paritosh.png',
    name: 'Ryan Gallagher',
    label: 'Investment Firm • Sample Review',
    headline: 'Zero headaches, predictable delivery, outstanding quality.',
    message: 'Having a dedicated team of editors who specialize specifically in real estate video makes all the difference. Highly recommend.'
  },
  {
    column: 3,
    avatar: 'Clients/Prateek.png',
    name: 'Nathan Wu',
    label: 'Managing Broker • Sample Review',
    headline: 'The best investment we made in our digital presence this year.',
    message: 'Our properties get more eyes, our agents look top-tier, and our client retention is at an all-time high. Outstanding workflow.'
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EDITMORPH_TESTIMONIALS };
}
