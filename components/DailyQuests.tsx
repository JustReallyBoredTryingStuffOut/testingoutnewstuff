import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useGamificationStore, DailyQuest } from '@/store/gamificationStore';
import { Check, Clock, Award, Zap, ChevronRight } from 'lucide-react-native';

interface DailyQuestsProps {
  compact?: boolean;
  limit?: number;
  onPress?: () => void;
  navigable?: boolean;
}

const DailyQuests: React.FC<DailyQuestsProps> = ({ 
  compact = false,
  limit,
  onPress,
  navigable = true
}) => {
  const { colors } = useTheme();
  const { dailyQuests, completeDailyQuest } = useGamificationStore();
  
  // Filter active quests
  const activeQuests = dailyQuests.filter(
    quest => !quest.completed && 
    new Date(quest.date).toDateString() === new Date().toDateString()
  );
  
  // Limit the number of quests to display
  const displayQuests = limit ? activeQuests.slice(0, limit) : activeQuests;
  
  const handleCompleteQuest = (questId: string, e: any) => {
    e.stopPropagation(); // Prevent triggering the parent onPress
    completeDailyQuest(questId);
  };
  
  // Get icon for quest category
  const getQuestIcon = (category: string) => {
    switch (category) {
      case 'workout':
        return <Zap size={16} color={colors.primary} />;
      case 'nutrition':
        return <Award size={16} color="#FF9500" />;
      case 'steps':
        return <Clock size={16} color="#4CD964" />;
      default:
        return <Award size={16} color={colors.primary} />;
    }
  };
  
  const renderCompactContent = () => (
    <>
      <View style={styles.compactHeader}>
        <Text style={[styles.compactTitle, { color: colors.text }]}>
          Daily Quests
        </Text>
        <Text style={[styles.compactCount, { color: colors.primary }]}>
          {activeQuests.length} remaining
        </Text>
      </View>
      
      {displayQuests.length > 0 ? (
        <View style={styles.compactQuestList}>
          {displayQuests.map((quest) => (
            <View key={quest.id} style={styles.compactQuest}>
              {getQuestIcon(quest.category)}
              <Text 
                style={[styles.compactQuestText, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {quest.title}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={[styles.noQuestsText, { color: colors.textSecondary }]}>
          All quests completed! Check back tomorrow.
        </Text>
      )}
      
      {navigable && (
        <View style={styles.viewAllContainer}>
          <Text style={[styles.viewAllText, { color: colors.primary }]}>View all</Text>
          <ChevronRight size={16} color={colors.primary} />
        </View>
      )}
    </>
  );
  
  if (compact) {
    if (onPress && navigable) {
      return (
        <TouchableOpacity 
          style={[styles.compactContainer, { backgroundColor: colors.card }]}
          onPress={onPress}
          activeOpacity={0.7}
        >
          {renderCompactContent()}
        </TouchableOpacity>
      );
    }
    
    return (
      <View style={[styles.compactContainer, { backgroundColor: colors.card }]}>
        {renderCompactContent()}
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Daily Quests</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Complete quests to earn XP
        </Text>
      </View>
      
      {displayQuests.length > 0 ? (
        <View style={styles.questList}>
          {displayQuests.map((quest) => (
            <QuestItem 
              key={quest.id} 
              quest={quest} 
              onComplete={(e) => handleCompleteQuest(quest.id, e)}
            />
          ))}
        </View>
      ) : (
        <View style={styles.noQuests}>
          <Text style={[styles.noQuestsText, { color: colors.textSecondary }]}>
            All quests completed! Check back tomorrow.
          </Text>
        </View>
      )}
    </View>
  );
};

interface QuestItemProps {
  quest: DailyQuest;
  onComplete: (e: any) => void;
}

const QuestItem: React.FC<QuestItemProps> = ({ quest, onComplete }) => {
  const { colors } = useTheme();
  
  // Get icon for quest category
  const getQuestIcon = (category: string) => {
    switch (category) {
      case 'workout':
        return <Zap size={20} color={colors.primary} />;
      case 'nutrition':
        return <Award size={20} color="#FF9500" />;
      case 'steps':
        return <Clock size={20} color="#4CD964" />;
      default:
        return <Award size={20} color={colors.primary} />;
    }
  };
  
  return (
    <View style={[styles.questItem, { borderBottomColor: colors.border }]}>
      <View style={styles.questInfo}>
        <View style={[styles.questIcon, { backgroundColor: `${colors.primary}20` }]}>
          {getQuestIcon(quest.category)}
        </View>
        <View style={styles.questContent}>
          <Text style={[styles.questTitle, { color: colors.text }]}>{quest.title}</Text>
          <Text style={[styles.questDescription, { color: colors.textSecondary }]}>
            {quest.description}
          </Text>
        </View>
      </View>
      
      <View style={styles.questActions}>
        <Text style={[styles.questPoints, { color: colors.primary }]}>
          +{quest.points} XP
        </Text>
        <TouchableOpacity 
          style={[
            styles.completeButton, 
            { backgroundColor: colors.primary }
          ]}
          onPress={onComplete}
        >
          <Check size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  compactContainer: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  compactCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  compactQuestList: {
    gap: 8,
  },
  compactQuest: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compactQuestText: {
    fontSize: 12,
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  questList: {
    gap: 12,
  },
  questItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  questInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  questIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  questContent: {
    flex: 1,
    justifyContent: 'center',
  },
  questTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  questDescription: {
    fontSize: 14,
  },
  questActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questPoints: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 12,
  },
  completeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noQuests: {
    padding: 16,
    alignItems: 'center',
  },
  noQuestsText: {
    fontSize: 14,
    textAlign: 'center',
  },
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '500',
    marginRight: 4,
  }
});

export default DailyQuests;