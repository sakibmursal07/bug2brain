import { AnalysisResult, SupportedLanguage } from '../types';

export interface TerminalExecution {
  command: string;
  output: string;
  exitCode: number;
  isError: boolean;
  executionTimeMs: number;
}

export function simulateCodeExecution(
  code: string,
  language: SupportedLanguage,
  isCorrected: boolean,
  analysis?: AnalysisResult | null
): TerminalExecution {
  const startTime = performance.now();

  const getRunCommand = (lang: SupportedLanguage, isFix: boolean) => {
    switch (lang) {
      case 'java':
        return isFix ? '$ javac Solution.java && java Solution' : '$ javac Main.java && java Main';
      case 'python':
        return isFix ? '$ python solution.py' : '$ python app.py';
      case 'javascript':
        return isFix ? '$ node solution.js' : '$ node index.js';
      case 'typescript':
        return isFix ? '$ bun run solution.ts' : '$ bun run app.ts';
      case 'cpp':
        return isFix ? '$ g++ -O2 solution.cpp -o solution && ./solution' : '$ g++ -O2 main.cpp -o main && ./main';
      case 'go':
        return isFix ? '$ go run solution.go' : '$ go run main.go';
      case 'rust':
        return isFix ? '$ cargo run --release' : '$ cargo run';
      case 'csharp':
        return isFix ? '$ dotnet run --configuration Release' : '$ dotnet run';
      default:
        return '$ run code';
    }
  };

  if (!isCorrected) {
    // Generate realistic runtime crash output based on analysis result or heuristic
    const errText = analysis?.errorMessage || 
      (language === 'java' 
        ? `Exception in thread "main" java.lang.NullPointerException: Cannot invoke method because reference is null\n\tat com.example.App.main(App.java:${analysis?.rootCause.culpritLine || 5})`
        : language === 'python'
        ? `Traceback (most recent call last):\n  File "app.py", line ${analysis?.rootCause.culpritLine || 4}, in <module>\nIndexError: list index out of range`
        : language === 'javascript'
        ? `TypeError: Cannot read properties of undefined (reading 'property')\n    at Object.<anonymous> (/app/index.js:${analysis?.rootCause.culpritLine || 3}:12)`
        : `[RUNTIME CRASH] Process terminated with status code 139 (SIGSEGV). Memory address violation.`);

    return {
      command: getRunCommand(language, false),
      output: errText,
      exitCode: 1,
      isError: true,
      executionTimeMs: Math.floor(Math.random() * 40) + 20
    };
  }

  // Corrected output simulation
  let cleanOutput = '';
  switch (language) {
    case 'java':
      cleanOutput = `Compiling Solution.java... Done in 0.18s.\n[STDOUT] Welcome, VALUED GUEST!\n[STDOUT] Your name has 12 letters.\n\nProcess finished with exit code 0 (Success).`;
      break;
    case 'python':
      cleanOutput = `[STDOUT] Item 0: 95\n[STDOUT] Item 1: 88\n[STDOUT] Item 2: 72\n[STDOUT] Item 3: 91\n\nProcess finished with exit code 0 (Success).`;
      break;
    case 'javascript':
    case 'typescript':
      cleanOutput = `[STDOUT] Rendered 0 initial items safely (no null pointer exception).\n[STDOUT] State update scheduled. App healthy.\n\nProcess finished with exit code 0 (Success).`;
      break;
    case 'cpp':
      cleanOutput = `Compiling with -O2... Done.\n[STDOUT] Last element safely retrieved: 30\n[STDOUT] Vector bounds respected.\n\nProcess finished with exit code 0 (Success).`;
      break;
    default:
      cleanOutput = `[STDOUT] Program executed safely with guard conditions.\n\nProcess finished with exit code 0 (Success).`;
  }

  return {
    command: getRunCommand(language, true),
    output: cleanOutput,
    exitCode: 0,
    isError: false,
    executionTimeMs: Math.floor(Math.random() * 50) + 15
  };
}
