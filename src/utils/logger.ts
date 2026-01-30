export enum LogLevel {
  INFO = "INFO",
  ERROR = "ERROR",
  DATA = "DATA",
  WARN = "WARN",
  DEBUG = "DEBUG",
}

export function log(level: LogLevel, ...messages: any[]): void {
  const time = new Date().toLocaleTimeString("fr-FR");
  const formattedMessage = messages
    .map((msg) =>
      typeof msg === "object" ? JSON.stringify(msg, null, 2) : msg,
    )
    .join(" ");

  console.log(`[${time}] [${level}] ${formattedMessage}`);
}
