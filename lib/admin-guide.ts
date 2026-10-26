import type { Localized } from './services';

/**
 * The admin guide, in both languages, written for the person who runs the
 * business rather than for a developer.
 *
 * It lives here rather than in a markdown file so it can be shown inside the
 * admin at /admin/help — where it will actually be read — and so the two
 * markdown copies in docs/ cannot drift from it. Regenerate them with
 * `pnpm docs:guide` after editing.
 */
export type GuideSection = {
  /** Anchor and admin path, when the section is about one screen. */
  id: string;
  href?: string;
  title: Localized;
  intro: Localized;
  /** Numbered instructions. */
  steps?: Localized[];
  /** Things worth knowing that are not a step. */
  notes?: Localized[];
};

export const guideTitle: Localized = {
  en: 'Running the website',
  gu: 'વેબસાઇટ ચલાવવી',
};

export const guideIntro: Localized = {
  en: 'Everything on the website can be changed from here — no developer, no waiting. Nothing you do can break the site: if a page looks wrong, change it back and it will be right again within a minute.',
  gu: 'વેબસાઇટ પરની દરેક વસ્તુ અહીંથી બદલી શકાય છે — કોઈ ડેવલપર નહીં, રાહ જોવાની નહીં. તમે કરેલું કંઈ પણ સાઇટ બગાડી શકતું નથી: પાનું ખોટું લાગે તો પાછું બદલી નાખો, એક મિનિટમાં ફરી બરાબર થઈ જશે.',
};

