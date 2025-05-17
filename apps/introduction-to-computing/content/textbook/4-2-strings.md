---
assignments:
- summary
chunks:
- title: 1. What Are Strings?
  slug: 1-What-Are-Strings?-1543
  type: plain
- title: String and Alphabets
  slug: String-and-Alphabets-3140
  type: regular
- title: Unicode Characters
  slug: Unicode-Characters-3141
  type: regular
- title: Special Characters
  slug: Special-Characters-3142
  type: regular
- title: 2. Declaring Strings in Python
  slug: 2-Declaring-Strings-in-Python-1544
  type: plain
- title: Three Ways to Declare Strings
  slug: Three-Ways-to-Declare-Strings-3143
  type: regular
- title: Special Characters
  slug: Special-Characters-3144
  type: regular
- title: 3. String Concatenation and Slicing in Python
  slug: 3-String-Concatenation-and-Slicing-in-Python-1545
  type: plain
- title: String Concatenation
  slug: String-Concatenation-3145
  type: regular
- title: 'String Slicing: Individual Characters'
  slug: String-Slicing-Individual-Characters-3146
  type: regular
- title: 'String Slicing: Substrings'
  slug: String-Slicing-Substrings-3147
  type: regular
- title: Negative Indices
  slug: Negative-Indices-3148
  type: regular
- title: 4. String Searching in Python
  slug: 4-String-Searching-in-Python-1546
  type: plain
- title: The In Operator
  slug: The-In-Operator-3149
  type: regular
- title: The Find Method
  slug: The-Find-Method-3150
  type: regular
- title: Parameters of the Find Method
  slug: Parameters-of-the-Find-Method-3151
  type: regular
- title: 5. Useful String Methods in Python
  slug: 5-Useful-String-Methods-in-Python-1547
  type: plain
- title: Split()
  slug: Split-3152
  type: regular
- title: Useful String Methods
  slug: Useful-String-Methods-3153
  type: regular
- title: 6. Turtles and Text
  slug: 6-Turtles-and-Text-1548
  type: plain
- title: The Text Function
  slug: The-Text-Function-3154
  type: regular
- title: Penup and Feedback
  slug: Penup-and-Feedback-3155
  type: regular
- title: The Text Function and Newlines
  slug: The-Text-Function-and-Newlines-3156
  type: regular
cri:
- question: Why are strings considered complex despite being composed of letters, numbers, and symbols?
  answer: Strings are considered complex because they represent human alphabets and languages, and computers do not inherently understand the distinctions between uppercase and lowercase letters.
  slug: String-and-Alphabets-3140
- question: What defines characters in computing?
  answer: Unicode, a computing industry standard for handling text, defines characters in terms of their codes in hexadecimal.
  slug: Unicode-Characters-3141
- question: Why might there be a blank line between each pair of lines when printing text loaded from a file?
  answer: Because the new line character that was part of the line loaded from the file is printed along with an additional new line character between lines.
  slug: Special-Characters-3142
- question: What are the three ways Python gives us to define strings?
  answer: We can use quotation marks, apostrophes, or triple-apostrophes to declare strings.
  slug: Three-Ways-to-Declare-Strings-3143
- question: What does the escape sequence \n represent in Python strings?
  answer: The escape sequence \n represents a new line within a string.
  slug: Special-Characters-3144
- question: What does the + operator do in string concatenation?
  answer: The + operator tacks each string on to the previous string.
  slug: String-Concatenation-3145
- question: Why does Python use zero-indexing for strings?
  answer: Python uses zero-indexing for strings as it dates back to the early days of computing where lists were consecutive locations in memory and the index told the list how many places to skip.
  slug: String-Slicing-Individual-Characters-3146
- question: How can we grab a substring from a string in Python without using a for loop?
  answer: By using string slicing with start and end indices.
  slug: String-Slicing-Substrings-3147
- question: How can we get the last several characters in a string in Python?
  answer: By using negative indices that count backward from the end of the string.
  slug: Negative-Indices-3148
- question: How can the in operator be used in Python to check if a substring is part of a string?
  answer: The in operator can be used with strings to check if a substring is part of a string.
  slug: The-In-Operator-3149
- question: What does the Find method return if the substring is not found in the string?
  answer: It returns -1.
  slug: The-Find-Method-3150
- question: What does the start parameter in the find() method specify?
  answer: The start parameter in the find() method specifies where to start looking for the string.
  slug: Parameters-of-the-Find-Method-3151
- question: What is the purpose of the split() method in Python?
  answer: The split() method divides a string into substrings based on a specified separator character.
  slug: Split-3152
- question: What does the capitalize() method do in Python's string class?
  answer: Makes the first letter of the string uppercase and all the rest lowercase, and returns the result.
  slug: Useful-String-Methods-3153
- question: What are the default font settings when using the 'text' command in TheTextFunction.py?
  answer: The default font size is 16, the font face is Arial, and the style is normal.
  slug: The-Text-Function-3154
- question: Why were penup and pendown commands added in PenupAndFeedback.py?
  answer: To allow the turtle to move without drawing a line and to provide feedback to the user that the command was executed.
  slug: Penup-and-Feedback-3155
- question: Why does Python print "\n" instead of interpreting it as a newline when the user enters it?
  answer: Python automatically converts the user's "\n" into "\\n" so that it will print the string as the user inputted it.
  slug: The-Text-Function-and-Newlines-3156
