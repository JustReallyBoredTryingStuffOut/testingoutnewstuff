import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, Send, Plus, Trash2 } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useAiStore, AiChat, ChatMessage } from "@/store/aiStore";

export default function AiChatScreen() {
  const router = useRouter();
  const { chats, addChat: addChatToStore, deleteChat, addMessageToChat } = useAiStore();
  
  const [currentChat, setCurrentChat] = useState<AiChat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showChats, setShowChats] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  
  // Create a new chat if none exists
  useEffect(() => {
    if (chats.length === 0) {
      createNewChat();
    } else {
      // Set the most recent chat as current
      setCurrentChat(chats[chats.length - 1]);
    }
  }, [chats]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (currentChat?.messages.length && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [currentChat?.messages]);
  
  const createNewChat = () => {
    const newChat: AiChat = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      messages: [
        {
          id: "system-1",
          role: "system",
          content: "I'm your fitness assistant. I can help with workout advice, nutrition tips, and answer questions about your fitness journey. Respond in a conversational, human-like manner without using markdown formatting like asterisks for emphasis.",
          timestamp: new Date().toISOString()
        },
        {
          id: "assistant-1",
          role: "assistant",
          content: "Hi there! I'm your fitness assistant. How can I help you today?",
          timestamp: new Date().toISOString()
        }
      ]
    };
    
    addChatToStore(newChat);
    setCurrentChat(newChat);
    setShowChats(false);
  };
  
  const handleSendMessage = async () => {
    if (!message.trim() || !currentChat) return;
    
    const userMessage = {
      role: "user" as const,
      content: message.trim()
    };
    
    // Add user message to chat
    addMessageToChat(currentChat.id, userMessage);
    setMessage("");
    setIsLoading(true);
    
    try {
      // Prepare messages for API
      const apiMessages = currentChat.messages
        .filter(msg => msg.role !== "system") // Filter out system messages
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      
      // Add the new user message
      apiMessages.push(userMessage);
      
      // Add system message to instruct AI not to use markdown formatting
      const systemMessage = {
        role: "system" as const,
        content: "Respond in a conversational, human-like manner. Do not use markdown formatting like asterisks for emphasis or bold text."
      };
      
      // Make API request
      const response = await fetch("https://toolkit.rork.com/text/llm/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          messages: [systemMessage, ...apiMessages]
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }
      
      const data = await response.json();
      
      // Process the response to remove any remaining markdown formatting
      let cleanedResponse = data.completion;
      // Remove markdown bold/italic formatting (** or __ for bold, * or _ for italic)
      cleanedResponse = cleanedResponse.replace(/(\*\*|__)(.*?)\1/g, '$2');
      cleanedResponse = cleanedResponse.replace(/(\*|_)(.*?)\1/g, '$2');
      
      // Add AI response to chat
      addMessageToChat(currentChat.id, {
        role: "assistant",
        content: cleanedResponse
      });
      
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to get response. Please try again.");
      
      // Add error message to chat
      addMessageToChat(currentChat.id, {
        role: "assistant",
        content: "Sorry, I'm having trouble responding right now. Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteChat = (chatId: string) => {
    Alert.alert(
      "Delete Chat",
      "Are you sure you want to delete this conversation?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            deleteChat(chatId);
            if (currentChat?.id === chatId) {
              if (chats.length > 1) {
                // Find another chat to display
                const remainingChats = chats.filter(c => c.id !== chatId);
                setCurrentChat(remainingChats[remainingChats.length - 1]);
              } else {
                // Create a new chat if this was the last one
                createNewChat();
              }
            }
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const handleSelectChat = (chat: AiChat) => {
    setCurrentChat(chat);
    setShowChats(false);
  };
  
  const renderChatItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === "user";
    
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.assistantMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          isUser ? styles.userMessageBubble : styles.assistantMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.assistantMessageText
          ]}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };
  
  const renderChatListItem = ({ item }: { item: AiChat }) => {
    // Get first user message or first assistant message if no user message
    const firstUserMessage = item.messages.find(msg => msg.role === "user");
    const firstMessage = firstUserMessage || item.messages.find(msg => msg.role === "assistant");
    const preview = firstMessage ? firstMessage.content.substring(0, 30) + (firstMessage.content.length > 30 ? "..." : "") : "New conversation";
    
    // Format date
    const date = new Date(item.date);
    const formattedDate = date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const isSelected = currentChat?.id === item.id;
    
    return (
      <TouchableOpacity 
        style={[
          styles.chatListItem,
          isSelected && styles.selectedChatListItem
        ]}
        onPress={() => handleSelectChat(item)}
      >
        <View style={styles.chatListItemContent}>
          <Text style={styles.chatListItemPreview} numberOfLines={1}>
            {preview}
          </Text>
          <Text style={styles.chatListItemDate}>{formattedDate}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.deleteChatButton}
          onPress={() => handleDeleteChat(item.id)}
        >
          <Trash2 size={16} color={colors.error} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: "AI Assistant",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => setShowChats(!showChats)}
              style={styles.chatListButton}
            >
              <Text style={styles.chatListButtonText}>
                {showChats ? "Hide Chats" : "Show Chats"}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.content}>
        {showChats ? (
          <View style={styles.chatListContainer}>
            <View style={styles.chatListHeader}>
              <Text style={styles.chatListTitle}>Your Conversations</Text>
              <TouchableOpacity 
                style={styles.newChatButton}
                onPress={createNewChat}
              >
                <Plus size={20} color={colors.primary} />
                <Text style={styles.newChatButtonText}>New Chat</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={chats.slice().reverse()} // Reverse to show newest first
              renderItem={renderChatListItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.chatList}
            />
          </View>
        ) : (
          currentChat && (
            <FlatList
              ref={flatListRef}
              data={currentChat.messages.filter(msg => msg.role !== "system")}
              renderItem={renderChatItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messageList}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />
          )
        )}
      </View>
      
      {!showChats && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
          style={styles.inputContainer}
        >
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Ask me anything about fitness..."
              placeholderTextColor={colors.textSecondary}
              multiline
              maxHeight={100}
              maxLength={500}
            />
            
            <TouchableOpacity 
              style={[
                styles.sendButton,
                (!message.trim() || isLoading) && styles.disabledSendButton
              ]}
              onPress={handleSendMessage}
              disabled={!message.trim() || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Send size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 8,
  },
  chatListButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
  },
  chatListButtonText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  messageList: {
    padding: 16,
    paddingBottom: 16,
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: "row",
  },
  userMessageContainer: {
    justifyContent: "flex-end",
  },
  assistantMessageContainer: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    maxWidth: "80%",
  },
  userMessageBubble: {
    backgroundColor: colors.primary,
  },
  assistantMessageBubble: {
    backgroundColor: colors.card,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: colors.white,
  },
  assistantMessageText: {
    color: colors.text,
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    minHeight: 40,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  disabledSendButton: {
    backgroundColor: colors.primaryLight,
    opacity: 0.7,
  },
  chatListContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  chatListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chatListTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  newChatButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  newChatButtonText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 4,
  },
  chatList: {
    padding: 16,
  },
  chatListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  selectedChatListItem: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  chatListItemContent: {
    flex: 1,
  },
  chatListItemPreview: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  chatListItemDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  deleteChatButton: {
    padding: 8,
  },
});