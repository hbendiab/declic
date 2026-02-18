import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { spawn } from 'child_process'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const KLIC_SYSTEM_PROMPT = `Tu es KLIC, le coach IA de la plateforme DÉCLIK. Tu aides les jeunes de 14-19 ans à découvrir leur orientation professionnelle.

**Ton style:**
- Ton naturel, chaleureux, comme un ami bienveillant
- Langage accessible pour ados (mais pas trop familier)
- Utilise des emojis avec parcimonie (max 1-2 par message)
- Réponds en français
- Messages courts et dynamiques (3-5 phrases max sauf si on te demande des détails)

**Ta mission:**
- Aider à identifier les intérêts, passions et forces
- Présenter des métiers adaptés de façon claire
- Encourager et valoriser sans être condescendant
- Proposer de passer les tests d'orientation quand c'est pertinent

**Contexte RAG (métiers):**
Si des métiers sont fournis dans le contexte, présente-les de manière engageante en mentionnant :
- Le titre du métier
- Ce qui le rend intéressant
- Le secteur
- La fourchette de salaire si disponible
Limite-toi à 3 métiers maximum par réponse pour ne pas noyer l'utilisateur.

**Important:** Ne mentionne JAMAIS que tu utilises une base de données ou un système RAG. Parle des métiers naturellement comme si tu les connaissais.`

async function searchJobs(query: string): Promise<any[]> {
  return new Promise((resolve) => {
    const pythonProcess = spawn('python3', [
      'search_jobs.py',
      query,
      '5',
    ])

    let dataString = ''
    let errorString = ''

    pythonProcess.stdout.on('data', (data: Buffer) => {
      dataString += data.toString()
    })

    pythonProcess.stderr.on('data', (data: Buffer) => {
      errorString += data.toString()
    })

    pythonProcess.on('close', () => {
      try {
        const results = JSON.parse(dataString)
        resolve(results.jobs || [])
      } catch {
        resolve([])
      }
    })

    pythonProcess.on('error', () => resolve([]))
    setTimeout(() => {
      pythonProcess.kill()
      resolve([])
    }, 10000)
  })
}

function buildRAGContext(jobs: any[]): string {
  if (!jobs || jobs.length === 0) return ''

  const jobsList = jobs
    .slice(0, 5)
    .map(
      (job) =>
        `- ${job.title} (${job.sector}) | Salaire: ${job.salary_min || '?'}-${job.salary_max || '?'} EUR | Score: ${job.relevance_score}`
    )
    .join('\n')

  return `\n\n[Métiers pertinents trouvés dans la base de données:\n${jobsList}]`
}

function shouldSearchJobs(message: string): boolean {
  const triggers = [
    'métier', 'travail', 'job', 'carrière', 'profession', 'boulot',
    'orientation', 'études', 'formation', 'futur', 'avenir',
    'j\'aime', 'je veux', 'passion', 'talent', 'compétence',
    'salaire', 'argent', 'rémunération', 'secteur', 'domaine',
    'ingénieur', 'développeur', 'médecin', 'artiste', 'commercial',
    'créatif', 'numérique', 'technologie', 'science', 'art',
    'trouver', 'chercher', 'découvrir', 'explorer',
  ]
  const lower = message.toLowerCase()
  return triggers.some((trigger) => lower.includes(trigger))
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages requis' }, { status: 400 })
    }

    const lastUserMessage = messages[messages.length - 1]?.content || ''

    // RAG: chercher des métiers si pertinent
    let ragContext = ''
    let jobResults: any[] = []

    if (shouldSearchJobs(lastUserMessage)) {
      jobResults = await searchJobs(lastUserMessage)
      ragContext = buildRAGContext(jobResults)
    }

    // Préparer les messages pour OpenAI
    const systemMessage = KLIC_SYSTEM_PROMPT + ragContext

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMessage },
        ...messages.map((m: any) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const assistantMessage = completion.choices[0]?.message?.content || ''

    return NextResponse.json({
      message: assistantMessage,
      jobs: jobResults.slice(0, 3),
    })
  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Erreur du serveur', details: error.message },
      { status: 500 }
    )
  }
}
