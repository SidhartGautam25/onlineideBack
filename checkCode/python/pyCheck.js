const dangerousPatterns = ["os.system", "subprocess", "open("];

export function checkPythonCode(code) {
  if (!code || typeof code !== "string") {
    return {
      status: 400,
      error: "invalid or missing code",
    };
  }

  if (code.length > 10000) {
    return {
      error: "too large code",
    };
  }

  for (const pattern of dangerousPatterns) {
    if (code.includes(pattern)) {
      return {
        error: "unsafe code detected",
      };
    }
  }

  return {
    error: false,
  };
}
