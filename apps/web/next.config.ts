import type { NextConfig } from 'next';
const nextConfig: NextConfig = { poweredByHeader: false, async headers(){ return [{source:'/:path*',headers:[{key:'X-Frame-Options',value:'SAMEORIGIN'},{key:'Content-Security-Policy',value:"frame-ancestors 'self' https://lezgamez.com https://www.lezgamez.com"}]}];}};
export default nextConfig;
