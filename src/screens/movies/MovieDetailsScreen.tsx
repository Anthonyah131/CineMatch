import { useState } from "react"
import { View, ScrollView, StyleSheet, RefreshControl, Text, ActivityIndicator, Image } from "react-native"
import { useMovieDetails } from "../../hooks/movies/useMovieDetails"
import {
  MovieHeader,
  MovieInfo,
  MovieActions,
  MovieRatings,
  MovieTabs,
  CastCarousel,
  CrewList,
  MovieDetailsTab,
  type MovieTab,
} from "../../components/screens/movie-details"
import { buildPosterUrl } from "../../utils/tmdbImageHelpers"
;("use client")

const COLORS = {
  background: "#0F0B0A",
  surface: "#1A1412",
  primary: "#C7A24C",
  accent: "#A4252C",
  text: "#F2E9E4",
}

interface MovieDetailsScreenProps {
  route: {
    params: {
      movieId: number
    }
  }
  navigation: any
}

export default function MovieDetailsScreen({ route, navigation }: MovieDetailsScreenProps) {
  const { movieId } = route.params
  const [activeTab, setActiveTab] = useState<MovieTab>("cast")

  const { movieDetails, credits, isFavorite, userRating, error, refreshing, refresh, toggleFavorite } =
    useMovieDetails(movieId)

  const handleBack = () => {
    navigation.goBack()
  }

  const handleAddToWatchlist = () => {
    // TODO: Implementar watchlist
    console.log("Add to watchlist")
  }

  const handleShare = () => {
    // TODO: Implementar compartir
    console.log("Share movie")
  }

  const handleWriteReview = () => {
    navigation.navigate("WriteReview", { movieDetails })
  }

  // Director
  const director = credits?.crew.find((member) => member.job === "Director")

  // Loading state
  if (!movieDetails && !error) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando película...</Text>
      </View>
    )
  }

  // Error state
  if (error && !movieDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorSubtext}>No se pudo cargar la información de la película</Text>
      </View>
    )
  }

  if (!movieDetails) return null

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Backdrop Image */}
        {movieDetails.backdrop_path && (
          <View style={styles.backdropContainer}>
            <Image
              source={{ uri: buildPosterUrl(movieDetails.backdrop_path, "w780")! }}
              style={styles.backdropImage}
              resizeMode="cover"
            />
            <View style={styles.backdropGradient} />
          </View>
        )}

        {/* Header con botón back */}
        <View style={styles.headerContainer}>
          <MovieHeader onBack={handleBack} />
        </View>

        {/* Layout principal: Poster a la izquierda + Info a la derecha */}
        <View style={styles.mainContent}>
          {/* Columna izquierda: Poster */}
          <View style={styles.leftColumn}>
            <View style={styles.posterContainer}>
              {movieDetails.poster_path && buildPosterUrl(movieDetails.poster_path, "w500") && (
                <Image
                  source={{ uri: buildPosterUrl(movieDetails.poster_path, "w500")! }}
                  style={styles.posterImage}
                  resizeMode="cover"
                />
              )}
            </View>

            {/* Botones de acción debajo del poster */}
            <MovieActions
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              onAddToWatchlist={handleAddToWatchlist}
              onWriteReview={handleWriteReview}
              onShare={handleShare}
            />
          </View>

          {/* Columna derecha: Info + Ratings */}
          <View style={styles.rightColumn}>
            {/* Información principal */}
            <MovieInfo
              title={movieDetails.title}
              director={director?.name}
              releaseDate={movieDetails.release_date}
              runtime={movieDetails.runtime}
              tagline={movieDetails.tagline}
              overview={movieDetails.overview}
            />

            {/* Ratings */}
            <MovieRatings
              voteAverage={movieDetails.vote_average}
              voteCount={movieDetails.vote_count}
              userRating={userRating}
            />
          </View>
        </View>

        {/* Tabs */}
        <MovieTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Contenido según tab */}
        {activeTab === "cast" && credits?.cast && <CastCarousel cast={credits.cast.slice(0, 15)} />}

        {activeTab === "crew" && credits?.crew && <CrewList crew={credits.crew} />}

        {activeTab === "details" && <MovieDetailsTab movieDetails={movieDetails} />}

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  backdropContainer: {
    width: "100%",
    height: 280,
    position: "relative",
  },
  backdropImage: {
    width: "100%",
    height: "100%",
    borderBottomRightRadius: 200,
  },
  backdropGradient: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    height: "50%",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  mainContent: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
    marginTop: -80,
  },
  leftColumn: {
    width: 120,
  },
  rightColumn: {
    flex: 1,
  },
  posterContainer: {
    width: 120,
    aspectRatio: 2 / 3,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: COLORS.surface,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  posterImage: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    color: COLORS.text,
    fontSize: 16,
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 8,
  },
  errorText: {
    color: COLORS.accent,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  errorSubtext: {
    color: COLORS.text,
    fontSize: 14,
    opacity: 0.6,
    textAlign: "center",
  },
  bottomPadding: {
    height: 40,
  },
})
