import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1x1 transparent pixel in base64
const PIXEL_BASE64 = "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const draftId = url.searchParams.get("id");

  if (draftId) {
    try {
      // Find the latest send for this draft
      const send = await prisma.send.findFirst({
        where: { draftId },
        orderBy: { createdAt: 'desc' }
      });

      if (send && send.status === "SENT") {
        await prisma.send.update({
          where: { id: send.id },
          data: { status: "DELIVERED" }
        });
      }
    } catch (e) {
      console.error("Tracking pixel error", e);
    }
  }

  // Return a transparent 1x1 GIF
  const pixel = Buffer.from(PIXEL_BASE64, 'base64');
  return new NextResponse(pixel, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    }
  });
}
