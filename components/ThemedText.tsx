/* eslint-disable react-native/no-unused-styles */
import { Text, type TextProps, StyleSheet } from 'react-native';
import { Theme } from '@/constants/Theme';

export type ThemedTextProps = TextProps & {
  type?:
    | 'default'
    | 'title'
    | 'text'
    | 'sectionProfile'
    | 'authTitle'
    | 'authSubtitle'
    | 'subtitle'
    | 'link'
    | 'profileInitials'
    | 'profileName'
    | 'informationsProfile';
};

export function ThemedText({ style, type = 'default', ...rest }: ThemedTextProps) {
  return <Text style={[styles.default, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: {
    fontFamily: Theme.typography.fontFamily,
    color: Theme.colors.text,
    fontSize: Theme.typography.kilo.fontSize,
  },
  profileName: {
    fontSize: Theme.typography.mega.fontSize,
    fontWeight: Theme.typography.giga.fontWeight,
  },
  sectionProfile: {
    fontSize: Theme.typography.kilo.fontSize,
  },
  title: {
    fontSize: Theme.typography.giga.fontSize,
    fontWeight: Theme.typography.giga.fontWeight,
  },
  profileInitials: {
    fontSize: Theme.typography.tera.fontSize,
    fontWeight: Theme.typography.giga.fontWeight,
  },
  text: {
    color: Theme.colors.text,
    fontSize: Theme.typography.deca.fontSize,
    textAlign: Theme.alignments.textCenter.textAlign,
  },
  informationsProfile: {
    color: Theme.colors.text,
    fontSize: Theme.typography.deca.fontSize,
    lineHeight: 40,
  },
  authTitle: {
    fontSize: Theme.typography.mega.fontSize,
    fontWeight: Theme.typography.megaMedium.fontWeight,
    textAlign: Theme.alignments.textCenter.textAlign,
    marginBottom: 30,
  },
  authSubtitle: {
    fontSize: Theme.typography.deca.fontSize,
    marginBottom: 36, // Exception
    color: Theme.colors.text,
    textAlign: Theme.alignments.textCenter.textAlign,
  },
  subtitle: {
    fontSize: Theme.typography.deca.fontSize,
    fontWeight: Theme.typography.decaBold.fontWeight,
  },
  link: {
    lineHeight: Theme.typography.hecto.lineHeight,
    fontSize: Theme.typography.deci.fontSize,
    color: Theme.colors.violetShade1,
    textDecorationLine: 'underline',
  },
});
