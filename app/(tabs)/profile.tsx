import React, { useState, useEffect } from 'react';
import { ScrollView, View, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText'; 
import { Button } from 'react-native-elements';
import { Collapsible } from '@/components/Collapsible';
import { Theme } from '@/constants/Theme';
import Logo from '@/components/LogoHeader';
import globalStyles from '@/styles/globalStyle';

const ProfileScreen = () => {

const getInitials = (firstName: string, lastName: string) => {
    const initials = [];
    if (firstName) {
      initials.push(firstName.charAt(0).toUpperCase());
    }
    if (lastName) {
      initials.push(lastName.charAt(0).toUpperCase());
    }
    return initials.join('');
  };

  return (
    <ScrollView>
      <Logo />
      <View style={globalStyles.containerX}>
        <View style={styles.centeredContainer}>
          <View style={styles.avatarContainer}>
            <ThemedText type="title">
              {/* {userData.name.charAt(0).toUpperCase()}{userData.lastname.charAt(0).toUpperCase()} */}
            </ThemedText>
          </View>
          <ThemedText type="profileInitials">TestonsJ Ensemble</ThemedText>
        </View>

        <Collapsible title="Coordonnées">
          <View>
            <View style={styles.subContainerCoordonees}>
              <ThemedText type="text">Nom : </ThemedText>
              <ThemedText type="text">Prénom : </ThemedText>
            </View>
            <ThemedText type="text">Email : </ThemedText>
            <ThemedText type="text">Numéro : </ThemedText>
            <ThemedText type="text">Mot de passe : </ThemedText>
            <View style={styles.buttonContainer}>
              <Button title="Modifier" buttonStyle={styles.buttonUpdatedProfileStyle} titleStyle={styles.titleUpdatedProfileStyle}></Button>
            </View>
          </View>

        </Collapsible>

        <Collapsible title="Localisation">
          <ThemedText type="text">Ville Actuelle : {'Détection en cours...'}</ThemedText>
          {/* <LocationComponent onCityDetected={handleCityDetected} /> */}
        </Collapsible>

        <Collapsible title="Connecte ta musique">
          <ThemedText type="text">{"Public"}</ThemedText>
        </Collapsible>

        <Collapsible title="Notifications">
          <ThemedText type="text">{ 0} points</ThemedText>
        </Collapsible>

        <Collapsible title="Lieu favoris">
          <ThemedText type="text">Aucun Lieu favoris n'a encore été ajouté.</ThemedText>
        </Collapsible>

        <Collapsible title="Politique de confidentialité">
          <ThemedText type="text">{ 0} points</ThemedText>
        </Collapsible>

        <Collapsible title="CGU">
          <ThemedText type="text">{"Aucune"}</ThemedText>
        </Collapsible>

        <Collapsible title="F.A.Q">
          <ThemedText type="text">{ "Aucun"}</ThemedText>
        </Collapsible>

        <View style={styles.subcontainer}>
        <Button title="Se déconnecter" buttonStyle={globalStyles.buttonStyle} titleStyle={globalStyles.TextButtonStyle}  />
        <Button title="Supprimer mon compte" buttonStyle={styles.buttonDeletedeStyle} titleStyle={styles.titleDeletedStyle} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   width: "90%",
  //   margin: "auto"
  // },
  subcontainer: {
    paddingTop: 20, 
    width: "70%",
    margin: "auto"

  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Theme.colors.text,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDeletedeStyle: {
    backgroundColor: "grey",
    color: "white",
    borderRadius: 100,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 40,
    paddingLeft: 40,
    marginBottom: 16,
    marginTop: 10,
  },
  titleDeletedStyle: {
    fontFamily: "FunnelSans-Regular",
  },
  buttonUpdatedProfileStyle: {
    backgroundColor: "white",
    borderRadius: 100,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 40,
    paddingLeft: 40,
    marginBottom: 16,
    marginTop: 10,
  },
  titleUpdatedProfileStyle: {
    color: "black",
    fontFamily: "FunnelSans-Regular",
  },
  buttonContainer: {
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 10, 
  },
  subContainerCoordonees: {
    flexDirection: "row",
    flexWrap: "wrap",
    color: "red",
  },
});

export default ProfileScreen;
