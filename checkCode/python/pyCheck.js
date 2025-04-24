// old code
const dangerousPatterns_1 = ["os.system", "subprocess", "open("];

// updated one
const dangerousPatterns = [
  /import\s+os/,
  /import\s+subprocess/,
  /import\s+socket/,
  /import\s+shutil/,
  /import\s+sys/,
  /__import__/,
  /eval\s*\(/,
  /exec\s*\(/,
  /open\s*\(/,
  /while\s+True\s*:/, // detect infinite loops
];

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
