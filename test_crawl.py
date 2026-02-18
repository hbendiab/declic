# 1. Installer crawl4ai
pip install crawl4ai

# 2. Setup
crawl4ai-setup

# 3. Créer le script de scraping
cat > scrape-jobs.py << 'EOF'
import asyncio
import json
from crawl4ai import AsyncWebCrawler

async def scrape_jobs():
    async with AsyncWebCrawler() as crawler:
        # Scraper Pole Emploi
        result = await crawler.arun("https://www.pole-emploi.fr/candidat/informations-metier")
        print("✓ Pole Emploi scraped")
        
        # Exemple simple: créer jobs.json avec quelques métiers
        jobs = {
            "metadata": {
                "total_jobs": 5,
                "last_updated": "2026-02-11",
                "sources": ["Pole Emploi"],
                "language": "fr",
                "country": "France"
            },
            "jobs": [
                {
                    "title": "Développeur Full-Stack",
                    "slug": "developpeur-full-stack",
                    "sector": "Tech",
                    "description": "Expert en développement web complet",
                    "salary": {"min": 35000, "max": 55000, "currency": "EUR"},
                    "required_skills": ["JavaScript", "React", "Node.js", "PostgreSQL"],
                    "required_education": ["Bac+3", "Bac+5"],
                    "mbti_fit": ["INTJ", "INTP"],
                    "riasec_codes": "IAR",
                    "growth_rate": 12.5,
                    "similar_jobs": ["Frontend Dev", "Backend Dev"]
                },
                {
                    "title": "Data Scientist",
                    "slug": "data-scientist",
                    "sector": "Tech",
                    "description": "Expert en analyse de données et ML",
                    "salary": {"min": 40000, "max": 60000, "currency": "EUR"},
                    "required_skills": ["Python", "SQL", "Machine Learning", "Statistics"],
                    "required_education": ["Bac+5", "Master"],
                    "mbti_fit": ["INTJ", "INTP"],
                    "riasec_codes": "IAR",
                    "growth_rate": 18.0,
                    "similar_jobs": ["ML Engineer", "Data Engineer"]
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
EOF

# 4. Lancer le scraping
python scrape-jobs.py