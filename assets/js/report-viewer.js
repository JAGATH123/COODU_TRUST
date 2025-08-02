/* =============================================
   REPORT VIEWER - PDF.js INTEGRATION & ANIMATIONS
   ============================================= */

// Report Data Structure with Summaries
const REPORTS_DATA = {
    "2024": {
        file: "assets/Annual reports/annual-report 2023 - 2024.pdf",
        title: "Annual Report 2023-2024: Scaling Impact & Innovation",
        year: "2023–2024",
        subtitle: "Scaling Impact Through Collaboration & Innovation",
        summary: "Coodu Trust expanded its presence across Tamil Nadu and Puducherry, championing integrated rural development through strategic partnerships. Key priorities included women-led livelihoods, water safety, village planning, and inclusive skilling.",
        highlights: [
            { text: "Implemented 14 thematic projects across 9 districts & 1 Union Territory, impacting over 38,500 households" },
            { text: "Conducted VPDP training for 22,700+ villagers and 1,870 village teams in participatory planning" },
            { text: "Trained 3,425 youth under DDU-GKY, PMKVY, and TNSDC programs with 70%+ placement success" },
            { text: "Supported 9,250 SHG women in initiating/expanding microenterprises across farm & non-farm sectors" },
            { text: "Tested 10,250+ drinking water samples through TWAD labs to ensure community safety" },
            { text: "Installed RO systems in 3 villages, ensuring safe water access for 510 households" },
            { text: "Conducted community campaigns on gender equality, sanitation, HIV/AIDS, plastic use, and health across 50+ villages" },
            { text: "Engaged with multiple CSR & Govt. agencies for sustainable co-implementation of development programs" }
        ],
        stats: [
            { number: "38,500+", label: "Households Impacted" },
            { number: "22,700+", label: "Villagers Trained" }
        ]
    },
    "2023": {
        file: "assets/Annual reports/Annula Report 2022 - 2023.pdf",
        title: "Annual Report 2022-2023: Integrating Sustainability",
        year: "2022–2023",
        subtitle: "Integrating Sustainability, Empowering Communities",
        summary: "Coodu Trust advanced an integrated development approach across Tamil Nadu and Puducherry, with strong focus on climate-resilient agriculture, skill development, women-led enterprises, and decentralized governance training.",
        highlights: [
            { text: "Reached 28,700+ households through 8 major thematic projects across 7 districts" },
            { text: "Trained 4,220+ youth in skill-based employment programs under TNSDC, DDU-GKY, PMKVY, and NRuM" },
            { text: "Enabled 18,850 villagers to participate in local governance planning through VPDP training" },
            { text: "Supported 8,325 SHG women in launching/expanding rural livelihoods in goatery, poultry, tailoring, and crafts" },
            { text: "Established climate-resilient farm models in 10 Panchayats under MKSP" },
            { text: "Tested 12,565 water samples for TWAD Board in 5 districts" },
            { text: "Installed RO drinking water systems benefiting 420 schoolchildren in 4 schools" },
            { text: "Delivered awareness campaigns on HIV/AIDS, plastic waste, water conservation & women's rights reaching ~5,000 participants" }
        ],
        stats: [
            { number: "28,700+", label: "Households Reached" },
            { number: "4,220+", label: "Youth Trained" }
        ]
    },
    "2022": {
        file: "assets/Annual reports/Annual Report - 2021 - 2022.pdf",
        title: "Annual Report 2021-2022: Building Back Stronger",
        year: "2021–2022",
        subtitle: "Livelihoods, Health & Rights",
        summary: "As pandemic disruptions eased, Coodu Trust refocused on livelihood revival, health systems strengthening, and large-scale community empowerment. Renewed emphasis on skill-building, awareness, and participatory governance defined the year's approach.",
        highlights: [
            { text: "Facilitated livelihood restoration for 6,307 families across 225 villages" },
            { text: "Conducted VPDP training for 36,000+ villagers and 1,871 village teams" },
            { text: "Reached 4,011 youth through DDU-GKY, NRuM, TNSDC, and PMKVY skilling missions" },
            { text: "Supported 2,265 SHG women in cattle and goat-based microenterprise training" },
            { text: "Tested 12,000+ water samples in 5 districts in partnership with TWAD Board" },
            { text: "Organized International Women's Day, World AIDS Day, and Environment Day campaigns in multiple districts" },
            { text: "Delivered counseling, shelter & reintegration support for 135 short-stay home residents" },
            { text: "Installed RO water systems benefiting tribal habitations in Dindigul & Tirunelveli" }
        ],
        stats: [
            { number: "6,307", label: "Families Restored" },
            { number: "36,000+", label: "Villagers Trained" }
        ]
    },
    "2021": {
        file: "assets/Annual reports/Annual Report 2020 - 2021.pdf",
        title: "Annual Report 2020-2021: Responding to Crisis, Reinforcing Communities",
        year: "2020–2021",
        subtitle: "Responding to Crisis, Reinforcing Communities",
        summary: "This year brought challenges due to the COVID-19 pandemic, but Coodu Trust adapted quickly — delivering relief, promoting health, and continuing development and training through remote and field-based interventions.",
        highlights: [
            { text: "Delivered COVID relief kits, dry rations, and hygiene support to 7,253 rural families across 9 districts" },
            { text: "Enabled 10,021 villagers to access government schemes via digital awareness and mobilization" },
            { text: "Installed RO drinking water plants in 2 villages benefiting 540 tribal households" },
            { text: "Distributed 3,200 tree saplings and conducted 1,060 kitchen garden trainings" },
            { text: "Tested 8,720+ water samples in 5 districts under TWAD" },
            { text: "Trained 3,042 rural youth in skill development programs (DDU-GKY, TNSDC, NRuM)" },
            { text: "Provided mental health & livelihood support to 175 short-stay home residents" },
            { text: "Conducted street plays & campaigns in 15 villages to raise awareness on hygiene, environment & social distancing" }
        ],
        stats: [
            { number: "34,011+", label: "Total Beneficiaries" },
            { number: "9", label: "Districts Covered" }
        ]
    },
    "2020": {
        file: "assets/Annual reports/Annual Report 2019-20.pdf",
        title: "Annual Report 2019-2020: Reviving Livelihoods, Restoring Balance",
        year: "2019–2020",
        subtitle: "Reviving Livelihoods, Restoring Balance",
        summary: "This pivotal year focused on reviving rural livelihoods and restoring environmental balance through comprehensive watershed management, women's empowerment, and youth skill development. Despite emerging challenges, we maintained our commitment to sustainable development while expanding our reach across multiple districts in Tamil Nadu.",
        highlights: [
            { text: "Empowered 5,000+ Mahila Kisans through MKSP for sustainable agriculture, livestock care, and agri-entrepreneurship" },
            { text: "Rejuvenated 3,920+ hectares via Integrated Watershed Management (IWMP, TATA, ATG CSR Projects)" },
            { text: "Trained 4,210+ rural youth under TNSDC, NRuM, NULM, and DDU-GKY programs" },
            { text: "Conducted water quality testing on 12,000+ samples for TWAD Board in 3 districts" },
            { text: "Installed RO-based drinking water systems in 3 primary schools for 375+ children" },
            { text: "Reached 30,000+ students/community members via street plays & exhibitions on plastic waste and environment awareness" },
            { text: "Supported women's empowerment through SHGs with targeted capacity-building, financial inclusion, and livelihood support" }
        ],
        stats: [
            { number: "54,585+", label: "Total Beneficiaries" },
            { number: "3,920+", label: "Hectares Rejuvenated" }
        ]
    },
    "2019": {
        file: "assets/Annual reports/Annual Report 2018-2019.pdf",
        title: "Annual Report 2018-2019: Participation, Productivity & Protection",
        year: "2018–2019",
        subtitle: "Participation, Productivity & Protection",
        summary: "Coodu Trust advanced its mission with large-scale watershed initiatives, multi-sectoral skill training, sanitation programs, and PRI–SHG capacity-building. The emphasis remained on building empowered, self-sustaining communities across Tamil Nadu.",
        highlights: [
            { text: "Trained 2,200+ SHGs & local leaders in participatory village development planning (Virudhunagar – 5 blocks)" },
            { text: "Covered 1,200 hectares under rainwater harvesting with ATG Tyres–United Way in Tirunelveli" },
            { text: "Reached 85,000 beneficiaries through IWMP watershed training and livelihood initiatives" },
            { text: "Conducted skill training for ~855 youth across trades like tailoring, accounting, beauty therapy, front office, and healthcare" },
            { text: "Facilitated job placements for 80%+ of trained youth in local industries" },
            { text: "Tested 6,000+ water samples in Dindigul and Tirunelveli via TWAD collaboration" },
            { text: "Conducted WASH education for 200+ students and teachers across 5 Trichy schools" },
            { text: "Offered short-stay, counselling, and food support to 210 individuals" },
            { text: "Promoted consumer rights awareness to 200 community members in Karur" }
        ],
        stats: [
            { number: "85,000", label: "Watershed Beneficiaries" },
            { number: "9,665+", label: "Direct Participants" }
        ]
    },
    "2018": {
        file: "assets/Annual reports/Annual Report_2017-2018.pdf",
        title: "Annual Report 2017-2018: Participatory Development in Action",
        year: "2017–2018",
        subtitle: "Participatory Development in Action",
        summary: "This year, Coodu Trust deepened its impact across watershed management, livelihoods, healthcare, sanitation, and skilling, building on strong partnerships and a community-first approach. Thousands benefitted from structured training, financial inclusion, and grassroots empowerment efforts.",
        highlights: [
            { text: "Implemented 570 Watershed Programs across 14 districts, benefiting 8.5 lakh people" },
            { text: "Facilitated ₹1.33 crore microfinance support to 67 SHGs for livestock rearing" },
            { text: "Trained 2,050+ rural youth under NULM, TNSDC, PMKVY, and RURBAN missions" },
            { text: "Certified 1,961 trainees, placed 1,617 in skilled jobs" },
            { text: "Organized 12 veterinary health camps, covering 4 districts" },
            { text: "Conducted rainwater harvesting training for 125 farmers" },
            { text: "Launched nutrient gardens in 15 schools and WASH awareness in 5 schools" },
            { text: "Delivered 137 free mortuary van services across Dindigul" },
            { text: "Trained 30,600 villagers and 1,836 village teams under VPDP" },
            { text: "Observed Environment, Women's, and AIDS Day with over 1,000+ participants" }
        ],
        stats: [
            { number: "8.5 Lakh", label: "Watershed Beneficiaries" },
            { number: "34,653+", label: "People Trained" }
        ]
    },
    "2017": {
        file: "assets/Annual reports/Annual Report 2016-2017.pdf",
        title: "Annual Report 2016-2017: Serving Communities, Deepening Roots",
        year: "2016–2017",
        subtitle: "Serving Communities, Deepening Roots",
        summary: "This year, Coodu Trust delivered skill-building, health, sanitation, and environmental programs across Tamil Nadu. From large-scale training to focused grassroots awareness, the Trust reached thousands through partnerships and persistent field engagement.",
        highlights: [
            { text: "Trained 560 dairy farmers and 1,000 apparel workers with NSDC certifications" },
            { text: "Enabled ₹1.33 crore microfinance support to 67 SHGs for cow rearing" },
            { text: "Created 15 nutrient gardens in schools to support student health" },
            { text: "Reached 325 students with hygiene awareness in 4 panchayats" },
            { text: "Conducted 12 animal health camps and 20 medical campaigns with Rotary & Lions Club" },
            { text: "Supported 50 panchayat leaders under Swachh Bharath for hygiene training" },
            { text: "Observed Environmental Day (600 tree seedlings), Women's Day (yoga), and World AIDS Day (nutrient kit support to 100 PLHIV)" },
            { text: "Provided 137 free mortuary van services across Dindigul" },
            { text: "Delivered short-stay support and counseling to 210 rural peasants" }
        ],
        stats: [
            { number: "2,692+", label: "Direct Beneficiaries" },
            { number: "₹1.33 Cr", label: "Microfinance Support" }
        ]
    },
    "2016": {
        file: "assets/Annual reports/Annual report 2015-2016.pdf",
        title: "Annual Report 2015-2016: Skilling Communities, Growing Enterprises",
        year: "2015–2016",
        subtitle: "Skilling Communities, Growing Enterprises",
        summary: "This transformative year focused on comprehensive skill development and enterprise growth across rural Tamil Nadu. Through strategic partnerships and innovative programs, we empowered communities with technical skills, soft skills, and entrepreneurial capabilities while strengthening health services and environmental conservation initiatives.",
        highlights: [
            { text: "Trained 560 dairy sector beneficiaries & 1,000 apparel workers through NSDC" },
            { text: "Enabled 2,000 rural youth with spoken English soft skills" },
            { text: "Distributed 30,000+ tree seedlings for climate resilience and green cover" },
            { text: "Mobilized 750 youth from 75 villages for agri-entrepreneurship training" },
            { text: "Formed & supported Farmer Producer Organizations across 10 villages" },
            { text: "Conducted 32 animal health camps, 15 nutrition gardens & 67 medical health drives" },
            { text: "Extended free mortuary van services to 126 families" },
            { text: "Enabled ₹1.33 crore microfinance loans to SHG women in Karur" }
        ],
        stats: [
            { number: "4,310+", label: "Direct Beneficiaries" },
            { number: "₹1.33 Cr", label: "Microfinance Enabled" }
        ]
    },
    "2015": {
        file: "assets/Annual reports/Annual report 2014-2015.pdf",
        title: "Annual Report 2014-2015: Empowering Livelihoods, Building Local Capacity",
        year: "2014–2015",
        subtitle: "Empowering Livelihoods, Building Local Capacity",
        summary: "This year, COODU Trust deepened its commitment to skill development and sustainable rural advancement. With projects across agriculture, health, entrepreneurship, and youth empowerment, the focus was on enhancing self-reliance and scaling community impact through partnerships with NSDC, KVIC, KVK, and local institutions.",
        highlights: [
            { text: "Trained 539 dairy farmers across 3 districts under PMKVY (NSDC)" },
            { text: "Enabled 1,000 rural artisans through KVIC training in 5 traditional trades" },
            { text: "Placed 1,200 women in jobs post tailoring training with NIFT-TEA" },
            { text: "Trained 750 farmers in organic methods for vegetable and mango cultivation" },
            { text: "Planted 10,000 trees in 20 villages via Farmers Academy and Lions Club" },
            { text: "Established 10 tuition centres benefiting 250 students in Virudhunagar" },
            { text: "Conducted soft skill and tractor operator training for 560 rural youth" },
            { text: "Promoted yoga education to 200 university students for health and wellness" }
        ],
        stats: [
            { number: "4,499+", label: "Total Beneficiaries" },
            { number: "8", label: "Skill Development Programs" }
        ]
    },
    "2014": {
        file: "assets/Annual reports/Annual reopt 2013-2014.pdf",
        title: "Annual Report 2013-2014: Strengthening Systems, Amplifying Voices",
        year: "2013–2014",
        subtitle: "Strengthening Systems, Amplifying Voices",
        summary: "This year, Coodu Trust scaled integrated efforts across watershed development, health, sanitation, and women's empowerment. The focus remained on delivering sustainable solutions and building institutional capacity across Tamil Nadu, with a strong emphasis on grassroots mobilization, SHG strengthening, and participatory practices.",
        highlights: [
            { text: "Mobilized over 1,200 SHGs across 12 districts with sustained income-generation support" },
            { text: "Conducted Participatory Rural Appraisals (PRAs) and socio-economic surveys in over 400 villages" },
            { text: "Facilitated 9,800+ low-cost toilets under the Total Sanitation Campaign (TSC)" },
            { text: "Advanced awareness and condom distribution under the TANSACS FSW project in Pudukottai" },
            { text: "Strengthened capacity-building under TN-IAMWARM in Tirunelveli and Virudhunagar" },
            { text: "Expanded watershed work with 300+ new CBOs across 10 districts" },
            { text: "Ran eco-model farms demonstrating organic and micro-irrigation methods" },
            { text: "Documented NREGA success stories, tourism handbooks, and rural development materials" },
            { text: "Conducted research on women's livelihoods and tribal community needs in interior Tamil Nadu" }
        ],
        stats: [
            { number: "1,200+", label: "SHGs Mobilized" },
            { number: "9,800+", label: "Toilets Facilitated" }
        ]
    },
    "2013": {
        file: "assets/Annual reports/annual-report-2012-2013.pdf",
        title: "Annual Report 2012-2013: Scaling Change, Deepening Roots",
        year: "2012–2013",
        subtitle: "Scaling Change, Deepening Roots",
        summary: "Coodu Trust expanded its commitment to rural transformation through grassroots actions, technical support, health outreach, sanitation, and environmental conservation. With enhanced partnerships, community training, and SHG empowerment, the year solidified our role as a rural development catalyst in Tamil Nadu.",
        highlights: [
            { text: "Empowered 1,345 SHGs across 11 districts, enabling ₹5 crore in micro-credit disbursements" },
            { text: "Built 10,222+ low-cost household toilets under Total Sanitation Campaign" },
            { text: "Delivered HIV/AIDS awareness and prevention in all 534 watershed panchayats" },
            { text: "Continued Targeted Interventions for FSWs under TANSACS in Pudukottai" },
            { text: "Trained WUAs under the TN-IAMWARM irrigation project (Virudhunagar)" },
            { text: "Initiated organic demo farming with precision irrigation at Velliyanai Farm Academy" },
            { text: "Ran mortuary van services in Dindigul under TNHSP, serving poor rural families" },
            { text: "Created 290 CBOs in 9 districts for sustained watershed project follow-up" },
            { text: "Completed livelihood research for DNC communities & tourism handbooks for Ramanathapuram" }
        ],
        stats: [
            { number: "₹5 Crore", label: "Micro-credit Disbursed" },
            { number: "10,222+", label: "Toilets Built" }
        ]
    },
    "2012": {
        file: "assets/Annual reports/annual-report-2011-2012.pdf",
        title: "Annual Report 2011-2012: Refocusing Strategy for Deeper Community Engagement",
        year: "2011–2012",
        subtitle: "Refocusing Strategy for Deeper Community Engagement",
        summary: "This year marked a turning point as COODU Trust transitioned from widespread district operations to intensive grassroots engagement in targeted villages. With a renewed focus on livelihood, women's development, sanitation, health, and environment, the Trust launched long-term, high-impact projects while continuing technical support to government programs and communities across Tamil Nadu.",
        highlights: [
            { text: "Initiated long-term development plans across 6 key districts (Dindigul, Karur, Tirunelveli, Trichy, Kancheepuram, Pudukottai)" },
            { text: "Reached 14,000+ women via 645 independently functioning Self Help Groups" },
            { text: "Delivered 630 staff-months of capacity-building for Water Users Associations under World Bank–funded TN IAMWARM project" },
            { text: "Facilitated women's economic empowerment under Mahalir Thittam in Karur (180 staff-months)" },
            { text: "Implemented HIV/AIDS awareness, care, and condom distribution among Female Sex Workers in Pudukottai (216 staff-months)" },
            { text: "Advanced Integrated Watershed Management Programme in 4 districts with training, SHG formation & conservation initiatives" },
            { text: "Strengthened partnerships with 12 networks & 13+ government agencies for agriculture, sanitation, and rural development" }
        ],
        stats: [
            { number: "14,000+", label: "Women Reached" },
            { number: "1,026", label: "Total Staff-Months" }
        ]
    },
    "2011": {
        file: "assets/Annual reports/annual-report-2010-2011.pdf",
        title: "Annual Report 2010-2011: Deepening Impact, Broadening Horizons",
        year: "2010–2011",
        subtitle: "Deepening Impact, Broadening Horizons",
        summary: "This milestone decade-completion year demonstrated our commitment to deepening community impact while broadening our programmatic horizons. We significantly scaled our training initiatives, youth empowerment programs, and health interventions while strengthening strategic partnerships for converged rural development delivery across Tamil Nadu.",
        highlights: [
            { text: "Conducted over 340 training programs, empowering rural communities with practical skills" },
            { text: "Enabled 1,965 rural youth with employability training through district employment offices" },
            { text: "Reached 1,522 migrant workers via continued HIV/AIDS prevention & health awareness drives" },
            { text: "Mobilized 5,000+ women across 6 mass awareness events including Women's Day, AIDS Day & TB Day" },
            { text: "Facilitated eco-skills and entrepreneurship training (vermicompost, biopesticides, herbal medicines, nursery management)" },
            { text: "Operationalized TN Health Systems Project Mortuary Van services in remote areas" },
            { text: "Partnered with NABARD, DRDA, State Health Societies, & DIC for converged rural development delivery" }
        ],
        stats: [
            { number: "340+", label: "Training Programs" },
            { number: "8,487+", label: "Direct Beneficiaries" }
        ]
    },
    "2010": {
        file: "assets/Annual reports/annual-report-2009-2010.pdf",
        title: "Annual Report 2009-2010: Diversification, Youth Focus & Systems Strengthening",
        year: "2009–2010",
        subtitle: "Diversification, Youth Focus & Systems Strengthening",
        summary: "This dynamic year marked significant diversification in our program portfolio with a special focus on youth development and systems strengthening. We expanded into health services, HIV/AIDS interventions, innovative agriculture pilots, and comprehensive mass awareness campaigns while maintaining our core commitment to women's empowerment and watershed development.",
        highlights: [
            { text: "Trained 2,500+ women through SHGs in microfinance, dairy, tailoring, nursery, and eco-enterprises" },
            { text: "Reached 6,500+ migrant workers via HIV/AIDS intervention programs in Karur" },
            { text: "Supported youth development via National Youth Day & CAPART Young Professionals" },
            { text: "Continued watershed programs across districts for sustainable agriculture & ecological restoration" },
            { text: "Piloted bamboo cultivation trials with IFGTB in Karur" },
            { text: "Conducted mass awareness programs: Women's Day (2000+ women), AIDS Day (500+), Migrants Day (1200+), Children's Day, TB Day, World Water Day" },
            { text: "Extended mortuary van services to over 500 underserved families under TN Health Systems Project (TNHSP)" }
        ],
        stats: [
            { number: "9,000+", label: "Total Beneficiaries" },
            { number: "7", label: "Program Diversification Areas" }
        ]
    },
    "2009": {
        file: "assets/Annual reports/annual-report-2008-2009.pdf",
        title: "Annual Report 2008-2009: Integration, Innovation, and Impact",
        year: "2008–2009",
        subtitle: "Integration, Innovation, and Impact",
        summary: "This transformative year showcased our commitment to integration, innovation, and measurable impact. We maintained strong presence in core districts while driving integrated development, scaling SHGs into comprehensive economic platforms, and prioritizing women's economic empowerment through participatory governance and community-led monitoring systems.",
        highlights: [
            { text: "Maintained presence in core districts, driving integrated development" },
            { text: "SHGs scaled into economic platforms for savings, enterprise & credit" },
            { text: "Trained 9,000+ rural leaders in watershed, governance & livelihoods" },
            { text: "Strengthened alignment of state and central rural development schemes" },
            { text: "Focused on women's economic empowerment and participatory governance" },
            { text: "Prioritized community monitoring, data collection & sustainability" }
        ],
        stats: [
            { number: "9,000+", label: "Rural Leaders Trained" },
            { number: "100%", label: "Integrated Development" }
        ]
    },
    "2008": {
        file: "assets/Annual reports/annual-report-2007-2008.pdf",
        title: "Annual Report 2007-2008: Toward Lasting Development Impact",
        year: "2007–2008",
        subtitle: "Toward Lasting Development Impact",
        summary: "This pivotal year focused on creating lasting development impact through solidified governance models and evolved community institutions. We emphasized transparency, participatory planning, and climate resilience while our SHGs transformed into comprehensive platforms for social action, credit, and enterprise development.",
        highlights: [
            { text: "Solidified community-led governance models across watershed regions" },
            { text: "SHGs evolved into platforms for social action, credit, and enterprise" },
            { text: "Trained 10,000+ rural stakeholders in advanced development practices" },
            { text: "Sustained convergence of DPAP, IWDP, and TNCWP for local empowerment" },
            { text: "Emphasized monitoring, transparency, and participatory planning" },
            { text: "Enhanced climate resilience through watershed asset maintenance" }
        ],
        stats: [
            { number: "10,000+", label: "Stakeholders Trained" },
            { number: "100%", label: "Governance Models Solidified" }
        ]
    },
    "2007": {
        file: "assets/Annual reports/annual-report-2006-2007.pdf",
        title: "Annual Report 2006-2007: Institutional Maturity & Program Synergy",
        year: "2006–2007",
        subtitle: "Institutional Maturity & Program Synergy",
        summary: "This milestone year showcased the institutional maturity of our community networks and the powerful synergy achieved through our integrated program approach. We witnessed locally governed entities taking full ownership while our multi-program convergence created unprecedented rural development impact.",
        highlights: [
            { text: "Strengthened community institutions into locally governed entities" },
            { text: "SHG and watershed ecosystems matured into autonomous structures" },
            { text: "Supported sustainable livelihoods through asset-building & training" },
            { text: "Over 11,000+ individuals trained in inclusive development practices" },
            { text: "Continued multi-program convergence across DPAP, IWDP, TNCWP" },
            { text: "Deepened focus on local leadership, ownership & impact tracking" }
        ],
        stats: [
            { number: "11,000+", label: "Individuals Trained" },
            { number: "100%", label: "Autonomous Structures" }
        ]
    },
    "2006": {
        file: "assets/Annual reports/annual-report-2005-2006.pdf",
        title: "Annual Report 2005-2006: Scaling Impact Through Consolidation",
        year: "2005–2006",
        subtitle: "Scaling Impact Through Consolidation",
        summary: "This strategic year focused on consolidating our achievements while scaling impact through strengthened systems and embedded operations. We reinforced rural development frameworks, enhanced climate resilience, and sustained multi-program delivery across our operational districts in Tamil Nadu.",
        highlights: [
            { text: "Embedded operations in 9+ districts, reinforcing rural systems" },
            { text: "Consolidated community-led governance structures for sustainability" },
            { text: "Expanded women-led SHGs and livelihood-linked user groups" },
            { text: "Trained over 10,000+ individuals in community resource management" },
            { text: "Enhanced climate-resilient agriculture and water conservation efforts" },
            { text: "Sustained multi-program delivery across DPAP, IWDP & TNCWP" }
        ],
        stats: [
            { number: "10,000+", label: "Individuals Trained" },
            { number: "9+", label: "Districts Embedded" }
        ]
    },
    "2005": {
        file: "assets/Annual reports/annual-report-2004-2005.pdf",
        title: "Annual Report 2004-2005: From Participation to Ownership",
        year: "2004–2005",
        subtitle: "From Participation to Ownership",
        summary: "This transformative year marked our evolution from facilitating community participation to enabling true community ownership of development processes. We witnessed our institutional networks reach new maturity as communities took leadership in managing their resources and determining their development pathways.",
        highlights: [
            { text: "Sustained impact across 9+ districts, deepening institutional roots" },
            { text: "Advanced SHG and Watershed networks reached new maturity" },
            { text: "Enabled community-led water & land resource management" },
            { text: "Over 12,000+ rural citizens trained through targeted programs" },
            { text: "Strengthened programmatic synergy across DPAP, IWDP & TNCWP" },
            { text: "Promoted livelihood resilience through eco-friendly rural innovations" }
        ],
        stats: [
            { number: "12,000+", label: "Rural Citizens Trained" },
            { number: "9+", label: "Districts with Deep Roots" }
        ]
    },
    "2004": {
        file: "assets/Annual reports/annual-report-2003-2004.pdf",
        title: "Annual Report 2003-2004: Deepening Impact, Broadening Horizons",
        year: "2003–2004",
        subtitle: "Deepening Impact, Broadening Horizons",
        summary: "This pivotal year marked our transition from foundational work to deepening community impact while broadening our programmatic horizons. We strengthened governance structures, enhanced livelihood opportunities, and integrated our diverse programs into cohesive rural development strategies across Tamil Nadu.",
        highlights: [
            { text: "Strengthened reach across 9+ districts with ongoing watershed programs" },
            { text: "SHGs and UGs grew to support women's leadership & local livelihoods" },
            { text: "Watershed Committees ensured sustainable resource governance" },
            { text: "Trained 15,000+ stakeholders in advanced planning and management" },
            { text: "Introduced livelihood diversification pilots in select project areas" },
            { text: "Integrated efforts under DPAP, IWDP, and TNCWP into cohesive rural strategies" }
        ],
        stats: [
            { number: "15,000+", label: "Stakeholders Trained" },
            { number: "9+", label: "Districts Strengthened" }
        ]
    },
    "2003": {
        file: "assets/Annual reports/annual-report-2002-2003.pdf",
        title: "Annual Report 2002-2003: Scaling Impact, Deepening Roots",
        year: "2002–2003",
        subtitle: "Scaling Impact, Deepening Roots",
        summary: "Building on our foundational year's momentum, we scaled our impact across Tamil Nadu while deepening our community roots. This year marked significant expansion in institutional development, capacity building, and innovative livelihood programs that strengthened our commitment to sustainable rural transformation.",
        highlights: [
            { text: "Operational in 9+ districts, building on prior year momentum" },
            { text: "Community Institutions expanded to over 20,000+ total" },
            { text: "Rolled out advanced capacity building for 25,000+ participants" },
            { text: "Expanded SHGs and UGs for women-led development & livelihoods" },
            { text: "Implemented TNCWP, DPAP, and IWDP at scale" },
            { text: "Launched livelihood pilots & new ecological restoration models" }
        ],
        stats: [
            { number: "20,000+", label: "Community Institutions" },
            { number: "25,000+", label: "Capacity Building Participants" }
        ]
    },
    "2002": {
        file: "assets/Annual reports/annual-report-2001-2002.pdf",
        title: "Annual Report 2001-2002: Laying the Foundation for Transformation",
        year: "2001–2002",
        subtitle: "Laying the Foundation for Transformation",
        summary: "This foundational year marked the beginning of our transformative journey in Tamil Nadu. We mobilized communities across multiple districts, established robust community institutions, and created sustainable frameworks for rural development that would guide our mission for decades to come.",
        highlights: [
            { text: "50,000+ people mobilized across 9+ districts in Tamil Nadu" },
            { text: "10,000+ community institutions formed, including 8,925 SHGs" },
            { text: "Managed 3 national/state flagship programs (DPAP, IWDP, TNCWP)" },
            { text: "Trained 40,000+ individuals in grassroots leadership & skills" },
            { text: "Built ecological resilience through large-scale watershed efforts" },
            { text: "Created a blueprint for women's empowerment & self-reliance" }
        ],
        stats: [
            { number: "50,000+", label: "People Mobilized" },
            { number: "9+", label: "Districts Covered" }
        ]
    }
};

