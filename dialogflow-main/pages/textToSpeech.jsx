import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import axios from "axios";
import {GoMute} from 'react-icons/go'
import {BsFillMicFill, BsSend} from 'react-icons/bs'
import { AudioConfig, SpeechConfig, SpeechSynthesisOutputFormat, SpeechSynthesizer, PullAudioOutputStream } from 'microsoft-cognitiveservices-speech-sdk';
import { v4 as uuidv4 }  from 'uuid';
import TextDecoder from 'util';
import Link from 'next/link';

    //languages array
    export const languagesArr = [
      "af-ZA",
      "af-ZA",
      "am-ET",
      "am-ET",
      "ar-AE",
      "ar-AE",
      "ar-BH",
      "ar-BH",
      "ar-DZ",
      "ar-DZ",
      "ar-EG",
      "ar-EG",
      "ar-IQ",
      "ar-IQ",
      "ar-JO",
      "ar-JO",
      "ar-KW",
      "ar-KW",
      "ar-LB",
      "ar-LB",
      "ar-LY",
      "ar-LY",
      "ar-MA",
      "ar-MA",
      "ar-OM",
      "ar-OM",
      "ar-QA",
      "ar-QA",
      "ar-SA",
      "ar-SA",
      "ar-SY",
      "ar-SY",
      "ar-TN",
      "ar-TN",
      "ar-YE",
      "ar-YE",
      "az-AZ",
      "az-AZ",
      "bg-BG",
      "bg-BG",
      "bn-BD",
      "bn-BD",
      "bn-IN",
      "bn-IN",
      "bs-BA",
      "bs-BA",
      "ca-ES",
      "ca-ES",
      "ca-ES",
      "cs-CZ",
      "cs-CZ",
      "cy-GB",
      "cy-GB",
      "da-DK",
      "da-DK",
      "de-AT",
      "de-AT",
      "de-CH",
      "de-CH",
      "de-DE",
      "de-DE",
      "de-DE",
      "de-DE",
      "de-DE",
      "de-DE",
      "de-DE",
      "de-DE",
      "de-DE",
      "de-DE",
      "de-DE",
      "de-DE",
      "de-DE",
      "de-DE",
      "de-DE",
      "el-GR",
      "el-GR",
      "en-AU",
      "en-AU",
      "en-AU",
      "en-AU",
      "en-AU",
      "en-AU",
      "en-AU",
      "en-AU",
      "en-AU",
      "en-AU",
      "en-AU",
      "en-AU",
      "en-AU",
      "en-AU",
      "en-CA",
      "en-CA",
      "en-GB",
      "en-GB",
      "en-GB",
      "en-GB",
      "en-GB",
      "en-GB",
      "en-GB",
      "en-GB",
      "en-GB",
      "en-GB",
      "en-GB",
      "en-GB",
      "en-GB",
      "en-HK",
      "en-HK",
      "en-IE",
      "en-IE",
      "en-IN",
      "en-IN",
      "en-KE",
      "en-KE",
      "en-NG",
      "en-NG",
      "en-NZ",
      "en-NZ",
      "en-PH",
      "en-PH",
      "en-SG",
      "en-SG",
      "en-TZ",
      "en-TZ",
      "en-US",
      "en-US",
      "en-US",
      "en-US",
      "en-US",
      "en-US",
      "en-US",
      "en-US",
      "en-US",
      "en-US",
      "en-US",
      "en-US",
      "en-US",
      "en-US",
      "en-US",
      "en-US",
      "en-US",
      "en-US",
      "en-ZA",
      "en-ZA",
      "es-AR",
      "es-BO",
      "es-CL",
      "es-CO",
      "es-CR",
      "es-CU",
      "es-DO",
      "es-EC",
      "es-ES",
      "es-GQ",
      "es-GT",
      "es-HN",
      "es-MX",
      "es-NI",
      "es-PA",
      "es-PE",
      "es-PR",
      "es-PY",
      "es-SV",
      "es-US",
      "es-UY",
      "es-VE",
      "et-EE",
      "eu-ES",
      "fa-IR",
      "fi-FI",
      "fil-PH",
      "fr-BE",
      "fr-CA",
      "fr-CH",
      "fr-FR",
      "ga-IE",
      "gl-ES",
      "gu-IN",
      "he-IL",
      "hi-IN",
      "hr-HR",
      "hu-HU",
      "hy-AM",
      "id-ID",
      "is-IS",
      "it-IT",
      "ja-JP",
      "jv-ID",
      "ka-GE",
      "kk-KZ",
      "km-KH",
      "kn-IN",
      "ko-KR",
      "lo-LA",
      "lt-LT",
      "lv-LV",
      "mk-MK",
      "ml-IN",
      "mn-MN",
      "mr-IN",
      "mn-MN",
      "mn-MN",
      "mr-IN",
      "mr-IN",
      "ms-MY",
      "ms-MY",
      "mt-MT",
      "mt-MT",
      "my-MM",
      "my-MM",
      "nb-NO",
      "nb-NO",
      "nb-NO",
      "ne-NP",
      "ne-NP",
      "nl-BE",
      "nl-BE",
      "nl-NL",
      "nl-NL",
      "nl-NL",
      "pl-PL",
      "pl-PL",
      "pl-PL",
      "ps-AF",
      "ps-AF",
      "pt-BR",
      "pt-BR",
      "pt-BR",
      "pt-BR",
      "pt-BR",
      "pt-BR",
      "pt-BR",
      "pt-BR",
      "pt-BR",
      "pt-BR",
      "pt-BR",
      "pt-BR",
      "pt-BR",
      "pt-BR",
      "pt-BR",
      "pt-PT",
      "pt-PT",
      "pt-PT",
      "ro-RO",
      "ro-RO",
      "ru-RU",
      "ru-RU",
      "ru-RU",
      "si-LK",
      "si-LK",
      "sk-SK",
      "sk-SK",
      "sl-SI",
      "sl-SI",
      "so-SO",
      "so-SO",
      "sq-AL",
      "sq-AL",
      "sr-RS",
      "sr-RS",
      "su-ID",
      "su-ID",
      "sv-SE",
      "sv-SE",
      "sv-SE",
      "sw-KE",
      "sw-KE",
      "sw-TZ",
      "sw-TZ",
      "ta-IN",
      "ta-IN",
      "ta-LK",
      "ta-LK",
      "ta-MY",
      "ta-MY",
      "ta-SG",
      "ta-SG",
      "te-IN",
      "te-IN",
      "th-TH",
      "th-TH",
      "th-TH",
      "tr-TR",
      "tr-TR",
      "uk-UA",
      "uk-UA",
      "ur-IN",
      "ur-IN",
      "ur-PK",
      "ur-PK",
      "uz-UZ",
      "uz-UZ",
      "vi-VN",
      "vi-VN",
      "wuu-CN",
      "wuu-CN",
      "yue-CN",
      "yue-CN",
      "zh-CN",
      "zh-CN",
      "zh-CN",
      "zh-CN",
      "zh-CN",
      "zh-CN",
      "zh-CN",
      "zh-CN",
      "zh-CN",
      "zh-CN",
      "zh-CN",
      "zh-CN",
      "zh-CN",
      "zh-CN",
      "zh-CN",
      "zh-CN",
      "zh-CN",
      "zh-CN",
      "zh-CN",
      "zh-CN",
      "zh-CN",
      "zh-CN",
      "zh-HK",
      "zh-HK",
      "zh-HK",
      "zh-TW",
      "zh-TW",
      "zh-TW",
      "zu-ZA",
      "zu-ZA"
      
      
];
    
    //voice select 
    export const voicesArr =  [
      "af-ZA-AdriNeural",
      "af-ZA-WillemNeural",
      "am-ET-AmehaNeural",
      "am-ET-MekdesNeural",
      "ar-AE-FatimaNeural",
      "ar-AE-HamdanNeural",
      "ar-BH-AliNeural",
      "ar-BH-LailaNeural",
      "ar-DZ-AminaNeural",
      "ar-DZ-IsmaelNeural",
      "ar-EG-SalmaNeural",
      "ar-EG-ShakirNeural",
      "ar-IQ-BasselNeural",
      "ar-IQ-RanaNeural",
      "ar-JO-SanaNeural",
      "ar-JO-TaimNeural",
      "ar-KW-FahedNeural",
      "ar-KW-NouraNeural",
      "ar-LB-LaylaNeural",
      "ar-LB-RamiNeural",
      "ar-LY-ImanNeural",
      "ar-LY-OmarNeural",
      "ar-MA-JamalNeural",
      "ar-MA-MounaNeural",
      "ar-OM-AbdullahNeural",
      "ar-OM-AyshaNeural",
      "ar-QA-AmalNeural",
      "ar-QA-MoazNeural",
      "ar-SA-HamedNeural",
      "ar-SA-ZariyahNeural",
      "ar-SY-AmanyNeural",
      "ar-SY-LaithNeural",
      "ar-TN-HediNeural",
      "ar-TN-ReemNeural",
      "ar-YE-MaryamNeural",
      "ar-YE-SalehNeural",
      "az-AZ-BabekNeural",
      "az-AZ-BanuNeural",
      "bg-BG-BorislavNeural",
      "bg-BG-KalinaNeural",
      "bn-BD-NabanitaNeural",
      "bn-BD-PradeepNeural",
      "bn-IN-BashkarNeural",
      "bn-IN-TanishaaNeural",
      "bs-BA-GoranNeural",
      "bs-BA-VesnaNeural",
      "ca-ES-AlbaNeural",
      "ca-ES-EnricNeural",
      "ca-ES-JoanaNeural",
      "cs-CZ-AntoninNeural",
      "cs-CZ-VlastaNeural",
      "cy-GB-AledNeural",
      "cy-GB-NiaNeural",
      "da-DK-ChristelNeural",
      "da-DK-JeppeNeural",
      "de-AT-IngridNeural",
      "de-AT-JonasNeural",
      "de-CH-JanNeural",
      "de-CH-LeniNeural",
      "de-DE-AmalaNeural",
      "de-DE-BerndNeural",
      "de-DE-ChristophNeural",
      "de-DE-ConradNeural1",
      "de-DE-ElkeNeural",
      "de-DE-GiselaNeural",
      "de-DE-KasperNeural",
      "de-DE-KatjaNeural",
      "de-DE-KillianNeural",
      "de-DE-KlarissaNeural",
      "de-DE-KlausNeural",
      "de-DE-LouisaNeural",
      "de-DE-MajaNeural",
      "de-DE-RalfNeural",
      "de-DE-TanjaNeural",
      "el-GR-AthinaNeural",
      "el-GR-NestorasNeural",
      "en-AU-AnnetteNeural",
      "en-AU-CarlyNeural",
      "en-AU-DarrenNeural",
      "en-AU-DuncanNeural",
      "en-AU-ElsieNeural",
      "en-AU-FreyaNeural",
      "en-AU-JoanneNeural",
      "en-AU-KenNeural",
      "en-AU-KimNeural",
      "en-AU-NatashaNeural",
      "en-AU-NeilNeural",
      "en-AU-TimNeural",
      "en-AU-TinaNeural",
      "en-AU-WilliamNeural",
      "en-CA-ClaraNeural",
      "en-CA-LiamNeural",
      "en-GB-AbbiNeural",
      "en-GB-AlfieNeural",
      "en-GB-BellaNeural",
      "en-GB-ElliotNeural",
      "en-GB-EthanNeural",
      "en-GB-HollieNeural",
      "en-GB-LibbyNeural",
      "en-GB-MaisieNeural",
      "en-GB-NoahNeural",
      "en-GB-OliverNeural",
      "en-GB-OliviaNeural",
      "en-GB-RyanNeural",
      "en-GB-SoniaNeural",
      "en-GB-ThomasNeural",
      "en-HK-SamNeural",
      "en-HK-YanNeural",
      "en-IE-ConnorNeural",
      "en-IE-EmilyNeural",
      "en-IN-NeerjaNeural",
      "en-IN-PrabhatNeural",
      "en-KE-AsiliaNeural",
      "en-KE-ChilembaNeural",
      "en-NG-AbeoNeural",
      "en-NG-EzinneNeural",
      "en-NZ-MitchellNeural",
      "en-NZ-MollyNeural",
      "en-PH-JamesNeural",
      "en-PH-RosaNeural",
      "en-SG-LunaNeural",
      "en-SG-WayneNeural",
      "en-TZ-ElimuNeural",
      "en-TZ-ImaniNeural",
      "en-US-AIGenerate1Neural1",
      "en-US-AIGenerate2Neural1",
      "en-US-AmberNeural",
      "en-US-AnaNeural",
      "en-US-AriaNeural",
      "en-US-AshleyNeural",
      "en-US-BrandonNeural",
      "en-US-ChristopherNeural",
      "en-US-CoraNeural",
      "en-US-DavisNeural",
      "en-US-ElizabethNeural",
      "en-US-EricNeural",
      "en-US-GuyNeural",
      "en-US-JacobNeural",
      "en-US-JaneNeural",
      "en-US-JasonNeural",
      "en-US-JennyMultilingualNeural3",
      "en-US-JennyNeural",
      "en-US-MichelleNeural",
      "en-US-MonicaNeural",
      "en-US-NancyNeural",
      "en-US-RogerNeural",
      "en-US-SaraNeural",
      "en-US-SteffanNeural",
      "en-US-TonyNeural",
      "en-ZA-LeahNeural",
      "en-ZA-LukeNeural",
      "es-AR-ElenaNeural (Female)",
      "es-AR-TomasNeural (Male)",
      "es-BO-MarceloNeural (Male)",
      "es-BO-SofiaNeural (Female)",
      "es-CL-CatalinaNeural (Female)",
      "es-CL-LorenzoNeural (Male)",
      "es-CO-GonzaloNeural (Male)",
      "es-CO-SalomeNeural (Female)",
      "es-CR-JuanNeural (Male)",
      "es-CR-MariaNeural (Female)",
      "es-CU-BelkysNeural (Female)",
      "es-CU-ManuelNeural (Male)",
      "es-DO-EmilioNeural (Male)",
      "es-DO-RamonaNeural (Female)",
      "es-EC-AndreaNeural (Female)",
      "es-EC-LuisNeural (Male)",
      "es-ES-AbrilNeural (Female)",
      "es-ES-AlvaroNeural1 (Male)",
      "es-ES-ArnauNeural (Male)",
      "es-ES-DarioNeural (Male)",
      "es-ES-EliasNeural (Male)",
      "es-ES-ElviraNeural (Female)",
      "es-ES-EstrellaNeural (Female)",
      "es-ES-IreneNeural (Female)",
      "es-ES-LaiaNeural (Female)",
      "es-ES-LiaNeural (Female)",
      "es-ES-NilNeural (Male)",
      "es-ES-SaulNeural (Male)",
      "es-ES-TeoNeural (Male)",
      "es-ES-TrianaNeural (Female)",
      "es-ES-VeraNeural (Female)",
      "es-GQ-JavierNeural (Male)",
      "es-GQ-TeresaNeural (Female)",
      "es-GT-AndresNeural (Male)",
      "es-GT-MartaNeural (Female)",
      "es-HN-CarlosNeural (Male)",
      "es-HN-KarlaNeural (Female)",
      "es-MX-BeatrizNeural (Female)",
      "es-MX-CandelaNeural (Female)",
      "es-MX-CarlotaNeural (Female)",
      "es-MX-CecilioNeural (Male)",
      "es-MX-DaliaNeural (Female)",
      "es-MX-GerardoNeural (Male)",
      "es-MX-JorgeNeural (Male)",
      "es-MX-LarissaNeural (Female)",
      "es-MX-LibertoNeural (Male)",
      "es-MX-LucianoNeural (Male)",
      "es-MX-MarinaNeural (Female)",
      "es-MX-NuriaNeural (Female)",
      "es-MX-PelayoNeural (Male)",
      "es-MX-RenataNeural (Female)",
      "es-MX-YagoNeural (Male)",
      "es-NI-FedericoNeural (Male)",
      "es-NI-YolandaNeural (Female)",
      "es-PA-MargaritaNeural (Female)",
      "es-PA-RobertoNeural (Male)",
      "es-PE-AlexNeural (Male)",
      "es-PE-CamilaNeural (Female)",
      "es-PR-KarinaNeural (Female)",
      "es-PR-VictorNeural (Male)",
      "es-PY-MarioNeural (Male)",
      "es-PY-TaniaNeural (Female)",
      "es-SV-LorenaNeural (Female)",
      "es-SV-RodrigoNeural (Male)",
      "es-US-AlonsoNeural (Male)",
      "es-US-PalomaNeural (Female)",
      "es-UY-MateoNeural (Male)",
      "es-UY-ValentinaNeural (Female)",
      "es-VE-PaolaNeural (Female)",
      "es-VE-SebastianNeural (Male)",
      "et-EE-AnuNeural2 (Female)",
      "et-EE-KertNeural2 (Male)",
      "eu-ES-AinhoaNeural2 (Female)",
      "eu-ES-AnderNeural2 (Male)",
      "fa-IR-DilaraNeural2 (Female)",
      "fa-IR-FaridNeural2 (Male)",
      "fi-FI-HarriNeural (Male)",
      "fi-FI-NooraNeural (Female)",
      "fi-FI-SelmaNeural (Female)",
      "fil-PH-AngeloNeural2 (Male)",
      "fil-PH-BlessicaNeural2 (Female)",
      "fr-BE-CharlineNeural (Female)",
      "fr-BE-GerardNeural (Male)",
      "fr-CA-AntoineNeural (Male)",
      "fr-CA-JeanNeural (Male)",
      "fr-CA-SylvieNeural (Female)",
      "fr-CH-ArianeNeural (Female)",
      "fr-CH-FabriceNeural (Male)",
      "fr-FR-AlainNeural (Male)",
      "fr-FR-BrigitteNeural (Female)",
      "fr-FR-CelesteNeural (Female)",
      "fr-FR-ClaudeNeural (Male)",
      "fr-FR-CoralieNeural (Female)",
      "fr-FR-DeniseNeural1 (Female)",
      "fr-FR-EloiseNeural (Female, Child)",
      "fr-FR-HenriNeural (Male)",
      "fr-FR-JacquelineNeural (Female)",
      "fr-FR-JeromeNeural (Male)",
      "fr-FR-JosephineNeural (Female)",
      "fr-FR-MauriceNeural (Male)",
      "fr-FR-YvesNeural (Male)",
      "fr-FR-YvetteNeural (Female)",
      "ga-IE-ColmNeural2 (Male)",
      "ga-IE-OrlaNeural2 (Female)",
      "gl-ES-RoiNeural2 (Male)",
      "gl-ES-SabelaNeural2 (Female)",
      "gu-IN-DhwaniNeural (Female)",
      "gu-IN-NiranjanNeural (Male)",
      "he-IL-AvriNeural (Male)",
      "he-IL-HilaNeural (Female)",
      "hi-IN-MadhurNeural (Male)",
      "hi-IN-SwaraNeural (Female)",
      "hr-HR-GabrijelaNeural (Female)",
      "hr-HR-SreckoNeural (Male)",
      "hu-HU-NoemiNeural (Female)",
      "hu-HU-TamasNeural (Male)",
      "hy-AM-AnahitNeural2 (Female)",
      "hy-AM-HaykNeural2 (Male)",
      "id-ID-ArdiNeural (Male)",
      "id-ID-GadisNeural (Female)",
      "is-IS-GudrunNeural2 (Female)",
      "is-IS-GunnarNeural2 (Male)",
      "it-IT-BenignoNeural (Male)",
      "it-IT-CalimeroNeural (Male)",
      "it-IT-CataldoNeural (Male)",
      "it-IT-DiegoNeural1 (Male)",
      "it-IT-ElsaNeural (Female)",
      "it-IT-FabiolaNeural (Female)",
      "it-IT-FiammaNeural (Female)",
      "it-IT-GianniNeural (Male)",
      "it-IT-ImeldaNeural (Female)",
      "it-IT-IrmaNeural (Female)",
      "it-IT-IsabellaNeural (Female)",
      "it-IT-LisandroNeural (Male)",
      "it-IT-PalmiraNeural (Female)",
      "it-IT-PierinaNeural (Female)",
      "it-IT-RinaldoNeural (Male)",
      "ja-JP-AoiNeural (Female)", 
      "ja-JP-DaichiNeural (Male)",
      "ja-JP-KeitaNeural (Male)",
      "ja-JP-MayuNeural (Female)",
      "ja-JP-NanamiNeural (Female)",
      "ja-JP-NaokiNeural (Male)",
      "ja-JP-ShioriNeural (Female)",
      "jv-ID-DimasNeural2 (Male)",
      "jv-ID-SitiNeural2 (Female)",
      "ka-GE-EkaNeural2 (Female)",
      "ka-GE-GiorgiNeural2 (Male)",
      "kk-KZ-AigulNeural2 (Female)",
      "kk-KZ-DauletNeural2 (Male)",
      "km-KH-PisethNeural2 (Male)",
      "km-KH-SreymomNeural2 (Female)",
      "kn-IN-GaganNeural2 (Male)",
      "kn-IN-SapnaNeural2 (Female)",
      "ko-KR-BongJinNeural1 (Male)",
      "ko-KR-GookMinNeural1 (Male)",
      "ko-KR-InJoonNeural (Male)",
      "ko-KR-JiMinNeural1 (Female)",
      "ko-KR-SeoHyeonNeural1 (Female)",
      "ko-KR-SoonBokNeural1 (Female)",
      "ko-KR-SunHiNeural (Female)",
      "ko-KR-YuJinNeural1 (Female)",
      "lo-LA-ChanthavongNeural2 (Male)",
      "lo-LA-KeomanyNeural2 (Female)",
      "lt-LT-LeonasNeural2 (Male)",
      "lt-LT-OnaNeural2 (Female)",
      "lv-LV-EveritaNeural2 (Female)",
      "lv-LV-NilsNeural2 (Male)",
      "mk-MK-AleksandarNeural2 (Male)",
      "mk-MK-MarijaNeural2 (Female)",
      "ml-IN-AarohiNeural (Female)",
      "ml-IN-ManoharNeural (Male)",
      "mn-MN-BataaNeural",
      "mn-MN-YesuiNeural",
      "mr-IN-AarohiNeural",
      "mr-IN-ManoharNeural",
      "ms-MY-OsmanNeural",
      "ms-MY-YasminNeural",
      "mt-MT-GraceNeural",
      "mt-MT-JosephNeural",
      "my-MM-NilarNeural",
      "my-MM-ThihaNeural",
      "nb-NO-FinnNeural",
      "nb-NO-IselinNeural",
      "nb-NO-PernilleNeural",
      "ne-NP-HemkalaNeural",
      "ne-NP-SagarNeural",
      "nl-BE-ArnaudNeural",
      "nl-BE-DenaNeural",
      "nl-NL-ColetteNeural",
      "nl-NL-FennaNeural1",
      "nl-NL-MaartenNeural1",
      "pl-PL-AgnieszkaNeural",
      "pl-PL-MarekNeural",
      "pl-PL-ZofiaNeural",
      "ps-AF-GulNawazNeural",
      "ps-AF-LatifaNeural",
      "pt-BR-AntonioNeural",
      "pt-BR-BrendaNeural",
      "pt-BR-DonatoNeural",
      "pt-BR-ElzaNeural",
      "pt-BR-FabioNeural",
      "pt-BR-FranciscaNeural",
      "pt-BR-GiovannaNeural",
      "pt-BR-HumbertoNeural",
      "pt-BR-JulioNeural",
      "pt-BR-LeilaNeural",
      "pt-BR-LeticiaNeural",
      "pt-BR-ManuelaNeural",
      "pt-BR-NicolauNeural",
      "pt-BR-ValerioNeural",
      "pt-BR-YaraNeural",
      "pt-PT-DuarteNeural",
      "pt-PT-FernandaNeural",
      "pt-PT-RaquelNeural",
      "ro-RO-AlinaNeural",
      "ro-RO-EmilNeural",
      "ru-RU-DariyaNeural",
      "ru-RU-DmitryNeural",
      "ru-RU-SvetlanaNeural",
      "si-LK-SameeraNeural",
      "si-LK-ThiliniNeural",
      "sk-SK-LukasNeural",
      "sk-SK-ViktoriaNeural",
      "sl-SI-PetraNeural",
      "sl-SI-RokNeural",
      "so-SO-MuuseNeural",
      "so-SO-UbaxNeural",
      "sq-AL-AnilaNeural",
      "sq-AL-IlirNeural",
      "sr-RS-NicholasNeural",
      "sr-RS-SophieNeural",
      "su-ID-JajangNeural",
      "su-ID-TutiNeural",
      "sv-SE-HilleviNeural",
      "sv-SE-MattiasNeural",
      "sv-SE-SofieNeural",
      "sw-KE-RafikiNeural",
      "sw-KE-ZuriNeural",
      "sw-TZ-DaudiNeural",
      "sw-TZ-RehemaNeural",
      "ta-IN-PallaviNeural",
      "ta-IN-ValluvarNeural",
      "ta-LK-KumarNeural",
      "ta-LK-SaranyaNeural",
      "ta-MY-KaniNeural",
      "ta-MY-SuryaNeural",
      "ta-SG-AnbuNeural",
      "ta-SG-VenbaNeural",
      "te-IN-MohanNeural",
      "te-IN-ShrutiNeural",
      "th-TH-AcharaNeural",
      "th-TH-NiwatNeural",
      "th-TH-PremwadeeNeural",
      "tr-TR-AhmetNeural",
      "tr-TR-EmelNeural",
      "uk-UA-OstapNeural",
      "uk-UA-PolinaNeural",
      "ur-IN-GulNeural",
      "ur-IN-SalmanNeural",
      "ur-PK-AsadNeural",
      "ur-PK-UzmaNeural",
      "uz-UZ-MadinaNeural",
      "uz-UZ-SardorNeural",
      "vi-VN-HoaiMyNeural",
      "vi-VN-NamMinhNeural",
      "wuu-CN-XiaotongNeural1,",
      "wuu-CN-YunzheNeural1,",
      "yue-CN-XiaoMinNeural1,",
      "yue-CN-YunSongNeural1,",
      "zh-CN-XiaochenNeural",
      "zh-CN-XiaohanNeural",
      "zh-CN-XiaomengNeural",
      "zh-CN-XiaomoNeural",
      "zh-CN-XiaoqiuNeural",
      "zh-CN-XiaoruiNeural",
      "zh-CN-XiaoshuangNeural",
      "zh-CN-XiaoxiaoNeural",
      "zh-CN-XiaoxuanNeural",
      "zh-CN-XiaoyanNeural",
      "zh-CN-XiaoyiNeural",
      "zh-CN-XiaoyouNeural",
      "zh-CN-XiaozhenNeural",
      "zh-CN-YunfengNeural",
      "zh-CN-YunhaoNeural",
      "zh-CN-YunjianNeural",
      "zh-CN-YunxiaNeural",
      "zh-CN-YunxiNeural",
      "zh-CN-YunyangNeural",
      "zh-CN-YunyeNeural",
      "zh-CN-YunzeNeural",
      "zh-CN-henan-YundengNeural",
      "zh-CN-liaoning-XiaobeiNeural1,",
      "zh-CN-shaanxi-XiaoniNeural1,",
      "zh-CN-shandong-YunxiangNeural",
      "zh-CN-sichuan-YunxiNeural1,",
      "zh-HK-HiuGaaiNeural",
      "zh-HK-HiuMaanNeural",
      "zh-HK-WanLungNeural1",
      "zh-TW-HsiaoChenNeural",
      "zh-TW-HsiaoYuNeural",
      "zh-TW-YunJheNeural",
      "zu-ZA-ThandoNeural",
      "zu-ZA-ThembaNeural2"
] 
    //elevenlabs languages
    const elevenlabsLanguages = ['English', 'German', 'Polish', 'Spanish', 'Italian', 'French', 'Portuguese', 'Hindi'];

    //elevenlabs voices
    const elevenlabsVoices = [
      {
        voice_id: "21m00Tcm4TlvDq8ikWAM",
        name: "Rachel",
        samples: null,
        category: "premade",
        fine_tuning: {
          model_id: null,
          language: null,
          is_allowed_to_fine_tune: false,
          fine_tuning_requested: false,
          finetuning_state: "not_started",
          verification_attempts: null,
          verification_failures: [],
          verification_attempts_count: 0,
          slice_ids: null,
          manual_verification: null,
          manual_verification_requested: false
        },
        labels: {},
        description: null,
        preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/21m00Tcm4TlvDq8ikWAM/6edb9076-c3e4-420c-b6ab-11d43fe341c8.mp3",
        available_for_tiers: [],
        settings: null,
        sharing: null
      },
      {
        voice_id: "AZnzlk1XvdvUeBnXmlld",
        name: "Domi",
        samples: null,
        category: "premade",
        fine_tuning: {
          model_id: null,
          language: null,
          is_allowed_to_fine_tune: false,
          fine_tuning_requested: false,
          finetuning_state: "not_started",
          verification_attempts: null,
          verification_failures: [],
          verification_attempts_count: 0,
          slice_ids: null,
          manual_verification: null,
          manual_verification_requested: false
        },
        labels: {},
        description: null,
        preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/AZnzlk1XvdvUeBnXmlld/69c5373f-0dc2-4efd-9232-a0140182c0a9.mp3",
        available_for_tiers: [],
        settings: null,
        sharing: null
      },
      {
        voice_id: "EXAVITQu4vr4xnSDxMaL",
        name: "Bella",
        samples: null,
        category: "premade",
        fine_tuning: {
          model_id: null,
          language: null,
          is_allowed_to_fine_tune: false,
          fine_tuning_requested: false,
          finetuning_state: "not_started",
          verification_attempts: null,
          verification_failures: [],
          verification_attempts_count: 0,
          slice_ids: null,
          manual_verification: null,
          manual_verification_requested: false
        },
        labels: {},
        description: null,
        preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/04365bce-98cc-4e99-9f10-56b60680cda9.mp3",
        available_for_tiers: [],
        settings: null,
        sharing: null
      },
      {
        voice_id: "ErXwobaYiN019PkySvjV",
        name: "Antoni",
        samples: null,
        category: "premade",
        fine_tuning: {
          model_id: null,
          language: null,
          is_allowed_to_fine_tune: false,
          fine_tuning_requested: false,
          finetuning_state: "not_started",
          verification_attempts: null,
          verification_failures: [],
          verification_attempts_count: 0,
          slice_ids: null,
          manual_verification: null,
          manual_verification_requested: false
        },
        labels: {},
        description: null,
        preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/ErXwobaYiN019PkySvjV/38d8f8f0-1122-4333-b323-0b87478d506a.mp3",
        available_for_tiers: [],
        settings: null,
        sharing: null
      },
      {
        voice_id: "MF3mGyEYCl7XYWbV9V6O",
        name: "Elli",
        samples: null,
        category: "premade",
        fine_tuning: {
          model_id: null,
          language: null,
          is_allowed_to_fine_tune: false,
          fine_tuning_requested: false,
          finetuning_state: "not_started",
          verification_attempts: null,
          verification_failures: [],
          verification_attempts_count: 0,
          slice_ids: null,
          manual_verification: null,
          manual_verification_requested: false
        },
        labels: {},
        description: null,
        preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/MF3mGyEYCl7XYWbV9V6O/f9fd64c3-5d62-45cd-b0dc-ad722ee3284e.mp3",
        available_for_tiers: [],
        settings: null,
        sharing: null
      },
      {
        voice_id: "TxGEqnHWrfWFTfGW9XjX",
        name: "Josh",
        samples: null,
        category: "premade",
        fine_tuning: {
          model_id: null,
          language: null,
          is_allowed_to_fine_tune: false,
          fine_tuning_requested: false,
          finetuning_state: "not_started",
          verification_attempts: null,
          verification_failures: [],
          verification_attempts_count: 0,
          slice_ids: null,
          manual_verification: null,
          manual_verification_requested: false
        },
        labels: {},
        description: null,
        preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/TxGEqnHWrfWFTfGW9XjX/c6c80dcd-5fe5-4a4c-a74c-b3fec4c62c67.mp3",
        available_for_tiers: [],
        settings: null,
        sharing: null
      },
      {
        voice_id: "VR6AewLTigWG4xSOukaG",
        name: "Arnold",
        samples: null,
        category: "premade",
        fine_tuning: {
          model_id: null,
          language: null,
          is_allowed_to_fine_tune: false,
          fine_tuning_requested: false,
          finetuning_state: "not_started",
          verification_attempts: null,
          verification_failures: [],
          verification_attempts_count: 0,
          slice_ids: null,
          manual_verification: null,
          manual_verification_requested: false
        },
        labels: {},
        description: null,
        preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/VR6AewLTigWG4xSOukaG/66e83dc2-6543-4897-9283-e028ac5ae4aa.mp3",
        available_for_tiers: [],
        settings: null,
        sharing: null
      },
      {
        voice_id: "pNInz6obpgDQGcFmaJgB",
        name: "Adam",
        samples: null,
        category: "premade",
        fine_tuning: {
          model_id: null,
          language: null,
          is_allowed_to_fine_tune: false,
          fine_tuning_requested: false,
          finetuning_state: "not_started",
          verification_attempts: null,
          verification_failures: [],
          verification_attempts_count: 0,
          slice_ids: null,
          manual_verification: null,
          manual_verification_requested: false
        },
        labels: {},
        description: null,
        preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/pNInz6obpgDQGcFmaJgB/e0b45450-78db-49b9-aaa4-d5358a6871bd.mp3",
        available_for_tiers: [],
        settings: null,
        sharing: null
      },
      {
        voice_id: "yoZ06aMxZJJ28mfd3POQ",
        name: "Sam",
        samples: null,
        category: "premade",
        fine_tuning: {
          model_id: null,
          language: null,
          is_allowed_to_fine_tune: false,
          fine_tuning_requested: false,
          finetuning_state: "not_started",
          verification_attempts: null,
          verification_failures: [],
          verification_attempts_count: 0,
          slice_ids: null,
          manual_verification: null,
          manual_verification_requested: false
        },
        labels: {},
        description: null,
        preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/yoZ06aMxZJJ28mfd3POQ/1c4d417c-ba80-4de8-874a-a1c57987ea63.mp3",
        available_for_tiers: [],
        settings: null,
        sharing: null
      }
    ];


