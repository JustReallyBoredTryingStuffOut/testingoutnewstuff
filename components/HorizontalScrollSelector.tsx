import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Modal,
  FlatList,
  Dimensions
} from 'react-native';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

type HorizontalScrollSelectorProps = {
  title: string;
  items: Array<{
    id: string;
    name: string;
    icon?: string;
  }>;
  selectedItem: string | null;
  onSelectItem: (itemId: string) => void;
  maxVisibleItems?: number;
  showMoreButton?: boolean;
  itemWidth?: number;
  itemHeight?: number;
  showFadeIndicators?: boolean;
};

export default function HorizontalScrollSelector({
  title,
  items,
  selectedItem,
  onSelectItem,
  maxVisibleItems = 4,
  showMoreButton = true,
  itemWidth = 120,
  itemHeight = 48,
  showFadeIndicators = true,
}: HorizontalScrollSelectorProps) {
  const { colors } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [showModal, setShowModal] = useState(false);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    setShowLeftFade(contentOffset.x > 0);
    setShowRightFade(contentOffset.x < contentSize.width - layoutMeasurement.width - 10);
  };

  const handleScrollToEnd = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handleScrollToStart = () => {
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
  };

  const visibleItems = items.slice(0, maxVisibleItems);
  const hasMoreItems = items.length > maxVisibleItems;

  const renderItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.itemButton,
        { 
          backgroundColor: colors.card, 
          borderColor: colors.border,
          width: itemWidth,
          height: itemHeight,
        },
        selectedItem === item.id && [styles.selectedItem, { backgroundColor: colors.primary, borderColor: colors.primary }],
      ]}
      onPress={() => onSelectItem(item.id)}
    >
      {item.icon && (
        <Text style={styles.itemIcon}>{item.icon}</Text>
      )}
      <Text
        style={[
          styles.itemText,
          { color: colors.text },
          selectedItem === item.id && styles.selectedItemText,
        ]}
        numberOfLines={1}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderModalItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.modalItem,
        { backgroundColor: colors.card, borderColor: colors.border },
        selectedItem === item.id && [styles.selectedModalItem, { backgroundColor: colors.primary, borderColor: colors.primary }],
      ]}
      onPress={() => {
        onSelectItem(item.id);
        setShowModal(false);
      }}
    >
      {item.icon && (
        <Text style={styles.modalItemIcon}>{item.icon}</Text>
      )}
      <Text
        style={[
          styles.modalItemText,
          { color: colors.text },
          selectedItem === item.id && styles.selectedModalItemText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      
      <View style={styles.scrollContainer}>
        {/* Left Fade Indicator */}
        {showFadeIndicators && showLeftFade && (
          <View style={[styles.fadeIndicator, styles.leftFade, { backgroundColor: colors.background }]}>
            <TouchableOpacity
              style={[styles.fadeButton, { backgroundColor: colors.card }]}
              onPress={handleScrollToStart}
            >
              <ChevronLeft size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
        )}

        {/* ScrollView */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {visibleItems.map(renderItem)}
          
          {/* More Button */}
          {showMoreButton && hasMoreItems && (
            <TouchableOpacity
              style={[
                styles.moreButton,
                { 
                  backgroundColor: colors.card, 
                  borderColor: colors.border,
                  width: itemWidth,
                  height: itemHeight,
                },
              ]}
              onPress={() => setShowModal(true)}
            >
              <MoreHorizontal size={20} color={colors.text} />
              <Text style={[styles.moreButtonText, { color: colors.text }]}>
                More
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Right Fade Indicator */}
        {showFadeIndicators && showRightFade && (
          <View style={[styles.fadeIndicator, styles.rightFade, { backgroundColor: colors.background }]}>
            <TouchableOpacity
              style={[styles.fadeButton, { backgroundColor: colors.card }]}
              onPress={handleScrollToEnd}
            >
              <ChevronRight size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Modal for More Items */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{title}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={[styles.closeButtonText, { color: colors.text }]}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={items}
              renderItem={renderModalItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalList}
              numColumns={2}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  scrollContainer: {
    position: 'relative',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  itemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  selectedItem: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  itemIcon: {
    fontSize: 18,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  selectedItemText: {
    color: '#FFFFFF',
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  moreButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  fadeIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  leftFade: {
    left: 0,
    backgroundGradient: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
  },
  rightFade: {
    right: 0,
    backgroundGradient: 'linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
  },
  fadeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalList: {
    padding: 16,
  },
  modalItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    margin: 4,
    gap: 8,
  },
  selectedModalItem: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  modalItemIcon: {
    fontSize: 18,
  },
  modalItemText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  selectedModalItemText: {
    color: '#FFFFFF',
  },
}); 