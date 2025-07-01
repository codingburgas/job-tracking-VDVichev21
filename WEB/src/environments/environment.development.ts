export const environment = {
    production: false,
    apiUrl: 'http://localhost:5000/api',
    apiBaseUrl: 'http://localhost:5000',
    appName: 'Job Tracker (Dev)',
    version: '1.0.0-dev',
    features: {
        enableDebugMode: true,
        enableConsoleLogging: true,
        enableErrorReporting: false
    },
    auth: {
        tokenKey: 'job_tracker_token_dev',
        userKey: 'job_tracker_user_dev',
        tokenExpirationBuffer: 300000 // 5 minutes in milliseconds
    }
};