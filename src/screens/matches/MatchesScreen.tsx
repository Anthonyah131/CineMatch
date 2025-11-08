import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../config/colors';
import { useMatches } from '../../hooks/matches/useMatches';
import { MatchCard } from '../../components/matches/MatchCard';
import { chatsService } from '../../services/chatsService';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/stacks/HomeStack';

type MatchesScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  'Matches'
>;

export const MatchesScreen: React.FC<MatchesScreenProps> = ({ navigation }) => {
  const { matches, isLoading, error, refresh } = useMatches(10, 2.5, 20);

  const handleChatPress = async (userId: string) => {
    try {
      // Crear o obtener chat con el usuario
      const chat = await chatsService.createOrGetChat(userId);
      // Navegar a la pantalla de chat
      // @ts-ignore - ChatsList está en RootNavigator, no en HomeStack
      navigation.navigate('Chat', { chatId: chat.id });
    } catch (err) {
      console.error('Error creating/getting chat:', err);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleRefresh = async () => {
    await refresh();
  };

  // Loading State
  if (isLoading && matches.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#C7A24C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Matches</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C7A24C" />
          <Text style={styles.loadingText}>Buscando matches...</Text>
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
          <Text style={styles.headerTitle}>Matches</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={64} color="#FF453A" />
          <Text style={styles.errorText}>Error al cargar matches</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
          <View style={styles.errorButtons}>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRefresh}
            >
              <Icon name="refresh-outline" size={20} color="#FFF" />
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButtonError} onPress={handleBack}>
              <Icon name="arrow-back-outline" size={20} color="#C7A24C" />
              <Text style={styles.backButtonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Empty State
  if (matches.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#C7A24C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Matches</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.emptyContainer}>
          <Icon name="people-outline" size={64} color="#8E8E93" />
          <Text style={styles.emptyText}>No hay matches disponibles</Text>
          <Text style={styles.emptySubtext}>
            Mira más películas para encontrar personas con gustos similares
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Icon name="refresh-outline" size={20} color="#FFF" />
            <Text style={styles.refreshButtonText}>Actualizar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Matches List
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#C7A24C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Matches</Text>
        <View style={styles.backButton} />
      </View>
      
      <FlatList
        data={matches}
        keyExtractor={(item, index) => `${item.userId}-${item.movieId}-${index}`}
        renderItem={({ item }) => (
          <MatchCard match={item} onChatPress={handleChatPress} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor="#C7A24C"
            colors={['#C7A24C']}
          />
        }
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.matchCount}>
              {matches.length} {matches.length === 1 ? 'Match' : 'Matches'}
            </Text>
            <Text style={styles.matchSubtext}>
              Usuarios que vieron películas similares recientemente
            </Text>
          </View>
        }
      />
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
  errorButtons: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  backButtonError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.transparent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 24,
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  listContent: {
    paddingVertical: 16,
  },
  listHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  matchCount: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  matchSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
