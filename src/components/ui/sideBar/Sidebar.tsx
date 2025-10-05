import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import SidebarButton from '../buttons/SidebarButton';

export default function Sidebar({ navigation, onClose }: any) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
          style={styles.avatar}
        />
        <Text style={styles.username}>Kyran</Text>
        <Text style={styles.handle}>@kyran_d</Text>

        <View style={styles.followRow}>
          <Text style={styles.followText}>500 Followers</Text>
          <Text style={styles.followText}>420 Following</Text>
        </View>
      </View>

      {/* Options */}
      <ScrollView>
        <SidebarButton
          title="Home"
          icon="home-outline"
          onPress={() => {
            if (onClose) onClose();
            navigation.navigate('Home');
          }}
          active
        />
        <SidebarButton
          title="Films"
          icon="film-outline"
          onPress={() => {
            if (onClose) onClose();
            // navigation.navigate('Films');
          }}
        />
        <SidebarButton
          title="Diary"
          icon="book-outline"
          onPress={() => {
            if (onClose) onClose();
            // navigation.navigate('Diary');
          }}
        />
        <SidebarButton
          title="Reviews"
          icon="chatbubble-outline"
          onPress={() => {
            if (onClose) onClose();
            // navigation.navigate('Reviews');
          }}
        />
        <SidebarButton
          title="Watchlist"
          icon="bookmark-outline"
          onPress={() => {
            if (onClose) onClose();
            // navigation.navigate('Watchlist');
          }}
        />
        <SidebarButton
          title="Lists"
          icon="list-outline"
          onPress={() => {
            if (onClose) onClose();
            // navigation.navigate('Lists');
          }}
        />
        <SidebarButton
          title="Likes"
          icon="heart-outline"
          onPress={() => {
            if (onClose) onClose();
            // navigation.navigate('Likes');
          }}
        />
      </ScrollView>

      {/* Logout */}
      <SidebarButton
        title="Logout"
        icon="log-out-outline"
        onPress={() => {
          if (onClose) onClose();
          navigation.navigate('Auth');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1730',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  handle: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 12,
  },
  followRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  followText: {
    color: '#fff',
    fontSize: 14,
  },
});
