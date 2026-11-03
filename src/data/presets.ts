import { AnalysisResult, SupportedLanguage } from '../types';

export interface PresetError {
  id: string;
  name: string;
  language: SupportedLanguage;
  badge: string;
  codeSnippet: string;
  errorMessage: string;
  result: AnalysisResult;
}

export const PRESET_ERRORS: PresetError[] = [
  {
    id: 'java-nullpointer',
    name: 'Java NullPointerException',
    language: 'java',
    badge: 'Most Common in Java',
    errorMessage: `Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.length()" because "user.getName()" is null
    at com.example.UserManager.printWelcome(UserManager.java:14)
    at com.example.Main.main(Main.java:6)`,
    codeSnippet: `public class UserManager {
    public void printWelcome(User user) {
        // We want to greet the user and show character count
        String name = user.getName();
        int charCount = name.length(); // 💥 CRASH HERE!
        
        System.out.println("Welcome, " + name.toUpperCase() + "!");
        System.out.println("Your name has " + charCount + " letters.");
    }
}`,
    result: {
      id: 'java-nullpointer',
      title: 'NullPointerException: Attempted to call a method on a non-existent object',
      language: 'java',
      errorType: 'NullPointerException',
      errorCategory: 'Null / Undefined',
      summary: 'You tried to run a method (`.length()`) on a variable (`name`) that does not point to any actual data in computer memory — it points to `null` (nothingness).',
      analogy: {
        title: 'The Ghost Address Envelope ✉️',
        story: 'Imagine writing a letter and sticking an address label on it that is completely blank. Then you tell a mail courier: "Please knock on the front door of this house and ask who lives there." The courier looks at the blank envelope in despair and yells: "There is no house here! Where do I knock?!" In Java, `null` is that blank label, and calling `.length()` is knocking on a non-existent front door.',
        icon: 'Ghost'
      },
      rootCause: {
        whyItFailed: '`user.getName()` returned `null` instead of an actual text string. Line 5 attempted to evaluate `name.length()`. In Java, you cannot access properties or invoke functions on `null`.',
        machineExpectation: 'The JVM expected `name` to hold a valid memory reference pointing to a `java.lang.String` instance containing a char array and metadata.',
        actualReality: 'The variable `name` contained literal `0x0` (null reference). Attempting to dereference it triggers an immediate hardware/JVM trap (NPE).',
        culpritLine: 5
      },
      originalCode: `public class UserManager {
    public void printWelcome(User user) {
        String name = user.getName();
        int charCount = name.length(); // 💥 NullPointerException
        
        System.out.println("Welcome, " + name.toUpperCase() + "!");
        System.out.println("Your name has " + charCount + " letters.");
    }
}`,
      errorMessage: `Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.length()" because "user.getName()" is null`,
      correctedCode: `public class UserManager {
    public void printWelcome(User user) {
        if (user == null) {
            System.out.println("Error: No user provided.");
            return;
        }

        String name = user.getName();
        // Guard check: provide safe fallback if name is null or blank
        if (name == null || name.trim().isEmpty()) {
            name = "Valued Guest";
        }
        
        int charCount = name.length();
        System.out.println("Welcome, " + name.toUpperCase() + "!");
        System.out.println("Your name has " + charCount + " letters.");
    }
}`,
      lineBreakdown: [
        {
          lineNumber: 3,
          newLine: 'if (user == null) { System.out.println("Error: No user provided."); return; }',
          action: 'added',
          explanation: 'Defensive check: Prevents an NPE if someone passes a completely null User object to the method.'
        },
        {
          lineNumber: 9,
          originalLine: 'int charCount = name.length();',
          newLine: 'if (name == null || name.trim().isEmpty()) { name = "Valued Guest"; }',
          action: 'modified',
          explanation: 'Null-guard with default fallback: If `getName()` returns null, we gracefully substitute a friendly default instead of letting the app crash.'
        },
        {
          lineNumber: 13,
          newLine: 'int charCount = name.length();',
          action: 'context',
          explanation: 'Now guaranteed safe: `name` is guaranteed non-null, so `.length()` and `.toUpperCase()` will never crash.'
        }
      ],
      preventionTips: [
        'Always check for `null` before calling methods on objects returned from external sources, databases, or API models.',
        'Use `Objects.requireNonNull(val, "Val cannot be null")` in constructors to fail fast with descriptive messages.',
        'Adopt Java 8+ `Optional<String>` for getters that might not return a value: `Optional.ofNullable(user.getName()).orElse("Guest")`.',
        'Use IDE annotations like `@NonNull` and `@Nullable` to get compile-time warnings before runtime.'
      ],
      challenge: {
        question: 'Which of the following lines will safely print the length of `String s` even if `s` happens to be null?',
        codeSnippet: `String s = getOptionalUsername();`,
        options: [
          'System.out.println(s.length());',
          'System.out.println(s != null ? s.length() : 0);',
          'System.out.println((String) null.length());',
          'System.out.println(s.equals(null) ? 0 : s.length());'
        ],
        correctOptionIndex: 1,
        explanation: '`s != null ? s.length() : 0` checks if `s` holds a valid reference first (short-circuit ternary). If `s` is null, it returns 0 without ever calling `.length()`. Option 4 crashes because calling `.equals()` on a null `s` also throws an NPE!',
        hint: 'You cannot call ANY method on `s` if `s` is null, not even `.equals()`!'
      },
      timestamp: Date.now()
    }
  },
  {
    id: 'python-indexerror',
    name: 'Python IndexError: list index out of range',
    language: 'python',
    badge: 'Classic Off-by-One',
    errorMessage: `Traceback (most recent call last):
  File "scores.py", line 6, in <module>
    print(f"Item {i}: {scores[i]}")
IndexError: list index out of range`,
    codeSnippet: `scores = [95, 88, 72, 91]

# Print each score with its position
for i in range(len(scores) + 1):
    print(f"Item {i}: {scores[i]}")`,
    result: {
      id: 'python-indexerror',
      title: 'IndexError: Requested an element outside the boundaries of the list',
      language: 'python',
      errorType: 'IndexError',
      errorCategory: 'Bounds & Indexing',
      summary: 'You asked Python for an item at index `4`, but Python lists are zero-indexed and this list only has items at indices 0, 1, 2, and 3.',
      analogy: {
        title: 'The 4-Story Hotel with Room Numbers Starting at 0 🏨',
        story: 'Imagine a hotel with 4 rooms on floor 1, labeled Room 0, Room 1, Room 2, and Room 3. If a tourist walks up to the desk and asks for the key to "Room 4", the clerk will say: "We have 4 rooms total, but our last room is Room 3! Room 4 does not exist!"',
        icon: 'Layers'
      },
      rootCause: {
        whyItFailed: '`range(len(scores) + 1)` produced numbers `0, 1, 2, 3, 4`. On iteration 4, Python evaluated `scores[4]`. Since the list only has 4 items (indices 0 to 3), Python threw `IndexError`.',
        machineExpectation: 'Indices must satisfy `0 <= index < len(list)`. For a 4-item list, valid indices are strictly 0, 1, 2, 3.',
        actualReality: 'Code attempted to read index 4, which exceeds the highest allocated slot.',
        culpritLine: 5
      },
      originalCode: `scores = [95, 88, 72, 91]

# Print each score with its position
for i in range(len(scores) + 1):
    print(f"Item {i}: {scores[i]}")`,
      errorMessage: `IndexError: list index out of range`,
      correctedCode: `scores = [95, 88, 72, 91]

# Pythonic way: use enumerate to get both index and value safely!
for i, score in enumerate(scores):
    print(f"Item {i}: {score}")`,
      lineBreakdown: [
        {
          lineNumber: 4,
          originalLine: 'for i in range(len(scores) + 1):',
          newLine: 'for i, score in enumerate(scores):',
          action: 'modified',
          explanation: 'Replaced manual range math with `enumerate(scores)`. This automatically binds index `i` and element `score` without off-by-one arithmetic.'
        },
        {
          lineNumber: 5,
          originalLine: 'print(f"Item {i}: {scores[i]}")',
          newLine: 'print(f"Item {i}: {score}")',
          action: 'modified',
          explanation: 'Directly use `score` instead of re-indexing `scores[i]`, eliminating any risk of out-of-bounds access.'
        }
      ],
      preventionTips: [
        'Prefer iterating directly over items: `for score in scores:` instead of indexing by range.',
        'When you need both index and item, use built-in `enumerate(scores)`.',
        'Remember Python is 0-indexed: a list of length N has valid positive indices `0` through `N-1`.',
        'Use negative indexing like `scores[-1]` safely when you just want the last item.'
      ],
      challenge: {
        question: 'Given `fruits = ["apple", "banana", "orange"]`, what is the output of `fruits[len(fruits)]`?',
        codeSnippet: `fruits = ["apple", "banana", "orange"]
print(fruits[len(fruits)])`,
        options: [
          '"orange"',
          'None',
          'IndexError: list index out of range',
          '3'
        ],
        correctOptionIndex: 2,
        explanation: '`len(fruits)` is 3. Since indexing starts at 0, the elements are at [0], [1], and [2]. Attempting `fruits[3]` crashes immediately with an `IndexError`. The last item is `fruits[len(fruits) - 1]` or `fruits[-1]`.',
        hint: 'Count the indices starting at 0: apple=0, banana=1, orange=2.'
      },
      timestamp: Date.now()
    }
  },
  {
    id: 'js-typeerror-undefined',
    name: 'JavaScript TypeError: Cannot read properties of undefined',
    language: 'javascript',
    badge: 'Top Frontend Bug',
    errorMessage: `Uncaught TypeError: Cannot read properties of undefined (reading 'map')
    at UserList (UserList.jsx:12:18)
    at renderWithHooks (react-dom.development.js:15486)
    at mountIndeterminateComponent (react-dom.development.js:20103)`,
    codeSnippet: `function UserList({ apiResponse }) {
  // apiResponse = { data: { users: undefined } } while loading
  const users = apiResponse.data.users;

  return (
    <ul>
      {users.map(u => ( // 💥 Uncaught TypeError!
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}`,
    result: {
      id: 'js-typeerror-undefined',
      title: 'TypeError: Attempted to call .map() on undefined',
      language: 'javascript',
      errorType: 'TypeError',
      errorCategory: 'Null / Undefined',
      summary: 'You called `.map()` on `users`, but at the moment this code executed, `users` was `undefined` rather than an Array.',
      analogy: {
        title: 'Opening an Empty Tool Bag 🧰',
        story: 'Imagine reaching into a tool bag that hasn\'t been delivered to the job site yet. You blindly instruct your assistant: "Hand me the wrench from inside the bag." But there is no bag on the table! The assistant freezes and says: "What bag? There\'s nothing here to reach into!" In JavaScript, `undefined` is the missing bag, and `.map()` is asking for tools inside it.',
        icon: 'HelpCircle'
      },
      rootCause: {
        whyItFailed: '`apiResponse.data.users` evaluated to `undefined` (likely because asynchronous data was still fetching). In JS, calling properties or methods on `undefined` or `null` triggers an unhandled TypeError.',
        machineExpectation: 'JavaScript expected `users` to evaluate to an iterable Object or Array inheriting from `Array.prototype`.',
        actualReality: 'The value was primitive `undefined`. It has no prototype or methods.',
        culpritLine: 7
      },
      originalCode: `function UserList({ apiResponse }) {
  const users = apiResponse.data.users;

  return (
    <ul>
      {users.map(u => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}`,
      errorMessage: `Uncaught TypeError: Cannot read properties of undefined (reading 'map')`,
      correctedCode: `function UserList({ apiResponse }) {
  // Safe extraction with optional chaining and fallback empty array
  const users = apiResponse?.data?.users ?? [];

  if (users.length === 0) {
    return <p className="text-muted">No users found or loading...</p>;
  }

  return (
    <ul>
      {users.map(u => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}`,
      lineBreakdown: [
        {
          lineNumber: 3,
          originalLine: 'const users = apiResponse.data.users;',
          newLine: 'const users = apiResponse?.data?.users ?? [];',
          action: 'modified',
          explanation: 'Optional chaining (`?.`) prevents crashing if `apiResponse` or `data` is missing, and the nullish coalescing operator (`?? []`) guarantees `users` is always a valid Array.'
        },
        {
          lineNumber: 5,
          newLine: 'if (users.length === 0) { return <p>No users found...</p>; }',
          action: 'added',
          explanation: 'Clear empty/loading state handling for a better user experience.'
        }
      ],
      preventionTips: [
        'Use Optional Chaining (`obj?.nested?.prop`) when accessing deep or asynchronous properties.',
        'Provide default fallback values using Nullish Coalescing: `const list = items ?? []`.',
        'In React, always guard against loading states before rendering array components.',
        'Check type contracts with TypeScript to catch undefined properties during compilation.'
      ],
      challenge: {
        question: 'What is the value of `user?.profile?.avatar ?? "default.png"` if `user` is `{ profile: null }`?',
        codeSnippet: `const user = { profile: null };
const avatar = user?.profile?.avatar ?? "default.png";`,
        options: [
          'Throws TypeError: Cannot read properties of null',
          'null',
          '"default.png"',
          'undefined'
        ],
        correctOptionIndex: 2,
        explanation: 'Because of optional chaining `?.`, `user?.profile?.avatar` short-circuits gracefully to `undefined`. Then `?? "default.png"` kicks in because the left side is undefined, returning the fallback `"default.png"`.',
        hint: 'Optional chaining prevents throws and converts null/undefined lookups into undefined.'
      },
      timestamp: Date.now()
    }
  },
  {
    id: 'python-indentation-error',
    name: 'Python IndentationError: unexpected indent',
    language: 'python',
    badge: 'Syntax Frustration',
    errorMessage: `  File "main.py", line 4
    total = price * 1.2
    ^
IndentationError: unexpected indent`,
    codeSnippet: `def calculate_bill(price, tax):
    subtotal = price + tax
        total = price * 1.2 # 💥 IndentationError
    return total`,
    result: {
      id: 'python-indentation-error',
      title: 'IndentationError: Python found unexpected whitespace before a statement',
      language: 'python',
      errorType: 'IndentationError',
      errorCategory: 'Syntax & Structure',
      summary: 'Python uses indentation levels (spaces) instead of curly braces `{}` to understand code blocks. You indented line 3 by 8 spaces when it should have been 4.',
      analogy: {
        title: 'The Staircase with a Missing Step 🪜',
        story: 'Imagine walking up a staircase where every step is exactly 4 inches high. Suddenly, the builder laid one step that is 12 inches high with no reason or ramp. You stumble! In Python, code blocks are strictly aligned steps. You can only indent deeper if you just opened a new block with a colon `:`.',
        icon: 'AlignLeft'
      },
      rootCause: {
        whyItFailed: 'Line 3 has extra spaces (8 spaces) compared to line 2 (4 spaces), but there was no compound statement (`if`, `for`, `def`) with a colon `:` preceding it to justify a new indentation block.',
        machineExpectation: 'Python parser expects statements at the same block level to have identical indentation widths.',
        actualReality: 'Line 3 indented 4 spaces further than its surrounding statements for no structural reason.',
        culpritLine: 3
      },
      originalCode: `def calculate_bill(price, tax):
    subtotal = price + tax
        total = price * 1.2
    return total`,
      errorMessage: `IndentationError: unexpected indent`,
      correctedCode: `def calculate_bill(price, tax):
    subtotal = price + tax
    total = subtotal * 1.2  # Aligned evenly at 4 spaces
    return total`,
      lineBreakdown: [
        {
          lineNumber: 3,
          originalLine: '        total = price * 1.2',
          newLine: '    total = subtotal * 1.2',
          action: 'modified',
          explanation: 'Aligned with line 2 (4 spaces from margin). Also used `subtotal` logically to calculate the bill.'
        }
      ],
      preventionTips: [
        'Configure your code editor to insert 4 spaces when you hit the Tab key ("Insert Spaces" / "Tab Size: 4").',
        'Never mix physical Tab characters (`\\t`) and Spaces in the same Python project.',
        'Enable "Render Whitespace" in VS Code or your IDE so invisible indent differences are visible.',
        'Use an auto-formatter like `black` or `ruff` to automatically enforce clean indentation.'
      ],
      challenge: {
        question: 'Which of the following Python snippets is valid indentation syntax?',
        codeSnippet: `Snippet A:
if True:
print("hello")

Snippet B:
if True:
    print("hello")
        print("world")

Snippet C:
if True:
    print("hello")
    print("world")`,
        options: [
          'Snippet A',
          'Snippet B',
          'Snippet C',
          'None of them'
        ],
        correctOptionIndex: 2,
        explanation: 'Snippet C is the only valid one: statements inside the `if` block are consistently indented at 4 spaces. Snippet A fails because it lacks indent after colon, and B has an unexpected indent on the second print.',
        hint: 'Statements at the same level inside a block must match indentation.'
      },
      timestamp: Date.now()
    }
  },
  {
    id: 'cpp-segfault',
    name: 'C++ Segmentation fault (core dumped)',
    language: 'cpp',
    badge: 'Memory Access Trap',
    errorMessage: `Segmentation fault (core dumped)
./main: line 8: 12431 Segmentation fault (core dumped) ./program`,
    codeSnippet: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers = {10, 20, 30};
    
    // Accessing index equal to size
    std::cout << numbers[numbers.size()] << std::endl; // 💥 CRASH!
    return 0;
}`,
    result: {
      id: 'cpp-segfault',
      title: 'Segmentation Fault: Attempted to read forbidden or unallocated memory',
      language: 'cpp',
      errorType: 'Segmentation Fault',
      errorCategory: 'Memory & Pointers',
      summary: 'Your program requested memory at `numbers[3]`, which is outside the vector\'s valid storage bounds. The operating system terminated your program immediately to protect memory integrity.',
      analogy: {
        title: 'Trespassing Past the Fence 🚧',
        story: 'Imagine you own 3 plots of land numbered 0, 1, and 2. Just beyond plot 2 is a high-security military zone. If you step your foot past the property line into zone 3, security guards immediately tackle you. In C++, memory outside your vector belongs to the OS or other processes; stepping onto it triggers a Segmentation Fault.',
        icon: 'ShieldAlert'
      },
      rootCause: {
        whyItFailed: '`numbers.size()` is 3. Since C++ vectors are 0-indexed, valid elements are `0`, `1`, and `2`. Accessing `numbers[3]` is undefined behavior (and frequently a segfault when hitting unmapped memory).',
        machineExpectation: 'Memory access must fall within pages mapped and allocated to the program\'s data segment.',
        actualReality: 'Pointer offset exceeded allocated buffer boundaries.',
        culpritLine: 8
      },
      originalCode: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers = {10, 20, 30};
    
    std::cout << numbers[numbers.size()] << std::endl;
    return 0;
}`,
      errorMessage: `Segmentation fault (core dumped)`,
      correctedCode: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers = {10, 20, 30};
    
    // Check non-empty and access last valid element
    if (!numbers.empty()) {
        std::cout << "Last element: " << numbers.back() << std::endl;
        // Or using bound-checked access: numbers.at(numbers.size() - 1);
    }
    return 0;
}`,
      lineBreakdown: [
        {
          lineNumber: 8,
          originalLine: 'std::cout << numbers[numbers.size()] << std::endl;',
          newLine: 'if (!numbers.empty()) { std::cout << numbers.back() << std::endl; }',
          action: 'modified',
          explanation: 'Used `.back()` to safely get the last element, guarded by `.empty()` to ensure the vector has at least one item.'
        }
      ],
      preventionTips: [
        'Use `numbers.at(i)` instead of `numbers[i]` during development because `.at()` throws a catchable `std::out_of_range` exception instead of segfaulting.',
        'Use `.front()` and `.back()` helper methods for first and last elements.',
        'Always check `!vec.empty()` before accessing elements.',
        'Compile with AddressSanitizer (`-fsanitize=address -g`) to pinpoint the exact line of memory violations.'
      ],
      challenge: {
        question: 'Which method on `std::vector` throws a `std::out_of_range` exception when an index is invalid?',
        codeSnippet: `std::vector<int> v = {1, 2, 3};`,
        options: [
          'v[10]',
          'v.at(10)',
          'v.get(10)',
          'v.index(10)'
        ],
        correctOptionIndex: 1,
        explanation: '`v.at(10)` performs bounds-checking and throws `std::out_of_range` if out of bounds. The bracket operator `v[10]` performs NO bounds checks for maximum performance, causing undefined behavior or segfaults.',
        hint: 'It is a 2-letter member function that does safe bounds checked lookup.'
      },
      timestamp: Date.now()
    }
  }
];
