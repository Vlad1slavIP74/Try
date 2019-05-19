export const getHost = (req) => (req.connection.encrypted ? 'https://' : 'http://') + req.headers.host
