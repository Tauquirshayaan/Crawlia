import { prisma } from './src/lib/prisma';
async function main() {
  try {
    await prisma.campaign.count({
      where: { workspace: { is: { members: { some: { userId: '1' } } } } }
    });
    console.log('Success');
  } catch(e: any) {
    console.error("Full error:", e);
    console.error("Message:", e.message);
  }
}
main();
