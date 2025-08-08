import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import globalStyles from '@/styles/globalStyle';
import Logo from '@/components/LogoHeader';

export default function NotFoundScreen() {
  return (
    <ThemedText style={globalStyles.container}>
      <Logo />
      <ThemedText type="title">Cet écran n'existe pas.</ThemedText>
      <Link href="/">
        <ThemedText type="link">Revenir sur la page d'accueil</ThemedText>
      </Link>
    </ThemedText>
  );
}
