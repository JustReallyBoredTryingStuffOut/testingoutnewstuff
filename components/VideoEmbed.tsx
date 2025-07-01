import React from "react";
import { View, StyleSheet, Text, Linking, TouchableOpacity, Platform, Image } from "react-native";
import { ExternalLink, Play } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { WebView } from "react-native-webview";

type VideoEmbedProps = {
  url: string;
  height?: number;
};

export default function VideoEmbed({ url, height = 200 }: VideoEmbedProps) {
  // Function to extract YouTube video ID
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  // Function to extract TikTok video ID
  const getTikTokVideoId = (url: string) => {
    // Support multiple TikTok URL formats
    const regExps = [
      /tiktok\.com\/@[^\/]+\/video\/(\d+)/,  // Standard format
      /tiktok\.com\/t\/([^\/]+)/,            // Shortened t format
      /vm\.tiktok\.com\/([^\/]+)/            // vm format
    ];
    
    for (const regExp of regExps) {
      const match = url.match(regExp);
      if (match && match[1]) return match[1];
    }
    
    return null;
  };
  
  // Determine video type and ID
  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
  const isTikTok = url.includes("tiktok.com");
  
  const youtubeId = isYouTube ? getYouTubeVideoId(url) : null;
  const tiktokId = isTikTok ? getTikTokVideoId(url) : null;
  
  // Generate embed URL
  let embedUrl = "";
  if (youtubeId) {
    embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
  } else if (tiktokId && Platform.OS !== "ios") {
    // Only use TikTok embed for non-iOS platforms
    embedUrl = `https://www.tiktok.com/embed/v2/${tiktokId}`;
  }
  
  const handleOpenLink = () => {
    Linking.openURL(url);
  };
  
  // For web platform, we'll use a different approach
  if (Platform.OS === "web") {
    return (
      <View style={styles.videoContainer}>
        <View style={[styles.container, { height }]}>
          <iframe
            src={embedUrl}
            style={{ width: "100%", height: "100%", border: "none" }}
            allowFullScreen
          />
        </View>
        <Text style={styles.attributionText}>
          {isYouTube ? "Video content provided by YouTube. All rights belong to their respective owners." : 
           isTikTok ? "Video content provided by TikTok. All rights belong to their respective owners." :
           "Video content provided by third party. All rights belong to their respective owners."}
        </Text>
      </View>
    );
  }
  
  // For iOS with TikTok, we'll provide a better fallback option
  if (Platform.OS === "ios" && isTikTok) {
    return (
      <View style={styles.videoContainer}>
        <View style={[styles.container, { height }]}>
          <View style={styles.tiktokFallbackContainer}>
            <Image 
              source={{ uri: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=1000&auto=format&fit=crop" }}
              style={styles.tiktokThumbnail}
              resizeMode="cover"
            />
            <View style={styles.tiktokOverlay}>
              <Text style={styles.tiktokText}>TikTok videos cannot be embedded on iOS</Text>
              <TouchableOpacity 
                style={styles.tiktokButton}
                onPress={handleOpenLink}
              >
                <Play size={16} color="#FFFFFF" />
                <Text style={styles.tiktokButtonText}>Open in TikTok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Text style={styles.attributionText}>
          TikTok content. All rights belong to their respective owners.
        </Text>
      </View>
    );
  }
  
  // For mobile platforms
  if (!embedUrl) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.errorText}>Invalid video URL</Text>
        <TouchableOpacity 
          style={styles.fallbackButton}
          onPress={handleOpenLink}
        >
          <ExternalLink size={16} color="#FFFFFF" />
          <Text style={styles.fallbackButtonText}>Open Original Link</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.videoContainer}>
      <View style={[styles.container, { height }]}>
        <WebView
          source={{ uri: embedUrl }}
          style={styles.webview}
          allowsFullscreenVideo
          javaScriptEnabled
          domStorageEnabled
          onError={() => console.log("WebView error loading video")}
          renderError={() => (
            <View style={styles.fallbackContainer}>
              <Text style={styles.errorText}>Error loading video</Text>
              <TouchableOpacity 
                style={styles.fallbackButton}
                onPress={handleOpenLink}
              >
                <ExternalLink size={16} color="#FFFFFF" />
                <Text style={styles.fallbackButtonText}>Open Original Link</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <TouchableOpacity 
          style={styles.openButton}
          onPress={handleOpenLink}
        >
          <ExternalLink size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <Text style={styles.attributionText}>
        {isYouTube ? "Video content provided by YouTube. All rights belong to their respective owners." : 
         isTikTok ? "Video content provided by TikTok. All rights belong to their respective owners." :
         "Video content provided by third party. All rights belong to their respective owners."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    width: "100%",
    marginBottom: 12,
  },
  container: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    backgroundColor: colors.background,
  },
  webview: {
    flex: 1,
  },
  errorText: {
    color: colors.error,
    textAlign: "center",
    marginTop: 20,
  },
  openButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  attributionText: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
    fontStyle: "italic",
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  fallbackText: {
    color: colors.textSecondary,
    marginBottom: 16,
    textAlign: "center",
  },
  fallbackButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 12,
  },
  fallbackButtonText: {
    color: "#FFFFFF",
    marginLeft: 8,
    fontWeight: "500",
  },
  // TikTok specific styles for iOS
  tiktokFallbackContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  tiktokThumbnail: {
    width: "100%",
    height: "100%",
  },
  tiktokOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  tiktokText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 16,
  },
  tiktokButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EE1D52", // TikTok red
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  tiktokButtonText: {
    color: "#FFFFFF",
    marginLeft: 8,
    fontWeight: "500",
  },
});