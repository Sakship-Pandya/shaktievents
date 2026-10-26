import type { Localized } from '../services';

/**
 * Site-wide FAQs, shown on /faq and the home page. Service-specific questions
 * live with their service copy in seed-content/services.
 *
 * These render with FAQPage JSON-LD, so every answer has to be something the
 * business can stand behind. Where a real number would be needed and the
 * client has not supplied one, the answer describes the process instead of
 * inventing a figure.
 */
export type SeedFaq = {
  scope: 'GLOBAL';
  question: Localized;
  answer: Localized;
};

export const faqs: SeedFaq[] = [
  {
    scope: 'GLOBAL',
    question: {
      en: 'How far in advance should I book?',
      gu: 'કેટલા વહેલા બુકિંગ કરાવવું જોઈએ?',
    },
    answer: {
      en: 'As soon as your muhurat is fixed. Lagan season dates go first, and the same weekend is often wanted by several families. Send us the date on WhatsApp and we will tell you straight away whether it is open, tight or already taken.',
      gu: 'મુહૂર્ત નક્કી થાય કે તરત. લગ્નની સિઝનની તારીખો પહેલી ભરાય છે, અને એક જ વીકએન્ડ ઘણા પરિવારોને જોઈતો હોય છે. WhatsApp પર તારીખ મોકલો, અમે તરત જણાવીશું કે એ ખાલી છે, ટાઈટ છે કે ભરાઈ ગઈ છે.',
    },
  },
  {
    scope: 'GLOBAL',
    question: {
      en: 'Do you visit the venue before quoting?',
      gu: 'ભાવ આપતાં પહેલાં જગ્યા જોવા આવો છો?',
    },
    answer: {
      en: 'Yes. We measure the ground, check where the power comes from, look at the entry for our trucks and note where the sun sits in the afternoon. A quote written without seeing the ground is a guess, and guesses go wrong on setup day.',
      gu: 'હા. અમે મેદાન માપીએ છીએ, લાઇટનું કનેક્શન ક્યાંથી છે એ જોઈએ છીએ, ગાડી અંદર આવવાનો રસ્તો તપાસીએ છીએ અને બપોરે તડકો ક્યાં પડે છે એ નોંધીએ છીએ. જગ્યા જોયા વગરનો ભાવ અંદાજ જ હોય, અને અંદાજ સેટઅપના દિવસે ખોટા પડે છે.',
    },
  },
  {
    scope: 'GLOBAL',
    question: {
      en: 'What decides the price?',
      gu: 'ભાવ શેના પર નક્કી થાય છે?',
    },
    answer: {
      en: 'Five things: how big the setup is, how many days it stands, how far the venue is from our godown, which season the date falls in, and how much of the decoration is fresh flower work. Change any one and the number moves, which is why we quote after the site visit rather than over the phone.',
      gu: 'પાંચ બાબતો: સેટઅપ કેટલું મોટું છે, કેટલા દિવસ ઊભું રહેશે, જગ્યા અમારા ગોડાઉનથી કેટલી દૂર છે, તારીખ કઈ સિઝનમાં આવે છે, અને સજાવટમાં તાજા ફૂલનું કામ કેટલું છે. એકેય બદલાય તો આંકડો બદલાય — એટલે અમે ફોન પર નહીં, સાઇટ વિઝિટ પછી ભાવ આપીએ છીએ.',
    },
  },
  {
    scope: 'GLOBAL',
    question: {
      en: 'Do you work outside Surendranagar city?',
      gu: 'સુરેન્દ્રનગર શહેરની બહાર કામ કરો છો?',
    },
    answer: {
      en: 'We work across Surendranagar district — Wadhwan, Limbdi, Dhrangadhra, Chotila, Sayla, Thangadh, Lakhtar, Muli, Halvad, Patdi and Chuda — and travel further into Saurashtra for larger functions. Distance affects transport cost, so tell us the village along with the date.',
      gu: 'અમે આખા સુરેન્દ્રનગર જિલ્લામાં કામ કરીએ છીએ — વઢવાણ, લીંબડી, ધ્રાંગધ્રા, ચોટીલા, સાયલા, થાનગઢ, લખતર, મૂળી, હળવદ, પાટડી અને ચૂડા — અને મોટા પ્રસંગો માટે સૌરાષ્ટ્રમાં આગળ પણ જઈએ છીએ. અંતર પ્રમાણે વાહનનો ખર્ચ બદલાય, એટલે તારીખ સાથે ગામનું નામ પણ જણાવો.',
    },
  },
  {
    scope: 'GLOBAL',
    question: {
      en: 'Is the equipment yours, or do you rent it in?',
      gu: 'સામાન તમારો પોતાનો છે કે ભાડે લાવો છો?',
    },
    answer: {
      en: 'The structures, sound, lighting and furniture are our own, kept in our godown and counted before every load. That is why we can commit to a setup time — we are not waiting on someone else to release stock the week of your function.',
      gu: 'સ્ટ્રક્ચર, સાઉન્ડ, લાઇટિંગ અને ફર્નિચર અમારાં પોતાનાં છે, અમારા ગોડાઉનમાં રહે છે અને દરેક લોડ પહેલાં ગણાય છે. એટલે જ અમે સેટઅપનો સમય આપી શકીએ છીએ — તમારા પ્રસંગના અઠવાડિયે બીજા કોઈ સામાન છોડે એની રાહ જોવી પડતી નથી.',
    },
  },
  {
    scope: 'GLOBAL',
    question: {
      en: 'What happens if it rains?',
      gu: 'વરસાદ આવે તો શું?',
    },
    answer: {
      en: 'Our hangers and pandals are waterproof and wind-rated, and we run cabling and distribution boards clear of standing water. If the forecast turns during setup we add cover over the counters and the sound position first, because those are what stop a function dead.',
      gu: 'અમારા હેંગર અને પંડાલ વોટરપ્રૂફ અને પવન સહન કરે એવા છે, અને કેબલિંગ તથા ડિસ્ટ્રિબ્યુશન બોર્ડ પાણીથી દૂર રાખીએ છીએ. સેટઅપ દરમિયાન હવામાન બદલાય તો પહેલાં કાઉન્ટર અને સાઉન્ડની જગ્યા ઢાંકીએ છીએ — એ બે બંધ પડે તો આખો પ્રસંગ અટકે છે.',
    },
  },
  {
    scope: 'GLOBAL',
    question: {
      en: 'When does your crew reach the venue?',
      gu: 'તમારી ટીમ ક્યારે પહોંચે છે?',
    },
    answer: {
      en: 'Structure and flooring go up first, usually a couple of days before the function depending on its size; decoration, sound and lighting follow so nothing finished gets walked over. A crew stays on site through the event and dismantles afterwards.',
      gu: 'પહેલાં સ્ટ્રક્ચર અને ફ્લોરિંગ ઊભું થાય — સાઇઝ પ્રમાણે સામાન્ય રીતે પ્રસંગના બે-એક દિવસ પહેલાં; પછી સજાવટ, સાઉન્ડ અને લાઇટિંગ, જેથી તૈયાર થયેલા કામ પર કોઈ ચાલે નહીં. પ્રસંગ દરમિયાન ટીમ સાઇટ પર રહે છે અને પછી બધું ઉતારી લે છે.',
    },
  },
  {
    scope: 'GLOBAL',
    question: {
      en: 'How do I confirm a booking?',
      gu: 'બુકિંગ કેવી રીતે પાકું થાય?',
    },
    answer: {
      en: 'Site visit, then a written quote listing every item. Once you approve it we block the date against your name and share the setup timeline. Ask us on WhatsApp for the current booking terms before you pay anything.',
      gu: 'પહેલાં સાઇટ વિઝિટ, પછી દરેક વસ્તુની યાદી સાથે લેખિત ક્વોટ. તમે મંજૂર કરો એટલે તારીખ તમારા નામે બ્લોક થાય અને સેટઅપની ટાઇમલાઇન મળે. કંઈ પણ ચૂકવતાં પહેલાં WhatsApp પર બુકિંગની હાલની શરતો પૂછી લો.',
    },
  },
];
