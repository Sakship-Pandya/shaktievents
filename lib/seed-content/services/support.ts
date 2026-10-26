import type { ServiceSeed } from './types';

/** Furniture, catering counters and power — the things guests only notice when they fail. */
export const supportServices: ServiceSeed[] = [
  {
    slug: 'furniture-seating-rental-surendranagar',
    content: {
      en: {
        promise:
          'Chiavari chairs, VIP sofa sets, round tables and carpets — counted and cleaned before they load.',
        intro:
          'Furniture is the part of a function nobody photographs and everybody notices. A chair short at a samuh lagan, a stained cover on the VIP sofa, a carpet that ripples where people walk — each is small on its own and each is remembered. Our stock is our own, stored in our godown, counted against the order before it loads and counted again on site. Covers are washed between functions rather than spot-cleaned. We plan the layout with you against the guest count and the catering flow, because seating that looks fine on paper can leave a queue standing in front of the stage once the counters open.',
        process: [
          {
            title: 'Count and layout',
            body: 'Guest numbers, dining style and the shape of the space decide the mix of chairs, tables and sofas — not a standard package.',
          },
          {
            title: 'Check and load',
            body: 'Everything is counted and inspected against the order before it leaves the godown, covers washed rather than spot-cleaned.',
          },
          {
            title: 'Set out on site',
            body: 'Carpets and flooring first, then seating, so nothing has to be dragged across a laid floor.',
          },
          {
            title: 'Reset between functions',
            body: 'On a multi-day booking the layout is reset between functions — haldi seating and reception seating are not the same arrangement.',
          },
        ],
        closing:
          'Give us a realistic guest number rather than an optimistic one. Extra chairs stacked at the side are easy; chairs that are not on the truck are not.',
      },
      gu: {
        promise:
          'શિવારી ખુરશી, VIP સોફા સેટ, રાઉન્ડ ટેબલ અને કાર્પેટ — ગણીને અને સાફ કરીને જ ગાડીમાં ચઢે.',
        intro:
          'ફર્નિચર એ પ્રસંગનો એવો ભાગ છે જેના ફોટા કોઈ પાડતું નથી અને જે બધાને દેખાય છે. સમૂહ લગ્નમાં એક ખુરશી ઓછી, VIP સોફા પર ડાઘવાળું કવર, ચાલવાની જગ્યાએ કરચલી પડેલી કાર્પેટ — દરેક નાની વાત છે અને દરેક યાદ રહી જાય છે. અમારો સામાન અમારો પોતાનો છે, અમારા ગોડાઉનમાં રહે છે, ઓર્ડર સામે ગણીને ચઢે છે અને સાઇટ પર ફરી ગણાય છે. કવર ડાઘ સાફ કરીને નહીં, ધોઈને આવે છે. બેઠકની ગોઠવણ અમે તમારી સાથે મહેમાનોની સંખ્યા અને જમણના પ્રવાહ સામે રાખીને કરીએ છીએ — કારણ કે કાગળ પર સારી લાગતી ગોઠવણમાં કાઉન્ટર ખૂલે ત્યારે લાઇન સ્ટેજ સામે જ ઊભી રહી જાય છે.',
        process: [
          {
            title: 'ગણતરી અને ગોઠવણ',
            body: 'મહેમાનોની સંખ્યા, જમણની રીત અને જગ્યાનો આકાર — એ ત્રણેય પરથી ખુરશી, ટેબલ અને સોફાનું પ્રમાણ નક્કી થાય, કોઈ તૈયાર પેકેજ પરથી નહીં.',
          },
          {
            title: 'તપાસ અને લોડિંગ',
            body: 'ગોડાઉનમાંથી નીકળતાં પહેલાં બધું ઓર્ડર સામે ગણાય અને તપાસાય, અને કવર ધોઈને આવે.',
          },
          {
            title: 'સાઇટ પર ગોઠવણી',
            body: 'પહેલાં કાર્પેટ અને ફ્લોરિંગ, પછી બેઠક — જેથી પાથરેલા ફ્લોર પરથી કંઈ ખેંચવું ન પડે.',
          },
          {
            title: 'પ્રસંગો વચ્ચે ફેરગોઠવણ',
            body: 'ઘણા દિવસના બુકિંગમાં દરેક પ્રસંગ વચ્ચે ગોઠવણ બદલાય — હળદીની બેઠક અને રિસેપ્શનની બેઠક એક સરખી હોતી નથી.',
          },
        ],
        closing:
          'આશાવાદી નહીં, વાસ્તવિક મહેમાન સંખ્યા આપો. બાજુમાં ખડકાયેલી વધારાની ખુરશીઓ સહેલી વાત છે; ગાડીમાં ન ચઢેલી ખુરશીઓ નથી.',
      },
    },
    inclusions: [
      { en: 'Chiavari, banquet and plastic chairs', gu: 'શિવારી, બેન્ક્વેટ અને પ્લાસ્ટિક ખુરશીઓ' },
      { en: 'VIP sofa sets and side tables', gu: 'VIP સોફા સેટ અને સાઇડ ટેબલ' },
      { en: 'Round and rectangular dining tables', gu: 'ગોળ અને લંબચોરસ જમણ ટેબલ' },
      { en: 'Washed chair covers and sashes', gu: 'ધોયેલાં ખુરશીનાં કવર અને સેશ' },
      { en: 'Carpets, walkway runners and flooring', gu: 'કાર્પેટ, રસ્તાની પટ્ટીઓ અને ફ્લોરિંગ' },
      { en: 'Crockery and serving ware on request', gu: 'માંગ પ્રમાણે ક્રોકરી અને પીરસવાનાં વાસણ' },
      { en: 'Counted out and counted back', gu: 'ગણીને આપવું અને ગણીને લેવું' },
    ],
    options: [
      {
        nameEn: 'Banquet seating',
        nameGu: 'બેન્ક્વેટ બેઠક',
        descEn:
          'Round tables with covers and chairs, for a seated dinner where guests stay at their table.',
        descGu: 'કવર અને ખુરશી સાથે ગોળ ટેબલ — બેઠા જમણ માટે, જ્યાં મહેમાનો પોતાના ટેબલ પર જ રહે.',
      },
      {
        nameEn: 'Theatre seating',
        nameGu: 'થિયેટર બેઠક',
        descEn:
          'Rows facing the stage for katha, sabha and school functions, with aisles wide enough to move during a session.',
        descGu:
          'કથા, સભા અને શાળાના કાર્યક્રમ માટે સ્ટેજ સામે હરોળ, અને સત્ર દરમિયાન અવરજવર થઈ શકે એટલા પહોળા માર્ગ.',
      },
      {
        nameEn: 'VIP and stage seating',
        nameGu: 'VIP અને સ્ટેજ બેઠક',
        descEn:
          'Sofa sets, side tables and a front row that looks right in the photographs from the back of the hall.',
        descGu:
          'સોફા સેટ, સાઇડ ટેબલ અને એવી આગળની હરોળ જે હોલના પાછળના ભાગેથી પડતા ફોટામાં સારી લાગે.',
      },
      {
        nameEn: 'Ground seating',
        nameGu: 'બેઠક વ્યવસ્થા (નીચે)',
        descEn:
          'Carpets, mattresses and bolsters for a traditional katha or samuh lagan where guests sit on the floor.',
        descGu:
          'પરંપરાગત કથા કે સમૂહ લગ્ન માટે કાર્પેટ, ગાદલાં અને તકિયા — જ્યાં મહેમાનો નીચે બેસે.',
      },
    ],
    specs: [
      { labelEn: 'Seating capacity', labelGu: 'બેઠક ક્ષમતા', value: '200 – 5,000' },
      { labelEn: 'Chair types', labelGu: 'ખુરશીના પ્રકાર', value: 'Chiavari · banquet · plastic' },
      { labelEn: 'Tables', labelGu: 'ટેબલ', value: 'Round · rectangular · counter height' },
      { labelEn: 'Covers', labelGu: 'કવર', value: 'Washed between functions' },
      { labelEn: 'Flooring', labelGu: 'ફ્લોરિંગ', value: 'Carpet · runners · raised floor' },
      { labelEn: 'Stock check', labelGu: 'સામાનની ગણતરી', value: 'Counted at load and on site' },
    ],
    pricing: {
      unitEn: 'per day',
      unitGu: 'પ્રતિ દિવસ',
      factors: [
        { en: 'Quantity and chair type', gu: 'સંખ્યા અને ખુરશીનો પ્રકાર' },
        { en: 'Covers and sashes or plain', gu: 'કવર-સેશ સાથે કે સાદી' },
        { en: 'Carpet and flooring area', gu: 'કાર્પેટ અને ફ્લોરિંગનો વિસ્તાર' },
        { en: 'How many days and resets', gu: 'કેટલા દિવસ અને કેટલી ફેરગોઠવણ' },
        { en: 'Distance and truck access', gu: 'અંતર અને ગાડીનો રસ્તો' },
      ],
    },
    faqs: [
      {
        question: {
          en: 'Do you provide furniture and chairs too?',
          gu: 'ફર્નિચર અને ખુરશીઓ પણ આપો છો?',
        },
        answer: {
          en: 'Yes — chiavari and banquet chairs, VIP sofa sets, round and rectangular tables, carpets and covers, all from our own stock. It can be booked with the rest of the setup or on its own.',
          gu: 'હા — શિવારી અને બેન્ક્વેટ ખુરશી, VIP સોફા સેટ, ગોળ અને લંબચોરસ ટેબલ, કાર્પેટ અને કવર — બધું અમારા પોતાના સામાનમાંથી. બાકીના સેટઅપ સાથે કે અલગ, બંને રીતે બુક થાય.',
        },
      },
      {
        question: {
          en: 'What if more guests turn up than expected?',
          gu: 'ધાર્યા કરતાં વધુ મહેમાનો આવે તો?',
        },
        answer: {
          en: 'Tell us the realistic number and we plan a margin on top. Extra chairs stacked at the side cost very little; a truck going back to the godown mid-function costs you the hour it takes.',
          gu: 'વાસ્તવિક સંખ્યા કહો, અમે એની ઉપર થોડો વધારો રાખીએ છીએ. બાજુમાં ખડકાયેલી વધારાની ખુરશીઓનો ખર્ચ નહીંવત્ છે; પ્રસંગ વચ્ચે ગોડાઉન પાછી જતી ગાડીનો ખર્ચ એક કલાક છે.',
        },
      },
      {
        question: { en: 'Are the covers clean?', gu: 'કવર સાફ હોય છે?' },
        answer: {
          en: 'They are washed between functions, not spot-cleaned, and checked as they load. If anything arrives marked, tell the crew on site and it gets swapped rather than turned to face the wall.',
          gu: 'દરેક પ્રસંગ વચ્ચે ધોવાય છે — ડાઘ સાફ કરીને નહીં — અને લોડ થતી વખતે તપાસાય છે. કંઈ ડાઘવાળું આવે તો સાઇટ પરની ટીમને કહો, એ બદલાઈ જશે, દીવાલ તરફ ફેરવી નહીં દેવાય.',
        },
      },
    ],
  },
  {
    slug: 'catering-counter-setup-surendranagar',
    content: {
      en: {
        promise:
          'Live counter layouts and buffet flow that keeps a 1,000-guest line moving instead of bunching.',
        intro:
          'We build and dress the counters; your caterer cooks. The two have to be planned together or the food is fine and the queue is not. A single long buffet against a wall is the most common mistake at a large function — it creates one line, and one line for a thousand people takes an hour. We split the service into stations with their own approaches, keep the chaat and ice-cream counters away from the main flow because people linger there, and put the water and hand-wash points where they are reached without crossing the queue. Counters get a rain cover, a light of their own and a power feed counted into the generator load.',
        process: [
          {
            title: 'Flow before furniture',
            body: 'We map how a guest gets from their seat to food and back, then place counters against that rather than against the wall.',
          },
          {
            title: 'Station split',
            body: 'Main service, chaat, live counters, sweets and ice cream get their own approaches, so the slow ones do not block the fast ones.',
          },
          {
            title: 'Build, cover and light',
            body: 'Counter frames, cladding, rain cover and dedicated lighting go up, with power counted into the generator sizing.',
          },
          {
            title: 'Walk it with the caterer',
            body: 'Before service we walk the layout with your caterer so they know where their staff stand and where refills come from.',
          },
        ],
        closing:
          'Book your caterer before the site visit if you can. Fifteen minutes with both of us on the ground saves the most common problem at a large function, which is not the food.',
      },
      gu: {
        promise: 'લાઇવ કાઉન્ટરની ગોઠવણ અને બુફે લેઆઉટ — 1,000 મહેમાનોની લાઇન ભીડ વગર ચાલતી રહે.',
        intro:
          'કાઉન્ટર અમે બાંધીએ અને સજાવીએ; રસોઈ તમારો કેટરર કરે. બંનેનું આયોજન સાથે થવું જોઈએ, નહીં તો ભોજન સારું હોય અને લાઇન ખરાબ. મોટા પ્રસંગમાં સૌથી સામાન્ય ભૂલ એ છે કે એક લાંબું બુફે દીવાલ સાથે મૂકી દેવું — એનાથી એક જ લાઇન બને, અને હજાર માણસ માટે એક લાઇન એટલે એક કલાક. અમે સેવાને અલગ સ્ટેશનમાં વહેંચીએ છીએ, દરેકનો પોતાનો રસ્તો રાખીએ છીએ, ચાટ અને આઇસક્રીમના કાઉન્ટર મુખ્ય પ્રવાહથી દૂર રાખીએ છીએ — કારણ કે ત્યાં લોકો ઊભા રહી જાય છે — અને પાણી તથા હાથ ધોવાની જગ્યા એવી રાખીએ છીએ કે લાઇન ઓળંગ્યા વગર પહોંચાય. કાઉન્ટર પર વરસાદનું કવર, પોતાની લાઇટ અને જનરેટરના લોડમાં ગણેલો પાવર હોય છે.',
        process: [
          {
            title: 'ફર્નિચર પહેલાં પ્રવાહ',
            body: 'મહેમાન બેઠકથી ભોજન સુધી અને પાછો કેવી રીતે જશે એનો નકશો બનાવીએ, અને એ પ્રમાણે કાઉન્ટર મૂકીએ — દીવાલ પ્રમાણે નહીં.',
          },
          {
            title: 'સ્ટેશનની વહેંચણી',
            body: 'મુખ્ય સેવા, ચાટ, લાઇવ કાઉન્ટર, મીઠાઈ અને આઇસક્રીમ — દરેકનો પોતાનો રસ્તો, જેથી ધીમા કાઉન્ટર ઝડપીને રોકે નહીં.',
          },
          {
            title: 'બાંધકામ, કવર અને લાઇટ',
            body: 'કાઉન્ટરની ફ્રેમ, ક્લેડિંગ, વરસાદનું કવર અને અલગ લાઇટિંગ ગોઠવાય, અને પાવર જનરેટરની ક્ષમતામાં ગણાય.',
          },
          {
            title: 'કેટરર સાથે ફેરો',
            body: 'સેવા શરૂ થાય એ પહેલાં તમારા કેટરર સાથે ગોઠવણ ફરી જોઈએ છીએ — એમના માણસો ક્યાં ઊભા રહેશે અને રીફિલ ક્યાંથી આવશે એ નક્કી થાય.',
          },
        ],
        closing:
          'બની શકે તો સાઇટ વિઝિટ પહેલાં કેટરર બુક કરી લો. મેદાન પર અમે બંને સાથે પંદર મિનિટ ઊભા રહીએ તો મોટા પ્રસંગની સૌથી સામાન્ય સમસ્યા ટળી જાય છે — અને એ સમસ્યા ભોજન નથી.',
      },
    },
    inclusions: [
      {
        en: 'Counter frames, cladding and skirting',
        gu: 'કાઉન્ટરની ફ્રેમ, ક્લેડિંગ અને સ્કર્ટિંગ',
      },
      { en: 'Live counter and chaat station setup', gu: 'લાઇવ કાઉન્ટર અને ચાટ સ્ટેશનની ગોઠવણ' },
      { en: 'Buffet layout planned for flow', gu: 'પ્રવાહ ધ્યાનમાં રાખીને બુફેની ગોઠવણ' },
      { en: 'Rain cover over the service area', gu: 'સેવાની જગ્યા પર વરસાદનું કવર' },
      { en: 'Dedicated counter lighting', gu: 'કાઉન્ટર માટે અલગ લાઇટિંગ' },
      { en: 'Power feed counted into the generator load', gu: 'જનરેટરના લોડમાં ગણેલો પાવર' },
      { en: 'Water and hand-wash points', gu: 'પાણી અને હાથ ધોવાની જગ્યા' },
      { en: 'Dining tables and seating alongside', gu: 'સાથે જમણ ટેબલ અને બેઠક' },
    ],
    options: [
      {
        nameEn: 'Live counters',
        nameGu: 'લાઇવ કાઉન્ટર',
        descEn:
          'Cooking in front of guests. Slower per plate, so they get their own approach away from the main queue.',
        descGu: 'મહેમાનો સામે રસોઈ. પ્રતિ થાળી ધીમા પડે, એટલે મુખ્ય લાઇનથી દૂર પોતાનો રસ્તો મળે.',
      },
      {
        nameEn: 'Buffet stations',
        nameGu: 'બુફે સ્ટેશન',
        descEn:
          'Split into islands rather than one long run, so several lines form instead of one that stops moving.',
        descGu: 'એક લાંબી હરોળને બદલે અલગ ટાપુમાં — જેથી અટકી પડતી એક લાઇનને બદલે ઘણી લાઇન બને.',
      },
      {
        nameEn: 'Chaat, pan and ice cream',
        nameGu: 'ચાટ, પાન અને આઇસક્રીમ',
        descEn:
          'Placed away from the main flow, because guests stand and talk at these rather than passing through.',
        descGu: 'મુખ્ય પ્રવાહથી દૂર — કારણ કે અહીં મહેમાનો પસાર થવાને બદલે ઊભા રહીને વાતો કરે છે.',
      },
      {
        nameEn: 'Welcome and drinks counter',
        nameGu: 'સ્વાગત અને પીણાં કાઉન્ટર',
        descEn:
          'At the entrance, so arriving guests have something in hand before they reach the seating.',
        descGu: 'પ્રવેશ પર — જેથી આવતા મહેમાનોના હાથમાં બેઠક સુધી પહોંચતાં પહેલાં કંઈક હોય.',
      },
    ],
    specs: [
      { labelEn: 'Guests served', labelGu: 'મહેમાનોની સંખ્યા', value: '200 – 5,000' },
      {
        labelEn: 'Counter length',
        labelGu: 'કાઉન્ટરની લંબાઈ',
        value: 'Set by station split, not one run',
      },
      { labelEn: 'Rain cover', labelGu: 'વરસાદનું કવર', value: 'Over the full service area' },
      { labelEn: 'Lighting', labelGu: 'લાઇટિંગ', value: 'Dedicated, on the counter face' },
      { labelEn: 'Power', labelGu: 'પાવર', value: 'Counted into generator sizing' },
      { labelEn: 'Cooking', labelGu: 'રસોઈ', value: 'By your caterer — we build and dress' },
    ],
    pricing: {
      unitEn: 'per function',
      unitGu: 'પ્રતિ પ્રસંગ',
      factors: [
        { en: 'Number of counters and stations', gu: 'કાઉન્ટર અને સ્ટેશનની સંખ્યા' },
        { en: 'Guest count and service duration', gu: 'મહેમાનોની સંખ્યા અને સેવાનો સમય' },
        { en: 'Cladding and finish level', gu: 'ક્લેડિંગ અને ફિનિશનું સ્તર' },
        { en: 'Rain cover area needed', gu: 'વરસાદના કવરનો જરૂરી વિસ્તાર' },
        { en: 'Dining furniture included or not', gu: 'જમણનું ફર્નિચર સામેલ છે કે નહીં' },
      ],
    },
    faqs: [
      {
        question: { en: 'Do you provide the food as well?', gu: 'ભોજન પણ તમે આપો છો?' },
        answer: {
          en: 'No — we build, dress, cover and light the counters, and plan the layout. Your caterer cooks and serves. We work alongside whichever caterer you book and would rather meet them before the day than on it.',
          gu: 'ના — અમે કાઉન્ટર બાંધીએ, સજાવીએ, ઢાંકીએ અને પ્રકાશિત કરીએ, અને ગોઠવણનું આયોજન કરીએ. રસોઈ અને પીરસવાનું તમારો કેટરર કરે. તમે જે કેટરર બુક કરો એની સાથે અમે કામ કરીએ છીએ — અને એમને પ્રસંગના દિવસે નહીં, પહેલાં મળવાનું પસંદ કરીએ છીએ.',
        },
      },
      {
        question: {
          en: 'How do you stop a long queue forming?',
          gu: 'લાંબી લાઇન ન બને એ માટે શું કરો છો?',
        },
        answer: {
          en: 'By splitting the service into stations with separate approaches instead of one long buffet, and by keeping the counters people linger at — chaat, pan, ice cream — off the main path. Layout does more for queue length than counter length does.',
          gu: 'એક લાંબા બુફેને બદલે અલગ રસ્તાવાળા સ્ટેશનમાં સેવા વહેંચીને, અને જ્યાં લોકો ઊભા રહી જાય એવા કાઉન્ટર — ચાટ, પાન, આઇસક્રીમ — મુખ્ય રસ્તાથી દૂર રાખીને. લાઇનની લંબાઈ પર કાઉન્ટરની લંબાઈ કરતાં ગોઠવણની અસર વધુ છે.',
        },
      },
      {
        question: { en: 'What if it rains during dinner?', gu: 'જમણ વખતે વરસાદ આવે તો?' },
        answer: {
          en: 'The service area is covered as part of the build, not added afterwards, and the power boards sit clear of standing water. On a monsoon date we cover more generously than the forecast suggests.',
          gu: 'સેવાની જગ્યા બાંધકામના ભાગ રૂપે જ ઢંકાય છે, પછીથી ઉમેરાતી નથી — અને પાવર બોર્ડ પાણીથી દૂર રહે છે. ચોમાસાની તારીખે હવામાનની આગાહી કરતાં થોડું વધારે ઢાંકીએ છીએ.',
        },
      },
    ],
  },
  {
    slug: 'generator-power-cooling-surendranagar',
    content: {
      en: {
        promise:
          'Silent DG sized to your actual load, plus cabling, mist fans and AC pandals — power that does not blink mid-vidhi.',
        intro:
          'Power is the one service where a mistake stops everything else at once. Lights, sound, catering counters and cooling all draw from the same supply, and a generator chosen because it happened to be free that day will trip the moment the counters switch on. We add up the real load — every fixture, the console, the counters, the fans or AC — and size the DG against that with headroom, then run the cabling and distribution so nothing crosses a walkway or sits in water. A silent set goes far enough from the mandap that the vidhi does not compete with it. Where the venue has mains, we still plan the changeover, because the point is that nobody in the hall notices anything.',
        process: [
          {
            title: 'Add up the load',
            body: 'Lighting, sound, counters, cooling and the LED wall if there is one, all counted rather than estimated from the guest number.',
          },
          {
            title: 'Size with headroom',
            body: 'The DG is chosen against that total with margin, so switching the counters on mid-function does not bring the lights down.',
          },
          {
            title: 'Place and cable',
            body: 'The set goes far enough away that its noise does not sit under the ceremony, with cabling clear of walkways and standing water.',
          },
          {
            title: 'Test under load',
            body: 'We run everything together before guests arrive — the failure you want to find is the one that happens with all of it switched on.',
          },
        ],
        closing:
          'If you are booking sound, lighting and catering from different suppliers, tell each of them the same total load figure. Most power failures at functions are three correct calculations that were never added together.',
      },
      gu: {
        promise:
          'ખરા લોડ પ્રમાણે સાઇલન્ટ DG, સાથે કેબલિંગ, મિસ્ટ ફેન અને AC પંડાલ — વિધિ વચ્ચે લાઇટ ન જાય એવો પાવર.',
        intro:
          'પાવર એ એક એવી સેવા છે જેમાં ભૂલ થાય તો બાકીનું બધું એકસાથે અટકી જાય. લાઇટ, સાઉન્ડ, કેટરિંગ કાઉન્ટર અને કૂલિંગ — બધું એક જ સપ્લાયમાંથી ચાલે છે, અને "એ દિવસે ખાલી હતું" એટલે પસંદ કરેલું જનરેટર કાઉન્ટર ચાલુ થતાં જ ટ્રિપ થઈ જશે. અમે ખરો લોડ ગણીએ છીએ — દરેક ફિક્સ્ચર, કન્સોલ, કાઉન્ટર, પંખા કે AC — અને એની સામે થોડી વધારાની ક્ષમતા સાથે DG નક્કી કરીએ છીએ, પછી કેબલિંગ અને વિતરણ એવી રીતે કરીએ કે કંઈ ચાલવાના રસ્તા પર કે પાણીમાં ન આવે. સાઇલન્ટ સેટ મંડપથી એટલો દૂર મુકાય કે વિધિ સાથે એનો અવાજ ન અથડાય. જગ્યાએ મેઇન લાઇટ હોય તોય અમે ચેન્જઓવરનું આયોજન કરીએ છીએ — કારણ કે મુદ્દો એ છે કે હોલમાં કોઈને કશું ખબર ન પડે.',
        process: [
          {
            title: 'લોડની ગણતરી',
            body: 'લાઇટિંગ, સાઉન્ડ, કાઉન્ટર, કૂલિંગ અને LED વોલ હોય તો એ — બધું ગણીને, મહેમાનોની સંખ્યા પરથી અંદાજ લગાવીને નહીં.',
          },
          {
            title: 'વધારાની ક્ષમતા સાથે પસંદગી',
            body: 'એ કુલ સામે માર્જિન રાખીને DG પસંદ થાય — જેથી પ્રસંગ વચ્ચે કાઉન્ટર ચાલુ થાય ત્યારે લાઇટ ન જાય.',
          },
          {
            title: 'જગ્યા અને કેબલિંગ',
            body: 'સેટ એટલો દૂર મુકાય કે એનો અવાજ વિધિ નીચે ન આવે, અને કેબલ ચાલવાના રસ્તા તથા પાણીથી દૂર રહે.',
          },
          {
            title: 'લોડ સાથે ચકાસણી',
            body: 'મહેમાનો આવે એ પહેલાં બધું એકસાથે ચલાવીએ છીએ — જે ખરાબી શોધવી હોય એ બધું ચાલુ હોય ત્યારે જ દેખાય છે.',
          },
        ],
        closing:
          'સાઉન્ડ, લાઇટિંગ અને કેટરિંગ અલગ અલગ પાસેથી લેતા હો તો દરેકને એક જ કુલ લોડનો આંકડો આપો. પ્રસંગોમાં મોટા ભાગની પાવર સમસ્યાઓ ત્રણ સાચી ગણતરીઓ છે જે ક્યારેય સરવાળામાં આવી નથી.',
      },
    },
    inclusions: [
      { en: 'Silent DG sized against the measured load', gu: 'ગણેલા લોડ પ્રમાણે સાઇલન્ટ DG' },
      { en: 'Distribution boards and cabling', gu: 'ડિસ્ટ્રિબ્યુશન બોર્ડ અને કેબલિંગ' },
      {
        en: 'Cabling routed clear of walkways and water',
        gu: 'ચાલવાના રસ્તા અને પાણીથી દૂર કેબલિંગ',
      },
      {
        en: 'Mains changeover planning where mains exist',
        gu: 'મેઇન લાઇટ હોય ત્યાં ચેન્જઓવરનું આયોજન',
      },
      { en: 'Mist fans and pedestal cooling', gu: 'મિસ્ટ ફેન અને પેડેસ્ટલ કૂલિંગ' },
      { en: 'Ducted AC for hangers and pandals', gu: 'હેંગર અને પંડાલ માટે ડક્ટેડ AC' },
      { en: 'Full-load test before guests arrive', gu: 'મહેમાનો આવે એ પહેલાં પૂરા લોડની ચકાસણી' },
      { en: 'Operator on site for the function', gu: 'પ્રસંગ દરમિયાન સાઇટ પર ઓપરેટર' },
    ],
    options: [
      {
        nameEn: 'Silent DG set',
        nameGu: 'સાઇલન્ટ DG સેટ',
        descEn:
          'Sized to your total load with headroom, placed far enough from the ceremony that it is not heard over it.',
        descGu: 'કુલ લોડ પ્રમાણે વધારાની ક્ષમતા સાથે, અને વિધિથી એટલો દૂર કે એનો અવાજ ઉપર ન આવે.',
      },
      {
        nameEn: 'Mist fans',
        nameGu: 'મિસ્ટ ફેન',
        descEn:
          'Along the sides of an open or covered area. Per rupee they usually do more for daytime comfort than full cooling.',
        descGu:
          'ખુલ્લી કે ઢાંકેલી જગ્યાની બાજુમાં. દિવસની રાહત માટે ખર્ચ પ્રમાણે આ ઘણી વાર પૂરા કૂલિંગ કરતાં વધુ કામ આપે છે.',
      },
      {
        nameEn: 'AC pandal',
        nameGu: 'AC પંડાલ',
        descEn:
          'Ducted cooling into a closed hanger. Needs the side walls closed and the generator sized for it from the start.',
        descGu:
          'બંધ હેંગરમાં ડક્ટેડ કૂલિંગ. બાજુની દીવાલો બંધ જોઈએ અને શરૂઆતથી જ એ પ્રમાણે જનરેટર જોઈએ.',
      },
      {
        nameEn: 'Backup and changeover',
        nameGu: 'બેકઅપ અને ચેન્જઓવર',
        descEn:
          'A second set or a planned changeover from mains, so a failure is a few seconds rather than the rest of the evening.',
        descGu:
          'બીજો સેટ કે મેઇનમાંથી નક્કી કરેલો ચેન્જઓવર — જેથી ખરાબી આખી સાંજ નહીં, થોડી સેકન્ડ રહે.',
      },
    ],
    specs: [
      { labelEn: 'Sizing', labelGu: 'ક્ષમતા', value: 'From the measured load, with headroom' },
      { labelEn: 'Set type', labelGu: 'સેટનો પ્રકાર', value: 'Silent diesel generator' },
      { labelEn: 'Cooling', labelGu: 'કૂલિંગ', value: 'Mist fans · pedestal · ducted AC' },
      { labelEn: 'Distribution', labelGu: 'વિતરણ', value: 'Boards, cabling and earthing' },
      { labelEn: 'Testing', labelGu: 'ચકાસણી', value: 'Full load, before guests arrive' },
      { labelEn: 'Operator', labelGu: 'ઓપરેટર', value: 'On site through the function' },
    ],
    pricing: {
      unitEn: 'per day',
      unitGu: 'પ્રતિ દિવસ',
      factors: [
        { en: 'Total connected load in kVA', gu: 'કુલ કનેક્ટેડ લોડ (kVA)' },
        { en: 'How many days and running hours', gu: 'કેટલા દિવસ અને કેટલા કલાક ચાલશે' },
        { en: 'Cabling run length from the set', gu: 'સેટથી કેબલની લંબાઈ' },
        {
          en: 'Cooling type — fans, mist or ducted AC',
          gu: 'કૂલિંગનો પ્રકાર — પંખા, મિસ્ટ કે ડક્ટેડ AC',
        },
        { en: 'Whether a backup set is included', gu: 'બેકઅપ સેટ સામેલ છે કે નહીં' },
      ],
    },
    faqs: [
      {
        question: { en: 'Is a generator included, or extra?', gu: 'જનરેટર સાથે આવે છે કે અલગ?' },
        answer: {
          en: 'It is priced separately because the size depends on your load — lighting, sound, cooling and the catering counters all draw from it. We add up the actual load and size the DG for it, rather than sending whatever is free that day.',
          gu: 'એનો ભાવ અલગ હોય છે, કારણ કે એની ક્ષમતા તમારા લોડ પર આધારિત છે — લાઇટિંગ, સાઉન્ડ, કૂલિંગ અને કેટરિંગ કાઉન્ટર બધું એમાંથી ચાલે. અમે ખરો લોડ ગણીને DG નક્કી કરીએ છીએ, એ દિવસે જે ખાલી હોય એ મોકલી દેતા નથી.',
        },
      },
      {
        question: {
          en: 'Will we hear the generator during the vidhi?',
          gu: 'વિધિ દરમિયાન જનરેટરનો અવાજ સંભળાશે?',
        },
        answer: {
          en: 'It is a silent set and we place it far enough away, downwind of the mandap where the ground allows. Tell us at the site visit if there is only one spot it can go, because that changes the cabling run and the cost.',
          gu: 'એ સાઇલન્ટ સેટ છે અને અમે એને પૂરતો દૂર, મેદાન પરવાનગી આપે તો મંડપની હવાની દિશાથી ઊલટી બાજુ મૂકીએ છીએ. એને મૂકવાની એક જ જગ્યા હોય તો સાઇટ વિઝિટમાં જણાવો — એનાથી કેબલની લંબાઈ અને ખર્ચ બદલાય છે.',
        },
      },
      {
        question: { en: 'Mist fans or air conditioning?', gu: 'મિસ્ટ ફેન કે AC?' },
        answer: {
          en: 'For a daytime function in an open or half-open structure, mist fans usually give more comfort per rupee. AC needs the side walls closed and a bigger generator, so it makes sense mainly for an enclosed hanger or an evening function in high summer.',
          gu: 'ખુલ્લા કે અડધા ખુલ્લા સ્ટ્રક્ચરમાં દિવસના પ્રસંગ માટે મિસ્ટ ફેન ખર્ચ પ્રમાણે વધુ રાહત આપે. AC માટે બાજુની દીવાલો બંધ અને મોટું જનરેટર જોઈએ — એટલે એ મુખ્યત્વે બંધ હેંગર કે ભરઉનાળાના સાંજના પ્રસંગ માટે યોગ્ય છે.',
        },
      },
      {
        question: { en: 'What if the mains supply fails?', gu: 'મેઇન લાઇટ જાય તો?' },
        answer: {
          en: 'That is what the changeover plan is for. Where the venue has mains, the DG stands by and the switch is planned in advance rather than improvised — the aim is that nobody in the hall notices anything happened.',
          gu: 'ચેન્જઓવરનું આયોજન એટલા માટે જ છે. જગ્યાએ મેઇન લાઇટ હોય ત્યાં DG તૈયાર ઊભું રહે અને સ્વિચ પહેલેથી નક્કી કરેલી હોય, એ વખતે ગોઠવવાની ન હોય — હેતુ એ કે હોલમાં કોઈને કંઈ થયું છે એની ખબર જ ન પડે.',
        },
      },
    ],
  },
];
