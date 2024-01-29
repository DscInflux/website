import { withIronSession } from "next-iron-session";

export default function withSession(app) {
  return withIronSession(app, {
    password: process.env.jwtSecret,
    cookieName: "dscinflux.xyz",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });
}
