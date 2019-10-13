require('dotenv').config();

const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT,
    mongodb: {
        uri: process.env.MONGODB_URI,
    },
    // Google spreadsheets configs
    googleSpreadsheets: {
        songs: {
            spreadsheetId: '1AX7WSzg7TjpaRLnlBSsMjlfhwFPhkKvVJIX0Ft6IK-E',
            config: {
                type: 'service_account',
                project_id: 'pb-library',
                private_key_id: '19f69048ba7105a82af938ac27603327728af0e1',
                private_key:
                    '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC88/IkjO5EH5CM\ndJi6l9uqvF+gabUwhOi3BnsuVXVpBtNt+l5XMm6hKn2l1rjitrU9trVTO2kTDgY4\nR2hqoIpcPECZmHVzOqnLElisgkKZFOf8rsAxd7PuRz+94yWIwgvBtFR4n9wWjJew\n6uyJMiEb8sx36q0hQEDFXDv8rwuI1ZLlz/ndEBVEvy8M1uCR4v8ZmWK4ed/iJAbA\nuBDU1g1Q/uQUQuApMBZRTbuGlPhLJta21KhSfFa2igxCBtdUoPomEhEpV5VBXzaS\nOx/3j8DhHVPq31LxdgxTI8ars6/jNxMHXp4CP8dSwEk1niBtqla1W6Xtyvvb38Ix\ndmjGS+unAgMBAAECggEACoDY9fUrjXffth8JGl40pMIB4s3dd4v7z6i5kjLH6wWp\nHRTsx5YTFjxhbaWI83lKi9qrK6xCw/9kkx5NDJhN+KCUyrTx2mzpYVNswHIhN5c0\n6hPgtR89TkKBpZGJ1ZdLxgG7LFVei5ZXHEuCyIGT25TcjtHpu85xi0b8QqiMUJfO\nBVwC2R8nPXIr5yDiWHK3E8BUQL8GjgnIWI6sSo3gii2HSBgkwwey3J8emZpdi7Dr\nBNzKNduvICguvl57OUnsxVadKwTqNsc790E5B9l6B1hL5hjESycKhtpZTY8sZfjE\nNYMagzZ/Nx/ai0W6GfirWOkys4mlgp0yJ+61jktXGQKBgQD5IBC2anUJi6QL870C\n4JZwkvBlQ+wH/qwEtZfqFaNLmigFIJ+OqqauZ7T3MtlsVG9ScBmmqYsPokuK3c4W\np7Xb2hdFymM42fM5QdvGlXickcgUhK2HKZOwCkOndsrKccBRc5FM6LjM8q3L3WBl\nKZ2+DRdNSwCgvqIZa184GHNQFQKBgQDCKsuv3h8Pnb3KrNPFkOZGQP4Ewh1RLFEe\n5rk2wLt/uaU6DOfp5smkUt16I71LB1az3Z4MpaWqmFVZyiuR9f2YexrffpIsyAOV\nav4AsfQnsgq+ElBEO3UuQ50kV80kU4Q8UpFfja+QpJUT7Z6uJW1Ekk3KNrAkJLXX\nEug23N1/ywKBgBRLi3EA7TXw3VVn7t78IuVa4yCszt673ZGopY6ZYqs3DMmWJcl+\nl4OfyTtWNiZAHq2NmllceIq2gwb2GOL5mLQnaTvzR/AKuWjRt7DO3nuK2MzrHiPj\nvDdcLrTG1bB2Yd+A1bZ5QwzXPFdeWosDP+mKsXpHgO6XeScu+xvbyhEdAoGADlz8\nFFZqFc2lbIi8YbEGV8wW/mMdqBOPLKoEqXg4ZoplHpY10aew4ub+WzqplhNE5qlO\nN8FJMAV0yt+ZuYJo8A6rPj0uswFYwoTXpVWEqisRgF36chGz6Wg3B6k3E6jZ71xs\nRJVGl3yVSpQZWOiL3La16m+BOCs/CFnts6FDAWECgYAgfNd3Jx2Dvjjg9O3FmaBp\n1va9cOeYQryG4xq+lU4rhD/MpCxYTEEMSy38WhqDYdICY425RgtA8RPXg9b626Bx\nZWo8L2A91nCnqB3PlgpS/NeuKwU1mpG33IZFTKAK4JFCXu45QTHH5xG7AXZV2Sci\n7M7x3dXnMFiqe5eSaDKpRg==\n-----END PRIVATE KEY-----\n',
                client_email: 'import-songs-spreadsheet@pb-library.iam.gserviceaccount.com',
                client_id: '112778119731632630636',
                auth_uri: 'https://accounts.google.com/o/oauth2/auth',
                token_uri: 'https://oauth2.googleapis.com/token',
                auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
                client_x509_cert_url:
                    'https://www.googleapis.com/robot/v1/metadata/x509/import-songs-spreadsheet%40pb-library.iam.gserviceaccount.com',
            },
        },
    },
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
