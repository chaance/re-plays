const consoleError = console.error;

let consoleErrorLog: any[] = [];

beforeEach(() => {
  consoleErrorLog = [];
  console.error = (...args: any[]) => {
    consoleErrorLog.push(`console.error called with args: ${args}`);
    consoleError.apply(console, args as any);
  };
});

afterEach(() => {
  if (consoleErrorLog.length > 0) {
    throw consoleErrorLog[0];
  }
  console.error = consoleError;
});
