/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true'

const nextConfig = {
  output: 'export',
  basePath: isGitHubPages ? '/roblox-catalog-recreation' : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: isGitHubPages ? '/roblox-catalog-recreation' : '',
  },
  assetPrefix: isGitHubPages ? '/roblox-catalog-recreation/' : undefined,
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
