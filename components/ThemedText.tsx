import { Text, type TextProps, StyleSheet } from 'react-native';
import { Theme } from '@/constants/Theme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitleAuth' | 'subtitle' | 'link';
};

export function ThemedText({
  style, 
  darkColor = Theme.text, 
  type = 'default',
  ...rest
}: ThemedTextProps) {

  return (
    <Text
      style={[
        { color : darkColor},
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitleAuth' ? styles.subtitle : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
  },
  subtitleAuth: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: "center",
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