//gender array
export const genderArr = [
  "Male",
  "Female"
]
export default function TextToSpeech() {
    //refs
    const widRef = useRef({});
    const videoContentsRef = useRef([])
    //states
    const [selectedLang, setSelectedLang] = useState("")
    const [selectedVoice, setSelectedVoice] = useState("")
    const [useElevenlabs, setUseElevenlabs] = useState(false)
    
  
    let videoContents = videoContentsRef.current;

    let isPlaying = false;
    let isTranscribing = false;
    //text to speech script
    const [languages, setlanguages] = useState(languagesArr)
    const [voices, setvoices] = useState( voicesArr)
        
    
    //text to .mp3 script 
    
    
    
    function playVideo() {
      widRef.current['replay-buton'] = widRef.current['replay-buton'];
      widRef.current['transcribe-buton'] = widRef.current['transcribe-buton']
      widRef.current['video-player'].muted = false;
      widRef.current['video-player']?.play();
      isPlaying = true;

      console.log(widRef.current['replay-buton'],widRef.current['replay-buton'])

      widRef.current['replay-buton']&&(widRef.current['replay-buton'].style.display = 'none');
      widRef.current['transcribe-buton']&&(widRef.current['transcribe-buton'].style.display = 'none');
      hideControls();
    }
    
    function pauseVideo() {
      widRef.current['replay-buton'] = widRef.current['replay-buton'];
      widRef.current['transcribe-buton'] = widRef.current['transcribe-buton']
      widRef.current['video-player']?.pause();
      isPlaying = false;
      console.log(widRef.current['replay-buton'],widRef.current['replay-buton'])
      widRef.current['replay-buton']&&(widRef.current['replay-buton'].style.display = 'flex');
      widRef.current['transcribe-buton']&&(widRef.current['transcribe-buton'].style.display = 'flex');
      showControls();
    }
    
    function togglePlayPause() {
      if (isPlaying) {
        pauseVideo();
      } else {
        playVideo();
      }
    }
    
    function changeVideo(e) {
      let videoSources = e.target.dataset.video.split(',');
    
      if (videoSources) {
        widRef.current['video-player']?.pause();
        widRef.current['video-player'].innerHTML = '';
        videoSources.forEach((source) => {
          let videoSource = document?.createElement('source');
          videoSource.src = source;
          videoSource.type = `video/${source.split('.').pop()}`;
          widRef.current['video-player']?.appendChild(videoSource);
        });
        widRef.current['video-player']?.load();
        isPlaying = false;
        widRef.current['replay-buton']&&(widRef.current['replay-buton'].style.display = 'none');
        widRef.current['transcribe-buton']&&(widRef.current['transcribe-buton'].style.display = 'none');
        hideTranscription();
        hideControls();
      }
    }
    
    function showControls() {
        if(widRef.current['video-controls']){
            widRef.current['video-controls'].style.display = 'flex';
        }
    }
    
    function hideControls() {
        if(widRef.current['video-controls']){
            widRef.current['video-controls'].style.display = 'none';
        }
    }
    
    function replayVideo() {
      widRef.current['video-player']&&(widRef.current['video-player'].currentTime = 0);
      playVideo();
    }
    //hide transcribe button onclick
    const hideTranscribeButtonOnClick = () =>{
        widRef.current['transcribe-buton']&&(widRef.current['transcribe-buton'].style.display = "none")
        widRef.current['transcribe-buton']?.classList.remove("hide");
        widRef.current['transcribe-buton']?.classList.add("show")
    }
    function toggleTranscription() {
      if (isTranscribing) {
        hideTranscription();
      } else {
        showTranscription();
      }
    }
    
    function showTranscription() {
        console.log("show transcription")
      isTranscribing = true;
      widRef.current['transcribe-enter'].style.display = 'block';
      widRef.current['transcribe-box'].style.display = 'block';
      widRef.current['transcribe-buton'].style.display = 'block';
      widRef.current['transcribe-inputt'].focus();
    }
    
    function hideTranscription() {
        console.log("hide transcription")
      isTranscribing = false;
      widRef.current['transcribe-box'].style.display = 'none';

      widRef.current['transcribe-buton'].style.display = 'none';
      widRef.current['transcribe-inputt'].value = '';
    }
    
    function handleVideoEnd() {
      pauseVideo();
      widRef.current['video-player']&&(widRef.current['video-player'].muted = true);
      widRef.current['replay-buton']&&(widRef.current['replay-buton'].style.display = 'block');
      widRef.current['transcribe-buton']&&(widRef.current['transcribe-buton'].style.display = 'block');
    }
    
    function handleVideoClick() {
      console.log("hello")
      if(!widRef.current['video-player']){
        widRef.current['video-player'] = widRef.current['video-player']
      }
      if(document&&widRef.current['video-player']){
        if (widRef.current['video-player']?.muted) {

          widRef.current['video-player'].muted = false;
          document.getElementById("muted-icon").style.display = "none"

          playVideo();
        } else {

          pauseVideo();
          widRef.current['video-player'].muted = true;
          //document.getElementById("muted-icon").style.display = "flex"
      
      
        }
      }
    }
    
    //handle input field changing
    function handleInputChange(e){
        console.log(e.target)
      if(e?.target?.textContent?.length>0){
        widRef.current['transcribe-mic'].style.display = "none"
        widRef.current['transcribe-enter'].style.display = "flex"
      }else{
        widRef.current['transcribe-mic'].style.display = "flex"
        widRef.current['transcribe-enter'].style.display = "none"
      }
    }
    
    function transcribeSpeech() {
      if (!isTranscribing) {
        return; // do not transcribe if not in transcription mode
      }
      
      // Check if speech recognition is supported by the browser
      if ('webkitSpeechRecognition' in window) {
        let recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;
    
        recognition.onstart = function() {
          widRef.current['transcribe-mic'].disabled = true;
          //remove hover effect to show image properly
          widRef.current['transcribe-mic'].classList.add("rem-hover")
          widRef.current['transcribe-mic'].innerHTML = `
            <i class="bi bi-mic-fill"></i>
          `
          //widRef.current['transcribe-mic'].style.backgroundImage = 'url("/public/icon-mic-recording.png")';
        };
    
        recognition.onresult = function(event) {
            console.log(event.results)
            widRef.current['transcribe-inputt'].value = event.results[0][0].transcript;
            widRef.current['transcribe-inputt'].innerHTML = event.results[0][0].transcript;
    
        };
    
        recognition.onerror = function(event) {
            console.log(event)
          console.error('Speech recognition error:', event.error);
        };
    
        recognition.onend = function() {
          widRef.current['transcribe-mic'].disabled = false;
          //remove hover effect to show text properly
          /*widRef.current['transcribe-mic'].classList.remove("rem-hover")
          widRef.current['transcribe-mic'].innerHTML = `
            Speak
          `*/
          widRef.current['transcribe-mic'].style.display = "none"
          widRef.current['transcribe-enter'].style.display = "flex"
          //widRef.current['transcribe-mic'].style.backgroundImage = 'url("/public/icon-mic-recording.png")';
        };
    
        recognition.start();
      } else {
        console.error('Speech recognition not supported by this browser');
      }
    }
    
    function saveTranscription() {
      const transcription = widRef.current['transcribe-inputt'].value || widRef.current['transcribe-inputt'].innerText ;
      // Code for saving the transcription to a variable or database goes here
      console.log(transcription); // log the transcription to the console for now
      widRef.current["resp"].innerHTML =`
        ${transcription} <br/>
        Whatsapp link : <a href="https://api.whatsapp.com/send?phone=212669388292&text=${encodeURIComponent(transcription)}" target = "_blank">Here!</a>
      `;
      //showing the transcribe button again
      widRef.current['transcribe-buton']&&(widRef.current['transcribe-buton'].style.display = "flex")
      widRef.current['transcribe-mic'].style.display = "flex";
      widRef.current['transcribe-enter'].style.display = "none"
      widRef.current['transcribe-inputt'].innerText  = ""
    
      hideTranscription();
    
    }
        
    async function sendTranscription(transcription) {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
    
      const body = { transcription };
      console.log("Request payload:", body);
    
      const options = {
        method: "POST",
        headers,
        mode: "cors",
        body: JSON.stringify(body),
      };
    
      try {
        widRef.current["resp"].textContent = "Sending request...";
        const response = await fetch("https://typedwebhook.tools/webhook/a47154e8-6dc7-4cd2-8ab2-959d3eb2dbf0", options);
    
        if (response.ok) {
          const data = await response.json();
          console.log("Response data:", data);
          widRef.current["resp"].textContent = JSON.stringify(data);
        } else {
          throw new Error("Network response was not ok.");
        }
      } catch (error) {
        console.error(error);
        widRef.current["resp"].textContent = `Error: ${error.message}`;
      }
    }
    
    function handleKeyPress(e) {
      if (e?.key === "Enter") {
        const transcription = widRef.current['transcribe-inputt'].value.trim();
        if (transcription) {
          sendTranscription(transcription);
        }
      }
    }
    
    //select change handler 
    const selectHandler = e=>{

      if(e.target.value?.length>0){
        if(e.target.name==="voice"){
          if(
            languages.filter(item=>
              (item.slice(0,5)) !== e.target.value.slice(0,5)).length>0
            ){
            setlanguages(
              languagesArr.filter(item=>
                (item.slice(0,5)) === e.target.value.slice(0,5)                
              )
              )
          }
          /*else{
            setvoices(voicesArr)
          }*/

          setSelectedVoice(e.target?.value)
          }else{
           if(
            voices.filter(item=>
              (item.slice(0,5)) !== e.target.value.slice(0,5)).length>0
            ){
             setvoices(
              voicesArr.filter(item=>
              (item.slice(0,5)) === e.target.value.slice(0,5))
            )
           }
           setSelectedLang(e.target?.value)
           /*else{
             setlanguages(languagesArr)
           }*/
          }
        }else{

          //initializing arrays once value === ""

          if(e.target.name==="voice"){
            setvoices(voicesArr)
            setSelectedVoice("")
          }else{
            setlanguages(languagesArr)
            setSelectedLang("")
          }
        }
    }

    console.log(useElevenlabs)
  return (
    <div>
        <Link
          href="/dialogflow"
          style={{
            position: "absolute",
            right: 10,
            top: 50,
          }}
        >
          dialogflow {">"}
        </Link>
      <div className="video-content-container">
        <div id="video1" className="video-content" onClick={(e)=>changeVideo(e)} ref={ref=>ref!==null&&(videoContentsRef.current.push(ref))} data-video="https://res.cloudinary.com/dv2okuwkb/video/upload/v1669729481/AI%20Clients/Thomas/vici1/Defaultgreeting_uajjsh.mp4">aaaaaaaaaa</div>
        <div id="video2" className="video-content" onClick={(e)=>changeVideo(e)} ref={ref=>ref!==null&&(videoContentsRef.current.push(ref))} data-video="https://res.cloudinary.com/dv2okuwkb/video/upload/v1669729479/AI%20Clients/Thomas/vici1/viciscans78place2_zofqjh.mp4">eeeeeee</div>
        <div id="video3" className="video-content" onClick={(e)=>changeVideo(e)} ref={ref=>ref!==null&&(videoContentsRef.current.push(ref))} data-video="https://res.cloudinary.com/dv2okuwkb/video/upload/v1669820132/AI%20Clients/Thomas/vici1/smake.mp4">sdfgsdfgsdf</div>
      </div>
      <div className="wrapper">
        <div className="text-to-speech">
          <div className="res-wrapper">
            <div className="typed" id="typed" >
              typed here
            </div>
            <div className="resp" id="resp" ref={ref=>ref!==null&&(widRef.current[ref.id]=ref)} >
                resp
            </div>
          </div>
          <div className="widget-container">
            <div className="video-container to-be-pushed-up">
              <div className="round-video-wrapper">
                <video id="video-player" onClick={()=>handleVideoClick()} onEnded={()=>handleVideoEnd()} ref={ref=>ref!==null&&(widRef.current[ref.id]=ref)} className="player" preload="auto" loop muted autoPlay >
                  <source src="https://res.cloudinary.com/dv2okuwkb/video/upload/v1669729481/AI%20Clients/Thomas/vici1/Defaultgreeting_uajjsh.mp4" type="video/mp4"/>
                </video>
                <GoMute
                     id="muted-icon" onClick={()=>handleVideoClick()} ref={ref=>ref!==null&&(widRef.current[ref.id]=ref)}
                />
              </div>
              
              <div className="video-overl">
                  <div id="replay-buton" onClick={()=>replayVideo()} className="buton hide" ref={ref=>ref!==null&&(widRef.current[ref.id]=ref)}>Replay</div>
                  <div id="transcribe-buton"  ref={ref=>ref!==null&&(widRef.current[ref.id]=ref)} onClick={()=>{toggleTranscription();hideTranscribeButtonOnClick()}} className="buton hide">Transcribe</div>
              </div>
              
              
              <div  id="below-video-pushing-it-up-when-Transcribe-buton-is-clicked">
                <div id="transcribe-box" className="transcribe-box hide" ref={ref=>ref!==null&&(widRef.current[ref.id]=ref)}>
                    <div className="inputt-wrapper">
                    <div className="mic-wrapper">
                        <div id="transcribe-inputt" onKeyDown={()=>handleKeyPress()} onInput={(e)=>handleInputChange(e)} ref={ref=>ref!==null&&(widRef.current[ref.id]=ref)} className="inputt" contentEditable="true" placeholder="Type or speak your transcription..."></div>
                    </div>
                    <button id="transcribe-mic" onClick={()=>transcribeSpeech()} ref={ref=>ref!==null&&(widRef.current[ref.id]=ref)} className="mic-buton rem-hover">
                        <BsFillMicFill/>
                    </button>
                    <button id="transcribe-enter" onClick={()=>saveTranscription()} ref={ref=>ref!==null&&(widRef.current[ref.id]=ref)} className="enter-buton">
                        <BsSend/>
                    </button>
                    </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
        
        <div className="text-to-file">
          <div className="text-to-file-wrapper">
            <select name="type_of_api" id="" className="type-of-api form-select" onChange={e=>setUseElevenlabs(e.target.value==="elevenlabs")}>
              <option value="azure">
                AzureTTs
              </option>
              <option value="elevenlabs">
                Elevenlabs
              </option>
            </select>
            <input type="text" className="form-control" id="text_to_mp3" placeholder="add your text here "/>
            <select name="language" id="language-select" className="form-select" 
            onChange=
            {e=>{
              e.target.value==="Male"?
              (setvoices(voices.filter(item=>!item.includes("Female") )))
              :(setvoices(voices.filter(item=>item.includes("Female") )))
            }
            } >
              <option value="">
                Select Gender
              </option>
              <option value="Male">
                Male
              </option>
              <option value="Female">
                Female
              </option>
            </select>
            <select name="language" id="language-select" className="form-select"
             onChange={e=>selectHandler(e)} 
              >
              <option value="">
                Select Language
              </option>
              {
                useElevenlabs?(
                  elevenlabsLanguages.map((item,idx)=>(
                    <option value={item} key={idx}>
                        {
                          item
                        }
                    </option>
                  )
                )
                ):(
                  languages.map((item,key)=>(
                    <option key={key} selected={item===selectedLang}  value={item}>
                      {
                        item
                      }
                    </option>
                  ))
                )
              }
            </select>
            <select name="voice" id="voice-select" className="form-select" 
            onChange={e=>selectHandler(e)} >
              <option value="">
                Select voice
              </option>
              {
                useElevenlabs?(
                  elevenlabsVoices.map(item=>(
                    <option value={item.voice_id} key={item.voice_id}>
                      {
                        item.name
                      }
                    </option>
                  ))
                ):(
                  voices.map((item,key)=>(
                    <option key={key} selected={item===selectedVoice} value={item} >
                      {
                        item
                      }
                    </option>
                  ))
                )
              }
            </select>
            <button style={{height:"40px"}} onClick={()=>generateMp3(null,null,null,null,useElevenlabs)}>
              Generate .mp3 file
            </button>
          </div>
          <div id="text-to-file-result-div">

          </div>
        </div>
        {
          //dialogflow code
        }
      </div>
    </div>
  )
}

