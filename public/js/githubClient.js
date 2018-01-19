export const getToken = function(p) {
  return new Promise(function(resolve, reject) {
    var tokenKey = 'githubToken' + p.pipeId;
    var token = sessionStorage.getItem(tokenKey);

    if (token && token !== "null") {
      resolve(token);
    } else {
      p.get('pipe', 'private', 'token').then(function(newToken) {
        sessionStorage.setItem(tokenKey, newToken);
        resolve(newToken);
      }).catch(function(error) {
        reject(Error("It broke"));
      });
    }
  });
}

export const ghClient = function(p) {
  return new Promise(function(resolve, reject) {
    getToken(p).then(function(token) {
      resolve(new GitHub({ token: token }));
    }).catch(function(error) {
      reject(Error("It broke"));
    });
  });
};
