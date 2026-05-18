import path from "path";
import { createServer as createViteServer } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";
import express from "express";
import { createApp } from "./src/backend/app";

// Load environment variables first
dotenv.config();

/**
 * Validates required environment variables before starting server
 */
function validateEnvironment(): void {
  console.log('🔍 Validating environment variables...');
  
  const requiredVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'VITE_API_URL',
    'VITE_GEMINI_API_KEY'
  ];

  const missingVars: string[] = [];
  const placeholderVars: string[] = [];

  for (const varName of requiredVars) {
    const value = process.env[varName];
    
    if (!value) {
      missingVars.push(varName);
    } else if (
      value.includes('your-') || 
      value.includes('username:password') ||
      value.includes('cluster0.xxxxx') ||
      value.includes('change-this')
    ) {
      placeholderVars.push(varName);
    }
  }

  if (missingVars.length > 0 || placeholderVars.length > 0) {
    console.error('\n❌ ENVIRONMENT CONFIGURATION ERROR\n');
    
    if (missingVars.length > 0) {
      console.error('Missing required environment variables:');
      missingVars.forEach(varName => {
        console.error(`  ❌ ${varName}`);
      });
      console.error('');
    }
    
    if (placeholderVars.length > 0) {
      console.error('Environment variables contain placeholder values:');
      placeholderVars.forEach(varName => {
        console.error(`  ⚠️  ${varName}: ${process.env[varName]?.substring(0, 50)}...`);
      });
      console.error('');
    }

    console.error('📝 SETUP INSTRUCTIONS:');
    console.error('1. Copy .env.example to .env if you haven\'t already');
    console.error('2. Update all placeholder values in .env with real credentials');
    console.error('3. For MongoDB: See MONGODB_SETUP_GUIDE.md');
    console.error('4. For Firebase: See FIREBASE_COMPLETE_SETUP_GUIDE.md');
    console.error('5. For Gemini API: Visit https://aistudio.google.com/app/apikey');
    console.error('6. Save .env and restart the server\n');
    
    process.exit(1);
  }

  console.log('✅ All required environment variables are set\n');
}

async function startServer() {
  try {
    // Validate environment before starting
    validateEnvironment();

    // Create the HTTP server with Express app and Socket.IO
    const { httpServer, app } = createApp();
    const PORT = 3000;

    // Vite middleware for development
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        configFile: false,
        server: {
          middlewareMode: true,
          hmr: {
            server: httpServer,
          },
        },
        appType: "spa",
        plugins: [react(), tailwindcss()],
        resolve: {
          alias: {
            "@": path.resolve(process.cwd(), "."),
          },
        },
      });

      // Use Vite's middleware
      app.use(vite.middlewares);
    } else {
      // Production: serve static files
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (_req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    // Start the server
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
      console.log(`🔥 Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

// Made with Bob
