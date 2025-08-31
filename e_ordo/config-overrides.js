module.exports = {
    webpack: function (config, env) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        http: false
      };
      return config;
    }
  };
  