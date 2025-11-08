import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { TmdbCrewMember } from '../../../types/tmdb.types';
import { COLORS } from '../../../config/colors';

interface CrewListProps {
  crew: TmdbCrewMember[];
}

export function CrewList({ crew }: CrewListProps) {
  if (!crew || crew.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay información del equipo</Text>
      </View>
    );
  }

  // Agrupar por departamento
  const departments = crew.reduce((acc, member) => {
    const dept = member.department || 'Other';
    if (!acc[dept]) {
      acc[dept] = [];
    }
    acc[dept].push(member);
    return acc;
  }, {} as Record<string, TmdbCrewMember[]>);

  return (
    <View style={styles.container}>
      {Object.entries(departments).map(([department, members]) => (
        <View key={department} style={styles.departmentSection}>
          <Text style={styles.departmentTitle}>{department}</Text>
          {members.map(member => (
            <View key={member.credit_id} style={styles.crewItem}>
              <Text style={styles.crewName}>{member.name}</Text>
              <Text style={styles.crewJob}>{member.job}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.text,
    opacity: 0.6,
    fontSize: 14,
  },
  departmentSection: {
    marginBottom: 24,
  },
  departmentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 12,
  },
  crewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(199, 162, 76, 0.1)',
  },
  crewName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  crewJob: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.6,
  },
});
