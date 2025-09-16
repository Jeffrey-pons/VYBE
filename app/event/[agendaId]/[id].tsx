import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEventById } from '@/hooks/useEventById';
import { auth } from '@/config/firebaseConfig';
import { useFavoriteId } from '@/hooks/useFavoriteId';
import globalStyles from '@/styles/globalStyle';
import {
  iconInformation,
  iconPlace,
  iconAccessibility,
  iconStatus,
  iconWordKey,
  iconChoiceLocation,
  iconApi,
  iconCroix,
  iconLink,
  iconArrowDown,
  iconArrowUp,
} from '@/utils/imagesUtils';
import { getEventDuration } from '@/utils/dateUtils';
import MapView, { Marker } from 'react-native-maps';
import { extractPriceLabel } from '@/utils/priceUtils';
import { Ionicons } from '@expo/vector-icons';

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Date non disponible';
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const statusLabels: Record<number, string> = {
  2: 'Reprogrammé — Les horaires de l’événement ont été modifiés récemment.',
  3: 'Déplacé en ligne — L’événement prévu en présentiel est désormais uniquement accessible en ligne.',
  4: 'Reporté — L’événement est momentanément reporté, de nouvelles dates seront communiquées.',
  5: 'Complet — L’événement affiche complet, plus de places disponibles.',
  6: 'Annulé — L’événement est annulé et ne sera pas reprogrammé pour l’instant.',
};

