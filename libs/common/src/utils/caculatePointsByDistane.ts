/* eslint-disable @typescript-eslint/restrict-template-expressions */
// TypeScript interfaces
export interface PointsCalculationParams {
  request_type: 'flight' | 'purchase' | 'other';
  distance_km?: number;
  classTicket?: 'economy' | 'premium' | 'business' | 'first';
  amount?: number;
  earn_rate?: number;
  promo_multiplier?: number;
}

export interface PointsCalculationResult {
  points_awarded: number;
  calculation_details: {
    base_points: number;
    multipliers: {
      fare_class_multiplier: number;
      promo_multiplier: number;
    };
    formula_used: string;
  };
}

// Fare class multipliers (configurable)
const FARE_CLASS_MULTIPLIERS = {
  economy: 1.0,
  premium: 1.25,
  business: 1.5,
  first: 1.5, // Same as business for now
} as const;

// Constants
const KM_TO_MILES_RATIO = 0.621371;
const DEFAULT_EARN_RATE = 0.01; // 1 point per 100 currency units
const DEFAULT_PROMO_MULTIPLIER = 1.0;

/**
 * Calculate points/miles based on request type
 * @param params - Calculation parameters
 * @returns Calculated points with details
 */
export const calculatePointsByDistance = (
  params: PointsCalculationParams,
): PointsCalculationResult => {
  const {
    request_type,
    distance_km,
    classTicket = 'economy',
    amount,
    earn_rate = DEFAULT_EARN_RATE,
    promo_multiplier = DEFAULT_PROMO_MULTIPLIER,
  } = params;

  console.log('params', params);

  // Validation
  if (!request_type) {
    throw new Error('request_type is required');
  }

  switch (request_type) {
    case 'flight':
      return calculateFlightPoints({
        distance_km,
        classTicket,
        promo_multiplier,
      });

    case 'purchase':
      return calculatePurchasePoints({
        amount,
        earn_rate,
      });

    case 'other':
      // For 'other' type, return 0 points or implement custom logic
      return {
        points_awarded: 100,
        calculation_details: {
          base_points: 0,
          multipliers: {
            fare_class_multiplier: 1.0,
            promo_multiplier: 1.0,
          },
          formula_used: 'other_type_no_calculation',
        },
      };

    default:
      throw new Error(`Unsupported your request type: ${request_type}`);
  }
};

/**
 * Calculate flight points based on distance
 * Formula: distance_miles = distance_km * 0.621371
 *          base_miles = round(distance_miles)
 *          miles_awarded = base_miles * fare_class_multiplier * promo_multiplier
 */
function calculateFlightPoints(params: {
  distance_km?: number;
  classTicket: 'economy' | 'premium' | 'business' | 'first';
  promo_multiplier: number;
}): PointsCalculationResult {
  const { distance_km, classTicket, promo_multiplier } = params;

  if (!distance_km || distance_km <= 0) {
    throw new Error(
      'distance_km is required and must be greater than 0 for flight calculation',
    );
  }

  // Convert km to miles
  const distance_miles = distance_km * KM_TO_MILES_RATIO;
  const base_miles = Math.round(distance_miles);

  // Get fare class multiplier
  const fare_class_multiplier = FARE_CLASS_MULTIPLIERS[classTicket];
  if (!fare_class_multiplier) {
    throw new Error(`Unsupported class ticket: ${classTicket}`);
  }

  // Calculate final miles
  const miles_awarded = Math.round(
    base_miles * fare_class_multiplier * promo_multiplier,
  );

  return {
    points_awarded: miles_awarded,
    calculation_details: {
      base_points: base_miles,
      multipliers: {
        fare_class_multiplier,
        promo_multiplier,
      },
      formula_used: `${distance_km}km * ${KM_TO_MILES_RATIO} = ${distance_miles.toFixed(2)} miles, rounded to ${base_miles} * ${fare_class_multiplier} * ${promo_multiplier} = ${miles_awarded}`,
    },
  };
}

/**
 * Calculate purchase points based on amount
 * Formula: miles_awarded = floor(amount * earn_rate)
 */
function calculatePurchasePoints(params: {
  amount?: number;
  earn_rate: number;
}): PointsCalculationResult {
  const { amount, earn_rate } = params;
  console.log('params1', params);
  if (!amount || amount <= 0) {
    throw new Error(
      'amount is required and must be greater than 0 for purchase calculation',
    );
  }

  if (earn_rate <= 0) {
    throw new Error('earn_rate must be greater than 0');
  }

  // Calculate points
  const miles_awarded = Math.floor(amount * earn_rate);

  return {
    points_awarded: miles_awarded,
    calculation_details: {
      base_points: miles_awarded,
      multipliers: {
        fare_class_multiplier: 1.0,
        promo_multiplier: 1.0,
      },
      formula_used: `floor(${amount} * ${earn_rate}) = ${miles_awarded}`,
    },
  };
}

// Legacy function for backward compatibility
export const calculatePointsByDistanceSimple = (
  distance: number,
  classTicket: 'economy' | 'business' | 'first',
): number => {
  const result = calculatePointsByDistance({
    request_type: 'flight',
    distance_km: distance,
    classTicket: classTicket === 'first' ? 'business' : classTicket,
  });
  return result.points_awarded;
};
