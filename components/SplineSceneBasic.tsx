'use client'

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/Card"
import { Spotlight } from "@/components/ui/spotlight"
import Link from "next/link"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"

const TESTIMONIALS = [
  {
    avatar: 'L',
    gradient: 'from-blue-500 to-cyan-500',
    quote: '"Je préfère parler à un bot parce qu\'il me comprend mieux qu\'un adulte 😊"',
    name: 'Lucas',
    age: 16,
    city: 'Lyon',
  },
  {
    avatar: 'M',
    gradient: 'from-purple-500 to-pink-500',
    quote: '"KLIC me comprend mieux que mes parents. Sérieusement."',
    name: 'Marie',
    age: 17,
    city: 'Marseille',
  },
  {
    avatar: 'T',
    gradient: 'from-emerald-500 to-teal-500',
    quote: '"Enfin un truc qui me parle sans me juger 😊 J\'ai enfin une direction."',
    name: 'Thomas',
    age: 18,
    city: 'Paris',
  },
]

export function SplineSceneBasic() {
  return (
    <div className="w-full flex flex-col gap-16 pb-20">

      {/* ── Chatbot card ── */}
      <Card className="w-full h-[500px] bg-transparent border-0 shadow-none relative overflow-hidden">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        <div className="flex h-full">
          {/* Left content */}
          <div className="flex-1 pl-24 pr-48 py-8 relative z-10 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
              Salut! Je suis <span style={{color:'#8b0000',WebkitTextFillColor:'#8b0000'}}>KLIC</span>
            </h1>
            <p className="mt-4 text-neutral-300 max-w-lg">
              Ton conseiller en orientation.
              Prêt à te connaître et trouver ta vraie voie?
            </p>
            <Link
              href="/login"
              className="mt-8 inline-block px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-colors duration-200 text-center w-fit"
            >
              Commencer →
            </Link>
          </div>

          {/* Right content - Robot Spline */}
          <div className="flex-1 relative">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </Card>

      {/* ── Testimonials ── */}
      <div className="px-8 max-w-5xl mx-auto w-full">
        <motion.h2
          initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}}
          className="text-3xl font-bold text-white text-center mb-10"
        >
          Ce que les élèves en pensent{' '}
          <span className="text-2xl">💭</span>
        </motion.h2>

        <div className="grid grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{opacity:0,y:28}} animate={{opacity:1,y:0}}
              transition={{delay:i*0.15,duration:0.55,ease:'easeOut'}}
              className="rounded-2xl border border-white/10 p-6 flex flex-col gap-5"
              style={{background:'rgba(255,255,255,0.05)',backdropFilter:'blur(14px)'}}
            >
              {/* Avatar */}
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                {t.avatar}
              </div>

              {/* Quote */}
              <p className="text-neutral-200 text-sm leading-relaxed flex-1 italic">
                {t.quote}
              </p>

              {/* Name + stars */}
              <div>
                <p className="text-white font-semibold text-sm">— {t.name}, {t.age}</p>
                <p className="text-neutral-500 text-xs mt-0.5">{t.city}</p>
                <div className="flex gap-0.5 mt-2">
                  {'⭐⭐⭐⭐⭐'.split('').map((s, si) => (
                    <span key={si} className="text-sm">{s}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Pricing ── */}
      <div className="px-8 max-w-4xl mx-auto w-full">
        <motion.h2
          initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}}
          className="text-3xl font-bold text-white text-center mb-3"
        >
          Simple et transparent 💸
        </motion.h2>
        <motion.p
          initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}}
          className="text-neutral-500 text-center text-sm mb-10"
        >
          Commence gratuitement, débloque tout quand tu es prêt
        </motion.p>

        <div className="grid grid-cols-2 gap-6">

          {/* Gratuit */}
          <motion.div
            initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.15,duration:0.5}}
            className="rounded-2xl border border-white/10 p-7 flex flex-col gap-5"
            style={{background:'rgba(255,255,255,0.04)'}}
          >
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-1">Gratuit</p>
              <p className="text-4xl font-bold text-white">0 €</p>
              <p className="text-neutral-500 text-sm mt-1">Pour toujours</p>
            </div>

            <div className="space-y-3 flex-1">
              {[
                '1 test au choix',
                '5 messages avec KLIC',
                '3 métiers recommandés',
              ].map(f => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-neutral-300">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0"/>
                  {f}
                </div>
              ))}
              {[
                'Tous les tests',
                'Chat illimité',
                'Plan d\'action PDF',
              ].map(f => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-neutral-600">
                  <X className="w-4 h-4 flex-shrink-0"/>
                  {f}
                </div>
              ))}
            </div>

            <Link href="/chatbot"
              className="block w-full py-3 rounded-2xl border border-white/15 text-neutral-300 text-sm font-semibold text-center hover:border-white/30 hover:text-white transition-all">
              Commencer gratuitement
            </Link>
          </motion.div>

          {/* Premium */}
          <motion.div
            initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.25,duration:0.5}}
            className="rounded-2xl border border-amber-500/40 p-7 flex flex-col gap-5 relative overflow-hidden"
            style={{background:'rgba(251,191,36,0.06)'}}
          >
            {/* Badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-br from-amber-400 to-orange-500 text-black text-xs font-bold px-4 py-1.5 rounded-bl-2xl">
              ⭐ Recommandé
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">Accès total</p>
              <p className="text-4xl font-bold text-white">4,99 €</p>
              <p className="text-neutral-500 text-sm mt-1">Une seule fois · Accès à vie</p>
            </div>

            <div className="space-y-3 flex-1">
              {[
                'Les 4 tests complets',
                'Chat KLIC illimité',
                '500+ métiers détaillés',
                'Plan d\'action PDF personnalisé',
                'Support prioritaire 12 mois',
              ].map(f => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-neutral-200">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0"/>
                  {f}
                </div>
              ))}
            </div>

            <Link href="/upgrade"
              className="block w-full py-3 rounded-2xl text-sm font-bold text-center text-black transition-all hover:opacity-90"
              style={{background:'linear-gradient(135deg,#F59E0B,#EA580C)'}}>
              Débloquer pour 4,99 € →
            </Link>
          </motion.div>

        </div>

        <p className="text-center text-xs text-neutral-600 mt-6">
          Garantie satisfait ou remboursé 30 jours · Aucun abonnement
        </p>
      </div>

    </div>
  )
}
