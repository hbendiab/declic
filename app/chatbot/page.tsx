'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, CheckCircle, Send, Euro, MapPin, Zap, Star } from 'lucide-react'
import {
  mbtiQuestions, riasecQuestions, enneagramQuestions, viaStrengths,
  calculateMBTI, calculateRIASEC, calculateEnneagram, calculateVIAStrengths,
  mbtiDescriptions, riasecDescriptions, enneagramDescriptions,
} from '@/lib/personality-tests'

/* ── Types ───────────────────────────────────────────────────────────────── */

interface ChatMsg { id: string; from: 'klic' | 'user'; text: string }
interface Profile {
  firstName: string; age: number; gender: string; city: string
  situation: string; hobbies: string[]; motivation: string[]
  fears: string[]; urgency: string; values: Record<string, number>
}
interface Job { title: string; sector: string; salary_min: string; salary_max: string; relevance_score: number }
interface TestState {
  queue: string[]
  currentIdx: number
  questionIdx: number
  answers: Record<string, Record<string, number>>
  results: Record<string, string>
}
type Step = 'welcome'|'name'|'age'|'gender'|'city'|'situation'|'hobbies'|'motivation'|'fears'|'urgency'|'values'|'tests_intro'|'test_running'|'processing'|'results'|'jobs'|'chat'

/* ── Static data ─────────────────────────────────────────────────────────── */

const GENDERS = [
  {v:'Femme',e:'👩'},{v:'Homme',e:'👨'},{v:'Non-binaire',e:'🌈'},{v:'Préfère ne pas dire',e:'🙏'},
]
const SITUATIONS = [
  {v:'Seconde',e:'📚'},{v:'Première',e:'📚'},{v:'Terminale',e:'🎓'},{v:'Étudiant·e',e:'🏛️'},
  {v:'Formation pro',e:'🔧'},{v:'Plus à l\'école',e:'🚶'},{v:'Je travaille',e:'💼'},{v:'Reconversion',e:'🔄'},{v:'Autre',e:'✨'},
]
const HOBBIES = [
  {v:'Gaming',e:'🎮'},{v:'Sport',e:'⚽'},{v:'Musique',e:'🎵'},{v:'Art / Design',e:'🎨'},
  {v:'Écriture / Contenu',e:'✍️'},{v:'Réseaux sociaux',e:'📱'},{v:'Lecture',e:'📖'},{v:'Cinéma / Séries',e:'🎬'},
  {v:'Tech / Code',e:'💻'},{v:'DIY / Bricolage',e:'🔨'},{v:'Cuisine',e:'🍳'},{v:'Voyages',e:'✈️'},
  {v:'Nature',e:'🌿'},{v:'Entrepreneuriat',e:'🚀'},{v:'Autre',e:'⭐'},
]
const MOTIVATIONS = [
  {v:'Je ne sais vraiment pas quoi faire',e:'🤷'},{v:"J'ai une idée à confirmer",e:'🤔'},
  {v:"Explorer d'autres options",e:'🔍'},{v:'Peur de faire le mauvais choix',e:'😰'},
  {v:'Mes proches me le demandent',e:'👨‍👩‍👧'},{v:'Je cherche plus de sens',e:'💫'},
]
const FEARS = [
  {v:'Chômage / instabilité',e:'😟'},{v:"Pas assez d'argent",e:'💸'},
  {v:'Carrière ennuyeuse',e:'😴'},{v:'Pas de place pour créer',e:'🚧'},
  {v:'Études trop longues',e:'📚'},{v:'Mauvais équilibre vie/travail',e:'⚖️'},{v:'Pas reconnu·e',e:'🥺'},
]
const URGENCIES = [
  {v:'Maintenant, c\'est urgent !',e:'⚡'},{v:'Dans 6 mois',e:'🗓️'},
  {v:'Dans 1-2 ans',e:'🗓️'},{v:"J'ai du temps, je veux bien réfléchir",e:'😌'},
]
const VALUES_CONFIG = [
  {key:'stability', label:'Stabilité / Sécurité', emoji:'🔐', low:'Risque calculé ok', high:'CDI safe'},
  {key:'creativity', label:'Créativité', emoji:'🎨', low:'Peu importante', high:'Créer chaque jour'},
  {key:'autonomy', label:'Autonomie', emoji:'🌍', low:'Structure ok', high:'Total liberté'},
  {key:'impact', label:'Impact / Sens', emoji:'❤️', low:'Peu important', high:'Changer le monde'},
  {key:'salary', label:'Salaire', emoji:'💰', low:'Peu important', high:'Bien gagner'},
  {key:'learning', label:'Apprentissage', emoji:'📚', low:'Routine ok', high:'Apprendre en continu'},
]
const TESTS_INFO = [
  {emoji:'🎯',name:'RIASEC',subtitle:'Intérêts pro',desc:'Réaliste · Social · Artistique · Entrepreneur',time:'5-7 min',color:'from-blue-500/20 to-cyan-500/20',border:'border-blue-500/30'},
  {emoji:'🧠',name:'MBTI',subtitle:'Personnalité',desc:'16 types · Introverti / Extraverti · Intuitif...',time:'5-7 min',color:'from-purple-500/20 to-pink-500/20',border:'border-purple-500/30'},
  {emoji:'💎',name:'Ennéagramme',subtitle:'Motivations',desc:'9 types de personnalité · Tes vraies valeurs',time:'5-7 min',color:'from-amber-500/20 to-orange-500/20',border:'border-amber-500/30'},
  {emoji:'✨',name:'VIA Strengths',subtitle:'Tes forces',desc:'24 forces · Créativité · Leadership · Empathie',time:'5-7 min',color:'from-emerald-500/20 to-teal-500/20',border:'border-emerald-500/30'},
]

