import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MessageBubble } from '../../components/MessageBubble';
import { COLORS, MOCK_CHATS } from '../../lib/constants';

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  
  const chatInfo = MOCK_CHATS.find(c => c.id === id) || MOCK_CHATS[0];

  const [messages, setMessages] = useState([
    { id: '1', text: 'Hi, is this still available?', isSentByMe: true, time: '10:00 AM' },
    { id: '2', text: 'Yes, it is.', isSentByMe: false, time: '10:05 AM' },
    { id: '3', text: chatInfo.lastMessage, isSentByMe: true, time: '10:10 AM' },
  ]);

  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      isSentByMe: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setInputText('');
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{chatInfo.otherUser.name}</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.listingPreview}
        onPress={() => router.push(`/listing/${chatInfo.listing.id}`)}
      >
        <Image source={{ uri: chatInfo.listing.image }} style={styles.previewImg} />
        <View style={styles.previewInfo}>
          <Text style={styles.previewTitle} numberOfLines={1}>{chatInfo.listing.title}</Text>
          <Text style={styles.previewAction}>View Ad</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
      </TouchableOpacity>

      <KeyboardAvoidingView 
        style={styles.flex1} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="add" size={24} color={COLORS.textLight} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]} 
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={20} color={COLORS.surface} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex1: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  listingPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  previewImg: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  previewInfo: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  previewAction: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  messageList: {
    paddingVertical: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  attachBtn: {
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    maxHeight: 100,
    minHeight: 40,
    marginHorizontal: 8,
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: COLORS.border,
  }
});