next_slug: 4-3-lists
order: 6
parent:
  title: 'Unit 4: Data Structures'
  slug: unit-4-data-structures
quiz: null
slug: 4-2-strings
title: 4.2 Strings
---

## 1. What Are Strings? {#1-What-Are-Strings?-1543} 

At this point, we’ve already used strings a lot. It’s hard to even start writing programs that can be followed or do interesting things without using strings—at least in their simple form. We speak in natural language, so strings let us have our programs output natural language for us to understand.

However, **strings** are also pretty complex data structures; we’ve barely scratched the surface of how they’re used and why they’re valuable. At a fundamental level, strings are lists of individual characters; some languages actually represent them as such, while others represent individual characters as strings with length one. Either way, though, strings are often treated as lists of individual characters.

### String and Alphabets {#String-and-Alphabets-3140} 

What makes strings complex, then? It seems like a list of letters, numbers, and symbols would be a simple data structure. What makes strings complex is of us pesky humans. Strings represent human alphabets and human languages. The alphabet is surprisingly complex. Take, for example, something as simple as capital and lower-case letters. We pretty easily see ‘A’ and ‘a’ as two characters for the same letter, to be used in different contexts. We know that we would use ‘A’ if we’re starting a sentence, starting someone’s name, or writing a book title; in other situations, we know to use ‘a’.

To the computer, though, ‘a’ and ‘A’ are entirely different **characters**, as different as b and Q. You might have seen that before: if you declared a variable with one capitalization scheme in one place, like myInteger, and another in another place, like MyInteger, the computer saw those as entirely different variables. It has no understanding that “m” and “M” are the same character unless we build such understanding into it.

This is where a lot of string complexity comes into play: we want to manipulate strings based on the way we actually represent human language, even though the computer has little knowledge of human language. For example, if we want to sort things alphabetically, we want to the computer to view ‘A’ and ‘a’ as equivalent characters On its own, it doesn’t do so, and this can lead to strings getting sorted with all uppercase letters before any lowercase letters. Things like converting letters to uppercase or removing trailing spaces in some text make perfect sense to us, but are arbitrary rules to the computer.

### Unicode Characters {#Unicode-Characters-3141} 

The relationship with the human alphabet is only half the story, however. Ask yourself: what are characters? You might rightly say they’re the keys on your keyboard: letters, numbers, and some symbols. Those are certainly characters, but they aren’t all the characters. You might also rightly say that a symbol doesn’t have to be on the keyboard to be a character; ∞, ∆, →, •, and ÷ are all characters as well that you could include in your strings. Even emojis are technically characters.

Characters are defined by **Unicode**, a computing industry standard for handling text. Unicode defines hundreds of different characters in terms of their codes in **hexadecimal**, which is close to ones and zeroes inside the computer. Think about it: if a file is distilled all the way down to ones and zeroes, then when you receive a file, how does your computer know to render an “A” where the original author wrote an “A”? The answer is that both computers use the Unicode standard: they know when they see a character with the hexadecimal code 0041, that should translate to an A. That A might be rendered in different fonts or with different style, but it’s still the character A. The same way, every computer knows that 263A should be a simple smiley emoticon. It might be displayed differently based on whether you’re on Facebook, Twitter, or Microsoft Word, but the underlying standard is for that character to be a smiley face.

### Special Characters {#Special-Characters-3142} 

We’re not talking about this just so that we can start to use emojis in our code, of course (though feel free!). The reason this is complex is that _everything_ plaintext-related in computing is communicated through Unicode characters. By plaintext, we mean without formatting like font face, font size, bold and italics, color, and so on. We mean anything that can be expressed in a plaintext editor, like Notepad.

Yet, there are a lot of things contained there that you wouldn’t immediately recognize as characters. For example, you press Enter or Return to start a new line; how does that computer know to start a new line? Technically, there is a **newline character**. It’s invisible, you don’t see it, and yet it’s there: just as the computer shows the “a” character as the letter a, it shows a new line character as a break down to the next line.

There are lots of these “invisible” characters. Tabs, for instance, are characters that are rendered to have a certain width of whitespace. Paragraphs are their own characters, different from newline characters. There are actually two newline characters: carriage returns and line feed. Have you ever created a plain text file on Mac OS or Unix and then opened it on Windows, only to find everything was on one line? That’s because Mac OS uses the line feed character to represent its new line, while Windows uses both carriage returns and line feeds. When Windows sees just line feeds, it doesn’t render them the same way.

Why does all this matter? The fact that these are stored as characters can alter the way we do some of our string manipulations. For example, let’s say we load five lines from a file, and print them each on their own line. Lo and behold, we might find that there’s a blank line between each pair of lines. Why? Because when we loaded the lines from a file, there was a new line character as _part_ of the line. When we then printed each on its own line, it printed an additional new line character: the one in the string, and the one we printed between lines.

So, the conclusion is: strings are simply lists of characters. However, characters themselves are quite complex, between the relationships within the human alphabet and the special characters supplied by Unicode, and that can make string formatting pretty complex. The very fact that our code is also written in text is a good example of this complexity as well: we differentiate text in our code from the code itself using quotation marks, but what if we want to actually print quotation marks? The fact that we write code in text makes this an interesting little challenge.

## 2. Declaring Strings in Python {#2-Declaring-Strings-in-Python-1544} 

