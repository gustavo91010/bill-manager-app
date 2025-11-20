// /pages/api/proxy/[...slug].ts
import { NextApiRequest, NextApiResponse } from "next"
import httpProxy from "http-proxy"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE

const proxy = httpProxy.createProxyServer()

export const config = {
  api: {
    bodyParser: false,
  },
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>((resolve, reject) => {
    req.url = req.url?.replace("/api/proxy", "") || ""

    proxy.web(req, res, {
      target: API_BASE,
      changeOrigin: true,
    })

    proxy.once("proxyRes", () => resolve())
    proxy.once("error", reject)
  })
}
