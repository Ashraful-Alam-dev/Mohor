import * as analyticsService from "./analyticsService.js";

export const getMyAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const data = await analyticsService.getCustomerAnalytics(userId);

    return res.status(200).json({
      success: true,
      role: "customer",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getAdminAnalytics();

    return res.status(200).json({
      success: true,
      role: "admin",
      data,
    });
  } catch (error) {
    next(error);
  }
};


export const recalculateAnalytics = async (req, res, next) => {
  try {

    const userId = req.user.id;

    const data =
      req.user.role === "admin"
        ? await analyticsService.getAdminAnalytics()
        : await analyticsService.getCustomerAnalytics(userId);

    return res.status(200).json({
      success: true,
      message: "Analytics recalculated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};