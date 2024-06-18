export enum ApiErrorCode {
  SUCCESS = 200, // 成功
  BAD_REQUEST = 400, // 参数错误
  UNAUTHORIZED = 401, // 未授权
  FORBIDDEN = 403, // 拒绝访问
  NOT_FOUND = 404, // 找不到
  INTERNAL_SERVER_ERROR = 500, // 服务器内部错误
  BAD_GATEWAY = 502, // 网关错误
  SERVICE_UNAVAILABLE = 503, // 服务不可用
  TAGGINGCHAT = 1001, // 打标签出现错误
  DB_RRROR = 2001, // 操作数据库错误
}
