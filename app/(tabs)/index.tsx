import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Logo from '@/components/LogoHeader';
import { auth } from '@/config/firebaseConfig';
import { router } from 'expo-router';
import { useLocationHandler } from '@/hooks/useLocationHandler';
import { iconChoiceLocation } from '@/utils/imagesUtils';
import { useEvents } from '@/hooks/useEvent';
import { EventCard } from '@/components/events/EventCard';
import CategoryMenu from '@/components/CategoryMenu';
import globalStyles from '@/styles/globalStyle';

const App = () => {
  const { 
    city, 
    manualCity, 
    showInput, 
    handleManualCityChange, 
    handleCityNext,
    toggleInput
  } = useLocationHandler();
  const textInputRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState<string | null>('');
  const { events, loading, error } = useEvents(activeCategory);

  // Changer la ville depuis l'input
const handleCitySubmit = () => {
  handleManualCityChange(manualCity || '');
  handleCityNext(auth.currentUser, router);
  toggleInput();
};

useEffect(() => {
  console.log("🟡 Nouvelle catégorie sélectionnée :", activeCategory);
}, [activeCategory]);


  return (
  <ScrollView>
      <View style={globalStyles.scrollContainer}>
    <Logo></Logo>
     <ThemedText style={styles.titleLocal}>
      {/* changer la logique ici et faire en sorte que le choix de la ville
      soit sous forme de liste, pareil pour la page localisation a 
      linscription */}
  
      Découvre ton prochain évènements à{' '}
      {/* <View style={styles.cityContainer}> */}
      {showInput ? (
  <TextInput
      ref={textInputRef}
      style={styles.inlineInput}
      value={manualCity || ''}
      onChangeText={handleManualCityChange}
      placeholder="Ville"
      onSubmitEditing={handleCitySubmit}
      returnKeyType="done"
      autoFocus
      placeholderTextColor="#ccc"
    />
) : (
  <TouchableOpacity onPress={toggleInput}>
    <Text style={styles.underlinedCity}>{city}</Text>
  </TouchableOpacity>
)}
        {/* </View> */}
    </ThemedText>
        {/* changer la logique et faire en sorte que quand on clique sur licon
        ca re affiche la page localisation et on peut re utiliser le bouton geolocalisation et après terminer
        ca nous ramene sur lindex */}
    <Image
        style={styles.iconSize}
        source={iconChoiceLocation}
        alt="Icône de choix de localisation"
      />
    <CategoryMenu activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <View style={styles.eventsContainer}>
      {events && events.length > 0 ? (
  <>
    {/* Afficher levenement le + en vedette */}
    <View style={styles.featuredEventContainer}>
      <EventCard
        event={events[0]}
        onPressDetails={() => router.push(`/event/${events[0].uid}`)}
      />
    </View>
        {/* voir pour distingue laffichage par categorie de la phrase */}
    <ThemedText type='text'>Les prochains {activeCategory} à {city}</ThemedText> 
    {/* Scroll horizontal des autres événements */}
        {/* Afficher les evenements filtres du plus recent au plus loin */}
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
      {events.slice(1, 11).map((event, index) => (
        <View key={index} style={styles.miniEventCard}>
          <EventCard
            event={event}
            onPressDetails={() => router.push(`/event/${event.uid}`)}
          />
        </View>
      ))}
    </ScrollView>
  </>
) : (
  <ThemedText type='text'>Aucun événement trouvé</ThemedText>
)}
      </View>
      </View>
      </ScrollView>
    
  );
      {/* BLOC TROUVE LES EVENEMENTS QUE TU AIMES CONNECTE TA MUSIQUE  */}
      {/* BLOC LES DERNIERS LIEUX COOL PRES DE CHEZ TOI (API LIEU CATEGORIE DANS LA VILLE ) puis une fois rempli, afficher un bloc devenement propose en fonction des gouts musicaux
        PUIS EVENEMENT PAR 10 / 20 */}
      {/* BLOC juste pour 'nom de la personne'''' */}


};

const styles = StyleSheet.create({
  inlineInput: {
    fontFamily: "Fugaz-One",
    fontSize: 30,
    borderBottomWidth: 0.4,
    borderBottomColor: 'white',
    color: 'white',
    fontWeight: 'bold',
    paddingBottom: 0,
    minWidth: 80,
  },
  iconSize: {
    width: 30,  
    height: 30,  
    position: 'absolute',
    top: 155,
    right: 0,
  },
  titleLocal: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: 'FunnelSans-Regular',
    fontSize: 31,
    textAlign: "center",
  },
  underlinedCity: {
    fontFamily: "Fugaz-One",
    fontSize: 30,
    borderBottomWidth: 0.4, 
    borderBottomColor: 'white', 
    paddingBottom: 0, 
    color: 'white', 
    fontWeight: 'bold', 
  },
  eventsContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  featuredEventContainer: {
    marginBottom: 20,
  },
  
  horizontalScroll: {
    paddingLeft: 10,
  },
  
  miniEventCard: {
    width: 250,
    marginRight: 10,
  },
});

export default App;