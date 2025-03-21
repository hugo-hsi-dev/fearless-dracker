/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as PublicRouteImport } from './routes/_public/route'
import { Route as NoAuthRouteImport } from './routes/_no-auth/route'
import { Route as AuthRouteImport } from './routes/_auth/route'
import { Route as PublicIndexImport } from './routes/_public/index'
import { Route as AuthAppRouteImport } from './routes/_auth/app/route'
import { Route as PublicRunCodeIndexImport } from './routes/_public/$runCode/index'
import { Route as NoAuthSignInIndexImport } from './routes/_no-auth/sign-in/index'
import { Route as AuthAppIndexImport } from './routes/_auth/app/index'
import { Route as AuthAppRunCodeIndexImport } from './routes/_auth/app/$runCode/index'

// Create/Update Routes

const PublicRouteRoute = PublicRouteImport.update({
  id: '/_public',
  getParentRoute: () => rootRoute,
} as any)

const NoAuthRouteRoute = NoAuthRouteImport.update({
  id: '/_no-auth',
  getParentRoute: () => rootRoute,
} as any)

const AuthRouteRoute = AuthRouteImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any)

const PublicIndexRoute = PublicIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => PublicRouteRoute,
} as any)

const AuthAppRouteRoute = AuthAppRouteImport.update({
  id: '/app',
  path: '/app',
  getParentRoute: () => AuthRouteRoute,
} as any)

const PublicRunCodeIndexRoute = PublicRunCodeIndexImport.update({
  id: '/$runCode/',
  path: '/$runCode/',
  getParentRoute: () => PublicRouteRoute,
} as any)

const NoAuthSignInIndexRoute = NoAuthSignInIndexImport.update({
  id: '/sign-in/',
  path: '/sign-in/',
  getParentRoute: () => NoAuthRouteRoute,
} as any)

const AuthAppIndexRoute = AuthAppIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AuthAppRouteRoute,
} as any)

const AuthAppRunCodeIndexRoute = AuthAppRunCodeIndexImport.update({
  id: '/$runCode/',
  path: '/$runCode/',
  getParentRoute: () => AuthAppRouteRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_auth': {
      id: '/_auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthRouteImport
      parentRoute: typeof rootRoute
    }
    '/_no-auth': {
      id: '/_no-auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof NoAuthRouteImport
      parentRoute: typeof rootRoute
    }
    '/_public': {
      id: '/_public'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof PublicRouteImport
      parentRoute: typeof rootRoute
    }
    '/_auth/app': {
      id: '/_auth/app'
      path: '/app'
      fullPath: '/app'
      preLoaderRoute: typeof AuthAppRouteImport
      parentRoute: typeof AuthRouteImport
    }
    '/_public/': {
      id: '/_public/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof PublicIndexImport
      parentRoute: typeof PublicRouteImport
    }
    '/_auth/app/': {
      id: '/_auth/app/'
      path: '/'
      fullPath: '/app/'
      preLoaderRoute: typeof AuthAppIndexImport
      parentRoute: typeof AuthAppRouteImport
    }
    '/_no-auth/sign-in/': {
      id: '/_no-auth/sign-in/'
      path: '/sign-in'
      fullPath: '/sign-in'
      preLoaderRoute: typeof NoAuthSignInIndexImport
      parentRoute: typeof NoAuthRouteImport
    }
    '/_public/$runCode/': {
      id: '/_public/$runCode/'
      path: '/$runCode'
      fullPath: '/$runCode'
      preLoaderRoute: typeof PublicRunCodeIndexImport
      parentRoute: typeof PublicRouteImport
    }
    '/_auth/app/$runCode/': {
      id: '/_auth/app/$runCode/'
      path: '/$runCode'
      fullPath: '/app/$runCode'
      preLoaderRoute: typeof AuthAppRunCodeIndexImport
      parentRoute: typeof AuthAppRouteImport
    }
  }
}

// Create and export the route tree

interface AuthAppRouteRouteChildren {
  AuthAppIndexRoute: typeof AuthAppIndexRoute
  AuthAppRunCodeIndexRoute: typeof AuthAppRunCodeIndexRoute
}

const AuthAppRouteRouteChildren: AuthAppRouteRouteChildren = {
  AuthAppIndexRoute: AuthAppIndexRoute,
  AuthAppRunCodeIndexRoute: AuthAppRunCodeIndexRoute,
}

const AuthAppRouteRouteWithChildren = AuthAppRouteRoute._addFileChildren(
  AuthAppRouteRouteChildren,
)

interface AuthRouteRouteChildren {
  AuthAppRouteRoute: typeof AuthAppRouteRouteWithChildren
}

const AuthRouteRouteChildren: AuthRouteRouteChildren = {
  AuthAppRouteRoute: AuthAppRouteRouteWithChildren,
}

const AuthRouteRouteWithChildren = AuthRouteRoute._addFileChildren(
  AuthRouteRouteChildren,
)