/* ── Contextual KLIC reactions ───────────────────────────────────────────── */

function getReaction(step: Step, answer: string, profile: Partial<Profile>): string {
  const name = profile.firstName || ''
  switch (step) {
    case 'name': return `Super ${answer}! 😊`
    case 'age': {
      const a = parseInt(answer)
      if (a < 18) return `${answer} ans! On est exactement au bon moment pour y penser 🔥`
      if (a >= 30) return `${answer} ans? Jamais trop tard pour trouver sa vraie voie 💪`
      return `${answer} ans, parfait pour cette réflexion! 🙌`
    }
    case 'gender': return `Noté ${name}! 😊`
    case 'city': return `${answer}! Belle ville 🏙️`
    case 'situation':
      if (answer.includes('Terminale')) return `La Terminale, c'est une année clé! Bien de réfléchir maintenant 🎓`
      if (answer.includes('Reconversion')) return `Reconversion! Courageux·se de vouloir changer de voie 🔄`
      if (answer.includes('travaille')) return `Jamais trop tard pour se redéfinir 💪`
      return `Ok! J'ai bien noté 👍`
    case 'hobbies': return `Cool! J'adore ta façon de te décrire 🎯`
    case 'motivation': return `C'est important de savoir ça pour t'aider au mieux 💡`
    case 'fears': return `Ces inquiétudes sont normales. On va les adresser ensemble! 💪`
    case 'urgency': return `Noté! Je vais adapter mes recommandations à ton timing ⏱️`
    case 'values': return `Parfait! J'ai maintenant une image claire de ce qui compte pour toi 🎯`
    default: return 'Noté! 👍'
  }
}

function getNextQuestion(step: Step, profile: Partial<Profile>, answer?: string): string {
  const name = answer && step === 'name' ? answer : (profile.firstName || '')
  switch (step) {
    case 'name': return `Tu as quel âge, ${answer || name}?`
    case 'age': return 'Comment tu t\'identifies?'
    case 'gender': return `Tu habites dans quelle ville, ${name}?`
    case 'city': return `Où en es-tu en ce moment, ${name}?`
    case 'situation': return 'Qu\'est-ce que tu aimes faire en dehors des cours / du travail?\n\n(Tes vraies passions! Pas de jugement 😊)'
    case 'hobbies': return 'Pourquoi tu réfléchis à ton orientation maintenant?\n\n(Max 2 raisons)'
    case 'motivation': return 'Honnêtement, qu\'est-ce qui t\'inquiète dans ton avenir pro?\n\n(Max 3 réponses)'
    case 'fears': return 'Dans combien de temps tu dois décider?'
    case 'urgency': return 'Pour finir... rate ces aspects d\'un bon job pour toi 👇'
    case 'values': return `${name}, j'ai maintenant une image complète de toi!\n\nVoilà les 4 tests scientifiques qui vont affiner mes recommandations:`
    default: return ''
  }
}

/* ── Background ──────────────────────────────────────────────────────────── */

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <motion.div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20"
        style={{background:'radial-gradient(circle, #2563EB 0%, transparent 70%)'}}
        animate={{x:[0,30,0],y:[0,-20,0],scale:[1,1.1,1]}}
        transition={{duration:12,repeat:Infinity,ease:'easeInOut'}}
      />
      <motion.div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full opacity-15"
        style={{background:'radial-gradient(circle, #7C3AED 0%, transparent 70%)'}}
        animate={{x:[0,-20,0],y:[0,30,0],scale:[1,1.15,1]}}
        transition={{duration:15,repeat:Infinity,ease:'easeInOut',delay:3}}
      />
      <motion.div className="absolute -bottom-20 left-1/4 w-64 h-64 rounded-full opacity-10"
        style={{background:'radial-gradient(circle, #06B6D4 0%, transparent 70%)'}}
        animate={{x:[0,15,0],y:[0,-25,0]}}
        transition={{duration:10,repeat:Infinity,ease:'easeInOut',delay:6}}
      />
    </div>
  )
}

function KlicAvatar({size='sm', pulse=false}:{size?:'sm'|'md';pulse?:boolean}) {
  const s = size==='sm' ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-base'
  return (
    <div className={`relative flex-shrink-0 ${s}`}>
      {pulse && <motion.div className="absolute inset-0 rounded-full" style={{background:'radial-gradient(circle,#2563EB,transparent 70%)'}} animate={{scale:[1,1.6,1],opacity:[0.5,0,0.5]}} transition={{duration:2.5,repeat:Infinity}} />}
      <div className="w-full h-full rounded-full flex items-center justify-center font-bold text-white" style={{background:'linear-gradient(135deg,#2563EB 0%,#06B6D4 100%)'}}>K</div>
    </div>
  )
}

/* ── Chat bubble ─────────────────────────────────────────────────────────── */

