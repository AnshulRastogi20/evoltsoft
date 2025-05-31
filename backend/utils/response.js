// Standard API response format
const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = {
    success,
    message
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

// Success responses
const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return sendResponse(res, statusCode, true, message, data);
};

// Error responses
const sendError = (res, message, statusCode = 400) => {
  return sendResponse(res, statusCode, false, message);
};

// Paginated response
const sendPaginatedResponse = (res, message, data, pagination) => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination
  });
};

module.exports = {
  sendResponse,
  sendSuccess,
  sendError,
  sendPaginatedResponse
};
