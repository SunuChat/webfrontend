import pandas as pd
import random

# Lire le fichier CSV
df = pd.read_csv('public/data_epi_mensuelles.csv')

# Ajouter la colonne Morts avec des valeurs aléatoires entre 0 et 50
df['Morts'] = [random.randint(0, 50) for _ in range(len(df))]

# Sauvegarder le fichier modifié
df.to_csv('public/data_epi_mensuelles.csv', index=False) 