function ChatBubble({msg}:{msg:ChatMsg}) {
  const isKlic = msg.from === 'klic'
  return (
    <motion.div initial={{opacity:0,y:12,scale:0.97}} animate={{opacity:1,y:0,scale:1}} transition={{type:'spring',stiffness:300,damping:25}}
      className={`flex gap-3 ${isKlic ? 'justify-start' : 'justify-end'}`}>
      {isKlic && <KlicAvatar size="sm" />}
      <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
        isKlic ? 'rounded-tl-sm text-neutral-100 border' : 'rounded-tr-sm text-white'
      }`}
        style={isKlic ? {background:'rgba(255,255,255,0.06)',borderColor:'rgba(255,255,255,0.08)'} : {background:'linear-gradient(135deg,#2563EB,#1D4ED8)'}}
      >{msg.text}</div>
    </motion.div>
  )
}

/* ── Option card (single / multi-select) ─────────────────────────────────── */

function OptionCard({emoji,label,selected,onClick}:{emoji?:string;label:string;selected:boolean;onClick:()=>void}) {
  return (
    <motion.button whileTap={{scale:0.96}} onClick={onClick}
      className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-sm text-left transition-all duration-150 ${
        selected ? 'border-blue-500/60 text-white' : 'border-white/10 text-neutral-300 hover:border-white/25'
      }`}
      style={selected ? {background:'rgba(37,99,235,0.18)'} : {background:'rgba(255,255,255,0.04)'}}
    >
      {emoji && <span className="text-lg flex-shrink-0">{emoji}</span>}
      {selected && <CheckCircle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />}
      <span className="font-medium">{label}</span>
    </motion.button>
  )
}

/* ── Values sliders ──────────────────────────────────────────────────────── */

