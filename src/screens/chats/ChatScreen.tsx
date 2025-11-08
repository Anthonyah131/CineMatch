import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../config/colors';
import { useAuth } from '../../context/AuthContext';
import { useChatMessages } from '../../hooks/chats/useChatMessages';
import { useChats } from '../../hooks/chats/useChats';
import { usersService } from '../../services/usersService';
import { MessageBubble } from '../../components/screens/chat/MessageBubble';
import { ReactionPicker } from '../../components/screens/chat/ReactionPicker';
import { ReactionDetail } from '../../components/screens/chat/ReactionDetail';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import type { MessageWithSender } from '../../types/chat.types';

type ChatScreenProps = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export const ChatScreen: React.FC<ChatScreenProps> = ({ route, navigation }) => {
  const { chatId } = route.params;
  const { user } = useAuth();
  const { chats } = useChats();
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    addReaction,
    removeReaction,
  } = useChatMessages(chatId);

  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showReactionDetail, setShowReactionDetail] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<MessageWithSender | null>(null);
  const [otherUserName, setOtherUserName] = useState<string>('Chat');
  const [otherUserPhoto, setOtherUserPhoto] = useState<string | undefined>();
  const flatListRef = useRef<FlatList>(null);

  // Cargar información del otro usuario
  useEffect(() => {
    const loadOtherUserInfo = async () => {
      if (!user) return;

      // Buscar el chat actual
      const currentChat = chats.find(c => c.chatId === chatId);
      if (!currentChat) return;

      // Obtener el ID del otro usuario
      const otherUserId = currentChat.members.find(memberId => memberId !== user.id);
      if (!otherUserId) return;

      try {
        const profile = await usersService.getUserProfile(otherUserId);
        setOtherUserName(profile.user.displayName);
        setOtherUserPhoto(profile.user.photoURL);
      } catch (err) {
        console.error('Error loading other user profile:', err);
      }
    };

    loadOtherUserInfo();
  }, [chatId, chats, user]);

  // Auto-scroll al fondo cuando llegan mensajes nuevos
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleSend = async () => {
    if (!messageText.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(messageText.trim());
      setMessageText('');
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleMessageLongPress = (message: MessageWithSender) => {
    setSelectedMessage(message);
    setShowReactionPicker(true);
  };

  const handleReactionPress = (message: MessageWithSender) => {
    setSelectedMessage(message);
    setShowReactionDetail(true);
  };

  const handleSelectEmoji = async (emoji: string) => {
    if (!selectedMessage) return;

    try {
      await addReaction(selectedMessage.id, emoji);
    } catch (err) {
      console.error('Error adding reaction:', err);
    }
  };

  const handleRemoveReaction = async () => {
    if (!selectedMessage) return;

    try {
      await removeReaction(selectedMessage.id);
    } catch (err) {
      console.error('Error removing reaction:', err);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Loading State
  if (isLoading && messages.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#C7A24C" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            {otherUserPhoto && (
              <Image source={{ uri: otherUserPhoto }} style={styles.headerUserPhoto} />
            )}
            <Text style={styles.headerTitle}>{otherUserName}</Text>
          </View>
          <View style={styles.backButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C7A24C" />
          <Text style={styles.loadingText}>Cargando mensajes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error State
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#C7A24C" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            {otherUserPhoto && (
              <Image source={{ uri: otherUserPhoto }} style={styles.headerUserPhoto} />
            )}
            <Text style={styles.headerTitle}>{otherUserName}</Text>
          </View>
          <View style={styles.backButton} />
        </View>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={64} color="#FF453A" />
          <Text style={styles.errorText}>Error al cargar mensajes</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
          <TouchableOpacity style={styles.backButtonFull} onPress={handleBack}>
            <Icon name="arrow-back-outline" size={20} color="#C7A24C" />
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#C7A24C" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            {otherUserPhoto && (
              <Image source={{ uri: otherUserPhoto }} style={styles.headerUserPhoto} />
            )}
            <Text style={styles.headerTitle}>{otherUserName}</Text>
          </View>
          <View style={styles.backButton} />
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              isOwn={item.senderId === user?.id}
              onLongPress={() => handleMessageLongPress(item)}
              onReactionPress={
                item.reactions && Object.keys(item.reactions).length > 0
                  ? () => handleReactionPress(item)
                  : undefined
              }
            />
          )}
          inverted
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />

        {/* Input Container */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#8E8E93"
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!messageText.trim() || isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : (
              <Icon name="send" size={20} color="#000000" />
            )}
          </TouchableOpacity>
        </View>

        {/* Reaction Picker Modal */}
        <ReactionPicker
          visible={showReactionPicker}
          onClose={() => {
            setShowReactionPicker(false);
            setSelectedMessage(null);
          }}
          onSelectEmoji={handleSelectEmoji}
        />

        {/* Reaction Detail Modal */}
        <ReactionDetail
          visible={showReactionDetail}
          message={selectedMessage}
          currentUserId={user?.id || ''}
          onClose={() => {
            setShowReactionDetail(false);
            setSelectedMessage(null);
          }}
          onRemoveReaction={handleRemoveReaction}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerUserPhoto: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  backButtonFull: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.transparent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: 24,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 8,
  },
  messagesList: {
    paddingVertical: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 10,
    fontSize: 16,
    color: COLORS.text,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
