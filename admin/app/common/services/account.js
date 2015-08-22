angular.module('sbAdminApp')
  .factory('Account', function ($http, appSettings) {
    return {
      getProfile: function() {
          return $http.get(appSettings.authPath + '/api/me');
      },
      updateProfile: function(profileData) {
          return $http.put(appSettings.authPath + '/api/me', profileData);
      }
    };
  });