function ValuesSliders({values,onChange}:{values:Record<string,number>;onChange:(k:string,v:number)=>void}) {
  return (
    <div className="space-y-4 py-2">
      {VALUES_CONFIG.map((vc) => (
        <div key={vc.key} className="rounded-2xl border border-white/10 p-4" style={{background:'rgba(255,255,255,0.04)'}}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-white flex items-center gap-1.5"><span>{vc.emoji}</span>{vc.label}</span>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded-full">{values[vc.key] ?? 5}/10</span>
          </div>
          <input type="range" min={1} max={10} value={values[vc.key] ?? 5}
            onChange={e => onChange(vc.key, parseInt(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer" />
          <div className="flex justify-between text-[10px] text-neutral-600 mt-1">
            <span>{vc.low}</span><span>{vc.high}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Test presentation cards (selectable) ────────────────────────────────── */

function TestCards({selected, onToggle}:{selected:string[];onToggle:(name:string)=>void}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {TESTS_INFO.map((t, i) => {
        const sel = selected.includes(t.name)
        return (
          <motion.button key={t.name} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
            onClick={()=>onToggle(t.name)} whileTap={{scale:0.97}}
            className={`rounded-2xl border p-4 bg-gradient-to-br ${t.color} text-left transition-all duration-150 ${sel ? 'ring-2 ring-blue-500/50 ' + t.border : t.border}`}>
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl">{t.emoji}</span>
              {sel && <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0"/>}
            </div>
            <p className="font-bold text-white text-sm">{t.name}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{t.subtitle}</p>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{t.desc}</p>
            <p className="text-xs text-neutral-400 mt-2">⏱️ {t.time}</p>
          </motion.button>
        )
      })}
    </div>
  )
}

/* ── Job recommendation card ─────────────────────────────────────────────── */

function JobCard({job,index,onAskKlic}:{job:Job;index:number;onAskKlic:(title:string)=>void}) {
  const [expanded, setExpanded] = useState(false)
  const score = Math.round(job.relevance_score*100)
  const colors = [
    {bg:'from-blue-600/20 to-cyan-600/20',border:'border-blue-500/30',tag:'text-blue-300 bg-blue-500/20'},
    {bg:'from-purple-600/20 to-pink-600/20',border:'border-purple-500/30',tag:'text-purple-300 bg-purple-500/20'},
    {bg:'from-emerald-600/20 to-teal-600/20',border:'border-emerald-500/30',tag:'text-emerald-300 bg-emerald-500/20'},
    {bg:'from-amber-600/20 to-orange-600/20',border:'border-amber-500/30',tag:'text-amber-300 bg-amber-500/20'},
    {bg:'from-rose-600/20 to-pink-600/20',border:'border-rose-500/30',tag:'text-rose-300 bg-rose-500/20'},
  ]
  const c = colors[index % colors.length]
  return (
    <motion.div initial={{opacity:0,y:10,scale:0.97}} animate={{opacity:1,y:0,scale:1}} transition={{delay:index*0.08,type:'spring',stiffness:300}}
      className={`rounded-2xl border ${c.border} p-4 bg-gradient-to-br ${c.bg}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm leading-tight">{job.title}</p>
          <p className="text-neutral-400 text-xs mt-1 flex items-center gap-1"><MapPin className="w-3 h-3"/>{job.sector}</p>
        </div>
        <span className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${c.tag}`}>{score}% match</span>
      </div>
      {(job.salary_min || job.salary_max) && (
        <div className="flex items-center gap-1.5 mt-2">
          <Euro className="w-3 h-3 text-amber-400"/>
          <span className="text-xs text-neutral-300">
            {parseInt(job.salary_min||'0').toLocaleString('fr')} – {parseInt(job.salary_max||'0').toLocaleString('fr')} €/an
          </span>
        </div>
      )}

      {/* Détails expandables */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}
            className="overflow-hidden">
            <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5 text-xs text-neutral-400">
              <p>🎓 Formation : Bac+3 à Bac+5 selon le poste</p>
              <p>📈 Évolution : Senior → Lead → Manager / Freelance</p>
              <p>🏠 Télétravail : Souvent possible dans ce secteur</p>
              <p>🌍 Débouchés : Startups, grandes entreprises, agences</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Boutons d'action */}
      <div className="flex gap-2 mt-3">
        <button onClick={()=>setExpanded(!expanded)}
          className="flex-1 py-2 text-xs rounded-xl border border-white/10 text-neutral-400 hover:text-white hover:border-white/25 transition-all font-medium">
          {expanded ? 'Réduire ▲' : 'En savoir plus +'}
        </button>
        <button onClick={()=>onAskKlic(job.title)}
          className="flex-1 py-2 text-xs rounded-xl text-white font-semibold transition-all hover:opacity-90"
          style={{background:'linear-gradient(135deg,#2563EB,#1D4ED8)'}}>
          Chat avec KLIC 💬
        </button>
      </div>
    </motion.div>
  )
}

/* ── Profile summary card ────────────────────────────────────────────────── */

function ProfileSummaryCard({profile}:{profile:Partial<Profile>}) {
  const topValues = VALUES_CONFIG
    .map(v => ({...v,score:profile.values?.[v.key]??5}))
    .sort((a,b)=>b.score-a.score).slice(0,3)
  return (
    <div className="rounded-2xl border border-white/10 p-4 space-y-3" style={{background:'rgba(255,255,255,0.05)'}}>
      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Ton profil</p>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div><span className="text-neutral-500">Ville</span><p className="text-white font-medium">{profile.city}</p></div>
        <div><span className="text-neutral-500">Situation</span><p className="text-white font-medium">{profile.situation}</p></div>
      </div>
      {profile.hobbies && profile.hobbies.length > 0 && (
        <div>
          <p className="text-xs text-neutral-500 mb-1.5">Passions</p>
          <div className="flex flex-wrap gap-1.5">
            {profile.hobbies.slice(0,4).map(h=>(
              <span key={h} className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/20">{h}</span>
            ))}
          </div>
        </div>
      )}
      {topValues.length > 0 && (
        <div>
          <p className="text-xs text-neutral-500 mb-1.5">Valeurs clés</p>
          <div className="space-y-1">
            {topValues.map(v=>(
              <div key={v.key} className="flex items-center gap-2">
                <span className="text-base">{v.emoji}</span>
                <div className="flex-1 h-1.5 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-blue-500" style={{width:`${v.score*10}%`}}/>
                </div>
                <span className="text-xs text-neutral-400">{v.score}/10</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Processing animation ────────────────────────────────────────────────── */

function ProcessingCard() {
  const steps = ['Analyse de ton profil...','Calcul des résultats tests...','Recherche des métiers qui te correspondent...','Finalisation des recommandations...']
  const [current, setCurrent] = useState(0)
  useEffect(()=>{
    if(current<steps.length-1) {const t=setTimeout(()=>setCurrent(c=>c+1),1000);return()=>clearTimeout(t)}
  },[current])
  return (
    <div className="rounded-2xl border border-white/10 p-5 space-y-3" style={{background:'rgba(255,255,255,0.05)'}}>
      {steps.map((s,i)=>(
        <div key={s} className={`flex items-center gap-3 text-sm transition-all duration-300 ${i<=current?'opacity-100':'opacity-20'}`}>
          {i<current ? <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0"/> :
           i===current ? <motion.div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent flex-shrink-0" animate={{rotate:360}} transition={{duration:0.7,repeat:Infinity,ease:'linear'}}/> :
           <div className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0"/>}
          <span className={i<=current?'text-white':'text-neutral-600'}>{s}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Main page ───────────────────────────────────────────────────────────── */

const INITIAL_PROFILE: Partial<Profile> = { hobbies:[], motivation:[], fears:[], values:{} }
const INITIAL_TEST_STATE: TestState = { queue:[], currentIdx:0, questionIdx:0, answers:{}, results:{} }

/* ── Test helpers ────────────────────────────────────────────────────────── */

function getTestQuestions(name: string) {
  switch(name) {
    case 'RIASEC': return riasecQuestions
    case 'MBTI': return mbtiQuestions
    case 'Ennéagramme': return enneagramQuestions
    case 'VIA Strengths': return viaStrengths
    default: return []
  }
}

function getTestType(name: string): 'rating' | 'binary' {
  return name === 'MBTI' ? 'binary' : 'rating'
}

function computeTestResult(name: string, answers: Record<string,number>): string {
  switch(name) {
    case 'RIASEC': {
      const code = calculateRIASEC(answers)
      const letters = code.split('').map(l => riasecDescriptions[l]?.split(' - ')[0] || l)
      return `Code ${code} · ${letters.join(', ')}`
    }
    case 'MBTI': {
      const type = calculateMBTI(answers)
      return `${type} · ${mbtiDescriptions[type] || type}`
    }
    case 'Ennéagramme': {
      const t = calculateEnneagram(answers)
      return `Type ${t} · ${enneagramDescriptions[t] || ''}`
    }
    case 'VIA Strengths': {
      const top = calculateVIAStrengths(answers)
      return `Top forces : ${top.join(', ')}`
    }
    default: return ''
  }
}

function getTestEmoji(name: string) {
  switch(name) {
    case 'RIASEC': return '🎯'
    case 'MBTI': return '🧠'
    case 'Ennéagramme': return '💎'
    case 'VIA Strengths': return '✨'
    default: return '📊'
  }
}

export default function ChatbotPage() {
  const [step, setStep] = useState<Step>('welcome')
  const [msgs, setMsgs] = useState<ChatMsg[]>([{id:'w0',from:'klic',text:'Salut! 👋 Bienvenue sur DÉCLIK!\n\nJe suis KLIC, ton conseiller en orientation.\n\nAvant de commencer, j\'aimerais mieux te connaître. Ça te va? 😊'}])
  const [profile, setProfile] = useState<Partial<Profile>>(INITIAL_PROFILE)
  const [selected, setSelected] = useState<string[]>([])
  const [textVal, setTextVal] = useState('')
  const [sliderVals, setSliderVals] = useState<Record<string,number>>({})
  const [jobs, setJobs] = useState<Job[]>([])
  const [chatInput, setChatInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([])
  const [testState, setTestState] = useState<TestState>(INITIAL_TEST_STATE)
  const bottomRef = useRef<HTMLDivElement>(null)
  const allMsgs = [...msgs, ...chatMsgs]

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:'smooth'})}, [allMsgs, step, jobs])

  /* advance step */
  const advance = (answer: string, displayAnswer?: string, newStep?: Step) => {
    const userMsg: ChatMsg = {id:Date.now().toString(),from:'user',text:displayAnswer||answer}
    setMsgs(prev=>[...prev,userMsg])
    setSelected([])
    setTextVal('')

    const reaction = getReaction(step, answer, profile)
    const nextQ = newStep ? '' : getNextQuestion(step, profile, answer)
    const klicText = nextQ ? `${reaction}\n\n${nextQ}` : reaction

    setTimeout(()=>{
      if(klicText.trim()) setMsgs(prev=>[...prev,{id:Date.now().toString()+'-k',from:'klic',text:klicText}])
      const target: Step = newStep || (() => {
        const seq: Step[] = ['name','age','gender','city','situation','hobbies','motivation','fears','urgency','values','tests_intro','processing','results','jobs','chat']
        const cur = seq.indexOf(step)
        return cur>=0 && cur<seq.length-1 ? seq[cur+1] : 'chat'
      })()
      setStep(target)
    }, 300)
  }

  /* multi-select confirm */
  const confirmMulti = (maxSel?: number) => {
    if(selected.length===0) return
    const sliced = maxSel ? selected.slice(0,maxSel) : selected
    advance(sliced.join(', '))
    if(step==='hobbies') setProfile(p=>({...p,hobbies:sliced}))
    if(step==='motivation') setProfile(p=>({...p,motivation:sliced}))
    if(step==='fears') setProfile(p=>({...p,fears:sliced}))
  }

  /* values confirm */
  const confirmValues = () => {
    setProfile(p=>({...p,values:sliderVals}))
    const top = VALUES_CONFIG.sort((a,b)=>(sliderVals[b.key]??5)-(sliderVals[a.key]??5)).slice(0,3)
    advance(`Créativité: ${sliderVals['creativity']??5}/10 · Salaire: ${sliderVals['salary']??5}/10 · Autonomie: ${sliderVals['autonomy']??5}/10`,
      top.map(v=>`${v.emoji} ${v.label}: ${sliderVals[v.key]??5}/10`).join('\n'))
  }

  /* fetch jobs */
  useEffect(()=>{
    if(step!=='processing') return
    const query = [...(profile.hobbies||[]), ...(profile.motivation||[])].slice(0,5).join(' ')
    fetch('/api/search-jobs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query,n_results:5})})
      .then(r=>r.json()).then(d=>{
        const list: Job[] = d.results || []
        setJobs(list)
        setTimeout(()=>{
          setMsgs(prev=>[...prev,{id:Date.now()+'-r',from:'klic',text:`Wow! J'ai une vision COMPLÈTE de toi maintenant 🎯\n\nVoilà les métiers qui te correspondent le mieux :`}])
          setStep('results')
          setTimeout(()=>setStep('jobs'),400)
        },4000)
      }).catch(()=>setTimeout(()=>{
        setMsgs(prev=>[...prev,{id:Date.now()+'-r',from:'klic',text:'Super! Voici tes recommandations 🎯'}])
        setStep('jobs')
      },4000))
  },[step])

  /* free chat send */
  const sendChat = async () => {
    const txt = chatInput.trim()
    if(!txt||isChatLoading) return
    const newMsg: ChatMsg = {id:Date.now().toString(),from:'user',text:txt}
    setChatMsgs(prev=>[...prev,newMsg])
    setChatInput('')
    setIsChatLoading(true)
    try {
      const r = await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({messages:[...msgs,...chatMsgs,newMsg].map(m=>({role:m.from==='klic'?'assistant':'user',content:m.text}))})})
      const d = await r.json()
      setChatMsgs(prev=>[...prev,{id:Date.now()+'-k',from:'klic',text:d.message}])
    } catch {
      setChatMsgs(prev=>[...prev,{id:Date.now()+'-k',from:'klic',text:'Oups, bug! Réessaie 🙏'}])
    } finally { setIsChatLoading(false) }
  }

  /* toggle option */
  const toggle = (v:string) => setSelected(prev=>prev.includes(v)?prev.filter(x=>x!==v):[...prev,v])

  /* start tests with a queue */
  const startTests = (queue: string[]) => {
    const ts: TestState = { queue, currentIdx: 0, questionIdx: 0, answers: {}, results: {} }
    setTestState(ts)
    const first = queue[0]
    const questions = getTestQuestions(first)
    setMsgs(prev=>[...prev,
      {id:Date.now()+'t0',from:'klic',text:`C'est parti pour ${getTestEmoji(first)} **${first}** !\n\n${questions.length} questions · Réponds instinctivement, pas de bonne ou mauvaise réponse 😊`}
    ])
    setStep('test_running')
  }

  /* answer a test question */
  const answerTestQuestion = (questionId: string, score: number, displayLabel: string) => {
    setTestState(prev => {
      const testName = prev.queue[prev.currentIdx]
      const questions = getTestQuestions(testName)
      const newAnswers = {
        ...prev.answers,
        [testName]: { ...(prev.answers[testName] || {}), [questionId]: score }
      }
      const isLastQuestion = prev.questionIdx >= questions.length - 1
      const isLastTest = prev.currentIdx >= prev.queue.length - 1

      if (!isLastQuestion) {
        return { ...prev, questionIdx: prev.questionIdx + 1, answers: newAnswers }
      }

      // Test terminé — calculer le résultat
      const result = computeTestResult(testName, newAnswers[testName])
      const newResults = { ...prev.results, [testName]: result }

      if (!isLastTest) {
        // Passer au test suivant
        const nextTest = prev.queue[prev.currentIdx + 1]
        const nextQuestions = getTestQuestions(nextTest)
        setTimeout(() => {
          setMsgs(m=>[...m,
            {id:Date.now()+'tr',from:'klic',text:`${getTestEmoji(testName)} Résultat ${testName} :\n${result} 🎉\n\nOn continue ! Prochain test : ${getTestEmoji(nextTest)} **${nextTest}** (${nextQuestions.length} questions)`}
          ])
        }, 200)
        return { ...prev, currentIdx: prev.currentIdx + 1, questionIdx: 0, answers: newAnswers, results: newResults }
      }

      // Tous les tests terminés
      const summaryLines = Object.entries(newResults).map(([name, res]) => `${getTestEmoji(name)} **${name}** : ${res}`)
      setTimeout(() => {
        setMsgs(m=>[...m,
          {id:Date.now()+'ts',from:'klic',text:`🎯 Tests terminés ! Voilà tes résultats :\n\n${summaryLines.join('\n\n')}\n\nJe cherche maintenant les métiers qui te correspondent le mieux...`}
        ])
        setStep('processing')
      }, 200)
      return { ...prev, answers: newAnswers, results: newResults }
    })
  }

  /* ── Render input area per step ── */
  const renderInput = () => {
    switch(step) {

      case 'welcome':
        return (
          <div className="px-4 py-4">
            <motion.button initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
              onClick={()=>{setMsgs(prev=>[...prev,{id:'w1',from:'klic',text:'Quel est ton prénom?'}]);setStep('name')}}
              className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2"
              style={{background:'linear-gradient(135deg,#2563EB,#7C3AED)'}}>
              C'est parti! <ChevronRight className="w-4 h-4"/>
            </motion.button>
          </div>
        )

      case 'name': case 'city':
        return (
          <div className="px-4 py-4 flex gap-3">
            <input value={textVal} onChange={e=>setTextVal(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'&&textVal.trim()){const v=textVal.trim();if(step==='name')setProfile(p=>({...p,firstName:v}));if(step==='city')setProfile(p=>({...p,city:v}));advance(v)}}}
              placeholder={step==='name'?'Ton prénom...':'Ta ville...'} autoFocus
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder-neutral-600 outline-none focus:border-blue-500/50"/>
            <button onClick={()=>{if(!textVal.trim())return;const v=textVal.trim();if(step==='name')setProfile(p=>({...p,firstName:v}));if(step==='city')setProfile(p=>({...p,city:v}));advance(v)}}
              className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{background:'linear-gradient(135deg,#2563EB,#1D4ED8)'}}>
              <Send className="w-4 h-4 text-white"/>
            </button>
          </div>
        )

      case 'age':
        return (
          <div className="px-4 py-4 flex gap-3">
            <input type="number" value={textVal} onChange={e=>setTextVal(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'&&textVal){setProfile(p=>({...p,age:parseInt(textVal)}));advance(textVal)}}}
              placeholder="Ton âge..." autoFocus min={10} max={99}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder-neutral-600 outline-none focus:border-blue-500/50"/>
            <button onClick={()=>{if(!textVal)return;setProfile(p=>({...p,age:parseInt(textVal)}));advance(textVal)}}
              className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{background:'linear-gradient(135deg,#2563EB,#1D4ED8)'}}>
              <Send className="w-4 h-4 text-white"/>
            </button>
          </div>
        )

      case 'gender':
        return (
          <div className="px-4 py-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {GENDERS.map(g=><OptionCard key={g.v} emoji={g.e} label={g.v} selected={selected.includes(g.v)} onClick={()=>{setProfile(p=>({...p,gender:g.v}));advance(g.v)}}/>)}
            </div>
          </div>
        )

      case 'situation':
        return (
          <div className="px-4 py-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {SITUATIONS.map(s=><OptionCard key={s.v} emoji={s.e} label={s.v} selected={selected.includes(s.v)} onClick={()=>{setProfile(p=>({...p,situation:s.v}));advance(s.v)}}/>)}
            </div>
          </div>
        )

      case 'urgency':
        return (
          <div className="px-4 py-3 space-y-2">
            {URGENCIES.map(u=><OptionCard key={u.v} emoji={u.e} label={u.v} selected={selected.includes(u.v)} onClick={()=>{setProfile(p=>({...p,urgency:u.v}));advance(u.v)}}/>)}
          </div>
        )

      case 'hobbies':
        return (
          <div className="px-4 py-3 space-y-3">
            <p className="text-xs text-neutral-500">Sélectionne tout ce qui te correspond</p>
            <div className="grid grid-cols-2 gap-2">
              {HOBBIES.map(h=><OptionCard key={h.v} emoji={h.e} label={h.v} selected={selected.includes(h.v)} onClick={()=>toggle(h.v)}/>)}
            </div>
            {selected.length>0 && (
              <motion.button initial={{opacity:0}} animate={{opacity:1}} onClick={()=>confirmMulti()}
                className="w-full py-3 rounded-2xl text-white font-semibold text-sm"
                style={{background:'linear-gradient(135deg,#2563EB,#1D4ED8)'}}>
                Valider ({selected.length} choix) →
              </motion.button>
            )}
          </div>
        )

      case 'motivation':
        return (
          <div className="px-4 py-3 space-y-3">
            <p className="text-xs text-neutral-500">Max 2 raisons</p>
            <div className="space-y-2">
              {MOTIVATIONS.map(m=><OptionCard key={m.v} emoji={m.e} label={m.v} selected={selected.includes(m.v)} onClick={()=>toggle(m.v)}/>)}
            </div>
            {selected.length>0 && (
              <motion.button initial={{opacity:0}} animate={{opacity:1}} onClick={()=>confirmMulti(2)}
                className="w-full py-3 rounded-2xl text-white font-semibold text-sm"
                style={{background:'linear-gradient(135deg,#2563EB,#1D4ED8)'}}>
                Valider ({Math.min(selected.length,2)}/2) →
              </motion.button>
            )}
          </div>
        )

      case 'fears':
        return (
          <div className="px-4 py-3 space-y-3">
            <p className="text-xs text-neutral-500">Max 3 réponses</p>
            <div className="grid grid-cols-2 gap-2">
              {FEARS.map(f=><OptionCard key={f.v} emoji={f.e} label={f.v} selected={selected.includes(f.v)} onClick={()=>toggle(f.v)}/>)}
            </div>
            {selected.length>0 && (
              <motion.button initial={{opacity:0}} animate={{opacity:1}} onClick={()=>confirmMulti(3)}
                className="w-full py-3 rounded-2xl text-white font-semibold text-sm"
                style={{background:'linear-gradient(135deg,#2563EB,#1D4ED8)'}}>
                Valider ({Math.min(selected.length,3)}/3) →
              </motion.button>
            )}
          </div>
        )

      case 'values':
        return (
          <div className="px-4 py-3 space-y-3">
            <ValuesSliders values={sliderVals} onChange={(k,v)=>setSliderVals(prev=>({...prev,[k]:v}))}/>
            <motion.button onClick={confirmValues}
              className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm"
              style={{background:'linear-gradient(135deg,#2563EB,#7C3AED)'}}>
              C'est noté! →
            </motion.button>
          </div>
        )

      case 'tests_intro':
        return (
          <div className="px-4 py-3 space-y-3">
            <p className="text-xs text-neutral-500">Clique sur les tests qui t'intéressent, ou fais-les tous!</p>
            <TestCards selected={selected} onToggle={toggle}/>
            <div className="space-y-2 pt-1">
              <motion.button initial={{opacity:0}} animate={{opacity:1}}
                onClick={()=>{
                  setMsgs(prev=>[...prev,{id:Date.now()+'ui',from:'user',text:'Faire tous les tests d\'un coup!'}])
                  setSelected([])
                  startTests(['RIASEC','MBTI','Ennéagramme','VIA Strengths'])
                }}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-sm"
                style={{background:'linear-gradient(135deg,#2563EB,#7C3AED)'}}>
                🚀 Faire les 4 tests d'un coup!
              </motion.button>
              {selected.length > 0 && (
                <motion.button initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}
                  onClick={()=>{
                    const queue = [...selected]
                    setMsgs(prev=>[...prev,{id:Date.now()+'ui',from:'user',text:`Je fais : ${queue.join(', ')}`}])
                    setSelected([])
                    startTests(queue)
                  }}
                  className="w-full py-3 rounded-2xl text-white font-semibold text-sm border border-blue-500/40"
                  style={{background:'rgba(37,99,235,0.2)'}}>
                  Faire mes {selected.length} test{selected.length>1?'s':''} sélectionné{selected.length>1?'s':''} →
                </motion.button>
              )}
              <motion.button initial={{opacity:0}} animate={{opacity:1,transition:{delay:0.1}}}
                onClick={()=>{
                  setMsgs(prev=>[...prev,{id:Date.now()+'ui',from:'user',text:'Un par un, à mon rythme'}])
                  setSelected([])
                  startTests(['RIASEC','MBTI','Ennéagramme','VIA Strengths'])
                }}
                className="w-full py-3 rounded-2xl text-sm font-medium border border-white/15 text-neutral-300"
                style={{background:'rgba(255,255,255,0.04)'}}>
                Un par un, à mon rythme
              </motion.button>
            </div>
          </div>
        )

      case 'test_running': {
        const testName = testState.queue[testState.currentIdx]
        const questions = getTestQuestions(testName)
        const q = questions[testState.questionIdx]
        if (!q) return null
        const total = questions.length
        const current = testState.questionIdx + 1
        const isBinary = getTestType(testName) === 'binary'
        const progressPct = Math.round(((current - 1) / total) * 100)
        return (
          <div className="px-4 py-3 space-y-3">
            {/* Test header + progress */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 font-medium">{getTestEmoji(testName)} {testName}</span>
              <span className="text-neutral-500">{current}/{total}</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full bg-blue-500"
                initial={false} animate={{width:`${progressPct}%`}} transition={{duration:0.3}}/>
            </div>

            {/* Question */}
            <div className="rounded-2xl border border-white/10 px-4 py-3.5 text-sm text-white leading-relaxed"
              style={{background:'rgba(255,255,255,0.05)'}}>
              {q.question}
            </div>

            {/* Answers */}
            {isBinary ? (
              /* MBTI: 2 option cards */
              <div className="space-y-2">
                {(q as any).options.map((opt: any, idx: number) => (
                  <motion.button key={idx} whileTap={{scale:0.97}}
                    onClick={()=>answerTestQuestion(q.id, idx, opt.text)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-white/10 text-sm text-left text-neutral-200 font-medium transition-all hover:border-blue-500/40 hover:text-white"
                    style={{background:'rgba(255,255,255,0.04)'}}>
                    {opt.text}
                  </motion.button>
                ))}
              </div>
            ) : (
              /* Rating 1-5 */
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] text-neutral-600 px-1">
                  <span>Pas du tout moi</span>
                  <span>C'est tout à fait moi!</span>
                </div>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(rating => (
                    <motion.button key={rating} whileTap={{scale:0.92}}
                      onClick={()=>answerTestQuestion(q.id, rating, String(rating))}
                      className="flex-1 py-4 rounded-2xl border border-white/10 text-sm font-bold text-neutral-300 transition-all hover:border-blue-500/40 hover:text-white hover:bg-blue-500/10"
                      style={{background:'rgba(255,255,255,0.04)'}}>
                      {rating}
                    </motion.button>
                  ))}
                </div>
                <div className="flex justify-between text-base px-1">
                  <span>😐</span><span>🔥</span>
                </div>
              </div>
            )}
          </div>
        )
      }

      case 'processing':
        return (
          <div className="px-4 py-4">
            <ProcessingCard/>
          </div>
        )

      case 'results': return null

      case 'jobs':
        return (
          <div className="px-4 py-3 space-y-3">
            {jobs.length > 0 ? (
              <>
                <p className="text-xs text-neutral-500 flex items-center gap-1.5"><Zap className="w-3 h-3 text-amber-400"/>Basés sur ton profil et tes passions · Clique pour explorer</p>
                {jobs.map((j,i)=>(
                  <JobCard key={i} job={j} index={i} onAskKlic={(title)=>{
                    setMsgs(prev=>[...prev,{id:Date.now()+'c',from:'klic',text:`Bonne question sur ${title}! 🎯\n\nDis-moi ce que tu veux savoir — salaire réel, études, quotidien, débouchés... Je t'explique tout 👇`}])
                    setChatInput(`Dis-moi tout sur le métier de ${title}`)
                    setStep('chat')
                  }}/>
                ))}
              </>
            ) : (
              <div className="text-center text-sm text-neutral-500 py-6">Aucun métier trouvé — lance d'abord <code className="text-blue-400">python3 setup_rag.py</code></div>
            )}
            <motion.button initial={{opacity:0}} animate={{opacity:1,transition:{delay:0.5}}}
              onClick={()=>{setMsgs(prev=>[...prev,{id:Date.now()+'c',from:'klic',text:`Tu as des questions sur ces métiers?\n\nJe suis là pour tout t'expliquer — salaires, études, quotidien, débouchés... Dis-moi! 💬`}]);setStep('chat')}}
              className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm"
              style={{background:'linear-gradient(135deg,#2563EB,#1D4ED8)'}}>
              Chat libre avec KLIC →
            </motion.button>
          </div>
        )

      case 'chat':
        return (
          <div className="px-4 pb-4 pt-2">
            {isChatLoading && (
              <div className="flex gap-3 mb-3">
                <KlicAvatar size="sm"/>
                <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm border" style={{background:'rgba(255,255,255,0.06)',borderColor:'rgba(255,255,255,0.08)'}}>
                  {[0,1,2].map(i=><motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400" animate={{scale:[1,1.4,1],opacity:[0.4,1,0.4]}} transition={{duration:0.8,repeat:Infinity,delay:i*0.18}}/>)}
                </div>
              </div>
            )}
            <div className="flex items-end gap-3 rounded-2xl px-4 py-3 transition-all" style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)'}}>
              <textarea value={chatInput} onChange={e=>setChatInput(e.target.value)}
                onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat()}}}
                placeholder="Écris ton message..." rows={1} disabled={isChatLoading}
                className="flex-1 bg-transparent text-white placeholder-neutral-600 resize-none text-sm leading-6 outline-none disabled:opacity-40 min-h-[24px] max-h-[100px]"/>
              <motion.button onClick={sendChat} disabled={!chatInput.trim()||isChatLoading} whileTap={{scale:0.9}}
                className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-25"
                style={{background:'linear-gradient(135deg,#2563EB,#1D4ED8)'}}>
                <Send className="w-4 h-4 text-white"/>
              </motion.button>
            </div>
          </div>
        )

      default: return null
    }
  }

  /* ── Progress bar ── */
  const stepOrder: Step[] = ['welcome','name','age','gender','city','situation','hobbies','motivation','fears','urgency','values','tests_intro','test_running','processing','results','jobs','chat']
  const progress = Math.round((stepOrder.indexOf(step)/stepOrder.length)*100)

  return (
    <div className="dark fixed inset-0 bg-[#080810] flex flex-col overflow-hidden">
      <AnimatedBackground/>

      {/* Header */}
      <header className="relative z-10 flex-shrink-0 border-b border-white/5">
        <div className="h-14 flex items-center px-4 max-w-2xl mx-auto w-full gap-4">
          <Link href="/" className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-200 transition-colors text-sm group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"/>
          </Link>
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KlicAvatar size="sm" pulse={step==='processing'}/>
                <div>
                  <p className="text-white font-semibold text-sm leading-none">KLIC</p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"/>en ligne</p>
                </div>
              </div>
              {step!=='welcome' && step!=='chat' && (
                <span className="text-xs text-neutral-500">{progress}%</span>
              )}
            </div>
            {step!=='welcome' && step!=='chat' && (
              <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full bg-blue-500" initial={false} animate={{width:`${progress}%`}} transition={{duration:0.4}}/>
              </div>
            )}
          </div>
          <Link href="/login" className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-neutral-400 hover:text-white transition-all">Connexion</Link>
        </div>
      </header>

      {/* Messages + inline input */}
      <main className="relative z-10 flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          {allMsgs.map(m=><ChatBubble key={m.id} msg={m}/>)}

          {/* Profile summary before values */}
          {step==='values' && Object.keys(profile).length>2 && (
            <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
              <ProfileSummaryCard profile={profile}/>
            </motion.div>
          )}

          <AnimatePresence>
            {renderInput() && (
              <motion.div key={step} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="-mx-4">
                {renderInput()}
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} className="h-2"/>
        </div>
      </main>
    </div>
  )
}
