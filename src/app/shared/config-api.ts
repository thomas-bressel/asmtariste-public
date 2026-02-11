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

export const USER_API_URI: string = userApiEnv.staging;
export const CONTENT_API_URI: string = contentApiEnv.staging;

// Multi-tenant Project ID (hardcoded for now)
export const PROJECT_ID: string = 'proj_8k2h9f3l';

const staticImages = {
    local: `http://localhost:8085/${PROJECT_ID}/content/`,
    staging: `https://staging.drawer.auroreia.fr/${PROJECT_ID}/content/`,
    
}
const staticAvatars = {
    local: `http://localhost:8085/${PROJECT_ID}/users/`,
    staging: `https://staging.drawer.auroreia.fr/${PROJECT_ID}/users/`,
    
}

export const USER_STATIC_IMAGES_URI: string = staticAvatars.staging;


export const CONTENT_STATIC_IMAGES_URI: string = staticImages.staging;
