import prisma from "../config/prisma.js";
import logActivity from "../utils/logActivity.js";

export const createApplication = async (req, res) => {
  try {
    const {
      companyName,
      positionTitle,
      status,
      location,
      salaryMin,
      salaryMax,
      jobLink,
      notes,
      priority,
      appliedDate,
      nextStepDate,
    } = req.body;

    if (!companyName || !positionTitle) {
      return res.status(400).json({
        message: "Company name and position title are required",
      });
    }

    const application = await prisma.jobApplication.create({
      data: {
        companyName,
        positionTitle,
        status: status || "Wishlist",
        location: location || null,
        salaryMin: salaryMin ? Number(salaryMin) : null,
        salaryMax: salaryMax ? Number(salaryMax) : null,
        jobLink: jobLink || null,
        notes: notes || null,
        priority: priority || "Medium",
        appliedDate: appliedDate ? new Date(appliedDate) : null,
        nextStepDate: nextStepDate ? new Date(nextStepDate) : null,
        userId: req.user.id,
      },
    });

    await logActivity({
      userId: req.user.id,
      applicationId: application.id,
      action: "APPLICATION_CREATED",
      details: `${application.companyName} - ${application.positionTitle}`,
    });

    res.status(201).json(application);
  } catch (error) {
    console.error("Create application error:", error);
    res
      .status(500)
      .json({ message: "Server error while creating application" });
  }
};

export const getApplications = async (req, res) => {
  try {
    const { status, priority, search, sortBy, order } = req.query;

    const where = {
      userId: req.user.id,
    };

    if (status && status !== "All") {
      where.status = status;
    }

    if (priority && priority !== "All") {
      where.priority = priority;
    }

    if (search) {
      where.OR = [
        {
          companyName: {
            contains: search,
          },
        },
        {
          positionTitle: {
            contains: search,
          },
        },
      ];
    }

    const allowedSortFields = [
      "createdAt",
      "appliedDate",
      "nextStepDate",
      "companyName",
    ];
    const finalSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";
    const finalOrder = order === "asc" ? "asc" : "desc";

    const applications = await prisma.jobApplication.findMany({
      where,
      orderBy: {
        [finalSortBy]: finalOrder,
      },
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error("Get applications error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching applications" });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const application = await prisma.jobApplication.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error("Get application by id error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching application" });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!existingApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    const {
      companyName,
      positionTitle,
      status,
      location,
      salaryMin,
      salaryMax,
      jobLink,
      notes,
      priority,
      appliedDate,
      nextStepDate,
    } = req.body;

    const updatedApplication = await prisma.jobApplication.update({
      where: {
        id: req.params.id,
      },
      data: {
        companyName,
        positionTitle,
        status,
        location: location || null,
        salaryMin: salaryMin ? Number(salaryMin) : null,
        salaryMax: salaryMax ? Number(salaryMax) : null,
        jobLink: jobLink || null,
        notes: notes || null,
        priority,
        appliedDate: appliedDate ? new Date(appliedDate) : null,
        nextStepDate: nextStepDate ? new Date(nextStepDate) : null,
      },
    });

    const statusChanged =
      existingApplication.status !== updatedApplication.status;

    await logActivity({
      userId: req.user.id,
      applicationId: updatedApplication.id,
      action: statusChanged ? "STATUS_CHANGED" : "APPLICATION_UPDATED",
      details: statusChanged
        ? `${updatedApplication.companyName}: ${existingApplication.status} -> ${updatedApplication.status}`
        : `${updatedApplication.companyName} - ${updatedApplication.positionTitle}`,
    });

    res.status(200).json(updatedApplication);
  } catch (error) {
    console.error("Update application error:", error);
    res
      .status(500)
      .json({ message: "Server error while updating application" });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!existingApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    await logActivity({
      userId: req.user.id,
      applicationId: existingApplication.id,
      action: "APPLICATION_DELETED",
      details: `${existingApplication.companyName} - ${existingApplication.positionTitle}`,
    });

    await prisma.jobApplication.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Delete application error:", error);
    res
      .status(500)
      .json({ message: "Server error while deleting application" });
  }
};

export const getApplicationStats = async (req, res) => {
  try {
    const applications = await prisma.jobApplication.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalApplications = applications.length;

    const statusCounts = {
      Wishlist: 0,
      Applied: 0,
      "HR Interview": 0,
      "Technical Interview": 0,
      "Test Task": 0,
      "Final Interview": 0,
      Offer: 0,
      Rejected: 0,
    };

    for (const application of applications) {
      if (statusCounts[application.status] !== undefined) {
        statusCounts[application.status] += 1;
      }
    }

    const now = new Date();

    const upcomingNextSteps = applications
      .filter((app) => app.nextStepDate && new Date(app.nextStepDate) >= now)
      .sort((a, b) => new Date(a.nextStepDate) - new Date(b.nextStepDate))
      .slice(0, 5);

    const recentApplications = applications.slice(0, 5);

    res.status(200).json({
      totalApplications,
      statusCounts,
      upcomingNextSteps,
      recentApplications,
    });
  } catch (error) {
    console.error("Get application stats error:", error);
    res.status(500).json({ message: "Server error while fetching stats" });
  }
};
