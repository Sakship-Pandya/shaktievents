import type { Localized } from '../services';

/**
 * Copy for the audience landing pages. Each one is written around what that
 * kind of function actually demands of a setup, rather than restating the
 * service list in a different order.
 */
export type EventSeed = {
  slug: string;
  promise: Localized;
  paragraphs: { en: string[]; gu: string[] };
  needs: {
    en: { title: string; body: string }[];
    gu: { title: string; body: string }[];
  };
};

export const eventSeeds: EventSeed[] = [
  {
    slug: 'weddings',
    promise: {
      en: 'Three or four days of functions on one ground, with no gap between them.',
      gu: 'એક જ મેદાનમાં ત્રણ-ચાર દિવસના પ્રસંગો, વચ્ચે ખાડો પડ્યા વગર.',
    },
    paragraphs: {
      en: [
        'A wedding is not one setup, it is four or five sharing the same ground. The haldi wants shade and space to move, the sangeet wants a floor and a stage, the vidhi wants a mandap and a clear line for the photographer, and the reception wants seating and a dining flow. Each has to be built, used and reset while the next is being prepared.',
        'That is why we plan the whole run at the first site visit rather than function by function. The structure goes up once, the decoration changes around it, and the crew that resets the ground between events is the same crew that built it — nobody has to be told twice where the cabling runs.',
      ],
      gu: [
        'લગ્ન એટલે એક સેટઅપ નહીં, એક જ મેદાન વહેંચતા ચાર-પાંચ સેટઅપ. હળદીને છાંયડો અને ફરવાની જગ્યા જોઈએ, સંગીતને ફ્લોર અને સ્ટેજ, વિધિને મંડપ અને ફોટોગ્રાફર માટે ખુલ્લી લાઇન, અને રિસેપ્શનને બેઠક તથા જમણનો પ્રવાહ. દરેક બંધાય, વપરાય અને પછીનું તૈયાર થાય ત્યાં સુધીમાં ફરી ગોઠવાય.',
        'એટલે અમે પ્રસંગ-દર-પ્રસંગ નહીં, પહેલી સાઇટ વિઝિટમાં જ આખા ક્રમનું આયોજન કરીએ છીએ. સ્ટ્રક્ચર એક વાર ઊભું થાય, સજાવટ એની આસપાસ બદલાય, અને પ્રસંગો વચ્ચે મેદાન ફરી ગોઠવનારી ટીમ એ જ હોય જેણે એ બાંધ્યું છે — કેબલ ક્યાં જાય છે એ કોઈને બે વાર કહેવું ન પડે.',
      ],
    },
    needs: {
      en: [
        {
          title: 'A ground that changes four times',
          body: 'Haldi, sangeet, vidhi and reception each need a different layout on the same land, planned as one sequence rather than four bookings.',
        },
        {
          title: 'A mandap that photographs well',
          body: 'Sized for the couple, the maharaj, the havan kund and both families, with warm light and a clear line for the camera.',
        },
        {
          title: 'A baraat that arrives on time',
          body: 'The route walked and timed in advance, so the procession does not put the vidhi past its muhurat.',
        },
        {
          title: 'Power that does not blink',
          body: 'Lighting, sound, cooling and the catering counters all drawing from one generator sized against the real load.',
        },
      ],
      gu: [
        {
          title: 'ચાર વાર બદલાતું મેદાન',
          body: 'હળદી, સંગીત, વિધિ અને રિસેપ્શન — એક જ જમીન પર દરેકની ગોઠવણ અલગ, અને એ ચાર બુકિંગ નહીં પણ એક ક્રમ તરીકે આયોજિત.',
        },
        {
          title: 'ફોટામાં સુંદર લાગતો મંડપ',
          body: 'વર-કન્યા, મહારાજ, હવન કુંડ અને બંને પરિવારો સમાય એટલો, ગરમ પ્રકાશ અને કેમેરા માટે ખુલ્લી લાઇન સાથે.',
        },
        {
          title: 'સમયસર પહોંચતો વરઘોડો',
          body: 'રસ્તો પહેલેથી ચાલીને સમય માપેલો, જેથી જાનને લીધે વિધિ મુહૂર્ત બહાર ન જાય.',
        },
        {
          title: 'ન જતી લાઇટ',
          body: 'લાઇટિંગ, સાઉન્ડ, કૂલિંગ અને કેટરિંગ કાઉન્ટર — બધું ખરા લોડ પ્રમાણે ગણેલા એક જ જનરેટરમાંથી.',
        },
      ],
    },
  },
  {
    slug: 'religious-katha',
    promise: {
      en: 'A week of daily sessions where the back row hears as well as the front.',
      gu: 'અઠવાડિયા સુધી રોજનાં સત્ર — જ્યાં પાછળની હરોળને પણ આગળ જેવું જ સંભળાય.',
    },
    paragraphs: {
      en: [
        'A katha is not a one-night function. The same setup has to stand for a week, be checked before each session, and hold up through dew, wind and an afternoon of sun. What matters most is not decoration: it is shade over the whole seated area, seating that is bearable for two hours, and the maharaj staying clearly audible over a crowd that is talking, arriving and leaving throughout.',
        'We size the cover for the audience rather than the vyaspith, put delay towers in when the length asks for them, and re-check the system before each day rather than assuming that what worked on day one still works on day five.',
      ],
      gu: [
        'કથા એક રાતનો પ્રસંગ નથી. એ જ સેટઅપે અઠવાડિયું ઊભા રહેવાનું, દરેક સત્ર પહેલાં ચકાસાવાનું, અને ઝાકળ, પવન તથા બપોરના તડકામાં ટકવાનું હોય છે. સૌથી મહત્ત્વનું સજાવટ નથી: આખા બેઠક વિસ્તાર પર છાંયડો, બે કલાક સહન થાય એવી બેઠક, અને આખો વખત આવતી-જતી, વાતો કરતી ભીડ વચ્ચે મહારાજનો સ્પષ્ટ સંભળાતો અવાજ — એ ત્રણ.',
        'અમે કવર વ્યાસપીઠ પૂરતું નહીં, શ્રોતાગણ પ્રમાણે ગોઠવીએ છીએ, લંબાઈ માંગે ત્યાં ડિલે ટાવર મૂકીએ છીએ, અને પહેલા દિવસે ચાલ્યું એ પાંચમા દિવસે પણ ચાલશે એમ ધારવાને બદલે દરેક દિવસ પહેલાં સિસ્ટમ ફરી ચકાસીએ છીએ.',
      ],
    },
    needs: {
      en: [
        {
          title: 'Shade over everyone, not the stage',
          body: 'A pandal sized to the seated area, because the people who leave early are the ones sitting in the sun.',
        },
        {
          title: 'Speech that carries',
          body: 'Delay towers down a long ground and wireless mics that survive being shared, checked before each session.',
        },
        {
          title: 'Seating for two hours',
          body: 'Ground seating with carpets and bolsters, or chairs — set out so latecomers can reach a seat without crossing the front.',
        },
        {
          title: 'A setup that stands for a week',
          body: 'Structure, cabling and sound left up and re-checked daily rather than rebuilt each morning.',
        },
      ],
      gu: [
        {
          title: 'સ્ટેજ પર નહીં, બધા પર છાંયડો',
          body: 'બેઠક વિસ્તાર પ્રમાણે પંડાલ — કારણ કે વહેલા ઊઠી જનારા એ જ હોય છે જે તડકામાં બેઠા હોય.',
        },
        {
          title: 'પહોંચતી વાણી',
          body: 'લાંબા મેદાનમાં ડિલે ટાવર અને વહેંચાઈને વપરાય તોય ટકે એવા વાયરલેસ માઇક, દરેક સત્ર પહેલાં ચકાસાયેલા.',
        },
        {
          title: 'બે કલાકની બેઠક',
          body: 'કાર્પેટ અને તકિયા સાથે નીચે બેઠક, અથવા ખુરશી — એ રીતે ગોઠવાયેલી કે મોડા આવનાર આગળથી પસાર થયા વગર જગ્યાએ પહોંચે.',
        },
        {
          title: 'અઠવાડિયું ટકતું સેટઅપ',
          body: 'સ્ટ્રક્ચર, કેબલિંગ અને સાઉન્ડ ઊભાં રહે અને રોજ ચકાસાય — દર સવારે ફરી બાંધવાં ન પડે.',
        },
      ],
    },
  },
  {
    slug: 'navratri-garba',
    promise: {
      en: 'Nine nights where the far side of the circle hears the same beat as the near side.',
      gu: 'નવ રાત — જ્યાં વર્તુળના સામે છેડે પણ એ જ બીટ સંભળાય.',
    },
    paragraphs: {
      en: [
        'Garba is the one function where the audience is the event. People are moving, in a circle, for hours, and everything follows from that: sound has to reach evenly all the way round rather than pointing at one end, lighting has to keep the ground visible without dazzling anyone facing it, and the whole rig has to survive nine consecutive nights outdoors.',
        'We place the stacks around the ground, mix the dhol live rather than leaving it to fight the track, and check the system before each night. Nine nights of dew and dust changes a rig that was perfect on the first evening.',
      ],
      gu: [
        'ગરબા એક એવો પ્રસંગ છે જ્યાં શ્રોતાગણ પોતે જ કાર્યક્રમ છે. લોકો કલાકો સુધી, વર્તુળમાં, ફરતા રહે છે — અને બાકીનું બધું એમાંથી નીકળે છે: અવાજ એક છેડે તાકવાને બદલે આખા વર્તુળે સરખો પહોંચવો જોઈએ, લાઇટે મેદાન દેખાડવું જોઈએ પણ સામે જોનારની આંખમાં ન વાગે, અને આખી સિસ્ટમે ખુલ્લામાં સળંગ નવ રાત ટકવાનું છે.',
        'અમે સ્પીકર મેદાનની ફરતે ગોઠવીએ છીએ, ઢોલને ટ્રેક સાથે લડવા દેવાને બદલે લાઇવ મિક્સ કરીએ છીએ, અને દરેક રાત પહેલાં સિસ્ટમ ચકાસીએ છીએ. નવ રાતની ઝાકળ અને ધૂળ પહેલી સાંજે બરાબર રહેલી સિસ્ટમને બદલી નાખે છે.',
      ],
    },
    needs: {
      en: [
        {
          title: 'Even coverage round the circle',
          body: 'Stacks placed around the ground, not banked at one end, so nobody is dancing to a delayed beat.',
        },
        {
          title: 'Light you can dance under',
          body: 'Bright enough to see the ground, angled so it is not in the eyes of anyone facing it.',
        },
        {
          title: 'Live dhol in the mix',
          body: 'Dhol-tasha mixed against the track rather than competing with it, with an operator there all night.',
        },
        {
          title: 'Nine nights, not one',
          body: 'A rig left standing and re-checked nightly, with a spare amp on site.',
        },
      ],
      gu: [
        {
          title: 'વર્તુળે સરખો અવાજ',
          body: 'સ્પીકર એક છેડે નહીં, મેદાનની ફરતે — જેથી કોઈ મોડા બીટ પર ન રમે.',
        },
        {
          title: 'નીચે રમાય એવી લાઇટ',
          body: 'મેદાન દેખાય એટલી તેજ, અને એવા ખૂણે કે સામે જોનારની આંખમાં ન પડે.',
        },
        {
          title: 'મિક્સમાં લાઇવ ઢોલ',
          body: 'ઢોલ-તાશા ટ્રેક સામે લડવાને બદલે એની સાથે મિક્સ, અને આખી રાત ઓપરેટર હાજર.',
        },
        {
          title: 'એક નહીં, નવ રાત',
          body: 'સિસ્ટમ ઊભી રહે અને રોજ રાત્રે ચકાસાય, સાઇટ પર વધારાનું એમ્પ્લિફાયર સાથે.',
        },
      ],
    },
  },
  {
    slug: 'political-government',
    promise: {
      en: 'Same-day turnarounds, and a running order that changes twice before it starts.',
      gu: 'એક જ દિવસમાં તૈયાર — અને શરૂ થતાં પહેલાં બે વાર બદલાતો કાર્યક્રમ.',
    },
    paragraphs: {
      en: [
        'Public events are decided late and change often. The date moves, the speaker list grows, the ground is confirmed the day before. We plan for that rather than complain about it: the rig is specified so it can be built quickly, the podium takes a dozen speakers without being re-set between them, and the stage is dressed so a change of name board is minutes rather than an afternoon.',
        'Crowd sound over a long open ground is its own problem. Delay towers are not optional past a certain length, and a system that is loud at the front and unintelligible at the back is worse than a smaller one placed properly.',
      ],
      gu: [
        'જાહેર કાર્યક્રમો મોડા નક્કી થાય છે અને વારંવાર બદલાય છે. તારીખ ખસે, વક્તાઓની યાદી લંબાય, મેદાન આગલા દિવસે નક્કી થાય. અમે ફરિયાદ કરવાને બદલે એનું આયોજન કરીએ છીએ: સિસ્ટમ એવી નક્કી થાય કે ઝડપથી ઊભી થાય, પોડિયમ બાર-પંદર વક્તાઓ વચ્ચે ફરી ગોઠવ્યા વગર ચાલે, અને સ્ટેજ એવું સજાવાય કે નામનું બોર્ડ બદલવું બપોરનું નહીં, મિનિટોનું કામ હોય.',
        'લાંબા ખુલ્લા મેદાનમાં ભીડનો સાઉન્ડ પોતે જ એક સમસ્યા છે. ચોક્કસ લંબાઈ પછી ડિલે ટાવર વૈકલ્પિક રહેતા નથી, અને આગળ મોટો પણ પાછળ અસ્પષ્ટ સાઉન્ડ કરતાં યોગ્ય રીતે ગોઠવેલી નાની સિસ્ટમ સારી.',
      ],
    },
    needs: {
      en: [
        {
          title: 'A build that can happen fast',
          body: 'Specified so the ground can be confirmed late and still be ready, without cutting the anchoring or the cabling short.',
        },
        {
          title: 'Sound down a long ground',
          body: 'Delay towers so the back of the crowd hears the same sentence at the same time as the front.',
        },
        {
          title: 'A podium that survives a dozen speakers',
          body: 'Mics set once for a shared lectern rather than re-adjusted between every name.',
        },
        {
          title: 'Boards that can change late',
          body: 'Stage dressing built so a name or a date can be swapped in minutes.',
        },
      ],
      gu: [
        {
          title: 'ઝડપથી થઈ શકે એવું બાંધકામ',
          body: 'એ રીતે નક્કી કે મેદાન મોડું નક્કી થાય તોય તૈયાર થાય — અને એન્કરિંગ કે કેબલિંગમાં કાપ મૂક્યા વગર.',
        },
        {
          title: 'લાંબા મેદાનમાં સાઉન્ડ',
          body: 'ડિલે ટાવર, જેથી ભીડના પાછળના ભાગને પણ આગળના જેટલા જ સમયે એ જ વાક્ય સંભળાય.',
        },
        {
          title: 'બાર વક્તાઓ ટકે એવું પોડિયમ',
          body: 'સહિયારા લેક્ચર્ન માટે એક વાર ગોઠવેલા માઇક, દરેક નામે ફરી ગોઠવવા ન પડે.',
        },
        {
          title: 'મોડે બદલી શકાય એવાં બોર્ડ',
          body: 'સ્ટેજની સજાવટ એવી કે નામ કે તારીખ મિનિટોમાં બદલાય.',
        },
      ],
    },
  },
  {
    slug: 'corporate-school',
    promise: {
      en: 'A fixed programme the setup has to fit around, not the other way round.',
      gu: 'નક્કી કાર્યક્રમ — સેટઅપે એની આસપાસ ગોઠવાવાનું, ઊલટું નહીં.',
    },
    paragraphs: {
      en: [
        'An annual day or a prize distribution has a running order that was agreed weeks ago and a rehearsal schedule that owns the ground until the afternoon. Our job is to build around both. That means staged setup, quiet work while rehearsals run, and a stage with steps and a ramp that a hundred children can cross safely without a queue forming at one side.',
        'Sound for these is mostly speech and recorded music, with the occasional live performance. We set the mics for the compere and the performers before the hall fills, because a soundcheck during the first item is the item everyone remembers.',
      ],
      gu: [
        'વાર્ષિકોત્સવ કે ઇનામ વિતરણનો કાર્યક્રમ અઠવાડિયાં પહેલાં નક્કી થયેલો હોય, અને રિહર્સલનું સમયપત્રક બપોર સુધી મેદાન રોકી રાખે. અમારું કામ બંનેની આસપાસ બાંધવાનું છે. એટલે તબક્કાવાર સેટઅપ, રિહર્સલ ચાલે ત્યારે શાંત કામ, અને પગથિયાં તથા રેમ્પ સાથેનું એવું સ્ટેજ કે સો બાળકો એક બાજુ લાઇન લગાવ્યા વગર સલામત રીતે પસાર થઈ શકે.',
        'આમાં સાઉન્ડ મોટે ભાગે વાણી અને રેકોર્ડેડ મ્યુઝિકનો હોય, વચ્ચે ક્યારેક લાઇવ પર્ફોર્મન્સ. હોલ ભરાય એ પહેલાં અમે સંચાલક અને કલાકારોના માઇક ગોઠવી લઈએ છીએ — કારણ કે પહેલી આઇટમ દરમિયાન થતો સાઉન્ડચેક એ જ આઇટમ બધાને યાદ રહી જાય છે.',
      ],
    },
    needs: {
      en: [
        {
          title: 'Setup around rehearsals',
          body: 'Staged so the ground stays usable, with the noisy work finished before the programme needs quiet.',
        },
        {
          title: 'A stage children can cross',
          body: 'Steps and a ramp on both sides, so a hundred prize-winners do not queue at one corner.',
        },
        {
          title: 'Mics ready before the hall fills',
          body: 'Compere, performers and the head table checked in advance rather than during the first item.',
        },
        {
          title: 'A programme that keeps time',
          body: 'Cues agreed with whoever is running the order, so the lights and sound follow rather than lag.',
        },
      ],
      gu: [
        {
          title: 'રિહર્સલની આસપાસ સેટઅપ',
          body: 'તબક્કાવાર, જેથી મેદાન વપરાતું રહે — અને અવાજવાળું કામ કાર્યક્રમને શાંતિ જોઈએ એ પહેલાં પતી જાય.',
        },
        {
          title: 'બાળકો પસાર થઈ શકે એવું સ્ટેજ',
          body: 'બંને બાજુ પગથિયાં અને રેમ્પ, જેથી સો ઇનામ મેળવનારા એક ખૂણે લાઇન ન લગાવે.',
        },
        {
          title: 'હોલ ભરાય એ પહેલાં તૈયાર માઇક',
          body: 'સંચાલક, કલાકારો અને મુખ્ય ટેબલ — પહેલી આઇટમ દરમિયાન નહીં, પહેલેથી ચકાસાયેલા.',
        },
        {
          title: 'સમય પાળતો કાર્યક્રમ',
          body: 'ક્રમ ચલાવનાર સાથે નક્કી કરેલા સંકેત, જેથી લાઇટ અને સાઉન્ડ પાછળ નહીં, સાથે ચાલે.',
        },
      ],
    },
  },
  {
    slug: 'social-community',
    promise: {
      en: 'Five thousand guests or fifty — the same site visit and the same written quote.',
      gu: 'પાંચ હજાર મહેમાનો હોય કે પચાસ — એ જ સાઇટ વિઝિટ, એ જ લેખિત ક્વોટ.',
    },
    paragraphs: {
      en: [
        'Samuh lagan, samaj melavdo, besnu, anniversaries: community functions cover the widest range of anything we do, from a hall of fifty to a ground of five thousand. What they share is that somebody in the samaj is answerable for the money, so the quote has to be itemised and the number has to hold.',
        'At the large end, catering flow decides whether the evening works. A single long buffet makes one queue, and one queue for a thousand people takes an hour. We split the service into stations with their own approaches and plan the seating against it, because that does more for the evening than anything we could hang on a wall.',
      ],
      gu: [
        'સમૂહ લગ્ન, સમાજ મેળાવડો, બેસણું, વર્ષગાંઠ — સામાજિક પ્રસંગોમાં અમારા બધા કામમાં સૌથી વધુ વૈવિધ્ય છે, પચાસ માણસના હોલથી પાંચ હજારના મેદાન સુધી. બધામાં એક વાત સરખી: સમાજમાં કોઈક પૈસાનો જવાબદાર હોય છે, એટલે ક્વોટ વસ્તુવાર હોવો જોઈએ અને આંકડો ટકવો જોઈએ.',
        'મોટા છેડે જમણનો પ્રવાહ નક્કી કરે છે કે સાંજ સફળ થશે કે નહીં. એક લાંબું બુફે એક જ લાઇન બનાવે, અને હજાર માણસ માટે એક લાઇન એટલે એક કલાક. અમે સેવાને પોતાના રસ્તાવાળા સ્ટેશનમાં વહેંચીએ છીએ અને એની સામે બેઠક ગોઠવીએ છીએ — દીવાલ પર લટકાવેલી કોઈ પણ વસ્તુ કરતાં એ સાંજ માટે વધુ કરે છે.',
      ],
    },
    needs: {
      en: [
        {
          title: 'An itemised quote',
          body: 'Every line listed, because somebody in the samaj has to answer for the total.',
        },
        {
          title: 'Catering flow before decoration',
          body: 'Stations with separate approaches, so a thousand people are not standing in one line.',
        },
        {
          title: 'Seating that suits the crowd',
          body: 'Ground seating, chairs or a mix, laid out so people can reach and leave a seat without crossing the service.',
        },
        {
          title: 'The same care at any size',
          body: 'A fifty-guest besnu gets the site visit and the crew that a five-thousand-guest samuh lagan gets.',
        },
      ],
      gu: [
        {
          title: 'વસ્તુવાર ક્વોટ',
          body: 'દરેક લાઇન અલગ — કારણ કે સમાજમાં કોઈકે કુલ રકમનો જવાબ આપવાનો હોય છે.',
        },
        {
          title: 'સજાવટ પહેલાં જમણનો પ્રવાહ',
          body: 'અલગ રસ્તાવાળાં સ્ટેશન, જેથી હજાર માણસ એક જ લાઇનમાં ઊભા ન રહે.',
        },
        {
          title: 'ભીડને અનુકૂળ બેઠક',
          body: 'નીચે બેઠક, ખુરશી કે બંને — એ રીતે કે લોકો સેવા ઓળંગ્યા વગર જગ્યાએ પહોંચે અને ઊઠે.',
        },
        {
          title: 'દરેક માપે એ જ કાળજી',
          body: 'પચાસ માણસના બેસણાને પણ એ જ સાઇટ વિઝિટ અને એ જ ટીમ મળે જે પાંચ હજારના સમૂહ લગ્નને મળે છે.',
        },
      ],
    },
  },
];
