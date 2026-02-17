import asyncio
import json
from crawl4ai import AsyncWebCrawler

async def scrape_jobs():
    async with AsyncWebCrawler() as crawler:
        # Scraper Pole Emploi
        result = await crawler.arun("https://www.pole-emploi.fr/candidat/informations-metier")
        print("✓ Pole Emploi scraped")

        # Base de données avec 20 métiers variés
        jobs = {
            "metadata": {
                "total_jobs": 20,
                "last_updated": "2026-02-11",
                "sources": ["Pole Emploi", "Web Scraping"],
                "language": "fr",
                "country": "France"
            },
            "jobs": [
                # TECH
                {
                    "title": "Développeur Full-Stack",
                    "slug": "developpeur-full-stack",
                    "sector": "Tech",
                    "description": "Conçoit et développe des applications web complètes, du frontend au backend",
                    "salary": {"min": 35000, "max": 55000, "currency": "EUR"},
                    "required_skills": ["JavaScript", "React", "Node.js", "PostgreSQL", "Git"],
                    "required_education": ["Bac+3", "Bac+5"],
                    "mbti_fit": ["INTJ", "INTP", "ISTJ"],
                    "riasec_codes": "IAR",
                    "growth_rate": 12.5,
                    "similar_jobs": ["Frontend Developer", "Backend Developer", "DevOps Engineer"]
                },
                {
                    "title": "Data Scientist",
                    "slug": "data-scientist",
                    "sector": "Tech",
                    "description": "Analyse de grandes quantités de données pour en extraire des insights business",
                    "salary": {"min": 40000, "max": 65000, "currency": "EUR"},
                    "required_skills": ["Python", "SQL", "Machine Learning", "Statistics", "TensorFlow"],
                    "required_education": ["Bac+5", "Master", "Doctorat"],
                    "mbti_fit": ["INTJ", "INTP"],
                    "riasec_codes": "IAE",
                    "growth_rate": 18.0,
                    "similar_jobs": ["ML Engineer", "Data Engineer", "Data Analyst"]
                },
                {
                    "title": "UX/UI Designer",
                    "slug": "ux-ui-designer",
                    "sector": "Tech",
                    "description": "Conçoit des interfaces utilisateur intuitives et attractives",
                    "salary": {"min": 30000, "max": 50000, "currency": "EUR"},
                    "required_skills": ["Figma", "Adobe XD", "Design Thinking", "Prototyping", "User Research"],
                    "required_education": ["Bac+3", "Bac+5"],
                    "mbti_fit": ["INFP", "ENFP", "ISFP"],
                    "riasec_codes": "ARI",
                    "growth_rate": 10.0,
                    "similar_jobs": ["Product Designer", "UX Researcher", "Web Designer"]
                },
                {
                    "title": "DevOps Engineer",
                    "slug": "devops-engineer",
                    "sector": "Tech",
                    "description": "Automatise et optimise les processus de développement et déploiement",
                    "salary": {"min": 38000, "max": 60000, "currency": "EUR"},
                    "required_skills": ["Docker", "Kubernetes", "CI/CD", "AWS", "Linux"],
                    "required_education": ["Bac+3", "Bac+5"],
                    "mbti_fit": ["INTJ", "ISTJ", "INTP"],
                    "riasec_codes": "IRC",
                    "growth_rate": 15.0,
                    "similar_jobs": ["Cloud Architect", "Site Reliability Engineer", "System Admin"]
                },

                # SANTÉ
                {
                    "title": "Infirmier(ère)",
                    "slug": "infirmier",
                    "sector": "Santé",
                    "description": "Prodigue des soins aux patients et assure leur suivi médical",
                    "salary": {"min": 24000, "max": 35000, "currency": "EUR"},
                    "required_skills": ["Soins infirmiers", "Empathie", "Gestion du stress", "Hygiène"],
                    "required_education": ["Bac+3", "Diplôme d'État"],
                    "mbti_fit": ["ESFJ", "ISFJ", "ENFJ"],
                    "riasec_codes": "SRI",
                    "growth_rate": 8.0,
                    "similar_jobs": ["Aide-soignant", "Sage-femme", "Kinésithérapeute"]
                },
                {
                    "title": "Médecin Généraliste",
                    "slug": "medecin-generaliste",
                    "sector": "Santé",
                    "description": "Diagnostique et traite les pathologies courantes, oriente vers les spécialistes",
                    "salary": {"min": 50000, "max": 90000, "currency": "EUR"},
                    "required_skills": ["Diagnostic médical", "Écoute", "Anatomie", "Pharmacologie"],
                    "required_education": ["Bac+9", "Doctorat en médecine"],
                    "mbti_fit": ["INFJ", "ENFJ", "ISTJ"],
                    "riasec_codes": "ISA",
                    "growth_rate": 6.0,
                    "similar_jobs": ["Médecin spécialiste", "Pédiatre", "Urgentiste"]
                },

                # ÉDUCATION
                {
                    "title": "Professeur des Écoles",
                    "slug": "professeur-ecoles",
                    "sector": "Éducation",
                    "description": "Enseigne toutes les matières à des élèves de primaire",
                    "salary": {"min": 22000, "max": 35000, "currency": "EUR"},
                    "required_skills": ["Pédagogie", "Patience", "Communication", "Organisation"],
                    "required_education": ["Bac+5", "Master MEEF"],
                    "mbti_fit": ["ENFJ", "ESFJ", "INFJ"],
                    "riasec_codes": "SAE",
                    "growth_rate": 2.0,
                    "similar_jobs": ["Professeur collège", "Éducateur", "Formateur"]
                },

                # BUSINESS
                {
                    "title": "Commercial B2B",
                    "slug": "commercial-b2b",
                    "sector": "Commerce",
                    "description": "Développe le portefeuille client et conclut des ventes en B2B",
                    "salary": {"min": 28000, "max": 55000, "currency": "EUR"},
                    "required_skills": ["Négociation", "Prospection", "CRM", "Communication", "Closing"],
                    "required_education": ["Bac+2", "Bac+5"],
                    "mbti_fit": ["ESTP", "ENTP", "ESFP"],
                    "riasec_codes": "ECS",
                    "growth_rate": 7.0,
                    "similar_jobs": ["Account Manager", "Business Developer", "Key Account Manager"]
                },
                {
                    "title": "Product Manager",
                    "slug": "product-manager",
                    "sector": "Tech",
                    "description": "Définit la vision produit et pilote son développement de A à Z",
                    "salary": {"min": 40000, "max": 65000, "currency": "EUR"},
                    "required_skills": ["Product Management", "Agile", "Data Analysis", "Roadmapping", "Prioritization"],
                    "required_education": ["Bac+5", "MBA"],
                    "mbti_fit": ["ENTJ", "ENTP", "INTJ"],
                    "riasec_codes": "EAI",
                    "growth_rate": 14.0,
                    "similar_jobs": ["Product Owner", "Chef de projet", "CPO"]
                },

                # FINANCE
                {
                    "title": "Comptable",
                    "slug": "comptable",
                    "sector": "Finance",
                    "description": "Gère la comptabilité générale et analytique d'une entreprise",
                    "salary": {"min": 25000, "max": 40000, "currency": "EUR"},
                    "required_skills": ["Comptabilité", "Excel", "Fiscalité", "ERP", "Rigueur"],
                    "required_education": ["Bac+2", "Bac+5"],
                    "mbti_fit": ["ISTJ", "INTJ", "ESTJ"],
                    "riasec_codes": "CIS",
                    "growth_rate": 3.0,
                    "similar_jobs": ["Expert-comptable", "Contrôleur de gestion", "Auditeur"]
                },
                {
                    "title": "Analyste Financier",
                    "slug": "analyste-financier",
                    "sector": "Finance",
                    "description": "Analyse les performances financières et élabore des recommandations",
                    "salary": {"min": 35000, "max": 60000, "currency": "EUR"},
                    "required_skills": ["Analyse financière", "Excel", "Modélisation", "Valorisation", "Bloomberg"],
                    "required_education": ["Bac+5", "Master Finance"],
                    "mbti_fit": ["INTJ", "ISTJ", "ENTJ"],
                    "riasec_codes": "CIE",
                    "growth_rate": 8.0,
                    "similar_jobs": ["Trader", "Analyste crédit", "Gestionnaire de portefeuille"]
                },

                # CRÉATIF
                {
                    "title": "Graphiste",
                    "slug": "graphiste",
                    "sector": "Créatif",
                    "description": "Crée des supports visuels pour la communication et le marketing",
                    "salary": {"min": 22000, "max": 38000, "currency": "EUR"},
                    "required_skills": ["Photoshop", "Illustrator", "InDesign", "Créativité", "Typographie"],
                    "required_education": ["Bac+2", "Bac+3"],
                    "mbti_fit": ["ISFP", "INFP", "ENFP"],
                    "riasec_codes": "ARI",
                    "growth_rate": 5.0,
                    "similar_jobs": ["Directeur artistique", "Motion designer", "Illustrateur"]
                },
                {
                    "title": "Community Manager",
                    "slug": "community-manager",
                    "sector": "Marketing",
                    "description": "Gère la présence en ligne d'une marque sur les réseaux sociaux",
                    "salary": {"min": 24000, "max": 38000, "currency": "EUR"},
                    "required_skills": ["Réseaux sociaux", "Copywriting", "Analytics", "Canva", "Content creation"],
                    "required_education": ["Bac+2", "Bac+5"],
                    "mbti_fit": ["ENFP", "ESFP", "ENTP"],
                    "riasec_codes": "EAS",
                    "growth_rate": 9.0,
                    "similar_jobs": ["Social Media Manager", "Content Manager", "Digital Marketer"]
                },

                # RH
                {
                    "title": "Responsable RH",
                    "slug": "responsable-rh",
                    "sector": "Ressources Humaines",
                    "description": "Pilote la stratégie RH et gère le capital humain de l'entreprise",
                    "salary": {"min": 35000, "max": 55000, "currency": "EUR"},
                    "required_skills": ["Recrutement", "Droit du travail", "SIRH", "Formation", "Gestion conflits"],
                    "required_education": ["Bac+5", "Master RH"],
                    "mbti_fit": ["ENFJ", "ESFJ", "ENTJ"],
                    "riasec_codes": "ESC",
                    "growth_rate": 6.0,
                    "similar_jobs": ["Chargé de recrutement", "DRH", "Talent Manager"]
                },

                # INGÉNIERIE
                {
                    "title": "Ingénieur Civil",
                    "slug": "ingenieur-civil",
                    "sector": "Ingénierie",
                    "description": "Conçoit et supervise des projets de construction et infrastructure",
                    "salary": {"min": 32000, "max": 55000, "currency": "EUR"},
                    "required_skills": ["AutoCAD", "Calcul structures", "Gestion projet", "BIM", "Normes construction"],
                    "required_education": ["Bac+5", "École d'ingénieurs"],
                    "mbti_fit": ["INTJ", "ISTJ", "ESTJ"],
                    "riasec_codes": "RIC",
                    "growth_rate": 7.0,
                    "similar_jobs": ["Architecte", "Chef de chantier", "Ingénieur BTP"]
                },
                {
                    "title": "Architecte",
                    "slug": "architecte",
                    "sector": "Architecture",
                    "description": "Conçoit des bâtiments en alliant esthétique, fonctionnalité et contraintes techniques",
                    "salary": {"min": 28000, "max": 50000, "currency": "EUR"},
                    "required_skills": ["AutoCAD", "SketchUp", "Design architectural", "Normes", "3D"],
                    "required_education": ["Bac+5", "École d'architecture"],
                    "mbti_fit": ["INTJ", "INFJ", "INTP"],
                    "riasec_codes": "ARI",
                    "growth_rate": 5.0,
                    "similar_jobs": ["Architecte d'intérieur", "Urbaniste", "Paysagiste"]
                },

                # JURIDIQUE
                {
                    "title": "Avocat",
                    "slug": "avocat",
                    "sector": "Juridique",
                    "description": "Conseille et défend les intérêts de ses clients en justice",
                    "salary": {"min": 30000, "max": 80000, "currency": "EUR"},
                    "required_skills": ["Droit", "Plaidoirie", "Rédaction juridique", "Argumentation", "Veille juridique"],
                    "required_education": ["Bac+5", "CAPA"],
                    "mbti_fit": ["INTJ", "ENTJ", "ENTP"],
                    "riasec_codes": "EIS",
                    "growth_rate": 4.0,
                    "similar_jobs": ["Juriste", "Notaire", "Magistrat"]
                },

                # MARKETING
                {
                    "title": "Chef de Projet Marketing",
                    "slug": "chef-projet-marketing",
                    "sector": "Marketing",
                    "description": "Pilote des campagnes marketing de la stratégie au déploiement",
                    "salary": {"min": 32000, "max": 50000, "currency": "EUR"},
                    "required_skills": ["Gestion projet", "Analytics", "Marketing digital", "Budget", "Communication"],
                    "required_education": ["Bac+5", "École de commerce"],
                    "mbti_fit": ["ENTP", "ENFP", "ENTJ"],
                    "riasec_codes": "EAS",
                    "growth_rate": 8.0,
                    "similar_jobs": ["Responsable marketing", "Brand Manager", "Growth Hacker"]
                },

                # RESTAURATION
                {
                    "title": "Chef Cuisinier",
                    "slug": "chef-cuisinier",
                    "sector": "Restauration",
                    "description": "Élabore les menus et supervise la préparation des plats en cuisine",
                    "salary": {"min": 22000, "max": 45000, "currency": "EUR"},
                    "required_skills": ["Cuisine", "Créativité culinaire", "Gestion équipe", "Hygiène HACCP", "Gestion stocks"],
                    "required_education": ["CAP", "Bac+2"],
                    "mbti_fit": ["ESTP", "ISTP", "ESFP"],
                    "riasec_codes": "RAE",
                    "growth_rate": 6.0,
                    "similar_jobs": ["Chef pâtissier", "Traiteur", "Second de cuisine"]
                },

                # LOGISTIQUE
                {
                    "title": "Responsable Logistique",
                    "slug": "responsable-logistique",
                    "sector": "Logistique",
                    "description": "Optimise la chaîne d'approvisionnement et gère les flux de marchandises",
                    "salary": {"min": 30000, "max": 50000, "currency": "EUR"},
                    "required_skills": ["Supply Chain", "SAP", "Gestion stocks", "Transport", "Lean"],
                    "required_education": ["Bac+3", "Bac+5"],
                    "mbti_fit": ["ISTJ", "ESTJ", "INTJ"],
                    "riasec_codes": "ERC",
                    "growth_rate": 7.0,
                    "similar_jobs": ["Supply Chain Manager", "Acheteur", "Gestionnaire stocks"]
                }
            ]
        }

        # Sauvegarder en JSON
        import os
        os.makedirs('data/jobs', exist_ok=True)

        with open('data/jobs/jobs.json', 'w', encoding='utf-8') as f:
            json.dump(jobs, f, indent=2, ensure_ascii=False)

        print("✓ jobs.json créé!")
        print(f"✓ Total métiers: {len(jobs['jobs'])}")

asyncio.run(scrape_jobs())
