const EVENTS = {
  // Home Screen
  HELPLINE_SCREEN_VISITED: {
    TRACKING_KEY: 'helpline_screen_visited',
    GENERIC_ATTRIBUTES: {
      screen: 'homeScreen',
      label: 'clickOnHelplineButton',
    },
  },
  CATEGORIES_SCREEN_VISITED: {
    TRACKING_KEY: 'categories_screen_visited',
    GENERIC_ATTRIBUTES: {
      screen: 'homeScreen',
      label: 'clickOnSeeMoreCategoryButton',
    },
  },
  CATEGORY_VISITED: {
    TRACKING_KEY: 'category_visited',
    GENERIC_ATTRIBUTES: {
      screen: 'homeScreen',
      label: 'clickOnCategoryIcon',
    },
  },
  POPULAR_BUSINESS_VISITED: {
    TRACKING_KEY: 'popular_business_visited',
    GENERIC_ATTRIBUTES: {
      screen: 'homeScreen',
      label: 'clickOnPopularBusiness',
    },
  },
  RECENTLY_ADDED_BUSINESS_VISITED: {
    TRACKING_KEY: 'recently_added_business_visited',
    GENERIC_ATTRIBUTES: {
      screen: 'homeScreen',
      label: 'clickOnRecentlyAddedBusiness',
    },
  },

  // Filter Screen
  APPLY_FILTERS: {
    TRACKING_KEY: 'apply_filters',
    GENERIC_ATTRIBUTES: {
      screen: 'filterScreen',
      label: 'applyFiltersButtonClicked',
    },
  },

  // Helpline Screen
  CALL_ON_HELPLINE: {
    TRACKING_KEY: 'call_on_helpline',
    GENERIC_ATTRIBUTES: {
      screen: 'helplineScreen',
      label: 'callNowButtonClicked',
    },
  },

  // Businesses / Places Screen / Show All Businesses
  VISITED_BUSINESS: {
    TRACKING_KEY: 'visited_business',
    GENERIC_ATTRIBUTES: {
      screen: 'businessScreen',
      label: 'clickOnBusinessCard',
    },
  },

  // Business Detail Screen
  SHARE_BUTTON_CLICKED: {
    TRACKING_KEY: 'share_button_clicked',
    GENERIC_ATTRIBUTES: {
      screen: 'businessDetailsScreen',
      label: 'clickOnShareButton',
    },
  },
  FAVORITE_BUTTON_CLICKED: {
    TRACKING_KEY: 'favorite_button_clicked',
    GENERIC_ATTRIBUTES: {
      screen: 'businessDetailsScreen',
      label: 'clickOnFavoriteButton',
    },
  },
  UNFAVORITE_BUTTON_CLICKED: {
    TRACKING_KEY: 'unfavorite_button_clicked',
    GENERIC_ATTRIBUTES: {
      screen: 'businessDetailsScreen',
      label: 'clickOnUnfavoriteButton',
    },
  },
  SEE_MORE_IMAGES: {
    TRACKING_KEY: 'see_more_images',
    GENERIC_ATTRIBUTES: {
      screen: 'businessDetailsScreen',
      label: 'clickOnImageIcon',
    },
  },
  CONTACTED_BUSINESS_VIA_WHATSAPP: {
    TRACKING_KEY: 'contacted_business_via_whatsapp',
    GENERIC_ATTRIBUTES: {
      screen: 'businessDetailsScreen',
      label: 'clickOnWhatsappIcon',
    },
  },
  CONTACTED_BUSINESS_VIA_PHONE_NUMBER: {
    TRACKING_KEY: 'contacted_business_via_phone_number',
    GENERIC_ATTRIBUTES: {
      screen: 'businessDetailsScreen',
      label: 'clickOnPhoneIcon',
    },
  },
  CONTACTED_BUSINESS_VIA_EMAIL: {
    TRACKING_KEY: 'contacted_business_via_email',
    GENERIC_ATTRIBUTES: {
      screen: 'businessDetailsScreen',
      label: 'clickOnEmailIcon',
    },
  },
  VISITED_BUSINESS_WEBSITE: {
    TRACKING_KEY: 'visited_business_website',
    GENERIC_ATTRIBUTES: {
      screen: 'businessDetailsScreen',
      label: 'clickOnWebsiteIcon',
    },
  },
  CHECKED_BUSINESS_DIRECTION: {
    TRACKING_KEY: 'checked_business_direction',
    GENERIC_ATTRIBUTES: {
      screen: 'businessScreen',
      label: 'clickOnDirectionIcon',
    },
  },
};

export default EVENTS;
