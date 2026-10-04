const AuditLog = require("../models/AuditLog");

console.log("AuditLog model loaded");

const createAuditLog = async ({
  userId = null,
  action,
  entity,
  entityId = null,
  status = "SUCCESS",
  description = "",
  metadata = {},
  session = null,
}) => {
  const auditData = {
    userId,
    action,
    entity,
    entityId,
    status,
    description,
    metadata,
  };

  const auditLog = session
    ? await AuditLog.create([auditData], { session })
    : await AuditLog.create(auditData);

  return session ? auditLog[0] : auditLog;
};

module.exports = {
  createAuditLog,
};