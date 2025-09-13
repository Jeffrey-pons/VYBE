import { TouchableOpacity, Text } from 'react-native';
import globalStyles from '@/styles/globalStyle';
import { ThemedText } from '@/components/ThemedText';
import { View, Image, StyleSheet, Platform } from 'react-native';
import { Theme } from '@/constants/Theme';
import { vybeLogo } from '../utils/imagesUtils';
import { useRouter } from 'expo-router';

const WelcomeScreen = () => {
  const router = useRouter();
  return (
    <View style={styles.containerHomePage}>
      <Image
        source={vybeLogo}
        alt="Logo Vybe"
        style={styles.logoHome}
        accessibilityLabel="Logo Vybe"
      />
      <ThemedText type="title" style={styles.welcomeTitle}>
        TROUVE LES{'\n'}ÉVÈNEMENTS{'\n'}RIEN QUE POUR TOI
      </ThemedText>
      <TouchableOpacity
        onPress={() => router.push('/login')}
        style={globalStyles.buttonStyle}
        accessibilityLabel="Ouvrir la page de connexion"
      >
        <Text style={globalStyles.titleStyle}>CONNEXION / INSCRIPTION</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  containerHomePage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 50,
  },
  logoHome: {
    ...(Platform.OS !== 'web' && {
      width: 300,
      height: 300,
      resizeMode: 'contain',
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