I know what you’re probably thinking: we’ve declared lots of strings, why do we need to cover this again? So far, we’ve declared strings in a natural way, but we haven’t really talked about what we’re actually doing, or about how to deal with some interesting edge cases. So, let’s look at string declaration in a little more detail.

### Three Ways to Declare Strings {#Three-Ways-to-Declare-Strings-3143} 

So far, we’ve always used one method to declare strings, as shown in Figure 4.2.2.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "12345"
print(myString)'>
</i-sandbox-py>

**Figure 4.2.2**

myString on line 1 is the variable name, and to tell it that its data type is a string, we enclose the value assigned to it on the right in quotation marks. If we didn’t, it would become an integer with value 12345. Simple enough, let’s move on... except, there’s a special case we can’t handle here. What do we do if we want to put a quotation mark _inside_ a string? Right now the string’s value is the text 12345; what if we wanted its value to be “12345”, where the quotation marks were actually _part_ of the value? If we just write the obvious declaration, we get Figure 4.2.3.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = ""12345""
print(myString)'>
</i-sandbox-py>

**Figure 4.2.3**

In Figure 4.2.3, Python gives us an error. How come? A quotation mark opens and closes the string. How could the computer know the second quotation mark was supposed to be a part of the string rather than the end of the string? Here, Python sees this as an empty string “”, followed by the number 12345, followed by another empty string “”, with no operators. It doesn’t know how to interpret that.

So, how can we include quotation marks in the string? Fortunately, Python gives us three ways to define strings, and we can use whichever way is compatible with the string content we want, as shown in Figure 4.2.4

.

<i-image
  style="aspect-ratio:984/456;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/4.2.4.png-e9df647f1ac124bb6d9f7c31708dffd4.png"
  alt="4.2.4.png"
  width="984"
  height="456">
</i-image>

**Figure 4.2.4**

We can use quotation marks, apostrophes, or triple-apostrophes to declare strings. If we want our string to include quotation marks, we can instead declare it with apostrophes. If we want our string to include apostrophes, we can instead declare it with quotation marks. If we want our string to include both quotation marks and apostrophes, then we can declare it with triple-apostrophes (or triple quotation marks, even!). No matter what we use to start the string, the string does not end until we encounter that character or character sequence again.

### Special Characters {#Special-Characters-3144} 

We mentioned previously that everything in text is technically a character, including things like tabs and line breaks. Can we then include these in our strings? Yes, though we have to know how. If we try to just put a newline character into the middle of a string, Python isn’t sure what to make of it, as shown in Figure 4.2.5. 

<i-sandbox-py  page-slug="__temp_slug__" code='myStringWithNewline = "12345
						67890"
print(myStringWithNewline)'>
</i-sandbox-py>

**Figure 4.2.6**

Python sees line 1 as ending before the string is closed because Python interprets the newline character in terms of the code, not as part of the string. In other words, Python sees the newline character at the end of line 1 as terminating line 1 with an unclosed string, and it sees line 2 as starting with an unopened string. We need a character that tells Python, “Hey, when running this code, include this newline as part of this string.” It’s shown in Figure 4.2.6.

<i-sandbox-py  page-slug="__temp_slug__" code='myStringWithNewline = "12345\n67890"
print(myStringWithNewline)'>
</i-sandbox-py>

**Figure 4.2.6**

The character sequence \\n in line 1 is translated by Python into the newline character. Whenever it sees \\n it prints a newline. So, here, the newline character appears between “12345” and “67890” within the string, so Python prints a line break between the 5 and the 6.

This actually represents a general principle: inside a string, the forward slash is called an “escape” character, and it starts an **escape sequence**. When Python sees the forward slash, it tries to interpret it and the next character as a special sequence that carries special meaning. The \\n sequence carries the special meaning “newline.” A couple of others are shown in Figure 4.2.7.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "12345\n67890\tabcde\"fghijklm\\no"
print(myString)'>
</i-sandbox-py>

**Figure 4.2.7**

In Figure 4.2.7, we see four escape sequences:

* \\n, which inserts a new line.
* \\t, which inserts a tab.
* \\", which inserts a quotation mark without terminating the string (another way to include quotation marks and apostrophes inside strings).
* \\\, which inserts a forward slash without interpreting it as an escape character (note that otherwise, the \\n at the end of the string would have been a new line).

Note that it’s also alright to simply put a tab directly into the string by pressing Tab inside of typing \\t. However, most Python development environments will translate this into four spaces instead of a tab, so use \\t to have a true tab character.

Note also that our triple-apostrophe method would let us simply write the new line directly, as shown in Figure 4.2.8. Python interprets strings started by triple apostrophes differently, and allows new lines in them.

<i-image
  style="aspect-ratio:1188/326;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/4.2.8.png-9d1a0e475eb30985f7009cb151f4abfe.png"
  alt="4.2.8.png"
  width="1188"
  height="326">
</i-image>

**Figure 4.2.8**

## 3. String Concatenation and Slicing in Python {#3-String-Concatenation-and-Slicing-in-Python-1545} 

We now have the ability to define lots of strings. What can we do with them? Here, we’ll talk about two common operations we want to do on strings: concatenation and slicing.

### String Concatenation {#String-Concatenation-3145} 

**String concatenation** means putting multiple strings together. It comes from the word “concatenate,” which simply means to link things together in an ordered series or chain. We actually can just do this with the + operator, as shown in Figure 4.2.9.

