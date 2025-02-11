import { StyleSheet, Dimensions } from 'react-native';
const globalStyles = StyleSheet.create({
  
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexGrow: 1,
    gap: 40,
  },
  tinyLogo: {
    resizeMode: "center",
  },
  TitleWhiteStyle: {
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
});

export default globalStyles;