import { getAllAuditLogsService } from './auditService.js';

export const getAuditLogs = async (req, res) => {
  try {
    const { type } = req.query; 
    const logs = await getAllAuditLogsService(type || null);

    return res.status(200).json({
      success: true,
      logs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch audit logs',
    });
  }
};