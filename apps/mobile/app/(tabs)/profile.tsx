import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../../components/Avatar';
import { COLORS } from '../../lib/constants';
import { useAuthStore } from '../../store/auth';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.unauthContent}>
          <Ionicons name="person-circle-outline" size={100} color={COLORS.border} />
          <Text style={styles.unauthTitle}>Join Sell Marketplace</Text>
          <Text style={styles.unauthSub}>Buy and sell items with confidence.</Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.loginButtonText}>Log In or Sign Up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Avatar url={user?.avatar} size={80} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name}</Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>View and edit profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statItem}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.statValue}>{user?.rating} </Text>
              <Ionicons name="star" size={16} color={COLORS.secondary} />
            </View>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <MenuItem icon="list" title="My Ads" subtitle="Manage your listings" />
          <MenuItem icon="heart" title="Favorites" subtitle="View saved items" />
          <MenuItem icon="settings" title="Settings" subtitle="Privacy and account" />
          <MenuItem icon="help-circle" title="Help & Support" subtitle="Get assistance" />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({ icon, title, subtitle }: { icon: any, title: string, subtitle?: string }) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <Ionicons name={icon} size={24} color={COLORS.text} style={styles.menuIcon} />
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.border} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  unauthContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  unauthTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  unauthSub: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    padding: 24,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  editButton: {
    marginTop: 4,
  },
  editButtonText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  menuSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: 'bold',
  }
});
