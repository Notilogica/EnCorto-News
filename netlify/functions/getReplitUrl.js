exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: process.env.REPLIT_URL || "https://tu-url-de-replit-default",
  };
};