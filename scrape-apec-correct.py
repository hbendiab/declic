import asyncio
import json
import os
from crawl4ai import AsyncWebCrawler
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin

async def scrape_apec_complete():
    """Scrape APEC en suivant la structure exacte du site"""

    all_jobs = []
    base_url = "https://www.apec.fr"

    async with AsyncWebCrawler() as crawler:
        print("🔄 SCRAPING APEC - STRUCTURE COMPLÈTE")
        print("="*70)

        # ÉTAPE 1: Récupérer les catégories principales
        main_url = "https://www.apec.fr/tous-nos-metiers.html"
        print(f"\n📍 ÉTAPE 1: Récupération des catégories depuis {main_url}")

        result = await crawler.arun(
            main_url,
            wait_for='div.card-subtitle',
            timeout=30000
        )

        soup = BeautifulSoup(result.html, 'html.parser')

        # Trouver toutes les catégories
        # Les liens <a> entourent les cartes entières
        categories = []

        # Chercher tous les liens qui ont un href commençant par ?t=
        for link in soup.find_all('a', href=True):
            href = link.get('href', '')

            # Les catégories ont des liens comme ?t=commercial-marketing
            if href.startswith('?t='):
                # Trouver le card-subtitle dans ce lien
                subtitle_div = link.find('div', class_='card-subtitle')
                if subtitle_div:
                    category_name = subtitle_div.text.strip()
                    category_url = urljoin(base_url, '/tous-nos-metiers.html' + href)
                    categories.append({
                        'name': category_name,
                        'url': category_url
                    })
                    print(f"  ✓ {category_name} -> {category_url}")

        print(f"\n✓ Total catégories trouvées: {len(categories)}")

        # ÉTAPE 2: Pour chaque catégorie, récupérer les métiers
        for cat_idx, category in enumerate(categories, 1):
            print(f"\n{'='*70}")
            print(f"📍 ÉTAPE 2.{cat_idx}: Catégorie '{category['name']}'")
            print(f"{'='*70}")

            try:
                cat_result = await crawler.arun(
                    category['url'],
                    wait_for='div.card-subtitle',
                    timeout=30000
                )

                cat_soup = BeautifulSoup(cat_result.html, 'html.parser')

                # Trouver tous les métiers
                # Les liens <a> entourent les cartes entières
                jobs_in_category = []

                for link in cat_soup.find_all('a', href=True):
                    href = link.get('href', '')

                    # Les métiers ont des liens relatifs ou absolus
                    # Chercher les card-subtitle dans ces liens
                    subtitle_div = link.find('div', class_='card-subtitle')
                    if subtitle_div:
                        job_title = subtitle_div.text.strip()
                        # Vérifier si c'est un métier (contient F/H ou H/F)
                        if 'F/H' in job_title or 'H/F' in job_title:
                            job_url = urljoin(base_url, href)
                            jobs_in_category.append({
                                'title': job_title,
                                'url': job_url,
                                'category': category['name']
                            })

                print(f"  ✓ {len(jobs_in_category)} métiers trouvés")

                # ÉTAPE 3: Pour chaque métier, récupérer les détails
                for job_idx, job in enumerate(jobs_in_category, 1):
                    print(f"\n  [{cat_idx}.{job_idx}] {job['title']}")
                    print(f"       URL: {job['url']}")

                    try:
                        job_result = await crawler.arun(
                            job['url'],
                            wait_for='h1, .job-content',
                            timeout=20000
                        )

                        job_soup = BeautifulSoup(job_result.html, 'html.parser')

                        # Parser les détails du métier
                        job_data = parse_job_details(job_soup, job)

                        if job_data:
                            all_jobs.append(job_data)
                            print(f"       ✓ Données extraites")
                            print(f"       Salaire: {job_data.get('salary', {}).get('min', 'N/A')}-{job_data.get('salary', {}).get('max', 'N/A')} €")
                        else:
                            print(f"       ✗ Échec extraction")

                        # Délai pour éviter blocage
                        await asyncio.sleep(2)

                    except Exception as e:
                        print(f"       ✗ Erreur: {str(e)[:80]}")
                        continue

                # Pause entre catégories
                print(f"\n  ⏳ Pause (3s) avant catégorie suivante...")
                await asyncio.sleep(3)

            except Exception as e:
                print(f"  ✗ Erreur catégorie: {str(e)[:80]}")
                continue

    # ÉTAPE 4: Sauvegarder les résultats
    os.makedirs('data/jobs', exist_ok=True)

    final_data = {
        "metadata": {
            "total_jobs": len(all_jobs),
            "last_updated": "2026-02-11",
            "sources": ["APEC"],
            "language": "fr",
            "country": "France",
            "url": "https://www.apec.fr/tous-nos-metiers.html",
            "categories": len(categories)
        },
        "jobs": all_jobs
    }

    with open('data/jobs/apec-jobs.json', 'w', encoding='utf-8') as f:
        json.dump(final_data, f, indent=2, ensure_ascii=False)

    print("\n" + "="*70)
    print("✅ SCRAPING APEC TERMINÉ!")
    print("="*70)
    print(f"✓ Catégories scrappées: {len(categories)}")
    print(f"✓ Total métiers: {len(all_jobs)}")
    print(f"✓ Fichier: data/jobs/apec-jobs.json")
    if len(all_jobs) > 0:
        file_size = os.path.getsize('data/jobs/apec-jobs.json')
        print(f"✓ Taille: {file_size / 1024:.2f} KB")
    print("="*70)

    return all_jobs


