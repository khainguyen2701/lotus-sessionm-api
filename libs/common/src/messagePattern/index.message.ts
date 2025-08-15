export const MessagePatternForMicro = {
  // Auth
  AUTH: {
    MEMBER_SIGNIN: 'auth.member_sign-in',
    MEMBER_SIGNUP: 'auth.member_sign-up',
    ADMIN_SIGNUP: 'auth.admin_sign-up',
    ADMIN_SIGNIN: 'auth.admin_sign-in',
    REFRESH_TOKEN: 'auth.refresh_token',
  },
  USER: {
    GET_ALL: 'user.get_users',
    GET_DETAIL: 'user.get_user_by_id',
    MEMBER_PROFILE: 'user.member_profile',
    ADMIN_PROFILE: 'user.admin_profile',
    EDIT_PROFILE: 'user.edit_profile',
    UPLOAD_FILE: 'user.upload_file',
  },
  REWARDS: {
    GET_ALL: 'rewards.get_rewards',
    GET_DETAIL: 'rewards.get_reward_by_id',
    CREATE: 'rewards.create_reward',
    CREATE_TIER: 'rewards.create_tier',
    GET_ALL_TIERS: 'rewards.get_all_tiers',
  },
  LOYALTY: {
    GET_ALL: 'loyalty.get_loyalty',
    GET_DETAIL: 'loyalty.get_loyalty_by_id',
    CREATE: 'loyalty.create_loyalty',
  },
};
