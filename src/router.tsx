import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { NotFoundPage } from "@/components/not-found";
import { previewPathRewrite } from "@/lib/preview-path-prefix";
import { installPreviewServerFnRewrite } from "@/lib/preview-server-fn";
import { routeTree } from "./routeTree.gen";

installPreviewServerFnRewrite();

export function getRouter() {
  return createRouter({
    routeTree,
    rewrite: previewPathRewrite(),
    defaultErrorComponent: AppErrorComponent,
    defaultNotFoundComponent: NotFoundPage,
    defaultPreload: "intent",
    defaultPreloadDelay: 50,
  });
}
