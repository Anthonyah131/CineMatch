import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { COLORS } from '../../config/colors';
import { useDiaryLogs } from '../../hooks/diary/useDiaryLogs';
import DiaryLogItem from '../../components/diary/DiaryLogItem';
import EmptyDiary from '../../components/diary/EmptyDiary';
import { tmdbService } from '../../services/tmdbService';
import type { MediaLog } from '../../types/mediaLog.types';

export default function DiaryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { logs, isLoading, error, refreshLogs, hasMore, loadMore } = useDiaryLogs(20);
  const [movieTitles, setMovieTitles] = useState<Record<string, { title: string; posterPath?: string }>>({});
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch movie/show titles and posters for all logs
  useEffect(() => {
    const fetchTitles = async () => {
      const titlePromises = logs.map(async (log) => {
        const cacheKey = `${log.tmdbId}-${log.mediaType}`;
        if (movieTitles[cacheKey]) return null;

        try {
          if (log.mediaType === 'movie') {
            const data = await tmdbService.movies.getDetails(log.tmdbId);
            return {
              key: cacheKey,
              title: data.title || 'Unknown Title',
              posterPath: data.poster_path || undefined,
            };
          } else {
            const data = await tmdbService.tv.getDetails(log.tmdbId);
            return {
              key: cacheKey,
              title: data.name || 'Unknown Title',
              posterPath: data.poster_path || undefined,
            };
          }
        } catch (err) {
          console.error(`Error fetching title for ${log.tmdbId}:`, err);
          return { key: cacheKey, title: 'Unknown Title', posterPath: undefined };
        }
      });

      const results = await Promise.all(titlePromises);
      const newTitles: Record<string, { title: string; posterPath?: string }> = {};
      results.forEach((result) => {
        if (result && result.posterPath !== undefined) {
          newTitles[result.key] = {
            title: result.title,
            posterPath: result.posterPath,
          };
        }
      });

      if (Object.keys(newTitles).length > 0) {
        setMovieTitles((prev) => ({ ...prev, ...newTitles }));
      }
    };

    if (logs.length > 0) {
      fetchTitles();
    }
  }, [logs, movieTitles]);

  const handleLogPress = (log: MediaLog) => {
    navigation.navigate('LogDetail', { logId: log.id });
  };

  const handleLoadMore = async () => {
    if (!hasMore || loadingMore || isLoading) return;
    setLoadingMore(true);
    await loadMore();
    setLoadingMore(false);
  };

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.footer}>
        {loadingMore && <ActivityIndicator size="small" color={COLORS.primary} />}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Diary</Text>
        <Text style={styles.headerSubtitle}>
          {logs.length} {logs.length === 1 ? 'entry' : 'entries'}
        </Text>
      </View>

      {/* Error State */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Loading State */}
      {isLoading && logs.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading your diary...</Text>
        </View>
      ) : logs.length === 0 ? (
        <EmptyDiary />
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const cacheKey = `${item.tmdbId}-${item.mediaType}`;
            const mediaData = movieTitles[cacheKey];
            return (
              <DiaryLogItem
                log={item}
                onPress={handleLogPress}
                movieTitle={mediaData?.title}
                posterPath={mediaData?.posterPath}
              />
            );
          }}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={refreshLogs}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: `${COLORS.error}15`,
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 8,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  listContent: {
    padding: 20,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
