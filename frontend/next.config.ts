import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	// No rewrites() — intentionally omitted to avoid SSRF (CVE-2026-64645).
	// If rewrites are ever needed, destination hosts must be validated
	// against a hardcoded allowlist; never use user-controlled input as
	// the rewrite destination hostname.
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
				port: "8000",
			},
			{
				protocol: "http",
				hostname: "127.0.0.1",
				port: "8000",
			},
		],
	},
};

export default nextConfig;
