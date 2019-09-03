require('dotenv').config();

const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT,
};

if (process.env.AUTH && process.env.AUTH.trim() !== '') {
    config.auth = process.env.AUTH.split('|')
        .map(password => {
            if (!password.trim()) {
                return null;
            }

            return {
                user: 'admin',
                password: password.trim(),
            };
        })
        .filter(x => x);
}

module.exports = config;