<i-sandbox-py  page-slug="__temp_slug__" code='myString1 = "12345"
myString2 = "67890"
myString3 = myString1 + myString2
print("Assignment Concatenation: " + myString3)
print("In-Line Concatenation: " + myString1 + myString2)
myString1 += myString2
print("Self-Assignment Concatenation: " + myString1)'>
</i-sandbox-py>

**Figure 4.2.9**

In Figure 4.2.9, we see three kinds of concatenation. We declare myString1 and myString2 on lines 1 and 2, then concatenate them and assign the result to myString3 on line 3. The result is the two strings squished together into one, as shown when we print myString3 on line 4. Then, on line 5, we do the same thing in-line: they don’t have to be assigned to a separate variable to do this. Then, on line 7, we also do this with self-assignment concatenation: we set myString1 equal to the concatenation of itself and myString2, and line 8 confirms the results are the same. So, generally, the + operator tacks each string on to the previous string. Note that technically, we’re seeing string concatenation with the labels, too. Line 4 technically concatenates “Assignment Concatenation: ” and the value of myString3 together to print them as one string, “Assignment Concatenation: 1234567890”.

Notice how this works if we throw in a newline character in Figure 4.2.10. When we print a string with a newline character inside it on line 3, we get an extra blank line: print() automatically ends with a newline character, so having one inside the string adds a second newline. Then, when we concatenate myString1 and its newline character with myString2 on line 5, printing them together breaks the second half onto its own line; technically, we’re printing “In-Line Concatenation: 12345\\n67890”, and Python interprets the \\n as the escape sequence for a newline.

<i-sandbox-py  page-slug="__temp_slug__" code='myString1 = "12345\n"
myString2 = "67890"
print(myString1)
print(myString2)
print("In-Line Concatenation: " + myString1 + myString2)'>
</i-sandbox-py>

**Figure 4.2.10**

### String Slicing: Individual Characters {#String-Slicing-Individual-Characters-3146} 

**String slicing** is Python’s term for finding substrings within a broader string. Imagine you have a string: how do you get just the first 5 characters? The last 5? The middle 5? String slicing is the answer.

Let’s start simple. How would you get just a single character out of a string? Python has some dedicated syntax for that: brackets. Whenever you have a data structure that is a list of multiple items, you can follow the variable name with brackets and a number, called the index, to get a certain item from the list.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "ABCDE"
#Prints the 0th (1st) character of the string
print(myString[0])
#Prints the 1st (2nd) character of the string
print(myString[1])'>
</i-sandbox-py>

**Figure 4.2.11**

The tricky thing here is that Python treats the first item in a string as the “0th” item. So, to get the first item, you ask for the 0th item, as shown in line 4 of Figure 4.2.11. This is called zero-indexing: the indices of a list start with 0. It also means that the last item in the list is one fewer than the length of the list, and if we try to access a list item that doesn’t exist, we get an error, as shown in line 7 of Figure 4.2.12.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "ABCDE"
#Prints the 4th (5th) character of the string
print(myString[4])
#Prints the 5st (6nd) character of the string
print(myString[5])'>
</i-sandbox-py>

**Figure 4.2.12**

IndexErrors are the error that arises when we try to access an index that doesn’t exist for a particular list. In Figure 4.2.12, the index 5 does not exist because the characters in a five-character string are numbered 0, 1, 2, 3, and 4. Remember also, strings are immutable, which means we cannot use this syntax to change indi- vidual characters, as shown in line 2 of Figure 4.2.13.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "ABCDE"
myString[4] = "F"'>
</i-sandbox-py>

**Figure 4.2.13**

Why **zero-indexing**? This goes all the way back to the early days of computing. Remember, a variable points to a place in memory where the value is stored. Early on, lists were technically just consecutive locations in memory. The index told the list how many places in memory to skip. To get the first item in a list, you wouldn’t skip any places in memory, so your index would be 0. Saying “skip 5 items” with a 5-item list would skip the entire list, triggering the IndexError.

### String Slicing: Substrings {#String-Slicing-Substrings-3147} 

But what if you want to create a string made up of a part of another string? What if you wanted to grab the first three characters and create a new string? Remember, we can traverse a string with a for-each loop, as shown in Figure 4.2.14.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "ABCDE"
mySubstring = ""
#Run a loop for each character in myString
for character in myString:
	#Add character i to mySubstring
	mySubstring += character
print("mySubstring: " + mySubstring)'>
</i-sandbox-py>

**Figure 4.2.14**

The fact that we can traverse each character of a string that way is a useful takeaway on its own. However, there’s no straightforward way to stop the for-each loop on line 4 before it reaches the end of the string, and in this example, we wanted to grab just the first three characters. So, we could do this the hard way, with a regular for loop from 0 to 2, as shown in Figure 4.2.15.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "ABCDE"
mySubstring = ""
#Run a loop from i = 0 to i = 2
for i in range(0, 3):
	#Add character i to mySubstring
	mySubstring += myString[i]
print("First three characters: " + mySubstring)'>
</i-sandbox-py>

**Figure 4.2.15**

