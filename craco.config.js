const path = require('path');

module.exports = {
    webpack: {
        alias: {
            "@": path.resolve(__dirname, 'src'),
        },
    },
    eslint: {
        enable: false,  // Tắt eslint khi build
    },
};
