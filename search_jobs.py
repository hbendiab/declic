#!/usr/bin/env python3
"""
Script de recherche dans la base ChromaDB
Appelé par l'API Next.js
"""

import sys
import json
from pathlib import Path
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings

def search_jobs(query: str, n_results: int = 5):
    """
    Recherche des métiers dans ChromaDB

    Args:
        query: Question de l'utilisateur
        n_results: Nombre de résultats à retourner

    Returns:
        dict: Résultats de recherche avec métadonnées
    """

    # Charger le modèle (mis en cache après le premier chargement)
    model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

    # Connecter à ChromaDB
    chroma_dir = Path("data/chroma_db")
    client = chromadb.PersistentClient(
        path=str(chroma_dir),
        settings=Settings(anonymized_telemetry=False)
    )

    # Récupérer la collection
    collection = client.get_collection("jobs")

    # Créer l'embedding de la query
    query_embedding = model.encode([query])

    # Rechercher dans ChromaDB
    results = collection.query(
        query_embeddings=query_embedding.tolist(),
        n_results=n_results
    )

    # Formatter les résultats
    jobs = []
    for i in range(len(results['ids'][0])):
        job = {
            'id': results['ids'][0][i],
            'title': results['metadatas'][0][i]['title'],
            'sector': results['metadatas'][0][i]['sector'],
            'salary_min': results['metadatas'][0][i]['salary_min'],
            'salary_max': results['metadatas'][0][i]['salary_max'],
            'slug': results['metadatas'][0][i]['slug'],
            'url': results['metadatas'][0][i].get('url', ''),
            'distance': results['distances'][0][i] if 'distances' in results else None,
            'document': results['documents'][0][i]
        }
        jobs.append(job)

    return {
        'query': query,
        'n_results': n_results,
        'jobs': jobs
    }

if __name__ == "__main__":
    # Récupérer les arguments de la ligne de commande
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Query required"}))
        sys.exit(1)

    query = sys.argv[1]
    n_results = int(sys.argv[2]) if len(sys.argv) > 2 else 5

    # Effectuer la recherche
    results = search_jobs(query, n_results)

    # Retourner les résultats en JSON
    print(json.dumps(results, ensure_ascii=False))
