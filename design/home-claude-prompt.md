PASTE EVERYTHING BELOW THIS LINE INTO CLAUDE DESIGN (claude.ai/design)
=======================================================================

Design a modern, award-quality HOMEPAGE for COODU Trust — a rural-development NGO in Dindigul, Tamil Nadu, working since 2000 in women empowerment, environment, agriculture, education, and health/sanitation.

Give me THREE polished, self-contained designs of the same page: DESKTOP (>=1200px), TABLET (~800px), and MOBILE (~390px). Use the latest front-end techniques and tasteful, cool motion (specified below). Use the REAL images linked at the very bottom — not grey boxes.

────────────────────────────────────────
BRAND / STYLE
────────────────────────────────────────
• Mood: grounded, trustworthy, warm, modern. Credible NGO — confident, not flashy, human.
• Colors: primary green #1e7e34, dark green #155d27, deep green #11371b; DONATE accent = orange #e8590c (ONLY on Donate); amber #f4a300 for tiny eyebrow labels; surfaces white #ffffff + soft-green #f6f8f6 (alternate sections); footer/dark bands deep green/near-black; text #1a1f1a / body #3d433d / muted #6b726b; hairline border #e2e8e2.
• Type: headings "Oswald" (title case, 600/700), body "Source Sans 3" (400/600), line-height 1.6. STRICT: sentence case for body — NO all-caps paragraphs (caps only on tiny eyebrow labels with letter-spacing).
• Shape: cards white w/ 1px hairline + 12px radius + soft shadow; buttons 8px radius, 44px min height; pills 999px. Generous whitespace, max content width ~1140px.
• Icons: Lucide line icons, single color.

────────────────────────────────────────
USE THE LATEST TECH (build-ready, modern, fast)
────────────────────────────────────────
• Fully fluid responsive: CSS clamp() type scale, CSS Grid with auto-fit/minmax, aspect-ratio for media, flexbox; container queries where they help. One responsive page, breakpoints ~600 / 900 / 1200.
• Sticky header that subtly shrinks/condenses on scroll.
• Scroll-driven reveal animations (CSS scroll-timeline / IntersectionObserver). Use the View Transitions API for smooth state/page changes where supported.
• Lazy-loaded, responsive images (srcset, modern formats), no layout shift.
• Accessible + semantic: real landmarks, focus-visible rings, ARIA on menus/carousel, 44px tap targets, AA contrast. Honor prefers-reduced-motion (animations degrade to instant).

────────────────────────────────────────
ADD COOL — BUT TASTEFUL — TRANSITIONS
────────────────────────────────────────
• HERO: slow Ken-Burns zoom on the background photo + green gradient scrim; headline + sub fade-up on load; eyebrow label slides in.
• On scroll: sections + cards fade + rise in (staggered, once).
• IMPACT + "one planet" numbers: animated COUNT-UP when they enter view.
• CARDS: hover = lift + soft shadow + image zoom (scale 1.03); staggered entrance.
• STORIES carousel: smooth slide + swipe + autoplay + dots; momentum feel.
• MOBILE NAV: slide-in drawer from the right + backdrop blur/fade; accordion sub-menus expand smoothly.
• BUTTONS / LINKS: subtle hover (lift, icon nudge →), animated nav underline.
• Keep it ~150–250ms, calm easing — cool, never bouncy or busy. All gated behind prefers-reduced-motion.

────────────────────────────────────────
FIX THESE PROBLEMS FROM THE CURRENT PAGE
────────────────────────────────────────
All-caps body → sentence case. Impact stats overflow → fit 4-across desktop / 2×2 tablet / stacked mobile. Stray blue → one brand green. Both Get-Involved boxes same green. Mission heading green (not blue). Counters show their real numbers. Broken icons → clean line icons.

────────────────────────────────────────
KEEP ALL THIS CONTENT (in this order)
────────────────────────────────────────
HEADER: logo + "COODU Trust" (small tagline "Dindigul · Tamil Nadu"). Nav: Home, About, Programs, Get Involved, Documents, Media, Contact. Orange "Donate" button.

1) HERO — full-bleed photo banner [IMG: hero] with dark-green scrim. Amber eyebrow "Rural development across Tamil Nadu · since 2000". H1 "Empowering communities, transforming lives". Sub: "Join us in our mission to create a sustainable and equitable future for rural communities through empowerment, health, and environmental action." Buttons: "Discover our work" (green) + "Donate" (outline). Small meta: "Dindigul, Tamil Nadu · 20+ years of field work".

2) IMPACT — "Our impact at a glance". 4 stat cards (line icon + number + label), card sits overlapping the hero: 3,81,609+ Total Beneficiaries · 534 Panchayats Served · 18,523+ Toilets Built · 26,93,250 Trees Planted.

