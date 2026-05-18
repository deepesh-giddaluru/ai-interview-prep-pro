/**
 * MongoDB Database Connection Utility
 * 
 * This is an alias/export file for the main database configuration.
 * Import from either 'config/db' or 'config/database' - both work the same.
 */

export { default as connectDB, isConnected, getConnectionStatus, encodeMongoPassword } from './database';

// Made with Bob
