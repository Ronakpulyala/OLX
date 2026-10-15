import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../lib/constants';

interface MessageBubbleProps {
  message: {
    id: string;
    text: string;
    isSentByMe: boolean;
    time: string;
  };
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <View style={[styles.container, message.isSentByMe ? styles.sentContainer : styles.receivedContainer]}>
      <View style={[styles.bubble, message.isSentByMe ? styles.sentBubble : styles.receivedBubble]}>
        <Text style={[styles.text, message.isSentByMe ? styles.sentText : styles.receivedText]}>
          {message.text}
        </Text>
        <Text style={[styles.time, message.isSentByMe ? styles.sentTime : styles.receivedTime]}>
          {message.time}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
    flexDirection: 'row',
  },
  sentContainer: {
    justifyContent: 'flex-end',
  },
  receivedContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  sentBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: COLORS.border,
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 15,
  },
  sentText: {
    color: COLORS.surface,
  },
  receivedText: {
    color: COLORS.text,
  },
  time: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  sentTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  receivedTime: {
    color: COLORS.textLight,
  }
});
