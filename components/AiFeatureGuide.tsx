import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { X, ChevronRight, Info } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';

interface GuideSection {
  title: string;
  description: string;
  route?: string;
}

interface AiFeatureGuideProps {
  visible: boolean;
  onClose: () => void;
}

export default function AiFeatureGuide({ visible, onClose }: AiFeatureGuideProps) {
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState<GuideSection | null>(null);
  
  const sections: GuideSection[] = [
    {
      title: "Setting Goals",
      description: "Learn how to set daily, weekly, and monthly fitness goals. Track your progress automatically and get reminders to stay on track.",
      route: "/goals"
    },
    {
      title: "Tracking Workouts",
      description: "Log your workouts, track sets, reps, and weights. Create custom workouts or use our pre-defined templates.",
      route: "/workouts"
    },
    {
      title: "Nutrition Tracking",
      description: "Track your macros, calories, and water intake. Log meals and see your progress toward daily nutrition targets.",
      route: "/nutrition"
    },
    {
      title: "Health Monitoring",
      description: "Track steps, weight, and other health metrics. Connect health devices for more comprehensive tracking.",
      route: "/health"
    },
    {
      title: "Achievements & Challenges",
      description: "Earn badges, maintain streaks, and complete challenges. Track your progress and celebrate your fitness milestones.",
      route: "/achievements"
    },
  ];
  
  const handleSectionPress = (section: GuideSection) => {
    setSelectedSection(section);
  };
  
  const handleNavigate = (route?: string) => {
    if (route) {
      onClose();
      router.push(route);
    }
  };
  
  const renderSectionDetail = () => {
    if (!selectedSection) return null;
    
    return (
      <Modal
        visible={!!selectedSection}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedSection(null)}
      >
        <View style={styles.detailModalContainer}>
          <View style={styles.detailModalContent}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>{selectedSection.title}</Text>
              <TouchableOpacity onPress={() => setSelectedSection(null)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.detailScrollView}>
              <Text style={styles.detailDescription}>{selectedSection.description}</Text>
              
              <View style={styles.tipContainer}>
                <Info size={20} color={colors.primary} />
                <Text style={styles.tipText}>
                  You can ask the AI assistant specific questions about {selectedSection.title.toLowerCase()} at any time.
                </Text>
              </View>
              
              {selectedSection.route && (
                <TouchableOpacity 
                  style={styles.goToButton}
                  onPress={() => handleNavigate(selectedSection.route)}
                >
                  <Text style={styles.goToButtonText}>Go to {selectedSection.title}</Text>
                  <ChevronRight size={20} color={colors.white} />
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>App Features Guide</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.subtitle}>
            Learn how to use key features or ask the AI assistant for help anytime.
          </Text>
          
          <ScrollView style={styles.sectionsContainer}>
            {sections.map((section, index) => (
              <TouchableOpacity
                key={index}
                style={styles.sectionButton}
                onPress={() => handleSectionPress(section)}
              >
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <ChevronRight size={20} color={colors.primary} />
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {renderSectionDetail()}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  sectionsContainer: {
    marginBottom: 20,
  },
  sectionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '500',
  },
  closeButton: {
    backgroundColor: colors.card,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  detailModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  detailModalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  detailScrollView: {
    maxHeight: '90%',
  },
  detailDescription: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 20,
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  tipText: {
    color: colors.text,
    fontSize: 15,
    marginLeft: 12,
    flex: 1,
  },
  goToButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  goToButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
}); 