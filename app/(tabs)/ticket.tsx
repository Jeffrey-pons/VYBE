import React from 'react';
import { View, Text } from 'react-native';
import Logo from '@/components/LogoHeader';

const TicketScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
       <Logo></Logo>
      <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', fontFamily: "FunnelSans-Regular" }} >Vous n'avez actuellement aucun ticket.</Text>
    </View>
  );
};

export default TicketScreen;