// Global Variables
let currentPDF = null;
let currentPage = 1;
let totalPages = 1;
let currentScale = 1.0;
let currentReport = null;

// Initialize Report Viewer
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const reportYear = urlParams.get('year') || '2023';
    
    loadReport(reportYear);
    setupEventListeners();
});

// Load Report Function
async function loadReport(year) {
    currentReport = REPORTS_DATA[year];
    
    if (!currentReport) {
        showError('Report not found for year ' + year);
        return;
    }

    // Update page title and header
    document.title = `${currentReport.title} | Coodu Trust`;
    document.getElementById('report-title').textContent = currentReport.title;
    document.getElementById('report-year').textContent = currentReport.year;
    document.getElementById('report-subtitle').textContent = currentReport.subtitle;
    document.getElementById('download-btn').href = currentReport.file;

    // Load PDF
    await loadPDF(currentReport.file);
    
    // Start typewriter animation for summary
    startTypewriter();
    
    // Load highlights and stats with animations
    setTimeout(() => loadHighlights(), 2000);
    setTimeout(() => loadStats(), 3000);
    
    // Setup navigation
    setupNavigation(year);
}

// PDF Loading Function
async function loadPDF(pdfPath) {
    try {
        const loadingTask = pdfjsLib.getDocument(pdfPath);
        currentPDF = await loadingTask.promise;
        totalPages = currentPDF.numPages;
        
        document.getElementById('total-pages').textContent = totalPages;
        document.getElementById('current-page').textContent = '1';
        
        await renderPage(1);
        
        // Hide loading spinner
        const container = document.getElementById('pdf-container');
        container.innerHTML = '<canvas id="pdf-canvas"></canvas>';
        await renderPage(1);
        
    } catch (error) {
        console.error('Error loading PDF:', error);
        showError('Failed to load PDF. Please try again.');
    }
}

