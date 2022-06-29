const EVENTS = {
  // Home Screen
  HELPLINE_SCREEN_VISITED: {
    TRACKING_KEY: 'helpline_screen_visited',
    GENERIC_ATTRIBUTES: {
      category: 'homeScreen',
      label: 'clickOnHelplineButton',
    },
  },
  CATEGORIES_SCREEN_VISITED: {
    TRACKING_KEY: 'categories_screen_visited',
    GENERIC_ATTRIBUTES: {
      category: 'homeScreen',
      label: 'clickOnSeeMoreCategoryButton',
    },
  },
  CATEGORY_VISITED: {
    TRACKING_KEY: 'category_visited',
    GENERIC_ATTRIBUTES: {
      category: 'homeScreen',
      label: 'clickOnCategoryIcon',
    },
  },
  POPULAR_BUSINESS_VISITED: {
    TRACKING_KEY: 'popular_business_visited',
    GENERIC_ATTRIBUTES: {
      category: 'homeScreen',
      label: 'clickOnPopularBusiness',
    },
  },
  RECENTLY_ADDED_BUSINESS_VISITED: {
    TRACKING_KEY: 'recently_added_business_visited',
    GENERIC_ATTRIBUTES: {
      category: 'homeScreen',
      label: 'clickOnRecentlyAddedBusiness',
    },
  },

  // Helpline Screen
  CALL_ON_HELPLINE: {
    TRACKING_KEY: 'call_on_helpline',
    GENERIC_ATTRIBUTES: {
      category: 'helplineScreen',
      label: 'callNowButtonClicked',
    },
  },

  // Business Screen
  CONTACTED_BUSINESS_VIA_WHATSAPP: {
    TRACKING_KEY: 'contacted_business_via_whatsapp',
    GENERIC_ATTRIBUTES: {
      category: 'businessDetailsScreen',
      label: 'clickOnWhatsappIcon',
    },
  },
  CONTACTED_BUSINESS_VIA_PHONE_NUMBER: {
    TRACKING_KEY: 'contacted_business_via_phone_number',
    GENERIC_ATTRIBUTES: {
      category: 'businessDetailsScreen',
      label: 'clickOnPhoneIcon',
    },
  },
  CONTACTED_BUSINESS_VIA_EMAIL: {
    TRACKING_KEY: 'contacted_business_via_email',
    GENERIC_ATTRIBUTES: {
      category: 'businessDetailsScreen',
      label: 'clickOnEmailIcon',
    },
  },
  VISITED_BUSINESS_WEBSITE: {
    TRACKING_KEY: 'visited_business_website',
    GENERIC_ATTRIBUTES: {
      category: 'businessDetailsScreen',
      label: 'clickOnWebsiteIcon',
    },
  },
  CHECKED_BUSINESS_DIRECTION: {
    TRACKING_KEY: 'checked_business_direction',
    GENERIC_ATTRIBUTES: {
      category: 'businessScreen',
      label: 'clickOnDirectionIcon',
    },
  },
};

export default EVENTS;
