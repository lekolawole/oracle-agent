export function ApiResponse<T>(
  IsSuccess: boolean,
  Result?: any,
  ErrorMessage?: string
) {
  return ({
    IsSuccess,
    Result,
    ErrorMessage
  })
}