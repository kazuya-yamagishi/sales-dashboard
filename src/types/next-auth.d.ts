import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: "ADMIN" | "USER"
      staffName: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "ADMIN" | "USER"
    staffName: string | null
  }
}
