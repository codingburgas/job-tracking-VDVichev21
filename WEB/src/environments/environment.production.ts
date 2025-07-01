export const environment = {
    production: true,
    apiUrl: 'http://your-production-api.com/api',
    apiBaseUrl: 'http://your-production-api.com',
    appName: 'Job Tracker',
    version: '1.0.0',
    features: {
        enableDebugMode: false,
        enableConsoleLogging: false,
        enableErrorReporting: true
    },
    auth: {
        tokenKey: 'job_tracker_token',
        userKey: 'job_tracker_user',
        tokenExpirationBuffer: 300000 // 5 minutes in milliseconds
    }
};