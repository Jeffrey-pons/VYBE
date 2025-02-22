import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity , View} from 'react-native';
import { Theme } from '@/constants/Theme';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { DarkTheme } from '@react-navigation/native';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = DarkTheme

  return (
    <ThemedText>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <IconSymbol
          name="chevron.right"
          size={22}
          weight="medium"
          color={Theme.text}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }], marginTop: 14 }}
        />

        <ThemedText type="default" style={styles.title}>{title}</ThemedText>
      </TouchableOpacity>
      <View style={styles.separator} />
      {isOpen && <ThemedText style={styles.content}>{children}</ThemedText>}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
  title: {
    flex: 1, 
  },
  separator: {
    height: 1, 
    backgroundColor: '#ddd', 
    width: '100%',
    marginTop: 5,
  },
});
