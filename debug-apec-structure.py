import asyncio
from crawl4ai import AsyncWebCrawler
from bs4 import BeautifulSoup

async def debug_apec_structure():
    """Debug: voir la structure HTML exacte du site APEC"""

    async with AsyncWebCrawler() as crawler:
        print("🔍 DEBUG: Structure HTML de la page APEC")
        print("="*70)

        main_url = "https://www.apec.fr/tous-nos-metiers.html"

        result = await crawler.arun(
            main_url,
            wait_for='div.card-subtitle',
            timeout=30000
        )

        soup = BeautifulSoup(result.html, 'html.parser')

        # Trouver les card-subtitle
        card_subtitles = soup.find_all('div', class_='card-subtitle')
        print(f"\n✓ Trouvé {len(card_subtitles)} div.card-subtitle\n")

        # Afficher les 3 premiers avec leur contexte
        for i, subtitle in enumerate(card_subtitles[:3], 1):
            print(f"\n{'='*70}")
            print(f"CARD-SUBTITLE #{i}: {subtitle.text.strip()}")
            print(f"{'='*70}")

            # Afficher le parent
            print("\n📍 PARENT:")
            parent = subtitle.parent
            print(f"  Tag: {parent.name}")
            print(f"  Classes: {parent.get('class', [])}")

            # Chercher un lien dans le parent
            link = parent.find('a', href=True)
            if link:
                print(f"\n✓ LIEN TROUVÉ dans parent:")
                print(f"  href: {link['href']}")
                print(f"  text: {link.text.strip()[:50]}")
            else:
                print(f"\n✗ Pas de lien dans parent")

            # Chercher un lien dans le grand-parent
            grandparent = parent.parent if parent else None
            if grandparent:
                print(f"\n📍 GRAND-PARENT:")
                print(f"  Tag: {grandparent.name}")
                print(f"  Classes: {grandparent.get('class', [])}")

                link = grandparent.find('a', href=True)
                if link:
                    print(f"\n✓ LIEN TROUVÉ dans grand-parent:")
                    print(f"  href: {link['href']}")
                    print(f"  text: {link.text.strip()[:50]}")
                else:
                    print(f"\n✗ Pas de lien dans grand-parent")

            # Afficher le HTML brut autour
            print(f"\n📍 HTML BRUT (contexte):")
            print(str(parent)[:500])

        # Chercher aussi toutes les cartes
        print(f"\n\n{'='*70}")
        print("📍 RECHERCHE GLOBALE DES CARDS")
        print(f"{'='*70}")

        all_cards = soup.find_all('div', class_='card')
        print(f"\n✓ Trouvé {len(all_cards)} div.card\n")

        for i, card in enumerate(all_cards[:3], 1):
            print(f"\n--- CARD #{i} ---")
            subtitle = card.find('div', class_='card-subtitle')
            if subtitle:
                print(f"  Subtitle: {subtitle.text.strip()}")

            link = card.find('a', href=True)
            if link:
                print(f"  ✓ Link: {link['href']}")
            else:
                print(f"  ✗ Pas de lien")

        # Sauvegarder le HTML pour inspection manuelle
        with open('debug-apec-page.html', 'w', encoding='utf-8') as f:
            f.write(result.html)
        print(f"\n\n✓ HTML complet sauvegardé dans: debug-apec-page.html")

if __name__ == "__main__":
    asyncio.run(debug_apec_structure())
