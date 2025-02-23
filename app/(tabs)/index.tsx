import { StyleSheet, Platform, View, ScrollView } from 'react-native';
import globalStyles from '@/styles/globalStyle';
import { ThemedText } from '@/components/ThemedText';
import Logo from '@/components/LogoHeader';

export default function HomeScreen() {
  return (
<ScrollView>
  <Logo/>
  <View style={globalStyles.containerX}>
      <ThemedText style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
      </ThemedText>
      <ThemedText style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="default">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="default">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12'
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedText>
      <ThemedText style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedText>
      <ThemedText style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="default">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="default">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="default">app</ThemedText> to{' '}
          <ThemedText type="default">app-example</ThemedText>.
        </ThemedText>
      </ThemedText>
      </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
