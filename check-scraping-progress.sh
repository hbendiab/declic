#!/bin/bash
# Script pour vérifier la progression du scraping APEC

OUTPUT_FILE="/private/tmp/claude-501/-Users-haninebendiab-Documents-ETUDES--MASTER--EUGENIA--Apps-chatbot-app/tasks/b72b42a.output"
JSON_FILE="data/jobs/apec-jobs.json"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 PROGRESSION DU SCRAPING APEC"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Vérifier si le script tourne encore
if ps aux | grep -q "[p]ython3 scrape-apec-correct.py"; then
    echo "✓ Statut: 🔄 EN COURS"
else
    echo "✓ Statut: ✅ TERMINÉ"
fi

# Compter les métiers scrappés
JOBS_SCRAPED=$(grep -c "Données extraites" "$OUTPUT_FILE" 2>/dev/null || echo "0")
echo "✓ Métiers scrappés: $JOBS_SCRAPED"

# Catégorie en cours
CURRENT_CATEGORY=$(grep "ÉTAPE 2\." "$OUTPUT_FILE" | tail -1 | sed -E 's/.*Catégorie //')
echo "✓ Catégorie actuelle: $CURRENT_CATEGORY"

# Taille du fichier JSON
if [ -f "$JSON_FILE" ]; then
    JSON_SIZE=$(du -h "$JSON_FILE" | cut -f1)
    JOBS_IN_JSON=$(grep -o '"title":' "$JSON_FILE" | wc -l | xargs)
    echo "✓ Métiers dans JSON: $JOBS_IN_JSON"
    echo "✓ Taille fichier JSON: $JSON_SIZE"
fi

# Dernières lignes du log
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 DERNIÈRES LIGNES DU LOG:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
tail -10 "$OUTPUT_FILE" | grep -E "(ÉTAPE|\[|\✓)" || tail -5 "$OUTPUT_FILE"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
