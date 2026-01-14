export interface SubQuestion {
  label: string;
  code: string;
  correctAnswer: string;
}

export interface Question {
  id: number;
  type: 'exception' | 'bigo' | 'matching' | 'truefalse' | 'shortanswer' | 'code';
  title: string;
  content: string;
  code?: string;
  subQuestions?: SubQuestion[];
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
}

export const questions: Question[] = [
  {
    id: 1,
    type: 'bigo',
    title: 'Exception Handling',
    content: 'Consider the following Java code. What output would be printed?',
    code: `public static int puzzle(int[] arr, int index) {
    System.out.println("Start");
    try {
        int value = arr[index];
        System.out.println("Got value");
        return value * 2;
    }
    catch(NullPointerException e) {
        System.out.println("Null");
        return -1;
    }
    catch(ArrayIndexOutOfBoundsException e) {
        System.out.println("OutOfBounds");
        return -2;
    }
    finally {
        System.out.println("End");
    }
}

public static void main(String[] args) {
    int[] nums = {10, 20, 30};
    System.out.println(puzzle(nums, 1));
    System.out.println(puzzle(nums, 5));
}`,
    options: [
      'Start\nGot value\nEnd\n40\nStart\nOutOfBounds\nEnd\n-2',
      'Start\nGot value\n40\nStart\nOutOfBounds\n-2',
      'Start\nGot value\nEnd\n20\nStart\nOutOfBounds\nEnd\n-2',
      'Start\nGot value\nEnd\n40\nStart\nNull\nEnd\n-1',
      'Start\nGot value\nEnd\n40\nStart\nOutOfBounds\nEnd\n-1'
    ],
    correctAnswer: 'A',
    explanation: `First call puzzle(nums, 1):
- Prints "Start"
- Accesses valid index 1 (value = 20)
- Prints "Got value"
- Returns 20 * 2 = 40
- Finally block prints "End"
- Main prints 40

Second call puzzle(nums, 5):
- Prints "Start"
- Index 5 is out of bounds (array length is 3)
- Throws ArrayIndexOutOfBoundsException
- Catches exception, prints "OutOfBounds", returns -2
- Finally block prints "End"
- Main prints -2`
  },
  {
    id: 2,
    type: 'bigo',
    title: 'Exception Handling with Multiple Errors',
    content: 'Consider the following code. Using the same puzzle method from Question 1, what output would be printed?',
    code: `public static int puzzle(int[] arr, int index) {
    System.out.println("Start");
    try {
        int value = arr[index];
        System.out.println("Got value");
        return value * 2;
    }
    catch(NullPointerException e) {
        System.out.println("Null");
        return -1;
    }
    catch(ArrayIndexOutOfBoundsException e) {
        System.out.println("OutOfBounds");
        return -2;
    }
    finally {
        System.out.println("End");
    }
}

public static void main(String[] args) {
    int[] data = {5, 10, 15};
    System.out.println(puzzle(null, 2));
}`,
    options: [
      'Start\nNull\nEnd\n-1',
      'Start\nOutOfBounds\nEnd\n-2',
      'Start\nNull\n-1',
      'Start\nOutOfBounds\n-2',
      'Null\n-1'
    ],
    correctAnswer: 'A',
    explanation: `Array data is null
- Prints "Start"
- Attempting to access arr[index] on null throws NullPointerException
- Catches NullPointerException first (before checking index), prints "Null", returns -1
- Finally block prints "End"
- Main prints -1`
  },
  {
    id: 3,
    type: 'bigo',
    title: 'Big-O Notation Analysis',
    content: 'For each of the following methods, select the O Notation classification that best describes its runtime.',
    code: '',
    subQuestions: [
      {
        label: 'Method A',
        code: `public static boolean contains(int[] arr, int target) {
    for(int i = 0; i < arr.length; i++) {
        if(arr[i] == target) {
            return true;
        }
    }
    return false;
}`,
        correctAnswer: 'B'
      },
      {
        label: 'Method B',
        code: `public static int getMax(int a, int b, int c) {
    int max = a;
    if(b > max) {
        max = b;
    }
    if(c > max) {
        max = c;
    }
    return max;
}`,
        correctAnswer: 'A'
      },
      {
        label: 'Method C',
        code: `public static void printPairs(int[] arr) {
    for(int i = 0; i < arr.length; i++) {
        for(int j = 0; j < arr.length; j++) {
            System.out.println(arr[i] + ", " + arr[j]);
        }
    }
}`,
        correctAnswer: 'C'
      },
      {
        label: 'Method D',
        code: `public static void mystery(int n) {
    for(int i = 0; i < n; i++) {
        System.out.println(i);
    }
    for(int j = 0; j < n; j++) {
        System.out.println(j);
    }
}`,
        correctAnswer: 'B'
      }
    ],
    options: ['O(1)', 'O(N)', 'O(N²)', 'O(log N)', 'O(2^N)'],
    correctAnswer: ['B', 'A', 'C', 'B'],
    explanation: `Method A: B. O(N) - Single loop through array, worst case checks all elements
Method B: A. O(1) - Only comparison operations, no loops, constant time
Method C: C. O(N²) - Nested loops both iterate through entire array: n × n
Method D: B. O(N) - Two separate loops each run n times: n + n = 2n = O(N)`
  },
  {
    id: 4,
    type: 'bigo',
    title: 'Big-O Notation Analysis (Additional Methods)',
    content: 'For each of the following methods, select the O Notation classification that best describes its runtime.',
    code: '',
    subQuestions: [
      {
        label: 'Method F',
        code: `public static void printSquare(int n) {
    for(int row = 0; row < n; row++) {
        for(int col = 0; col < n; col++) {
            System.out.print("X");
        }
        System.out.println();
    }
}`,
        correctAnswer: 'C'
      },
      {
        label: 'Method G',
        code: `public static int lastElement(int[] arr) {
    return arr[arr.length - 1];
}`,
        correctAnswer: 'A'
      },
      {
        label: 'Method H',
        code: `public static void halvingLoop(int n) {
    while(n > 1) {
        System.out.println(n);
        n = n / 2;
    }
}`,
        correctAnswer: 'D'
      }
    ],
    options: ['O(1)', 'O(N)', 'O(N²)', 'O(log N)'],
    correctAnswer: ['C', 'A', 'D'],
    explanation: `Method F: C. O(N²) - Nested loops both iterate n times
Method G: A. O(1) - Direct array access, constant time regardless of array size
Method H: B. O(log N) - Loop divides n by 2 each iteration (logarithmic), runs log₂(n) times`
  },
  {
    id: 5,
    type: 'matching',
    title: 'Exception Types',
    content: 'Match each scenario with the exception type most likely to be thrown:',
    code: '',
    subQuestions: [
      {
        label: 'Attempting to call a method on an object that hasn\'t been initialized',
        code: '',
        correctAnswer: 'D'
      },
      {
        label: 'Passing a negative number to a method that requires positive values',
        code: '',
        correctAnswer: 'C'
      },
      {
        label: 'Trying to access index -1 of an array',
        code: '',
        correctAnswer: 'B'
      },
      {
        label: 'Attempting to parse "hello" as an integer using Integer.parseInt()',
        code: '',
        correctAnswer: 'A'
      }
    ],
    options: ['A. NumberFormatException', 'B. ArrayIndexOutOfBoundsException', 'C. IllegalArgumentException', 'D. NullPointerException'],
    correctAnswer: ['D', 'C', 'B', 'A'],
    explanation: `D - Attempting to call a method on an object that hasn't been initialized - NullPointerException
C - Passing a negative number to a method that requires positive values - IllegalArgumentException
B - Trying to access index -1 of an array - ArrayIndexOutOfBoundsException
A - Attempting to parse "hello" as an integer using Integer.parseInt() - NumberFormatException`
  },
  {
    id: 6,
    type: 'truefalse',
    title: 'Exception Handling - True or False',
    content: 'Circle T for True or F for False:',
    code: '',
    subQuestions: [
      {
        label: 'You can have a try block without a catch block if you have a finally block.',
        code: '',
        correctAnswer: 'T'
      },
      {
        label: 'When multiple exceptions could occur, the most general exception should be caught first.',
        code: '',
        correctAnswer: 'F'
      },
      {
        label: 'The finally block will execute even if there is a return statement in the catch block.',
        code: '',
        correctAnswer: 'T'
      },
      {
        label: 'An O(N) algorithm will always run faster than an O(N²) algorithm for any input size.',
        code: '',
        correctAnswer: 'F'
      },
      {
        label: 'Constants and lower-order terms are ignored in Big-O notation.',
        code: '',
        correctAnswer: 'T'
      }
    ],
    options: ['T', 'F'],
    correctAnswer: ['T', 'F', 'T', 'F', 'T'],
    explanation: `T - You can have a try block without a catch block if you have a finally block. (try-finally is valid syntax)
F - When multiple exceptions could occur, the most general exception should be caught first. (More specific exceptions must be caught first)
T - The finally block will execute even if there is a return statement in the catch block.
F - An O(N) algorithm will always run faster than an O(N²) algorithm for any input size. (For very small n, O(N²) might be faster due to constants)
T - Constants and lower-order terms are ignored in Big-O notation. (We drop constants and keep only the dominant term)`
  },
  {
    id: 9,
    type: 'bigo',
    title: 'Code Tracing - Exceptions',
    content: 'What would be printed by the following code?',
    code: `public static void process(String str) {
    try {
        System.out.println("A");
        int len = str.length();
        System.out.println("B");
        char first = str.charAt(0);
        System.out.println("C");
    }
    catch(NullPointerException e) {
        System.out.println("D");
    }
    finally {
        System.out.println("E");
    }
}

public static void main(String[] args) {
    process("Hello");
    process(null);
}`,
    options: [
      'A\nB\nC\nE\nA\nD\nE',
      'A\nB\nC\nA\nD\nE',
      'A\nB\nC\nE\nA\nD',
      'A\nB\nC\nD\nE\nA\nD\nE',
      'A\nB\nC\nE\nD\nE'
    ],
    correctAnswer: 'A',
    explanation: `First call process("Hello"):
- Prints "A", "B", "C" (no exception)
- Finally prints "E"

Second call process(null):
- Prints "A"
- Calling str.length() on null throws NullPointerException
- Catches exception, prints "D"
- Finally prints "E"`
  },
  {
    id: 11,
    type: 'bigo',
    title: 'Big-O Comparison',
    content: 'Rank the following Big-O complexities from fastest to slowest (1 = fastest, 5 = slowest):',
    code: '',
    subQuestions: [
      {
        label: 'O(N²)',
        code: '',
        correctAnswer: '4'
      },
      {
        label: 'O(1)',
        code: '',
        correctAnswer: '1'
      },
      {
        label: 'O(N log N)',
        code: '',
        correctAnswer: '3'
      },
      {
        label: 'O(N)',
        code: '',
        correctAnswer: '2'
      },
      {
        label: 'O(2^N)',
        code: '',
        correctAnswer: '5'
      }
    ],
    options: ['1', '2', '3', '4', '5'],
    correctAnswer: ['4', '1', '3', '2', '5'],
    explanation: `Ranking from fastest to slowest:
1. O(1) - Constant
2. O(N) - Linear
3. O(N log N) - Linearithmic
4. O(N²) - Quadratic
5. O(2^N) - Exponential`
  }
];
