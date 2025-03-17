import { Link } from "expo-router";
import { Button } from "react-native-elements";
import globalStyles from "@/styles/globalStyle";
import { ThemedText } from "@/components/ThemedText";
import { View, Image, StyleSheet, Platform } from "react-native";
import { Theme } from "@/constants/Theme";
import { vybeLogo } from '../utils/imagesUtils';

const WelcomeScreen = () => {
    return (
        <View style={styles.containerHomePage}>
          <Image
            source={vybeLogo}
            alt="Logo Vybe"
            style={styles.logoHome}
          />
          <ThemedText type="title"style={styles.welcomeTitle}>TROUVE LES{'\n'}ÉVÈNEMENTS{'\n'}RIEN QUE POUR TOI</ThemedText>
          <Link href={"/login"} asChild>
            <Button 
              buttonStyle={globalStyles.buttonStyle} 
              title="CONNEXION / INSCRIPTION"
              titleStyle={globalStyles.titleStyle} />
          </Link>
        </View>
    )
};

const styles = StyleSheet.create({
  containerHomePage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 50,
  },  
  logoHome: {
    ...(Platform.OS !== "web" && {
      width: 300, 
      height: 300, 
      resizeMode: "contain",
      marginBottom: -110,
    }),
  },
  welcomeTitle: {
    fontWeight: Theme.typography.megaBold.fontWeight,
    fontFamily: Theme.typography.fontFamilySecondary,
    textAlign: Theme.alignments.textCenter.textAlign,
  },
});

export default WelcomeScreen;