3) WHO WE ARE — left: intro video [IMG: video-thumb] with play button (YouTube wrG63C0qtxg). Right: "Community. Compassion. Collaboration." (all green) + "The mission of Coodu Trust is to improve the quality of life for economically disadvantaged individuals by providing the necessary resources to increase their standard of living, foster self-improvement, and maximize self-empowerment." + "Learn more about us" button.

4) OUR CORE PROGRAMS — eyebrow "What we do", heading "Our core programs", card grid (3 → 2 → 1). Each card: icon + photo + title + text + "Learn more →".
   • Environment and Resilience [IMG: prog-env] — "Building climate-resilient communities through environmental conservation, renewable energy solutions, and sustainable development practices."
   • Sustainable Agriculture [IMG: prog-agri] — "Promoting organic farming, watershed management, and innovative agricultural techniques to enhance food security and farmer livelihoods."
   • Education and Skilling [IMG: prog-edu] — "Empowering communities through quality education, vocational training, and skill development programs for sustainable employment."
   • Health, Sanitation & Waste Management [IMG: prog-health] — "Improving community health through healthcare access, sanitation facilities, solid waste management, and health awareness programs in rural areas."
   • Consultancy and HR Management [IMG: prog-hr] — "Providing expert consultancy services and human resource management solutions for organizational development and capacity building."
   • Women Empowerment [IMG: prog-women] (tag: New) — "Self-help groups, microfinance and enterprise support so women can lead and earn independently."
   Add "View all programs →" below the grid.

5) GET INVOLVED band (green): "Are you looking for support? — Discover the programs and resources we offer to communities." [Get help] · "Do you want to make a difference? — Join us as a volunteer, partner, or donor to transform lives." [Get involved]. Same green for both.

6) STORIES OF TRANSFORMATION — heading + "Witness the powerful journeys of communities and individuals transformed through our programs." Testimonial carousel (3, each with a photo placeholder):
   • Lakshmi Devi — Women Empowerment, Dindigul: "Coodu Trust's skill development program changed my life completely. I learned tailoring and now I run my own small business, supporting my family independently. My monthly income has increased from ₹2,000 to ₹8,000."
   • Murugan S. — Village Head, Karur District (Health & Sanitation): "Before Coodu Trust came to our village, we had to walk 3 kilometres for clean water. Now with the new water system and sanitation facilities, our children are healthier and our women save 2 hours daily."
   • Raman Kumar — Farmer, Environmental Program (Sustainable Agriculture): "The organic farming training helped us reduce our costs by 40% and increase crop yield by 25%. We no longer depend on expensive chemical fertilizers and our soil health has improved significantly."

7) "WE HAVE ONLY ONE PLANET" (dark band): "It's time to wake up to the grim reality and get our act together." 4 live count-up counters (amber): 8,192,242,010 World population · 1,198,948,812 Tonnes of waste dumped · 28,277,094 Tonnes of electronic waste · 1.72 Number of Earths humanity uses.

FOOTER (deep green): logo [IMG: logo-white] + "Coodu Trust is a registered non-profit organization working towards sustainable development in Tamil Nadu, India since 2000." · Quick Links: About Us, Our Programs, Careers, Donate · Contact: H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India / director@coodutrust.org / +91-451-2461362 · Follow Us: Facebook, X, Instagram · © Coodu Trust.

────────────────────────────────────────
IMAGES — use these real URLs (they load directly)
────────────────────────────────────────
logo:        https://res.cloudinary.com/dvxbg6to3/image/upload/v1754464373/coodu-trust/images/logos/coodu_frontlogo.png
logo-white:  https://res.cloudinary.com/dvxbg6to3/image/upload/v1754476345/coodu-trust/images/logos/logo-white.png
hero:        https://res.cloudinary.com/dvxbg6to3/image/upload/v1754456742/coodu-trust/images/hero/women-empowerment.jpg
prog-env:    https://res.cloudinary.com/dvxbg6to3/image/upload/v1754456725/coodu-trust/images/programs/program-environment.jpg
prog-agri:   https://res.cloudinary.com/dvxbg6to3/image/upload/v1754456729/coodu-trust/images/programs/watershed-development.jpg
prog-edu:    https://res.cloudinary.com/dvxbg6to3/image/upload/v1754456727/coodu-trust/images/programs/program-women-empowerment.jpg
prog-health: https://res.cloudinary.com/dvxbg6to3/image/upload/v1754456724/coodu-trust/images/programs/health-sanitation.jpg
prog-women:  https://res.cloudinary.com/dvxbg6to3/image/upload/v1754456742/coodu-trust/images/hero/women-empowerment.jpg
prog-hr:     https://res.cloudinary.com/dvxbg6to3/image/upload/v1754456725/coodu-trust/images/programs/program-environment.jpg
video-thumb: https://res.cloudinary.com/dvxbg6to3/image/upload/v1754456724/coodu-trust/images/programs/health-sanitation.jpg
(For the 3 testimonial photos and the small program icons, use clean placeholders — I'll drop real photos in later.)

After the first version, I'll iterate with you (hero, spacing, motion) until it's right, then hand it to my developer to build.
