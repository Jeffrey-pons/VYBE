// import React, { useEffect, useState } from 'react';
// import { ScrollView, Text, StyleSheet, View } from 'react-native';
// import { fetchEventsByCity } from '@/services/api';

// const EventsList = ({ city }) => {
//   const [events, setEvents] = useState([]);
//   const [errorMsg, setErrorMsg] = useState(null);

//   useEffect(() => {
//     if (city) {
//       const fetchEvents = async () => {
//         try {
//           const eventsData = await fetchEventsByCity(city);
//           setEvents(eventsData);
//         } catch (error) {
//           setErrorMsg('Erreur lors de la récupération des événements');
//         }
//       };

//       fetchEvents();
//     }
//   }, [city]); // Recharger les événements chaque fois que la ville change

//   if (errorMsg) {
//     return <Text style={styles.container}>{errorMsg}</Text>;
//   }

//   if (events.length === 0) {
//     return <Text style={styles.container}>Aucun événement trouvé pour {city}.</Text>;
//   }

//   return (
//     <ScrollView>
//       {events.map((event, index) => (
//         <View key={index} style={styles.eventItem}>
//           <Text style={styles.eventTitle}>{event.title}</Text>
//           <Text>{event.start_date}</Text>
//           <Text>{event.location}</Text>
//         </View>
//       ))}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     color: 'black',
//   },
//   eventItem: {
//     marginVertical: 10,
//   },
//   eventTitle: {
//     fontWeight: 'bold',
//   },
// });

// export default EventsList;