export const adminGuide: GuideSection[] = [
  {
    id: 'signing-in',
    href: '/admin/login',
    title: { en: 'Signing in', gu: 'લોગિન કરવું' },
    intro: {
      en: 'Your website address with /admin at the end. Save it in your phone.',
      gu: 'તમારી વેબસાઇટના સરનામા પછી /admin લખો. તે ફોનમાં સાચવી લો.',
    },
    steps: [
      {
        en: 'Type your email and password and tap Sign in.',
        gu: 'તમારો ઈમેલ અને પાસવર્ડ લખો અને Sign in દબાવો.',
      },
      {
        en: 'If you get the password wrong five times, the door shuts for fifteen minutes. That is on purpose — it stops anyone guessing their way in. Wait and try again.',
        gu: 'પાંચ વાર પાસવર્ડ ખોટો પડે તો પંદર મિનિટ માટે બંધ થઈ જાય છે. એ જાણીજોઈને છે — જેથી કોઈ અંદાજે અંદર ન ઘૂસી શકે. રાહ જુઓ અને ફરી પ્રયત્ન કરો.',
      },
    ],
    notes: [
      {
        en: 'Never share your password. If somebody else needs to get in, give them their own account — Users & roles, further down this page.',
        gu: 'તમારો પાસવર્ડ ક્યારેય કોઈને ન આપો. બીજા કોઈને અંદર આવવું હોય તો તેમને પોતાનું ખાતું આપો — આ પાના પર નીચે Users & roles માં.',
      },
    ],
  },
  {
    id: 'enquiries',
    href: '/admin/enquiries',
    title: { en: 'Enquiries — do this every day', gu: 'પૂછપરછ — આ રોજ કરો' },
    intro: {
      en: 'Every quote request from the website lands here, and a copy comes to your email. This is the only screen you must open daily.',
      gu: 'વેબસાઇટ પરથી આવતી દરેક ભાવ-પૂછપરછ અહીં આવે છે, અને એક નકલ તમારા ઈમેલમાં પણ આવે છે. રોજ ખોલવી પડે એવી આ એક જ સ્ક્રીન છે.',
    },
    steps: [
      {
        en: 'Open the enquiry. You get the name, the mobile number, the town, the date, roughly how many guests and what they want set up.',
        gu: 'પૂછપરછ ખોલો. તેમાં નામ, મોબાઇલ નંબર, ગામ, તારીખ, આશરે કેટલા મહેમાન અને શું ગોઠવવાનું છે તે મળશે.',
      },
      {
        en: 'Ring them. Then move the enquiry along: Contacted, Site visit, Quoted, Booked, or Lost.',
        gu: 'તેમને ફોન કરો. પછી પૂછપરછની સ્થિતિ બદલો: Contacted, Site visit, Quoted, Booked કે Lost.',
      },
      {
        en: 'Write what happened in the notes. Six months later, when they ring back, that note is the whole conversation.',
        gu: 'શું થયું તે નોંધમાં લખો. છ મહિના પછી તે ફરી ફોન કરે ત્યારે એ નોંધ જ આખી વાત યાદ કરાવશે.',
      },
    ],
    notes: [
      {
        en: 'Marking an enquiry Lost is not a failure — it keeps the list honest, so what is still open is genuinely still open.',
        gu: 'પૂછપરછને Lost કરવી એ નિષ્ફળતા નથી — તેનાથી યાદી સાચી રહે છે, અને જે ખુલ્લી દેખાય તે ખરેખર ખુલ્લી હોય છે.',
      },
      {
        en: 'The Export button gives you the whole list as a spreadsheet, for whoever does your accounts.',
        gu: 'Export બટનથી આખી યાદી સ્પ્રેડશીટ તરીકે મળે છે — હિસાબ સંભાળનારને આપવા માટે.',
      },
    ],
  },
  {
    id: 'projects',
    href: '/admin/projects',
    title: { en: 'Adding a function you have done', gu: 'કરેલો પ્રસંગ ઉમેરવો' },
    intro: {
      en: 'This is the most valuable half hour you can spend on the website. Photographs of real work is what makes somebody ring you instead of the next contractor.',
      gu: 'વેબસાઇટ પાછળ આપી શકાય તેવો સૌથી કીમતી અડધો કલાક આ છે. સાચા કામના ફોટા જ કોઈને બીજા કોન્ટ્રાક્ટરને બદલે તમને ફોન કરાવે છે.',
    },
    steps: [
      {
        en: 'Projects › New project. Give it a title in both languages — say what it was and where: “Wedding mandap at Limbdi”.',
        gu: 'Projects › New project. બંને ભાષામાં નામ આપો — શું અને ક્યાં તે લખો: “લીંબડીમાં લગ્ન મંડપ”.',
      },
      {
        en: 'Fill in the venue, the date, the number of guests and how many days you were on site. Those numbers are what a visitor is really judging.',
        gu: 'જગ્યા, તારીખ, મહેમાનોની સંખ્યા અને તમે કેટલા દિવસ સાઇટ પર હતા તે ભરો. મુલાકાતી ખરેખર આ આંકડા જ જુએ છે.',
      },
      {
        en: 'Tick the services you used, and choose the kind of function and the town. That is what puts this job on the right service page and the right town page.',
        gu: 'તમે વાપરેલી સેવાઓ પર ટિક કરો, અને પ્રસંગનો પ્રકાર અને ગામ પસંદ કરો. તેનાથી જ આ કામ સાચા સેવા-પાના અને સાચા ગામ-પાના પર દેખાશે.',
      },
      {
        en: 'Add the photographs. One cover photo, then as many gallery photos as you have. A before-and-after pair is worth ten ordinary photos.',
        gu: 'ફોટા ઉમેરો. એક કવર ફોટો, અને પછી તમારી પાસે હોય તેટલા ગેલેરી ફોટા. પહેલાં-પછીની જોડી દસ સામાન્ય ફોટા બરાબર છે.',
      },
      {
        en: 'Set the status to Published and save. It appears on the site within a minute.',
        gu: 'સ્થિતિ Published કરો અને સાચવો. એક મિનિટમાં સાઇટ પર દેખાશે.',
      },
    ],
    notes: [
      {
        en: 'Leave it as Draft while you are still gathering photographs. Nobody sees a draft.',
        gu: 'ફોટા ભેગા કરતા હો ત્યાં સુધી Draft રાખો. ડ્રાફ્ટ કોઈને દેખાતો નથી.',
      },
      {
        en: 'A client quote goes on the project only with that family’s permission. Ask before you type it.',
        gu: 'યજમાનનો અભિપ્રાય તે પરિવારની રજા લીધા પછી જ મૂકો. લખતાં પહેલાં પૂછો.',
      },
    ],
  },
  {
    id: 'media',
    href: '/admin/media',
    title: { en: 'Photographs', gu: 'ફોટા' },
    intro: {
      en: 'Every photograph on the site lives here. Upload once, use it anywhere.',
      gu: 'સાઇટ પરનો દરેક ફોટો અહીં રહે છે. એક વાર અપલોડ કરો, ગમે ત્યાં વાપરો.',
    },
    steps: [
      {
        en: 'Drag photographs in, or tap Upload. Straight from the phone is fine — the site shrinks them for you.',
        gu: 'ફોટા ખેંચીને મૂકો, અથવા Upload દબાવો. ફોનમાંથી સીધા હોય તો પણ ચાલશે — સાઇટ પોતે તેને નાના કરી લે છે.',
      },
      {
        en: 'Write a one-line description of each photograph in both languages. It is what a blind visitor hears and what Google reads. “Red and gold mandap at Wadhwan” — not “DSC_4471”.',
        gu: 'દરેક ફોટાનું એક લીટીનું વર્ણન બંને ભાષામાં લખો. અંધ મુલાકાતીને એ સંભળાય છે અને ગૂગલ એ જ વાંચે છે. “વઢવાણમાં લાલ-સોનેરી મંડપ” — “DSC_4471” નહીં.',
      },
    ],
    notes: [
      {
        en: 'Landscape photographs work better than portrait everywhere on this site.',
        gu: 'આ સાઇટ પર બધે જ આડા (landscape) ફોટા ઊભા કરતાં સારા દેખાય છે.',
      },
      {
        en: 'Do not upload a photograph you did not take, and do not upload a stock picture of somebody else’s mandap. The whole point is that this is your work.',
        gu: 'તમે ન પાડેલો ફોટો ન ચઢાવો, અને બીજા કોઈના મંડપનો સ્ટોક ફોટો તો બિલકુલ નહીં. આખો મુદ્દો એ છે કે આ તમારું કામ છે.',
      },
    ],
  },
  {
    id: 'services',
    href: '/admin/services',
    title: { en: 'Services', gu: 'સેવાઓ' },
    intro: {
      en: 'The fourteen things you set up, each with its own page. These pages are what bring people in from Google.',
      gu: 'તમે ગોઠવો છો તે ચૌદ વસ્તુઓ, દરેકનું પોતાનું પાનું. ગૂગલ પરથી લોકો આ પાનાં દ્વારા જ આવે છે.',
    },
    steps: [
      {
        en: 'Open a service to change its description, what is included, the sizes you carry, and the questions people ask about it.',
        gu: 'સેવા ખોલીને તેનું વર્ણન, શું-શું આવે છે, તમારી પાસેનાં માપ, અને લોકો પૂછે તે સવાલો બદલો.',
      },
      {
        en: 'Check the specification tables against your own equipment. They were written as a starting point, not from your godown.',
        gu: 'માપની યાદી તમારાં પોતાનાં સાધનો સામે તપાસી લો. તે શરૂઆત માટે લખાયેલી છે, તમારા ગોડાઉન જોઈને નહીં.',
      },
    ],
    notes: [
      {
        en: 'Do not change the web address of a service once Google knows it. Turn a service off instead of deleting it.',
        gu: 'ગૂગલને ખબર પડી ગયા પછી સેવાનું વેબ સરનામું ન બદલો. સેવા કાઢી નાખવાને બદલે બંધ કરો.',
      },
    ],
  },
  {
    id: 'reviews',
    href: '/admin/testimonials',
    title: { en: 'Reviews', gu: 'અભિપ્રાય' },
    intro: {
      en: 'Real reviews from real families. The page is empty until you add some, and it says so honestly.',
      gu: 'સાચા પરિવારોના સાચા અભિપ્રાય. તમે ઉમેરો નહીં ત્યાં સુધી પાનું ખાલી રહે છે, અને પ્રામાણિકપણે એમ જ કહે છે.',
    },
    steps: [
      {
        en: 'Ask a happy family for two lines on WhatsApp. Ask if you may put it on the website. Then type it here with their name and town.',
        gu: 'ખુશ થયેલા પરિવાર પાસે વોટ્સએપ પર બે લીટી માંગો. વેબસાઇટ પર મૂકવાની રજા લો. પછી તેમના નામ અને ગામ સાથે અહીં લખો.',
      },
    ],
    notes: [
      {
        en: 'Never write a review yourself. A made-up review is the fastest way to lose the trust the rest of the site is built on — and Google is good at spotting them.',
        gu: 'અભિપ્રાય જાતે ક્યારેય ન લખો. બનાવટી અભિપ્રાય એ બાકીની આખી સાઇટે ઊભો કરેલો ભરોસો ગુમાવવાનો સૌથી ઝડપી રસ્તો છે — અને ગૂગલ તે પકડી પાડે છે.',
      },
    ],
  },
  {
    id: 'blog',
    href: '/admin/blog',
    title: { en: 'Guides', gu: 'માર્ગદર્શિકા' },
    intro: {
      en: 'Eight articles answering what people actually ask before they book. They bring in visitors who are not yet ready to ring.',
      gu: 'બુક કરતાં પહેલાં લોકો ખરેખર જે પૂછે છે તેના જવાબ આપતા આઠ લેખ. હજી ફોન કરવા તૈયાર ન હોય તેવા મુલાકાતીઓ આનાથી આવે છે.',
    },
    steps: [
      {
        en: 'Read each one and correct anything that is not true of your business — especially the numbers.',
        gu: 'દરેક લેખ વાંચો અને તમારા ધંધા માટે સાચી ન હોય તેવી કોઈપણ વાત સુધારો — ખાસ કરીને આંકડા.',
      },
      {
        en: 'To write a new one: New post, write in the editor, add a cover photograph, then Publish.',
        gu: 'નવો લખવા માટે: New post, એડિટરમાં લખો, કવર ફોટો ઉમેરો, પછી Publish કરો.',
      },
    ],
  },
  {
    id: 'pages',
    href: '/admin/sections',
    title: { en: 'The home page', gu: 'હોમ પેજ' },
    intro: {
      en: 'The home page is built from blocks you can reorder, hide and adjust. Pages & sections is where you do it.',
      gu: 'હોમ પેજ બ્લોકમાંથી બનેલું છે, જેને તમે આગળ-પાછળ કરી શકો, છુપાવી શકો અને બદલી શકો. તે Pages & sections માં થાય છે.',
    },
    steps: [
      {
        en: 'Drag a block up or down to move it. Tap the eye to hide it. Tap the block to change its settings.',
        gu: 'બ્લોકને ઉપર-નીચે ખેંચીને ખસેડો. છુપાવવા માટે આંખ દબાવો. તેની સેટિંગ બદલવા બ્લોક પર દબાવો.',
      },
    ],
    notes: [
      {
        en: 'Hiding a block is not deleting it. Bring it back whenever you like.',
        gu: 'બ્લોક છુપાવવો એટલે કાઢી નાખવો નહીં. ગમે ત્યારે પાછો લાવી શકાય છે.',
      },
    ],
  },
  {
    id: 'announcements',
    href: '/admin/announcements',
    title: { en: 'The strip at the top', gu: 'ઉપરની પટ્ટી' },
    intro: {
      en: 'The thin bar above the menu. Use it for one thing at a time: dates filling up, a festival offer, a phone number that changed.',
      gu: 'મેનૂની ઉપરની પાતળી પટ્ટી. એક વખતે એક જ વાત માટે વાપરો: તારીખો ભરાઈ રહી છે, તહેવારની ઓફર, બદલાયેલો ફોન નંબર.',
    },
    notes: [
      {
        en: 'Switch it off when it stops being true. A bar still advertising last season makes the whole site look abandoned.',
        gu: 'સાચી ન રહે ત્યારે તેને બંધ કરો. ગઈ સીઝનની જાહેરાત કરતી પટ્ટી આખી સાઇટને ત્યજી દીધેલી બતાવે છે.',
      },
    ],
  },
  {
    id: 'settings',
    href: '/admin/settings',
    title: { en: 'Business details', gu: 'ધંધાની વિગત' },
    intro: {
      en: 'Your name, address, phone, WhatsApp and email. These appear in the footer, on the contact page, in every enquiry email and in what Google reads.',
      gu: 'તમારું નામ, સરનામું, ફોન, વોટ્સએપ અને ઈમેલ. આ ફૂટરમાં, સંપર્ક પાના પર, દરેક પૂછપરછના ઈમેલમાં અને ગૂગલ જે વાંચે છે તેમાં દેખાય છે.',
    },
    steps: [
      {
        en: 'Fill in everything showing [TBD]. Until you do, the site shows [TBD] to visitors rather than inventing something.',
        gu: 'જ્યાં [TBD] દેખાય તે બધું ભરો. ત્યાં સુધી સાઇટ કંઈ બનાવી કાઢવાને બદલે મુલાકાતીઓને [TBD] જ બતાવે છે.',
      },
    ],
    notes: [
      {
        en: 'Write the address exactly the same way here, on Google Business Profile and on JustDial. Different versions of the same address is the commonest reason a local business ranks below its neighbour.',
        gu: 'સરનામું અહીં, ગૂગલ બિઝનેસ પ્રોફાઇલ પર અને જસ્ટડાયલ પર બિલકુલ એકસરખું લખો. એક જ સરનામાના જુદા-જુદા રૂપ એ સ્થાનિક ધંધો પાડોશી કરતાં પાછળ રહી જવાનું સૌથી સામાન્ય કારણ છે.',
      },
    ],
  },
  {
    id: 'estimator',
    href: '/admin/settings/estimator',
    title: { en: 'The quote estimator', gu: 'ભાવ અંદાજ' },
    intro: {
      en: 'What the quote form uses to show a rough range. Until you set base prices it shows no figure at all and tells the visitor a quote follows a site visit — which is the safe default, not a fault.',
      gu: 'ભાવ-ફોર્મ આશરે રેન્જ બતાવવા માટે આનો ઉપયોગ કરે છે. તમે પાયાના ભાવ ન નાખો ત્યાં સુધી તે કોઈ આંકડો બતાવતું નથી અને મુલાકાતીને કહે છે કે રૂબરૂ મુલાકાત પછી ભાવ મળશે — એ સલામત વ્યવસ્થા છે, ખામી નહીં.',
    },
    notes: [
      {
        en: 'Set the base prices low. A visitor who is told ₹40,000 and then quoted ₹90,000 does not book; a visitor told ₹40,000 and quoted ₹45,000 does.',
        gu: 'પાયાના ભાવ નીચા રાખો. ₹40,000 સાંભળીને પછી ₹90,000નો ભાવ મળે તે માણસ બુક કરતો નથી; ₹40,000 સાંભળીને ₹45,000 મળે તે કરે છે.',
      },
    ],
  },
  {
    id: 'features',
    href: '/admin/settings/features',
    title: { en: 'Extra features', gu: 'વધારાની સુવિધાઓ' },
    intro: {
      en: 'Five optional additions, all switched off. Turn one on, look at the site, turn it off again if you do not like it. Anything switched off is not sent to the visitor at all, so it costs your visitors nothing.',
      gu: 'પાંચ મરજિયાત ઉમેરણ, બધાં બંધ. એક ચાલુ કરો, સાઇટ જુઓ, ન ગમે તો પાછું બંધ કરો. બંધ હોય તે મુલાકાતી સુધી પહોંચતું જ નથી, એટલે તેમને કંઈ ભાર પડતો નથી.',
    },
    notes: [
      {
        en: 'The muhurat countdown needs dates. Get them from whoever the family uses for the panchang — nobody has filled them in, because the wrong dates would be worse than none.',
        gu: 'મુહૂર્તની ગણતરી માટે તારીખો જોઈએ. પરિવાર જેમની પાસે પંચાંગ જુએ છે તેમની પાસેથી લો — કોઈએ ભરી નથી, કારણ કે ખોટી તારીખો કરતાં એકેય ન હોવી સારી.',
      },
      {
        en: 'The popup brings enquiries and it also irritates people. If you turn it on, watch the enquiry count for two weeks either side. If it does not move, turn it off.',
        gu: 'પોપઅપથી પૂછપરછ વધે છે અને લોકોને ખીજ પણ ચઢે છે. ચાલુ કરો તો આગળ-પાછળ બે અઠવાડિયાં પૂછપરછની સંખ્યા જુઓ. ફેર ન પડે તો બંધ કરી દો.',
      },
    ],
  },
  {
    id: 'users',
    href: '/admin/users',
    title: { en: 'Who else can sign in', gu: 'બીજું કોણ લોગિન કરી શકે' },
    intro: {
      en: 'Give each person their own account. Sharing one login means the record of who changed what is worthless — and that record is the only way to work out what went wrong later.',
      gu: 'દરેક માણસને પોતાનું ખાતું આપો. એક જ લોગિન વહેંચવાથી કોણે શું બદલ્યું તેની નોંધ નકામી થઈ જાય છે — અને પછી શું ખોટું થયું તે શોધવાનો એ એક જ રસ્તો છે.',
    },
    steps: [
      {
        en: 'Add somebody: their name, their email, and whether they are an Editor or an Admin.',
        gu: 'કોઈને ઉમેરો: તેમનું નામ, ઈમેલ, અને તે Editor છે કે Admin.',
      },
      {
        en: 'An Editor can change everything on the public site. An Admin can also add people and see the audit log. Most people should be Editors.',
        gu: 'Editor જાહેર સાઇટ પરની બધી વસ્તુ બદલી શકે છે. Admin ઉપરાંત માણસો ઉમેરી શકે અને ઓડિટ લોગ જોઈ શકે. મોટા ભાગના લોકો Editor જ હોવા જોઈએ.',
      },
      {
        en: 'The password is generated and shown to you once. Write it down and give it to them in person or by SMS — not on WhatsApp. It cannot be shown again; if it is lost, tap New password.',
        gu: 'પાસવર્ડ આપોઆપ બને છે અને તમને એક જ વાર દેખાય છે. લખી લો અને રૂબરૂ કે એસએમએસથી આપો — વોટ્સએપ પર નહીં. તે ફરી બતાવી શકાતો નથી; ખોવાઈ જાય તો New password દબાવો.',
      },
      {
        en: 'When somebody leaves, switch their account off. That stops them signing in and keeps their name on the work they did.',
        gu: 'કોઈ છોડી જાય ત્યારે તેમનું ખાતું બંધ કરો. તેનાથી તે લોગિન કરી શકતા નથી અને તેમણે કરેલા કામ પર તેમનું નામ રહે છે.',
      },
    ],
    notes: [
      {
        en: 'Removing an account for good is there for one thing only: an email typed wrongly when the account was made. For everybody else, switch off instead.',
        gu: 'ખાતું કાયમ માટે કાઢી નાખવાનું ફક્ત એક જ કારણ માટે છે: ખાતું બનાવતી વખતે ઈમેલ ખોટો લખાયો હોય. બાકી બધા માટે બંધ કરો, કાઢી ન નાખો.',
      },
      {
        en: 'You cannot switch off your own account, and the last admin cannot be switched off or demoted. That is on purpose — otherwise nobody would be left who could switch it back.',
        gu: 'તમે તમારું પોતાનું ખાતું બંધ કરી શકતા નથી, અને છેલ્લા એડમિનને બંધ કે નીચે કરી શકાતું નથી. એ જાણીજોઈને છે — નહીંતર પાછું ચાલુ કરી શકે એવું કોઈ બચે નહીં.',
      },
    ],
  },
  {
    id: 'audit',
    href: '/admin/audit',
    title: { en: 'Who changed what', gu: 'કોણે શું બદલ્યું' },
    intro: {
      en: 'Every change anybody makes through this panel is written down automatically — who, what, when. Nobody can edit it, including you.',
      gu: 'આ પેનલમાંથી કોઈ પણ કરેલો દરેક ફેરફાર આપોઆપ નોંધાય છે — કોણે, શું, ક્યારે. તેને કોઈ બદલી શકતું નથી, તમે પણ નહીં.',
    },
    notes: [
      {
        en: 'Use it when something on the site is not what you expected. Filter by what was changed — Project, Service, Settings — and the answer is usually in the top few lines.',
        gu: 'સાઇટ પર કંઈ તમારી ધારણા મુજબ ન હોય ત્યારે તે વાપરો. શું બદલાયું તેના પરથી ગાળો — Project, Service, Settings — અને જવાબ સામાન્ય રીતે ઉપરની થોડી લીટીઓમાં જ મળી જાય છે.',
      },
    ],
  },
  {
    id: 'rules',
    title: { en: 'Four rules worth keeping', gu: 'સાચવવા જેવા ચાર નિયમ' },
    intro: {
      en: 'The website was built on these. Break them and it slowly stops working.',
      gu: 'વેબસાઇટ આ ચાર વાત પર બનેલી છે. તોડશો તો ધીમે ધીમે કામ કરવાનું બંધ કરશે.',
    },
    steps: [
      {
        en: 'Never write something you cannot stand behind. No made-up review, no number of functions you have not done, no price you will not honour.',
        gu: 'જેની પાછળ ઊભા ન રહી શકો તેવું કંઈ ન લખો. બનાવટી અભિપ્રાય નહીં, ન કરેલા પ્રસંગોની સંખ્યા નહીં, ન પાળી શકાય તેવો ભાવ નહીં.',
      },
      {
        en: 'Keep your name, address and phone identical everywhere — this site, Google, JustDial, your visiting card.',
        gu: 'તમારું નામ, સરનામું અને ફોન બધે એકસરખાં રાખો — આ સાઇટ, ગૂગલ, જસ્ટડાયલ, તમારું વિઝિટિંગ કાર્ડ.',
      },
      {
        en: 'Add one function a month with photographs. That habit alone will do more for the site than anything else on this page.',
        gu: 'મહિને એક પ્રસંગ ફોટા સાથે ઉમેરો. આ એક ટેવ જ સાઇટ માટે આ પાના પરની બીજી બધી વાતો કરતાં વધુ કરશે.',
      },
      {
        en: 'Fill in both languages every time. Half the district searches in Gujarati.',
        gu: 'દર વખતે બંને ભાષામાં ભરો. અડધો જિલ્લો ગુજરાતીમાં શોધે છે.',
      },
    ],
  },
  {
    id: 'trouble',
    title: { en: 'If something looks wrong', gu: 'કંઈ ખોટું લાગે તો' },
    intro: {
      en: 'In order, these fix almost everything.',
      gu: 'ક્રમમાં, આનાથી લગભગ બધું ઠીક થઈ જાય છે.',
    },
    steps: [
      {
        en: 'Wait a minute and reload. Pages are stored ready-made for speed; a change takes up to a minute to appear.',
        gu: 'એક મિનિટ રાહ જુઓ અને પાનું ફરી ખોલો. ઝડપ માટે પાનાં તૈયાર રાખેલાં હોય છે; ફેરફાર દેખાતાં એક મિનિટ લાગી શકે.',
      },
      {
        en: 'Check you saved. The Save button turns and says so when it worked.',
        gu: 'સાચવ્યું છે કે નહીં તે તપાસો. સાચવાય ત્યારે Save બટન ફરે છે અને કહે છે.',
      },
      {
        en: 'Check you filled in both languages. A missing Gujarati line shows as a blank on the Gujarati page.',
        gu: 'બંને ભાષા ભરી છે કે નહીં તે તપાસો. ગુજરાતી લીટી ખૂટતી હોય તો ગુજરાતી પાના પર ખાલી દેખાય છે.',
      },
      {
        en: 'Change it back to what it was. Nothing here is permanent.',
        gu: 'જે હતું તે પાછું કરી નાખો. અહીં કંઈ કાયમી નથી.',
      },
    ],
  },
];
