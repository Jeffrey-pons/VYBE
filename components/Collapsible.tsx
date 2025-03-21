import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity , View} from 'react-native';
import { Theme } from '@/constants/Theme';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { DarkTheme } from '@react-navigation/native';

export function Collapsible({ children, title, subtitle }: PropsWithChildren & { title?: string, subtitle?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = DarkTheme

  return (
    <View>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <IconSymbol
          name="chevron.right"
          size={22}
          weight="medium"
          color={Theme.colors.text}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }], marginTop: 30 }}
        />

        <ThemedText type="sectionProfile" style={styles.title}>{title}</ThemedText>
        {subtitle && <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>}
      </TouchableOpacity>
      <View style={styles.separator} />
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
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
  },
  title: {
    flex: 1, 
    marginTop: 25,
  },
  subtitle: {
    // flex: 1, 
    color: Theme.colors.text,
    fontSize: Theme.typography.base.fontSize,
    marginTop: 25,
  },
  separator: {
    height: 1, 
    backgroundColor: '#ddd', 
    width: '100%',
    marginTop: 5,
  },
});
