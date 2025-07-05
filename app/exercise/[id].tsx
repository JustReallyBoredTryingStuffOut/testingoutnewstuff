import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform } from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { Play, ArrowLeft, Info } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useWorkoutStore } from "@/store/workoutStore";
import * as WebBrowser from "expo-web-browser";
import Button from "@/components/Button";
import VideoEmbed from "@/components/VideoEmbed";
import ExerciseAnimation from "@/components/ExerciseAnimation";

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { exercises } = useWorkoutStore();
  const [showVideo, setShowVideo] = useState(false);
  const [showCopyrightInfo, setShowCopyrightInfo] = useState(false);
  
  const exercise = exercises.find(e => e.id === id);
  
  if (!exercise) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Exercise not found</Text>
      </View>
    );
  }
  
  const handlePlayVideo = async () => {
    if (exercise.videoUrl) {
      if (Platform.OS === "web") {
        setShowVideo(true);
      } else {
        await WebBrowser.openBrowserAsync(exercise.videoUrl);
      }
    }
  };
  
  const handleGoBack = () => {
    router.back();
  };
  
  const toggleCopyrightInfo = () => {
    setShowCopyrightInfo(!showCopyrightInfo);
  };
  
  // Check if this is the face pull exercise
  const isFacePull = exercise.id === "ex215";
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen 
        options={{
          title: exercise.name,
          headerBackTitle: "Exercises",
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      {exercise.imageUrl && (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: exercise.imageUrl }} 
            style={styles.image}
            resizeMode="cover"
          />
          
          {exercise.videoUrl && (
            <TouchableOpacity 
              style={styles.playButton}
              onPress={handlePlayVideo}
            >
              <Play size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      )}
      
      <View style={styles.header}>
        <Text style={styles.title}>{exercise.name}</Text>
        <View style={styles.tags}>
          {exercise.muscleGroups.map((muscle, index) => (
            <View key={typeof muscle === 'string' ? muscle : muscle.name} style={styles.tag}>
              <Text style={styles.tagText}>{typeof muscle === 'string' ? muscle : muscle.name}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{exercise.description}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        {exercise.instructions.map((instruction, index) => (
          <View key={index} style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.instructionText}>{instruction}</Text>
          </View>
        ))}
      </View>
      
      {showVideo && Platform.OS === "web" && exercise.videoUrl && (
        <View style={styles.videoContainer}>
          <View style={styles.videoHeaderContainer}>
            <Text style={styles.sectionTitle}>Tutorial Video</Text>
            <TouchableOpacity 
              onPress={toggleCopyrightInfo}
              style={styles.infoButton}
            >
              <Info size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          {showCopyrightInfo && (
            <View style={styles.copyrightInfoContainer}>
              <Text style={styles.copyrightInfoText}>
                The video content displayed here is the property of its respective creators and is provided through YouTube/TikTok's embedding services. We do not claim ownership of any third-party video content. For more information, please see our Privacy Policy.
              </Text>
            </View>
          )}
          
          <VideoEmbed url={exercise.videoUrl} height={240} />
        </View>
      )}
      
      {Platform.OS !== "web" && exercise.videoUrl && (
        <View style={styles.videoButtonContainer}>
          <TouchableOpacity 
            style={styles.watchVideoButton}
            onPress={handlePlayVideo}
          >
            <Play size={20} color={colors.primary} />
            <Text style={styles.watchVideoText}>Watch Tutorial Video</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={toggleCopyrightInfo}
            style={styles.infoButtonSmall}
          >
            <Info size={16} color={colors.textSecondary} />
          </TouchableOpacity>
          
          {showCopyrightInfo && (
            <View style={styles.copyrightInfoContainer}>
              <Text style={styles.copyrightInfoText}>
                The video content accessible through this link is the property of its respective creators and is hosted on YouTube/TikTok. We do not claim ownership of any third-party video content. For more information, please see our Privacy Policy.
              </Text>
            </View>
          )}
        </View>
      )}
      
      {/* Show animation for face pull exercise */}
      {isFacePull && (
        <ExerciseAnimation exerciseId={exercise.id} />
      )}
      
      <Button
        title="Back to Exercises"
        onPress={handleGoBack}
        variant="outline"
        style={styles.backToExercisesButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  backButton: {
    marginRight: 16,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 240,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -32,
    marginTop: -32,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  instructionItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  videoContainer: {
    marginBottom: 24,
  },
  videoHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  videoButtonContainer: {
    marginBottom: 24,
  },
  watchVideoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.highlight,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 8,
  },
  watchVideoText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: "center",
    marginTop: 24,
  },
  backToExercisesButton: {
    marginBottom: 16,
  },
  infoButton: {
    padding: 8,
  },
  infoButtonSmall: {
    alignSelf: "center",
    padding: 8,
  },
  copyrightInfoContainer: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  copyrightInfoText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    fontStyle: "italic",
  }
});