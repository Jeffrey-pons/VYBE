import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, ScrollView } from 'react-native';
import {
  iconTonight,
  iconThisWeek,
  iconConcert,
  iconFestival,
  iconSpectacle,
  iconExposition,
  iconHumor,
  iconAtelier,
} from '@/utils/imagesUtils';

interface CategoryMenuProps {
  activeCategory: string | null;
  setActiveCategory: (category: string) => void;
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({ activeCategory, setActiveCategory }) => {
  const current = activeCategory && activeCategory.length > 0 ? activeCategory : 'upcoming';
  const categories = [
    {
      key: 'upcoming',
      label: 'A venir',
      icon: iconTonight,
      accessibilityLabel: 'Icône de la catégorie A venir',
    },
    {
      key: 'week',
      label: 'Cette semaine',
      icon: iconThisWeek,
      accessibilityLabel: 'Icône de la catégorie Cette semaine',
    },
    {
      key: 'concert',
      label: 'Concerts',
      icon: iconConcert,
      accessibilityLabel: 'Icône de la catégorie Concerts',
    },
    {
      key: 'festival',
      label: 'Festivals',
      icon: iconFestival,
      accessibilityLabel: 'Icône de la catégorie Festivals',
    },
    {
      key: 'spectacle',
      label: 'Spectacles',
      icon: iconSpectacle,
      accessibilityLabel: 'Icône de la catégorie Spectacles',
    },
    {
      key: 'exposition',
      label: 'Expositions',
      icon: iconExposition,
      accessibilityLabel: 'Icône de la catégorie Expositions',
    },
    {
      key: 'humour',
      label: 'Humours',
      icon: iconHumor,
      accessibilityLabel: 'Icône de la catégorie Humours',
    },
    {
      key: 'atelier',
      label: 'Ateliers',
      icon: iconAtelier,
      accessibilityLabel: 'Icône de la catégorie Ateliers',
    },
    {
      key: 'soiree',
      label: 'Soirées',
      icon: iconFestival,
      accessibilityLabel: 'Icône de la catégorie Soirées',
    },
  ];

  return (
    <View style={styles.categoriesContainer}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.categoryRow}
        contentOffset={{ x: 0, y: 0 }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.key}
            testID={`category-${category.key}`}
            style={[styles.categoryCard, current === category.key && styles.activeCategory]}
            onPress={() => setActiveCategory(category.key)}
          >
            <Image
              style={styles.iconSizeCategory}
              source={category.icon}
              accessibilityLabel={category.accessibilityLabel}
            />
            <Text style={styles.categoryText}>{category.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  categoriesContainer: {
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  categoryCard: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'transparent',
    borderRadius: 8,
    borderWidth: 2,
    color: 'green',
    width: 101,
    padding: 10,
  },
  activeCategory: {
    borderColor: 'yellow',
  },
  iconSizeCategory: {
    width: 50,
    height: 50,
  },
  categoryText: {
    fontSize: 17,
    marginTop: 10,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'FunnelSans-Regular',
  },
});

export default CategoryMenu;
