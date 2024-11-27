import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteUser, getUserInfos,  } from '@/services/backEnd.api';
import { useNavigation } from 'expo-router';
import globalStyles from '@/styles/globalStyles';
import { Button } from 'react-native-elements';
import LocationComponent from '@/components/Location';

const ProfileScreen = () => {
  const [city, setCity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null); 
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userId = await AsyncStorage.getItem('userId');
        if (!token || !userId) {
          console.error("Token ou User ID manquant");
          Alert.alert("Erreur", "Vous devez être connecté pour voir vos informations.");
          return;
        }
        const userInfos = await getUserInfos(userId, token);
        setUserData(userInfos);
      } catch (error) {
        console.error("Erreur lors de la récupération des informations utilisateur :", error);
        Alert.alert("Erreur", "Impossible de récupérer vos informations.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userId');
      navigation.navigate("login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');

      if (!token || !userId) {
        Alert.alert("Erreur", "Vous devez être connecté pour effectuer cette action.");
        return;
      }
      await deleteUser(userId, token);

      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userId');
      Alert.alert('Compte supprimé', 'Votre compte a été supprimé avec succès.');
      navigation.navigate('login');
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la suppression du compte.');
    }
  };

  const getInitials = (firstName, lastName) => {
    const initials = [];
    if (firstName) {
      initials.push(firstName.charAt(0).toUpperCase());
    }
    if (lastName) {
      initials.push(lastName.charAt(0).toUpperCase());
    }
    return initials.join('');
  };

  const handleCityDetected = async (cityName) => {
    setCity(cityName);
  };

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null); 
    } else {
      setExpandedSection(section); 
    }
  };

  const renderArrow = (section) => {
    return expandedSection === section ? '⏵' : '⏷'; 
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Impossible de récupérer les informations utilisateur.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollViewContent}>
      <View style={styles.container}>
        {/* Conteneur centré pour l'avatar et le nom */}
        <View style={styles.centeredContainer}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitials(userData.name, userData.lastname)}</Text>
          </View>
          <Text style={styles.nameText}>{`${userData.name} ${userData.lastname}`}</Text>
        </View>

        {/* Sections avec contenu aligné à gauche */}
        <TouchableOpacity style={styles.section} onPress={() => toggleSection('coordinates')}>
          <Text style={globalStyles.textClassic}>{renderArrow('coordinates')} Coordonnées</Text>
        </TouchableOpacity>
        {expandedSection === 'coordinates' && (
          <View>
            <Text style={globalStyles.userText}>Prénom : {userData.name}</Text>
            <Text style={globalStyles.userText}>Nom : {userData.lastname}</Text>
            <Text style={globalStyles.userText}>Email : {userData.mail}</Text>
          </View>
        )}

        {/* Localisation */}
        <TouchableOpacity style={styles.section} onPress={() => toggleSection('location')}>
          <Text style={globalStyles.textClassic}>{renderArrow('location')} Localisation</Text>
        </TouchableOpacity>

        {expandedSection === 'location' && (
          <View>
            <Text style={globalStyles.userText}>Ville Actuelle : {city || 'Détection en cours...'}</Text>
            <LocationComponent onCityDetected={handleCityDetected} />
          </View>
        )}

        {/* Confidentialité */}
        <TouchableOpacity style={styles.section} onPress={() => toggleSection('privacy')}>
          <Text style={globalStyles.textClassic}>{renderArrow('privacy')} Confidentialité</Text>
        </TouchableOpacity>
        {expandedSection === 'privacy' && (
          <View>
            <Text style={globalStyles.userText}>{userData.privacy || "Public"}</Text>
          </View>
        )}

        {/* Section Crédit */}
        <TouchableOpacity style={styles.section} onPress={() => toggleSection('credits')}>
          <Text style={globalStyles.textClassic}>{renderArrow('credits')} Crédit</Text>
        </TouchableOpacity>
        {expandedSection === 'credits' && (
          <View>
            <Text style={globalStyles.userText}>{userData.credits || 0} points</Text>
          </View>
        )}

        {/* Section Notifications */}
        <TouchableOpacity style={styles.section} onPress={() => toggleSection('notifications')}>
          <Text style={globalStyles.textClassic}>{renderArrow('notifications')} Notifications</Text>
        </TouchableOpacity>
        {expandedSection === 'notifications' && (
          <View>
            <Text style={globalStyles.userText}>{userData.notifications || "Aucune"}</Text>
          </View>
        )}

        {/* Section Favoris */}
        <TouchableOpacity style={styles.section} onPress={() => toggleSection('favorites')}>
          <Text style={globalStyles.textClassic}>{renderArrow('favorites')} Favoris</Text>
        </TouchableOpacity>
        {expandedSection === 'favorites' && (
          <View>
            <Text style={styles.favoris}>{userData.favorites || "Aucun"}</Text>
          </View>
        )}

        {/* Boutons */}
        <Button title="Se déconnecter" buttonStyle={globalStyles.buttonStyle} 
            titleStyle={globalStyles.titleStyle} onPress={handleLogout} />
             <Button title="Supprimer mon compte" buttonStyle={globalStyles.buttonStyle} 
            titleStyle={globalStyles.titleStyle} onPress={handleDeleteAccount} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',  
    padding: 20,

  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',  
    width: '100%',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    color: '#fff',
    fontSize: 40,
    fontFamily: "FunnelSans-Regular",
    marginBottom: 2,
  },
  nameText: {
    fontSize: 22,
    fontFamily: "FunnelSans-Regular",
    marginBottom: 20,
    color: "white"
  },
  section: {
    marginBottom: 15,
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'flex-start',  
  },
  sectionText: {
    textAlign: 'left', 
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#ff6347',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    marginBottom: 10,
    alignItems: 'center', 
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoris: {
    marginBottom: 30,
    fontSize: 16,
    color: "#bbb", 
    marginTop: 10,
    fontFamily: "FunnelSans-Regular",
    alignItems: "flex-start"
  }
});
export default ProfileScreen;