#!/usr/bin/env python3
"""
Script pour créer la base de données RAG pour les métiers DÉCLIC
Utilise LangChain + OpenAI Embeddings + ChromaDB
"""

import json
import os
import shutil
from pathlib import Path
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv(".env.local")

try:
    from langchain_openai import OpenAIEmbeddings
    from langchain_community.vectorstores import Chroma
    from langchain_core.documents import Document
    from langchain_text_splitters import RecursiveCharacterTextSplitter
except ImportError as e:
    print(f"❌ Erreur d'import: {e}")
    print("\n📦 Installez les dépendances:")
    print("pip install langchain langchain-openai langchain-community chromadb python-dotenv")
    exit(1)


def setup_rag_database():
    """Configure la base de données RAG avec les métiers DÉCLIC"""

    print("🚀 CRÉATION DE LA BASE DE DONNÉES RAG")
    print("=" * 70)

    # ──────────────────────────────────────────────────────────────────────────
    # ÉTAPE 1: Vérifier la clé API
    # ──────────────────────────────────────────────────────────────────────────
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key:
        print("❌ ERREUR: OPENAI_API_KEY manquante dans .env.local")
        print("\n📋 Créez un fichier .env.local à la racine avec:")
        print("OPENAI_API_KEY=sk-proj-votre-clé-ici")
        exit(1)
    
    if api_key in ("sk-your-key-here", "sk-proj-votre-clé-ici"):
        print("❌ ERREUR: Remplacez la clé placeholder par votre vraie clé OpenAI!")
        exit(1)

    print("✓ Clé OpenAI trouvée")

    # ──────────────────────────────────────────────────────────────────────────
    # ÉTAPE 2: Charger les données métiers
    # ──────────────────────────────────────────────────────────────────────────
    print("\n📂 Chargement des données métiers...")
    
    # Chercher le fichier à plusieurs emplacements
    possible_paths = [
        "data/jobs/apec-jobs.json",
        "data/jobs/jobs.json",
        "./data/jobs/apec-jobs.json",
        "../../data/jobs/apec-jobs.json",
    ]
    
    jobs_file = None
    for path in possible_paths:
        if Path(path).exists():
            jobs_file = path
            break
    
    if not jobs_file:
        print("❌ ERREUR: Fichier métiers non trouvé!")
        print(f"   Cherché à: {possible_paths}")
        print("\n📋 Créez d'abord les métiers avec:")
        print("python scrape-apec-js.py")
        exit(1)
    
    try:
        with open(jobs_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        jobs = data.get('jobs', [])
        print(f"✓ {len(jobs)} métiers chargés depuis {jobs_file}")
    except json.JSONDecodeError:
        print(f"❌ ERREUR: {jobs_file} n'est pas un JSON valide")
        exit(1)
    except Exception as e:
        print(f"❌ ERREUR lors de la lecture: {e}")
        exit(1)

    if not jobs:
        print("❌ ERREUR: Aucun métier trouvé dans le fichier!")
        exit(1)

    # ──────────────────────────────────────────────────────────────────────────
    # ÉTAPE 3: Construire les Documents LangChain
    # ──────────────────────────────────────────────────────────────────────────
    print(f"\n📝 Création de {len(jobs)} documents LangChain...")
    
    raw_documents = []
    
    for job in jobs:
        try:
            # Formater le contenu du document
            content = f"""Métier: {job.get('title', 'N/A')}
Secteur: {job.get('sector', 'N/A')}
Description: {job.get('description', 'N/A')}
Compétences: {', '.join(job.get('required_skills', [])[:5])}
Formation: {', '.join(job.get('required_education', []))}
Salaire: {job.get('salary', {}).get('min', 'N/A')}-{job.get('salary', {}).get('max', 'N/A')} EUR"""

            metadata = {
                'title': job.get('title', 'N/A'),
                'sector': job.get('sector', 'N/A'),
                'salary_min': str(job.get('salary', {}).get('min', 0)),
                'salary_max': str(job.get('salary', {}).get('max', 0)),
                'slug': job.get('slug', ''),
            }

            raw_documents.append(Document(page_content=content, metadata=metadata))
        except Exception as e:
            print(f"⚠️  Erreur avec métier {job.get('title', 'N/A')}: {e}")
            continue

    print(f"✓ {len(raw_documents)} documents créés")

    if not raw_documents:
        print("❌ ERREUR: Aucun document valide créé!")
        exit(1)

    # ──────────────────────────────────────────────────────────────────────────
    # ÉTAPE 4: Découper avec RecursiveCharacterTextSplitter
    # ──────────────────────────────────────────────────────────────────────────
    print("\n✂️  Découpage des documents...")
    
    try:
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50,
            separators=["\n\n", "\n", " ", ""],
        )
        split_docs = splitter.split_documents(raw_documents)
        print(f"✓ {len(split_docs)} chunks créés")
    except Exception as e:
        print(f"❌ ERREUR lors du découpage: {e}")
        exit(1)

    # ──────────────────────────────────────────────────────────────────────────
    # ÉTAPE 5: Initialiser OpenAI Embeddings
    # ──────────────────────────────────────────────────────────────────────────
    print("\n🧠 Initialisation des embeddings OpenAI...")
    
    try:
        embeddings = OpenAIEmbeddings(
            model="text-embedding-3-small",
            openai_api_key=api_key,
        )
        print("✓ Embeddings OpenAI prêts")
    except Exception as e:
        print(f"❌ ERREUR OpenAI: {e}")
        print("   Vérifiez votre clé API")
        exit(1)

    # ──────────────────────────────────────────────────────────────────────────
    # ÉTAPE 6: Créer ChromaDB
    # ──────────────────────────────────────────────────────────────────────────
    print("\n💾 Initialisation de ChromaDB...")
    
    chroma_dir = "data/chroma_db"
    
    # Supprimer l'ancienne base
    if Path(chroma_dir).exists():
        shutil.rmtree(chroma_dir)
        print(f"✓ Ancienne base supprimée")
    
    try:
        print("⏳ Création des embeddings (peut prendre 1-2 minutes)...")
        vectorstore = Chroma.from_documents(
            documents=split_docs,
            embedding=embeddings,
            persist_directory=chroma_dir,
            collection_name="jobs",
        )
        print(f"✓ ChromaDB créée avec {len(split_docs)} chunks")
    except Exception as e:
        print(f"❌ ERREUR ChromaDB: {e}")
        exit(1)

    # ──────────────────────────────────────────────────────────────────────────
    # ÉTAPE 7: Test de recherche
    # ──────────────────────────────────────────────────────────────────────────
    print("\n🧪 TEST DE RECHERCHE:")
    print("-" * 70)
    
    test_query = "métier créatif bien payé"
    print(f"Question: '{test_query}'\n")
    
    try:
        results = vectorstore.similarity_search(test_query, k=3)
        
        if results:
            print("📊 Top 3 résultats:")
            for i, doc in enumerate(results, 1):
                print(f"\n{i}. {doc.metadata.get('title', 'N/A')}")
                print(f"   Secteur: {doc.metadata.get('sector', 'N/A')}")
                print(f"   Salaire: {doc.metadata.get('salary_min')}-{doc.metadata.get('salary_max')} EUR")
        else:
            print("⚠️  Aucun résultat trouvé")
    except Exception as e:
        print(f"⚠️  Erreur lors du test: {e}")

    # ──────────────────────────────────────────────────────────────────────────
    # RÉSUMÉ
    # ──────────────────────────────────────────────────────────────────────────
    print("\n" + "=" * 70)
    print("✅ BASE DE DONNÉES RAG CRÉÉE AVEC SUCCÈS!")
    print("=" * 70)
    print(f"📊 Métiers source     : {len(jobs)}")
    print(f"📊 Chunks vectorisés  : {len(split_docs)}")
    print(f"📁 Emplacement        : {chroma_dir}")
    print(f"🔑 Embeddings         : text-embedding-3-small (OpenAI)")
    print(f"💾 Base de données    : ChromaDB")
    print("=" * 70)
    print("\n✨ Vous pouvez maintenant utiliser la RAG dans votre chatbot!")

    return vectorstore


if __name__ == "__main__":
    try:
        setup_rag_database()
    except KeyboardInterrupt:
        print("\n❌ Interruption utilisateur")
    except Exception as e:
        print(f"\n❌ ERREUR FATALE: {e}")
        import traceback
        traceback.print_exc()