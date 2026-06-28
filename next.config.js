/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Required for GitHub Pages static export

  // Optional: Configure image optimization for external domains if needed
  // For example, if you fetch user avatars from Google, GitHub, or Supabase Storage
  images: {
    unoptimized: true, // Prevents Next.js image optimization, which isn't compatible with 'output: export'
    // You might want to remove 'unoptimized: true' if you decide against 'output: export'
    // and instead host your Next.js app on a server that supports image optimization.
    // domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com', 'your-supabase-bucket-url.supabase.co'],
  },

  // Environment variables accessible in the browser
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  // Redirects and rewrites can be defined here if needed later
  // async redirects() {
  //   return [
  //     {
  //       source: '/old-path',
  //       destination: '/new-path',
  //       permanent: true,
  //     },
  //   ]
  // },

  // Other configurations like webpack, experimental features, etc.
};

module.exports = nextConfig;