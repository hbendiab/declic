#!/usr/bin/env python3
"""
Script pour créer la base de données RAG pour les métiers APEC
Transforme les 446 métiers en embeddings et les stocke dans ChromaDB
"""

import json
import os
from pathlib import Path
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings

def setup_rag_database():
    """Configure la base de données RAG avec les métiers APEC"""

    print("🚀 CRÉATION DE LA BASE DE DONNÉES RAG")
    print("="*70)

    # ÉTAPE 1: Charger les données métiers
    print("\n📂 Chargement des données métiers...")
    jobs_file = "data/jobs/apec-jobs.json"

    with open(jobs_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    jobs = data['jobs']
    print(f"✓ {len(jobs)} métiers chargés depuis {jobs_file}")

    # ÉTAPE 2: Initialiser le modèle d'embeddings (français)
    print("\n🧠 Chargement du modèle d'embeddings (paraphrase-multilingual)...")
    print("   Note: Téléchargement du modèle (~420 MB) si première fois...")

    # Modèle multilingue qui comprend bien le français
    model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
    print("✓ Modèle chargé!")

    # ÉTAPE 3: Créer/Connecter à ChromaDB
    print("\n💾 Initialisation de ChromaDB...")

    # Créer le dossier pour ChromaDB
    chroma_dir = Path("data/chroma_db")
    chroma_dir.mkdir(parents=True, exist_ok=True)

    # Initialiser le client ChromaDB
    client = chromadb.PersistentClient(
        path=str(chroma_dir),
        settings=Settings(
            anonymized_telemetry=False,
            allow_reset=True
        )
    )

    # Supprimer la collection si elle existe (pour réinitialiser)
    try:
        client.delete_collection("jobs")
        print("✓ Ancienne collection supprimée")
    except:
        pass

    # Créer une nouvelle collection
    collection = client.create_collection(
        name="jobs",
        metadata={"description": "APEC jobs database"}
    )
    print(f"✓ Collection 'jobs' créée dans {chroma_dir}")

    # ÉTAPE 4: Préparer les documents pour l'embedding
    print(f"\n📝 Préparation de {len(jobs)} métiers pour vectorisation...")

    documents = []
    metadatas = []
    ids = []

    for idx, job in enumerate(jobs):
        # Créer un texte riche pour l'embedding
        # Combine titre, description, missions, compétences
        job_text = f"""
Titre: {job['title']}
Secteur: {job['sector']}
Description: {job.get('description', '')}
Missions: {job.get('missions', '')}
Compétences: {', '.join(job.get('required_skills', [])[:5])}
Formation: {', '.join(job.get('required_education', []))}
Salaire: {job['salary']['min']}-{job['salary']['max']} {job['salary']['currency']}
        """.strip()

        documents.append(job_text)

        # Métadonnées pour filtrage et affichage
        metadatas.append({
            'title': job['title'],
            'sector': job['sector'],
            'salary_min': job['salary']['min'],
            'salary_max': job['salary']['max'],
            'slug': job['slug'],
            'url': job.get('url', '')
        })

        ids.append(f"job_{idx}")

    print("✓ Documents préparés")

    # ÉTAPE 5: Créer les embeddings et stocker dans ChromaDB
    print(f"\n🔄 Création des embeddings pour {len(documents)} métiers...")
    print("   (Cela peut prendre 2-3 minutes...)")

    # Créer les embeddings par batch pour plus d'efficacité
    batch_size = 32
    for i in range(0, len(documents), batch_size):
        batch_docs = documents[i:i+batch_size]
        batch_meta = metadatas[i:i+batch_size]
        batch_ids = ids[i:i+batch_size]

        # Créer les embeddings
        embeddings = model.encode(batch_docs, show_progress_bar=True)

        # Ajouter à ChromaDB
        collection.add(
            embeddings=embeddings.tolist(),
            documents=batch_docs,
            metadatas=batch_meta,
            ids=batch_ids
        )

        print(f"   ✓ Batch {i//batch_size + 1}/{(len(documents) + batch_size - 1)//batch_size} ajouté")

    print("\n✅ TOUS LES EMBEDDINGS CRÉÉS ET STOCKÉS!")

    # ÉTAPE 6: Test de recherche
    print("\n🧪 TEST DE RECHERCHE:")
    print("-" * 70)

    test_query = "métiers créatifs bien payés"
    print(f"Question test: '{test_query}'")

    # Créer l'embedding de la question
    query_embedding = model.encode([test_query])

    # Rechercher dans ChromaDB
    results = collection.query(
        query_embeddings=query_embedding.tolist(),
        n_results=3
    )

    print("\n📊 Top 3 résultats:")
    for i, (doc, metadata) in enumerate(zip(results['documents'][0], results['metadatas'][0]), 1):
        print(f"\n{i}. {metadata['title']}")
        print(f"   Secteur: {metadata['sector']}")
        print(f"   Salaire: {metadata['salary_min']}-{metadata['salary_max']} EUR")

    # ÉTAPE 7: Statistiques finales
    print("\n" + "="*70)
    print("✅ BASE DE DONNÉES RAG CRÉÉE AVEC SUCCÈS!")
    print("="*70)
    print(f"✓ Métiers vectorisés: {len(jobs)}")
    print(f"✓ Emplacement: {chroma_dir}")
    print(f"✓ Collection: 'jobs'")
    print(f"✓ Modèle: paraphrase-multilingual-MiniLM-L12-v2")
    print("\n💡 Prochaine étape: Créer l'API de recherche Next.js")
    print("="*70)

    return collection

if __name__ == "__main__":
    setup_rag_database()
