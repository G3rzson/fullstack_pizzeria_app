/**
 * Conditional build script
 * Runs different build commands based on the deployment environment
 *
 * - Production (main branch): Runs migrations + build
 * - Preview (other branches): Only build (no migrations)
 */

const { execSync } = require("child_process");

// Vercel environment variables
const VERCEL_ENV = process.env.VERCEL_ENV; // 'production' | 'preview' | 'development'
const VERCEL_GIT_COMMIT_REF = process.env.VERCEL_GIT_COMMIT_REF; // branch name

console.log("🚀 Conditional Build Script");
console.log("===========================");
console.log(`Environment: ${VERCEL_ENV || "local"}`);
console.log(`Branch: ${VERCEL_GIT_COMMIT_REF || "unknown"}`);
console.log("");

try {
  // Production build (main branch)
  if (VERCEL_ENV === "production" || VERCEL_GIT_COMMIT_REF === "main") {
    console.log("🏭 PRODUCTION BUILD");
    console.log("Running database migrations...");
    execSync("npm run build:production", { stdio: "inherit" });
  }
  // Preview build (feature branches like dev2)
  else if (VERCEL_ENV === "preview") {
    console.log("🔍 PREVIEW BUILD");
    console.log("Skipping database migrations (preview environment)");
    execSync("npm run build:preview", { stdio: "inherit" });
  }
  // Local/fallback
  else {
    console.log("📦 LOCAL/FALLBACK BUILD");
    console.log("Building without migrations...");
    execSync("npm run build:preview", { stdio: "inherit" });
  }

  console.log("");
  console.log("✅ Build completed successfully!");
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}
