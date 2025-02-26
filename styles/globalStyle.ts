import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '@/constants/Theme';
const { width } = Dimensions.get('window');
const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  containerX: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  buttonStyle: {
    backgroundColor: Theme.colors.text,
    borderRadius: 100,
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 40,
    paddingLeft: 40,
    marginBottom: 16,
  },
  buttonSecondStyle: {
    backgroundColor: Theme.colors.violet,
    borderRadius: 100,
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 20,
  },
  titleStyle: {
    color: Theme.colors.background,
    fontFamily: Theme.typography.fontFamily,
    fontWeight: Theme.typography.megaBold.fontWeight,
  },
  titleSecondStyle: {
    fontSize: Theme.typography.deciBold.fontSize,
    fontWeight: Theme.typography.deciBold.fontWeight,
  },
  TextButtonStyle: {
    color: Theme.colors.background,
    fontFamily: Theme.typography.fontFamily,
    fontSize: Theme.typography.deca.fontSize,
  },
  
  // Page Auth 
  logoAuthStyle: {
    width: 150,  
    height: 150,  
    resizeMode: "contain",  
  },
  input: {
    height: 50,
    width: width > 500 ? "50%" : "100%", 
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 100,
    backgroundColor: Theme.colors.text,
    color: Theme.colors.background,
    fontSize: Theme.typography.base.fontSize,
    fontFamily: Theme.typography.fontFamily,
  },
  footerAuthTextStyle: {
    fontSize: Theme.typography.deci.fontSize,
    color: "#bbb", 
    marginTop: 10,
    fontFamily: Theme.typography.fontFamily,
  },
  footerAuthLinkStyle: {
    fontSize: Theme.typography.deci.fontSize,
    color: Theme.colors.violet,
    marginTop: 5,
    textDecorationLine: "underline",
    fontFamily: Theme.typography.fontFamily,
  },
});

export default globalStyles;