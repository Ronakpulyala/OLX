import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Avatar } from '../../components/Avatar';
import { EmptyState } from '../../components/EmptyState';
import { COLORS, MOCK_CHATS } from '../../lib/constants';
import { formatTimeAgo } from '../../lib/utils';

export default function ChatScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inbox</Text>
      </View>

      <FlatList
        data={MOCK_CHATS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.chatItem}
            onPress={() => router.push(`/chat/${item.id}`)}
          >
            <Avatar url={item.otherUser.avatar} size={50} />
            <View style={styles.chatInfo}>
              <View style={styles.chatHeader}>
                <Text style={styles.userName}>{item.otherUser.name}</Text>
                <Text style={styles.time}>{formatTimeAgo(item.lastMessageTime)}</Text>
              </View>
              <Text style={styles.listingTitle} numberOfLines={1}>{item.listing.title}</Text>
              <View style={styles.lastMessageContainer}>
                <Text style={[styles.lastMessage, item.unreadCount > 0 && styles.lastMessageUnread]} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
                {item.unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.unreadCount}</Text>
                  </View>
                )}
              </View>
            </View>
            <Image source={{ uri: item.listing.image }} style={styles.listingThumb} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <EmptyState 
            icon="chatbubbles-outline"
            title="No messages yet"
            subtitle="When you contact a seller or someone contacts you, messages will appear here."
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  time: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  listingTitle: {
    fontSize: 12,
    color: COLORS.primary,
    marginBottom: 4,
  },
  lastMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 14,
    color: COLORS.textLight,
    flex: 1,
  },
  lastMessageUnread: {
    color: COLORS.text,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginLeft: 8,
  },
  badgeText: {
    color: COLORS.surface,
    fontSize: 10,
    fontWeight: 'bold',
  },
  listingThumb: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  }
});
