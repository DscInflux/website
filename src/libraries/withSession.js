import { withIronSession } from "next-iron-session";

export default function withSession(app) {
  return withIronSession(app, {
    password:
      "bXlzcWxhc3N3b3JkMTIzNDU2Nzg5MA154315gcgcgdhfkvvvvvvvvfvdXXXnSMIlokahcnexhsjgthvdl==",
    cookieName: "dscinflux.xyz",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });
}