const EventDetailPage = () => {
  const { id, agendaId } = useLocalSearchParams();
  const router = useRouter();
  const { event, loading, error } = useEventById(agendaId, id);
  const agendaIdStr = String(agendaId);
  const eventIdStr = String(id);
  const uid = auth.currentUser?.uid;

  const { favorited, loading: favLoading, toggle } =
    useFavoriteId(uid, agendaIdStr, eventIdStr);

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [opening, setOpening] = useState(false);

  const handleBuy = async () => {
    const url = event.registration?.[0]?.value;

    if (!url) {
      Alert.alert(
        'Lien indisponible',
        "Aucun lien de billetterie n'est fourni pour cet évènement.",
      );
      return;
    }
    try {
      setOpening(true);

      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert(
          'Redirection impossible',
          "Cet évènement n'a pas de lien de redirection vers le site de billeterie.",
        );
        return;
      }

      Alert.alert('Redirection', 'Ouverture de la billetterie…');
      await Linking.openURL(url);
    } catch {
      Alert.alert('Erreur', "Impossible d'ouvrir la billetterie.");
    } finally {
      setOpening(false);
    }
  };

  const handleShare = () => {
  Alert.alert(
    'Partage bientôt disponible',
    'La fonctionnalité de partage sera disponible dans une seconde version de Vybe.'
  );
};

  if (loading) return <Text style={styles.loading}>Chargement...</Text>;
  if (error) return <Text style={styles.error}>Erreur : {error}</Text>;
  if (!event) return <Text style={styles.error}>Événement introuvable</Text>;

  const priceLabel = extractPriceLabel(event.conditions?.fr);
  const hasImage = Boolean(event.image?.base && event.image?.filename);
  const imageUri =
    hasImage ? `${event.image!.base}${event.image!.filename}` : undefined;

  return (
    <ScrollView contentContainerStyle={[globalStyles.scrollContainer]}>
      <View style={styles.container}>
        {/* IMAGE OU PLACEHOLDER */}
        <View style={styles.mediaBox}>
          {hasImage ? (
            <Image
              source={{ uri: imageUri! }}
              style={styles.eventImage}
              alt="Image de l'évènement"
              accessibilityLabel="Image de l'évènement"
            />
          ) : (
            <View style={[styles.eventImage, styles.imagePlaceholder]}>
              <Ionicons name="image-outline" size={40} color="#666" />
              <Text style={styles.placeholderText}>Aucune image</Text>
            </View>
          )}

          {/* Bouton partager */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
            accessibilityLabel='Repartager l"événement'
          >
            <Image
              source={iconLink}
              style={styles.iconActionButton}
              alt="Repartager"
              accessibilityLabel="Repartager"
            />
          </TouchableOpacity>

          {/* Bouton favori */}
          <TouchableOpacity
            style={styles.actionButtonTwo}
            onPress={toggle}
            disabled={!uid || favLoading}
            accessibilityLabel={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            accessibilityState={{ selected: favorited }}
            hitSlop={8}
          >
            <Ionicons
              name={favorited ? 'heart' : 'heart-outline'}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* Titre et description de l'événement */}
        <Text style={styles.eventTitle}>{event.title?.fr}</Text>
        <Text style={styles.eventDate}>{event.dateRange?.fr ?? 'Date non disponible'}</Text>
        <Text style={styles.eventLocation}>{event.location?.name ?? 'Lieu non disponible'}</Text>

        <View style={styles.textInformation}>
          <Image
            source={iconChoiceLocation}
            style={styles.iconLocation}
            alt="Icône lieu"
            accessibilityLabel="Icône lieu"
          />
          <Text style={styles.eventCity}>{event.location?.city ?? 'Ville non disponible'}</Text>
        </View>

        <View style={styles.separator} />

        {/* DESCRIPTION */}
        <Text style={styles.eventInformationTitle}>Informations sur l'évènement</Text>
        <Pressable
          onPress={() => setIsDescriptionExpanded((v) => !v)}
          accessibilityRole="button"
          hitSlop={8}
          style={styles.arrowContainer}
        >
          <Text
            style={styles.modalDescription}
            numberOfLines={isDescriptionExpanded ? undefined : 6}
          >
            {event.longDescription?.fr || 'Aucune description disponible'}
          </Text>

          <View style={styles.arrowContainer}>
            <Image
              source={isDescriptionExpanded ? iconArrowDown : iconArrowUp}
              style={styles.iconActionButton}
              alt="Flèche pour description"
              accessibilityLabel="Flèche pour description"
            />
          </View>
        </Pressable>

        {/* CONDITIONS */}
        <Text style={styles.eventSectionTitle}>Conditions</Text>
        <Text style={styles.eventText}>
          {event.conditions?.fr ?? 'Aucune condition pour cet évènement.'}
        </Text>

        <View>
          {event.registration?.some((item) => item.type === 'phone' || item.type === 'email') && (
            <>
              <Text style={styles.eventSectionTitle}>Contact</Text>

              {event.registration.map((item, index) => {
                switch (item.type) {
                  case 'phone':
                    return (
                      <Text key={index} style={styles.eventText}>
                        📱 {item.value}
                      </Text>
                    );
                  case 'email':
                    return (
                      <Text key={index} style={styles.eventText}>
                        📧 {item.value}
                      </Text>
                    );
                  default:
                    return null;
                }
              })}
            </>
          )}
        </View>

        {/* HORAIRE DUREE */}
        <Text style={styles.eventSectionTitle}>Horaires et durée</Text>
        <Text style={styles.eventText}>Débute le {formatDate(event.firstTiming?.begin)}</Text>
        <Text style={styles.eventText}>
          Durée estimée : {getEventDuration(event.firstTiming?.begin, event.firstTiming?.end)}
        </Text>

        {/* LIEU DETAILS */}
        <Text style={styles.eventSectionTitle}>Lieu</Text>
        <Text style={styles.eventText}>{event.location?.name ?? 'Nom indisponible'}</Text>
        <Text style={styles.eventText}>{event.location?.address ?? 'Adresse indisponible'}</Text>

        {/* MAP VIEW UNIQUEMENT MOBILE*/}
        {event.location?.latitude && event.location?.longitude && (
          // eslint-disable-next-line react-native/no-inline-styles
          <View style={{ height: 200, marginTop: 10, borderRadius: 10, overflow: 'hidden' }}>
            <MapView
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ flex: 1 }}
              initialRegion={{
                latitude: event.location.latitude,
                longitude: event.location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: event.location.latitude,
                  longitude: event.location.longitude,
                }}
                title={event.location?.name}
                description={event.location?.address}
              />
            </MapView>
          </View>
        )}

        {/* Restriction d'âge */}
        <View style={styles.textInformation}>
          <Image
            source={iconInformation}
            style={styles.iconImage}
            alt="Icône information"
            accessibilityLabel="Icône information"
          />
          <Text style={styles.eventText}>
            {event.age?.min
              ? `Réservé aux plus de ${event.age.min} ans.`
              : `Aucune restriction d'âge pour cet évènement.`}
          </Text>
        </View>

        {/* LIEU */}
        <View style={styles.textInformation}>
          <Image source={iconPlace} style={styles.iconImage} alt="Icône lieu" />
          <Text style={styles.eventText}>
            {event.location?.name
              ? `Présenté par ${event.location.name}`
              : `Lieu non précisé pour cet évènement.`}
          </Text>
        </View>

        {/* ACCESSIBILITÉ */}
        <View style={styles.textInformation}>
          <Image
            source={iconAccessibility}
            style={styles.iconImage}
            alt="Icône accessibilité"
            accessibilityLabel="Icône accessibilité"
          />
          <Text style={styles.eventText}>
            {event.accessibility?.ii ||
            event.accessibility?.hi ||
            event.accessibility?.vi ||
            event.accessibility?.pi ||
            event.accessibility?.mi
              ? `Évènement accessible ${[
                  event.accessibility?.ii ? 'aux personnes avec handicap mental 🧠' : null,
                  event.accessibility?.hi ? 'aux personnes avec handicap auditif 🤟' : null,
                  event.accessibility?.vi ? 'aux personnes avec handicap visuel 👁️' : null,
                  event.accessibility?.pi ? 'aux personnes à mobilité réduite ♿' : null,
                  event.accessibility?.mi ? 'aux personnes avec handicap psychique 🧠' : null,
                ]
                  .filter(Boolean)
                  .join(', ')}.`
              : 'Accessibilité non précisée pour cet évènement.'}
          </Text>
        </View>

        {/* MOTS CLES */}
        {(event.keywords?.fr ?? []).length > 0 && (
          <View style={styles.textInformation}>
            <Image
              source={iconWordKey}
              style={styles.iconImage}
              alt="Icône accessibilité"
              accessibilityLabel="Icône accessibilité"
            />
            <Text style={styles.eventText}>
              Mots-clés : {(event.keywords?.fr ?? []).join(', ')}
            </Text>
          </View>
        )}

        {/* STATUS */}
        {event.status !== 1 && (
          <View style={styles.textInformation}>
            <Image
              source={iconStatus}
              style={styles.iconImage}
              alt="Icône statut"
              accessibilityLabel="Icône statut"
            />
            <Text style={styles.eventText}>
              {event.status
                ? statusLabels[event.status] || 'Statut inconnu'
                : 'Statut non spécifié pour cet évènement.'}
            </Text>
          </View>
        )}

        {/* API */}
        <View style={styles.textInformation}>
          <Image
            source={iconApi}
            style={styles.iconImage}
            alt="Icône API"
            accessibilityLabel="Icône API"
          />
          <Text style={styles.eventText}>
            {event.originAgenda?.title
              ? `Données fournies par ${event.originAgenda.title}. Récupérées via l'API OpenAgenda.`
              : `Aucune information sur l'origine des données.`}
          </Text>
        </View>

        {/* FERMER LA PAGE */}
        <TouchableOpacity style={styles.closeEventDetailButton} onPress={() => router.back()}>
          <Image
            source={iconCroix}
            style={styles.iconCloseDetail}
            alt="Icône croix"
            accessibilityLabel="Icône croix"
          />
        </TouchableOpacity>
      </View>

      {/* BLOC STICKY PRENDS TA PLACE */}
      <View style={styles.fixedBottomBar}>
        <Text style={styles.reserveText}>{priceLabel}</Text>
        <TouchableOpacity
          // eslint-disable-next-line react-native/no-inline-styles
          style={[styles.buyButton, opening && { opacity: 0.6 }]}
          accessibilityLabel="Prendre sa place pour l’événement"
          accessibilityState={{ busy: opening, disabled: opening }}
          disabled={opening}
          onPress={handleBuy}
        >
          {opening ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.buyButtonText}>Prends ta place</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EventDetailPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    padding: 20,
    flex: 1,
  },

  mediaBox: {
    width: '100%',
    height: 300,      
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#0e0e0e',
    marginBottom: 0,
  },

  eventImage: {
    width: '100%',
    height: '100%',  
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginTop: 8,
    color: '#777',
    fontFamily: 'FunnelSans-Regular',
  },

  eventTitle: {
    fontSize: 22,
    color: 'white',
    marginTop: 20,
    fontFamily: 'FunnelSans-Regular',
  },
  eventDate: {
    fontSize: 16,
    color: '#ffdd59',
    marginVertical: 10,
    fontFamily: 'FunnelSans-Regular',
  },
  modalDescription: {
    fontSize: 16,
    color: 'gray',
    marginVertical: 10,
    fontFamily: 'FunnelSans-Regular',
  },
  eventSectionTitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
    marginTop: 15,
    fontFamily: 'FunnelSans-Regular',
  },
  eventInformationTitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
    fontFamily: 'FunnelSans-Regular',
  },
  eventLocation: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
    fontFamily: 'FunnelSans-Regular',
    textTransform: 'uppercase',
  },
  eventCity: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'FunnelSans-Regular',
  },
  eventText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
    fontFamily: 'FunnelSans-Regular',
    paddingRight: 28,
  },
  closeEventDetailButton: {
    position: 'absolute',
    top: 25,
    right: 25,
    backgroundColor: 'black',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  loading: {
    textAlign: 'center',
    marginTop: 40,
    color: 'white',
  },
  error: {
    textAlign: 'center',
    marginTop: 40,
    color: '#ff4d4d',
  },
  fixedBottomBar: {
    position: 'sticky',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    paddingTop: 10,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buyButton: {
    backgroundColor: '#ffdd59',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  buyButtonText: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'FunnelSans-Regular',
    textTransform: 'uppercase',
  },
  reserveText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'FunnelSans-Regular',
    marginRight: 10,
  },
  iconImage: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  iconCloseDetail: {
    width: 20,
    height: 20,
  },
  iconLocation: {
    width: 25,
    height: 25,
    marginRight: 5,
  },
  textInformation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  separator: {
    height: 1,
    backgroundColor: 'white',
    marginVertical: 20,
    width: '100%',
  },

  actionButton: {
    position: 'absolute',
    top: 245,
    right: 10,
    backgroundColor: 'black',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  actionButtonTwo: {
    position: 'absolute',
    backgroundColor: 'black',
    right: 60,
    top: 245,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  iconActionButton: {
    width: 22,
    height: 22,
    tintColor: 'white',
  },
  arrowContainer: {
    alignItems: 'center',
  },
});
