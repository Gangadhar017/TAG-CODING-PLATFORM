import mongoose from "mongoose";
import { Problem } from "./src/models/problem.model.js";
import { DB_NAME } from "./src/constants.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const sampleProblems = [
  {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    difficulty: "easy",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    example_cases: [
      {
        input: "2 7 11 15\n9",
        output: "0 1",
        explanation: "Because nums[0] + nums[1] == 9, we return 0 1."
      }
    ],
    test_cases: [
      { input: "2 7 11 15\n9", output: "0 1" },
      { input: "3 2 4\n6", output: "1 2" }
    ],
    solution: {
      c: `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    *returnSize = 2;
    int* result = (int*)malloc(2 * sizeof(int));
    for(int i = 0; i < numsSize; i++) {
        for(int j = i + 1; j < numsSize; j++) {
            if(nums[i] + nums[j] == target) {
                result[0] = i;
                result[1] = j;
                return result;
            }
        }
    }
    return result;
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        for(int i = 0; i < nums.size(); i++) {
            for(int j = i + 1; j < nums.size(); j++) {
                if(nums[i] + nums[j] == target) {
                    return {i, j};
                }
            }
        }
        return {};
    }
};`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        for(int i = 0; i < nums.length; i++) {
            for(int j = i + 1; j < nums.length; j++) {
                if(nums[i] + nums[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return new int[]{};
    }
}`,
      python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] + nums[j] == target:
                    return [i, j]
        return []`
    },
    input_format: "First line contains space-separated integers nums. Second line contains integer target.",
    output_format: "Space-separated indices of the two numbers."
  },

  {
    title: "Reverse String",
    description: "Write a function that reverses a string. The input string is given as a string of characters s.",
    difficulty: "easy",
    constraints: [
      "1 <= s.length <= 10^5",
      "s consists of printable ASCII characters."
    ],
    example_cases: [
      {
        input: "hello",
        output: "olleh",
        explanation: "The string is reversed in place."
      }
    ],
    test_cases: [
      { input: "hello", output: "olleh" },
      { input: "Hannah", output: "hannaH" }
    ],
    solution: {
      c: `void reverseString(char* s, int sSize) {
    int left = 0, right = sSize - 1;
    while(left < right) {
        char temp = s[left];
        s[left] = s[right];
        s[right] = temp;
        left++;
        right--;
    }
}`,
      cpp: `class Solution {
public:
    void reverseString(vector<char>& s) {
        reverse(s.begin(), s.end());
    }
};`,
      java: `class Solution {
    public void reverseString(char[] s) {
        int left = 0, right = s.length - 1;
        while(left < right) {
            char temp = s[left];
            s[left] = s[right];
            s[right] = temp;
            left++;
            right--;
        }
    }
}`,
      python: `class Solution:
    def reverseString(self, s: List[str]) -> None:
        s.reverse()`
    },
    input_format: "A single string of characters s.",
    output_format: "Reversed string of characters."
  },

  {
    title: "Valid Parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    difficulty: "easy",
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    example_cases: [
      { input: "()", output: "true", explanation: "The string is valid." },
      { input: "()[]{}", output: "true", explanation: "The string is valid." }
    ],
    test_cases: [
      { input: "()", output: "true" },
      { input: "()[]{}", output: "true" },
      { input: "(]", output: "false" }
    ],
    solution: {
      c: `bool isValid(char* s) {
    int len = strlen(s);
    char stack[10000];
    int top = -1;
    for(int i = 0; i < len; i++) {
        if(s[i] == '(' || s[i] == '{' || s[i] == '[') {
            stack[++top] = s[i];
        } else {
            if(top == -1) return false;
            if((s[i] == ')' && stack[top] != '(') ||
               (s[i] == '}' && stack[top] != '{') ||
               (s[i] == ']' && stack[top] != '[')) {
                return false;
            }
            top--;
        }
    }
    return top == -1;
}`,
      cpp: `class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for(char c : s) {
            if(c == '(' || c == '{' || c == '[') {
                st.push(c);
            } else {
                if(st.empty()) return false;
                if((c == ')' && st.top() != '(') ||
                   (c == '}' && st.top() != '{') ||
                   (c == ']' && st.top() != '[')) {
                    return false;
                }
                st.pop();
            }
        }
        return st.empty();
    }
};`,
      java: `class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for(char c : s.toCharArray()) {
            if(c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } else {
                if(stack.isEmpty()) return false;
                if((c == ')' && stack.peek() != '(') ||
                   (c == '}' && stack.peek() != '{') ||
                   (c == ']' && stack.peek() != '[')) {
                    return false;
                }
                stack.pop();
            }
        }
        return stack.isEmpty();
    }
}`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {')': '(', '}': '{', ']': '['}
        for char in s:
            if char in mapping:
                if not stack or stack[-1] != mapping[char]:
                    return False
                stack.pop()
            else:
                stack.append(char)
        return not stack`
    },
    input_format: "String s containing parentheses.",
    output_format: "true if valid, false otherwise."
  },

  {
    title: "Palindrome Number",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise.",
    difficulty: "easy",
    constraints: [
      "-2^31 <= x <= 2^31 - 1"
    ],
    example_cases: [
      { input: "121", output: "true", explanation: "121 reads as 121 from left to right and from right to left." },
      { input: "-121", output: "false", explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome." }
    ],
    test_cases: [
      { input: "121", output: "true" },
      { input: "-121", output: "false" },
      { input: "10", output: "false" }
    ],
    solution: {
      c: `bool isPalindrome(int x) {
    if (x < 0 || (x % 10 == 0 && x != 0)) return false;
    int revertedNumber = 0;
    while (x > revertedNumber) {
        revertedNumber = revertedNumber * 10 + x % 10;
        x /= 10;
    }
    return x == revertedNumber || x == revertedNumber / 10;
}`,
      cpp: `class Solution {
public:
    bool isPalindrome(int x) {
        if (x < 0 || (x % 10 == 0 && x != 0)) return false;
        int revertedNumber = 0;
        while (x > revertedNumber) {
            revertedNumber = revertedNumber * 10 + x % 10;
            x /= 10;
        }
        return x == revertedNumber || x == revertedNumber / 10;
    }
};`,
      java: `class Solution {
    public boolean isPalindrome(int x) {
        if (x < 0 || (x % 10 == 0 && x != 0)) return false;
        int revertedNumber = 0;
        while (x > revertedNumber) {
            revertedNumber = revertedNumber * 10 + x % 10;
            x /= 10;
        }
        return x == revertedNumber || x == revertedNumber / 10;
    }
}`,
      python: `class Solution:
    def isPalindrome(self, x: int) -> bool:
        if x < 0:
            return False
        return str(x) == str(x)[::-1]`
    },
    input_format: "A single integer x.",
    output_format: "true if x is a palindrome, false otherwise."
  },

  {
    title: "Fibonacci Number",
    description: "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. Given n, calculate F(n).",
    difficulty: "easy",
    constraints: [
      "0 <= n <= 30"
    ],
    example_cases: [
      { input: "2", output: "1", explanation: "F(2) = F(1) + F(0) = 1 + 0 = 1." },
      { input: "3", output: "2", explanation: "F(3) = F(2) + F(1) = 1 + 1 = 2." }
    ],
    test_cases: [
      { input: "2", output: "1" },
      { input: "3", output: "2" },
      { input: "4", output: "3" },
      { input: "6", output: "8" }
    ],
    solution: {
      c: `int fib(int n) {
    if (n <= 1) return n;
    int a = 0, b = 1, temp;
    for (int i = 2; i <= n; i++) {
        temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}`,
      cpp: `class Solution {
public:
    int fib(int n) {
        if (n <= 1) return n;
        int a = 0, b = 1, temp;
        for (int i = 2; i <= n; i++) {
            temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    }
};`,
      java: `class Solution {
    public int fib(int n) {
        if (n <= 1) return n;
        int a = 0, b = 1, temp;
        for (int i = 2; i <= n; i++) {
            temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    }
}`,
      python: `class Solution:
    def fib(self, n: int) -> int:
        if n <= 1:
            return n
        a, b = 0, 1
        for _ in range(2, n + 1):
            a, b = b, a + b
        return b`
    },
    input_format: "A single integer n.",
    output_format: "The n-th Fibonacci number."
  },

  {
    title: "Valid Anagram",
    description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    difficulty: "easy",
    constraints: [
      "1 <= s.length, t.length <= 5 * 10^4",
      "s and t consist of lowercase English letters."
    ],
    example_cases: [
      { input: "anagram\nnagaram", output: "true", explanation: "All letters in anagram match exactly in nagaram." }
    ],
    test_cases: [
      { input: "anagram\nnagaram", output: "true" },
      { input: "rat\ncar", output: "false" }
    ],
    solution: {
      c: `bool isAnagram(char* s, char* t) {
    if (strlen(s) != strlen(t)) return false;
    int counts[26] = {0};
    for (int i = 0; s[i] != '\\0'; i++) {
        counts[s[i] - 'a']++;
        counts[t[i] - 'a']--;
    }
    for (int i = 0; i < 26; i++) {
        if (counts[i] != 0) return false;
    }
    return true;
}`,
      cpp: `class Solution {
public:
    bool isAnagram(string s, string t) {
        if (s.length() != t.length()) return false;
        int counts[26] = {0};
        for (int i = 0; i < s.length(); i++) {
            counts[s[i] - 'a']++;
            counts[t[i] - 'a']--;
        }
        for (int i = 0; i < 26; i++) {
            if (counts[i] != 0) return false;
        }
        return true;
    }
};`,
      java: `class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] counts = new int[26];
        for (int i = 0; i < s.length(); i++) {
            counts[s.charAt(i) - 'a']++;
            counts[t.charAt(i) - 'a']--;
        }
        for (int count : counts) {
            if (count != 0) return false;
        }
        return true;
    }
}`,
      python: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        return sorted(s) == sorted(t)`
    },
    input_format: "First line contains string s. Second line contains string t.",
    output_format: "true if t is an anagram of s, false otherwise."
  },

  {
    title: "Binary Search",
    description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.",
    difficulty: "easy",
    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order."
    ],
    example_cases: [
      { input: "-1 0 3 5 9 12\n9", output: "4", explanation: "9 exists in nums and its index is 4." },
      { input: "-1 0 3 5 9 12\n2", output: "-1", explanation: "2 does not exist in nums so return -1." }
    ],
    test_cases: [
      { input: "-1 0 3 5 9 12\n9", output: "4" },
      { input: "-1 0 3 5 9 12\n2", output: "-1" }
    ],
    solution: {
      c: `int search(int* nums, int numsSize, int target) {
    int pivot, left = 0, right = numsSize - 1;
    while (left <= right) {
        pivot = left + (right - left) / 2;
        if (nums[pivot] == target) return pivot;
        if (target < nums[pivot]) right = pivot - 1;
        else left = pivot + 1;
    }
    return -1;
}`,
      cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        int pivot, left = 0, right = nums.size() - 1;
        while (left <= right) {
            pivot = left + (right - left) / 2;
            if (nums[pivot] == target) return pivot;
            if (target < nums[pivot]) right = pivot - 1;
            else left = pivot + 1;
        }
        return -1;
    }
};`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        int pivot, left = 0, right = nums.length - 1;
        while (left <= right) {
            pivot = left + (right - left) / 2;
            if (nums[pivot] == target) return pivot;
            if (target < nums[pivot]) right = pivot - 1;
            else left = pivot + 1;
        }
        return -1;
    }
}`,
      python: `class Solution:
    def search(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return -1`
    },
    input_format: "First line contains space-separated integers sorted ascending. Second line contains target integer.",
    output_format: "The target integer index, or -1."
  },

  {
    title: "Single Number",
    description: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.",
    difficulty: "easy",
    constraints: [
      "1 <= nums.length <= 3 * 10^4",
      "-3 * 10^4 <= nums[i] <= 3 * 10^4",
      "Each element in the array appears twice except for one element which appears only once."
    ],
    example_cases: [
      { input: "2 2 1", output: "1", explanation: "1 appears once." },
      { input: "4 1 2 1 2", output: "4", explanation: "4 appears once." }
    ],
    test_cases: [
      { input: "2 2 1", output: "1" },
      { input: "4 1 2 1 2", output: "4" },
      { input: "1", output: "1" }
    ],
    solution: {
      c: `int singleNumber(int* nums, int numsSize) {
    int a = 0;
    for (int i = 0; i < numsSize; i++) {
        a ^= nums[i];
    }
    return a;
}`,
      cpp: `class Solution {
public:
    int singleNumber(vector<int>& nums) {
        int a = 0;
        for (int x : nums) {
            a ^= x;
        }
        return a;
    }
};`,
      java: `class Solution {
    public int singleNumber(int[] nums) {
        int a = 0;
        for (int x : nums) {
            a ^= x;
        }
        return a;
    }
}`,
      python: `class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        a = 0
        for x in nums:
            a ^= x
        return a`
    },
    input_format: "First line contains space-separated integers nums.",
    output_format: "The integer appearing only once."
  },

  {
    title: "Search Insert Position",
    description: "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order. You must write an algorithm with O(log n) runtime complexity.",
    difficulty: "easy",
    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^4 <= nums[i] <= 10^4",
      "nums contains distinct values sorted in ascending order.",
      "-10^4 <= target <= 10^4"
    ],
    example_cases: [
      { input: "1 3 5 6\n5", output: "2", explanation: "5 is found at index 2." },
      { input: "1 3 5 6\n2", output: "1", explanation: "2 is not present, it would be inserted at index 1 to maintain sorted order." }
    ],
    test_cases: [
      { input: "1 3 5 6\n5", output: "2" },
      { input: "1 3 5 6\n2", output: "1" },
      { input: "1 3 5 6\n7", output: "4" }
    ],
    solution: {
      c: `int searchInsert(int* nums, int numsSize, int target) {
    int left = 0, right = numsSize - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return left;
}`,
      cpp: `class Solution {
public:
    int searchInsert(vector<int>& nums, int target) {
        int left = 0, right = nums.size() - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return left;
    }
};`,
      java: `class Solution {
    public int searchInsert(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return left;
    }
}`,
      python: `class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return left`
    },
    input_format: "First line contains space-separated distinct integers nums. Second line contains target integer.",
    output_format: "Index of the found or insert position."
  },

  {
    title: "Power of Two",
    description: "Given an integer n, return true if it is a power of two. Otherwise, return false. An integer n is a power of two if there exists an integer x such that n == 2^x.",
    difficulty: "easy",
    constraints: [
      "-2^31 <= n <= 2^31 - 1"
    ],
    example_cases: [
      { input: "1", output: "true", explanation: "2^0 = 1" },
      { input: "16", output: "true", explanation: "2^4 = 16" },
      { input: "3", output: "false", explanation: "3 is not a power of two." }
    ],
    test_cases: [
      { input: "1", output: "true" },
      { input: "16", output: "true" },
      { input: "3", output: "false" },
      { input: "8", output: "true" }
    ],
    solution: {
      c: `bool isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}`,
      cpp: `class Solution {
public:
    bool isPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0;
    }
};`,
      java: `class Solution {
    public boolean isPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0;
    }
}`,
      python: `class Solution:
    def isPowerOfTwo(self, n: int) -> bool:
        return n > 0 and (n & (n - 1)) == 0`
    },
    input_format: "A single integer n.",
    output_format: "true if n is a power of two, false otherwise."
  },

  {
    title: "Length of Last Word",
    description: "Given a string s consisting of words and spaces, return the length of the last word in the string. A word is a maximal substring consisting of non-space characters only.",
    difficulty: "easy",
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of only English letters and spaces ' '.",
      "There will be at least one word in s."
    ],
    example_cases: [
      { input: "Hello World", output: "5", explanation: "The last word is 'World' with length 5." },
      { input: "   fly me   to   the moon  ", output: "4", explanation: "The last word is 'moon' with length 4." }
    ],
    test_cases: [
      { input: "Hello World", output: "5" },
      { input: "   fly me   to   the moon  ", output: "4" }
    ],
    solution: {
      c: `int lengthOfLastWord(char* s) {
    int len = 0;
    int tail = strlen(s) - 1;
    while (tail >= 0 && s[tail] == ' ') tail--;
    while (tail >= 0 && s[tail] != ' ') {
        len++;
        tail--;
    }
    return len;
}`,
      cpp: `class Solution {
public:
    int lengthOfLastWord(string s) {
        int len = 0;
        int tail = s.length() - 1;
        while (tail >= 0 && s[tail] == ' ') tail--;
        while (tail >= 0 && s[tail] != ' ') {
            len++;
            tail--;
        }
        return len;
    }
};`,
      java: `class Solution {
    public int lengthOfLastWord(String s) {
        int len = 0;
        int tail = s.length() - 1;
        while (tail >= 0 && s.charAt(tail) == ' ') tail--;
        while (tail >= 0 && s.charAt(tail) != ' ') {
            len++;
            tail--;
        }
        return len;
    }
}`,
      python: `class Solution:
    def lengthOfLastWord(self, s: str) -> int:
        return len(s.strip().split()[-1])`
    },
    input_format: "A single line containing a string s with words and spaces.",
    output_format: "The length of the last word."
  },

  {
    title: "Find the Difference",
    description: "You are given two strings s and t. String t is generated by random shuffling string s and then adding one more letter at a random position. Return the letter that was added to t.",
    difficulty: "easy",
    constraints: [
      "0 <= s.length <= 1000",
      "t.length == s.length + 1",
      "s and t consist of lowercase English letters."
    ],
    example_cases: [
      { input: "abcd\nabcde", output: "e", explanation: "'e' is the letter that was added." }
    ],
    test_cases: [
      { input: "abcd\nabcde", output: "e" },
      { input: "\ny", output: "y" }
    ],
    solution: {
      c: `char findTheDifference(char* s, char* t) {
    char c = 0;
    for (int i = 0; s[i] != '\\0'; i++) c ^= s[i];
    for (int i = 0; t[i] != '\\0'; i++) c ^= t[i];
    return c;
}`,
      cpp: `class Solution {
public:
    char findTheDifference(string s, string t) {
        char c = 0;
        for (char x : s) c ^= x;
        for (char x : t) c ^= x;
        return c;
    }
};`,
      java: `class Solution {
    public char findTheDifference(String s, String t) {
        char c = 0;
        for (char x : s.toCharArray()) c ^= x;
        for (char x : t.toCharArray()) c ^= x;
        return c;
    }
}`,
      python: `class Solution:
    def findTheDifference(self, s: str, t: str) -> str:
        c = 0
        for x in s: c ^= ord(x)
        for x in t: c ^= ord(x)
        return chr(c)`
    },
    input_format: "First line contains string s. Second line contains string t.",
    output_format: "The added character."
  },

  {
    title: "Climbing Stairs",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    difficulty: "easy",
    constraints: [
      "1 <= n <= 45"
    ],
    example_cases: [
      { input: "2", output: "2", explanation: "There are two ways: 1 step + 1 step, or 2 steps." },
      { input: "3", output: "3", explanation: "There are three ways: 1+1+1, 1+2, or 2+1." }
    ],
    test_cases: [
      { input: "2", output: "2" },
      { input: "3", output: "3" },
      { input: "4", output: "5" }
    ],
    solution: {
      c: `int climbStairs(int n) {
    if (n <= 2) return n;
    int first = 1, second = 2, third;
    for (int i = 3; i <= n; i++) {
        third = first + second;
        first = second;
        second = third;
    }
    return second;
}`,
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        int first = 1, second = 2, third;
        for (int i = 3; i <= n; i++) {
            third = first + second;
            first = second;
            second = third;
        }
        return second;
    }
};`,
      java: `class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int first = 1, second = 2, third;
        for (int i = 3; i <= n; i++) {
            third = first + second;
            first = second;
            second = third;
        }
        return second;
    }
}`,
      python: `class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2:
            return n
        first, second = 1, 2
        for _ in range(3, n + 1):
            first, second = second, first + second
        return second`
    },
    input_format: "A single integer n.",
    output_format: "The total number of distinct ways to climb."
  }
];

async function addProblems() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("Connected to MongoDB");

    // Clear existing problems to update them
    await Problem.deleteMany({});
    console.log("Cleared existing problems");

    for (const problem of sampleProblems) {
      await Problem.create(problem);
      console.log(`Added problem: ${problem.title}`);
    }

    console.log("Only first 13 problems added successfully.");
  } catch (error) {
    console.error("Error adding problems:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

addProblems();
