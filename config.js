if (process.env.NODE_ENV === 'production') {
  module.exports = require('./config/keys_prod');
} else {
  module.exports = require('./config/keys_dev');
}

module.exports = function incrementUrl(url) {
  if (url.indexOf("-") >= 0) {
    let existingUrl = url.split("-");
    url = "";

    for (let i = 0; i < existingUrl.length; i++) {
      if (i + 1 < existingUrl.length) {
        url = url + existingUrl[i] + "-";
      } else {
        // increment if indecie is a number
        if (isNaN(existingUrl[i])) {
          url = url + existingUrl[i] + "-1";
        } else {
          url = url + (Number(existingUrl[i]) + 1);
        }
      }
    }

    return url;
  } else {
    return `${url}-1`;
  }
}