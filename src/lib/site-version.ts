declare const __SITE_VERSION__: string

export const SITE_VERSION = typeof __SITE_VERSION__ === "string" ? __SITE_VERSION__ : "dev"