// Render PDF Page with custom scale
async function renderPageWithScale(pageNum, scale) {
    if (!currentPDF) return;
    
    try {
        const page = await currentPDF.getPage(pageNum);
        const canvas = document.getElementById('pdf-canvas');
        const context = canvas.getContext('2d');
        
        const viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        
        await page.render(renderContext).promise;
        currentPage = pageNum;
        document.getElementById('current-page').textContent = pageNum;
        document.getElementById('zoom-level').textContent = Math.round(scale * 100) + '%';
        
        // Update navigation buttons
        document.getElementById('prev-page').disabled = pageNum <= 1;
        document.getElementById('next-page').disabled = pageNum >= totalPages;
        
    } catch (error) {
        console.error('Error rendering page:', error);
    }
}

// Render PDF Page
async function renderPage(pageNum) {
    if (!currentPDF) return;
    
    try {
        const page = await currentPDF.getPage(pageNum);
        const canvas = document.getElementById('pdf-canvas');
        const context = canvas.getContext('2d');
        
        // Get container dimensions
        const container = document.getElementById('pdf-container');
        const containerWidth = container.clientWidth - 20; // Padding
        const containerHeight = container.clientHeight - 20; // Padding
        
        // Get page dimensions at scale 1
        const originalViewport = page.getViewport({ scale: 1 });
        
        // Calculate scale to fit container
        const scaleX = containerWidth / originalViewport.width;
        const scaleY = containerHeight / originalViewport.height;
        const fitScale = Math.min(scaleX, scaleY) * 0.95; // 95% to leave some margin
        
        // Apply the calculated scale
        const viewport = page.getViewport({ scale: fitScale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        
        await page.render(renderContext).promise;
        currentPage = pageNum;
        currentScale = fitScale;
        document.getElementById('current-page').textContent = pageNum;
        document.getElementById('zoom-level').textContent = Math.round(fitScale * 100) + '%';
        
        // Update navigation buttons
        document.getElementById('prev-page').disabled = pageNum <= 1;
        document.getElementById('next-page').disabled = pageNum >= totalPages;
        
    } catch (error) {
        console.error('Error rendering page:', error);
    }
}

// Typewriter Animation
function startTypewriter() {
    const textElement = document.getElementById('summary-text');
    const text = currentReport.summary;
    let index = 0;
    
    textElement.innerHTML = '';
    textElement.classList.add('typewriter');
    
    function typeChar() {
        if (index < text.length) {
            textElement.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeChar, 30); // Adjust speed here (30ms per character)
        } else {
            textElement.classList.remove('typewriter');
        }
    }
    
    typeChar();
}

// Load Highlights with Animation
function loadHighlights() {
    const container = document.getElementById('highlights-container');
    container.innerHTML = '';
    
    currentReport.highlights.forEach((highlight, index) => {
        const highlightDiv = document.createElement('div');
        highlightDiv.className = 'highlight-item';
        highlightDiv.style.animationDelay = `${index * 0.3}s`;
        
        if (highlight.icon) {
            // Old format with icons
            highlightDiv.innerHTML = `
                <span class="highlight-icon">${highlight.icon}</span>
                <span class="highlight-text">${highlight.text}</span>
            `;
        } else {
            // New format without icons, with checkmark
            highlightDiv.innerHTML = `
                <span class="highlight-check">✓</span>
                <span class="highlight-text">${highlight.text}</span>
            `;
        }
        
        container.appendChild(highlightDiv);
    });
}

// Load Stats with Animation
function loadStats() {
    const container = document.getElementById('stats-container');
    container.innerHTML = '';
    
    currentReport.stats.forEach((stat, index) => {
        const statDiv = document.createElement('div');
        statDiv.className = 'stat-card';
        statDiv.style.animationDelay = `${index * 0.2}s`;
        statDiv.innerHTML = `
            <div class="stat-number">${stat.number}</div>
            <div class="stat-label">${stat.label}</div>
        `;
        container.appendChild(statDiv);
    });
}

// Setup Navigation
function setupNavigation(currentYear) {
    const years = Object.keys(REPORTS_DATA).sort((a, b) => b - a); // Descending order
    const currentIndex = years.indexOf(currentYear);
    
    const prevBtn = document.getElementById('prev-report');
    const nextBtn = document.getElementById('next-report');
    
    // Previous report (newer year)
    if (currentIndex > 0) {
        const prevYear = years[currentIndex - 1];
        prevBtn.textContent = `← ${prevYear} Report`;
        prevBtn.onclick = () => {
            window.location.href = `report-viewer.html?year=${prevYear}`;
        };
        prevBtn.disabled = false;
    } else {
        prevBtn.disabled = true;
    }
    
    // Next report (older year)
    if (currentIndex < years.length - 1) {
        const nextYear = years[currentIndex + 1];
        nextBtn.textContent = `${nextYear} Report →`;
        nextBtn.onclick = () => {
            window.location.href = `report-viewer.html?year=${nextYear}`;
        };
        nextBtn.disabled = false;
    } else {
        nextBtn.disabled = true;
    }
}

// Event Listeners
function setupEventListeners() {
    // PDF Navigation
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            renderPage(currentPage - 1);
        }
    });
    
    document.getElementById('next-page').addEventListener('click', () => {
        if (currentPage < totalPages) {
            renderPage(currentPage + 1);
        }
    });
    
    // Zoom Controls
    document.getElementById('zoom-in').addEventListener('click', () => {
        currentScale = Math.min(currentScale * 1.2, 3.0);
        renderPageWithScale(currentPage, currentScale);
    });
    
    document.getElementById('zoom-out').addEventListener('click', () => {
        currentScale = Math.max(currentScale / 1.2, 0.3);
        renderPageWithScale(currentPage, currentScale);
    });
    
    // Action Buttons
    document.getElementById('print-btn').addEventListener('click', () => {
        window.print();
    });
    
    document.getElementById('share-btn').addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: currentReport.title,
                text: currentReport.subtitle,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('Link copied to clipboard!');
            });
        }
    });
}

// Error Display
function showError(message) {
    const container = document.getElementById('pdf-container');
    container.innerHTML = `
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <div class="error-message">${message}</div>
            <button class="retry-btn" onclick="location.reload()">Retry</button>
        </div>
    `;
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentPage > 1) {
        renderPage(currentPage - 1);
    } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
        renderPage(currentPage + 1);
    } else if (e.key === 'Escape') {
        window.location.href = 'documents.html';
    }
});

// Touch/Swipe Navigation for Mobile
let touchStartX = 0;
let touchEndX = 0;

document.getElementById('pdf-canvas').addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.getElementById('pdf-canvas').addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance for a swipe
    const swipeDistance = touchStartX - touchEndX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0 && currentPage < totalPages) {
            // Swipe left - next page
            renderPage(currentPage + 1);
        } else if (swipeDistance < 0 && currentPage > 1) {
            // Swipe right - previous page
            renderPage(currentPage - 1);
        }
    }
}

// Responsive PDF scaling on window resize
window.addEventListener('resize', () => {
    if (currentPDF && currentPage) {
        setTimeout(() => {
            renderPage(currentPage);
        }, 100); // Small delay to ensure container has resized
    }
});

// PDF.js Worker Configuration
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';