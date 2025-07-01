import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Modal,
  Pressable
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useGamificationStore, Reward } from '@/store/gamificationStore';
import { Stack, useRouter } from 'expo-router';
import Button from '@/components/Button';
import { Award, X, Check, Lock, Gift, ArrowLeft } from 'lucide-react-native';

export default function RewardsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { 
    rewards, 
    points,
    unlockReward,
    useReward,
    getAvailableRewards
  } = useGamificationStore();
  
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Filter rewards
  const availableRewards = rewards.filter(r => !r.unlocked && points >= r.cost);
  const unlockedRewards = rewards.filter(r => r.unlocked && !r.used);
  const usedRewards = rewards.filter(r => r.used);
  const lockedRewards = rewards.filter(r => !r.unlocked && points < r.cost);
  
  // Handle reward press
  const handleRewardPress = (reward: Reward) => {
    setSelectedReward(reward);
    setShowModal(true);
  };
  
  // Handle unlock reward
  const handleUnlockReward = (rewardId: string) => {
    unlockReward(rewardId);
    setShowModal(false);
  };
  
  // Handle use reward
  const handleUseReward = (rewardId: string) => {
    useReward(rewardId);
    setShowModal(false);
  };
  
  const handleGoBack = () => {
    router.back();
  };
  
  // Render reward card
  const renderRewardCard = (reward: Reward, status: 'available' | 'unlocked' | 'used' | 'locked') => {
    return (
      <TouchableOpacity
        key={reward.id}
        style={[
          styles.rewardCard, 
          { 
            backgroundColor: colors.card,
            opacity: status === 'used' ? 0.7 : 1
          }
        ]}
        onPress={() => handleRewardPress(reward)}
      >
        <View style={styles.rewardHeader}>
          <Text style={styles.rewardEmoji}>{reward.icon}</Text>
          <View style={styles.rewardInfo}>
            <Text style={[styles.rewardTitle, { color: colors.text }]}>
              {reward.title}
            </Text>
            <Text style={[styles.rewardDescription, { color: colors.textSecondary }]}>
              {reward.description}
            </Text>
          </View>
        </View>
        
        <View style={styles.rewardFooter}>
          {status === 'available' && (
            <View style={[styles.costBadge, { backgroundColor: `${colors.primary}20` }]}>
              <Text style={[styles.costText, { color: colors.primary }]}>
                {reward.cost} XP
              </Text>
            </View>
          )}
          
          {status === 'unlocked' && (
            <View style={[styles.statusBadge, { backgroundColor: `${colors.secondary}20` }]}>
              <Text style={[styles.statusText, { color: colors.secondary }]}>
                Ready to Use
              </Text>
            </View>
          )}
          
          {status === 'used' && (
            <View style={[styles.statusBadge, { backgroundColor: `${colors.textSecondary}20` }]}>
              <Text style={[styles.statusText, { color: colors.textSecondary }]}>
                Used on {new Date(reward.dateUsed || '').toLocaleDateString()}
              </Text>
            </View>
          )}
          
          {status === 'locked' && (
            <View style={[styles.statusBadge, { backgroundColor: `${colors.error}20` }]}>
              <Text style={[styles.statusText, { color: colors.error }]}>
                Need {reward.cost - points} more XP
              </Text>
            </View>
          )}
        </View>
        
        {status === 'locked' && (
          <View style={styles.lockedOverlay}>
            <Lock size={24} color={colors.textSecondary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: "Rewards",
          headerTitleStyle: { color: colors.text },
          headerStyle: { backgroundColor: colors.background },
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.pointsCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.pointsLabel, { color: colors.textSecondary }]}>
            Your XP Balance
          </Text>
          <Text style={[styles.pointsValue, { color: colors.text }]}>
            {points} XP
          </Text>
        </View>
        
        {availableRewards.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Available Rewards
            </Text>
            
            {availableRewards.map((reward) => renderRewardCard(reward, 'available'))}
          </View>
        )}
        
        {unlockedRewards.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Your Rewards
            </Text>
            
            {unlockedRewards.map((reward) => renderRewardCard(reward, 'unlocked'))}
          </View>
        )}
        
        {lockedRewards.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Locked Rewards
            </Text>
            
            {lockedRewards.map((reward) => renderRewardCard(reward, 'locked'))}
          </View>
        )}
        
        {usedRewards.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Used Rewards
            </Text>
            
            {usedRewards.map((reward) => renderRewardCard(reward, 'used'))}
          </View>
        )}
        
        <Button
          title="Back"
          onPress={handleGoBack}
          variant="outline"
          style={styles.backButton2}
        />
      </ScrollView>
      
      {/* Reward Detail Modal */}
      {selectedReward && (
        <Modal
          visible={showModal}
          transparent
          animationType="fade"
          statusBarTranslucent
        >
          <Pressable 
            style={styles.modalOverlay}
            onPress={() => setShowModal(false)}
          >
            <Pressable style={[styles.modalContainer, { backgroundColor: colors.card }]} onPress={e => e.stopPropagation()}>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setShowModal(false)}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
              
              <Text style={styles.rewardEmoji}>{selectedReward.icon}</Text>
              
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {selectedReward.title}
              </Text>
              
              <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                {selectedReward.description}
              </Text>
              
              {!selectedReward.unlocked && (
                <View style={[styles.costContainer, { backgroundColor: `${colors.primary}10` }]}>
                  <Text style={[styles.costLabel, { color: colors.textSecondary }]}>
                    Cost:
                  </Text>
                  <Text style={[styles.modalCost, { color: colors.primary }]}>
                    {selectedReward.cost} XP
                  </Text>
                </View>
              )}
              
              {selectedReward.unlocked && !selectedReward.used && (
                <View style={[styles.unlockedBanner, { backgroundColor: `${colors.secondary}20` }]}>
                  <Check size={20} color={colors.secondary} />
                  <Text style={[styles.unlockedText, { color: colors.secondary }]}>
                    Unlocked on {new Date(selectedReward.dateUnlocked || '').toLocaleDateString()}
                  </Text>
                </View>
              )}
              
              {selectedReward.used && (
                <View style={[styles.usedBanner, { backgroundColor: `${colors.textSecondary}20` }]}>
                  <Check size={20} color={colors.textSecondary} />
                  <Text style={[styles.usedText, { color: colors.textSecondary }]}>
                    Used on {new Date(selectedReward.dateUsed || '').toLocaleDateString()}
                  </Text>
                </View>
              )}
              
              {!selectedReward.unlocked && points >= selectedReward.cost && (
                <Button
                  title="Unlock Reward"
                  onPress={() => handleUnlockReward(selectedReward.id)}
                  style={styles.actionButton}
                  icon={<Gift size={18} color="white" />}
                />
              )}
              
              {!selectedReward.unlocked && points < selectedReward.cost && (
                <View style={[styles.insufficientBanner, { backgroundColor: `${colors.error}20` }]}>
                  <Lock size={20} color={colors.error} />
                  <Text style={[styles.insufficientText, { color: colors.error }]}>
                    Need {selectedReward.cost - points} more XP to unlock
                  </Text>
                </View>
              )}
              
              {selectedReward.unlocked && !selectedReward.used && (
                <Button
                  title="Use Reward"
                  onPress={() => handleUseReward(selectedReward.id)}
                  style={styles.actionButton}
                  icon={<Gift size={18} color="white" />}
                />
              )}
              
              <Button
                title="Close"
                onPress={() => setShowModal(false)}
                variant="outline"
                style={styles.closeModalButton}
              />
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  pointsCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  rewardCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  rewardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  rewardEmoji: {
    fontSize: 36,
    marginRight: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 14,
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  costBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  costText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 24,
  },
  costLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  modalCost: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  unlockedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 24,
  },
  unlockedText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  usedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 24,
  },
  usedText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  insufficientBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 24,
  },
  insufficientText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  actionButton: {
    marginBottom: 16,
    minWidth: 200,
  },
  closeModalButton: {
    minWidth: 120,
  },
  backButton2: {
    marginBottom: 24,
  }
});