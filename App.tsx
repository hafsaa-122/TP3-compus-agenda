import React from 'react';
import { StyleSheet, Text, View, FlatList, ScrollView } from 'react-native';

type Evenement = {
  id: string;
  titre: string;
  categorie: string;
  capacite: number;
  inscrits: number;
};

const evenements: Evenement[] = [
  { id: 'E01', titre: 'Atelier React', categorie: 'Atelier', capacite: 25, inscrits: 25 },
  { id: 'E02', titre: 'Conférence IA', categorie: 'Conférence', capacite: 70, inscrits: 52 },
  { id: 'E03', titre: 'Sécurité mobile', categorie: 'Atelier', capacite: 20, inscrits: 17 },
  { id: 'E04', titre: 'Design UI', categorie: 'Atelier', capacite: 18, inscrits: 9 },
  { id: 'E05', titre: 'Forum projets', categorie: 'Rencontre', capacite: 50, inscrits: 49 },
  { id: 'E06', titre: 'Découverte Git', categorie: 'Atelier', capacite: 24, inscrits: 24 },
];

const PlacesRestantes = (e: Evenement) => Math.max(0, e.capacite - e.inscrits);

const statutEvenement = (e: Evenement) => {
  const r = PlacesRestantes(e);
  if (r === 0) {
    return 'Complet';
  }
  if (r >= 1 && r <= 3) {
    return 'Presque complet';
  }
  return 'Ouvert';
};

const totalEvenements = evenements.length;
const evenementsComplets = evenements.filter(e => statutEvenement(e) === 'Complet').length;
const evenementsAvecPlaces = evenements.filter(e => PlacesRestantes(e) > 0).length;
const totalPlacesRestantes = evenements.reduce((somme, e) => somme + PlacesRestantes(e), 0);

type BadgeProps = {
  statut: 'Complet' | 'Presque complet' | 'Ouvert';
};

function BadgeEtat({ statut }: BadgeProps) {
  let badgeStyle = styles.badgeOuvert;
  if (statut === 'Complet') badgeStyle = styles.badgeComplet;
  else if (statut === 'Presque complet') badgeStyle = styles.badgePresque;

  return (
    <View style={[styles.badge, badgeStyle]}>
      <Text style={styles.texteBadge}>{statut}</Text>
    </View>
  );
}

type CarteProps = {
  evenement: Evenement;
};

function CarteEvenement({ evenement }: CarteProps) {
  const r = PlacesRestantes(evenement);
  const statut = statutEvenement(evenement);

  return (
    <View style={styles.carte}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{evenement.titre}</Text>
        <Text style={styles.cardCat}>{evenement.categorie}</Text>
        <Text style={styles.cardPlaces}>Places restantes : {r} / {evenement.capacite}</Text>
      </View>
      <BadgeEtat statut={statut} />
    </View>
  );
}

type StatProps = {
  libelle: string;
  valeur: number | string;
};

function BlocStatistique({ libelle, valeur }: StatProps) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValeur}>{valeur}</Text>
      <Text style={styles.statTitre}>{libelle}</Text>
    </View>
  );
}

export default function App() {
  const mode = 'ateliers';

  let listeAffichage = evenements;
  if (mode === 'ateliers') {
    listeAffichage = evenements.filter(e => e.categorie === 'Atelier' && PlacesRestantes(e) > 0);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.mainTitle}>Campus Agenda</Text>
      <Text style={styles.subTitle}>Événements du campus</Text>

      <View style={styles.statsContainer}>
        <BlocStatistique libelle="Événements" valeur={totalEvenements} />
        <BlocStatistique libelle="Complets" valeur={evenementsComplets} />
        <BlocStatistique libelle="Avec places" valeur={evenementsAvecPlaces} />
        <BlocStatistique libelle="Places libres" valeur={totalPlacesRestantes} />
      </View>

      <Text style={{ marginVertical: 10, fontWeight: 'bold', color: '#374151' }}>
        Mode : {mode}
      </Text>

      <FlatList
        data={listeAffichage}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CarteEvenement evenement={item} />}
        scrollEnabled={false}
        ListEmptyComponent={<Text style={{ color: 'gray', textAlign: 'center', marginTop: 20 }}>Aucun événement trouvé.</Text>}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 30,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statBox: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 3,
  },
  statValeur: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  statTitre: {
    fontSize: 9,
    color: '#4b5563',
    textAlign: 'center',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  badgeOuvert: { backgroundColor: '#22c55e' },
  badgePresque: { backgroundColor: '#f59e0b' },
  badgeComplet: { backgroundColor: '#ef4444' },
  texteBadge: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 11,
  },
  carte: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 15,
    borderRadius: 10,
    marginVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  cardCat: {
    fontSize: 13,
    color: '#6b7280',
    marginVertical: 2,
  },
  cardPlaces: {
    fontSize: 12,
    color: '#4b5563',
  },
});