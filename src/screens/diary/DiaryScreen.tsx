import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/stacks/HomeStack';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../config/colors';
import { useDiaryLogs } from '../../hooks/diary/useDiaryLogs';
import DiaryLogItem from '../../components/diary/DiaryLogItem';
import EmptyDiary from '../../components/diary/EmptyDiary';
import { mediaCacheService } from '../../services/mediaCacheService';
import type { MediaLog } from '../../types/mediaLog.types';
import type { MediaCache } from '../../types/mediaCache.types';

export default function DiaryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { logs, isLoading, error, refreshLogs, hasMore, loadMore } = useDiaryLogs(20);
  const [mediaCache, setMediaCache] = useState<Record<string, MediaCache>>({});
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch media data from cache
  useEffect(() => {
    const fetchMediaData = async () => {
      const cachePromises = logs.map(async (log) => {
        const cacheKey = `${log.tmdbId}-${log.mediaType}`;
        if (mediaCache[cacheKey]) return null;

        try {
          const response = log.mediaType === 'movie'
            ? await mediaCacheService.getMovie(log.tmdbId)
            : await mediaCacheService.getTVShow(log.tmdbId);
          
          return {
            key: cacheKey,
            data: response.data,
          };
        } catch (err) {
          console.error(`Error fetching cache for ${log.tmdbId}:`, err);
          return null;
        }
      });

      const results = await Promise.all(cachePromises);
      const newCache: Record<string, MediaCache> = {};
      results.forEach((result) => {
        if (result) {
          newCache[result.key] = result.data;
        }
      });

      if (Object.keys(newCache).length > 0) {
        setMediaCache((prev) => ({ ...prev, ...newCache }));
      }
    };

    if (logs.length > 0) {
      fetchMediaData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logs]);

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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Diary</Text>
          <Text style={styles.headerSubtitle}>
            {logs.length} {logs.length === 1 ? 'entry' : 'entries'}
          </Text>
        </View>
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
            const media = mediaCache[cacheKey];
            return (
              <DiaryLogItem
                log={item}
                onPress={handleLogPress}
                movieTitle={media?.title}
                posterPath={media?.posterPath}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerContent: {
    flex: 1,
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
