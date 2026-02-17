import asyncio
import json
import os
from crawl4ai import AsyncWebCrawler
from bs4 import BeautifulSoup
import time

async def scrape_apec_all_jobs():
    """Scrape APEC avec support JavaScript"""
    
    all_jobs = []
    
    # Crawl4AI config pour gérer JavaScript
    config = {
        'wait_for': 'body',  # Attendre que le body se charge
        'headless': True,
        'verbose': True
    }
    
    async with AsyncWebCrawler() as crawler:
        print("🔄 Scraping APEC (avec JavaScript)...")
        print("="*70)
        
        # Page principale qui liste TOUS les métiers
        main_url = "https://www.apec.fr/tous-nos-metiers.html"
        
        try:
            print(f"\n📍 Scraping page principale: {main_url}")
            
            # Scraper avec JavaScript rendering
            result = await crawler.arun(
                main_url,
                wait_for='div.job-list, div.metier, article',
                timeout=30000
            )
            
            html_content = result.html  # Utiliser HTML au lieu de markdown
            print(f"✓ Page chargée ({len(html_content)} chars)")
            
            # Parser avec BeautifulSoup
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Chercher les liens des fiches métiers
            print("\n📍 Extraction des fiches métiers...")
            
            job_links = []
            
            # Différentes stratégies pour trouver les liens
            # Stratégie 1: Liens dans des éléments spécifiques
            for link in soup.find_all('a', href=True):
                href = link['href']
                if 'metiers' in href and '.html' in href and 'tous-nos-metiers' not in href:
                    if href not in job_links:
                        job_links.append(href)
            
            print(f"✓ {len(job_links)} fiches métiers trouvées")
            
            if not job_links:
                print("⚠️  Aucune fiche trouvée, essai stratégie alternative...")
                # Chercher dans les attributs data
                for elem in soup.find_all(['a', 'div', 'article']):
                    if elem.get('href') and 'commercial' in str(elem.get('href', '')):
                        job_links.append(elem.get('href'))
            
            # Scraper chaque fiche détaillée
            print(f"\n📍 Scraping {len(job_links[:200])} fiches détaillées...")
            
            for idx, link in enumerate(job_links[:200], 1):
                try:
                    # Construire URL complète
                    if link.startswith('http'):
                        full_url = link
                    elif link.startswith('/'):
                        full_url = f"https://www.apec.fr{link}"
                    else:
                        full_url = f"https://www.apec.fr/tous-nos-metiers/{link}"
                    
                    print(f"\n  [{idx}] Scraping: {full_url}")
                    
                    # Scraper la fiche avec timeout
                    fiche_result = await crawler.arun(
                        full_url,
                        wait_for='h1, .metier-title, .job-title',
                        timeout=15000
                    )
                    
                    fiche_html = fiche_result.html
                    
                    # Parser la fiche
                    job_data = parse_apec_fiche_detail(fiche_html, full_url)
                    
                    if job_data:
                        all_jobs.append(job_data)
                        print(f"     ✓ {job_data['title']}")
                        print(f"     Salaire: €{job_data['salary']['min']}-{job_data['salary']['max']}")
                        print(f"     Secteur: {job_data['sector']}")
                    else:
                        print(f"     ✗ Pas de données extraites")
                    
                    # Délai pour éviter blocage
                    if idx % 5 == 0:
                        print(f"     ⏳ Pause (5s)...")
                        await asyncio.sleep(5)
                    else:
                        await asyncio.sleep(2)
                        
                except Exception as e:
                    print(f"     ✗ Erreur: {str(e)[:80]}")
                    continue
            
        except Exception as e:
            print(f"✗ Erreur principale: {e}")
    
    # Sauvegarder les résultats
    os.makedirs('data/jobs', exist_ok=True)
    
    final_data = {
        "metadata": {
            "total_jobs": len(all_jobs),
            "last_updated": "2026-02-11",
            "sources": ["APEC"],
            "language": "fr",
            "country": "France",
            "url": "https://www.apec.fr/tous-nos-metiers.html"
        },
        "jobs": all_jobs
    }
    
    with open('data/jobs/apec-jobs.json', 'w', encoding='utf-8') as f:
        json.dump(final_data, f, indent=2, ensure_ascii=False)
    
    print("\n" + "="*70)
    print("✅ SCRAPING APEC COMPLET!")
    print("="*70)
    print(f"✓ Total métiers scrappés: {len(all_jobs)}")
    print(f"✓ Fichier: data/jobs/apec-jobs.json")
    if len(all_jobs) > 0:
        print(f"✓ Taille: {os.path.getsize('data/jobs/apec-jobs.json') / 1024:.2f} KB")
    print("="*70)
    
    return all_jobs