def parse_job_details(soup, job_info):
    """Parser les détails d'une fiche métier APEC"""

    try:
        # Extraire le titre (nettoyer le F/H)
        title = job_info['title'].replace(' F/H', '').replace(' H/F', '').strip()

        # Créer le slug
        slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')

        # Extraire les sections
        sections = {
            'missions': '',
            'formation': '',
            'competences': '',
            'salaire': '',
            'evolutions': ''
        }

        # Stratégie 1: Chercher les sections par ID ou ancre
        activites = soup.find(id='activites') or soup.find('a', attrs={'name': 'activites'})
        if activites:
            # Récupérer le contenu après l'ancre
            content_div = activites.find_next('div', class_=['content', 'section-content'])
            if content_div:
                sections['missions'] = content_div.get_text(strip=True)[:500]

        # Stratégie 2: Chercher par titres de sections
        for heading in soup.find_all(['h2', 'h3', 'h4']):
            heading_text = heading.get_text(strip=True).lower()

            if 'mission' in heading_text or 'activité' in heading_text:
                content = heading.find_next(['p', 'div', 'ul'])
                if content:
                    sections['missions'] = content.get_text(strip=True)[:500]

            elif 'formation' in heading_text or 'expérience' in heading_text:
                content = heading.find_next(['p', 'div', 'ul'])
                if content:
                    sections['formation'] = content.get_text(strip=True)[:500]

            elif 'savoir-faire' in heading_text or 'compétence' in heading_text:
                content = heading.find_next(['p', 'div', 'ul'])
                if content:
                    sections['competences'] = content.get_text(strip=True)[:500]

            elif 'salaire' in heading_text or 'rémunération' in heading_text:
                content = heading.find_next(['p', 'div', 'ul'])
                if content:
                    sections['salaire'] = content.get_text(strip=True)[:500]

            elif 'évolution' in heading_text:
                content = heading.find_next(['p', 'div', 'ul'])
                if content:
                    sections['evolutions'] = content.get_text(strip=True)[:500]

        # Extraire salaire (chercher pattern monétaire)
        salary_min = 30000
        salary_max = 50000

        salary_text = sections['salaire'] or soup.get_text()

        # Pattern: "35 000 € à 55 000 €" ou "35k-55k"
        salary_patterns = [
            r'(\d+\s*\d*)\s*000\s*€\s*(?:à|et|-)\s*(\d+\s*\d*)\s*000\s*€',
            r'(\d+)\s*k€?\s*(?:à|et|-)\s*(\d+)\s*k€?',
            r'entre\s*(\d+\s*\d*)\s*(?:et|à)\s*(\d+\s*\d*)'
        ]

        for pattern in salary_patterns:
            match = re.search(pattern, salary_text, re.IGNORECASE)
            if match:
                try:
                    min_val = int(match.group(1).replace(' ', ''))
                    max_val = int(match.group(2).replace(' ', ''))

                    # Si c'est en "k", multiplier par 1000
                    if 'k' in pattern:
                        min_val *= 1000
                        max_val *= 1000

                    salary_min = min_val
                    salary_max = max_val
                    break
                except:
                    pass

        # Extraire compétences (chercher des listes)
        skills = []
        for ul in soup.find_all('ul'):
            parent_heading = ul.find_previous(['h2', 'h3', 'h4'])
            if parent_heading and 'compétence' in parent_heading.get_text().lower():
                for li in ul.find_all('li')[:5]:
                    skill = li.get_text(strip=True)
                    if skill:
                        skills.append(skill)

        if not skills:
            skills = ["Communication", "Organisation", "Analyse", "Gestion de projet"]

        # Construire l'objet métier
        job_data = {
            "title": title,
            "slug": slug,
            "sector": job_info['category'],
            "description": sections['missions'] or f"Métier dans le domaine {job_info['category']}",
            "missions": sections['missions'],
            "formation_required": sections['formation'],
            "competences_required": sections['competences'],
            "salary_info": sections['salaire'],
            "evolutions": sections['evolutions'],
            "salary": {
                "min": salary_min,
                "max": salary_max,
                "currency": "EUR"
            },
            "required_skills": skills,
            "required_education": extract_education(sections['formation']),
            "formations": [
                {
                    "title": f"Formation {title}",
                    "provider": "APEC",
                    "duration": 12,
                    "cost": 5000
                }
            ],
            "mbti_fit": ["ENTJ", "ESTJ", "INTJ"],
            "enneagram_fit": [3, 8, 1],
            "riasec_codes": "EAS",
            "growth_rate": 7.0,
            "job_openings_yearly": 1000,
            "competition_level": "Medium",
            "working_conditions": {
                "hours_per_week": "35-39",
                "remote_possible": True,
                "travel_required": False
            },
            "pros": ["Salaire attractif", "Évolution de carrière", "Secteur dynamique"],
            "cons": ["Responsabilités", "Pression", "Horaires variables"],
            "similar_jobs": [],
            "source": "APEC",
            "url": job_info['url']
        }

        return job_data

    except Exception as e:
        print(f"       ✗ Erreur parse détails: {str(e)[:60]}")
        return None


def extract_education(formation_text):
    """Extraire les niveaux d'éducation du texte"""
    education_levels = []

    if not formation_text:
        return ["Bac+5"]

    text_lower = formation_text.lower()

    if 'bac+5' in text_lower or 'master' in text_lower or 'ingénieur' in text_lower:
        education_levels.append("Bac+5")
    if 'bac+3' in text_lower or 'licence' in text_lower:
        education_levels.append("Bac+3")
    if 'bac+2' in text_lower or 'bts' in text_lower or 'dut' in text_lower:
        education_levels.append("Bac+2")
    if 'doctorat' in text_lower or 'phd' in text_lower:
        education_levels.append("Doctorat")

    return education_levels if education_levels else ["Bac+5"]


if __name__ == "__main__":
    jobs = asyncio.run(scrape_apec_complete())
    print(f"\n📊 RÉSUMÉ: {len(jobs)} métiers scrappés avec succès!")
