export interface BodyCreateProfileSessionM {
  user: {
    external_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_numbers: {
      phone_number: string;
      phone_type: string;
      preference_flags: string[];
    }[];
    opted_in: string;
    external_id_type: string;
    gender: string;
    dob: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    user_profile: {
      partner: string[];
    };
  };
}

export interface ResponseCreateProfileSessionM {
  status: string;
  user: User;
}

interface User {
  id: string;
  external_id: string;
  opted_in: boolean;
  activated: boolean;
  proxy_ids: any[];
  identifiers: Identifier[];
  available_points: number;
  test_points: number;
  unclaimed_achievement_count: number;
  email: string;
  gender: string;
  dob: string;
  created_at: string;
  updated_at: string;
  address: string;
  city: string;
  zip: string;
  dma: string;
  state: string;
  country: string;
  suspended: boolean;
  last_name: string;
  first_name: string;
  registered_at: string;
  profile_photo_url: string;
  test_account: boolean;
  account_status: string;
  referrer_code: string;
  user_profile: UserProfile;
  phone_numbers: PhoneNumber[];
}

interface Identifier {
  external_id: string;
  external_id_type: string;
}

interface UserProfile {
  _version: number;
  org: any[];
  favorite_activities: any[];
  interests: any[];
  preferred_channel: any[];
  cpg_brand_of_interest: any[];
  partner_type: any[];
  languages: any[];
  socioeconomic_status: any[];
  mcc: any[];
  partner: string[];
}

interface PhoneNumber {
  phone_number: string;
  phone_type: string;
  preference_flags: string[];
  verified_ownership: boolean;
}