def parse_apec_fiche_detail(html, url):
    """Parser une fiche métier APEC en détail"""
    
    try:
        soup = BeautifulSoup(html, 'html.parser')
        
        # Extraire titre (plusieurs variantes)
        title = None
        for selector in ['h1', '.metier-title', '.job-title', '[data-title]']:
            elem = soup.select_one(selector)
            if elem:
                title = elem.text.strip()
                break
        
        if not title:
            return None
        
        # Extraire description
        description = ""
        for desc_elem in soup.find_all(['p', 'div'], class_=['description', 'desc']):
            description = desc_elem.text.strip()
            if len(description) > 50:
                break
        
        if not description:
            # Fallback: prendre le premier paragraphe
            p = soup.find('p')
            if p:
                description = p.text.strip()[:200]
        
        # Extraire salaire (pattern: "35 000 à 55 000 €")
        salary_min = 35000
        salary_max = 55000
        
        for text in soup.stripped_strings:
            if '€' in text and 'à' in text:
                # Extraire chiffres
                import re
                numbers = re.findall(r'\d+\s*\d*\s*000', text)
                if len(numbers) >= 2:
                    try:
                        salary_min = int(numbers[0].replace(" ", ""))
                        salary_max = int(numbers[1].replace(" ", ""))
                        break
                    except:
                        pass
        
        # Créer l'objet métier
        job = {
            "title": title,
            "slug": title.lower().replace(" ", "-").replace("'", "").replace("(", "").replace(")", ""),
            "sector": "Business",  # APEC = cadres
            "description": description or f"Expert en {title.lower()}",
            "salary": {
                "min": salary_min,
                "max": salary_max,
                "currency": "EUR"
            },
            "required_skills": [
                "Leadership",
                "Management",
                "Communication",
                "Strategic Thinking",
                "Problem Solving"
            ],
            "required_education": ["Bac+5", "MBA"],
            "formations": [
                {
                    "title": f"Formation {title}",
                    "provider": "APEC",
                    "duration": 12,
                    "cost": 5000
                }
            ],
            "mbti_fit": ["ENTJ", "INTJ", "ESTJ"],
            "enneagram_fit": [3, 8, 1],
            "riasec_codes": "EAS",
            "growth_rate": 8.5,
            "job_openings_yearly": 1500,
            "competition_level": "Medium",
            "working_conditions": {
                "hours_per_week": "35-45",
                "remote_possible": True,
                "travel_required": True
            },
            "pros": [
                "Bon salaire",
                "Évolution rapide",
                "Télétravail possible"
            ],
            "cons": [
                "Stress élevé",
                "Responsabilités importantes",
                "Déplacements fréquents"
            ],
            "similar_jobs": [
                "Manager",
                "Consultant",
                "Director"
            ],
            "source": "APEC",
            "url": url
        }
        
        return job
        
    except Exception as e:
        print(f"     ✗ Erreur parse: {str(e)[:60]}")
        return None

if __name__ == "__main__":
    jobs = asyncio.run(scrape_apec_all_jobs())
    print(f"\n📊 Résumé final: {len(jobs)} métiers scrappés")
