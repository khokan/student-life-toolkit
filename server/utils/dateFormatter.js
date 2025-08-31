// Convert frontend date string (YYYY-MM-DD) to Date object for database
exports.frontendToDatabaseDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString);
};

// Convert database Date object to frontend date string (YYYY-MM-DD)
exports.databaseToFrontendDate = (dateObject) => {
  if (!dateObject) return null;
  return dateObject.toISOString().split('T')[0];
};

// Clean object by removing undefined values
exports.cleanObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined && value !== null)
  );
};