enum Actions {
  // body module
  ADD_HTML_CLASSNAME = "addHtmlClassName",
  REMOVE_HTML_CLASSNAME = "removeHtmlClassName",
  ADD_BODY_CLASSNAME = "addBodyClassName",
  REMOVE_BODY_CLASSNAME = "removeBodyClassName",
  ADD_BODY_ATTRIBUTE = "addBodyAttribute",
  REMOVE_BODY_ATTRIBUTE = "removeBodyAttribute",
  ADD_CLASSNAME = "addClassName",

  // auth module
  VERIFY_AUTH = "verifyAuth",
  LOGIN = "login",
  LOGOUT = "logout",
  REGISTER = "register",
  UPDATE_USER = "updateUser",
  FORGOT_PASSWORD = "forgotPassword",
  SET_BREADCRUMB_ACTION = "setBreadcrumbAction",
  LOGIN_OAUTH = "loginOAuth",
  LOGIN_OAUTH_CALLBACK = "loginOAuthCallback",
  GET_PERMISSIONS = "getPermissions",

  // api module
  GET_LOADING = "getLoading",
  GET_REFRESH = "getRefresh",

  // error log module
  ADD_ERROR_LOG = "addErrorLog",
  ADD_WARNING_LOG = "addWarningLog",
  ADD_API_LOG = "addApiLog",
  CLEAR_ERROR_LOG = "clearErrorLog",
  CLEAR_WARNING_LOG = "clearWarningLog",
  CLEAR_API_LOG = "clearApiLog",

  // toast module
  SHOW_TOAST = "showToast",
}

enum Mutations {
  // breadcrumb module
  SET_CLASSNAME_BY_POSITION = "appendBreadcrumb",
  // auth module
  PURGE_AUTH = "purgeAuth",
  SET_AUTH = "setAuth",
  SET_USER = "setUser",
  SET_PASSWORD = "setPassword",
  SET_ERROR = "setError",
  SET_LOCALE = "setLocale",

  // body module
  SET_BREADCRUMB_MUTATION = "setBreadcrumbMutation",
  SET_LAYOUT_CONFIG = "setLayoutConfig",
  RESET_LAYOUT_CONFIG = "resetLayoutConfig",
  OVERRIDE_LAYOUT_CONFIG = "overrideLayoutConfig",
  OVERRIDE_PAGE_LAYOUT_CONFIG = "overridePageLayoutConfig",
  SET_PERMISSIONS = "setPermissions",
  SET_LAYOUT = "setLayout",

  // api module
  SET_LOADING = "setLoading",
  SET_REFRESH = "setRefresh",

  // error log module
}

export { Actions, Mutations };
