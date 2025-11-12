import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "inkafarma.pe",
        port: "", // Opcional, déjalo vacío si no usas un puerto específico
        pathname: "/**", // Permite todas las rutas bajo este dominio
      },
      {
        protocol: "https",
        hostname: "dcuk1cxrnzjkh.cloudfront.net",
        port: "", // Opcional, déjalo vacío si no usas un puerto específico
        pathname: "/**", // Permite todas las rutas bajo este dominio
      },

      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        port: "", // Opcional, déjalo vacío si no usas un puerto específico
        pathname: "/**", // Permite todas las rutas bajo este dominio
      },
      {
        protocol: "https",
        hostname: "laboratoriosnacionales.com",
        port: "", // Opcional, déjalo vacío si no usas un puerto específico
        pathname: "/**", // Permite todas las rutas bajo este dominio
      },
      {
        protocol: "https",
        hostname: "www.farmaciasahumada.cl",
        port: "", // Opcional, déjalo vacío si no usas un puerto específico
        pathname: "/**", // Permite todas las rutas bajo este dominio
      },
    ],
  },
};

export default nextConfig;
