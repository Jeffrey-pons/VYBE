import { Link } from "expo-router";
import { Button } from "react-native-elements";
import globalStyles from "@/styles/globalStyle";
import { ThemedText } from "@/components/ThemedText";
import { View, Image, StyleSheet } from "react-native";
import { Theme } from "@/constants/Theme";

const WelcomeScreen = () => {
    return (
        <View style={styles.containerHomePage}>
          <Image
            source={require('../assets/images/logos/VYBE_logo_white_transparent_home.png')}
            accessibilityLabel="Logo Vybe"
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
    display: "flex",
    flexGrow: 1,
    gap: 40,
  },  
  welcomeTitle: {
    fontWeight: Theme.typography.megaBold.fontWeight,
    fontFamily: Theme.typography.fontFamilySecondary,
    textAlign: Theme.alignments.textCenter.textAlign,
  },
});

export default WelcomeScreen;