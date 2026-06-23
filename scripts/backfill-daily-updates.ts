import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function normalizeText(value: string) {
  return value.replace(/\r\n/g, "\n").trim();
}

function buildSection(label: string, value: string | null) {
  const content = normalizeText(value ?? "");

  if (!content) {
    return null;
  }

  return {
    content,
    section: `${label}: ${content}`,
  };
}

function hasMigratedSection(currentText: string, label: string, content: string) {
  const normalizedCurrent = normalizeText(currentText);
  const normalizedSection = normalizeText(`${label}: ${content}`);
  const blocks = normalizedCurrent.split(/\n{2,}/).map((block) => block.trim());

  return blocks.includes(normalizedSection) || blocks.includes(content);
}

function buildBackfilledTodaysTasks(update: {
  todaysTasks: string;
  completedTasks: string | null;
  tomorrowPlan: string | null;
}) {
  const currentTodaysTasks = normalizeText(update.todaysTasks);
  const sectionsToAppend: string[] = [];
  const completedTasks = buildSection(
    "Completed Tasks",
    update.completedTasks
  );
  const tomorrowPlan = buildSection("Tomorrow Plan", update.tomorrowPlan);

  if (
    completedTasks &&
    !hasMigratedSection(
      currentTodaysTasks,
      "Completed Tasks",
      completedTasks.content
    )
  ) {
    sectionsToAppend.push(completedTasks.section);
  }

  if (
    tomorrowPlan &&
    !hasMigratedSection(currentTodaysTasks, "Tomorrow Plan", tomorrowPlan.content)
  ) {
    sectionsToAppend.push(tomorrowPlan.section);
  }

  if (sectionsToAppend.length === 0) {
    return currentTodaysTasks;
  }

  return [currentTodaysTasks, ...sectionsToAppend]
    .filter(Boolean)
    .join("\n\n");
}

async function main() {
  const shouldApply = process.argv.includes("--apply");
  const updates = await prisma.dailyUpdate.findMany({
    select: {
      id: true,
      todaysTasks: true,
      completedTasks: true,
      tomorrowPlan: true,
      updatedAt: true,
    },
  });

  let updatedCount = 0;
  let skippedCount = 0;

  for (const update of updates) {
    const backfilledTodaysTasks = buildBackfilledTodaysTasks(update);

    if (backfilledTodaysTasks === normalizeText(update.todaysTasks)) {
      skippedCount += 1;
      continue;
    }

    if (shouldApply) {
      await prisma.$executeRaw`
        UPDATE DailyUpdate
        SET workedOn = ${backfilledTodaysTasks}, updatedAt = ${update.updatedAt}
        WHERE id = ${update.id}
      `;
    }

    updatedCount += 1;
  }

  console.log(
    `Daily update backfill ${shouldApply ? "complete" : "dry run complete"}. Updates ${shouldApply ? "applied" : "needed"}: ${updatedCount}. Skipped: ${skippedCount}.`
  );
}

main()
  .catch((error) => {
    console.error("Daily update backfill failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
