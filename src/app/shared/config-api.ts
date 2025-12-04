const userApiEnv = {
    local: 'http://localhost:5002',
    production: 'https://api-user.asmtariste.fr:5002',
    staging: 'https://staging.asmtariste.fr/api/user',
}
const contentApiEnv = {
    local: 'http://localhost:5001',
    production: 'https://api-content.asmtariste.fr:5001',
    staging: 'https://staging.asmtariste.fr/api/content',
}

export const USER_API_URI: string = userApiEnv.staging;
export const CONTENT_API_URI: string = contentApiEnv.staging;