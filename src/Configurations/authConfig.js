export const msalConfig = {
  auth: {
    //To Be edited
    clientId: "PLACEHOLDER_CLIENT_ID", 
    authority: "https://login.microsoftonline.com/tecfrac.com",
    redirectUri: "http://localhost:3000/home", 
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["openid", "profile", "email", "User.Read"],
};