interface NoAuthRouteRouteChildren {
  NoAuthSignInIndexRoute: typeof NoAuthSignInIndexRoute
}

const NoAuthRouteRouteChildren: NoAuthRouteRouteChildren = {
  NoAuthSignInIndexRoute: NoAuthSignInIndexRoute,
}

const NoAuthRouteRouteWithChildren = NoAuthRouteRoute._addFileChildren(
  NoAuthRouteRouteChildren,
)

interface PublicRouteRouteChildren {
  PublicIndexRoute: typeof PublicIndexRoute
  PublicRunCodeIndexRoute: typeof PublicRunCodeIndexRoute
}

const PublicRouteRouteChildren: PublicRouteRouteChildren = {
  PublicIndexRoute: PublicIndexRoute,
  PublicRunCodeIndexRoute: PublicRunCodeIndexRoute,
}

const PublicRouteRouteWithChildren = PublicRouteRoute._addFileChildren(
  PublicRouteRouteChildren,
)

export interface FileRoutesByFullPath {
  '': typeof PublicRouteRouteWithChildren
  '/app': typeof AuthAppRouteRouteWithChildren
  '/': typeof PublicIndexRoute
  '/app/': typeof AuthAppIndexRoute
  '/sign-in': typeof NoAuthSignInIndexRoute
  '/$runCode': typeof PublicRunCodeIndexRoute
  '/app/$runCode': typeof AuthAppRunCodeIndexRoute
}

export interface FileRoutesByTo {
  '': typeof NoAuthRouteRouteWithChildren
  '/': typeof PublicIndexRoute
  '/app': typeof AuthAppIndexRoute
  '/sign-in': typeof NoAuthSignInIndexRoute
  '/$runCode': typeof PublicRunCodeIndexRoute
  '/app/$runCode': typeof AuthAppRunCodeIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_auth': typeof AuthRouteRouteWithChildren
  '/_no-auth': typeof NoAuthRouteRouteWithChildren
  '/_public': typeof PublicRouteRouteWithChildren
  '/_auth/app': typeof AuthAppRouteRouteWithChildren
  '/_public/': typeof PublicIndexRoute
  '/_auth/app/': typeof AuthAppIndexRoute
  '/_no-auth/sign-in/': typeof NoAuthSignInIndexRoute
  '/_public/$runCode/': typeof PublicRunCodeIndexRoute
  '/_auth/app/$runCode/': typeof AuthAppRunCodeIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/app'
    | '/'
    | '/app/'
    | '/sign-in'
    | '/$runCode'
    | '/app/$runCode'
  fileRoutesByTo: FileRoutesByTo
  to: '' | '/' | '/app' | '/sign-in' | '/$runCode' | '/app/$runCode'
  id:
    | '__root__'
    | '/_auth'
    | '/_no-auth'
    | '/_public'
    | '/_auth/app'
    | '/_public/'
    | '/_auth/app/'
    | '/_no-auth/sign-in/'
    | '/_public/$runCode/'
    | '/_auth/app/$runCode/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AuthRouteRoute: typeof AuthRouteRouteWithChildren
  NoAuthRouteRoute: typeof NoAuthRouteRouteWithChildren
  PublicRouteRoute: typeof PublicRouteRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  AuthRouteRoute: AuthRouteRouteWithChildren,
  NoAuthRouteRoute: NoAuthRouteRouteWithChildren,
  PublicRouteRoute: PublicRouteRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_auth",
        "/_no-auth",
        "/_public"
      ]
    },
    "/_auth": {
      "filePath": "_auth/route.tsx",
      "children": [
        "/_auth/app"
      ]
    },
    "/_no-auth": {
      "filePath": "_no-auth/route.tsx",
      "children": [
        "/_no-auth/sign-in/"
      ]
    },
    "/_public": {
      "filePath": "_public/route.tsx",
      "children": [
        "/_public/",
        "/_public/$runCode/"
      ]
    },
    "/_auth/app": {
      "filePath": "_auth/app/route.tsx",
      "parent": "/_auth",
      "children": [
        "/_auth/app/",
        "/_auth/app/$runCode/"
      ]
    },
    "/_public/": {
      "filePath": "_public/index.tsx",
      "parent": "/_public"
    },
    "/_auth/app/": {
      "filePath": "_auth/app/index.tsx",
      "parent": "/_auth/app"
    },
    "/_no-auth/sign-in/": {
      "filePath": "_no-auth/sign-in/index.tsx",
      "parent": "/_no-auth"
    },
    "/_public/$runCode/": {
      "filePath": "_public/$runCode/index.tsx",
      "parent": "/_public"
    },
    "/_auth/app/$runCode/": {
      "filePath": "_auth/app/$runCode/index.tsx",
      "parent": "/_auth/app"
    }
  }
}
ROUTE_MANIFEST_END */
