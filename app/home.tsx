import { Text, View, Image, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Button } from "react-native-elements";
import globalStyles from "@/styles/globalStyle";
import { ThemedText } from "@/components/ThemedText";

const WelcomeScreen = () => {
    return (
        <View style={styles.container}>
         <Image
        style={styles.logoHomePage}
        source={require('../assets/images/logos/VYBE_logo_white_transparent_home.png')}
      />
      <ThemedText type="title"style={globalStyles.titleWhiteStyle}>TROUVE LES{'\n'}ÉVÈNEMENTS{'\n'}RIEN QUE POUR TOI</ThemedText>
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
    logoHomePage: {
        resizeMode: "center",
      },
      container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexGrow: 1,
        gap: 40,
      },
});

export default WelcomeScreen;