import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "path"

const repository = process.env.GITHUB_REPOSITORY?.split("/")[1]
const isUserOrOrgPagesSite = repository?.endsWith(".github.io")
const pagesBase =
  repository && !isUserOrOrgPagesSite ? `/${repository}/` : "/"

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? pagesBase : "/",
  plugins: [react()],
  server: {
    open: true,
  },
  resolve: {
    alias: {
      bulma: resolve(__dirname, "node_modules/bulma/bulma.sass"),
    },
  },
})
