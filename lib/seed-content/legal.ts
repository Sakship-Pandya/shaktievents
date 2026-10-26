import type { Localized } from '../services';

/**
 * The privacy policy and terms, written from what this site actually does
 * rather than from a template: the enquiry form's real fields, the three
 * services it genuinely talks to, and the one cookie it genuinely sets.
 *
 * Anything that depends on a business fact nobody has confirmed — the postal
 * address, the contact email, how long enquiries are kept — reads from
 * settings or renders [TBD], the same as everywhere else on the site.
 */
export type LegalSection = { heading: Localized; body: Localized[] };

export type LegalDocument = {
  path: string;
  title: Localized;
  intro: Localized;
  /** ISO date the wording last changed. Bump it when you edit the text. */
  updated: string;
  sections: LegalSection[];
};

const UPDATED = '2026-09-07';

export const privacyPolicy: LegalDocument = {
  path: '/privacy-policy',
  updated: UPDATED,
  title: { en: 'Privacy policy', gu: 'ગોપનીયતા નીતિ' },
  intro: {
    en: 'What we collect when you contact us, why, and what we do not do with it. In short: we use your details to answer your enquiry and to do the job. We do not sell them.',
    gu: 'તમે અમારો સંપર્ક કરો ત્યારે અમે શું માહિતી લઈએ છીએ, શા માટે, અને શું નથી કરતા. ટૂંકમાં: તમારી માહિતી ફક્ત તમારી પૂછપરછનો જવાબ આપવા અને કામ કરવા વપરાય છે. અમે તે વેચતા નથી.',
  },
  sections: [
    {
      heading: { en: 'What the enquiry form collects', gu: 'પૂછપરછ ફોર્મ શું માંગે છે' },
      body: [
        {
          en: 'Your name and mobile number, because we cannot quote without ringing you back. Everything else is optional: email, town, kind of function, date, number of guests, the services you are after, and anything you write in the message box.',
          gu: 'તમારું નામ અને મોબાઇલ નંબર — કારણ કે તમને ફોન કર્યા વગર ભાવ આપી શકાતો નથી. બાકી બધું મરજિયાત છે: ઈમેલ, ગામ, પ્રસંગનો પ્રકાર, તારીખ, મહેમાનોની સંખ્યા, જોઈતી સેવાઓ, અને સંદેશમાં તમે જે લખો તે.',
        },
        {
          en: 'We also record which page you sent the enquiry from, and any campaign tags in the link you arrived through. That tells us which parts of the site actually bring work in. It says nothing about you personally.',
          gu: 'તમે કઈ પાનેથી પૂછપરછ મોકલી અને તમે જે લિંક દ્વારા આવ્યા તેમાં કોઈ ઝુંબેશનું ટેગ હોય તો તે પણ નોંધાય છે. તેનાથી અમને ખબર પડે છે કે સાઇટના કયા ભાગથી કામ મળે છે. તેમાં તમારા વિશે વ્યક્તિગત કંઈ હોતું નથી.',
        },
      ],
    },
    {
      heading: { en: 'What we do with it', gu: 'અમે તેનું શું કરીએ છીએ' },
      body: [
        {
          en: 'We ring you back, give you a quote, and if you book, we use the details to run the job. The enquiry is stored in our own database and a copy is emailed to us so nothing is missed.',
          gu: 'અમે તમને સામો ફોન કરીએ છીએ, ભાવ આપીએ છીએ, અને તમે બુક કરો તો કામ પાર પાડવા માટે એ માહિતી વાપરીએ છીએ. પૂછપરછ અમારા પોતાના ડેટાબેઝમાં સચવાય છે અને એક નકલ ઈમેલથી અમને આવે છે, જેથી કંઈ ચૂકી ન જવાય.',
        },
        {
          en: 'We do not sell your details, we do not pass them to anyone who is not working on your function, and we do not add you to a marketing list you did not ask for.',
          gu: 'અમે તમારી માહિતી વેચતા નથી, તમારા પ્રસંગ પર કામ ન કરતા હોય તેવા કોઈને આપતા નથી, અને તમે માંગ્યા વગર કોઈ પ્રચાર યાદીમાં ઉમેરતા નથી.',
        },
      ],
    },
    {
      heading: { en: 'Who else sees it', gu: 'બીજું કોણ જુએ છે' },
      body: [
        {
          en: 'Three services help this website run, and each sees only the part it needs: our web host, which serves the pages; the email service that delivers the enquiry to our inbox; and the image service that stores and serves the photographs. None of them is given your enquiry for their own use.',
          gu: 'આ વેબસાઇટ ચલાવવામાં ત્રણ સેવાઓ મદદ કરે છે, અને દરેક ફક્ત પોતાને જરૂરી ભાગ જ જુએ છે: પાનાં પીરસતું વેબ હોસ્ટ; પૂછપરછ અમારા ઈનબોક્સમાં પહોંચાડતી ઈમેલ સેવા; અને ફોટા સાચવતી અને બતાવતી ઈમેજ સેવા. તેમાંથી કોઈને પણ તમારી પૂછપરછ પોતાના ઉપયોગ માટે આપવામાં આવતી નથી.',
        },
        {
          en: 'When you tap the WhatsApp or call button, your own phone opens your own app. We receive nothing until you actually send the message or place the call.',
          gu: 'તમે વોટ્સએપ કે કૉલ બટન દબાવો ત્યારે તમારા જ ફોનમાં તમારી જ એપ ખૂલે છે. તમે ખરેખર સંદેશ મોકલો કે ફોન કરો ત્યાં સુધી અમને કંઈ મળતું નથી.',
        },
      ],
    },
    {
      heading: { en: 'Cookies', gu: 'કૂકીઝ' },
      body: [
        {
          en: 'This site sets no advertising cookies and no tracking cookies. There is one login cookie, and it only exists for the people who manage the site — not for visitors.',
          gu: 'આ સાઇટ કોઈ જાહેરાતની કૂકી કે ટ્રેકિંગ કૂકી મૂકતી નથી. એક લોગિન કૂકી છે, અને તે ફક્ત સાઇટ સંભાળનારા માટે છે — મુલાકાતીઓ માટે નહીં.',
        },
        {
          en: 'Your browser may remember small things to make the site pleasanter — that you already closed a message, for example. That stays in your browser and never reaches us.',
          gu: 'સાઇટ વધુ સરળ લાગે તે માટે તમારું બ્રાઉઝર નાની-નાની બાબતો યાદ રાખી શકે છે — જેમ કે તમે કોઈ સંદેશ બંધ કરી દીધો છે. તે તમારા બ્રાઉઝરમાં જ રહે છે અને અમારા સુધી ક્યારેય પહોંચતું નથી.',
        },
      ],
    },
    {
      heading: { en: 'How long we keep it', gu: 'અમે કેટલો સમય રાખીએ છીએ' },
      body: [
        {
          en: 'Enquiries that turn into bookings are kept with the job records. Enquiries that do not are kept while there is still a chance of the work, and cleared out after that. Ask us and we will delete yours.',
          gu: 'બુકિંગમાં ફેરવાતી પૂછપરછ કામના રેકોર્ડ સાથે સચવાય છે. જે ન ફેરવાય તે કામ મળવાની શક્યતા હોય ત્યાં સુધી રખાય છે, પછી કાઢી નાખવામાં આવે છે. તમે કહો તો અમે તમારી માહિતી ભૂંસી નાખીશું.',
        },
      ],
    },
    {
      heading: { en: 'Your say', gu: 'તમારો હક' },
      body: [
        {
          en: 'Ring or write and you can ask what we hold about you, ask us to correct it, or ask us to delete it. There is no form to fill in — a phone call is enough.',
          gu: 'ફોન કરો કે લખો — તમે પૂછી શકો છો કે અમારી પાસે તમારા વિશે શું છે, સુધારવાનું કહી શકો છો, કે ભૂંસી નાખવાનું કહી શકો છો. કોઈ ફોર્મ ભરવાની જરૂર નથી — એક ફોન બસ છે.',
        },
        {
          en: 'This site is not meant for children, and we do not knowingly collect anything about them.',
          gu: 'આ સાઇટ બાળકો માટે નથી, અને અમે જાણીજોઈને તેમના વિશે કંઈ એકઠું કરતા નથી.',
        },
      ],
    },
  ],
};

