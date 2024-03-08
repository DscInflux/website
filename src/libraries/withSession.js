import { withIronSession } from "next-iron-session";

// Generate a random password
function generateRandomPassword(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=[]{}|;:,.<>?";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

const password = generateRandomPassword(123);

export default function withSession(app) {
  return withIronSession(app, {
    password: password,
    cookieName: "dscinflux.xyz",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });
}
