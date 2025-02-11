import { Text, View, Image, ActivityIndicator  } from "react-native";
import { Link } from "expo-router";
import { Button } from "react-native-elements";
import globalStyles from "@/styles/global.style";

const WelcomeScreen = () => {

    return (
        <View style={globalStyles.container}>
         <Image
        style={globalStyles.tinyLogo}
        source={require('../assets/images/logos/VYBE_logo_white_transparent (2).png')}
      />
      <Text style={globalStyles.TitleWhiteStyle}>TROUVE LES{'\n'}ÉVÈNEMENTS{'\n'}RIEN QUE POUR TOI</Text>
        <Link href={"/login"} asChild>
            <Button 
            buttonStyle={globalStyles.buttonStyle} 
            title="CONNEXION / INSCRIPTION"
            titleStyle={globalStyles.titleStyle} />
        </Link>
        </View>
    )
}

export default WelcomeScreen;