import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
const globalStyles = StyleSheet.create({
  
  titleWhiteStyle: {
    fontWeight: "bold",
    fontFamily: "Fugaz-One",
    textAlign: "center",
  },
  buttonStyle: {
    backgroundColor: "white",
    color: "white",
    borderRadius: 100,
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 40,
    paddingLeft: 40,
    marginBottom: 16,
  },
  buttonSecondStyle: {
    backgroundColor: '#b36dff',
    borderRadius: 100,
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 20,
  },
  titleStyle: {
    color: "black",
    fontFamily: "FunnelSans-Regular",
  },
  titleSecondStyle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoAuthStyle: {
    width: 150,  
    height: 150,  
    resizeMode: "contain",  
  },
  headerTextStyle: {
    fontFamily: "FunnelSans-Regular",
    marginBottom: 30,
    fontSize: 30,
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
  footerAuthTextStyle: {
    fontSize: 16,
    color: "#bbb", 
    marginTop: 10,
    fontFamily: "FunnelSans-Regular"
  },
  footerAuthLinkStyle: {
    fontSize: 16,
    color: "#b36dff", 
    marginTop: 5,
    textDecorationLine: "underline",
    fontFamily: "FunnelSans-Regular"
  },
  subtitleAuthStyle: {
    fontSize: 18,
    marginBottom: 36,
    color: 'white',
    textAlign: 'center',
     fontFamily: "FunnelSans-Regular"
  }
});

export default globalStyles;