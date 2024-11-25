import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { AuthProvider } from '@/context/AuthContext'; 

type Props = {};

const WelcomeScreen = (props: Props) => {
  return (
    <div style={{
        backgroundColor: 'red'
    }}>

        <View style={styles.container}>
        <Text>Welcome Screen</Text>
        <Link href={"/login"} asChild>
            <TouchableOpacity>
            <Text>Go to LOGIN Screen</Text>
            </TouchableOpacity>
        </Link>
        <Link href={"/register"} asChild>
            <TouchableOpacity>
            <Text>Go to REGISTER Screen</Text>
            </TouchableOpacity>
        </Link>
        </View>
    </div>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});