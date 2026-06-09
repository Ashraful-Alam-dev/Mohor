import express from 'express';
import { getAuditLogs } from './auditController.js';

const router = express.Router();

router.get('/logs', getAuditLogs);

export default router;