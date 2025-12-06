const userApiEnv = {
    local: 'http://localhost:5002',
    production: 'https://staging.drawer.auroreia.fr/api/user',
    staging: 'https://staging.drawer.auroreia.fr/api/user',
}
const contentApiEnv = {
    local: 'http://localhost:5001',
    production: 'https://staging.drawer.auroreia.fr/api/content',
    staging: 'https://staging.drawer.auroreia.fr/api/content',
}

export const USER_API_URI: string = userApiEnv.local;
export const CONTENT_API_URI: string = contentApiEnv.local;