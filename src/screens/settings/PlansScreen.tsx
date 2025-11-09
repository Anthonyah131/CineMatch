import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../config/colors';

interface PlansScreenProps {
  navigation: any;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
}

export default function PlansScreen({ navigation }: PlansScreenProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Basic movie tracking',
        'Add up to 10 favorites',
        'Create reviews',
        'Follow other users',
        'Standard support',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$4.99',
      period: 'per month',
      popular: true,
      features: [
        'Everything in Free',
        'Unlimited favorites',
        'Advanced statistics',
        'Custom lists',
        'Priority support',
        'Ad-free experience',
        'Early access to features',
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$9.99',
      period: 'per month',
      features: [
        'Everything in Pro',
        'Exclusive badges',
        'Advanced filtering',
        'Export your data',
        'Premium themes',
        'Dedicated support',
        'Movie recommendations AI',
        'Offline mode',
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription Plans</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Icon name="star" size={48} color={COLORS.primary} />
          <Text style={styles.introTitle}>Choose Your Plan</Text>
          <Text style={styles.introSubtitle}>
            Unlock premium features and enhance your movie tracking experience
          </Text>
        </View>

        <View style={styles.plansContainer}>
          {plans.map(plan => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.planCardSelected,
                plan.popular && styles.planCardPopular,
              ]}
              onPress={() => setSelectedPlan(plan.id)}
              activeOpacity={0.7}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Icon name="star" size={12} color={COLORS.background} />
                  <Text style={styles.popularBadgeText}>Most Popular</Text>
                </View>
              )}

              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.planPricing}>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <Text style={styles.planPeriod}>/ {plan.period}</Text>
                </View>
              </View>

              <View style={styles.planFeatures}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Icon
                      name="checkmark-circle"
                      size={20}
                      color={COLORS.primary}
                    />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              {selectedPlan === plan.id && (
                <View style={styles.selectedIndicator}>
                  <Icon name="checkmark-circle" size={24} color={COLORS.primary} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.subscribeButton,
              !selectedPlan && styles.subscribeButtonDisabled,
            ]}
            disabled={!selectedPlan}
            onPress={() => {
              // TODO: Implement subscription logic
              console.log('Subscribe to:', selectedPlan);
            }}
          >
            <Text style={styles.subscribeButtonText}>
              {selectedPlan === 'free' ? 'Current Plan' : 'Subscribe Now'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Plans are currently in preview. Subscription functionality coming soon.
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  intro: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  introSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  plansContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  planCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: COLORS.primary,
  },
  planCardPopular: {
    borderColor: COLORS.primary,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: '50%',
    transform: [{ translateX: -60 }],
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  popularBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.background,
  },
  planHeader: {
    marginBottom: 20,
  },
  planName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
  },
  planPeriod: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  planFeatures: {
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  subscribeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  subscribeButtonDisabled: {
    backgroundColor: COLORS.border,
    opacity: 0.5,
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.background,
  },
  disclaimer: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
  bottomPadding: {
    height: 40,
  },
});
