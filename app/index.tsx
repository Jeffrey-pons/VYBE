import { Text, View, Image, ActivityIndicator  } from "react-native";
import { Button } from "react-native-elements"
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { Link } from "expo-router";
import globalStyles from "@/styles/globalStyles";

type Props = {};

const WelcomeScreen = (props: Props) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserToken = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        router.replace("/(tabs)");
      }
      setLoading(false);
    };
    checkUserToken();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  return (
        <View style={globalStyles.container}>
         <Image
        style={globalStyles.tinyLogo}
        source={require('../assets/images/logos/VYBE_logoTwo.png')}
      />
      <Text style={globalStyles.textWhite}>TROUVE LES{'\n'}ÉVÈNEMENTS{'\n'}RIEN QUE POUR TOI</Text>
        <Link href={"/login"} asChild>
            <Button 
            buttonStyle={globalStyles.buttonStyle} 
            title="CONNEXION / INSCRIPTION"
            titleStyle={globalStyles.titleStyle} />
        </Link>
        </View>
  );
};

export default WelcomeScreen;