//generate mp3 function
//now doing text to speech from the client , then send file to register it on the deta base 
export async function generateMp3 (p_text = null,p_lang = null,p_voice = null,targetDiv = null,useElevenlabs=false){
  console.log("text to mp3 generating ...")
  let audioDataHtml,audioUrl;

  let text          = p_text  || document?.getElementById('text_to_mp3')?.value;
  let languageCode  = p_lang  || document?.getElementById("language-select")?.value;
  let voiceName     = p_voice?.replace(" (Male)","")?.replace(" (Female)","")?.replace(" ","") || document?.getElementById("voice-select")?.value?.replace(" (Male)","")?.replace(" (Female)","")?.replace(" ","");
  //setting txt to an initial value if it was not set
  if(!text || text?.length===0){
    text="La zone du texte est vide!"
  }
  //setting lang to an initial value if it was not set
  if(!languageCode || languageCode?.length===0){
    languageCode = "fr-FR"
  }

  //setting voice to an initial value if it was not set
  if(!voiceName || voiceName?.length===0){
    voiceName = "fr-FR-AlainNeural"
  }

  //checking if the query aleady exists
  await axios.post("/api/find-query", {text}, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(async (value,err)=>{
    if(err){
      throw err;
    }
    console.log(value.data,text)
    if(value.data.found){
      audioDataHtml = `
      <audio controls autoplay>
        <source src="${value.data?.audio}" type="audio/mpeg"/>
      </audio> 
      <br>
      <a href="${value.data?.audio}" download>Download</a>
      <br/>
    `;
    document.getElementById(targetDiv||'text-to-file-result-div').innerHTML = audioDataHtml;
    }else{
      //const url = 'http://localhost:3000/file';
        try {
          console.log("starting")
          //audio HTML response  and URL
          //const filename = uuidv4();

      
          //getting latest row from prisma and implementing it
          const {data} = await axios.get("/api/getUniqueCred",{
            params:{
              projectid: sessionStorage.getItem("projectid") ||""
            }
          });
          if(useElevenlabs){
            const CHUNK_SIZE = 1024;
            const elevenlabs_url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceName}`;
          
            const headers = {
              "Accept": "audio/mpeg",
              "Content-Type": "application/json",
              "xi-api-key": process.env.ELEVEN_LABS_API_KEY
            };
          
            const data = {
              text,
              "model_id": "eleven_multilingual_v1",
              "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.5
              }
            };
          
            try {
              const response = await axios.post(elevenlabs_url, data, { headers, responseType: 'arraybuffer' });
          
              const base64Data = Buffer.from(response.data, 'binary').toString('base64');
          
              // Log the result file in base64
              console.log(base64Data);
          
              // Save the result as a file
              //const fileBuffer = Buffer.from(response.data, 'binary');
              const url = "/api/text-to-speech"
              const requestBody = {
                audioBase64:base64Data,
                filename:text,
                type:languageCode,
                api_type:useElevenlabs?"elevenlabs":"azure",
              };
              
              console.log(requestBody)
              
              
              //generating html response
              audioDataHtml = `
                <audio controls autoplay>
                  <source src="data:audio/mpeg;base64,${base64Data}" type="audio/mpeg"/>
                </audio> 
                <br>
                <a href="data:audio/mpeg;base64,${base64Data}" download>Download</a>
                <br/>
              `;
      
              await axios.post(url, requestBody, {
                headers: {
                  'Content-Type': 'application/json',
                },
                params:{
                  projectid: sessionStorage.getItem("projectid") ||""
                }
              }).then((value,err)=>{
                if(err){
                  throw err;
                }
                console.log(value)
                audioDataHtml += value.data;
              })
              console.log("done")
              console.log(audioDataHtml)
              document.getElementById(targetDiv||'text-to-file-result-div').innerHTML = audioDataHtml;
            } catch (error) {
                console.error('Error:', error);
            }

          }else{
            console.log(data)
            const speechConfig = SpeechConfig.fromSubscription(data?.AZURETTS_SUB_KEY || "f7b0a88a3ba2456da1d23880eee96996", data?.AZURETTS_REGION || "eastus");
        
            speechConfig.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Audio24Khz160KBitRateMonoMp3;
            speechConfig.speechSynthesisVoiceName = voiceName;
            speechConfig.speechSynthesisLanguage = languageCode;
          
            const audioData = new Uint8Array(0);
            const pullStream = PullAudioOutputStream.createPullStream();
        
          
            pullStream.read = async (dataBuffer) => {
              const newData = new Uint8Array(dataBuffer);
              audioData.set(newData, audioData.length);
              return newData.length;
            };
          
            const audioConfig = AudioConfig.fromStreamOutput(pullStream);
            const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
          
            const synthesisCompleted = async (e,resolve) => {
              console.log("function oncomplete")
              if(!e.privErrorDetails){
                if(!e.result && e.privAudioData){
                  e = {...e,result:{audioData:e.privAudioData}};
                }
                const audioBase64 = Buffer.from(e.result.audioData).toString('base64');
        
              
        
                
                console.log(e.result.audioData)
                const url = "/api/text-to-speech"
                const requestBody = {
                  audioBase64,
                  filename:text,
                  type:voiceName.toLowerCase().includes("fr")?"Francais":"Anglais",
                  api_type:useElevenlabs?"elevenlabs":"azure",

                };
                
                console.log(requestBody)
                
                
                //generating html response
                audioDataHtml = `
                  <audio controls autoplay>
                    <source src="data:audio/mpeg;base64,${audioBase64}" type="audio/mpeg"/>
                  </audio> 
                  <br>
                  <a href="data:audio/mpeg;base64,${audioBase64}" download>Download</a>
                  <br/>
                `;

                await axios.post(url, requestBody, {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  params:{
                    projectid: sessionStorage.getItem("projectid") ||""
                  }
                }).then((value,err)=>{
                  if(err){
                    throw err;
                  }
                  console.log(value)
                  audioDataHtml += value.data;
                })
                
              }else{
                audioDataHtml = `
                  <p>
                    ${e.privErrorDetails}
                  </p>
                `
              }  
        
              console.log("done")
              resolve();
            };
        
            async function startConversion(){
              await new Promise( resolve => {
                synthesizer.speakTextAsync(text,e=>synthesisCompleted(e,resolve),err=>{
                throw err;
              })
              })
              .then((done,err)=>{
                console.log(done)
                if(err){
                  throw err;
                }
                document.getElementById(targetDiv||'text-to-file-result-div').innerHTML = audioDataHtml;
          
              });
            }
            startConversion();
          }
      
          /*await new Promise( resolve => {
            console.log("resolving")
            synthesizer.speakTextAsync(text,resolve,err=>{
              throw err;
            })
          }).then(async (e) => {
            console.log("resolved")
            await synthesisCompleted(e).then(()=>{
              console.log("oncomplete done")
                audioDataHtml+=`
                <a href="${audioUrl}"  target="_blank">
                  ${`${audioUrl}`}	
                </a>
                <p>
                  ${`${audioUrl}`}
                </p>
              `;
                res.setHeader('Content-Type','text/html');          
                res.status(200).send(audioDataHtml);
                
                synthesizer.close();
                console.log("done")
      
            })
      
          })/*.then(()=>{   
            console.log(audioUrl)
              audioDataHtml+=`
              <a href="${audioUrl}"  target="_blank">
                ${`${audioUrl}`}	
              </a>
              <p>
                ${`${audioUrl}`}
              </p>
            `;
          })*/
      
      
      } catch (error) {
        
          console.log(error)
          
      }
    }
  })
  /*const url = "/api/text-to-speech"
  const requestBody = {
    text: txt,
    voiceName: voice,
    languageCode: lang
  };
  
  console.log(requestBody)
  
  /*await axios.post(url, requestBody, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      console.log(response);
      if (!response) {
        throw new Error('Network response was not ok');
      }
      console.log(response.data);
      // Handle the response data here
      if (document) {
        document.getElementById('text-to-file-result-div').innerHTML = response.data;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle the error here
    });
    */
}