We run a for loop from 0 to 2, grabbing characters 0, 1, and 2 from myString and adding them to mySubstring. That was a lot of work to do that; there has to be a better way. One better way would be to create a function that just takes as parameters the string and the number of characters, and in fact, that’s how many languages do this. However, Python makes this even simpler with its string slicing syntax, as shown in Figure 4.2.16.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "ABCDE"
start = 0
end = 3
print("First three characters: " + myString[start:end]'>
</i-sandbox-py>

**Figure 4.2.16**

In Figure 4.2.16, we’re using the same brackets on line 4 that we used before, but instead of just putting a single number, we put two numbers with a colon in-between. The number before the colon is the start index, and the number after is the end index. The substring will be the characters from start (inclusive) to end (exclusive). In other words, it will include the character with the starting index, and stop before the character with the end index. So in line 4 of Figure 4.2.16, the substring is from 0 to 3, so characters 0, 1, and 2 are included.

One nice thing about this is that we don’t need to use variables: we can put in the indices directly, as shown in lines 2 and 3 of Figure 4.2.17. That’s much simpler than our for loop!

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "ABCDE"
print("First three characters: " + myString[0:3])
print("Characters 1 through 3: " + myString[1:4])'>
</i-sandbox-py>

**Figure 4.2.17**

Python also takes this a step further by allowing us to omit either the start or end, as shown in Figure 4.2.18. If we skip the “start” number as shown in line 2, Python assumes 0. If we skip the “end” number as shown in line 3, Python assumes “to the end.” If our “end” number is beyond the length of the string as shown in line 4, then Python stops at the end of the string.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "ABCDE"
print("First three characters: " + myString[:3])
print("Characters from 3 to the end: " + myString[3:])
print("Characters from 3 to 10: " + myString[3:10])'>
</i-sandbox-py>

**Figure 4.2.18**

### Negative Indices {#Negative-Indices-3148} 

Those methods all covered getting things like the “first five characters” or “characters three through eight.” How do we get the last several characters in a string, though? What if we wanted to get the last two letters of a string?

We could do it the hard way. The hard way would be to use the length of the string to figure out what index to start at to get the last few characters. For example, if we wanted the last two characters, we’d start at the length of the string minus two, as shown in Figure 4.2.19.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "ABCDE"
print("Last two characters: " + myString[len(myString)-2:])'>
</i-sandbox-py>

**Figure 4.2.19**

That works, but that’s really complex. We have to find the end of the string, count backward by two, then count forward again. It works just fine, and in many languages this is exactly what you have to do. Python tries to make things easier, though, with negative indices. Negative indices (i.e., using a negative number as an index) count backward from the end of the string, as shown in Figure 4.2.20.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "ABCDE"
print("All but the last two characters: " + myString[:-2])
print("Last two characters: " + myString[-2:])'>
</i-sandbox-py>

**Figure 4.2.20**

Line 2 here says to start at the beginning (because there is no “start” index in the brackets), and go until 2 characters _from_ the end; this is the meaning of -2 as the “end” index. So, an index of 2 for “end” would mean to include the characters until 2 from the _start_, and an index of −2 for “end” would mean to include the characters until 2 from the _end_. Similarly, if our “start” index is −2 as on line 3, it means to _start_ two indices from the end.

## 4. String Searching in Python {#4-String-Searching-in-Python-1546} 

Back when we talked about logical operators, we talked about string equality. Specifically, we talked about how two strings are equal if they have the same characters, and one string is “greater” than another if it comes later alphabetically. Earlier in this chapter, we briefly noted that natively, many languages—Python included—process uppercase and lowercase letters separately, meaning that all the uppercase letters will be sorted among themselves before any lowercase letters.

Those rules generally take care of string comparisons, whether two strings are equal or if one is “greater” than another. However, there’s more we can do with strings, including checking to see if a substring is present in a string and, if so, where.

### The In Operator {#The-In-Operator-3149} 

When we covered operators, we talked about the in operator in Python. The in operator is unique; it seems to take on different meanings when used in a for loop (e.g., for i in range(0, 3):) and in a conditional (if “Bob” in myList:).

The in operator can be used with strings to check if a substring is part of a string, as shown in Figure 4.2.21. The conditional on line 3 correctly identifies that “BC” is in the string “ABCDE”, and the conditional on line 8 correctly identifies that “GH” is _not_ in the string.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "ABCDE"
if "BC" in myString:
	print("BC was found!")
else:
	print("BC was not found!")
if "GH" in myString:
	print("GH was found!")
else:
	print("GH was not found!")'>
</i-sandbox-py>

**Figure 4.2.21**

In reality, we would probably package this together as a function, as shown in Figure 4.2.22. So, we can use the in operator to check to see if a string is present in another string.

<i-sandbox-py  page-slug="__temp_slug__" code='#Checks if searchString is in checkString
def checkInString(checkString, searchString):
	if searchString in checkString:
		print(searchString + " was found!")
	else:
		print(searchString + " was not found!")
myString = "ABCDE"
checkInString(myString, "BC")
checkInString(myString, "GH")'>
</i-sandbox-py>

**Figure 4.2.22**

Similarly, we could use not in to check the inverse, as shown in Figure 4.2.23. Same result here, but the reasoning is in reversed. If it’s _not_ in the string, we print that it’s not in the string; else, we print that it is.

<i-sandbox-py  page-slug="__temp_slug__" code='#Checks if searchString is not in checkString
def checkNotInString(checkString, searchString):
	if searchString not in checkString:
		print(searchString + " was not found!")
	else:
		print(searchString + " was found!")
myString = "ABCDE"
checkNotInString(myString, "BC")
checkNotInString(myString, "GH")'>
</i-sandbox-py>

**Figure 4.2.23**

### The Find Method {#The-Find-Method-3150} 

Sometimes, though, we’re not just interested in finding out _if_ a string is in another string. Oftentimes, we want to know _where_ it was found. That’s where the powerful Find method comes in handy. The Find method, find(), is a member of the string type, and it takes as input the substring to find, then returns the index where it was found or −1 if it was not found.

In Figure 4.2.24, “CDE” starts at index 2 in myString (due to zero-indexing, “A” is 0, “B” is 1, and “C” is 2, so “CDE” starts at 2), so myString.find(“CDE”) on line 4 returns 2. “ACE” is not found in myString—while each individual character is in “ABCDE”, the continuous string “ACE” is not found. So, myString. find(“ACE”) on line 6 returns −1.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "ABCDE"
#Prints the index of "CDE" in myString
print(myString.find("CDE"))
#Prints the index of "ACE" in myString
print(myString.find("ACE"))'>
</i-sandbox-py>

**Figure 4.2.24**

Note that in this way, find() subsumes all the reasoning of the in operator, as shown in Figure 4.2.25. If the result of find() is positive on line 3, it means that the substring was found; if it’s negative, it means it wasn’t found. What happens, though, if the string we’re trying to find is in two places in the string that we’re searching?

<i-sandbox-py  page-slug="__temp_slug__" code='#Checks if searchString is in checkString
def checkInString(checkString, searchString):
	if checkString.find(searchString) >= 0:
		print(searchString + " was found!")
	else:
		print(searchString + " was not fouhnd!")
myString = "ABCDE"
checkInString(myString, "BC")
checkInString(myString, "GH")'>
</i-sandbox-py>

**Figure 4.2.25**

As shown on line 4 of Figure 4.2.26, find() only finds the first index; after all, it can only return one number. We’ll talk in a moment about how to use find() more flexibly.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "ABCDEABCDE"
#Prints the index of "CDE" in myString
print(myString.find("CDE"))'>
</i-sandbox-py>

**Figure 4.2.26**

Before that, though, note also that the find() method is case-sensitive, as shown in Figure 4.2.27. Remember, the computer doesn’t see “c” and “C” as the same character; they’re as different as “b” and “Q”. So, searching for “cde” on line 4 won’t turn up anything in “ABCDEABCDE”.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "ABCDEABCDE"
#Prints the index of "CDE" in myString
print(myString.find("cde"))'>
</i-sandbox-py>

**Figure 4.2.27**

### Parameters of the Find Method {#Parameters-of-the-Find-Method-3151} 

We can extend find() by using some of its optional parameters. Optionally, we can supply two additional arguments to the find() method: start and end. start tells find() where to start looking, and end tells it where to stop looking. If it isn’t found after start and before end, it returns −1.

Figure 4.2.28 shows five different find() calls on myString using “CDE”. On line 4, it finds the first index of “CDE” at 2. On line 6, it searches only after the index 5; the first occurrence of “CDE” after the index 5 is at 7. On line 8, it searches only after the index 13; “CDE” doesn’t occur after 8, though, so it returns −1 to say the string was not found. On line 10, it searches only between the indices 4 and 10; the first occurrence there is at 7. In this way, it skips both the first and last overall appearances and only gets the one in the middle. Then, on line 12, it searches between 3 and 6, but finds nothing and returns −1.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "ABCDEABCDEABCDE"
#Prints the first index of "CDE" in myString
print(myString.find("CDE"))
#Prints the first index of "CDE" in myString after 5
print(myString.find("CDE", 5))
#Prints the first index of "CDE" in myString after 8
print(myString.find("CDE", 8))
#Prints the first index of "CDE" in myString between 4 and 10
print(myString.find("CDE", 4, 10))
#Prints the first index of "CDE" in myString between 3 and 6
print(myString.find("CDE", 3, 6))
myString = "ABCDEABCDEABCDE"'>
</i-sandbox-py>

**Figure 4.2.28**

We can use find() to build a list of all the appearances of a particular string within another string. We’ll talk about making it a list later; for now, let’s just print out all the indices. Figure 4.2.29 shows the code to do this—we’ll make the string we’re searching a little longer and more complicated to make things interesting.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "ABCDEABCDEABCDEFGHIJFGHIJFGHIJABCDEABCDEFGHIJ"
findString = "CDE"
#Find findString in myString and assign its index to currentLocation
currentLocation = myString.find(findString)
#While currentLocation is positive; e.g. while findString is found
while currentLocation >= 0:
	#Print the index
	print(findString, "found at", currentLocation)
	#Get the next index, or -1 if there are no more
	currentLocation = myString.find(findString, currentLocation + 1)'>
</i-sandbox-py>

**Figure 4.2.29**

We first create the string to search on line 1, myString, and the string to search for on line 2, findString. Then on line 4, we get the first location of findString in myString and assign it to currentLocation to get our loop started. Then starting on line 7, we run a loop while currentLocation is greater than 0, and on line 11 at the end of each iteration of that loop, we search myString again _starting at_ the last found location (as given by the currentLocation + 1 parameter). Since find() always finds the first instance after a certain index, that guarantees we’ll find the instances in order. When we run out, that means findString wasn’t found, so find() will return −1, terminating the while loop.

So, let’s step through this. Initially, currentLocation is assigned to 2, the first location of “CDE”. 2 >= 0 is True, so the while loop runs, printing that “CDE” was found at 2. Then, it searches again, starting at index 3. Because the search starts at index 3, it won’t find the instance starting at 2 again. Instead, it finds the next one, at 7. 7 >= 0 is still True, so it prints and finds the next location. This continues for 12, 27, and 32. After 32, though, this code calls find() starting at index 33. There are no instances of “CDE” after 32, though, so this call to find() returns −1. Now, it’s not True that −1 >= 0, so the while loop terminates.

Note that if findString is not found anywhere in myString, then the initial assignment to currentLocation will be −1, and the while loop will never run even once, as shown in Figure 4.2.30. In this way, we can build a segment of code that gathers every instance where a particular string was found in another string.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "ABCDEABCDEABCDEFGHIJFGHIJFGHIJABCDEABCDEFGHIJ"
findString = "BOB"
#Find findString in myString and assign its index to currentLocation
currentLocation = myString.find(findString)
#While currentLocation is positive; e.g. while findString is found
while currentLocation >= 0:
	#Print the index
	print(findString, "found at", currentLocation)
	#Get the next index, or -1 if there are no more
	currentLocation = myString.find(findString, currentLocation + 1)'>
</i-sandbox-py>

**Figure 4.2.30**

Note that we can also use a different method, count(), to simply count the instances without finding them, as shown in Figure 4.2.31. This confirms there are five instances of “CDE” in myString. count() can also take the same parameters as find(), start and end to mark off within what portion of the string it should count. Note also this is a somewhat complex print() statement on line 3: we have our label, “Count of”, which is concatenated with the value of findString and a colon. That is then also concatenated with the result of myString.count(findString).

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "ABCDEABCDEABCDEFGHIJFGHIJFGHIJABCDEABCDEFGHIJ"
findString = "CDE"
print("Count of", findString, ":", myString.count(findString))'>
</i-sandbox-py>

**Figure 4.2.31**

## 5. Useful String Methods in Python {#5-Useful-String-Methods-in-Python-1547} 

Last chapter, we covered methods at a high level, just to familiarize ourselves with method syntax. The reason was that although we have seen a few methods before, now we’re going to start seeing them even more frequently. That starts here with strings. Strings in Python have lots of useful methods for us to use. Let’s take a look at several of them.

## Split() {#Split-3152} 

The split() method divides the string up into several substrings based on the separator character. The simplest case, when no arguments are given to split(), is that it splits the string up by spaces, as shown in Figure 4.2.32.

In Figure 4.2.32, myString is a long string with 13 words. When we call myString.split() on line 3, it splits it up by the space character. The result is a list of 13 strings, each one word from the original string. It removes the spaces themselves as well.

<i-sandbox-py  page-slug="__temp_slug__" code='myString. "This is my text. It has thirteen " 
\ "words. It also has three sentences."
print(myString.split())'>
</i-sandbox-py>

**Figure 4.2.32**

We can also specify our own unique separator as an argument to split(), as shown in Figure 4.2.33. Here, instead of splitting the string up into 13 strings based on spaces, it splits it into 4 strings based on periods. Note, though, a couple issues. First, the spaces at the beginning of each sentence are still there. Second, there’s an empty string at the end: Python sees the period at the end and splits between two strings, regardless of the fact that nothing comes after that period.

<i-sandbox-py  page-slug="__temp_slug__" code='myString. "This is my text. It has thirteen " 
\ "words. It also has three sentences."
print(myString.split("."))'>
</i-sandbox-py>

**Figure 4.2.33**

We can resolve this by instead splitting on the entire “.” string, as shown in Figure 4.2.34. This still isn’t perfect; this means that Python removes the period character from the first two sentences (since it’s part of the “.” string being used to split), but not the third. Still, we’re closer now to what we wanted.

<i-sandbox-py  page-slug="__temp_slug__" code='myString. "This is my text. It has thirteen " 
\ "words. It also has three sentences."
print(myString.split(". "))'>
</i-sandbox-py>

**Figure 4.2.34**

This split() method is especially useful when we deal with comma-, tab-, or newline-separated lists. It’s common to ask users to enter multiple options separated by commas. For example, imagine we were asking the users to enter the first names of each person they want to e-mail as part of an e-mail application. We could have them enter the names one at a time until they type “exit” or something similar, or we could have them enter the names all at once separated by commas. Then, we can use the split() method with “,” as the argument to pull out the individual names, as shown in Figure 4.2.35.

<i-sandbox-py  page-slug="__temp_slug__" code='names = input("Enter a list of names: ")
print(names.split(","))'>
</i-sandbox-py>

**Figure 4.2.35**

Note that we don’t necessarily know if the user will put spaces after commas or not. We don’t want to split based on “, “ (with a space) because then it will not split if they don’t, but we don’t want to include the spaces either if they do. The easiest way to do this will be to strip out the whitespace at the beginning and end of each string after calling split(), which we’ll cover next.

### Useful String Methods {#Useful-String-Methods-3153} 

The Python string class has a lot of utility methods for modifying our strings in predictable and useful ways. Here are a few of them:

* capitalize(). Makes the first letter of the string uppercase and all the rest lowercase, and returns the result.
* lower(). Returns a version of the string with all uppercase letters changed to lowercase.
* upper(). Returns a version of the string with all lowercase letters changed to uppercase.
* title(). Returns a version of the string with each word (e.g., letter following a space) capitalized.
* strip(). Returns a version of the string with any whitespaces (spaces, line breaks, etc.) at the beginning and end of the string removed. rstrip() and lstrip() apply this strip() method only to the right or left sides of the string.
* replace(old, new). Replace all occurrences of the substring old with the substring new.
* rfind(findString). Just like find(), but returns the _last_ index of findString instead of the first.
* join(list). Creates a string where each item in the list is followed by the string, and returns the result.

Additionally, Python has some interesting boolean methods that simply check if certain criteria are true about the string, returning True if so and False if not:

* endswith(suffix). Returns True if the string ends with suffix, False if not.
* startswith(prefix). Returns True if the string starts with prefix, False if not.
* isalnum(). Returns True if the string is all letters and numbers, False if not.
* isalpha(). Returns True if the string is all letters, False if not.
* isdecimal(). Returns True if the string represents an integer or decimal number, False if not.
* isdigit(). Returns true if the string is all numbers (e.g., represents an integer), False if not. isnumeric() is similar, but supports fraction and other characters as well (which are rarely used).
* islower(). Returns True if the string contains no uppercase letters, False if not.
* isupper(). Returns True if the string contains no lowercase letters, False if not.
* istitle(). Returns True if the string is in title case, meaning each word is capitalized, and False if not.

## 6. Turtles and Text {#6-Turtles-and-Text-1548} 

In this chapter we’ve been talking all about strings, but it would seem that wouldn’t have a lot to do with our turtles program. Sure, we accept user input in text, but those are pretty simple commands that just get fed into our conditional. Can we really do anything more complicated than that?

That would be true, except for the turtle.write() method. The turtle. write() method takes as input a string (and, optionally, an alignment, a font, and a setting whether to move to the end of the written text), and in turn writes the given message to the screen. Now, suddenly, anything we’ve been doing with our strings can be written by our turtles! So, let’s create a simple function for this, one that will just write the user’s message at the current point. We’ll find, though, that it isn’t quite that simple if we want the user to put in multiple lines of text.

### The Text Function {#The-Text-Function-3154} 

After revising our code to allow a new “text entry” option, we get TheTextFunction.py. Run it, enter the “text” command, and type “Hello, world” to see this option in action.

First, let’s do a little cleanup. The print statement where we ask the user to enter a command is getting pretty long. So, we’ve switched it to print the options on one line (line 37) and get the input on the next (line 38). After that, we add a new elif to our conditional on line 70: “text”. If the user enters “text”, they’re prompted to enter the message that they’d like to print on line 72. After entering the message, it’s printed on the canvas on line 74.

This is a single method call, so we don’t really gain anything by wrapping it in a function. For now, we’ve forced certain options as well: we’ve set the font size to 16, the font face to Arial, and the style to normal to keep things simple.

### Penup and Feedback {#Penup-and-Feedback-3155} 

Running TheTextFunction.py, though, we quickly run into an issue: while it’s good for the turtle to move to the end of the text it drew (so we can write multiple messages in a row), that draws a line under the text, which could get a little ugly. So, in PenupAndFeedback.py, we’ve added two new commands here on lines 78 through 88: **penup and pendown**. These simply turn drawing off and on. If the turtle moves with the pen up, it won’t draw a line, so now our users can move the turtle around the canvas without necessarily drawing the entire trail!

Notice, however, that the penup and pendown commands wouldn’t have any automatic feedback to the user; how do they know they’ve worked? Other commands draw lines or show rotation, but these cause no immediate visible change. So, to help the user know the command registered, we have added print statements here to confirm the action was executed. This is the valuable principle of feedback at work: the user should be able to immediately tell that their input was received and correctly recognized.

### The Text Function and Newlines {#The-Text-Function-and-Newlines-3156} 

Now let’s take a quick closer look at this. We mentioned earlier the escape sequence \\n. Could the user enter “\\n” to write text on multiple lines? Try it out and see: enter a string into the text command with “\\n” in the middle.

As you’ll see, no! If the user enters “\\n” in their text, Python just prints the characters “\\” and “n”. Why is that? Why doesn’t Python interpret this as the escape sequence? Let’s find out. Let’s print the user’s input after the text entry line to see how Python is interpreting it. We won’t include a file for this here, but try printing message after line 72. What do you see?

When we print the message directly, we see something similar: Python prints “\\n”. So, the string is properly included. But wait: earlier when we included “\\n” in a string, Python translated it as a newline... unless the slash was preceded by another slash! When we included “\\\n” in our string, Python printed “\\n”, but when we included just “\\n”, it printed a newline. So, if it’s printing the “\\n” here, it must be storing it as “\\\n”! Python must be automatically converting the user’s “\\n” into “\\\n” so that it will print the string as the user inputted it.

So, if we want the user to use “\\n” in their input to separate lines, we need to replace any instances of “\\\n” with “\\n”. So, before printing the message, we add a simple call to the replace() method on line 74, and the result is shown in The- TextFunctionandNewlines.py.

By replacing “\\\n” with “\\n”, we achieve the result we wanted, and the user is able to enter text on two lines. We should add a note for the user about that as well: that keeps the option discoverable. Interestingly, to include that note in our prompt, we have to use the double-slash again: “use \\\n to designate a newline” will render only one slash.