export const terms: LegalDocument = {
  path: '/terms',
  updated: UPDATED,
  title: { en: 'Terms of use', gu: 'ઉપયોગની શરતો' },
  intro: {
    en: 'What this website is and is not. The binding terms of any job are the ones written on your quote — this page covers the site itself.',
    gu: 'આ વેબસાઇટ શું છે અને શું નથી. કોઈપણ કામની બંધનકર્તા શરતો તમારા ભાવપત્રક પર લખેલી હોય તે જ છે — આ પાનું ફક્ત સાઇટ વિશે છે.',
  },
  sections: [
    {
      heading: {
        en: 'The site is an introduction, not a contract',
        gu: 'સાઇટ એ ઓળખાણ છે, કરાર નથી',
      },
      body: [
        {
          en: 'Everything here describes what we set up and roughly what it involves. Nothing on this website is an offer you can accept by clicking. A job starts when we have seen your venue, given you a written quote, and you have accepted it.',
          gu: 'અહીં જે છે તે અમે શું ગોઠવીએ છીએ અને તેમાં આશરે શું આવે તેનું વર્ણન છે. આ વેબસાઇટ પરની કોઈ વસ્તુ ક્લિક કરીને સ્વીકારી શકાય તેવી ઓફર નથી. કામ ત્યારે શરૂ થાય જ્યારે અમે તમારી જગ્યા જોઈ લીધી હોય, લેખિત ભાવ આપ્યો હોય, અને તમે તે સ્વીકાર્યો હોય.',
        },
      ],
    },
    {
      heading: { en: 'Estimates are estimates', gu: 'અંદાજ એ અંદાજ છે' },
      body: [
        {
          en: 'Any figure or range the site shows you is a rough guide worked out from the answers you gave. The real price depends on the venue, the dates, the material and how much of it — which is what the site visit is for. The quote we hand you is the price.',
          gu: 'સાઇટ તમને જે આંકડો કે રેન્જ બતાવે તે તમે આપેલા જવાબો પરથી કાઢેલો આશરે અંદાજ છે. સાચી કિંમત જગ્યા, તારીખ, સામગ્રી અને તેના જથ્થા પર આધાર રાખે છે — અને એટલા માટે જ રૂબરૂ મુલાકાત હોય છે. અમે તમારા હાથમાં આપીએ તે ભાવપત્રક એ જ કિંમત છે.',
        },
        {
          en: 'The same goes for dates. A date shown as open is open at the time you looked; lagan season fills up quickly, and only a confirmed booking holds a date.',
          gu: 'તારીખો માટે પણ એ જ. ખુલ્લી બતાવેલી તારીખ તમે જોઈ તે વખતે ખુલ્લી હતી; લગ્નસરામાં તારીખો ઝડપથી ભરાય છે, અને તારીખ ફક્ત પાકા બુકિંગથી જ રોકાય છે.',
        },
      ],
    },
    {
      heading: { en: 'The photographs', gu: 'ફોટા વિશે' },
      body: [
        {
          en: 'Photographs show work we have done. Every function is different — the venue, the light, the flowers of that season — so treat them as the standard of work, not as a catalogue to order from.',
          gu: 'ફોટામાં અમે કરેલું કામ છે. દરેક પ્રસંગ જુદો હોય છે — જગ્યા, પ્રકાશ, તે મોસમનાં ફૂલ — એટલે તેને કામના ધોરણ તરીકે જુઓ, ઓર્ડર આપવાની યાદી તરીકે નહીં.',
        },
        {
          en: 'The photographs and the writing on this site are ours. Please do not copy them onto another business’s website or listing.',
          gu: 'આ સાઇટના ફોટા અને લખાણ અમારાં છે. કૃપા કરીને તે બીજા કોઈ ધંધાની વેબસાઇટ કે લિસ્ટિંગ પર ન મૂકો.',
        },
      ],
    },
    {
      heading: { en: 'If something here is wrong', gu: 'અહીં કંઈ ખોટું હોય તો' },
      body: [
        {
          en: 'We keep this site accurate and we will fix a mistake as soon as it is pointed out. But a website can go down, a page can be out of date, and a specification can change with the equipment. For anything that matters to your function, ring us and get it in writing.',
          gu: 'અમે આ સાઇટ સાચી રાખીએ છીએ અને ભૂલ ધ્યાનમાં આવતાં જ સુધારીએ છીએ. છતાં વેબસાઇટ બંધ પડી શકે, પાનું જૂનું હોઈ શકે, અને સાધન બદલાતાં માપ પણ બદલાઈ શકે. તમારા પ્રસંગ માટે મહત્ત્વની હોય તેવી કોઈપણ વાત માટે ફોન કરો અને લેખિતમાં લો.',
        },
      ],
    },
    {
      heading: { en: 'Where we are', gu: 'અમે ક્યાં છીએ' },
      body: [
        {
          en: 'We work out of Surendranagar and across the district. Any dispute about this website or about work we do is dealt with under Indian law, in the courts of Surendranagar, Gujarat.',
          gu: 'અમે સુરેન્દ્રનગરથી કામ કરીએ છીએ અને આખા જિલ્લામાં સેવા આપીએ છીએ. આ વેબસાઇટ કે અમારા કામ અંગેનો કોઈપણ વિવાદ ભારતીય કાયદા હેઠળ, સુરેન્દ્રનગર, ગુજરાતની અદાલતોમાં ચાલશે.',
        },
      ],
    },
  ],
};

export const legalDocuments = [privacyPolicy, terms];
