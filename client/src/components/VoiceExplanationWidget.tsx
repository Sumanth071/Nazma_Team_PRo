import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  FileText,
  Copy,
  Check,
  Languages,
  Radio,
  Type,
} from 'lucide-react';
import { API_BASE_URL } from '../utils/apiConfig';

export type SupportedLanguage = 'en' | 'hi' | 'te' | 'ta';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  badge: string;
  locale: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', badge: 'EN', locale: 'en-US' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', badge: 'HI', locale: 'hi-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', badge: 'TE', locale: 'te-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', badge: 'TA', locale: 'ta-IN' },
];

interface VoiceExplanationWidgetProps {
  predictedClass: string;
  confidence: number;
  analysisId?: string;
  autoPlay?: boolean;
  defaultLanguage?: SupportedLanguage;
  className?: string;
}

interface RiskProfile {
  level: 'HIGH' | 'MODERATE-HIGH' | 'LOW' | 'NORMAL';
  label: string;
  badgeClass: string;
  borderClass: string;
  bgClass: string;
  neoplasticPotential: string;
  clinicalAction: string;
  speechText: string;
  phoneticText?: string;
}

export const VoiceExplanationWidget: React.FC<VoiceExplanationWidgetProps> = ({
  predictedClass,
  confidence,
  analysisId,
  autoPlay = false,
  defaultLanguage = 'en',
  className = '',
}) => {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(defaultLanguage);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState(true);
  const [scriptMode, setScriptMode] = useState<'native' | 'phonetic'>('native');
  const [copied, setCopied] = useState(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const confidencePercent = (confidence * 100).toFixed(1);

  // Stop and clean up any playing audio on unmount or scan change
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [predictedClass]);

  // Multilingual medical risk profile based on clinical guidelines (ESGE/ASGE/Kudo)
  const getRiskProfile = (lang: SupportedLanguage): RiskProfile => {
    const pClass = (predictedClass || '').toLowerCase();

    // 1. ADENOMATOUS POLYP (High Risk)
    if (pClass.includes('adenoma')) {
      const texts: Record<
        SupportedLanguage,
        { label: string; speech: string; phonetic?: string; pathology: string; action: string }
      > = {
        en: {
          label: 'High Malignant Risk',
          speech: `Diagnostic assessment complete. Analysis reveals an Adenomatous Polyp with ${confidencePercent} percent diagnostic confidence. Clinical Risk Level is High. Adenomatous polyps are established dysplastic lesions with significant malignant transformation risk. Immediate endoscopic mucosal resection and histopathological evaluation are recommended as per clinical guidelines.`,
          pathology: 'Pre-cancerous Neoplastic Adenoma (Dysplastic Risk)',
          action: 'Complete Endoscopic Mucosal Resection (EMR) and histopathological confirmation strongly advised.',
        },
        hi: {
          label: 'उच्च दुर्दम्य जोखिम (High Risk)',
          speech: `नैदानिक मूल्यांकन पूर्ण हुआ। विश्लेषण से ${confidencePercent} प्रतिशत विश्वसनीयता के साथ एडिनोमेटस पॉलीप की पुष्टि हुई है। नैदानिक जोखिम स्तर उच्च है। एडिनोमेटस पॉलीप्स घातक कैंसर में बदलने का उच्च जोखिम रखते हैं। नैदानिक दिशानिर्देशों के अनुसार तत्काल एंडोस्कोपिक म्यूकोसल रिसेक्शन और हिस्टोपैथोलॉजिकल जांच की सिफारिश की जाती है।`,
          phonetic: `Nidanik mulyankan purna hua. Vishleshan se ${confidencePercent} pratishat vishvasniyata ke sath Adenomatous Polyp ki pushti hui hai. Nidanik jokhim star uchh hai. Adenomatous polyps ghatak cancer me badalne ka uchh jokhim rakhte hain. Nidanik dishanirdeshon ke anusar tatkal Endoscopic Mucosal Resection (EMR) aur histopathology jaanch ki sifarish ki jati hai.`,
          pathology: 'पूर्व-कैंसरयुक्त एडिनोमा (उच्च डिस्प्लेसिया जोखिम)',
          action: 'पूर्ण एंडोस्कोपिक म्यूकोसल रिसेक्शन (EMR) और हिस्टोपैथोलॉजी पुष्टि अनिवार्य है।',
        },
        te: {
          label: 'అధిక ప్రమాదం (High Malignant Risk)',
          speech: `రోగనిర్ధారణ విశ్లేషణ పూర్తయింది. విశ్లేషణలో ${confidencePercent} శాతం నమ్మకంతో ఎడినోమాటస్ పాలిప్ కనుగొనబడింది. క్లినికల్ రిస్క్ స్థాయి చాలా ఎక్కువ. ఎడినోమాటస్ పాలిప్స్ క్యాన్సర్‌గా మారే ప్రమాదం కలిగి ఉంటాయి. మార్గదర్శకాల ప్రకారం తక్షణమే ఎండోస్కోపిక్ మ్యూకోసల్ రిసెక్షన్ మరియు హిస్టోపాథాలజీ పరీక్ష చేయాలని సిఫార్సు చేయబడింది.`,
          phonetic: `Roganirdharana vishleshana poorthayindi. Vishleshanalo ${confidencePercent} shatam nammakamtho Adenomatous Polyp kanugonabadindi. Clinical Risk Level chala ekkuva. Adenomatous polyps cancer-ga mare pramadam kaligi untayi. Margadarshakala prakaram takshaname Endoscopic Mucosal Resection (EMR) mariyu histopathology pariksha cheyalani sipharssu cheyabadindi.`,
          pathology: 'క్యాన్సర్ పూర్వ ఎడినోమా (హై డిస్ప్లాసియా రిస్క్) / Pre-cancerous Neoplastic Adenoma',
          action: 'తక్షణమే ఎండోస్కోపిక్ మ్యూకోసల్ రిసెక్షన్ (EMR) మరియు హిస్టోపాథాలజీ ధృవీకరణ అవసరం.',
        },
        ta: {
          label: 'அதிக ஆபத்து (High Risk)',
          speech: `மருத்துவ பரிசோதனை முடிந்தது. ஆய்வு ${confidencePercent} சதவீத துல்லியத்துடன் அடினோமாட்டస్ பாலிப்பை உறுதி செய்கிறது. மருத்துவ ஆபத்து நிலை மிக அதிகம். அடினோமாட்டஸ் பாலிப்கள் புற்றுநோயாக மாறும் அபாயம் கொண்டவை. வழிகாட்டுதல்களின்படி உடனடியாக எண்டோஸ்கோபிக் மியூகோசல் பிரித்தெடுத்தல் மற்றும் திசு ஆய்வு பரிசோதனை பரிந்துரைக்கப்படுகிறது.`,
          phonetic: `Maruthuva parisothanai mudinthathu. Aayvu ${confidencePercent} sathavitha thulliyathudan Adenomatous Polyppai uruthi seigirathu. Maruthuva aabathu nilai miga athigam. Adenomatous polyps putrunoyaga maarum abaayam kondavai. Valikaattuthalgalin padi udanadiyaaga Endoscopic Mucosal Resection (EMR) matrum thisu aayvu parisothanai parinthuraikkappadugirathu.`,
          pathology: 'புற்றுநோய்க்கு முந்தைய அடினோமா (அதிக ஆபத்து) / Pre-cancerous Neoplastic Adenoma',
          action: 'முழுமையான எண்டோஸ்கோபிக் மியூகோசல் அகற்றுதல் (EMR) மற்றும் திசு ஆய்வு உறுதிப்படுத்தல் அவசியம்.',
        },
      };

      const t = texts[lang];
      return {
        level: 'HIGH',
        label: t.label,
        badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        borderClass: 'border-rose-500/40',
        bgClass: 'from-rose-950/30 via-slate-900 to-slate-950',
        neoplasticPotential: t.pathology,
        clinicalAction: t.action,
        speechText: t.speech,
        phoneticText: t.phonetic,
      };
    }

    // 2. SERRATED POLYP (Moderate-High Risk)
    if (pClass.includes('serrated')) {
      const texts: Record<
        SupportedLanguage,
        { label: string; speech: string; phonetic?: string; pathology: string; action: string }
      > = {
        en: {
          label: 'Moderate-High Risk',
          speech: `Diagnostic assessment complete. The detected lesion is classified as a Serrated Polyp with ${confidencePercent} percent diagnostic confidence. Clinical Risk Level is Moderate to High. Sessile serrated polyps develop through the alternate serrated neoplasia pathway. Complete en-bloc resection with three-year surveillance interval is recommended.`,
          pathology: 'Sessile Serrated Lesion (Alternate Serrated Pathway)',
          action: 'En-bloc resection with dedicated mucosal margin inspection; 3-year surveillance colonoscopy.',
        },
        hi: {
          label: 'मध्यम-उच्च जोखिम (Moderate-High Risk)',
          speech: `नैदानिक मूल्यांकन पूर्ण हुआ। खोजी गई घाव को ${confidencePercent} प्रतिशत नैदानिक विश्वसनीयता के साथ सेरेटेड पॉलीप के रूप में वर्गीकृत किया गया है। नैदानिक जोखिम स्तर मध्यम से उच्च है। सेरेटेड पॉलीप्स सेरेटेड नियोप्लासिया मार्ग से विकसित होते हैं। तीन साल के निगरानी अंतराल के साथ पूर्ण रिसेक्शन की सिफारिश की जाती है।`,
          phonetic: `Nidanik mulyankan purna hua. Khoji gayi ghav ko ${confidencePercent} pratishat nidanik vishvasniyata ke sath Serrated Polyp ke roop me vargikrit kiya gaya hai. Nidanik jokhim star madhyam se uchh hai. Teen saal ke nigrani antral ke sath purna resection ki sifarish ki jati hai.`,
          pathology: 'सेसिल सेरेटेड घाव (सेरेटेड नियोप्लास्टिक मार्ग)',
          action: 'म्यूकोसल मार्जिन निरीक्षण के साथ पूर्ण रिसेक्शन; 3 साल में पुनः कोलोनोस्कोपी।',
        },
        te: {
          label: 'మధ్యస్థ-అధిక ప్రమాదం (Moderate-High Risk)',
          speech: `రోగనిర్ధారణ విశ్లేషణ పూర్తయింది. గుర్తించబడిన గాయం ${confidencePercent} శాతం నమ్మకంతో సెరేటెడ్ పాలిప్‌గా వర్గీకరించబడింది. క్లినికల్ రిస్క్ స్థాయి మధ్యస్థం నుండి ఎక్కువ. సెరేటెడ్ పాలిప్స్ ప్రత్యేక నియోప్లాసియా మార్గం ద్వారా అభివృద్ధి చెందుతాయి. మూడు సంవత్సరాల పరిశీలనతో సంపూర్ణ శస్త్రచికిత్స రిసెక్షన్ సిఫార్సు చేయబడింది.`,
          phonetic: `Roganirdharana vishleshana poorthayindi. Gurthinchabadina gayam ${confidencePercent} shatam nammakamtho Serrated Polyp-ga vargikarinchabadindi. Clinical Risk Level madhyastham nundi ekkuva. Serrated polyps pratyeka neoplasia margam dvara abhivrudhi chenduthayi. Moodu samvatsarala parishilanatho sampoorna resection sipharssu cheyabadindi.`,
          pathology: 'సెస్సిల్ సెరేటెడ్ గాయం (సెరేటెడ్ మార్గం) / Sessile Serrated Lesion',
          action: 'మ్యూకోసల్ మార్జిన్ పరిశీలనతో ఎన్-బ్లాక్ రిసెక్షన్; 3 సంవత్సరాలలో తిరిగి కొలొనోస్కోపీ.',
        },
        ta: {
          label: 'மிதமான-அதிக ஆபத்து (Moderate-High Risk)',
          speech: `மருத்துவ பரிசோதனை முடிந்தது. கண்டறியப்பட்ட தழும்பு ${confidencePercent} சதவீத துல்லியத்துடன் செரேட்டட் பாலிப் என வகைப்படுத்தப்பட்டுள்ளது. மருத்துவ ஆபத்து நிலை மிதமானது முதல் அதிகம். மூன்று ஆண்டு கண்காணிப்பு இடைவெளியுடன் முழுமையான அறுவை சிகிச்சை அகற்றுதல் பரிந்துரைக்கப்படுகிறது.` ,
          phonetic: `Maruthuva parisothanai mudinthathu. Kandariyappatta thalumbu ${confidencePercent} sathavitha thulliyathudan Serrated Polyp ena vagaipaduthappattullathu. Maruthuva aabathu nilai mithamaanathu muthal athigam. Moondru aandu kankaanippu idaiveliyudan mulumaiyaana aruvai sikitsai akatruthal parinthuraikkappadugirathu.`,
          pathology: 'செசில் செரேட்டட் புண் (மாற்று புற்றுநோய் பாதை) / Sessile Serrated Lesion',
          action: 'முழுமையான தழும்பு அகற்றுதல்; 3 ஆண்டுகளுக்குப் பிறகு மீண்டும் கொலோனோஸ்கோபி.',
        },
      };

      const t = texts[lang];
      return {
        level: 'MODERATE-HIGH',
        label: t.label,
        badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        borderClass: 'border-amber-500/40',
        bgClass: 'from-amber-950/30 via-slate-900 to-slate-950',
        neoplasticPotential: t.pathology,
        clinicalAction: t.action,
        speechText: t.speech,
        phoneticText: t.phonetic,
      };
    }

    // 3. HYPERPLASTIC POLYP (Low Risk / Benign)
    if (pClass.includes('hyperplastic')) {
      const texts: Record<
        SupportedLanguage,
        { label: string; speech: string; phonetic?: string; pathology: string; action: string }
      > = {
        en: {
          label: 'Low Risk (Benign)',
          speech: `Diagnostic assessment complete. The specimen is classified as a Hyperplastic Polyp with ${confidencePercent} percent diagnostic confidence. Clinical Risk Level is Low and Benign. Hyperplastic lesions carry negligible risk of malignant transformation. Standard clinical observation and routine screening are indicated.`,
          pathology: 'Non-neoplastic Mucosal Proliferation (Negligible Dysplasia)',
          action: 'Benign histology. Routine standard surveillance colonoscopy interval.',
        },
        hi: {
          label: 'कम जोखिम / सौम्य (Low Risk Benign)',
          speech: `नैदानिक मूल्यांकन पूर्ण हुआ। नमूने को ${confidencePercent} प्रतिशत विश्वसनीयता के साथ हाइपरप्लास्टिक पॉलीप के रूप में वर्गीकृत किया गया है। नैदानिक जोखिम स्तर कम और हानिरहित है। हाइपरप्लास्टिक पॉलीप्स में कैंसर बनने का नगण्य जोखिम होता है। नियमित निगरानी और सामान्य जांच की सलाह दी जाती है।`,
          phonetic: `Nidanik mulyankan purna hua. Namune ko ${confidencePercent} pratishat vishvasniyata ke sath Hyperplastic Polyp ke roop me vargikrit kiya gaya hai. Nidanik jokhim star kam aur hanirahit hai. Niyamit nigrani aur samanya jaanch ki salah di jati hai.`,
          pathology: 'गैर-नियोप्लास्टिक म्यूकोसल वृद्धि (हानिरहित/सौम्य)',
          action: 'सौम्य हिस्टोलॉजी। नियमित मानक कोलोनोस्कोपी अंतराल पर्याप्त है।',
        },
        te: {
          label: 'తక్కువ ప్రమాదం / సాధారణం (Low Risk)',
          speech: `రోగనిర్ధారణ విశ్లేషణ పూర్తయింది. నమూనా ${confidencePercent} శాతం నమ్మకంతో హైపర్‌ప్లాస్టిక్ పాలిప్‌గా వర్గీకరించబడింది. క్లినికల్ రిస్క్ స్థాయి తక్కువ మరియు ప్రమాదకరం కాదు. హైపర్‌ప్లాస్టిక్ పాలిప్స్‌లో క్యాన్సర్ వచ్చే ప్రమాదం అత్యల్పం. సాధారణ వైద్య పరిశీలన మరియు స్క్రీనింగ్ సరిపోతుంది.`,
          phonetic: `Roganirdharana vishleshana poorthayindi. Namoona ${confidencePercent} shatam nammakamtho Hyperplastic Polyp-ga vargikarinchabadindi. Clinical Risk Level thakkuva mariyu pramādakaram kaadu. Sadharana vaidya parishilana mariyu screening saripothundi.`,
          pathology: 'నాన్-నియోప్లాస్టిక్ కణజాలం (ప్రమాదకరం కానిది/బినైన్) / Benign Hyperplastic Mucosa',
          action: 'సాధారణ బినైన్ కణజాలం. ప్రామాణిక కొలొనోస్కోపీ వ్యవధి పాటించండి.',
        },
        ta: {
          label: 'குறைந்த ஆபத்து / தீங்கற்றது (Low Risk)',
          speech: `மருத்துவ பரிசோதனை முடிந்தது. மாதிரி ${confidencePercent} சதவீத துல்லியத்துடன் ஹைப்பர்பிளாஸ்டிக் பாலிப் என வகைப்படுத்தப்பட்டுள்ளது. மருத்துவ ஆபத்து நிலை குறைவு மற்றும் தீங்கற்றது. ஹைப்பர்பிளாஸ்டிக் பாலிப்கள் புற்றுநோயாக மாறும் அபாயம் மிகக் குறைவு. வழக்கமான மருத்துவ கண்காணிப்பு போதுமானது.` ,
          phonetic: `Maruthuva parisothanai mudinthathu. Maathiri ${confidencePercent} sathavitha thulliyathudan Hyperplastic Polyp ena vagaipaduthappattullathu. Maruthuva aabathu nilai kuraivu matrum theengatrathu. Valakkamāna maruthuva kankaanippu pothumaanathu.`,
          pathology: 'புற்றுநோய் அல்லாத சளி சவ்வு வளர்ச்சி (தீங்கற்றது) / Benign Hyperplastic Mucosa',
          action: 'தீங்கற்ற திசு அமைப்பு. வழக்கமான கால இடைவெளியில் கொலோனோஸ்கோபி போதுமானது.',
        },
      };

      const t = texts[lang];
      return {
        level: 'LOW',
        label: t.label,
        badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        borderClass: 'border-emerald-500/40',
        bgClass: 'from-emerald-950/30 via-slate-900 to-slate-950',
        neoplasticPotential: t.pathology,
        clinicalAction: t.action,
        speechText: t.speech,
        phoneticText: t.phonetic,
      };
    }

    // 4. NORMAL MUCOSA (Minimal / Normal)
    const texts: Record<
      SupportedLanguage,
      { label: string; speech: string; phonetic?: string; pathology: string; action: string }
    > = {
      en: {
        label: 'Minimal / Normal Mucosa',
        speech: `Diagnostic assessment complete. The scanned endoscopic frame shows normal mucosal architecture with ${confidencePercent} percent confidence. No dysplastic polyp features detected. Continue routine preventative screening.`,
        pathology: 'Normal Colorectal Epithelium',
        action: 'No polyps identified. Follow normal preventative colonoscopy schedule.',
      },
      hi: {
        label: 'सामान्य म्यूकोसा (Normal Mucosa)',
        speech: `नैदानिक मूल्यांकन पूर्ण हुआ। एंडोस्कोपिक स्कैन ${confidencePercent} प्रतिशत विश्वसनीयता के साथ सामान्य म्यूकोसल संरचना दर्शाता है। कोई पॉलीप या डिस्प्लेसिया नहीं पाया गया। नियमित निवारक जांच जारी रखें।`,
        phonetic: `Nidanik mulyankan purna hua. Endoscopic scan ${confidencePercent} pratishat vishvasniyata ke sath samanya mucosal sanrachna darshata hai. Koi polyp ya dysplasia nahi paya gaya. Niyamit nivarak jaanch jaari rakhein.`,
        pathology: 'सामान्य कोलोरेक्टल उपकला',
        action: 'कोई पॉलीप नहीं मिला। सामान्य निवारक कोलोनोस्कोपी कार्यक्रम जारी रखें।',
      },
      te: {
        label: 'సాధారణ కొలొన్ (Normal Mucosa)',
        speech: `రోగనిర్ధారణ విశ్లేషణ పూర్తయింది. ఎండోస్కోపిక్ స్కాన్ ${confidencePercent} శాతం నమ్మకంతో సాధారణ మ్యూకోసల్ నిర్మాణాన్ని చూపుతోంది. ఎలాంటి పాలిప్స్ లేదా లోపాలు లేవు. సాధారణ నివారణ పరీక్షలను కొనసాగించండి.`,
        phonetic: `Roganirdharana vishleshana poorthayindi. Endoscopic scan ${confidencePercent} shatam nammakamtho sadharana mucosal nirmananni chuputhondi. Elaanti polyps leda lopalu levu. Sadharana nivarana parikshalanu konasaginchandi.`,
        pathology: 'సాధారణ కొలొరెక్టల్ ఎపిథీలియం / Normal Colorectal Epithelium',
        action: 'ఎలాంటి పాలిప్స్ లేవు. సాధారణ నివారణ కొలొనోస్కోపీ షెడ్యూల్ కొనసాగించండి.',
      },
      ta: {
        label: 'சாதாரண பெருங்குடல் (Normal Mucosa)',
        speech: `மருத்துவ பரிசோதனை முடிந்தது. எண்டோஸ்கோபிக் படம் ${confidencePercent} சதவீத துல்லியத்துடன் சாதாரண திசு அமைப்பைக் காட்டுகிறது. எந்த பாలిப் தழும்புகளும் இல்லை. வழக்கமான தடுப்பு பரிசோதனையைத் தொடரவும்.` ,
        phonetic: `Maruthuva parisothanai mudinthathu. Endoscopic padam ${confidencePercent} sathavitha thulliyathudan saathaarana thisu amaippaik kaattugirathu. Entha polyp thalumbugalum illai. Valakkamaana thaduppu parisothanaiyai thodaravum.`,
        pathology: 'சாதாரண பெருங்குடல் சளி சவ்வு / Normal Colorectal Epithelium',
        action: 'பாலிப்கள் எதுவும் கண்டறியப்படவில்லை. வழக்கமான தடுப்பு பரிசோதனையைத் தொடரவும்.',
      },
    };

    const t = texts[lang];
    return {
      level: 'NORMAL',
      label: t.label,
      badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      borderClass: 'border-blue-500/40',
      bgClass: 'from-blue-950/30 via-slate-900 to-slate-950',
      neoplasticPotential: t.pathology,
      clinicalAction: t.action,
      speechText: t.speech,
      phoneticText: t.phonetic,
    };
  };

  const currentRisk = getRiskProfile(selectedLang);

  // Fallback to browser SpeechSynthesis if audio stream is unavailable
  const fallbackSpeechSynthesis = (lang: SupportedLanguage) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const riskData = getRiskProfile(lang);
    const langOption = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

    // If Hindi/Telugu/Tamil without native voice, speak phonetic English if available
    const hasIndicVoice = window.speechSynthesis
      .getVoices()
      .some((v) => v.lang.toLowerCase().startsWith(lang));
    const textToSpeak = !hasIndicVoice && riskData.phoneticText ? riskData.phoneticText : riskData.speechText;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = rate;
    utterance.pitch = 1.0;
    utterance.lang = hasIndicVoice ? langOption.locale : 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const voiceMatch = voices.find((v) => v.lang.toLowerCase().startsWith(lang));
    if (voiceMatch) utterance.voice = voiceMatch;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Play audio via HTML5 Audio through the backend TTS endpoint
  const playSpeech = (lang: SupportedLanguage) => {
    // If paused, simply resume
    if (isPaused && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPaused(false);
        setIsPlaying(true);
      }).catch(() => fallbackSpeechSynthesis(lang));
      return;
    }

    // Stop any current audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const riskData = getRiskProfile(lang);
    const cleanBase = API_BASE_URL.replace(/\/$/, '');
    const audioUrl = `${cleanBase}/tts?lang=${encodeURIComponent(lang)}&text=${encodeURIComponent(
      riskData.speechText
    )}`;

    const audio = new Audio(audioUrl);
    audio.playbackRate = rate;

    audio.onplay = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    audio.onpause = () => {
      if (!audio.ended && audio.currentTime > 0) {
        setIsPaused(true);
      }
      setIsPlaying(false);
    };

    audio.onended = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setAudioProgress(0);
    };

    audio.ontimeupdate = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
        setAudioDuration(audio.duration);
      }
    };

    audio.onerror = (e) => {
      console.warn('[Audio Stream Error] Falling back to browser SpeechSynthesis:', e);
      fallbackSpeechSynthesis(lang);
    };

    audioRef.current = audio;
    audio.play().catch((err) => {
      console.warn('[Autoplay prevented/Network failure] Falling back to SpeechSynthesis:', err);
      fallbackSpeechSynthesis(lang);
    });
  };

  const handlePlay = () => {
    playSpeech(selectedLang);
  };

  const handlePause = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setAudioProgress(0);
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setSelectedLang(lang);
    if (isPlaying) {
      handleStop();
      setTimeout(() => {
        playSpeech(lang);
      }, 100);
    }
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  };

  const copyTranscript = () => {
    const textToCopy =
      scriptMode === 'phonetic' && currentRisk.phoneticText
        ? currentRisk.phoneticText
        : currentRisk.speechText;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-2xl border ${currentRisk.borderClass} bg-gradient-to-br ${currentRisk.bgClass} p-4 sm:p-5 shadow-lg backdrop-blur-md space-y-4 transition-all duration-300 ${className}`}
    >
      {/* Top Header Bar with Language Base Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
            <Volume2 className="w-5 h-5 animate-pulse text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                Clinical AI Multilingual Voice Assistant
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentRisk.badgeClass}`}>
                {currentRisk.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Listen to diagnostic briefing in your preferred regional medical language (English, Hindi, Telugu, Tamil)
            </p>
          </div>
        </div>

        {/* 4-Language Base Switcher (English, Hindi, Telugu, Tamil) */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/90 self-start md:self-auto shadow-inner">
          <div className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <Languages className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Language:</span>
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang.code)}
                title={`Listen in ${lang.name} (${lang.nativeName})`}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-600/30 border border-cyan-400/30 scale-102'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span className="font-mono text-[10px] opacity-80">{lang.badge}</span>
                <span className="font-sans">{lang.nativeName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Controls Row: Play, Pause, Replay, Speed, Waveform & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-2 flex-wrap">
          {!isPlaying ? (
            <button
              type="button"
              onClick={handlePlay}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>
                {isPaused
                  ? 'Resume Audio'
                  : `Play in ${SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.nativeName}`}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePause}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/30 flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause Audio</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleStop}
            title="Replay from start"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed Rate Toggle */}
          <div className="flex items-center bg-slate-950/70 border border-slate-800 rounded-xl p-0.5 text-[11px] font-mono">
            {[0.9, 1.0, 1.2].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRateChange(r)}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  rate === r ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r}x
              </button>
            ))}
          </div>

          {/* Sound Wave Visualizer & Live Audio Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] font-mono text-cyan-400 font-bold mr-1 flex items-center gap-1">
              <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>{isPlaying ? 'STREAMING AUDIO' : isPaused ? 'PAUSED' : 'STUDIO READY'}</span>
            </span>
            <div className="flex items-end gap-0.5 h-3.5">
              <span
                className={`w-1 rounded-full bg-blue-500 transition-all ${
                  isPlaying ? 'h-3.5 animate-[bounce_0.6s_infinite]' : 'h-1.5'
                }`}
              />
              <span
                className={`w-1 rounded-full bg-cyan-400 transition-all ${
                  isPlaying ? 'h-2.5 animate-[bounce_0.4s_infinite]' : 'h-2'
                }`}
              />
              <span
                className={`w-1 rounded-full bg-emerald-400 transition-all ${
                  isPlaying ? 'h-3.5 animate-[bounce_0.7s_infinite]' : 'h-1'
                }`}
              />
              <span
                className={`w-1 rounded-full bg-indigo-400 transition-all ${
                  isPlaying ? 'h-2 animate-[bounce_0.5s_infinite]' : 'h-1.5'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Right side Transcript and Copy actions */}
        <div className="flex items-center gap-2">
          {/* Script Mode Toggle (Native vs English Phonetic for Hindi/Telugu/Tamil) */}
          {selectedLang !== 'en' && currentRisk.phoneticText && (
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-[10px] font-semibold">
              <button
                type="button"
                onClick={() => setScriptMode('native')}
                className={`px-2 py-1 rounded transition-colors ${
                  scriptMode === 'native'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Native Script
              </button>
              <button
                type="button"
                onClick={() => setScriptMode('phonetic')}
                className={`px-2 py-1 rounded transition-colors ${
                  scriptMode === 'phonetic'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Phonetic (ABC)
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowTranscript(!showTranscript)}
            className="text-[11px] font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 cursor-pointer"
          >
            <FileText className="w-3 h-3 text-cyan-400" />
            <span>{showTranscript ? 'Hide' : 'Transcript'}</span>
          </button>

          <button
            type="button"
            onClick={copyTranscript}
            title="Copy voice script"
            className="p-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-white cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Audio Progress Bar */}
      {audioProgress > 0 && isPlaying && (
        <div className="w-full bg-slate-950/80 rounded-full h-1 overflow-hidden border border-slate-800/60">
          <div
            className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 h-full transition-all duration-200 rounded-full"
            style={{ width: `${audioProgress}%` }}
          />
        </div>
      )}

      {/* Localized Transcript & Clinical Recommendation */}
      {showTranscript && (
        <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-3.5 space-y-2.5 animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 shrink-0 mt-0.5 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/60">
              {SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.nativeName}{' '}
              {scriptMode === 'phonetic' ? '(Phonetic)' : 'Script'}:
            </span>
            <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-normal">
              "{scriptMode === 'phonetic' && currentRisk.phoneticText ? currentRisk.phoneticText : currentRisk.speechText}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-[11px]">
            <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Pathology Assessment: </span>
                <span className="text-slate-300">{currentRisk.neoplasticPotential}</span>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Clinical Guideline: </span>
                <span className="text-slate-300">{currentRisk.clinicalAction}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
