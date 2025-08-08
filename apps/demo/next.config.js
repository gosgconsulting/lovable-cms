module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@measured/puck", "lucide-react"],
  // Speed up CI/CD by not failing builds on lint/type issues (we run lint separately)
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Produce a smaller production image/runtime for Railway
  output: 'standalone',
};
