import type { ServiceSeed } from './types';

/** Sound, DJ and lighting — everything that has to be heard or seen. */
export const avServices: ServiceSeed[] = [
  {
    slug: 'sound-system-pa-service-surendranagar',
    content: {
      en: {
        promise:
          'Line array, delay towers and wireless mics — with an engineer on the console, not just an operator.',
        intro:
          'Most sound complaints are not about volume. They are about the back rows hearing a beat late, a maharaj being lost under a talking crowd, or a live band and a recorded track sharing one setting that suits neither. We size a system from the shape of your ground rather than the headcount, put delay towers in when the length demands them, and keep an engineer at the console for the whole function. Speech, bhajan, live band and DJ each get their own mix. Amps are backed up, cabling is run clear of walkways, and the mics your maharaj or your compere will actually use are tested before the guests arrive, not during the first speech.',
        process: [
          {
            title: 'Ground and layout',
            body: 'We walk the space for length, width and whether it is covered. A long narrow ground needs delay towers; an open one needs more power than a hanger of the same size.',
          },
          {
            title: 'System design',
            body: 'Speaker positions, delay timing, mic count and console are decided together, then shown to you as a layout rather than a list of equipment.',
          },
          {
            title: 'Rig and soundcheck',
            body: 'Everything is rigged and checked before guests arrive — every mic, every channel, and the actual playlist rather than a test tone.',
          },
          {
            title: 'Engineer through the function',
            body: 'One engineer stays at the console from the first announcement to the last. Mixes change through the evening; someone has to be there to change them.',
          },
        ],
        closing:
          'If your function has a live band, a katha or a garba night, say so when you ask for a quote. Those three need very different rigs, and the difference is easier to plan than to fix on the night.',
      },
      gu: {
        promise:
          'લાઇન એરે, ડિલે ટાવર અને વાયરલેસ માઇક — કન્સોલ પર ખાલી ઓપરેટર નહીં, સાઉન્ડ એન્જિનિયર.',
        intro:
          'સાઉન્ડની મોટા ભાગની ફરિયાદો અવાજ ઓછો-વત્તો હોવાની નથી હોતી. ફરિયાદ એ હોય છે કે પાછળની હરોળને બીટ મોડો સંભળાય છે, ભીડના અવાજમાં મહારાજનો અવાજ ખોવાઈ જાય છે, અથવા લાઇવ બેન્ડ અને રેકોર્ડેડ ટ્રેક એક જ સેટિંગ પર ચાલે છે જે બેમાંથી એકેયને બંધબેસતું નથી. અમે સિસ્ટમ સંખ્યા પરથી નહીં, મેદાનના આકાર પરથી નક્કી કરીએ છીએ, લંબાઈ માંગે ત્યાં ડિલે ટાવર મૂકીએ છીએ, અને આખા પ્રસંગ દરમિયાન કન્સોલ પર એન્જિનિયર રાખીએ છીએ. ભાષણ, ભજન, લાઇવ બેન્ડ અને DJ — દરેકનું મિક્સ અલગ. એમ્પ્લિફાયરનો બેકઅપ હોય, કેબલ ચાલવાના રસ્તાથી દૂર હોય, અને મહારાજ કે સંચાલક જે માઇક વાપરવાના છે એ મહેમાનો આવે એ પહેલાં ચકાસાય — પહેલા ભાષણ દરમિયાન નહીં.',
        process: [
          {
            title: 'મેદાન અને ગોઠવણ',
            body: 'લંબાઈ, પહોળાઈ અને ઢાંકેલું છે કે નહીં એ જોઈએ છીએ. લાંબા-સાંકડા મેદાનમાં ડિલે ટાવર જોઈએ; ખુલ્લા મેદાનમાં એ જ માપના હેંગર કરતાં વધુ પાવર જોઈએ.',
          },
          {
            title: 'સિસ્ટમની રચના',
            body: 'સ્પીકરની જગ્યા, ડિલેનો સમય, માઇકની સંખ્યા અને કન્સોલ સાથે નક્કી થાય, અને તમને સાધનોની યાદી નહીં પણ ગોઠવણનો નકશો બતાવીએ છીએ.',
          },
          {
            title: 'રિગિંગ અને સાઉન્ડચેક',
            body: 'મહેમાનો આવે એ પહેલાં બધું ગોઠવાઈને ચકાસાય — દરેક માઇક, દરેક ચેનલ, અને ટેસ્ટ ટોન નહીં પણ ખરી પ્લેલિસ્ટ.',
          },
          {
            title: 'આખા પ્રસંગ દરમિયાન એન્જિનિયર',
            body: 'પહેલી જાહેરાતથી છેલ્લી સુધી એક એન્જિનિયર કન્સોલ પર રહે. સાંજ દરમિયાન મિક્સ બદલાય છે; બદલવા માટે કોઈએ ત્યાં હોવું પડે.',
          },
        ],
        closing:
          'તમારા પ્રસંગમાં લાઇવ બેન્ડ, કથા કે ગરબાની રાત હોય તો ક્વોટ માંગતી વખતે જ જણાવો. ત્રણેયની સિસ્ટમ સાવ અલગ હોય છે, અને એ રાત્રે સુધારવા કરતાં પહેલેથી ગોઠવવું સહેલું છે.',
      },
    },
    inclusions: [
      {
        en: 'Line array or point-source stacks sized to the ground',
        gu: 'મેદાન પ્રમાણે લાઇન એરે કે પોઇન્ટ-સોર્સ સ્પીકર',
      },
      { en: 'Delay towers where the length needs them', gu: 'લંબાઈ માંગે ત્યાં ડિલે ટાવર' },
      { en: 'Wireless handheld and collar mics', gu: 'વાયરલેસ હેન્ડહેલ્ડ અને કોલર માઇક' },
      {
        en: 'Digital console with separate mixes for speech, band and track',
        gu: 'ભાષણ, બેન્ડ અને ટ્રેક માટે અલગ મિક્સ સાથે ડિજિટલ કન્સોલ',
      },
      {
        en: 'Backup amplifier and spare mics on site',
        gu: 'સાઇટ પર બેકઅપ એમ્પ્લિફાયર અને વધારાના માઇક',
      },
      { en: 'Sound engineer for the whole function', gu: 'આખા પ્રસંગ માટે સાઉન્ડ એન્જિનિયર' },
      { en: 'Cabling routed clear of walkways', gu: 'ચાલવાના રસ્તાથી દૂર રાખેલું કેબલિંગ' },
      { en: 'Soundcheck before guests arrive', gu: 'મહેમાનો આવે એ પહેલાં સાઉન્ડચેક' },
    ],
    options: [
      {
        nameEn: 'Katha and pravachan sound',
        nameGu: 'કથા અને પ્રવચન સાઉન્ડ',
        descEn:
          'Built for clear speech over a large seated audience across several days, with the maharaj audible at the back without being harsh at the front.',
        descGu:
          'ઘણા દિવસ સુધી મોટા બેઠક-શ્રોતાગણમાં સ્પષ્ટ વાણી માટે — પાછળ સુધી મહારાજનો અવાજ પહોંચે અને આગળ કઠે નહીં.',
      },
      {
        nameEn: 'Sabha and rally sound',
        nameGu: 'સભા અને રેલી સાઉન્ડ',
        descEn:
          'High headroom with delay towers down a long ground, and a podium mic setup that survives being shared by a dozen speakers.',
        descGu:
          'લાંબા મેદાનમાં ડિલે ટાવર સાથે ઊંચો હેડરૂમ, અને બાર-પંદર વક્તાઓ વાપરે તોય ટકે એવી પોડિયમ માઇક ગોઠવણ.',
      },
      {
        nameEn: 'Wedding and reception sound',
        nameGu: 'લગ્ન અને રિસેપ્શન સાઉન્ડ',
        descEn:
          'Softer coverage across the dining area, a separate mix for the stage, and volume that lets guests at the table still talk.',
        descGu:
          'જમણની જગ્યામાં હળવો અવાજ, સ્ટેજ માટે અલગ મિક્સ, અને એટલો અવાજ કે ટેબલ પર બેઠેલા મહેમાનો વાત કરી શકે.',
      },
      {
        nameEn: 'Live band mixing',
        nameGu: 'લાઇવ બેન્ડ મિક્સિંગ',
        descEn:
          'Full input list, monitors for the musicians and a front-of-house mix that keeps the vocal above the dhol rather than under it.',
        descGu:
          'પૂરી ઇનપુટ યાદી, વાદકો માટે મોનિટર, અને એવું મિક્સ કે ગાયકનો અવાજ ઢોલ નીચે નહીં, ઉપર રહે.',
      },
    ],
    specs: [
      { labelEn: 'System size', labelGu: 'સિસ્ટમની ક્ષમતા', value: '5,000 W – 100,000 W' },
      { labelEn: 'Audience', labelGu: 'શ્રોતાગણ', value: '200 – 10,000' },
      { labelEn: 'Delay towers', labelGu: 'ડિલે ટાવર', value: 'From roughly 40 m ground length' },
      { labelEn: 'Wireless mics', labelGu: 'વાયરલેસ માઇક', value: 'Handheld and collar' },
      { labelEn: 'Console', labelGu: 'કન્સોલ', value: 'Digital, multi-scene' },
      { labelEn: 'Backup', labelGu: 'બેકઅપ', value: 'Spare amp and mics on site' },
      { labelEn: 'Engineer', labelGu: 'એન્જિનિયર', value: 'On the console throughout' },
    ],
    pricing: {
      unitEn: 'per day',
      unitGu: 'પ્રતિ દિવસ',
      factors: [
        { en: 'Ground size and whether it is covered', gu: 'મેદાનનું માપ અને ઢાંકેલું છે કે નહીં' },
        { en: 'Whether delay towers are needed', gu: 'ડિલે ટાવર જોઈએ છે કે નહીં' },
        { en: 'Number of mics and inputs', gu: 'માઇક અને ઇનપુટની સંખ્યા' },
        { en: 'How many days and sessions', gu: 'કેટલા દિવસ અને કેટલાં સત્ર' },
        { en: 'Live band or recorded only', gu: 'લાઇવ બેન્ડ છે કે ફક્ત રેકોર્ડેડ' },
      ],
    },
    faqs: [
      {
        question: {
          en: 'How much sound do I need for my guest count?',
          gu: 'મારા મહેમાનો પ્રમાણે કેટલો સાઉન્ડ જોઈએ?',
        },
        answer: {
          en: 'It depends more on the shape of the ground than the headcount. A long, narrow ground needs delay towers so the back rows hear the same beat as the front; an open ground needs more power than a covered one. We size the rig after seeing the space, anywhere from a few thousand watts to a full line array.',
          gu: 'સંખ્યા કરતાં મેદાનનો આકાર વધુ અસર કરે છે. લાંબા-સાંકડા મેદાનમાં ડિલે ટાવર જોઈએ, જેથી પાછળની હરોળને પણ આગળ જેવો જ અવાજ મળે; ખુલ્લા મેદાનમાં ઢાંકેલા કરતાં વધુ પાવર જોઈએ. જગ્યા જોયા પછી અમે સિસ્ટમ નક્કી કરીએ છીએ — થોડા હજાર વોટથી લઈને પૂરી લાઇન એરે સુધી.',
        },
      },
      {
        question: {
          en: 'Do you send an operator or a sound engineer?',
          gu: 'ઓપરેટર મોકલો છો કે સાઉન્ડ એન્જિનિયર?',
        },
        answer: {
          en: 'An engineer stays on the console for the whole function. Speech, a live band and recorded music each need a different mix, and a katha needs the maharaj audible over a crowd that is talking. Someone who only presses play cannot do that.',
          gu: 'આખા પ્રસંગ દરમિયાન એન્જિનિયર કન્સોલ પર રહે છે. ભાષણ, લાઇવ બેન્ડ અને રેકોર્ડેડ મ્યુઝિક — ત્રણેયનું મિક્સ અલગ હોય, અને કથામાં ભીડના અવાજ વચ્ચે મહારાજનો અવાજ સ્પષ્ટ સંભળાવો જોઈએ. ખાલી પ્લે દબાવનારથી એ ન થાય.',
        },
      },
      {
        question: {
          en: 'What about the 10 PM noise rule?',
          gu: 'રાત્રે 10 વાગ્યાના અવાજના નિયમનું શું?',
        },
        answer: {
          en: 'We plan the loud part of the programme to finish before the cut-off and drop the level after it rather than switching off mid-song. If your function genuinely needs to run later, that is a permission you take from the local authority — tell us early so we can set the system up accordingly.',
          gu: 'મોટા અવાજવાળો કાર્યક્રમ સમય પહેલાં પૂરો થાય એ રીતે ગોઠવીએ છીએ, અને પછી ગીત વચ્ચે બંધ કરવાને બદલે અવાજ ધીમો કરીએ છીએ. ખરેખર મોડે સુધી ચલાવવું હોય તો એની પરવાનગી સ્થાનિક તંત્ર પાસેથી લેવી પડે — વહેલું જણાવો એટલે અમે એ પ્રમાણે સિસ્ટમ ગોઠવીએ.',
        },
      },
      {
        question: {
          en: 'What happens if an amplifier fails mid-function?',
          gu: 'પ્રસંગ વચ્ચે એમ્પ્લિફાયર બગડે તો?',
        },
        answer: {
          en: 'A spare amp and spare mics travel with every rig, and the engineer on site can switch over without stopping the programme. That is most of the reason we keep someone at the console rather than leaving the system running unattended.',
          gu: 'દરેક સિસ્ટમ સાથે વધારાનું એમ્પ્લિફાયર અને વધારાના માઇક જાય છે, અને સાઇટ પરનો એન્જિનિયર કાર્યક્રમ રોક્યા વગર બદલી શકે છે. કન્સોલ પર માણસ રાખવાનું મોટું કારણ આ જ છે.',
        },
      },
      {
        question: {
          en: 'Can you run sound for several days of katha?',
          gu: 'ઘણા દિવસની કથાનો સાઉન્ડ કરી શકો?',
        },
        answer: {
          en: 'Yes. The rig stays up for the run and is checked before each session, because a system that was perfect on day one can drift after a night of dew or a windy afternoon. Tell us the daily timings as well as the total number of days.',
          gu: 'હા. આખા સમય માટે સિસ્ટમ ઊભી રહે અને દરેક સત્ર પહેલાં ચકાસાય — કારણ કે પહેલા દિવસે બરાબર હોય એ સિસ્ટમ ઝાકળવાળી રાત કે પવનવાળી બપોર પછી બદલાઈ શકે. કુલ દિવસો સાથે રોજનો સમય પણ જણાવો.',
        },
      },
    ],
  },
  {
    slug: 'dj-music-lighting-surendranagar',
    content: {
      en: {
        promise:
          'Garba-ready sound with dhol-tasha mixing, and lights cued to the beat instead of running on a loop.',
        intro:
          'A DJ setup for a Gujarati function is not the same as a club rig. Garba needs even coverage all the way round the circle, so the dancers on the far side hear the same beat as the ones near the speakers. A sangeet needs a floor that fills, then empties for a performance, then fills again. A reception needs music people can talk over. We bring the sound, the lighting and the person running both, and we cue the lights to the programme rather than leaving them cycling through colours all evening. Playlists lean Gujarati and Bollywood by default — tell us what your family actually dances to and we will build round it.',
        process: [
          {
            title: 'Programme walk-through',
            body: 'We go through the running order with you: entry, performances, garba, dinner. Each one wants a different volume and a different light state.',
          },
          {
            title: 'Speaker and light placement',
            body: 'For garba, stacks go around the ground rather than at one end. Lights are hung so the circle stays lit and the dancers are not staring into a beam.',
          },
          {
            title: 'Soundcheck with the real playlist',
            body: 'We check with the tracks you have actually chosen, and with the dhol if there is one, because live percussion changes the mix more than anything else.',
          },
          {
            title: 'Cued through the night',
            body: 'Someone runs the lights against the programme, not on a timer — so the entry, the aarti and the last garba each look different.',
          },
        ],
        closing:
          'Send your must-play list and your do-not-play list on WhatsApp before the day. The second one saves more arguments than the first.',
      },
      gu: {
        promise:
          'ગરબા માટે તૈયાર સાઉન્ડ, ઢોલ-તાશા મિક્સિંગ સાથે — અને લૂપમાં નહીં, બીટ પ્રમાણે ચાલતી લાઇટ.',
        intro:
          'ગુજરાતી પ્રસંગનું DJ સેટઅપ ક્લબની સિસ્ટમ જેવું નથી. ગરબામાં આખા વર્તુળે સરખો અવાજ પહોંચવો જોઈએ, જેથી સામે છેડે રમનારને પણ સ્પીકર પાસેના જેવો જ બીટ સંભળાય. સંગીતમાં ફ્લોર ભરાય, પછી પર્ફોર્મન્સ માટે ખાલી થાય, પછી ફરી ભરાય. રિસેપ્શનમાં એવું સંગીત જોઈએ જેની ઉપર વાત થઈ શકે. અમે સાઉન્ડ, લાઇટિંગ અને એ બંને ચલાવનાર માણસ — ત્રણેય લાવીએ છીએ, અને લાઇટ આખી સાંજ રંગ બદલતી રહે એના બદલે કાર્યક્રમ પ્રમાણે ચલાવીએ છીએ. પ્લેલિસ્ટ મુખ્યત્વે ગુજરાતી અને બોલિવૂડ — તમારા પરિવારને ખરેખર જેના પર રમવું ગમે એ કહો, અમે એની આસપાસ ગોઠવીશું.',
        process: [
          {
            title: 'કાર્યક્રમની સમજ',
            body: 'તમારી સાથે ક્રમ જોઈ લઈએ છીએ: પ્રવેશ, પર્ફોર્મન્સ, ગરબા, જમણ. દરેકનો અવાજ અને લાઇટ અલગ જોઈએ.',
          },
          {
            title: 'સ્પીકર અને લાઇટની ગોઠવણ',
            body: 'ગરબા માટે સ્પીકર એક છેડે નહીં, મેદાનની ફરતે. લાઇટ એવી લટકે કે વર્તુળ પ્રકાશિત રહે અને રમનારની આંખમાં બીમ ન પડે.',
          },
          {
            title: 'ખરી પ્લેલિસ્ટ સાથે સાઉન્ડચેક',
            body: 'તમે પસંદ કરેલા ગીતો સાથે અને ઢોલ હોય તો ઢોલ સાથે ચકાસીએ છીએ — લાઇવ ઢોલ મિક્સ સૌથી વધુ બદલે છે.',
          },
          {
            title: 'આખી રાત કાર્યક્રમ પ્રમાણે',
            body: 'ટાઇમર પર નહીં, કાર્યક્રમ પ્રમાણે લાઇટ ચલાવવા માણસ હોય — જેથી પ્રવેશ, આરતી અને છેલ્લા ગરબા બધા અલગ દેખાય.',
          },
        ],
        closing:
          'પ્રસંગ પહેલાં WhatsApp પર તમારી "આ ગીતો વગાડવાં" અને "આ ન વગાડવાં" — બંને યાદી મોકલો. બીજી યાદી પહેલી કરતાં વધુ ઝઘડા બચાવે છે.',
      },
    },
    inclusions: [
      {
        en: 'DJ console and playback with a backup source',
        gu: 'બેકઅપ સાથે DJ કન્સોલ અને પ્લેબેક',
      },
      {
        en: 'Speaker stacks placed around the ground for garba',
        gu: 'ગરબા માટે મેદાનની ફરતે ગોઠવેલા સ્પીકર',
      },
      { en: 'Dhol-tasha and live percussion mixing', gu: 'ઢોલ-તાશા અને લાઇવ પર્કશન મિક્સિંગ' },
      {
        en: 'Sharpy, par and pixel lighting cued to the programme',
        gu: 'કાર્યક્રમ પ્રમાણે ચાલતી શાર્પી, પાર અને પિક્સેલ લાઇટ',
      },
      { en: 'Wireless mic for the compere', gu: 'સંચાલક માટે વાયરલેસ માઇક' },
      { en: 'LED wall on request', gu: 'માંગ પ્રમાણે LED વોલ' },
      { en: 'DJ and light operator through the night', gu: 'આખી રાત DJ અને લાઇટ ઓપરેટર' },
    ],
    options: [
      {
        nameEn: 'Navratri garba',
        nameGu: 'નવરાત્રિ ગરબા',
        descEn:
          'Even coverage around the full circle, bright enough lighting for dancers to see their footing, and a set that runs nine nights.',
        descGu: 'આખા વર્તુળે સરખો અવાજ, રમનારને પગ દેખાય એટલી લાઇટ, અને નવ રાત ચાલે એવું સેટઅપ.',
      },
      {
        nameEn: 'Sangeet night',
        nameGu: 'સંગીત સંધ્યા',
        descEn:
          'A floor that switches between family performances and open dancing, with mics and music cued to the running order.',
        descGu:
          'પરિવારના પર્ફોર્મન્સ અને ખુલ્લા નૃત્ય વચ્ચે બદલાતો ફ્લોર, અને ક્રમ પ્રમાણે ગોઠવેલા માઇક તથા સંગીત.',
      },
      {
        nameEn: 'Reception and dinner',
        nameGu: 'રિસેપ્શન અને જમણ',
        descEn:
          'Background music people can talk over, with a separate louder zone if there is dancing at one end.',
        descGu:
          'એવું પાર્શ્વસંગીત જેની ઉપર વાત થઈ શકે, અને એક છેડે નૃત્ય હોય તો ત્યાં અલગ મોટા અવાજનો વિસ્તાર.',
      },
    ],
    specs: [
      { labelEn: 'Coverage', labelGu: 'અવાજની પહોંચ', value: 'Full circle for garba grounds' },
      { labelEn: 'Live inputs', labelGu: 'લાઇવ ઇનપુટ', value: 'Dhol, tasha, band' },
      { labelEn: 'Lighting', labelGu: 'લાઇટિંગ', value: 'Sharpy · par · pixel' },
      { labelEn: 'LED wall', labelGu: 'LED વોલ', value: 'On request' },
      { labelEn: 'Operator', labelGu: 'ઓપરેટર', value: 'DJ and lights, through the night' },
      { labelEn: 'Playlists', labelGu: 'પ્લેલિસ્ટ', value: 'Gujarati · Bollywood · your list' },
    ],
    pricing: {
      unitEn: 'per night',
      unitGu: 'પ્રતિ રાત',
      factors: [
        { en: 'Size of the ground or hall', gu: 'મેદાન કે હોલનું માપ' },
        { en: 'How many nights', gu: 'કેટલી રાત' },
        {
          en: 'Lighting count and whether an LED wall is used',
          gu: 'લાઇટની સંખ્યા અને LED વોલ છે કે નહીં',
        },
        { en: 'Live dhol or band inputs', gu: 'લાઇવ ઢોલ કે બેન્ડના ઇનપુટ' },
        { en: 'Navratri dates carry season pricing', gu: 'નવરાત્રિની તારીખોના ભાવ સિઝન પ્રમાણે' },
      ],
    },
    faqs: [
      {
        question: {
          en: 'Can you do sound for garba on a large ground?',
          gu: 'મોટા મેદાનમાં ગરબાનો સાઉન્ડ કરી શકો?',
        },
        answer: {
          en: 'Yes. Garba needs even coverage all the way round the circle, not a wall of sound at one end, and dhol-tasha has to sit on top of the track without drowning it. We place the stacks around the ground and keep the lighting bright enough that dancers can see their footing.',
          gu: 'હા. ગરબામાં આખા વર્તુળે સરખો અવાજ પહોંચવો જોઈએ, એક છેડે અવાજની દીવાલ નહીં — અને ઢોલ-તાશા ટ્રેક પર ચઢવા જોઈએ, એને દબાવે નહીં. અમે મેદાનની ફરતે સ્પીકર ગોઠવીએ છીએ અને લાઇટ એટલી રાખીએ છીએ કે રમનારને પગ દેખાય.',
        },
      },
      {
        question: {
          en: 'Can we give you our own playlist?',
          gu: 'અમારી પોતાની પ્લેલિસ્ट આપી શકીએ?',
        },
        answer: {
          en: 'Please do — and send the do-not-play list too. Share both on WhatsApp a few days before rather than on the night, so the tracks are downloaded and checked rather than streamed off a phone with no signal.',
          gu: 'જરૂર આપો — અને "આ ન વગાડવાં" એ યાદી પણ મોકલો. પ્રસંગની રાત્રે નહીં, થોડા દિવસ પહેલાં WhatsApp પર મોકલો, જેથી ગીતો ડાઉનલોડ કરીને ચકાસી શકાય અને સિગ્નલ વગરના ફોન પરથી ચલાવવાં ન પડે.',
        },
      },
      {
        question: { en: 'Do you bring the dhol players too?', gu: 'ઢોલવાળા પણ તમે લાવો છો?' },
        answer: {
          en: 'We mix them, and we coordinate with whoever you book. If you have not booked anyone yet, say so and we will tell you how many inputs to plan for so the sound is set up right either way.',
          gu: 'અમે એમનું મિક્સિંગ કરીએ છીએ અને તમે જેને બુક કરો એની સાથે સંકલન કરીએ છીએ. હજી કોઈને બુક ન કર્યા હોય તો જણાવો — કેટલા ઇનપુટનું આયોજન કરવું એ કહી દઈશું, જેથી બંને રીતે સાઉન્ડ બરાબર ગોઠવાય.',
        },
      },
      {
        question: {
          en: 'Is the DJ setup separate from the main sound?',
          gu: 'DJ સેટઅપ મુખ્ય સાઉન્ડથી અલગ છે?',
        },
        answer: {
          en: 'Usually they share the same speakers and console, which keeps the cost down and avoids two systems fighting each other. Where a function has a stage programme and a dance floor at opposite ends, we run them as separate zones.',
          gu: 'સામાન્ય રીતે એક જ સ્પીકર અને કન્સોલ વપરાય — ખર્ચ ઓછો રહે અને બે સિસ્ટમ સામસામે ન અથડાય. જ્યાં સ્ટેજનો કાર્યક્રમ અને ડાન્સ ફ્લોર સામસામે છેડે હોય, ત્યાં અલગ ઝોન તરીકે ચલાવીએ છીએ.',
        },
      },
    ],
  },
  {
    slug: 'lighting-illumination-surendranagar',
    content: {
      en: {
        promise:
          'Façade lighting, pixel LED and sharpy — with the whole baraat route lit from the gate to the mandap.',
        intro:
          'Lighting is what people remember from the photographs and what they complain about on the night. Too little at the gate and guests arrive fumbling; too much white on the mandap and every photograph looks flat. We plan warm light where people are photographed, brighter light where they walk, and colour only where it adds something. On a wedding that means the façade, the entry, the walkway, the mandap and the dining area are each treated differently rather than lit to one level. We also light the baraat route, which is the part most often forgotten until the procession is halfway down a dark road.',
        process: [
          {
            title: 'Walk the route at night',
            body: 'We look at the venue after dark where we can — street lighting, dark stretches and where headlights will be coming from all change the plan.',
          },
          {
            title: 'Zone the plan',
            body: 'Façade, gate, walkway, mandap, dining and stage each get their own treatment, with warm light kept where the photographs happen.',
          },
          {
            title: 'Rig and power',
            body: 'Fixtures are hung and cabled with the generator load counted, so lighting does not compete with the sound and the catering counters for power.',
          },
          {
            title: 'Focus after dark',
            body: 'Angles are set on site at night, not in the afternoon. A fixture that looked right at 4 pm is often pointing at nothing by 8.',
          },
        ],
        closing:
          'If a photographer or videographer is already booked, put us in touch. Five minutes between us saves an argument about a backlight during the vidhi.',
      },
      gu: {
        promise:
          'ફસાડ લાઇટિંગ, પિક્સેલ LED અને શાર્પી — ગેટથી મંડપ સુધીનો આખો વરઘોડાનો રસ્તો રોશન.',
        intro:
          'ફોટામાં જે યાદ રહે છે અને રાત્રે જેની ફરિયાદ થાય છે — બંને લાઇટિંગ છે. ગેટ પર ઓછી હોય તો મહેમાનો અંધારામાં ફાંફાં મારે; મંડપ પર વધુ સફેદ હોય તો દરેક ફોટો સપાટ લાગે. જ્યાં લોકોના ફોટા પડે ત્યાં ગરમ પ્રકાશ, જ્યાં ચાલવાનું હોય ત્યાં વધુ અજવાળું, અને રંગ ફક્ત જ્યાં કંઈક ઉમેરે ત્યાં. લગ્નમાં એનો અર્થ એ કે ફસાડ, પ્રવેશ, રસ્તો, મંડપ અને જમણની જગ્યા — દરેકનું ટ્રીટમેન્ટ અલગ, બધું એક જ સ્તરે નહીં. વરઘોડાનો રસ્તો પણ અમે રોશન કરીએ છીએ — જે વાત જાન અડધા અંધારા રસ્તે પહોંચે ત્યાં સુધી મોટે ભાગે ભુલાઈ જાય છે.',
        process: [
          {
            title: 'રાત્રે રસ્તો જોવો',
            body: 'બની શકે ત્યાં અંધારા પછી જગ્યા જોઈએ છીએ — સ્ટ્રીટ લાઇટ, અંધારા પટ્ટા અને ગાડીની હેડલાઇટ ક્યાંથી આવશે, બધું આયોજન બદલે છે.',
          },
          {
            title: 'વિભાગ પ્રમાણે આયોજન',
            body: 'ફસાડ, ગેટ, રસ્તો, મંડપ, જમણ અને સ્ટેજ — દરેકનું અલગ ટ્રીટમેન્ટ, અને જ્યાં ફોટા પડે ત્યાં ગરમ પ્રકાશ.',
          },
          {
            title: 'રિગિંગ અને પાવર',
            body: 'જનરેટરનો લોડ ગણીને ફિક્સ્ચર લટકાવીએ અને કેબલ કરીએ — જેથી લાઇટિંગ સાઉન્ડ અને કેટરિંગ કાઉન્ટર સાથે પાવર માટે ન ઝઘડે.',
          },
          {
            title: 'અંધારા પછી ફોકસ',
            body: 'એંગલ બપોરે નહીં, રાત્રે સાઇટ પર નક્કી થાય. ચાર વાગ્યે બરાબર લાગતું ફિક્સ્ચર આઠ વાગ્યે ઘણી વાર ખાલી જગ્યા પર પડતું હોય છે.',
          },
        ],
        closing:
          'ફોટોગ્રાફર કે વિડિયોગ્રાફર બુક થઈ ગયા હોય તો અમારો સંપર્ક કરાવો. અમારી વચ્ચે પાંચ મિનિટની વાત વિધિ દરમિયાન બેકલાઇટ પરના ઝઘડાને બચાવે છે.',
      },
    },
    inclusions: [
      { en: 'Façade and building outline lighting', gu: 'ફસાડ અને ઇમારતની કિનારીની લાઇટિંગ' },
      { en: 'Gate, walkway and passage lighting', gu: 'ગેટ, રસ્તો અને પેસેજની લાઇટિંગ' },
      {
        en: 'Warm mandap and stage lighting for photography',
        gu: 'ફોટોગ્રાફી માટે ગરમ મંડપ અને સ્ટેજ લાઇટ',
      },
      { en: 'Sharpy, par and pixel LED fixtures', gu: 'શાર્પી, પાર અને પિક્સેલ LED ફિક્સ્ચર' },
      { en: 'Baraat route and trolley lighting', gu: 'વરઘોડાના રસ્તા અને ટ્રોલીની લાઇટિંગ' },
      { en: 'Dining and counter lighting', gu: 'જમણ અને કાઉન્ટરની લાઇટિંગ' },
      {
        en: 'Cabling and load planned with the generator',
        gu: 'જનરેટર સાથે ગણેલો કેબલિંગ અને લોડ',
      },
      { en: 'On-site focusing after dark', gu: 'અંધારા પછી સાઇટ પર ફોકસિંગ' },
    ],
    options: [
      {
        nameEn: 'Wedding lighting',
        nameGu: 'લગ્નની લાઇટિંગ',
        descEn:
          'Warm on the mandap and stage, brighter on the walkways, and colour used sparingly so photographs still look like the room.',
        descGu:
          'મંડપ અને સ્ટેજ પર ગરમ, ચાલવાના રસ્તા પર વધુ અજવાળું, અને રંગ ઓછો — જેથી ફોટામાં જગ્યા જેવી છે એવી જ લાગે.',
      },
      {
        nameEn: 'Façade and street lighting',
        nameGu: 'ફસાડ અને શેરીની લાઇટિંગ',
        descEn:
          'The building, the compound wall and the approach road picked out, so guests can find the venue from the main road.',
        descGu:
          'ઇમારત, કમ્પાઉન્ડ દીવાલ અને આવવાનો રસ્તો પ્રકાશિત — જેથી મહેમાનોને મુખ્ય રસ્તેથી જગ્યા મળી જાય.',
      },
      {
        nameEn: 'Stage and effect lighting',
        nameGu: 'સ્ટેજ અને ઇફેક્ટ લાઇટિંગ',
        descEn:
          'Sharpy beams, pixel strips and cued colour changes for sangeet, garba and stage programmes.',
        descGu:
          'સંગીત, ગરબા અને સ્ટેજ કાર્યક્રમ માટે શાર્પી બીમ, પિક્સેલ સ્ટ્રિપ અને કાર્યક્રમ પ્રમાણે બદલાતા રંગ.',
      },
      {
        nameEn: 'Katha and sabha lighting',
        nameGu: 'કથા અને સભાની લાઇટિંગ',
        descEn:
          'Even, glare-free light over a seated audience, with the vyaspith lit for cameras without dazzling the front rows.',
        descGu:
          'બેઠેલા શ્રોતાગણ પર સરખો, આંખમાં ન વાગે એવો પ્રકાશ — અને વ્યાસપીઠ કેમેરા માટે પ્રકાશિત, પણ આગળની હરોળને ચકાચૌંધ કર્યા વગર.',
      },
    ],
    specs: [
      {
        labelEn: 'Fixture types',
        labelGu: 'ફિક્સ્ચરના પ્રકાર',
        value: 'Sharpy · par · pixel LED · warm white',
      },
      {
        labelEn: 'Façade lighting',
        labelGu: 'ફસાડ લાઇટિંગ',
        value: 'Building, wall and approach road',
      },
      { labelEn: 'Baraat route', labelGu: 'વરઘોડાનો રસ્તો', value: 'Trolley plus fixed points' },
      { labelEn: 'Colour control', labelGu: 'રંગનું નિયંત્રણ', value: 'Cued to the programme' },
      { labelEn: 'Power', labelGu: 'પાવર', value: 'Load counted into the generator sizing' },
      { labelEn: 'Focusing', labelGu: 'ફોકસિંગ', value: 'Set on site after dark' },
    ],
    pricing: {
      unitEn: 'per function',
      unitGu: 'પ્રતિ પ્રસંગ',
      factors: [
        { en: 'How many zones are lit', gu: 'કેટલા વિસ્તાર પ્રકાશિત કરવાના છે' },
        { en: 'Fixture count and type', gu: 'ફિક્સ્ચરની સંખ્યા અને પ્રકાર' },
        { en: 'Length of the baraat route', gu: 'વરઘોડાના રસ્તાની લંબાઈ' },
        { en: 'Building height for façade work', gu: 'ફસાડના કામ માટે ઇમારતની ઊંચાઈ' },
        { en: 'Number of nights', gu: 'કેટલી રાત' },
      ],
    },
    faqs: [
      {
        question: {
          en: 'Do you light the baraat route on the road?',
          gu: 'રસ્તા પર વરઘોડાની લાઇટિંગ કરો છો?',
        },
        answer: {
          en: 'Yes — trolley lighting that moves with the procession, plus fixed lighting at the gate and along the last stretch. We walk the route beforehand and time it, because a varghodo that takes longer than planned leaves the mandap waiting.',
          gu: 'હા — વરઘોડા સાથે ચાલતી ટ્રોલી લાઇટિંગ, અને ગેટ પર તથા છેલ્લા રસ્તા પર ફિક્સ લાઇટિંગ. અમે રસ્તો પહેલેથી ચાલીને સમય માપીએ છીએ, કારણ કે વરઘોડો ધાર્યા કરતાં લાંબો ચાલે તો મંડપમાં બધા રાહ જુએ છે.',
        },
      },
      {
        question: {
          en: 'Will the lighting look good in photographs?',
          gu: 'ફોટામાં લાઇટિંગ સારી લાગશે?',
        },
        answer: {
          en: 'That is what decides the plan. Warm light goes where people are photographed and colour is kept off faces, because a strong blue or green on the mandap looks striking to the eye and unusable in the photographs. Put us in touch with your photographer and we will agree it between us.',
          gu: 'આયોજન એના પરથી જ થાય છે. જ્યાં ફોટા પડે ત્યાં ગરમ પ્રકાશ, અને ચહેરા પર રંગ નહીં — કારણ કે મંડપ પર ઘેરો વાદળી કે લીલો રંગ આંખને સુંદર લાગે પણ ફોટામાં નકામો. તમારા ફોટોગ્રાફર સાથે અમારો સંપર્ક કરાવો, અમે નક્કી કરી લઈશું.',
        },
      },
      {
        question: {
          en: 'Can you light an outdoor ground with no power nearby?',
          gu: 'નજીકમાં લાઇટ ન હોય એવા ખુલ્લા મેદાનમાં કરી શકો?',
        },
        answer: {
          en: 'Yes — that is what the generator is for, and we size it against the full lighting, sound and catering load together rather than each separately. Tell us at the site visit if the nearest connection is far, because the cabling run affects the cost.',
          gu: 'હા — જનરેટર એટલા માટે જ છે, અને અમે લાઇટિંગ, સાઉન્ડ તથા કેટરિંગનો કુલ લોડ સાથે ગણીને એની ક્ષમતા નક્કી કરીએ છીએ. નજીકનું કનેક્શન દૂર હોય તો સાઇટ વિઝિટમાં જણાવો — કેબલની લંબાઈ ખર્ચ પર અસર કરે છે.',
        },
      },
      {
        question: { en: 'Do you do cold pyro or fireworks?', gu: 'કોલ્ડ પાયરો કે ફટાકડા કરો છો?' },
        answer: {
          en: 'Cold pyro where it is permitted at the venue and safe for the structure above it. Anything beyond that needs the venue’s permission and the local rules followed, and we will tell you plainly if we think a setup is not suitable for it.',
          gu: 'જ્યાં જગ્યાની પરવાનગી હોય અને ઉપરના સ્ટ્રક્ચર માટે સલામત હોય ત્યાં કોલ્ડ પાયરો. એથી વધુ માટે જગ્યાની પરવાનગી અને સ્થાનિક નિયમો જરૂરી — અને કોઈ સેટઅપ એના માટે યોગ્ય ન લાગે તો અમે સ્પષ્ટ કહી દઈશું.',
        },
      },
    ],
  },
];
