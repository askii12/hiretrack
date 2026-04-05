import prisma from "../config/prisma.js";

export const getActivityLogs = async (req, res) => {
  try {
    const logs = await prisma.activityLog.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    res.status(200).json(logs);
  } catch (error) {
    console.error("Get activity logs error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching activity logs" });
  }
};
