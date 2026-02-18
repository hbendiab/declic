#!/usr/bin/env python3
"""
Script de recherche sémantique dans ChromaDB via LangChain
Appelé par l'API Next.js via subprocess
"""

import sys
import json
import os
from pathlib import Path
from dotenv import load_dotenv

from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

# Charger les variables d'environnement
load_dotenv(".env.local")


def search_jobs(query: str, n_results: int = 5) -> dict:
    """
    Recherche sémantique des métiers dans ChromaDB via LangChain

    Args:
        query: Question ou description de l'utilisateur
        n_results: Nombre de résultats à retourner

    Returns:
        dict: Résultats de recherche avec métadonnées
    """

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return {"error": "OPENAI_API_KEY manquante", "jobs": []}

    # Initialiser les embeddings OpenAI
    embeddings = OpenAIEmbeddings(
        model="text-embedding-3-small",
        openai_api_key=api_key,
    )

    # Connecter à ChromaDB existant
    chroma_dir = "data/chroma_db"
    if not Path(chroma_dir).exists():
        return {"error": "Base ChromaDB introuvable. Lancez setup_rag.py d'abord.", "jobs": []}

    vectorstore = Chroma(
        persist_directory=chroma_dir,
        embedding_function=embeddings,
        collection_name="jobs",
    )

    # Recherche avec score de similarité
    results_with_scores = vectorstore.similarity_search_with_relevance_scores(
        query,
        k=n_results,
    )

    # Dédupliquer par titre (un même métier peut avoir plusieurs chunks)
    seen_titles = set()
    jobs = []

    for doc, score in results_with_scores:
        title = doc.metadata.get('title', '')
        if title in seen_titles:
            continue
        seen_titles.add(title)

        jobs.append({
            'title': title,
            'sector': doc.metadata.get('sector', ''),
            'salary_min': doc.metadata.get('salary_min', ''),
            'salary_max': doc.metadata.get('salary_max', ''),
            'slug': doc.metadata.get('slug', ''),
            'url': doc.metadata.get('url', ''),
            'relevance_score': round(score, 4),
            'excerpt': doc.page_content[:300],
        })

    return {
        'query': query,
        'n_results': len(jobs),
        'jobs': jobs,
    }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python search_jobs.py <query> [n_results]"}))
        sys.exit(1)

    query = sys.argv[1]
    n_results = int(sys.argv[2]) if len(sys.argv) > 2 else 5

    results = search_jobs(query, n_results)
    print(json.dumps(results, ensure_ascii=False, indent=2))
