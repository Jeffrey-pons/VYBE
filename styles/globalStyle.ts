import { StyleSheet, Dimensions } from 'react-native';
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
    fontWeight: '500',
  },
  titleSecondStyle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  TextButtonStyle: {
    color: "black",
    fontFamily: "FunnelSans-Regular",
    fontSize: 20,
    // fontWeight: 'bold',
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
});

export default globalStyles;