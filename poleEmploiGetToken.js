const axios = require("axios");
const qs = require("qs");
const fs = require("fs");
require("dotenv").config();
const { parse, stringify } = require("envfile");

const pathToenvFile = ".env";
/**
 *
 * @param {string} key
 * @param {string} value
 * //Function to set environment variables.
 */
function setEnv(object) {
  fs.readFile(pathToenvFile, "utf8", (err, data) => {
    if (err) {
      return console.warn(err);
    }
    const result = parse(data);
    // eslint-disable-next-line guard-for-in
    for (const key in object) {
      result[key] = object[key];
    }
    // console.warn(result);
    return fs.writeFile(pathToenvFile, stringify(result), (error) => {
      if (error) {
        return console.warn(error);
      }
      return console.warn("Token : OK"); // Can be commented or deleted
    });
  });
}
// Calling the function setEnv

const data = qs.stringify({
  grant_type: process.env.grant_type,
  client_id: process.env.client_id,
  client_secret: process.env.client_secret,
  scope: process.env.scope,
});
const config = {
  method: "post",
  url: "https://entreprise.pole-emploi.fr/connexion/oauth2/access_token?realm=%2Fpartenaire",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  data,
};

axios(config)
  .then((response) => {
    setEnv(response.data);
  })
  .catch((error) => {
    console.warn(error);
  });
