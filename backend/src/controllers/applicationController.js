import prisma from "../config/prisma.js";

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
    const applications = await prisma.jobApplication.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
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
