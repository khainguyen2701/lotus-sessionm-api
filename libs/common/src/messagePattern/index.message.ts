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
    ADMIN_GET_LIST_MEMBER: 'admin.get_list_user',
    // Admin endpoints
    ADMIN_USERS_OVERVIEW: 'user.admin.users_overview',
    ADMIN_USERS_TIMESERIES: 'user.admin.users_timeseries',
    ADMIN_GET_DETAIL_USER: 'user.admin.get_detail_user',
    ADMIN_UPDATE_USER: 'user.admin.update_user',
  },
  REWARDS: {
    GET_ALL: 'rewards.get_rewards',
    GET_DETAIL: 'rewards.get_reward_by_id',
    CREATE: 'rewards.create_reward',
    CREATE_TIER: 'rewards.create_tier',
    GET_ALL_TIERS: 'rewards.get_all_tiers',
    GET_MEMBER_TRANSACTIONS: 'rewards.get_member_transactions',
    GET_ADMIN_TRANSACTIONS: 'rewards.get_admin_transactions',
  },
  LOYALTY: {
    GET_ALL: 'loyalty.get_loyalty',
    GET_DETAIL: 'loyalty.get_loyalty_by_id',
    CREATE: 'loyalty.create_loyalty',
    CREATE_MANUAL_REQUEST: 'loyalty.create_manual_request',
    GET_LIST_MANUAL_REQUEST: 'loyalty.get_list_manual_request',
    GET_LIST_MANUAL_REQUEST_FOR_ADMIN:
      'loyalty.get_list_manual_request_for_admin',
    // Admin endpoints
    ADMIN_OVERVIEW: 'loyalty.admin.overview',
    ADMIN_TIMESERIES: 'loyalty.admin.timeseries',
    ADMIN_PROCESSING_SPEED: 'loyalty.admin.processing_speed',
    GET_MANUAL_REQUEST_DETAIL: 'loyalty.get_manual_request_detail',
    GET_MANUAL_REQUEST_DETAIL_FOR_ADMIN:
      'loyalty.get_manual_request_detail_for_admin',
    CHANGE_STATUS_MANUAL_REQUEST_FOR_ADMIN:
      'loyalty.change_status_manual_request_for_admin',
    ADMIN_DIRECT_MILEAGE: 'loyalty.admin.direct_mileage',
  },
};
