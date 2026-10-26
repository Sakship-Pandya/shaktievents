import type { ServiceSeed } from './types';

/** Stage, flowers and themes — the decoration layer over the structure. */
export const decorServices: ServiceSeed[] = [
  {
    slug: 'stage-backdrop-decoration-surendranagar',
    content: {
      en: {
        promise:
          '3D panels, floral walls and LED backdrops, on a stage built at a height that photographs well.',
        intro:
          'A stage has two jobs at once: it has to look right from the last row, and it has to work as a background for a few hundred photographs. Those pull in different directions. Too low and the back of the hall sees heads; too high and the couple are looking down at everyone. Too busy a backdrop and every photo has a pattern behind the faces. We set the height from the room and the seating depth, keep the centre of the backdrop calm where people stand, and put the detail out at the edges. The same frame carries a floral wall, a 3D panel or an LED screen, so you can change the look without changing the build.',
        process: [
          {
            title: 'Height and sightlines',
            body: 'We set the platform height from how deep the seating runs and how high the room is, so the back row sees the stage and the front row is not craning.',
          },
          {
            title: 'Backdrop choice',
            body: 'Floral, panelled or LED — chosen against the lighting plan, because a backdrop that works under warm light can disappear under colour.',
          },
          {
            title: 'Build and dress',
            body: 'Platform, then frame, then the backdrop surface, then flowers. Steps and the ramp go in at the same time rather than as an afterthought.',
          },
          {
            title: 'Final check with the lights on',
            body: 'We look at it lit, from the back row and through a camera, before we call it finished.',
          },
        ],
        closing:
          'Tell us how many people will be on the stage at once — a family photograph with thirty relatives needs a very different width from a couple and two chairs.',
      },
      gu: {
        promise:
          '3D પેનલ, ફૂલોની દીવાલ અને LED બેકડ્રોપ — ફોટામાં સારું લાગે એવી ઊંચાઈના સ્ટેજ પર.',
        intro:
          'સ્ટેજનાં બે કામ એકસાથે હોય છે: છેલ્લી હરોળથી સારું દેખાવું, અને સેંકડો ફોટા માટે પાછળનું દૃશ્ય બનવું. બંને સામસામી દિશામાં ખેંચે છે. બહુ નીચું હોય તો પાછળવાળાને માથાં દેખાય; બહુ ઊંચું હોય તો વર-કન્યા બધા સામે નીચે જોતાં રહે. બેકડ્રોપ બહુ ભરેલું હોય તો દરેક ફોટામાં ચહેરા પાછળ ભાત આવે. અમે ઊંચાઈ ઓરડા અને બેઠકની ઊંડાઈ પરથી નક્કી કરીએ છીએ, જ્યાં લોકો ઊભા રહે ત્યાં બેકડ્રોપનો વચ્ચેનો ભાગ સાદો રાખીએ છીએ, અને વિગત કિનારીએ મૂકીએ છીએ. એ જ ફ્રેમ પર ફૂલોની દીવાલ, 3D પેનલ કે LED સ્ક્રીન લાગી શકે — બાંધકામ બદલ્યા વગર દેખાવ બદલાય.',
        process: [
          {
            title: 'ઊંચાઈ અને નજર',
            body: 'બેઠક કેટલી ઊંડી છે અને ઓરડો કેટલો ઊંચો છે એ પરથી પ્લેટફોર્મની ઊંચાઈ નક્કી કરીએ છીએ — પાછળની હરોળને સ્ટેજ દેખાય અને આગળવાળાને ડોક ઊંચી ન કરવી પડે.',
          },
          {
            title: 'બેકડ્રોપની પસંદગી',
            body: 'ફૂલ, પેનલ કે LED — લાઇટિંગના આયોજન સામે રાખીને પસંદ થાય, કારણ કે ગરમ પ્રકાશમાં સારું લાગતું બેકડ્રોપ રંગીન લાઇટમાં ખોવાઈ જાય.',
          },
          {
            title: 'બાંધકામ અને સજાવટ',
            body: 'પ્લેટફોર્મ, પછી ફ્રેમ, પછી બેકડ્રોપની સપાટી, પછી ફૂલ. પગથિયાં અને રેમ્પ પણ સાથે જ — પાછળથી નહીં.',
          },
          {
            title: 'લાઇટ ચાલુ રાખીને છેલ્લી ચકાસણી',
            body: 'પ્રકાશમાં, છેલ્લી હરોળથી અને કેમેરામાંથી જોઈને જ કામ પૂરું ગણીએ છીએ.',
          },
        ],
        closing:
          'સ્ટેજ પર એકસાથે કેટલા લોકો ઊભા રહેશે એ જણાવો — ત્રીસ સગાંવહાલાં સાથેના ફોટા માટે જોઈતી પહોળાઈ અને વર-કન્યા તથા બે ખુરશી માટેની પહોળાઈ સાવ અલગ છે.',
      },
    },
    inclusions: [
      { en: 'Stage platform with steps and a ramp', gu: 'પગથિયાં અને રેમ્પ સાથે સ્ટેજ પ્લેટફોર્મ' },
      {
        en: 'Backdrop frame taking floral, panel or LED',
        gu: 'ફૂલ, પેનલ કે LED લઈ શકે એવી બેકડ્રોપ ફ્રેમ',
      },
      {
        en: 'Carpet or floor covering on the platform',
        gu: 'પ્લેટફોર્મ પર કાર્પેટ કે ફ્લોર કવરિંગ',
      },
      { en: 'Seating and side props for the family', gu: 'પરિવાર માટે બેઠક અને બાજુના પ્રોપ્સ' },
      { en: 'Stage lighting matched to the backdrop', gu: 'બેકડ્રોપ સાથે મેળ ખાતી સ્ટેજ લાઇટ' },
      {
        en: 'Ramp or aisle from the entry where the space allows',
        gu: 'જગ્યા હોય ત્યાં પ્રવેશથી રેમ્પ કે માર્ગ',
      },
    ],
    options: [
      {
        nameEn: 'Floral wall',
        nameGu: 'ફૂલોની દીવાલ',
        descEn:
          'Fresh or artificial flowers across the full backdrop. The safest choice for photographs and the one families ask for most.',
        descGu:
          'આખા બેકડ્રોપ પર તાજા કે આર્ટિફિશિયલ ફૂલ. ફોટા માટે સૌથી સલામત, અને પરિવારો સૌથી વધુ માંગે એ.',
      },
      {
        nameEn: '3D panelled backdrop',
        nameGu: '3D પેનલ બેકડ્રોપ',
        descEn:
          'Carved or layered panels with depth, lit from the side so the relief shows rather than flattening under front light.',
        descGu:
          'ઊંડાણવાળી કોતરેલી કે સ્તરવાળી પેનલ, બાજુથી પ્રકાશિત — જેથી ઉપસાવ દેખાય, આગળના પ્રકાશમાં સપાટ ન થાય.',
      },
      {
        nameEn: 'LED backdrop',
        nameGu: 'LED બેકડ્રોપ',
        descEn:
          'A screen behind the stage for names, photographs or live relay. Needs its own power and a careful brightness setting for cameras.',
        descGu:
          'નામ, ફોટા કે લાઇવ પ્રસારણ માટે સ્ટેજ પાછળ સ્ક્રીન. એને પોતાનો પાવર જોઈએ અને કેમેરા માટે તેજ ધ્યાનથી ગોઠવવું પડે.',
      },
      {
        nameEn: 'Revolving or split stage',
        nameGu: 'ફરતું કે વિભાજિત સ્ટેજ',
        descEn:
          'For sangeet and stage programmes where a performance area and a seating area both have to be visible.',
        descGu:
          'સંગીત અને સ્ટેજ કાર્યક્રમ માટે — જ્યાં પર્ફોર્મન્સની જગ્યા અને બેઠકની જગ્યા બંને દેખાવી જોઈએ.',
      },
    ],
    specs: [
      {
        labelEn: 'Platform height',
        labelGu: 'પ્લેટફોર્મની ઊંચાઈ',
        value: '1 ft – 4 ft by room depth',
      },
      { labelEn: 'Backdrop width', labelGu: 'બેકડ્રોપની પહોળાઈ', value: '12 ft – 40 ft' },
      { labelEn: 'Backdrop height', labelGu: 'બેકડ્રોપની ઊંચાઈ', value: '8 ft – 16 ft' },
      { labelEn: 'Surfaces', labelGu: 'સપાટી', value: 'Floral · 3D panel · LED · fabric' },
      { labelEn: 'Access', labelGu: 'ચઢવાનો રસ્તો', value: 'Steps and ramp included' },
      { labelEn: 'Power', labelGu: 'પાવર', value: 'Separate feed if an LED wall is used' },
    ],
    pricing: {
      unitEn: 'per stage',
      unitGu: 'પ્રતિ સ્ટેજ',
      factors: [
        { en: 'Stage width and platform height', gu: 'સ્ટેજની પહોળાઈ અને પ્લેટફોર્મની ઊંચાઈ' },
        {
          en: 'Backdrop surface — floral, panel or LED',
          gu: 'બેકડ્રોપની સપાટી — ફૂલ, પેનલ કે LED',
        },
        { en: 'Fresh flower quantity', gu: 'તાજા ફૂલનું પ્રમાણ' },
        { en: 'Whether a ramp or aisle is added', gu: 'રેમ્પ કે માર્ગ ઉમેરવાનો છે કે નહીં' },
        { en: 'Number of days it stands', gu: 'કેટલા દિવસ ઊભું રહે છે' },
      ],
    },
    faqs: [
      {
        question: { en: 'How high should the stage be?', gu: 'સ્ટેજ કેટલું ઊંચું રાખવું?' },
        answer: {
          en: 'It depends on how deep the seating runs. A shallow hall works at a foot or two; a long ground needs more so the back rows are not looking at the heads in front. We set it at the site visit rather than to a standard figure.',
          gu: 'બેઠક કેટલી ઊંડી છે એના પર આધાર છે. નાના હોલમાં એક-બે ફૂટ ચાલે; લાંબા મેદાનમાં વધુ જોઈએ, જેથી પાછળની હરોળને આગળનાં માથાં ન દેખાય. અમે નિશ્ચિત આંકડો નહીં, સાઇટ વિઝિટમાં નક્કી કરીએ છીએ.',
        },
      },
      {
        question: { en: 'Floral wall or LED screen?', gu: 'ફૂલોની દીવાલ કે LED સ્ક્રીન?' },
        answer: {
          en: 'A floral wall photographs better and needs no power; an LED screen lets you show names, photographs or a live relay to a large hall. Many functions use both — LED to one side, floral behind where the family stands.',
          gu: 'ફૂલોની દીવાલ ફોટામાં સારી આવે અને એને પાવર ન જોઈએ; LED સ્ક્રીનથી મોટા હોલમાં નામ, ફોટા કે લાઇવ પ્રસારણ બતાવી શકાય. ઘણા પ્રસંગોમાં બંને હોય — એક બાજુ LED, અને પરિવાર ઊભો રહે ત્યાં પાછળ ફૂલ.',
        },
      },
      {
        question: {
          en: 'Can the backdrop carry our names or a photo?',
          gu: 'બેકડ્રોપ પર અમારાં નામ કે ફોટો આવી શકે?',
        },
        answer: {
          en: 'Yes, printed or on an LED screen. Send the spelling exactly as you want it, in writing, a few days before — names are the single most common thing to be corrected on the morning of a function.',
          gu: 'હા, પ્રિન્ટ કરીને કે LED સ્ક્રીન પર. જોડણી બરાબર જોઈએ એ રીતે, લખીને, થોડા દિવસ પહેલાં મોકલો — પ્રસંગની સવારે સૌથી વધુ સુધારો નામમાં જ થતો હોય છે.',
        },
      },
      {
        question: {
          en: 'Do you provide the sofa and chairs on stage?',
          gu: 'સ્ટેજ પરના સોફા અને ખુરશી તમે આપો છો?',
        },
        answer: {
          en: 'Yes — VIP sofa sets and side chairs come from our own furniture stock, cleaned and counted before loading. They are quoted with the stage or separately, whichever suits.',
          gu: 'હા — VIP સોફા સેટ અને બાજુની ખુરશીઓ અમારા પોતાના ફર્નિચરમાંથી, સાફ કરીને અને ગણીને. સ્ટેજ સાથે કે અલગ, જે ફાવે એ રીતે ભાવમાં આવે.',
        },
      },
    ],
  },
  {
    slug: 'flower-floral-decoration-surendranagar',
    content: {
      en: {
        promise:
          'Fresh marigold and rose work for the vidhi, or artificial that still looks new on day three.',
        intro:
          'Fresh flowers are cut the morning they are used. That is what makes them right for a vidhi and wrong for a gate that has to stand from Thursday to Sunday in May. Most families end up using both, and the skill is knowing which goes where. We put fresh marigold and rose on the mandap, the chauri and the stage where people are photographed close up, and good artificial work on the gates, walkways and backdrops that have to hold for days. Garlands, torans, rangoli and the vidhi thali work are made up on site the morning of, not the night before, so nothing has wilted by the time the muhurat comes round.',
        process: [
          {
            title: 'Decide fresh against artificial',
            body: 'We go through the function day by day and mark which surfaces are seen close up and which have to last, then split the work accordingly.',
          },
          {
            title: 'Colour against the fabric',
            body: 'Flowers are chosen with the mandap fabric and the lighting in front of us, not from a catalogue photograph in different light.',
          },
          {
            title: 'Artificial first, fresh last',
            body: 'The long-standing work goes up days ahead. Fresh garlands, torans and mandap flowers are made up on the morning itself.',
          },
          {
            title: 'Touch-up before the vidhi',
            body: 'Someone goes round before the ceremony replacing anything that has drooped in the heat.',
          },
        ],
        closing:
          'If you have a flower your family always uses, tell us at the site visit. Availability changes through the year and it is better to plan round it than to find out on the morning.',
      },
      gu: {
        promise:
          'વિધિ માટે તાજા ગલગોટા અને ગુલાબનું કામ, અથવા ત્રીજા દિવસે પણ નવું લાગે એવું આર્ટિફિશિયલ.',
        intro:
          'તાજા ફૂલ વપરાય એ જ સવારે કપાય છે. એટલે જ એ વિધિ માટે યોગ્ય છે અને મે મહિનામાં ગુરુવારથી રવિવાર ઊભા રહેતા ગેટ માટે નહીં. મોટા ભાગનાં કુટુંબો બંને વાપરે છે, અને આવડત એ છે કે કયું ક્યાં મૂકવું. અમે મંડપ, ચોરી અને સ્ટેજ — જ્યાં નજીકથી ફોટા પડે ત્યાં તાજા ગલગોટા અને ગુલાબ મૂકીએ છીએ, અને ગેટ, રસ્તા તથા બેકડ્રોપ — જે દિવસો સુધી ટકવાનાં હોય ત્યાં સારું આર્ટિફિશિયલ કામ. હાર, તોરણ, રંગોળી અને વિધિની થાળીનું કામ આગલી રાત્રે નહીં, એ જ સવારે સાઇટ પર તૈયાર થાય — જેથી મુહૂર્ત આવે ત્યાં સુધીમાં કંઈ કરમાય નહીં.',
        process: [
          {
            title: 'તાજા કે આર્ટિફિશિયલ નક્કી કરવું',
            body: 'પ્રસંગ દિવસવાર જોઈને નક્કી કરીએ છીએ કે કઈ સપાટી નજીકથી દેખાય છે અને કઈ ટકવાની છે, અને એ પ્રમાણે કામ વહેંચીએ છીએ.',
          },
          {
            title: 'કાપડ સામે રંગ',
            body: 'ફૂલ મંડપના કાપડ અને લાઇટિંગ સામે રાખીને પસંદ થાય — બીજા પ્રકાશમાં પડેલા કેટલોગના ફોટા પરથી નહીં.',
          },
          {
            title: 'પહેલાં આર્ટિફિશિયલ, છેલ્લે તાજા',
            body: 'લાંબું ટકવાનું કામ દિવસો પહેલાં થાય. તાજા હાર, તોરણ અને મંડપનાં ફૂલ પ્રસંગની સવારે જ બને.',
          },
          {
            title: 'વિધિ પહેલાં સુધારો',
            body: 'વિધિ પહેલાં એક માણસ ફરીને ગરમીમાં કરમાયેલું બધું બદલી નાખે.',
          },
        ],
        closing:
          'તમારા પરિવારમાં કોઈ ખાસ ફૂલ હંમેશાં વપરાતું હોય તો સાઇટ વિઝિટમાં જણાવો. વર્ષ દરમિયાન એની ઉપલબ્ધતા બદલાય છે — સવારે ખબર પડે એના કરતાં પહેલેથી આયોજન કરવું સારું.',
      },
    },
    inclusions: [
      { en: 'Mandap and chauri floral dressing', gu: 'મંડપ અને ચોરીની ફૂલસજાવટ' },
      { en: 'Stage and backdrop floral work', gu: 'સ્ટેજ અને બેકડ્રોપનું ફૂલકામ' },
      { en: 'Garlands and torans, made up on the day', gu: 'હાર અને તોરણ, પ્રસંગના દિવસે તૈયાર' },
      { en: 'Entry gate and walkway flowers', gu: 'એન્ટ્રી ગેટ અને રસ્તાનાં ફૂલ' },
      { en: 'Table and counter arrangements', gu: 'ટેબલ અને કાઉન્ટરની ગોઠવણ' },
      { en: 'Rangoli at the entrance', gu: 'પ્રવેશ પર રંગોળી' },
      { en: 'Touch-up round before the ceremony', gu: 'વિધિ પહેલાં સુધારાનો ફેરો' },
    ],
    options: [
      {
        nameEn: 'Fresh marigold and rose',
        nameGu: 'તાજા ગલગોટા અને ગુલાબ',
        descEn:
          'The traditional choice, cut the morning of. Right for the vidhi, the mandap and anything photographed close up.',
        descGu:
          'પરંપરાગત પસંદગી, એ જ સવારે કપાયેલા. વિધિ, મંડપ અને નજીકથી ફોટા પડે એવી દરેક જગ્યા માટે યોગ્ય.',
      },
      {
        nameEn: 'Imported and seasonal fresh',
        nameGu: 'આયાતી અને મોસમી તાજા ફૂલ',
        descEn:
          'Orchids, lilies and carnations where the look calls for them. Availability and cost move with the season, so decide early.',
        descGu:
          'જ્યાં દેખાવ માંગે ત્યાં ઓર્કિડ, લિલી અને કાર્નેશન. ઉપલબ્ધતા અને ભાવ મોસમ પ્રમાણે બદલાય, એટલે વહેલું નક્કી કરવું.',
      },
      {
        nameEn: 'Artificial and dried',
        nameGu: 'આર્ટિફિશિયલ અને સૂકાં',
        descEn:
          'For gates, walkways and backdrops standing several days, and for outdoor work in summer heat where fresh will not hold.',
        descGu:
          'ઘણા દિવસ ઊભા રહેતા ગેટ, રસ્તા અને બેકડ્રોપ માટે, અને ઉનાળાની ગરમીમાં ખુલ્લા કામ માટે — જ્યાં તાજા ટકે નહીં.',
      },
    ],
    specs: [
      {
        labelEn: 'Fresh flowers',
        labelGu: 'તાજા ફૂલ',
        value: 'Marigold · rose · jasmine · seasonal',
      },
      { labelEn: 'Made up', labelGu: 'તૈયાર થાય', value: 'On site, the morning of the function' },
      {
        labelEn: 'Artificial',
        labelGu: 'આર્ટિફિશિયલ',
        value: 'For multi-day and outdoor surfaces',
      },
      {
        labelEn: 'Typical fresh life',
        labelGu: 'તાજા ફૂલની સામાન્ય ટકાઉપણ',
        value: 'One function day',
      },
      { labelEn: 'Touch-up', labelGu: 'સુધારો', value: 'Before the ceremony, included' },
    ],
    pricing: {
      unitEn: 'by quantity',
      unitGu: 'પ્રમાણ પ્રમાણે',
      factors: [
        {
          en: 'How much of the work is fresh rather than artificial',
          gu: 'કામમાં તાજા ફૂલનું પ્રમાણ કેટલું છે',
        },
        { en: 'Flower type and what is in season', gu: 'ફૂલનો પ્રકાર અને મોસમમાં શું છે' },
        { en: 'Total surface area being dressed', gu: 'સજાવવાનો કુલ વિસ્તાર' },
        { en: 'How many days and functions', gu: 'કેટલા દિવસ અને કેટલા પ્રસંગ' },
        { en: 'Lagan season demand', gu: 'લગનસરાની માંગ' },
      ],
    },
    faqs: [
      {
        question: {
          en: 'Will fresh flowers last the whole function?',
          gu: 'તાજા ફૂલ આખા પ્રસંગ સુધી ટકશે?',
        },
        answer: {
          en: 'For one function day, yes — they are made up on site that morning and we do a touch-up round before the ceremony. Across three or four days in summer heat, no, which is why the long-standing surfaces are done in artificial.',
          gu: 'એક દિવસના પ્રસંગ માટે હા — એ સવારે સાઇટ પર બને છે અને વિધિ પહેલાં અમે સુધારાનો ફેરો કરીએ છીએ. ઉનાળામાં ત્રણ-ચાર દિવસ સુધી નહીં — એટલે જ લાંબું ટકવાનું કામ આર્ટિફિશિયલમાં થાય છે.',
        },
      },
      {
        question: {
          en: 'Can you match the flowers to our outfits?',
          gu: 'અમારાં કપડાં સાથે ફૂલનો રંગ મેળવી શકો?',
        },
        answer: {
          en: 'Send photographs of the outfits and the mandap fabric together. Matching to one and not the other is the usual mistake, and a colour that looks right in daylight can change completely under warm mandap lighting.',
          gu: 'કપડાં અને મંડપના કાપડ — બંનેના ફોટા સાથે મોકલો. એકને મેળવીને બીજાને ભૂલી જવું એ સામાન્ય ભૂલ છે, અને દિવસના પ્રકાશમાં બરાબર લાગતો રંગ ગરમ મંડપ લાઇટમાં સાવ બદલાઈ જાય છે.',
        },
      },
      {
        question: {
          en: 'Is artificial flower work obvious in photographs?',
          gu: 'ફોટામાં આર્ટિફિશિયલ ફૂલ દેખાઈ આવે છે?',
        },
        answer: {
          en: 'Good artificial work at gate and backdrop distance is not. Close up, in a photograph of someone holding it, it is. That is why we keep fresh where hands and faces are and artificial where the camera is further away.',
          gu: 'ગેટ અને બેકડ્રોપના અંતરે સારું આર્ટિફિશિયલ કામ ખબર પડતી નથી. કોઈ હાથમાં પકડીને ફોટો પડાવે ત્યાં પડે છે. એટલે જ જ્યાં હાથ અને ચહેરા હોય ત્યાં તાજા, અને કેમેરા દૂર હોય ત્યાં આર્ટિફિશિયલ રાખીએ છીએ.',
        },
      },
    ],
  },
  {
    slug: 'themed-decoration-surendranagar',
    content: {
      en: {
        promise:
          'Rajwadi, Kathiawadi, floral, rustic or minimal — chosen to suit your venue, not picked off a catalogue.',
        intro:
          'A theme is not a set of props. It is a decision about colour, fabric, light and scale that has to survive contact with your actual venue. The setup in the photograph you liked was probably built for a hall with a fixed ceiling to hang from; in an open field there is nothing above to hang anything on, so it has to be reached another way. We start from your venue and your budget, show you what will and will not carry across, and then commit to one direction properly rather than mixing three. A Kathiawadi theme done fully — bandhani, brass, mirror work, warm light — reads better than an expensive setup that cannot decide what it is.',
        process: [
          {
            title: 'Reference and reality check',
            body: 'Send the photographs you like. We tell you plainly which parts work on your ground, which do not, and what gets close.',
          },
          {
            title: 'Palette and materials',
            body: 'Colour, fabric and finish are fixed together, then everything else follows them — including the lighting, which is usually decided too late.',
          },
          {
            title: 'One direction, carried through',
            body: 'Gate, walkway, mandap, stage and dining all take the same treatment, so the function reads as one thing rather than five.',
          },
          {
            title: 'Build and dress',
            body: 'Structure and fabric first, props and detail last, with the whole thing checked under the evening lighting before handover.',
          },
        ],
        closing:
          'We would rather do a simple theme completely than an elaborate one halfway. If the budget will not carry the full idea, say so early and we will scale the idea, not the finish.',
      },
      gu: {
        promise:
          'રજવાડી, કાઠિયાવાડી, ફ્લોરલ, રસ્ટિક કે મિનિમલ — કેટલોગમાંથી નહીં, તમારી જગ્યા પ્રમાણે.',
        intro:
          'થીમ એટલે પ્રોપ્સનો ઢગલો નહીં. એ રંગ, કાપડ, પ્રકાશ અને પ્રમાણ વિશેનો નિર્ણય છે — અને એ તમારી ખરી જગ્યા સામે ટકવો જોઈએ. તમને ગમેલા ફોટામાંનું સેટઅપ કદાચ છત પરથી લટકાવવા માટે બનેલા હોલ માટે હતું; ખુલ્લા મેદાનમાં ઉપર લટકાવવા કંઈ હોતું નથી, એટલે એ બીજી રીતે લાવવું પડે. અમે તમારી જગ્યા અને બજેટથી શરૂ કરીએ છીએ, શું આવી શકશે અને શું નહીં એ બતાવીએ છીએ, અને પછી ત્રણ થીમ ભેળવવાને બદલે એક દિશા બરાબર પકડીએ છીએ. પૂરેપૂરી કરેલી કાઠિયાવાડી થીમ — બાંધણી, પિત્તળ, આભલા ભરત, ગરમ પ્રકાશ — એ મોંઘા પણ અસ્પષ્ટ સેટઅપ કરતાં વધુ સારી લાગે છે.',
        process: [
          {
            title: 'સંદર્ભ અને વાસ્તવિકતા',
            body: 'તમને ગમતા ફોટા મોકલો. અમે સ્પષ્ટ કહીશું કે તમારા મેદાનમાં કયો ભાગ થશે, કયો નહીં, અને એની કેટલી નજીક પહોંચાશે.',
          },
          {
            title: 'રંગ અને સામગ્રી',
            body: 'રંગ, કાપડ અને ફિનિશ સાથે નક્કી થાય, અને પછી બાકીનું બધું એની પાછળ ચાલે — લાઇટિંગ સહિત, જે સામાન્ય રીતે બહુ મોડું નક્કી થાય છે.',
          },
          {
            title: 'એક દિશા, બધે સુધી',
            body: 'ગેટ, રસ્તો, મંડપ, સ્ટેજ અને જમણ — બધે એક જ ટ્રીટમેન્ટ, જેથી પ્રસંગ પાંચ અલગ ટુકડા નહીં પણ એક લાગે.',
          },
          {
            title: 'બાંધકામ અને સજાવટ',
            body: 'પહેલાં સ્ટ્રક્ચર અને કાપડ, છેલ્લે પ્રોપ્સ અને વિગત — અને સોંપતાં પહેલાં આખું સાંજની લાઇટમાં ચકાસાય.',
          },
        ],
        closing:
          'અડધીપડધી ભવ્ય થીમ કરતાં પૂરેપૂરી સાદી થીમ અમને વધુ ગમે. બજેટમાં આખો વિચાર ન સમાય તો વહેલું કહો — અમે ફિનિશ નહીં, વિચારનું પ્રમાણ ઘટાડીશું.',
      },
    },
    inclusions: [
      { en: 'A single palette carried across every area', gu: 'દરેક વિસ્તારમાં એક જ રંગયોજના' },
      {
        en: 'Fabric, props and finishes selected together',
        gu: 'કાપડ, પ્રોપ્સ અને ફિનિશ સાથે પસંદ',
      },
      { en: 'Lighting planned as part of the theme', gu: 'થીમના ભાગ તરીકે લાઇટિંગનું આયોજન' },
      {
        en: 'Gate, walkway, mandap and stage treated alike',
        gu: 'ગેટ, રસ્તો, મંડપ અને સ્ટેજ — સરખું ટ્રીટમેન્ટ',
      },
      {
        en: 'Honest advice on what your venue can carry',
        gu: 'તમારી જગ્યામાં શું થઈ શકે એની સાચી સલાહ',
      },
    ],
    options: [
      {
        nameEn: 'Kathiawadi',
        nameGu: 'કાઠિયાવાડી',
        descEn:
          'Bandhani, mirror work, brass and warm light. Local, familiar, and it photographs beautifully in the evening.',
        descGu:
          'બાંધણી, આભલા ભરત, પિત્તળ અને ગરમ પ્રકાશ. સ્થાનિક, પરિચિત, અને સાંજના ફોટામાં ખૂબ સુંદર.',
      },
      {
        nameEn: 'Rajwadi',
        nameGu: 'રજવાડી',
        descEn:
          'Heavy drapes, deep reds and gold, carved props and a raised stage. Suits a large hall and a big guest list.',
        descGu:
          'ભારે ડ્રેપ, ઘેરા લાલ અને સોનેરી, કોતરેલા પ્રોપ્સ અને ઊંચું સ્ટેજ. મોટા હોલ અને મોટી મહેમાન યાદી માટે યોગ્ય.',
      },
      {
        nameEn: 'Floral',
        nameGu: 'ફ્લોરલ',
        descEn:
          'Flowers as the main material rather than an addition, with the structure kept light so they carry the look.',
        descGu: 'ફૂલ ઉમેરણ નહીં પણ મુખ્ય સામગ્રી, અને સ્ટ્રક્ચર હલકું — જેથી દેખાવ ફૂલો પર જ ટકે.',
      },
      {
        nameEn: 'Rustic',
        nameGu: 'રસ્ટિક',
        descEn:
          'Natural wood, jute, earthen pots and warm string lighting. Works well outdoors and on a smaller budget.',
        descGu:
          'કુદરતી લાકડું, શણ, માટીનાં માટલાં અને ગરમ સ્ટ્રિંગ લાઇટ. ખુલ્લામાં અને ઓછા બજેટમાં સારું કામ આપે.',
      },
      {
        nameEn: 'Minimal',
        nameGu: 'મિનિમલ',
        descEn:
          'Few materials, a lot of clear space and careful light. Cheaper to build and unforgiving of a rushed finish.',
        descGu:
          'ઓછી સામગ્રી, ઘણી ખાલી જગ્યા અને ધ્યાનથી કરેલો પ્રકાશ. બાંધવામાં સસ્તું, પણ ઉતાવળે કરેલી ફિનિશ તરત દેખાઈ જાય.',
      },
    ],
    specs: [
      {
        labelEn: 'Applies to',
        labelGu: 'ક્યાં લાગુ પડે',
        value: 'Gate · walkway · mandap · stage · dining',
      },
      { labelEn: 'Decided at', labelGu: 'ક્યારે નક્કી થાય', value: 'Site visit, before booking' },
      { labelEn: 'Palette', labelGu: 'રંગયોજના', value: 'Fixed once, carried throughout' },
      { labelEn: 'Lighting', labelGu: 'લાઇટિંગ', value: 'Planned with the theme, not after' },
      { labelEn: 'Indoor / outdoor', labelGu: 'અંદર / બહાર', value: 'Both, with different builds' },
    ],
    pricing: {
      unitEn: 'per function',
      unitGu: 'પ્રતિ પ્રસંગ',
      factors: [
        { en: 'How many areas take the treatment', gu: 'કેટલા વિસ્તારમાં ટ્રીટમેન્ટ કરવાનું છે' },
        { en: 'Materials and finish level', gu: 'સામગ્રી અને ફિનિશનું સ્તર' },
        { en: 'Fresh flower content', gu: 'તાજા ફૂલનું પ્રમાણ' },
        { en: 'Whether the venue is indoor or open ground', gu: 'જગ્યા હોલ છે કે ખુલ્લું મેદાન' },
        { en: 'Days on site', gu: 'સાઇટ પરના દિવસો' },
      ],
    },
    faqs: [
      {
        question: {
          en: 'Can you match a theme from a photo I send?',
          gu: 'હું ફોટો મોકલું એવી થીમ કરી શકો?',
        },
        answer: {
          en: 'Send it on WhatsApp and we will tell you honestly what works on your ground and what does not. A setup built for a banquet hall ceiling often cannot be hung the same way in an open field, but the look can usually be reached another way.',
          gu: 'WhatsApp પર મોકલો, અમે સાચું કહીશું કે તમારા મેદાનમાં શું થઈ શકે અને શું નહીં. બેન્ક્વેટ હોલની છત માટે બનેલી ગોઠવણ ખુલ્લા મેદાનમાં એ જ રીતે લટકાવી શકાતી નથી, પણ એવો દેખાવ બીજી રીતે લાવી શકાય છે.',
        },
      },
      {
        question: { en: 'Can we mix two themes?', gu: 'બે થીમ ભેળવી શકીએ?' },
        answer: {
          en: 'Across different functions, yes — a rustic haldi and a Rajwadi reception work well together. Within one room, usually not. Two themes in one space tends to read as neither, and it costs more than doing one properly.',
          gu: 'અલગ અલગ પ્રસંગોમાં હા — રસ્ટિક હળદી અને રજવાડી રિસેપ્શન સાથે સારાં લાગે. એક જ જગ્યામાં સામાન્ય રીતે નહીં. એક જગ્યાએ બે થીમ હોય તો બેમાંથી એકેય લાગતું નથી, અને એક બરાબર કરવા કરતાં ખર્ચ પણ વધુ થાય.',
        },
      },
      {
        question: { en: 'Which theme is cheapest?', gu: 'સૌથી સસ્તી થીમ કઈ?' },
        answer: {
          en: 'Rustic and minimal usually cost less to build, but minimal shows every shortcut, so it is not automatically the safe budget choice. If cost is the constraint, tell us the number and we will pick the direction that looks best at it.',
          gu: 'રસ્ટિક અને મિનિમલ બાંધવામાં સામાન્ય રીતે સસ્તાં પડે, પણ મિનિમલમાં દરેક ઉતાવળ દેખાઈ આવે — એટલે એ આપોઆપ સલામત બજેટ પસંદગી નથી. ખર્ચ મર્યાદા હોય તો આંકડો કહો, અમે એમાં સૌથી સારી લાગે એ દિશા પસંદ કરીશું.',
        },
      },
    ],
  },
];
