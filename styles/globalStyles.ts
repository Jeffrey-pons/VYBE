import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
const globalStyles = StyleSheet.create({
  
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexGrow: 1,
    gap: 40,
  },
  textWhite: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Fugaz-One",
    fontSize: 39,
    textAlign: "center",
  },
  buttonStyle: {
    backgroundColor: "white",
    color: "white",
    borderRadius: 100,
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 20,
    paddingLeft: 20,
    marginBottom: 16,
  },
  titleStyle: {
    color: "black",
    fontFamily: "FunnelSans-Regular",
  },
  tinyLogo: {
    resizeMode: "center",
  },
  tinyLogoTwo: {
    width: 150,  
    height: 150,  
    resizeMode: "contain",  
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#fff", 
    fontFamily: "FunnelSans-Regular",
  },
  textClassic: {
    fontSize: 24,
    color: "#fff", 
    fontFamily: "FunnelSans-Regular",
  },
  input: {
    height: 50,
    width: width > 500 ? "50%" : "100%", 
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 100,
    backgroundColor: "white", 
    color: "black", 
    fontSize: 18,
    fontFamily: "FunnelSans-Regular",
  },
  userText: {
    fontSize: 16,
    color: "#bbb", 
    marginTop: 10,
    marginBottom: 10,
    fontFamily: "FunnelSans-Regular",
    alignItems: "flex-start"
  },
  footerText: {
    fontSize: 16,
    color: "#bbb", 
    marginTop: 10,
    fontFamily: "FunnelSans-Regular"
  },
  footerLink: {
    fontSize: 16,
    color: "#b36dff", 
    marginTop: 5,
    textDecorationLine: "underline",
    fontFamily: "FunnelSans-Regular"
  },
  scrollViewContent: {
    flexGrow: 1, // Permet de remplir tout l'espace disponible
    justifyContent: 'center', // Centre le contenu verticalement
    padding: 20,
  },
  
});

export default globalStyles;
