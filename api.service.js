// API Service Layer for Portfolio Builder
class ApiService {
    constructor() {
        this.baseURL = process.env.NODE_ENV === 'production'
            ? 'https://your-api-domain.com/api'
            : 'http://localhost:5000/api';
        this.token = localStorage.getItem('authToken');
    }

    // Utility method for making requests
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeaders(),
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth headers
    getAuthHeaders() {
        return this.token ? { Authorization: `Bearer ${this.token}` } : {};
    }

    // Set token
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    // AUTH METHODS
    async login(credentials) {
        const response = await this.makeRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });

        if (response.success && response.token) {
            this.setToken(response.token);
        }

        return response;
    }

    async signup(userData) {
        const response = await this.makeRequest('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        if (response.success && response.token) {
            this.setToken(response.token);
        }

        return response;
    }

    async logout() {
        this.setToken(null);
        return { success: true };
    }

    async getMe() {
        return await this.makeRequest('/auth/me');
    }

    async updateProfile(profileData) {
        return await this.makeRequest('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    async changePassword(passwordData) {
        return await this.makeRequest('/auth/change-password', {
            method: 'PUT',
            body: JSON.stringify(passwordData)
        });
    }

    // TEMPLATE METHODS
    async getTemplates(queryParams = {}) {
        const queryString = new URLSearchParams(queryParams).toString();
        const endpoint = queryString ? `/templates?${queryString}` : '/templates';
        return await this.makeRequest(endpoint);
    }

    async getTemplate(id) {
        return await this.makeRequest(`/templates/${id}`);
    }

    async createTemplate(templateData) {
        return await this.makeRequest('/templates', {
            method: 'POST',
            body: JSON.stringify(templateData)
        });
    }

    async updateTemplate(id, templateData) {
        return await this.makeRequest(`/templates/${id}`, {
            method: 'PUT',
            body: JSON.stringify(templateData)
        });
    }

    async patchTemplate(id, partialData) {
        return await this.makeRequest(`/templates/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(partialData)
        });
    }

    async deleteTemplate(id) {
        return await this.makeRequest(`/templates/${id}`, {
            method: 'DELETE'
        });
    }

    async getPublicTemplates(queryParams = {}) {
        const queryString = new URLSearchParams(queryParams).toString();
        const endpoint = queryString ? `/templates/public?${queryString}` : '/templates/public';
        return await this.makeRequest(endpoint);
    }

    // Auto-save functionality
    async autoSaveTemplate(templateData) {
        // Debounced save - implement with a delay
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(async () => {
            try {
                if (templateData.id) {
                    await this.patchTemplate(templateData.id, templateData);
                } else {
                    const result = await this.createTemplate(templateData);
                    return result.data._id; // Return new ID for future saves
                }
            } catch (error) {
                console.error('Auto-save failed:', error);
                // Could show a subtle notification here
            }
        }, 2000); // 2 second delay
    }
}

// Create global instance
const apiService = new ApiService();