import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { TmdbMovieDetails } from '../../../types/tmdb.types';

const COLORS = {
  background: '#0F0B0A',
  surface: '#1A1412',
  primary: '#C7A24C',
  accent: '#A4252C',
  text: '#F2E9E4',
};

interface MovieDetailsTabProps {
  movieDetails: TmdbMovieDetails;
}

export function MovieDetailsTab({ movieDetails }: MovieDetailsTabProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      {/* Géneros */}
      {movieDetails.genres && movieDetails.genres.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Géneros</Text>
          <View style={styles.genresContainer}>
            {movieDetails.genres.map(genre => (
              <View key={genre.id} style={styles.genreChip}>
                <Text style={styles.genreText}>{genre.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Fecha de estreno */}
      {movieDetails.release_date && (
        <DetailRow
          label="Fecha de estreno"
          value={formatDate(movieDetails.release_date)}
        />
      )}

      {/* Duración */}
      {movieDetails.runtime && (
        <DetailRow
          label="Duración"
          value={`${movieDetails.runtime} minutos`}
        />
      )}

      {/* Estado */}
      {movieDetails.status && (
        <DetailRow label="Estado" value={movieDetails.status} />
      )}

      {/* Idioma original */}
      {movieDetails.original_language && (
        <DetailRow
          label="Idioma original"
          value={movieDetails.original_language.toUpperCase()}
        />
      )}

      {/* Presupuesto */}
      {movieDetails.budget && movieDetails.budget > 0 && (
        <DetailRow
          label="Presupuesto"
          value={formatCurrency(movieDetails.budget)}
        />
      )}

      {/* Ingresos */}
      {movieDetails.revenue && movieDetails.revenue > 0 && (
        <DetailRow
          label="Ingresos"
          value={formatCurrency(movieDetails.revenue)}
        />
      )}

      {/* Compañías de producción */}
      {movieDetails.production_companies &&
        movieDetails.production_companies.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Compañías de producción</Text>
            {movieDetails.production_companies.map(company => (
              <Text key={company.id} style={styles.companyText}>
                • {company.name}
              </Text>
            ))}
          </View>
        )}

      {/* Países de producción */}
      {movieDetails.production_countries &&
        movieDetails.production_countries.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Países de producción</Text>
            <Text style={styles.detailValue}>
              {movieDetails.production_countries
                .map(country => country.name)
                .join(', ')}
            </Text>
          </View>
        )}
    </View>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 12,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreChip: {
    backgroundColor: 'rgba(199, 162, 76, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  genreText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(199, 162, 76, 0.1)',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.8,
    textAlign: 'right',
    flex: 1,
  },
  companyText: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.8,
    marginBottom: 4,
  },
});
