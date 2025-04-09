// Simple Router for MASTERDO App
class Router {
    constructor() {
        this.routes = {};
        this.currentUser = null;
        
        // Check if the user is already logged in
        const user = localStorage.getItem('masterdo-user');
        if (user) {
            this.currentUser = JSON.parse(user);
        }
        
        // Handle navigation
        window.addEventListener('hashchange', () => {
            this.navigate();
        });
    }
    
    // Add a route
    add(path, callback) {
        this.routes[path] = callback;
        return this;
    }
    
    // Navigate to a specific route
    navigate() {
        const hash = window.location.hash || '#login';
        
        // Check if the user is logged in for protected routes
        if (hash !== '#login' && !this.currentUser) {
            window.location.hash = '#login';
            return;
        }
        
        const route = this.routes[hash];
        if (route) {
            route();
        } else {
            // Default to login page if route not found
            window.location.hash = '#login';
        }
    }
    
    // Login the user
    login(username, password) {
        // In a real app, you would validate against a server
        // For demo purposes, we'll accept any non-empty username and password
        if (username.trim() && password.trim()) {
            this.currentUser = { username };
            localStorage.setItem('masterdo-user', JSON.stringify(this.currentUser));
            window.location.hash = '#app';
            return true;
        }
        return false;
    }
    
    // Logout the user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('masterdo-user');
        window.location.hash = '#login';
    }
    
    // Get the current user
    getUser() {
        return this.currentUser;
    }
    
    // Initialize the router
    init() {
        this.navigate();
    }
}

// Create a router instance
const router = new Router();