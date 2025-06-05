import { prisma } from "@/lib/db/prisma";
import JSZip from "jszip";

export async function exportUserData(userId: string) {
  // Collect all user-related data from all tables
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const entities = await prisma.entity.findMany({ where: { userId } });
  const accounts = await prisma.account.findMany({ where: { userId } });
  const sessions = await prisma.session.findMany({ where: { userId } });
  // VerificationToken is not directly linked to userId, so skip unless you have a mapping

  // Bundle all data into a single JSON object
  const data = {
    user,
    entities,
    accounts,
    sessions,
  };

  // Create a zip file with the JSON
  const zip = new JSZip();
  zip.file("gdpr-data.json", JSON.stringify(data, null, 2));
  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
  return zipBuffer;
}
