/**
 * EditMorph — Centralized Testimonial Wall Data
 * 
 * Each item maps to a card rendered in the 3-column vertical sliding wall.
 * All testimonials are written for talking-head video editing clients
 * (creators, personal brands, coaches, entrepreneurs, and businesses).
 */
const EDITMORPH_TESTIMONIALS = [
  // Column 1 (Scrolls Upward)
  {
  "column": 1,
  "avatar": "Clients/avatars/Devin.png",
  "name": "Devin",
  "label": "Content Creator • Sample Review",
  "headline": "The pacing and hook editing completely changed my retention graph.",
  "message": "\"Before working with EditMorph, my videos dropped viewers in the first 5 seconds. Their tight jump cuts, audio punch-ins, and visual hooks keep people watching all the way through.\""
},
  {
  "column": 1,
  "avatar": "Clients/avatars/Mota.png",
  "name": "Sarvesh",
  "label": "Entrepreneur • Sample Review",
  "headline": "Finally found editors who understand personal brand storytelling.",
  "message": "\"They don't just add random captions and zoom effects. Every cut, relevant B-roll insert, and sound accent actually supports the core message I'm sharing.\""
},
  {
  "column": 1,
  "avatar": "Clients/avatars/Paritosh.png",
  "name": "Paritosh",
  "label": "Founder • Sample Review",
  "headline": "Saves me 15+ hours every week on recording and editing.",
  "message": "\"I just batch record my raw takes, upload the footage to Google Drive, and receive polished, ready-to-publish vertical videos in 48 hours. The workflow is friction-free.\""
},
  {
  "column": 1,
  "avatar": "Clients/avatars/Sonny.png",
  "name": "Sonny",
  "label": "Tech Creator • Sample Review",
  "headline": "Clean jump cuts, crisp audio leveling, and dynamic typography.",
  "message": "\"The typography styling and kinetic captions match my brand aesthetic seamlessly. The background noise is cleaned up, voice is crisp, and the color grading looks high-end.\""
},

  // Column 2 (Scrolls Downward)
  {
  "column": 2,
  "avatar": "Clients/avatars/Prateek.png",
  "name": "Prateek",
  "label": "Agency Owner • Sample Review",
  "headline": "Turnaround times and Slack communication are remarkably reliable.",
  "message": "\"Feedback turnaround is prompt and edits come back dialed in. Having a dedicated team that consistently delivers high-quality talking-head edits has been huge for our cadence.\""
},
  {
  "column": 2,
  "avatar": "Clients/avatars/Shweena.png",
  "name": "Shweena",
  "label": "Coach & Consultant • Sample Review",
  "headline": "My talking-head Reels feel engaging without feeling overwhelming.",
  "message": "\"A lot of editors overdo the flashing emojis and sound effects. EditMorph strikes the right balance between high engagement and a clean, credible aesthetic.\""
},
  {
  "column": 2,
  "avatar": "Clients/avatars/Devin.png",
  "name": "Devin",
  "label": "Creative Director • Sample Review",
  "headline": "Seamless B-roll integration that brings abstract points to life.",
  "message": "\"Whenever I explain complex frameworks, their team finds the right contextual B-roll, on-screen callouts, and graphics to make the explanation easy to follow.\""
},
  {
  "column": 2,
  "avatar": "Clients/avatars/Mota.png",
  "name": "Sarvesh",
  "label": "Personal Brand • Sample Review",
  "headline": "Consistent delivery without compromising on audio or visual polish.",
  "message": "\"Posting regularly used to burn me out. With EditMorph handling the entire post-production pipeline, our content quality stays consistently professional every single week.\""
},

  // Column 3 (Scrolls Upward)
  {
  "column": 3,
  "avatar": "Clients/avatars/Paritosh.png",
  "name": "Paritosh",
  "label": "Educator • Sample Review",
  "headline": "Attention-grabbing openings that stop the scroll immediately.",
  "message": "\"The first three seconds matter most. Their editors consistently craft strong opening sequences with title overlays, quick visual hooks, and punchy timing.\""
},
  {
  "column": 3,
  "avatar": "Clients/avatars/Prateek.png",
  "name": "Prateek",
  "label": "Business Coach • Sample Review",
  "headline": "Polished color grading and balanced sound design across every cut.",
  "message": "\"Lighting variations between my takes used to be noticeable. They color balance everything, enhance voice clarity, and layer subtle sound design that feels cinematic.\""
},
  {
  "column": 3,
  "avatar": "Clients/avatars/Shweena.png",
  "name": "Shweena",
  "label": "Content Strategist • Sample Review",
  "headline": "Helped elevate our personal brand into an authoritative presence.",
  "message": "\"High production quality immediately builds trust with our audience. The editing speaks for itself—clean, purposeful, and modern.\""
},
  {
  "column": 3,
  "avatar": "Clients/avatars/Sonny.png",
  "name": "Sonny",
  "label": "Online Creator • Sample Review",
  "headline": "Predictable workflow, clear revision loops, and dependable results.",
  "message": "\"No chasing freelancers or missing deadlines. Working with a dedicated creative editing partner has simplified our entire video production process.\""
}
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EDITMORPH_TESTIMONIALS };
}
