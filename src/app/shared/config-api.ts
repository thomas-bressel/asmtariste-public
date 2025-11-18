const userApiEnv = {
    local: 'http://localhost:5002',
    production: 'https://api-user.asmtariste.fr:5002',
}
const contentApiEnv = {
    local: 'http://localhost:5001',
    production: 'https://api-content.asmtariste.fr:5001'
}

export const USER_API_URI: string = userApiEnv.local;
export const CONTENT_API_URI: string = contentApiEnv.local;