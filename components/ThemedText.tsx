import { Text, type TextProps, StyleSheet } from 'react-native';
import { Theme } from '@/constants/Theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'section' | 'authTitle' | 'authSubtitle' | 'subtitle' | 'link' | 'profileInitials';
};

export function ThemedText({
  style, 
  type = 'default',
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      style={[styles.default, styles[type], style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: "FunnelSans-Regular",
    color: Theme.text,
    fontSize: 24,
    marginTop: 14,
  },
  profileInitials: {
    fontSize: 28,
    marginTop: 14,
  },
  section: {
    fontSize: 24,
    marginTop: 14,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
  },
  authTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: "center",
    marginBottom: 30,
  },
  authSubtitle: {
    fontSize: 18,
    marginBottom: 36,
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
