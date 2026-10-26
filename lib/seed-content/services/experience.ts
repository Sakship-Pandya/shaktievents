import type { ServiceSeed } from './types';

/** Arrival, procession and the turnkey option — the parts guests experience as a sequence. */
export const experienceServices: ServiceSeed[] = [
  {
    slug: 'entry-gate-passage-decoration-surendranagar',
    content: {
      en: {
        promise:
          'The gate, walkway and passage set the tone for the whole function before a guest ever sits down.',
        intro:
          'Guests form their opinion of a function in the first thirty seconds, walking from where they parked to where they sit. That stretch is usually the least planned part of the whole setup. We treat it as one sequence: the gate that tells them they have arrived, the passage that gets them there dry and lit, and the point where they first see the mandap or the stage. Because it stands from the first function to the last, gate work is mostly artificial and structural rather than fresh — it has to look the same on Sunday evening as it did on Thursday morning. Where the walk is long or crosses a road, we light it and cover it rather than leaving it to the streetlights.',
        process: [
          {
            title: 'Walk the arrival',
            body: 'From the parking to the seat, the way a guest will. Uneven ground, a dark stretch and a low branch are all easier to find on foot than on a plan.',
          },
          {
            title: 'Gate and first view',
            body: 'The gate is placed so the first sight of the mandap or stage happens where you want it, not from an angle nobody chose.',
          },
          {
            title: 'Cover and light the passage',
            body: 'Walkway cover, runners and lighting go in together, with the cabling kept off the path people walk on.',
          },
          {
            title: 'Build early, check late',
            body: 'Gate work goes up before the rest so it is finished and out of the way, then it is checked again after dark on the first function night.',
          },
        ],
        closing:
          'Tell us where guests will actually park. Half the arrival problems at a function come from everyone entering by a different gate from the one that was decorated.',
      },
      gu: {
        promise: 'ગેટ, રસ્તો અને પેસેજ — મહેમાન બેસે એ પહેલાં જ આખા પ્રસંગનો માહોલ બાંધી દે છે.',
        intro:
          'મહેમાનો પ્રસંગ વિશેનો પોતાનો અભિપ્રાય પહેલી ત્રીસ સેકન્ડમાં બાંધી લે છે — ગાડી મૂકી ત્યાંથી બેઠક સુધી ચાલતાં ચાલતાં. અને આખા સેટઅપમાં એ જ ભાગનું આયોજન સૌથી ઓછું થાય છે. અમે એને એક ક્રમ તરીકે જોઈએ છીએ: ગેટ જે કહે કે તમે પહોંચી ગયા, રસ્તો જે એમને સૂકા અને પ્રકાશમાં લઈ જાય, અને એ ક્ષણ જ્યાં પહેલી વાર મંડપ કે સ્ટેજ દેખાય. પહેલા પ્રસંગથી છેલ્લા સુધી ઊભું રહેવાનું હોવાથી ગેટનું કામ મોટે ભાગે આર્ટિફિશિયલ અને સ્ટ્રક્ચરલ હોય છે — ગુરુવારે સવારે જેવું દેખાતું હતું એવું જ રવિવારે સાંજે દેખાવું જોઈએ. રસ્તો લાંબો હોય કે રોડ ઓળંગવો પડે ત્યાં અમે એને પ્રકાશિત અને ઢાંકીએ છીએ — સ્ટ્રીટ લાઇટ પર છોડતા નથી.',
        process: [
          {
            title: 'આગમનનો રસ્તો ચાલવો',
            body: 'પાર્કિંગથી બેઠક સુધી, જે રીતે મહેમાન ચાલશે એ રીતે. ખાડા-ટેકરા, અંધારો પટ્ટો અને નીચી ડાળી — બધું નકશા કરતાં ચાલીને સહેલાઈથી મળે છે.',
          },
          {
            title: 'ગેટ અને પહેલી નજર',
            body: 'ગેટ એવી જગ્યાએ મુકાય કે મંડપ કે સ્ટેજ પહેલી વાર તમે ઇચ્છો ત્યાંથી દેખાય, કોઈએ પસંદ ન કરેલા ખૂણેથી નહીં.',
          },
          {
            title: 'રસ્તો ઢાંકવો અને પ્રકાશિત કરવો',
            body: 'રસ્તાનું કવર, પટ્ટીઓ અને લાઇટિંગ સાથે ગોઠવાય, અને કેબલ ચાલવાના રસ્તાથી દૂર રહે.',
          },
          {
            title: 'વહેલું બાંધવું, મોડું ચકાસવું',
            body: 'ગેટનું કામ બાકીના પહેલાં થાય જેથી એ પતી જાય અને રસ્તામાં ન આવે — અને પહેલી પ્રસંગ-રાત્રે અંધારા પછી ફરી ચકાસાય.',
          },
        ],
        closing:
          'મહેમાનો ખરેખર ક્યાં ગાડી મૂકશે એ જણાવો. પ્રસંગમાં આગમનની અડધી સમસ્યાઓ એટલા માટે થાય છે કે બધા સજાવેલા ગેટને બદલે બીજા ગેટથી અંદર આવે છે.',
      },
    },
    inclusions: [
      { en: 'Entry gate structure and dressing', gu: 'એન્ટ્રી ગેટનું સ્ટ્રક્ચર અને સજાવટ' },
      { en: 'Covered walkway from gate to venue', gu: 'ગેટથી જગ્યા સુધી ઢાંકેલો રસ્તો' },
      { en: 'Passage runners and floor covering', gu: 'રસ્તાની પટ્ટીઓ અને ફ્લોર કવરિંગ' },
      { en: 'Walkway and gate lighting', gu: 'રસ્તા અને ગેટની લાઇટિંગ' },
      { en: 'Welcome point and signage', gu: 'સ્વાગત સ્થળ અને દિશાસૂચક' },
      { en: 'Rangoli and floral touches at the entrance', gu: 'પ્રવેશ પર રંગોળી અને ફૂલસજાવટ' },
      { en: 'Weather cover where the walk is exposed', gu: 'ખુલ્લા રસ્તા પર હવામાનનું કવર' },
    ],
    options: [
      {
        nameEn: 'Themed arch gate',
        nameGu: 'થીમ પ્રમાણે કમાનવાળો ગેટ',
        descEn:
          'A single arch carrying the theme of the function, built to be seen from the main road as guests arrive.',
        descGu: 'પ્રસંગની થીમ પ્રમાણેની એક કમાન — મહેમાનો આવે ત્યારે મુખ્ય રસ્તેથી દેખાય એ રીતે.',
      },
      {
        nameEn: 'Floral gate',
        nameGu: 'ફૂલોનો ગેટ',
        descEn:
          'Flower-led rather than structure-led. Usually artificial, because a gate has to hold for the whole run of functions.',
        descGu:
          'સ્ટ્રક્ચર નહીં, ફૂલ મુખ્ય. સામાન્ય રીતે આર્ટિફિશિયલ — કારણ કે ગેટે આખા પ્રસંગ સુધી ટકવાનું હોય છે.',
      },
      {
        nameEn: 'Covered passage',
        nameGu: 'ઢાંકેલો પેસેજ',
        descEn:
          'A lit, covered walk from the gate to the seating, for long approaches or a monsoon date.',
        descGu: 'ગેટથી બેઠક સુધી પ્રકાશિત, ઢાંકેલો રસ્તો — લાંબા આગમન કે ચોમાસાની તારીખ માટે.',
      },
      {
        nameEn: 'Welcome point',
        nameGu: 'સ્વાગત સ્થળ',
        descEn:
          'A dressed stop just inside the gate for greeting, drinks and photographs, so arrivals do not queue in the passage.',
        descGu:
          'ગેટની અંદર જ સ્વાગત, પીણાં અને ફોટા માટે સજાવેલી જગ્યા — જેથી આવનારા રસ્તામાં લાઇન ન લગાવે.',
      },
    ],
    specs: [
      { labelEn: 'Gate width', labelGu: 'ગેટની પહોળાઈ', value: '8 ft – 24 ft' },
      { labelEn: 'Gate height', labelGu: 'ગેટની ઊંચાઈ', value: '10 ft – 20 ft' },
      { labelEn: 'Passage cover', labelGu: 'રસ્તાનું કવર', value: 'To the length of the walk' },
      { labelEn: 'Materials', labelGu: 'સામગ્રી', value: 'Mostly artificial and structural' },
      { labelEn: 'Stands for', labelGu: 'કેટલું ટકે', value: 'The full run of functions' },
      { labelEn: 'Lighting', labelGu: 'લાઇટિંગ', value: 'Gate, passage and approach' },
    ],
    pricing: {
      unitEn: 'per gate and passage',
      unitGu: 'પ્રતિ ગેટ અને પેસેજ',
      factors: [
        {
          en: 'Gate size and how elaborate the dressing is',
          gu: 'ગેટનું માપ અને સજાવટ કેટલી વિગતવાર છે',
        },
        { en: 'Length of passage to be covered', gu: 'ઢાંકવાના રસ્તાની લંબાઈ' },
        { en: 'Whether a weather cover is needed', gu: 'હવામાનનું કવર જોઈએ છે કે નહીં' },
        { en: 'Lighting along the approach', gu: 'આવવાના રસ્તાની લાઇટિંગ' },
        { en: 'How many days it stands', gu: 'કેટલા દિવસ ઊભું રહે છે' },
      ],
    },
    faqs: [
      {
        question: { en: 'Should the gate use fresh flowers?', gu: 'ગેટ પર તાજા ફૂલ વાપરવાં?' },
        answer: {
          en: 'Usually not. A gate stands from the first function to the last, and fresh flowers will not hold that long in Gujarat’s heat. We use good artificial work there and keep fresh for the mandap and stage where people are photographed close up.',
          gu: 'સામાન્ય રીતે નહીં. ગેટ પહેલા પ્રસંગથી છેલ્લા સુધી ઊભો રહે છે, અને ગુજરાતની ગરમીમાં તાજા ફૂલ એટલું ટકતાં નથી. ત્યાં અમે સારું આર્ટિફિશિયલ કામ કરીએ છીએ, અને તાજા ફૂલ મંડપ તથા સ્ટેજ માટે રાખીએ છીએ જ્યાં નજીકથી ફોટા પડે.',
        },
      },
      {
        question: {
          en: 'Can you cover the walk from the parking?',
          gu: 'પાર્કિંગથી ચાલવાનો રસ્તો ઢાંકી શકો?',
        },
        answer: {
          en: 'Yes — a covered, lit walkway with runners underfoot. Tell us where guests will actually park rather than where they are supposed to, because those are often two different gates.',
          gu: 'હા — ઢાંકેલો, પ્રકાશિત રસ્તો અને નીચે પટ્ટીઓ. મહેમાનો ક્યાં ગાડી મૂકવાના "છે" એ નહીં, ખરેખર ક્યાં મૂકશે એ જણાવો — ઘણી વાર એ બે અલગ ગેટ હોય છે.',
        },
      },
      {
        question: {
          en: 'Do you put up name boards or signage?',
          gu: 'નામનાં બોર્ડ કે દિશાસૂચક લગાવો છો?',
        },
        answer: {
          en: 'Yes — welcome boards, direction signs to the parking, dining and washrooms. Send the spelling in writing a few days before; names are the most common last-minute correction at any function.',
          gu: 'હા — સ્વાગત બોર્ડ, અને પાર્કિંગ, જમણ તથા શૌચાલય માટે દિશાસૂચક. જોડણી થોડા દિવસ પહેલાં લખીને મોકલો; કોઈ પણ પ્રસંગમાં છેલ્લી ઘડીનો સૌથી સામાન્ય સુધારો નામમાં જ હોય છે.',
        },
      },
    ],
  },
  {
    slug: 'baraat-varghodo-setup-surendranagar',
    content: {
      en: {
        promise:
          'Sound trolley, lighting trolley and dhol coordination, walked and timed with the route beforehand.',
        intro:
          'A varghodo is the one part of a wedding that happens on a public road, in the dark, moving. Everything that makes it work has to be mobile: the sound has to travel with the procession, the lighting has to move at walking pace, and someone has to keep the whole thing to a schedule that the mandap is waiting on. We walk the route in advance and time it, because a procession that takes forty minutes longer than planned puts the vidhi past its muhurat. On the night, our crew stays with the trolleys, keeps the cabling and the crowd apart, and hands over cleanly at the gate so the baraat arrives into a lit entrance rather than a dark one.',
        process: [
          {
            title: 'Walk and time the route',
            body: 'We walk it, note the dark stretches, the traffic points and where the road narrows, then time it at procession pace rather than walking pace.',
          },
          {
            title: 'Trolley setup',
            body: 'Sound and lighting trolleys are prepared and tested, with power that lasts the full route and a spare that travels with them.',
          },
          {
            title: 'Coordinate with the dhol and band',
            body: 'We agree the running order with whoever you have booked, so the music does not stop while everyone waits for a handover.',
          },
          {
            title: 'Arrival handover',
            body: 'The procession is handed to the gate lighting and the venue sound cleanly, so the baraat walks into a lit entrance rather than a dark one.',
          },
        ],
        closing:
          'Give us the muhurat time when you book, not the start time of the varghodo. We will work backwards from it and tell you when the procession actually has to leave.',
      },
      gu: {
        promise:
          'સાઉન્ડ ટ્રોલી, લાઇટિંગ ટ્રોલી અને ઢોલનું સંકલન — રસ્તો પહેલેથી ચાલીને, સમય માપીને.',
        intro:
          'લગ્નનો એક જ ભાગ એવો છે જે જાહેર રસ્તા પર, અંધારામાં અને ચાલતાં ચાલતાં થાય છે — વરઘોડો. એને ચલાવતું બધું ફરતું હોવું જોઈએ: સાઉન્ડ જાન સાથે ચાલે, લાઇટિંગ ચાલવાની ઝડપે ખસે, અને કોઈએ આખી વાતને એ સમયપત્રકમાં રાખવી પડે જેની મંડપમાં રાહ જોવાય છે. અમે રસ્તો પહેલેથી ચાલીએ છીએ અને સમય માપીએ છીએ — કારણ કે ધાર્યા કરતાં ચાળીસ મિનિટ મોડો વરઘોડો વિધિને મુહૂર્ત બહાર કાઢી નાખે છે. રાત્રે અમારી ટીમ ટ્રોલી સાથે રહે છે, કેબલ અને ભીડને અલગ રાખે છે, અને ગેટ પર વ્યવસ્થિત સોંપી દે છે — જેથી જાન અંધારા નહીં, પ્રકાશિત પ્રવેશમાં આવે.',
        process: [
          {
            title: 'રસ્તો ચાલવો અને સમય માપવો',
            body: 'અમે ચાલીએ છીએ, અંધારા પટ્ટા, ટ્રાફિકના બિંદુ અને રસ્તો ક્યાં સાંકડો થાય એ નોંધીએ છીએ — અને ચાલવાની નહીં, વરઘોડાની ઝડપે સમય માપીએ છીએ.',
          },
          {
            title: 'ટ્રોલીની તૈયારી',
            body: 'સાઉન્ડ અને લાઇટિંગ ટ્રોલી તૈયાર થઈને ચકાસાય — આખા રસ્તા સુધી ચાલે એટલો પાવર, અને સાથે ફરતો વધારાનો બેકઅપ.',
          },
          {
            title: 'ઢોલ અને બેન્ડ સાથે સંકલન',
            body: 'તમે જેને બુક કર્યા હોય એમની સાથે ક્રમ નક્કી કરીએ છીએ — જેથી સોંપણીની રાહ જોવામાં સંગીત અટકે નહીં.',
          },
          {
            title: 'આગમનની સોંપણી',
            body: 'ગેટની લાઇટિંગ અને જગ્યાના સાઉન્ડને વ્યવસ્થિત સોંપણી થાય, જેથી જાન અંધારા નહીં, પ્રકાશિત પ્રવેશમાં ચાલી આવે.',
          },
        ],
        closing:
          'બુકિંગ વખતે વરઘોડાનો નહીં, મુહૂર્તનો સમય આપો. અમે એનાથી પાછળ ગણીને કહી દઈશું કે જાન ખરેખર ક્યારે નીકળવી જોઈએ.',
      },
    },
    inclusions: [
      { en: 'Mobile sound trolley with its own power', gu: 'પોતાના પાવર સાથે ફરતી સાઉન્ડ ટ્રોલી' },
      { en: 'Lighting trolley moving with the procession', gu: 'જાન સાથે ચાલતી લાઇટિંગ ટ્રોલી' },
      {
        en: 'Fixed lighting at the gate and final stretch',
        gu: 'ગેટ પર અને છેલ્લા રસ્તા પર ફિક્સ લાઇટિંગ',
      },
      { en: 'Route walked and timed in advance', gu: 'રસ્તો પહેલેથી ચાલીને સમય માપેલો' },
      { en: 'Coordination with your dhol and band', gu: 'તમારા ઢોલ અને બેન્ડ સાથે સંકલન' },
      { en: 'Crew with the trolleys throughout', gu: 'આખા રસ્તે ટ્રોલી સાથે ટીમ' },
      { en: 'Clean handover to the venue setup', gu: 'જગ્યાના સેટઅપને વ્યવસ્થિત સોંપણી' },
    ],
    options: [
      {
        nameEn: 'Sound trolley',
        nameGu: 'સાઉન્ડ ટ્રોલી',
        descEn:
          'Speakers, playback and a mic on a mobile frame, powered for the full route with a spare battery travelling alongside.',
        descGu:
          'ફરતી ફ્રેમ પર સ્પીકર, પ્લેબેક અને માઇક — આખા રસ્તા માટે પાવર, અને સાથે ફરતી વધારાની બેટરી.',
      },
      {
        nameEn: 'Lighting trolley',
        nameGu: 'લાઇટિંગ ટ્રોલી',
        descEn:
          'Moving light that keeps the procession visible to traffic as well as to the photographer.',
        descGu: 'ફરતી લાઇટ — જેથી વરઘોડો ફોટોગ્રાફરને જ નહીં, ટ્રાફિકને પણ દેખાય.',
      },
      {
        nameEn: 'LED screen vehicle',
        nameGu: 'LED સ્ક્રીન વાહન',
        descEn:
          'A screen travelling with the baraat for photographs and live relay. Needs a wider route, so we check it on the walk.',
        descGu:
          'ફોટા અને લાઇવ પ્રસારણ માટે જાન સાથે ચાલતી સ્ક્રીન. પહોળો રસ્તો જોઈએ, એટલે ચાલતી વખતે એ તપાસી લઈએ છીએ.',
      },
      {
        nameEn: 'Route lighting',
        nameGu: 'રસ્તાની લાઇટિંગ',
        descEn:
          'Fixed points along dark stretches and at the gate, for routes where the streetlights cannot be relied on.',
        descGu:
          'અંધારા પટ્ટા પર અને ગેટ પર ફિક્સ પોઇન્ટ — જ્યાં સ્ટ્રીટ લાઇટ પર ભરોસો ન થાય એવા રસ્તા માટે.',
      },
    ],
    specs: [
      {
        labelEn: 'Route length',
        labelGu: 'રસ્તાની લંબાઈ',
        value: 'Walked and timed before the day',
      },
      { labelEn: 'Sound', labelGu: 'સાઉન્ડ', value: 'Trolley-mounted, battery powered' },
      { labelEn: 'Lighting', labelGu: 'લાઇટિંગ', value: 'Trolley plus fixed points' },
      { labelEn: 'Dhol and band', labelGu: 'ઢોલ અને બેન્ડ', value: 'Coordinated, booked by you' },
      { labelEn: 'Crew', labelGu: 'ટીમ', value: 'With the trolleys the whole way' },
      { labelEn: 'Handover', labelGu: 'સોંપણી', value: 'To gate lighting and venue sound' },
    ],
    pricing: {
      unitEn: 'per procession',
      unitGu: 'પ્રતિ વરઘોડો',
      factors: [
        { en: 'Route length and how long it takes', gu: 'રસ્તાની લંબાઈ અને કેટલો સમય લાગશે' },
        {
          en: 'Number of trolleys and fixed light points',
          gu: 'ટ્રોલી અને ફિક્સ લાઇટ પોઇન્ટની સંખ્યા',
        },
        { en: 'Whether an LED screen vehicle is used', gu: 'LED સ્ક્રીન વાહન વપરાય છે કે નહીં' },
        { en: 'How dark the route is', gu: 'રસ્તો કેટલો અંધારો છે' },
        { en: 'Distance from our godown', gu: 'અમારા ગોડાઉનથી અંતર' },
      ],
    },
    faqs: [
      {
        question: {
          en: 'How long does a varghodo usually take?',
          gu: 'વરઘોડો સામાન્ય રીતે કેટલો સમય લે છે?',
        },
        answer: {
          en: 'Longer than families expect, because it moves at dancing pace rather than walking pace. That is why we walk the route and time it beforehand, then work backwards from your muhurat to tell you when it actually has to leave.',
          gu: 'પરિવારો ધારે એના કરતાં વધુ — કારણ કે એ ચાલવાની નહીં, નાચવાની ઝડપે ચાલે છે. એટલે જ અમે રસ્તો પહેલેથી ચાલીને સમય માપીએ છીએ, અને તમારા મુહૂર્તથી પાછળ ગણીને કહીએ છીએ કે એ ખરેખર ક્યારે નીકળવો જોઈએ.',
        },
      },
      {
        question: {
          en: 'Do you arrange the dhol players and band?',
          gu: 'ઢોલવાળા અને બેન્ડ તમે ગોઠવો છો?',
        },
        answer: {
          en: 'You book them; we coordinate with them and mix them through the trolley sound. If you have not booked yet, tell us and we will say what to plan for so the sound is set up right either way.',
          gu: 'બુક તમે કરો; અમે એમની સાથે સંકલન કરીએ અને ટ્રોલીના સાઉન્ડ દ્વારા મિક્સ કરીએ. હજી બુક ન કર્યા હોય તો જણાવો — શેનું આયોજન કરવું એ કહી દઈશું, જેથી બંને રીતે સાઉન્ડ બરાબર ગોઠવાય.',
        },
      },
      {
        question: {
          en: 'Is the sound loud enough on an open road?',
          gu: 'ખુલ્લા રસ્તા પર અવાજ પૂરતો રહેશે?',
        },
        answer: {
          en: 'The trolley is sized for a moving crowd on a road rather than a hall, and it carries its own power with a spare travelling alongside. A procession that loses its music halfway is the one thing there is no recovering from on the night.',
          gu: 'ટ્રોલી હોલ માટે નહીં, રસ્તા પર ચાલતી ભીડ માટે ગોઠવેલી હોય છે, અને એની સાથે પોતાનો પાવર તથા વધારાનો બેકઅપ ફરે છે. અડધે રસ્તે સંગીત બંધ પડેલો વરઘોડો — રાત્રે એનું કોઈ સમારકામ નથી.',
        },
      },
    ],
  },
  {
    slug: 'complete-event-management-surendranagar',
    content: {
      en: {
        promise:
          'One contact, one timeline, one crew — from the first site visit to the last truck leaving the ground.',
        intro:
          'Booking mandap, sound, lighting, furniture, power and catering counters separately means six suppliers, six timelines and six people to call when something is late. It also means the gaps between them are nobody’s job — and the gaps are where functions go wrong. Taken as one, we survey once, quote once, and run a single schedule that has the structure up before the decoration starts and the power tested before the sound is rigged. You get one number to call. On the day, one coordinator holds the running order and deals with the caterer, the photographer and the maharaj so your family does not have to. Afterwards, one crew clears the ground on the day agreed at booking.',
        process: [
          {
            title: 'One site visit',
            body: 'Everything is measured at once — ground, power, access, sightlines — instead of six suppliers each visiting and each finding a different problem.',
          },
          {
            title: 'One quote and timeline',
            body: 'A single written quote listing every item, and a schedule that sequences the trades so nobody is waiting on somebody else.',
          },
          {
            title: 'Build in sequence',
            body: 'Structure, flooring, power, sound and lighting, then decoration, then flowers. Each stage finishes before the next needs the space.',
          },
          {
            title: 'A coordinator on the day',
            body: 'One person holds the running order and talks to your caterer, photographer and maharaj, so your family is not managing suppliers at their own function.',
          },
          {
            title: 'Clear the ground',
            body: 'Dismantle and removal on the day agreed when you booked, with the venue handed back and nothing of ours left behind.',
          },
        ],
        closing:
          'This is worth taking for a multi-day wedding, a samuh lagan or a katha. For a single evening function with one or two services, booking those directly is usually the cheaper and simpler choice — and we will say so.',
      },
      gu: {
        promise:
          'એક સંપર્ક, એક ટાઇમલાઇન, એક ટીમ — પહેલી સાઇટ વિઝિટથી છેલ્લી ગાડી નીકળે ત્યાં સુધી.',
        intro:
          'મંડપ, સાઉન્ડ, લાઇટિંગ, ફર્નિચર, પાવર અને કેટરિંગ કાઉન્ટર અલગ અલગ બુક કરો એટલે છ સપ્લાયર, છ ટાઇમલાઇન અને કંઈ મોડું થાય તો છ જણને ફોન. અને એમની વચ્ચેની ખાલી જગ્યાઓ કોઈની જવાબદારી નથી હોતી — અને પ્રસંગો ત્યાં જ બગડે છે. બધું એકસાથે લો તો અમે એક જ વાર માપીએ, એક જ ક્વોટ આપીએ, અને એક જ સમયપત્રક ચલાવીએ — જેમાં સજાવટ શરૂ થાય એ પહેલાં સ્ટ્રક્ચર ઊભું હોય અને સાઉન્ડ ગોઠવાય એ પહેલાં પાવર ચકાસાયેલો હોય. તમારી પાસે ફોન કરવા માટે એક જ નંબર. પ્રસંગના દિવસે એક કોઓર્ડિનેટર આખો ક્રમ સંભાળે અને કેટરર, ફોટોગ્રાફર તથા મહારાજ સાથે વાત કરે — જેથી તમારા પરિવારને એ ન કરવું પડે. પછી એક જ ટીમ, બુકિંગ વખતે નક્કી કરેલા દિવસે, મેદાન સાફ કરી દે.',
        process: [
          {
            title: 'એક જ સાઇટ વિઝિટ',
            body: 'બધું એકસાથે માપાય — મેદાન, પાવર, રસ્તો, નજર — છ સપ્લાયર અલગ અલગ આવીને દરેક જુદી સમસ્યા શોધે એના બદલે.',
          },
          {
            title: 'એક ક્વોટ, એક ટાઇમલાઇન',
            body: 'દરેક વસ્તુની યાદી સાથે એક જ લેખિત ક્વોટ, અને એવું સમયપત્રક જેમાં કોઈ કોઈની રાહ ન જુએ.',
          },
          {
            title: 'ક્રમમાં બાંધકામ',
            body: 'સ્ટ્રક્ચર, ફ્લોરિંગ, પાવર, સાઉન્ડ અને લાઇટિંગ, પછી સજાવટ, પછી ફૂલ. દરેક તબક્કો પૂરો થાય પછી જ આગળના તબક્કાને જગ્યા જોઈએ.',
          },
          {
            title: 'પ્રસંગના દિવસે કોઓર્ડિનેટર',
            body: 'એક વ્યક્તિ ક્રમ સંભાળે અને તમારા કેટરર, ફોટોગ્રાફર તથા મહારાજ સાથે વાત કરે — જેથી પોતાના જ પ્રસંગમાં તમારા પરિવારને સપ્લાયર સંભાળવા ન પડે.',
          },
          {
            title: 'મેદાન સાફ કરવું',
            body: 'બુકિંગ વખતે નક્કી કરેલા દિવસે ઉતારવું અને લઈ જવું — જગ્યા પાછી સોંપાય અને અમારું કંઈ પાછળ ન રહે.',
          },
        ],
        closing:
          'ઘણા દિવસનાં લગ્ન, સમૂહ લગ્ન કે કથા માટે આ લેવા જેવું છે. એક જ સાંજના પ્રસંગમાં એક-બે સેવા જોઈતી હોય તો સીધું એ જ બુક કરવું સામાન્ય રીતે સસ્તું અને સહેલું છે — અને અમે એ કહી પણ દઈશું.',
      },
    },
    inclusions: [
      { en: 'One site visit covering every service', gu: 'દરેક સેવા આવરી લેતી એક જ સાઇટ વિઝિટ' },
      { en: 'A single written quote, itemised', gu: 'એક જ લેખિત ક્વોટ, વસ્તુવાર' },
      { en: 'One build schedule across all trades', gu: 'બધા કામ માટે એક જ બાંધકામ સમયપત્રક' },
      { en: 'Coordinator on site through the function', gu: 'પ્રસંગ દરમિયાન સાઇટ પર કોઓર્ડિનેટર' },
      {
        en: 'Liaison with your caterer and photographer',
        gu: 'તમારા કેટરર અને ફોટોગ્રાફર સાથે સંકલન',
      },
      {
        en: 'Single point of contact from booking to clear-up',
        gu: 'બુકિંગથી સાફ કરવા સુધી એક જ સંપર્ક',
      },
      {
        en: 'Dismantle and ground clearing on the agreed day',
        gu: 'નક્કી કરેલા દિવસે ઉતારવું અને મેદાન સાફ કરવું',
      },
    ],
    options: [
      {
        nameEn: 'Multi-day wedding',
        nameGu: 'ઘણા દિવસનાં લગ્ન',
        descEn:
          'Haldi, mehndi, sangeet, vidhi and reception run as one schedule, with the ground reset between each.',
        descGu:
          'હળદી, મહેંદી, સંગીત, વિધિ અને રિસેપ્શન — એક જ સમયપત્રકમાં, અને દરેક વચ્ચે મેદાનની ફેરગોઠવણ.',
      },
      {
        nameEn: 'Samuh lagan',
        nameGu: 'સમૂહ લગ્ન',
        descEn:
          'Large-scale seating, catering flow and sound for several thousand guests, with a running order that keeps to time.',
        descGu:
          'હજારો મહેમાનો માટે મોટા પાયે બેઠક, જમણનો પ્રવાહ અને સાઉન્ડ — અને સમય પાળતો કાર્યક્રમ.',
      },
      {
        nameEn: 'Katha and religious events',
        nameGu: 'કથા અને ધાર્મિક પ્રસંગ',
        descEn:
          'A week of daily sessions with the same setup standing throughout, checked and reset before each day.',
        descGu:
          'અઠવાડિયા સુધી રોજનાં સત્ર, એ જ સેટઅપ આખો સમય ઊભું — અને દરેક દિવસ પહેલાં ચકાસાયેલું અને ગોઠવાયેલું.',
      },
      {
        nameEn: 'Corporate and public events',
        nameGu: 'કોર્પોરેટ અને જાહેર પ્રસંગ',
        descEn:
          'Launches, annual days and government functions where the programme is fixed and the setup has to fit around it.',
        descGu:
          'લોન્ચ, વાર્ષિકોત્સવ અને સરકારી કાર્યક્રમ — જ્યાં કાર્યક્રમ નક્કી હોય અને સેટઅપ એની આસપાસ ગોઠવવું પડે.',
      },
    ],
    specs: [
      {
        labelEn: 'Services covered',
        labelGu: 'આવરી લેવાતી સેવાઓ',
        value: 'Any combination of the fourteen',
      },
      { labelEn: 'Site visits', labelGu: 'સાઇટ વિઝિટ', value: 'One, covering everything' },
      { labelEn: 'Quote', labelGu: 'ક્વોટ', value: 'Single, itemised, in writing' },
      { labelEn: 'Coordinator', labelGu: 'કોઓર્ડિનેટર', value: 'On site through the function' },
      { labelEn: 'Suits', labelGu: 'કોના માટે યોગ્ય', value: 'Multi-day and large-scale events' },
      { labelEn: 'Clear-up', labelGu: 'સાફ કરવું', value: 'On the day agreed at booking' },
    ],
    pricing: {
      unitEn: 'per event',
      unitGu: 'પ્રતિ પ્રસંગ',
      factors: [
        { en: 'Which services are included', gu: 'કઈ સેવાઓ સામેલ છે' },
        { en: 'Number of days and functions', gu: 'કેટલા દિવસ અને કેટલા પ્રસંગ' },
        { en: 'Guest count and ground size', gu: 'મહેમાનોની સંખ્યા અને મેદાનનું માપ' },
        { en: 'How many resets between functions', gu: 'પ્રસંગો વચ્ચે કેટલી ફેરગોઠવણ' },
        { en: 'Season and distance', gu: 'સિઝન અને અંતર' },
      ],
    },
    faqs: [
      {
        question: {
          en: 'Do you clear the ground afterwards?',
          gu: 'પ્રસંગ પછી મેદાન સાફ કરી આપો છો?',
        },
        answer: {
          en: 'Yes. Dismantling and clearing our material is part of the job, and we agree the removal day with you when the booking is confirmed — so the venue is handed back on time and you are not chasing anyone the morning after.',
          gu: 'હા. અમારો સામાન ઉતારવો અને લઈ જવો એ કામનો જ ભાગ છે, અને બુકિંગ પાકું થાય ત્યારે જ ઉતારવાનો દિવસ નક્કી કરી લઈએ છીએ — જેથી જગ્યા સમયસર પાછી મળે અને બીજા દિવસે સવારે તમારે કોઈની પાછળ ફરવું ન પડે.',
        },
      },
      {
        question: {
          en: 'Is turnkey more expensive than booking separately?',
          gu: 'બધું સાથે લેવું અલગ અલગ લેવા કરતાં મોંઘું પડે?',
        },
        answer: {
          en: 'Not usually, for a multi-day or large function — one survey, one crew and one set of transport costs less than six of each. For a single evening with one or two services, booking those directly is cheaper, and we will tell you so rather than sell you a package you do not need.',
          gu: 'ઘણા દિવસના કે મોટા પ્રસંગ માટે સામાન્ય રીતે નહીં — એક સર્વે, એક ટીમ અને એક વાહનવ્યવસ્થા છ-છ કરતાં સસ્તી પડે. એક જ સાંજ અને એક-બે સેવા હોય તો સીધું બુક કરવું સસ્તું છે, અને અમે તમને બિનજરૂરી પેકેજ વેચવાને બદલે એ કહી દઈશું.',
        },
      },
      {
        question: {
          en: 'Will you work with our own caterer and photographer?',
          gu: 'અમારા પોતાના કેટરર અને ફોટોગ્રાફર સાથે કામ કરશો?',
        },
        answer: {
          en: 'Yes, and we would rather meet them before the day than on it. Ten minutes with your photographer about lighting and ten with your caterer about counter flow prevent the two most common problems at a large function.',
          gu: 'હા, અને એમને પ્રસંગના દિવસે નહીં, પહેલાં મળવાનું અમને વધુ ગમે. ફોટોગ્રાફર સાથે લાઇટિંગ વિશે દસ મિનિટ અને કેટરર સાથે કાઉન્ટરના પ્રવાહ વિશે દસ મિનિટ — મોટા પ્રસંગની બે સૌથી સામાન્ય સમસ્યાઓ એટલાથી ટળી જાય છે.',
        },
      },
      {
        question: { en: 'Who do we call on the day?', gu: 'પ્રસંગના દિવસે અમે કોને ફોન કરીએ?' },
        answer: {
          en: 'One coordinator, on site, whose number you have from the week before. They hold the running order and deal with the crew, so nobody in your family is chasing a supplier during their own function.',
          gu: 'એક કોઓર્ડિનેટર, સાઇટ પર — જેનો નંબર તમારી પાસે અઠવાડિયા પહેલાંથી હોય. એ આખો ક્રમ સંભાળે અને ટીમ સાથે વાત કરે, જેથી પોતાના જ પ્રસંગમાં તમારા પરિવારમાંથી કોઈએ સપ્લાયર પાછળ ફરવું ન પડે.',
        },
      },
    ],
  },
];
