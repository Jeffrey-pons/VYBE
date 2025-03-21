import React from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Button } from 'react-native-elements';
import { Theme } from '@/constants/Theme';
import globalStyles from '@/styles/globalStyle';
import { registerIcon } from '@/utils/imagesUtils';
import { BlurView } from '@react-native-community/blur';

interface UserModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  confirmButtonStyle?: object;
  cancelButtonStyle?: object;
  confirmTitleStyle?: object;
  cancelTitleStyle?: object;
  closeOnBackdropPress?: boolean;
  modalType?: 'logout' | 'delete' | 'update'; 
}

export const UserModal: React.FC<UserModalProps> = ({
  visible,
  onClose,
  title,
  children,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  onConfirm,
  showCancelButton = true,
  showConfirmButton = true,
  confirmButtonStyle,
  cancelButtonStyle,
  confirmTitleStyle,
  cancelTitleStyle,
  closeOnBackdropPress = true,
  modalType,
}) => {
  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  const isLogoutModal = modalType === 'logout';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
      <BlurView
  style={styles.blurContainer}
  blurType="dark"
  blurAmount={10}
/>
        
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <View style={styles.backdrop}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContent}>
                {title && (
                  <ThemedText type="title" style={styles.modalTitle}>
                    {title}
                  </ThemedText>
                )}
                
                {isLogoutModal && (
                  <View style={styles.imageContainer}>
                    <Image 
                      source={registerIcon} 
                      style={styles.logoutImage}
                      resizeMode="contain"
                    />
                  </View>
                )}
                
                <View style={styles.contentContainer}>
                  {children}
                </View>
                
                {(showCancelButton || showConfirmButton) && (
                  <View style={styles.buttonContainer}>
                    {showCancelButton && (
                      <Button
                        title={cancelText}
                        buttonStyle={cancelButtonStyle || globalStyles.buttonDeletedeStyle}
                        titleStyle={cancelTitleStyle || globalStyles.titleDeletedStyle}
                        onPress={onClose}
                      />
                    )}
                    
                    {showConfirmButton && (
                      <Button
                        title={confirmText}
                        buttonStyle={confirmButtonStyle || globalStyles.buttonSecondStyle}
                        titleStyle={confirmTitleStyle || globalStyles.titleSecondStyle}
                        onPress={onConfirm}
                      />
                    )}
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blurContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'transparent', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: Theme.colors.text,
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logoutImage: {
    width: 80,
    height: 80,
  },
  contentContainer: {
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
    gap: 15,
  },
});