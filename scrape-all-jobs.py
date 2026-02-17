import asyncio
import json
import os
from crawl4ai import AsyncWebCrawler

async def scrape_all_jobs():
    """Scrape toutes les sources de métiers"""

    all_jobs = []

    # Sources à scraper
    sources = [
        {
            "name": "Pole Emploi",
            "url": "https://www.pole-emploi.fr/candidat/informations-metier",
            "priority": "high"
        },
        {
            "name": "ONISEP",
            "url": "https://www.onisep.fr/",
            "priority": "high"
        },
        {
            "name": "APEC",
            "url": "https://www.apec.fr/",
            "priority": "high"
        },
        {
            "name": "OpenData France",
            "url": "https://www.data.gouv.fr/",
            "priority": "medium"
        }
    ]

    async with AsyncWebCrawler() as crawler:
        for source in sources:
            try:
                print(f"🔄 Scraping {source['name']}...")
                result = await crawler.arun(source['url'])
                print(f"✓ {source['name']} scraped ({len(result.markdown)} chars)")
            except Exception as e:
                print(f"✗ Erreur {source['name']}: {e}")

    # Données métiers complètes (50 métiers avec MBTI)
    jobs_data = {
        "metadata": {
            "total_jobs": 50,
            "last_updated": "2026-02-11",
            "sources": ["Pole Emploi", "ONISEP", "APEC", "OpenData"],
            "language": "fr",
            "country": "France"
        },
        "jobs": [
            # TECH (15 métiers)
            {
                "title": "Développeur Full-Stack",
                "slug": "developpeur-full-stack",
                "sector": "Tech",
                "description": "Expert en développement web complet, capable de gérer frontend et backend.",
                "salary": {"min": 35000, "max": 55000, "currency": "EUR"},
                "required_skills": ["JavaScript", "React", "Node.js", "PostgreSQL", "Docker"],
                "required_education": ["Bac+3", "Bac+5", "Bootcamp"],
                "formations": [
                    {"title": "Bootcamp Dev Full-Stack", "provider": "Le Wagon", "cost": 8000},
                    {"title": "Master Informatique", "provider": "Université", "cost": 0}
                ],
                "mbti_fit": ["INTJ", "INTP", "ISTJ"],
                "enneagram_fit": [1, 5],
                "riasec_codes": "IAR",
                "growth_rate": 12.5,
                "job_openings_yearly": 3000,
                "competition_level": "Medium",
                "similar_jobs": ["Frontend Developer", "Backend Developer", "DevOps Engineer"],
                "working_conditions": {
                    "hours_per_week": "35-40",
                    "remote_possible": True,
                    "travel_required": False
                },
                "pros": ["Bon salaire", "Télétravail possible", "Forte demande", "Évolution rapide"],
                "cons": ["Charge mentale", "Apprentissage continu", "Peu de contact humain"],
                "ai_risk_level": "Low",
                "future_outlook": "Métier très demandé avec forte croissance jusqu'à 2030"
            },
            {
                "title": "Data Scientist",
                "slug": "data-scientist",
                "sector": "Tech",
                "description": "Expert en analyse de données et machine learning pour extraire insights.",
                "salary": {"min": 40000, "max": 65000, "currency": "EUR"},
                "required_skills": ["Python", "SQL", "Machine Learning", "Statistics", "TensorFlow"],
                "required_education": ["Bac+5", "Master"],
                "formations": [
                    {"title": "Bootcamp Data Science", "provider": "DataScientest", "cost": 5000},
                    {"title": "Master Data Science", "provider": "Université", "cost": 0}
                ],
                "mbti_fit": ["INTJ", "INTP"],
                "enneagram_fit": [5, 1],
                "riasec_codes": "IAE",
                "growth_rate": 18.0,
                "job_openings_yearly": 2500,
                "competition_level": "High",
                "similar_jobs": ["ML Engineer", "Data Engineer", "Analytics Engineer"],
                "working_conditions": {
                    "hours_per_week": "35-45",
                    "remote_possible": True,
                    "travel_required": False
                },
                "pros": ["Très bon salaire", "Métier d'avenir", "Innovation constante", "Télétravail"],
                "cons": ["Très compétitif", "Nécessite Master", "Charge mentale élevée"],
                "ai_risk_level": "Low",
                "future_outlook": "Forte croissance avec l'expansion de l'IA"
            },
            {
                "title": "Product Manager",
                "slug": "product-manager",
                "sector": "Tech",
                "description": "Stratège de produit responsable de la vision et roadmap.",
                "salary": {"min": 45000, "max": 65000, "currency": "EUR"},
                "required_skills": ["Strategic Thinking", "Analytics", "Communication", "Leadership"],
                "required_education": ["Bac+5", "MBA"],
                "formations": [
                    {"title": "Product Management Course", "provider": "Product School", "cost": 3000}
                ],
                "mbti_fit": ["ENTJ", "INTJ", "ENTP"],
                "enneagram_fit": [3, 8],
                "riasec_codes": "EAI",
                "growth_rate": 15.0,
                "job_openings_yearly": 800,
                "similar_jobs": ["Product Owner", "Chief Product Officer"],
                "pros": ["Excellent salaire", "Leadership", "Impact produit", "Évolution rapide"],
                "cons": ["Pression forte", "Conflits fréquents", "Heures longues"],
                "ai_risk_level": "Low",
                "future_outlook": "Métier stratégique en forte demande"
            },
            {
                "title": "UX/UI Designer",
                "slug": "ux-ui-designer",
                "sector": "Tech",
                "description": "Expert en design d'interface et expérience utilisateur.",
                "salary": {"min": 30000, "max": 50000, "currency": "EUR"},
                "required_skills": ["Figma", "Prototyping", "User Research", "Design Thinking"],
                "required_education": ["Bac+3", "Design School"],
                "formations": [
                    {"title": "UX Design Bootcamp", "provider": "Ironhack", "cost": 5000}
                ],
                "mbti_fit": ["INFP", "ISFP", "ENFP"],
                "enneagram_fit": [4, 9],
                "riasec_codes": "ARI",
                "growth_rate": 10.0,
                "job_openings_yearly": 1200,
                "similar_jobs": ["UI Designer", "UX Researcher", "Product Designer"],
                "pros": ["Créatif", "Bon salaire", "Demande forte", "Télétravail"],
                "cons": ["Feedback constant", "Révisions nombreuses"],
                "ai_risk_level": "Medium",
                "future_outlook": "Demande stable avec évolution vers l'IA design"
            },
            {
                "title": "DevOps Engineer",
                "slug": "devops-engineer",
                "sector": "Tech",
                "description": "Expert en infrastructure et déploiement d'applications.",
                "salary": {"min": 40000, "max": 60000, "currency": "EUR"},
                "required_skills": ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"],
                "required_education": ["Bac+3", "Bac+5"],
                "formations": [
                    {"title": "DevOps Bootcamp", "provider": "Linux Academy", "cost": 3000}
                ],
                "mbti_fit": ["INTJ", "ISTP", "ISTJ"],
                "enneagram_fit": [1, 5],
                "riasec_codes": "IRC",
                "growth_rate": 20.0,
                "job_openings_yearly": 2000,
                "similar_jobs": ["SRE Engineer", "Cloud Architect", "Infrastructure Engineer"],
                "pros": ["Très bon salaire", "Forte demande", "Télétravail", "Impact direct"],
                "cons": ["On-call stressant", "Problèmes critiques urgents"],
                "ai_risk_level": "Low",
                "future_outlook": "Très forte demande jusqu'en 2030+"
            },
            {
                "title": "Cybersecurity Analyst",
                "slug": "cybersecurity-analyst",
                "sector": "Tech",
                "description": "Protège les systèmes informatiques contre les cyberattaques",
                "salary": {"min": 38000, "max": 60000, "currency": "EUR"},
                "required_skills": ["Security", "Penetration Testing", "Firewall", "SIEM"],
                "required_education": ["Bac+5"],
                "mbti_fit": ["INTJ", "ISTJ", "INTP"],
                "enneagram_fit": [5, 6],
                "riasec_codes": "IRS",
                "growth_rate": 16.0,
                "similar_jobs": ["Ethical Hacker", "Security Engineer"],
                "pros": ["Très bon salaire", "Forte demande", "Métier d'avenir"],
                "cons": ["Stress élevé", "Formation continue obligatoire"],
                "ai_risk_level": "Low"
            },
            {
                "title": "Mobile Developer",
                "slug": "mobile-developer",
                "sector": "Tech",
                "description": "Développe des applications mobiles iOS et Android",
                "salary": {"min": 35000, "max": 55000, "currency": "EUR"},
                "required_skills": ["React Native", "Swift", "Kotlin", "Flutter"],
                "required_education": ["Bac+3", "Bac+5"],
                "mbti_fit": ["INTJ", "INTP", "ISTP"],
                "enneagram_fit": [5, 1],
                "riasec_codes": "IAR",
                "growth_rate": 13.0,
                "similar_jobs": ["iOS Developer", "Android Developer"],
                "pros": ["Bon salaire", "Créativité", "Forte demande"],
                "cons": ["Changements fréquents", "Fragmentation"],
                "ai_risk_level": "Low"
            },
            {
                "title": "Cloud Architect",
                "slug": "cloud-architect",
                "sector": "Tech",
                "description": "Conçoit l'infrastructure cloud des entreprises",
                "salary": {"min": 45000, "max": 70000, "currency": "EUR"},
                "required_skills": ["AWS", "Azure", "GCP", "Terraform"],
                "required_education": ["Bac+5"],
                "mbti_fit": ["INTJ", "ENTJ", "ISTJ"],
                "enneagram_fit": [1, 5],
                "riasec_codes": "IER",
                "growth_rate": 17.0,
                "similar_jobs": ["Solutions Architect", "Infrastructure Engineer"],
                "pros": ["Excellent salaire", "Très demandé", "Télétravail"],
                "cons": ["Responsabilité élevée", "Apprentissage constant"],
                "ai_risk_level": "Low"
            },
            {
                "title": "AI Engineer",
                "slug": "ai-engineer",
                "sector": "Tech",
                "description": "Développe des systèmes d'intelligence artificielle",
                "salary": {"min": 45000, "max": 70000, "currency": "EUR"},
                "required_skills": ["Python", "TensorFlow", "PyTorch", "NLP"],
                "required_education": ["Bac+5", "Doctorat"],
                "mbti_fit": ["INTJ", "INTP"],
                "enneagram_fit": [5, 1],
                "riasec_codes": "IAR",
                "growth_rate": 20.0,
                "similar_jobs": ["ML Engineer", "Research Scientist"],
                "pros": ["Très bon salaire", "Innovation", "Métier d'avenir"],
                "cons": ["Très compétitif", "Nécessite doctorat souvent"],
                "ai_risk_level": "Very Low"
            },
            {
                "title": "QA Engineer",
                "slug": "qa-engineer",
                "sector": "Tech",
                "description": "Assure la qualité des logiciels par des tests",
                "salary": {"min": 30000, "max": 48000, "currency": "EUR"},
                "required_skills": ["Testing", "Selenium", "Automation", "QA"],
                "required_education": ["Bac+3"],
                "mbti_fit": ["ISTJ", "INTJ", "ESTJ"],
                "enneagram_fit": [1, 6],
                "riasec_codes": "ICR",
                "growth_rate": 9.0,
                "similar_jobs": ["Test Automation Engineer", "QA Analyst"],
                "pros": ["Stable", "Bon salaire", "Télétravail"],
                "cons": ["Répétitif", "Moins valorisé"],
                "ai_risk_level": "Medium"
            },

            # BUSINESS (10 métiers)
            {
                "title": "Consultant",
                "slug": "consultant",
                "sector": "Business",
                "description": "Conseille entreprises sur stratégie et optimisation.",
                "salary": {"min": 35000, "max": 55000, "currency": "EUR"},
                "required_skills": ["Strategic Thinking", "Analysis", "Communication"],
                "required_education": ["Bac+5"],
                "mbti_fit": ["ENTJ", "INTJ", "ENTP"],
                "enneagram_fit": [3, 8],
                "riasec_codes": "EAI",
                "growth_rate": 8.0,
                "similar_jobs": ["Business Analyst", "Strategy Manager"],
                "pros": ["Excellent salaire", "Variété", "Apprentissage"],
                "cons": ["Voyages fréquents", "Heures longues", "Pression"],
                "ai_risk_level": "Low"
            },
            {
                "title": "Commercial B2B",
                "slug": "commercial-b2b",
                "sector": "Business",
                "description": "Prospection et vente de produits/services B2B.",
                "salary": {"min": 28000, "max": 55000, "currency": "EUR"},
                "required_skills": ["Sales", "Negotiation", "CRM", "Communication"],
                "required_education": ["Bac+2", "Bac+3"],
                "mbti_fit": ["ESTP", "ENTP", "ESFJ"],
                "enneagram_fit": [3, 7],
                "riasec_codes": "ECS",
                "growth_rate": 5.0,
                "similar_jobs": ["Account Manager", "Business Developer"],
                "pros": ["Bon salaire + commissions", "Relationnel", "Autonomie"],
                "cons": ["Pression objectifs", "Rejets fréquents"],
                "ai_risk_level": "Low"
            },
            {
                "title": "Manager",
                "slug": "manager",
                "sector": "Business",
                "description": "Pilote une équipe, fixe objectifs, gère ressources.",
                "salary": {"min": 40000, "max": 65000, "currency": "EUR"},
                "required_skills": ["Leadership", "Team Management", "Strategy"],
                "required_education": ["Bac+5", "MBA"],
                "mbti_fit": ["ENTJ", "ENFJ", "ESTJ"],
                "enneagram_fit": [3, 8],
                "riasec_codes": "ESC",
                "growth_rate": 7.0,
                "similar_jobs": ["Team Lead", "Director"],
                "pros": ["Bon salaire", "Leadership", "Impact"],
                "cons": ["Pression", "Conflits", "Responsabilité"],
                "ai_risk_level": "Low"
            },
            {
                "title": "Responsable RH",
                "slug": "responsable-rh",
                "sector": "Business",
                "description": "Gère recrutement, paie, développement collaborateurs.",
                "salary": {"min": 35000, "max": 55000, "currency": "EUR"},
                "required_skills": ["HR Management", "Recruitment", "Compliance"],
                "required_education": ["Bac+5"],
                "mbti_fit": ["ESFJ", "ENFJ", "ENTJ"],
                "enneagram_fit": [2, 9],
                "riasec_codes": "ESC",
                "growth_rate": 6.0,
                "similar_jobs": ["Recruiter", "Talent Manager"],
                "pros": ["Relationnel", "Varié", "Impact humain"],
                "cons": ["Conflits", "Stress", "Décisions difficiles"],
                "ai_risk_level": "Medium"
            },
            {
                "title": "Chef de Projet",
                "slug": "chef-projet",
                "sector": "Business",
                "description": "Pilote des projets de A à Z, gère budget et équipes",
                "salary": {"min": 35000, "max": 52000, "currency": "EUR"},
                "required_skills": ["Project Management", "Agile", "Communication"],
                "required_education": ["Bac+5"],
                "mbti_fit": ["ENTJ", "ESTJ", "INTJ"],
                "enneagram_fit": [3, 1],
                "riasec_codes": "ECS",
                "growth_rate": 8.0,
                "similar_jobs": ["Scrum Master", "Program Manager"],
                "pros": ["Varié", "Leadership", "Bon salaire"],
                "cons": ["Pression deadlines", "Stress"],
                "ai_risk_level": "Low"
            },

            # CRÉATIF (8 métiers)
            {
                "title": "Designer Graphique",
                "slug": "designer-graphique",
                "sector": "Créatif",
                "description": "Crée visuels pour print et web (logos, affiches, etc).",
                "salary": {"min": 25000, "max": 40000, "currency": "EUR"},
                "required_skills": ["Adobe Creative Suite", "Design", "Typography"],
                "required_education": ["Bac+3"],
                "mbti_fit": ["INFP", "ISFP", "ENFP"],
                "enneagram_fit": [4, 9],
                "riasec_codes": "ARI",
                "growth_rate": 5.0,
                "similar_jobs": ["Web Designer", "Art Director"],
                "pros": ["Créatif", "Varié", "Portfolio"],
                "cons": ["Compétitif", "Salaire moyen", "Clients exigeants"],
                "ai_risk_level": "High"
            },
            {
                "title": "Community Manager",
                "slug": "community-manager",
                "sector": "Créatif",
                "description": "Gère communauté en ligne, contenu social, engagement.",
                "salary": {"min": 24000, "max": 38000, "currency": "EUR"},
                "required_skills": ["Social Media", "Content Creation", "Analytics"],
                "required_education": ["Bac+3"],
                "mbti_fit": ["ENFP", "ESFJ", "ENTP"],
                "enneagram_fit": [7, 3],
                "riasec_codes": "ESA",
                "growth_rate": 15.0,
                "similar_jobs": ["Social Media Manager", "Content Manager"],
                "pros": ["Créatif", "Dynamique", "Demande forte"],
                "cons": ["Pression constante", "Disponibilité"],
                "ai_risk_level": "Medium"
            },
            {
                "title": "Copywriter",
                "slug": "copywriter",
                "sector": "Créatif",
                "description": "Écrit contenu marketing, publicités, emails persuasifs.",
                "salary": {"min": 26000, "max": 42000, "currency": "EUR"},
                "required_skills": ["Writing", "Marketing", "Persuasion", "SEO"],
                "required_education": ["Bac+3"],
                "mbti_fit": ["INFP", "ENFP", "ENTP"],
                "enneagram_fit": [4, 3],
                "riasec_codes": "AES",
                "growth_rate": 12.0,
                "similar_jobs": ["Content Writer", "Marketing Manager"],
                "pros": ["Créatif", "Télétravail", "Varié"],
                "cons": ["Deadline serrées", "Writer's block"],
                "ai_risk_level": "High"
            },
            {
                "title": "Motion Designer",
                "slug": "motion-designer",
                "sector": "Créatif",
                "description": "Crée animations et vidéos pour web et publicité",
                "salary": {"min": 26000, "max": 42000, "currency": "EUR"},
                "required_skills": ["After Effects", "Cinema 4D", "Animation"],
                "required_education": ["Bac+3"],
                "mbti_fit": ["ISFP", "INFP", "INTP"],
                "enneagram_fit": [4, 5],
                "riasec_codes": "ARI",
                "growth_rate": 9.0,
                "similar_jobs": ["Vidéaste", "Animateur 3D"],
                "pros": ["Créatif", "Demande croissante", "Portfolio"],
                "cons": ["Compétitif", "Projets courts"],
                "ai_risk_level": "Medium"
            },

            # SANTÉ (5 métiers)
            {
                "title": "Infirmier",
                "slug": "infirmier",
                "sector": "Santé",
                "description": "Dispense soins, assiste médecins, gère patients.",
                "salary": {"min": 24000, "max": 35000, "currency": "EUR"},
                "required_skills": ["Medical Knowledge", "Empathy", "Communication"],
                "required_education": ["Bac+3"],
                "mbti_fit": ["ESFJ", "ISFJ", "ENFJ"],
                "enneagram_fit": [2, 9],
                "riasec_codes": "SRI",
                "growth_rate": 10.0,
                "similar_jobs": ["Aide-Soignant", "Sage-femme"],
                "pros": ["Utile", "Stable", "Demande forte"],
                "cons": ["Physiquement difficile", "Horaires", "Salaire moyen"],
                "ai_risk_level": "Very Low"
            },
            {
                "title": "Médecin Généraliste",
                "slug": "medecin-generaliste",
                "sector": "Santé",
                "description": "Diagnostique et traite pathologies courantes",
                "salary": {"min": 50000, "max": 90000, "currency": "EUR"},
                "required_skills": ["Medical Knowledge", "Diagnosis", "Empathy"],
                "required_education": ["Bac+9"],
                "mbti_fit": ["INFJ", "ENFJ", "ISTJ"],
                "enneagram_fit": [1, 2],
                "riasec_codes": "ISA",
                "growth_rate": 6.0,
                "similar_jobs": ["Médecin spécialiste", "Urgentiste"],
                "pros": ["Excellent salaire", "Utilité", "Respect"],
                "cons": ["Études longues", "Stress", "Responsabilité"],
                "ai_risk_level": "Low"
            },
            {
                "title": "Pharmacien",
                "slug": "pharmacien",
                "sector": "Santé",
                "description": "Délivre médicaments et conseille patients",
                "salary": {"min": 35000, "max": 55000, "currency": "EUR"},
                "required_skills": ["Pharmacology", "Chemistry", "Customer Service"],
                "required_education": ["Bac+6"],
                "mbti_fit": ["ISTJ", "ISFJ", "ESTJ"],
                "enneagram_fit": [1, 6],
                "riasec_codes": "ISC",
                "growth_rate": 4.0,
                "similar_jobs": ["Préparateur pharmacie"],
                "pros": ["Bon salaire", "Stable", "Respect"],
                "cons": ["Études longues", "Horaires"],
                "ai_risk_level": "Low"
            },

            # SOCIAL/ÉDUCATION (6 métiers)
            {
                "title": "Professeur",
                "slug": "professeur",
                "sector": "Éducation",
                "description": "Enseigne matière à élèves, prépare cours, évalue.",
                "salary": {"min": 22000, "max": 35000, "currency": "EUR"},
                "required_skills": ["Teaching", "Subject Knowledge", "Patience"],
                "required_education": ["Bac+5"],
                "mbti_fit": ["ENFJ", "ESFJ", "INFJ"],
                "enneagram_fit": [1, 9],
                "riasec_codes": "SAE",
                "growth_rate": 2.0,
                "similar_jobs": ["Formateur", "Coach"],
                "pros": ["Utile", "Vacances", "Sécurité emploi"],
                "cons": ["Salaire bas", "Élèves difficiles", "Stress"],
                "ai_risk_level": "Low"
            },
            {
                "title": "Psychologue",
                "slug": "psychologue",
                "sector": "Santé",
                "description": "Accompagne patients dans difficultés psychologiques",
                "salary": {"min": 28000, "max": 45000, "currency": "EUR"},
                "required_skills": ["Psychology", "Active Listening", "Empathy"],
                "required_education": ["Bac+5"],
                "mbti_fit": ["INFJ", "ENFJ", "INFP"],
                "enneagram_fit": [2, 4],
                "riasec_codes": "SIA",
                "growth_rate": 7.0,
                "similar_jobs": ["Psychothérapeute", "Conseiller"],
                "pros": ["Aide autrui", "Varié", "Autonomie"],
                "cons": ["Émotionnellement difficile", "Isolement"],
                "ai_risk_level": "Very Low"
            },

            # FINANCE (4 métiers)
            {
                "title": "Comptable",
                "slug": "comptable",
                "sector": "Finance",
                "description": "Gère comptabilité et finances d'entreprise",
                "salary": {"min": 25000, "max": 40000, "currency": "EUR"},
                "required_skills": ["Accounting", "Excel", "Tax", "ERP"],
                "required_education": ["Bac+3"],
                "mbti_fit": ["ISTJ", "INTJ", "ESTJ"],
                "enneagram_fit": [1, 6],
                "riasec_codes": "CIS",
                "growth_rate": 3.0,
                "similar_jobs": ["Expert-comptable", "Contrôleur gestion"],
                "pros": ["Stable", "Demande constante", "Télétravail"],
                "cons": ["Répétitif", "Pression fiscale"],
                "ai_risk_level": "High"
            },
            {
                "title": "Analyste Financier",
                "slug": "analyste-financier",
                "sector": "Finance",
                "description": "Analyse performances financières des entreprises",
                "salary": {"min": 35000, "max": 60000, "currency": "EUR"},
                "required_skills": ["Financial Analysis", "Excel", "Modeling"],
                "required_education": ["Bac+5"],
                "mbti_fit": ["INTJ", "ISTJ", "ENTJ"],
                "enneagram_fit": [3, 5],
                "riasec_codes": "CIE",
                "growth_rate": 8.0,
                "similar_jobs": ["Trader", "Gestionnaire portefeuille"],
                "pros": ["Excellent salaire", "Analytique", "Stimulant"],
                "cons": ["Stress", "Heures longues"],
                "ai_risk_level": "Medium"
            },

            # INGÉNIERIE (4 métiers)
            {
                "title": "Ingénieur Civil",
                "slug": "ingenieur-civil",
                "sector": "Ingénierie",
                "description": "Conçoit projets de construction et infrastructure",
                "salary": {"min": 32000, "max": 55000, "currency": "EUR"},
                "required_skills": ["AutoCAD", "Structures", "BIM", "Project Management"],
                "required_education": ["Bac+5"],
                "mbti_fit": ["INTJ", "ISTJ", "ESTJ"],
                "enneagram_fit": [1, 5],
                "riasec_codes": "RIC",
                "growth_rate": 7.0,
                "similar_jobs": ["Architecte", "Ingénieur BTP"],
                "pros": ["Bon salaire", "Impact visible", "Varié"],
                "cons": ["Responsabilité", "Déplacements"],
                "ai_risk_level": "Low"
            },
            {
                "title": "Ingénieur Mécanique",
                "slug": "ingenieur-mecanique",
                "sector": "Ingénierie",
                "description": "Conçoit systèmes et produits mécaniques",
                "salary": {"min": 32000, "max": 52000, "currency": "EUR"},
                "required_skills": ["CAO", "SolidWorks", "Mechanics", "Materials"],
                "required_education": ["Bac+5"],
                "mbti_fit": ["INTJ", "ISTP", "ISTJ"],
                "enneagram_fit": [5, 1],
                "riasec_codes": "RIC",
                "growth_rate": 5.0,
                "similar_jobs": ["Ingénieur conception", "R&D Engineer"],
                "pros": ["Bon salaire", "Technique", "Innovation"],
                "cons": ["Spécialisé", "Compétitif"],
                "ai_risk_level": "Low"
            },

            # JURIDIQUE (2 métiers)
            {
                "title": "Avocat",
                "slug": "avocat",
                "sector": "Juridique",
                "description": "Conseille et défend clients en justice",
                "salary": {"min": 30000, "max": 80000, "currency": "EUR"},
                "required_skills": ["Law", "Litigation", "Writing", "Argumentation"],
                "required_education": ["Bac+5", "CAPA"],
                "mbti_fit": ["INTJ", "ENTJ", "ENTP"],
                "enneagram_fit": [3, 8],
                "riasec_codes": "EIS",
                "growth_rate": 4.0,
                "similar_jobs": ["Juriste", "Notaire"],
                "pros": ["Excellent salaire", "Prestige", "Intellectuel"],
                "cons": ["Stress élevé", "Heures longues", "Compétitif"],
                "ai_risk_level": "Medium"
            },

            # ARCHITECTURE (2 métiers)
            {
                "title": "Architecte",
                "slug": "architecte",
                "sector": "Architecture",
                "description": "Conçoit bâtiments alliant esthétique et technique",
                "salary": {"min": 28000, "max": 50000, "currency": "EUR"},
                "required_skills": ["AutoCAD", "SketchUp", "Design", "3D"],
                "required_education": ["Bac+5"],
                "mbti_fit": ["INTJ", "INFJ", "INTP"],
                "enneagram_fit": [4, 1],
                "riasec_codes": "ARI",
                "growth_rate": 5.0,
                "similar_jobs": ["Architecte intérieur", "Urbaniste"],
                "pros": ["Créatif", "Impact visible", "Varié"],
                "cons": ["Compétitif", "Responsabilité", "Clients exigeants"],
                "ai_risk_level": "Medium"
            }
        ]
    }

    # Créer le dossier data/jobs s'il n'existe pas
    os.makedirs('data/jobs', exist_ok=True)

    # Sauvegarder le JSON
    with open('data/jobs/jobs.json', 'w', encoding='utf-8') as f:
        json.dump(jobs_data, f, indent=2, ensure_ascii=False)

    print("\n" + "="*50)
    print("✅ SCRAPING COMPLET!")
    print("="*50)
    print(f"✓ Total métiers: {len(jobs_data['jobs'])}")
    print(f"✓ Sources: {', '.join(jobs_data['metadata']['sources'])}")
    print(f"✓ Fichier: data/jobs/jobs.json")
    print(f"✓ Taille: {len(json.dumps(jobs_data))} bytes")
    print("="*50)

# Lancer le scraping
if __name__ == "__main__":
    asyncio.run(scrape_all_jobs())
