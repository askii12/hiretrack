import prisma from "../config/prisma.js";

const logActivity = async ({
  userId,
  applicationId = null,
  action,
  details = null,
}) => {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        applicationId,
        action,
        details,
      },
    });
  } catch (error) {
    console.error("Activity log error:", error);
  }
};

export default logActivity;
