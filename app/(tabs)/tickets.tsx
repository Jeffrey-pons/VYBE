import Logo from "@/components/LogoHeader";
import { ThemedText } from "@/components/ThemedText";
import { ScrollView, View } from 'react-native';
import globalStyles from "@/styles/globalStyle";

const TicketsScreen = () => {
    return (
        <ScrollView>
            <Logo/>
            <View style={globalStyles.containerX}>
                <ThemedText>BLABLABLA</ThemedText>
            </View>
            
        </ScrollView>
    );
};

export default TicketsScreen;