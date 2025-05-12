---
assignments:
- summary
chunks:
- title: 1. What Is Exception Handling?
  slug: 1-What-Is-Exception-Handling?-1521
  type: plain
- title: '"Catching" Errors'
  slug: Catching-Errors-3070
  type: regular
- title: When to Catch Errors
  slug: When-to-Catch-Errors-3071
  type: regular
- title: 2. Try-Catch-Finally
  slug: 2-Try-Catch-Finally-1522
  type: plain
- title: The Try Block
  slug: The-Try-Block-3072
  type: regular
- title: The Catch Block
  slug: The-Catch-Block-3073
  type: regular
- title: The Finally Block
  slug: The-Finally-Block-3074
  type: regular
- title: 3. Try and Except in Python
  slug: 3-Try-and-Except-in-Python-1523
  type: plain
- title: The Try Statement
  slug: The-Try-Statement-3075
  type: regular
- title: Catching Any Error
  slug: Catching-Any-Error-3076
  type: regular
- title: Catching a Specific Error
  slug: Catching-a-Specific-Error-3077
  type: regular
- title: Catching Multiple Specific Errors
  slug: Catching-Multiple-Specific-Errors-3078
  type: regular
- title: 4. Else and Finally in Python
  slug: 4-Else-and-Finally-in-Python-1524
  type: plain
- title: Else for Error Handling
  slug: Else-for-Error-Handling-3079
  type: regular
- title: Else and File Input
  slug: Else-and-File-Input-3080
  type: regular
- title: Finally
  slug: Finally-3081
  type: regular
- title: Finally and Uncaught Errors
  slug: Finally-and-Uncaught-Errors-3082
  type: regular
- title: Nested Try-Catch-Else-Finally
  slug: Nested-Try-Catch-Else-Finally-3083
  type: regular
- title: 5. Error Handling and Other Control Structures
  slug: 5-Error-Handling-and-Other-Control-Structures-1525
  type: plain
- title: Error Handling and For Loops
  slug: Error-Handling-and-For-Loops-3084
  type: regular
- title: Error Handling and Functions
  slug: Error-Handling-and-Functions-3085
  type: regular
- title: 6. Error Handling and Turtles
  slug: 6-Error-Handling-and-Turtles-1526
  type: plain
- title: Error Handling and Turtles
  slug: Error-Handling-and-Turtles-3086
  type: regular
- title: Error Handling and Functions with Turtles
  slug: Error-Handling-and-Functions-with-Turtles-3087
  type: regular
- title: Error Handling and Functions with Turtles II
  slug: Error-Handling-and-Functions-with-Turtles-II-3088
  type: regular
cri:
- question: What is the purpose of catching an error in programming?
  answer: Catching an error allows the program to continue running and execute specific code when an error is encountered.
  slug: Catching-Errors-3070
- question: Why is catching errors useful even if they could be avoided with conditionals?
  answer: Catching errors allows for a more focused thought process, creates organized code, and minimizes damage in case of unexpected errors, especially when writing programs for users to interact with.
  slug: When-to-Catch-Errors-3071
- question: What is the purpose of the try block in error-handling control structures?
  answer: The try block marks off the code in which an error is anticipated to arise and runs until an error is encountered.
  slug: The-Try-Block-3072
- question: What is the purpose of a catch block in error handling?
  answer: The catch block contains the code the computer should run if an expected error was encountered in the try block.
  slug: The-Catch-Block-3073
- question: What type of error arises when trying to convert a non-numeric string to an integer without any error handling?
  answer: A type error occurs.
  slug: The-Try-Statement-3075
- question: What happens when an error occurs in the code provided in Figure 3.5.3?
  answer: The code jumps to the except block and runs the print statement that indicates myString is not a number.
  slug: Catching-Any-Error-3076
- question: What happens when a ValueError occurs in the code snippet provided?
  answer: The code jumps to the except block specifically designed to handle a ValueError and prints the error message.
  slug: Catching-a-Specific-Error-3077
- question: What is one way to handle multiple types of errors in a try-except block?
  answer: One way to handle multiple types of errors is to specify them in parentheses separated by commas in the except statement.
  slug: Catching-Multiple-Specific-Errors-3078
- question: Why do we need an else block in error handling?
  answer: The else block lets us restrict our try block to only the code that we expect to generate an error and will only run if no errors were encountered.
  slug: Else-for-Error-Handling-3079
- question: What happens if we try to run the code in Figure 3.5.16 with a filename that doesn't exist?
  answer: The error is caught and 'An input error occurred!' is printed.
  slug: Else-and-File-Input-3080
- question: When would we need a finally block?
  answer: We need a finally block when we want to ensure that certain code runs regardless of whether an error was detected or not.
  slug: Finally-3081
- question: What will happen if a TypeError occurs inside the try block in Figure 3.5.19?
  answer: The TypeError will not be caught by the except block, but the finally block will still run.
  slug: Finally-and-Uncaught-Errors-3082
- question: How can you handle a situation where you need to check different types of errors while reading and converting a file?
  answer: You can use nested try-except blocks to handle different types of errors while reading and converting a file.
  slug: Nested-Try-Catch-Else-Finally-3083
- question: How does the execution flow differ in Figure 3.5.24 compared to Figure 3.5.23?
  answer: In Figure 3.5.24, the code continues running after hitting an error, allowing the loop to touch each line of the file, while in Figure 3.5.23, encountering an error terminates the loop.
  slug: Error-Handling-and-For-Loops-3084
- question: How can errors be handled in a function?
  answer: Errors in a function can be handled either inside the function body or in the code that makes the function call.
  slug: Error-Handling-and-Functions-3085
- question: What is the purpose of wrapping the entire series of conditionals in a try block?
  answer: To prevent the program from quitting and crashing if the user enters invalid input, allowing them to try again.
  slug: Error-Handling-and-Turtles-3086
- question: How can we force the user to keep answering a single prompt until an integer is correctly entered?
  answer: By implementing the getIntegerInput() function and replacing all calls to input() with calls to getIntegerInput() in the main code.
  slug: Error-Handling-and-Functions-with-Turtles-3087
- question: What does the program do if the user enters invalid input multiple times?
  answer: It creates additional copies of the getIntegerInput() function and runs them until valid input is entered.
  slug: Error-Handling-and-Functions-with-Turtles-II-3088
next_slug: 4-1-data-structures
order: 4
parent:
  title: 'Unit 3: Control Structures'
  slug: unit-3-control-structures
quiz: null
slug: 3-5-error-handling
title: 3.5 Error Handling
---

## 1. What Is Exception Handling? {#1-What-Is-Exception-Handling?-1521} 

Early in our conversations, we covered the idea of errors. Errors were specific times when our code tried to do something it wasn’t able to do. For example, we can’t divide by zero: telling our code to divide by zero would cause an error. Similarly, we can’t open a file that doesn’t exist: telling our code to open a file that doesn’t exist would cause an error. In some languages, these are also referred to as exceptions; and in some languages, there are subtle differences between errors and exceptions. Generally, we’ll use the words interchangeably until we get to your language-specific material.

So far, we’ve most often used errors for debugging: when an error arises, we know we need to go and figure out what caused it and prevent it from happening in the future. However, that’s not the only purpose of errors. Sometimes, instead of preventing errors, we want to use the fact that an error arises to direct or control our program. In other words: some errors might be expected and even purposeful, and when they arise our program should know how to deal with them.

## "Catching" Errors {#Catching-Errors-3070} 

We call this “**catching**” an error. An **uncaught error** (also called an unhandled error) will crash our program. A caught error will let our program keep running, and we can add code that specifically runs if an error was caught. We can even add different blocks of code that react to different types of errors.

Let’s take an example. Imagine we asked the user to put in a list of numbers. We would then run a for-each loop over all the numbers, add them up, and divide the sum by the length of the list of numbers. What happens if the user doesn’t put in any numbers, though? That’s not a problem for our for loop: it still runs for “each” item in the list, there just aren’t any. It would be like going to the grocery store with an empty shopping list: it’s silly, yes, but it wouldn’t cause your reasoning to crash.

However, what happens when it reaches the end of the loop? It attempts to divide the sum, 0, by the length of the list, also 0. 0 divided by 0 triggers a divide-by-zero error, which would crash our program. The user shouldn’t be able to crash the program, though, so we need to avoid this. There are two ways we can avoid this error: one, we could simply run a conditional before calculating the average to make sure the length of the list was not zero. If the length is not zero, we calculate the average; else, we show a message to the user saying, “You can’t average an empty list!”

There’s nothing wrong with that method, but let’s talk about the other approach: catching the error. We can look at this code and know: the only possible way to encounter a divide-by-zero error is if the list was empty. So, if a divide by zero error arises, that must mean the list was empty. So, instead of checking if the list was empty first before trying to calculate the average, we can instead just tell the computer, “Hey, try to calculate the sum, but don’t crash if you can’t: instead, just tell the user they can’t average an empty list.” This is catching the error: telling the computer not to crash if the error is encountered, as well as giving it some step to take instead.

## When to Catch Errors {#When-to-Catch-Errors-3071} 

In the example above, we had two pretty equivalent options: we could use a condi- tional to check if an error would occur in advance, or we could catch errors after they already occurred. What’s the usefulness of catching errors if they could be avoided with conditionals?

First, part of this is more about our thought process when creating programs. Catching errors lets us first emphasize the code itself, and later think about what errors might arise. You don’t want to do that in big programs, but for individual functions, that can help you focus on the actual reasoning of the function first. Along these same lines, when catching errors, some of the code will run until an error arises, whereas with the if statement, either all the code will run or not of it will. That can be useful, too.

Second, catching errors can create more organized code. If you have a segment of code that could have multiple expected errors, then you would need either (a) one long conditional that checks every possible error, or (b) a series of conditionals each checking a different error. Either of these can get messy. When you’re catching errors, you can generally just wrap up one long code block and list the errors that could arise at the end.

Third and perhaps most importantly, if you’re writing programs for people to actually use (which, presumably, is the goal of learning to program), you never want a program to crash on the user. The goal is error-free code, but in big programs, that’s nearly impossible; big applications such as games or operating systems may handle dozens of errors per second. Many of these are expected, but some aren’t. Catching errors localizes the damage even of unexpected errors. For example, if you were writing a document in a word processor and it hit an error loading a font, you wouldn’t want the program to just crash; you’d want it to say, “Well, it’s better to not show that font than to crash altogether.” Error handling allows us to write programs where, even if there are unanticipated errors, their damage is localized and minimized.

## 2. Try-Catch-Finally {#2-Try-Catch-Finally-1522} 

We’re covering error handling in the control structures unit of this course because the actual structure of error-handling is, itself, a control structure. There are three common structures for error-handling: the try, catch, and finally.

## The Try Block {#The-Try-Block-3072} 

The try block of the error-handling control structure is the simple one. It marks off the code in which an error is anticipated to arise. On its own, it doesn’t actually do very much; it’s more of a marker, so the computer knows what code might have its errors handled later on. The computer will run the code in the try block until an error arises; if an error arises, the code will skip the rest of the code in the try block and jump to the code in the next block, the catch block.

Earlier we mentioned that error handling is like a conditional statement. We could handle errors with a conditional by saying, “If an error is going to arise, don’t run this code; else, do run it.” In that structure, we would put the code we actually want to run in the else portion of the structure. The try block is thus similar to the else block: it’s a block of code marked off to run if some other block didn’t run. However, the try block is different in that it will always _start_ to run, and only stop when an error is encountered.

## The Catch Block {#The-Catch-Block-3073} 

When the computer encounters a try block, it makes a “mental” note that if an error occurs during the block, it should jump forward to the catch block. The catch block contains the code the computer should run if an expected error was encountered in the try block.

The catch block has one additional detail declared with it: the type of error to be expected. We can tell the computer exactly what kind of error to catch. For example, we could write code that would catch a divide-by-zero error only, but would let any other errors through and crash the program. We could also design our code to have multiple catch blocks, allowing it to react differently to different kinds of errors; for example, it might warn the user about averaging an empty list on a divide-by-zero error, and it might send a message to the programmers if a different error was encountered. In some languages, we can even skip the catch block altogether: a try without a catch just tells the computer not to crash if the code inside the try block raises an error.

The catch block is where the bulk of the interesting reasoning in error handling occurs. If the error was expected in some way, the catch block might tell the user why the error occurred and how it can be fixed. If the error was not specifically expected, the catch block could print the reason the error occurred to the console, or trigger an error report to be submitted to the developers. Any type of code can be placed into both a try and catch block, so we could do complex reasoning like determining if the user has opted in to reporting errors.

## The Finally Block {#The-Finally-Block-3074} 

Finally (pun intended), some languages have a finally **block**. The finally block contains code that should be executed after the code in the try block whether it succeeded or not. If the code in the try block ran without errors, then execution will jump to the finally block when the try block is done. If the code in the try block hit an error, execution will (in most languages) run what is in the catch block next, and then will always run the code in the finally block. For this reason, we generally want to be very confident in what we put in the finally block since, if it raises an error, too, we aren’t prepared to catch it.

The finally block is typically used for code that absolutely needs to run, even if other things have gone wrong. For example, imagine some code to close an application. If there is code in the close function that can raise an error, then the application can’t exit at all! We would want to enclose the close function in a try-catch-finally structure, and in the finally block, we would want to ensure that the application really does close.

## 3. Try and Except in Python {#3-Try-and-Except-in-Python-1523} 

So far, we’ve been avoiding errors in our code. Now, we get to add them intentionally, so that we can learn how to catch them. We’ll start just by using try blocks to prevent code from crashing if errors are encountered; then, we’ll catch these errors and react accordingly.

## The Try Statement {#The-Try-Statement-3075} 

To experiment with catching errors, we need an error to catch. Let’s start with something simple: trying to convert a non-numeric string to an integer. What happens if we do this without any error handling?

In Figure 3.5.1, we’re given an error on line 3, the attempted type conversion. Notice that line 2 still runs and prints this statement, but line 5 does not run because the error arises on line 3. For now, all we want to do is prevent our code from crashing when it tries (see why it’s called a try statement?) to do perform this type conversion. However, Python is not a language that allows try without catch (or alternatively, finally), so we need to include both. We’ll talk more extensively about the catch in the next section.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "This string is not a number!"
print("Converting myString to int...")
myInt = int(myString)
print(myInt)
print("Done!")'>
</i-sandbox-py>

**Figure 3.5.1**

In Figure 3.5.2, we’ve added the line try: on line 3, following the comment. Like all other control structures, the colon indicates a code block for this statement to control, and all indented code following this line falls within this block. So, the computer starts executing the lines of code in the try block. It runs line 4, then attempts to run line 5. Line 5 still generates an error. Instead of crashing as before, the computer instead knows it’s inside a try block, and so it should look to see if the catch on line 8 actually accepts this error; except is Python’s word to indicate a catch block. As we’ll see next section, this does catch the error, so it jumps into line 9, the first line inside the catch block. Line 9 simply tells the computer to continue with the keyword pass, and so it runs line 10, then closes. We haven’t resolved the error in line 5, but we’ve allowed our program to recover from it.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "This string is not a number!"
#Run the code below until an error occurs
try:
	print("Converting myString to int...")
	myInt = int(myString)
	print(myInt)
#If an error occurs, jump to here
except:
	pass
print("Done!")'>
</i-sandbox-py>

**Figure 3.5.2**

This is the essence of the try block. If an error occurs inside of it, the computer checks if that type of error is caught. If so, it jumps into the catch block and runs the code there, then continues as if no error occurred. If not, it crashes as usual.

## Catching Any Error {#Catching-Any-Error-3076} 

In Python, the catch block (which we’ll now call the except block) starts with the keyword except. In speech, we can think of this as saying, “try this, except if this error happens...” We had an except block in the previous code by necessity: Python won’t allow a try block without an except block. However, it didn’t do anything; we used the keyword pass to skip on to the next line of code. Let’s now make it actually do something.

As we can see in Figure 3.5.3, adding the print statement on line 9 into the body of the except block runs it when the code hits an error. The code runs until line 5 and hits the same error as before. It checks line 8 to see if the error was properly handled. It is, so it runs line 9, then proceeds to line 10. The code in line 9 runs if any error is encountered.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "This string is not a number!"
#Run the code below until an error occurs
try:
	print("Converting myString to int...")
	myInt = int(myString)
	print(myInt)
#If an error occurs, jump to here
except:
	print("Cannot convert; myString is not a number.")
print("Done!")'>
</i-sandbox-py>

**Figure 3.5.3**

## Catching a Specific Error {#Catching-a-Specific-Error-3077} 

Note that the way we’ve written Figure 3.5.3, _any_ error will be caught by this except block. If we don’t specify a type of error to catch, the except block will catch any error. So, take a look at what happens if we add a different error earlier in the try block in Figure 3.5.4.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "This string is not a number!"
#Run the code below until an error occurs
try:
	print("Converting myString to int...")
	print("String #" + 1 + ": " + myString)
	myInt = int(myString)
	print(myInt)
#If an error occurs, jump to here
except:
	print("Cannot covert; myString not a number.")
print("Done!")'>
</i-sandbox-py>

**Figure 3.5.4**

Line 5 here has a different error: it tries to cast an integer to a string implicitly instead of explicitly. If you don’t understand why this is an error, glance back at Chapter 2.2, but you’re also safe to continue as long as you remember that line 5, as written, will cause an error. To write line 5 successfully, we would need to write str(1) or “1”, not just the number 1 (unless we use commas instead of addition signs). However, our error handling code was written to catch _any_ error, and so this error is caught, too. The message printed by the except block is inaccurate because this error clearly wasn’t the one we expected. To avoid this, we should instead catch a _specific_ error. Line 6 would generate a ValueError, so if that’s the error we expect, let’s catch that one specifically, as shown in Figure 3.5.5.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "This string is not a number!"
#Run the code below until an error occurs
try:
	print("Converting myString to int...")
	print("String #" + 1 + ": " + myString)
	myInt = int(myString)
	print(myInt)
#If a ValueError occurs, jump to here
except ValueError:
	print("Cannot covert; myString not a number.")
print("Done!")'>
</i-sandbox-py>

**Figure 3.5.5**

The error that arose on line 5 wasn’t a ValueError (but rather, a TypeError), and so this except block didn’t run. Adding the term ValueError after except tells it to only run this except block for a ValueError. Because a TypeError occurs before a ValueError, the try block stops executing before a ValueError occurs. If we remove the line that gives us the TypeError, this code still runs as before, as shown in Figure 3.5.6. The error that arose, a ValueError, _was_ caught by the except statement on line 8.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "This string is not a number!"
#Run the code below until an error occurs
try:
	print("Converting myString to int...")
	myInt = int(myString)
	print(myInt)
#If a ValueError occurs, jump to here
except ValueError:
	print("Cannot covert; myString not a number.")
print("Done!")myString = "This string is not a number!"
#Run the code below until an error occurs
try:
	print("Converting myString to int...")
	myInt = int(myString)
	print(myInt)
#If a ValueError occurs, jump to here
except ValueError:
	print("Cannot covert; myString not a number.")
print("Done!")myString = "This string is not a number!"
#Run the code below until an error occurs
try:
	print("Converting myString to int...")
	myInt = int(myString)
	print(myInt)
#If a ValueError occurs, jump to here
except ValueError:
	print("Cannot ccovert; myString not a number.")
print("Done!")'>
</i-sandbox-py>

**Figure 3.5.6**

We can also take this a step further: if we’re handling unexpected errors or we want to know a little more about why the error arose, we can further extend this to print information about the error itself, as shown in Figure 3.5.7.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "This string is not a number!"
#Run the code below until an error occurs
try:
	print("Converting myString to int...") 
	myInt = int(myString)
	print(myInt)
#If a ValueError occurs, jump to here
except ValueError as error:
	print(error)
print("Done!")'>
</i-sandbox-py>

**Figure 3.5.7**

An error is a data type like integers or strings, and so when we catch it, we can actually grab it as a variable. Adding as error to the end of the except statement means that inside the except block (but not after it, its scope is only inside the except block), we can treat the error as a variable, named error (or whatever variable name we placed after as). We can save it to a file, print it to the console, or access other information about the error. Now instead of printing our prewritten statement, the except block prints whatever it would have printed to the console while crashing by printing error. We get the same information.

## Catching Multiple Specific Errors {#Catching-Multiple-Specific-Errors-3078} 

This except block is a lot like saying, “if a ValueError was detected, then...” It’s similar to a conditional. Remember, with conditionals, we could also chain together multiple elif statements to check multiple conditions. We can do that here, too. Let’s bring back the line that triggered a TypeError, and catch both in Figure 3.5.8.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "This string is not a number!"
#Run the code below until an error occurs
try:
	print("Converting myString to int...")
	print("String #" + 1 + ": " + myString)
	myInt = int(myString)
	print(myInt)
#If an error occurs, check if it is a ValueError
except ValueError as error
	print(error)
#If an error occurs, check if it is a TypeError
except TypeError as error:
	print(error)
print("Done!")'>
</i-sandbox-py>

**Figure 3.5.8**

Just like chaining together elif statements, we can chain together except statements, as seen on lines 9 and 12. Here, we catch either a TypeError (line 12) or a ValueError (line 9). However, if a different kind of error still occurs, it remains uncaught, as shown in Figure 3.5.9.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "This string is not a number!"
#Run the code below until an error occurs
try:
	print("Converting myString to int...")
	print(1 / 0)
	print("String #" + 1 + ": " + myString)
	myInt = int(myString)
	print(myInt)
#If an error occurs, check if it is a ValueError
except ValueError as error
	print(error)
#If an error occurs, check if it is a TypeError
except TypeError as error:
	print(error)
print("Done!")'>
</i-sandbox-py>

**Figure 3.5.9**

If we add a random division-by-zero on line 5, the code still crashes because ZeroDivisionError is not one of the types of errors our except statements can handle. Note, however, that if this uncaught type of error were to occur _after_ a caught type of error occurs, it would not be a problem because the line causing the uncaught error would never run. The code jumps to the except statements the _first_ time an error is encountered, and does not come back. So, if we move it to the end, we see the code will end gracefully again, as shown in Figure 3.5.10.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "This string is not a number!"
#Run the code below until an error occurs
try:
	print("Converting myString to int...")
	print("String #" + 1 + ": " + myString)
	myInt = int(myString)
	print(myInt)
	print(1 / 0)
#If an error occurs, check if it is a ValueError
except ValueError as error:
	print(error)
#If an error occurs, check if it is a TypeError
except TypeError as error:
	print(error)
print("Done!")'>
</i-sandbox-py>

**Figure 3.5.10**

Note as well that there are a couple more advanced ways we can handle this. We could, for instance, have single except blocks that handle multiple kinds of errors, but not _all_ kinds of errors. We could also have a series of except blocks that handle specific errors, followed by a catch-all except block at the end that handles any others. Figure 3.5.11 shows both.

In Figure 3.5.11, line 11 catches either a TypeError or a ValueError. We can specify multiple errors to catch by listing them in parentheses, separated by commas. We use the same syntax for then assigning the error to a variable. So, in Figure 3.5.11, a TypeError occurs first (on line 5), and so the except statement on line 11 activates.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "This string is not a number!"
#Run the code below until an error occurs
try:
	print("Converting myString to int...")
	print("String #" + 1 + ": " + myString)
	myInt = int(myString)
	print(myInt)
	print(1 / 0)
#If an error occurs, check if it is a ValueError or TypeError
except (ValueError, TypeError) as error:
	print("A ValueError or TypeError occurred.")
#Check if some other type of error occurred
except Exception as error:
	print("Some other type of error occurred.")
print("Done!")'>
</i-sandbox-py>

**Figure 3.5.11**

In Figure 3.5.12, we moved the divide-by-zero error back up to line 5. As a result, it’s encountered first. It’s not a TypeError or ValueError, so the except statement in line 11 ignores it, and the computer moves on and checks the except statement in line 14. This except block catches any other error, so this one is activated, and the computer prints that some other error occurred. Note that this line also shows you how to catch any kind of error and assign it to a variable: instead of specifying an error type like ValueError, just use the word Exception. The line except Exception: works the same as except: on its own because Exception is the “umbrella” over all the different kinds of errors. Using it, however, lets us add as error to the end. 

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "This string is not a number!"
#Run the code below until an error occurs
try:
	print("Converting myString to int...")
	print(1 / 0)
	print("String #" + 1 + ": " + myString)
	myInt = int(myString)
	print(myInt)
#If an error occurs, check if it is a ValueError or TypeError
except (ValueError, TypeError) as error:
	print("A ValueError or TypeError occurred.")
#Check if some other type of error occurred
except Exception as error:
	print("Some other type of error occurred.")
print("Done!")'>
</i-sandbox-py>

**Figure 3.5.12**

## 4. Else and Finally in Python {#4-Else-and-Finally-in-Python-1524} 

At this point, we’ve tried some code and caught any errors that arose while that code was running. In some languages, that’s all there is. In many languages, there’s an additional block called finally, which runs some code whether an error occurred or not. Python also adds an additional option: remember else from conditionals? We can use else here as well!

## Else for Error Handling {#Else-for-Error-Handling-3079} 

To use an else with error handling, we add it after all the except blocks. Figure 3.5.13 shows an example of what this looks like.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "1"
#Run the code below until an error occurs
try:
	print("Converting myString to int...")
	myInt = int(myString)
	print(myInt)
#If an error occurs, check if it is a ValueError or TypeError
except (ValueError, TypeError) as error:
	print("A ValueError or TypeError occurred.")
#Check if some other type of error occurred
except Exception as error:
	print("Some other type of error occurred.")
#If no errors occurred, then do the following
else:
	print("No errors occurred!")
print("Done!")'>
</i-sandbox-py>

**Figure 3.5.13**

Note that here, I’ve changed myString to actually hold a number, specifically so that an error does _not_ arise. The goal of this code is to show that an else block at the end of a sequence of try and except blocks runs some code if and only if _no_ errors arose. Colloquially, we can think of each except block as, “if this error occurs, then...,” and the else block at the end is like the else after a series of elif blocks. The else is in reply to the except blocks: if any of them run, the else block won’t run. If none of them run, the else block will run.

You might ask, as I did when I was first learning Python, why we need an else block—why not just include that code inside the try block itself? Much of the time, we can without making a practical difference in how our program runs. However, we can use this more stylistically. In many languages, it’s normal to have huge blocks of code in a try block, even though the expected errors are only in one or two places. The else block lets us restrict our try block to only the code that we expect to generate an error. The else block will _only_ run if no errors were encountered, so we can trust everything that was written in the try block ran successfully.

## Else and File Input {#Else-and-File-Input-3080} 

A good example of this is file input. Whenever we load some data from a file, we want to enclose the attempt to load the file in a try block because file input commonly raises errors; some languages even require file input to happen inside a try block. Figure 3.5.14 shows what that looks like without an else statement; this code loads a file, then prints everything in the file.

<i-sandbox-py  page-slug="__temp_slug__" code='try:
	#Open InputFile.txt in read-only mode
	inputFile = open("InputFile.txt", mode = "r")
	#For each line in the file
	for line in inputFile:
		#Print the line
		print(line)
	#Close the file
	inputFile.close()
#Catch an IOError
except IOError as error:
	print("An input error occurred!")'>
</i-sandbox-py>

**Figure 3.5.14**

Before talking about the try and catch, let’s take some time just to understand file input. We’ll talk about it more in Unit 4, but we can discuss it a little in the mean- time. The open() function on line 3 takes as input a filename. Optionally, it can also take a mode as a keyword parameter: here, the mode “r” means read-only, which means we can read the contents of the file but not write to it. Once we’ve loaded the file into a variable (another data type, file!), we can read one line at a time with a for-each loop.

Here, we catch an input–output error on line 11, called an IOError, if an error arises inside the try block. However, the only place where an IOError can happen is when we read from or write to a file. That only technically happens on line 3; this line loads the file into the program, and lines 5 and 7 just print it. So, really, we only need to catch an IOError that arises on line 3; it can’t arise elsewhere. So, while the code we have right now is fine, it would be great to narrow down where the error could have arisen.

<i-sandbox-py  page-slug="__temp_slug__" code='try:
	#Open InputFile.txt in read-only mode
	inputFile = open("InputFile.txt", mode = "r")
#Catch an IOError
except IOError as error:
	print("An input error occurred!")
else:
	#For each line in the file
	for line in inputFile:
		#Print the line
		print(line)
	#Close the file
	inputFile.close()'>
</i-sandbox-py>

**Figure 3.5.15**

The code in Figure 3.5.15 will do the same thing, but it’s a little bit better organized. The try block contains only those lines of code that _need_ to be in the try block, and lines that rely on that code are in the else block. What happens if we try to run this with a filename that doesn’t exist?

<i-sandbox-py  page-slug="__temp_slug__" code='try:
	#Open InputFile.txt in read-only mode
	inputFile = open("FakeInputFile.txt", mode = "r")
#Catch an IOError
except IOError as error:
	print("An input error occurred!")
else:
	#For each line in the file
	for line in inputFile:
		#Print the line
		print(line)
	#Close the file
	inputFile.close()'>
</i-sandbox-py>

**Figure 3.5.16**

As shown in Figure 3.5.16, the error is caught! We see the text in the output came from line 6 in the code. Because the error was caught, the else block doesn’t execute, so we _don’t_ see any attempt to read the non-existent file in the output. This could be read as, “If an IOError occurs, print ‘An input error has occurred!’; else, print the file using this loop.”

## Finally {#Finally-3081} 

Finally, we come to the finally block. As mentioned previously, the finally block is for code that needs to run regardless of whether an error was detected or not. With this block, we are now able to cover every possible situation:

* The try block contains the code to attempt.
* The except blocks contain the code to run if and only if an expected error type occurs.
* The else block contains the code to run if and only if no errors occur.
* The finally block contains the code to run regardless of whether or not an error occurred.

When would we need a finally block? Imagine if we expected a file to just contain numbers. When we originally load a line of text from this file, the line of text is stored as a string, and we want to convert it to an integer. Then, the error we would anticipate would be a ValueError, which is what would arise on line 7 of Figure 3.5.17 if one of the lines of the file was _not_ an integer. 

<i-sandbox-py  page-slug="__temp_slug__" code='#Open InputFile.txt in read-only mode
inputFile = open("NumberFile.txt", mode = "r")
try:
	#For each line in the file
	for line in inputFile:
		#Print the line
		print(int(line))
#Catch an IOError
except ValueError as error:
	print("A value error occurred!")
else:
	print("No errors occurred!")
finally:
	#Close the file
	inputFile.close()'>
</i-sandbox-py>

**Figure 3.5.17**

In practice, we would also want to anticipate the IOError from before, but we’ll remove that for now to demonstrate the finally block. However, even if a ValueError occurs, we still want to close the file! So, regardless of whether an error arises or not, we put the close() method call in the finally block, as shown in Figure 3.5.17.

Notice a few things here. First, notice we moved the line opening the file (now line 2) outside the try block. We’re no longer expecting an error here (for now, we’re ignoring the error we might expect here), so it doesn’t need to be in the try. Notice that we kept the loop (lines 4 through 7) inside the try block, even though the error can only occur when we’re performing the type conversion. Technically, we could put the try block _inside_ the loop! We’ll try that later.

The main takeaway here, though, is that the code in the finally block is run regardless of whether any errors occurred or not. This code will call inputFile. close() regardless of whether an error was encountered converting the file or not. Now, this might leave you with a question: couldn’t we instead just put the code we want to run regardless _after_ the error handling blocks? Won’t the code just jump back out after it’s done and hit that line of code anyway? In other words, how is using the finally block any different from just putting inputFile.close() on line 13, unindented, as shown in Figure 3.5.18? The answer is that finally has a special behavior when it comes to uncaught errors.

<i-sandbox-py  page-slug="__temp_slug__" code='#Open InputFile.txt in read-only mode
inputFile = open("NumberFile.txt", mode = "r")
try:
	#For each line in the file
	for line in inputFile:
		#Print the line
		print(int(line))
#Catch an IOError
except ValueError as error:
	print("A value error occurred!")
else:
	print("No errors occurred!")
#Close the file
inputFile.close()'>
</i-sandbox-py>

**3.5.18**

## Finally and Uncaught Errors {#Finally-and-Uncaught-Errors-3082} 

After the computer tries the code in the try block (lines 4 through 7 in Figure 3.5.18 and runs the code in either the except block (line 10, if there was an error) or the else block (line 12, if there wasn’t an error), won’t it just proceed to run the inputFile.close() line? The answer is: kind of. The finally block has one special feature. If there were errors in the try block that were _not_ handled by the except blocks, then the finally block _still_ runs. Here, we’re catching a ValueError on line 9, but no other types of errors; if a TypeError were to occur inside the try block, it would not be caught, but the finally block would _still_ run.

Let’s go back to our example from Figure 3.5.10. Remember when we had except blocks for TypeErrors and ValueErrors, but a ZeroDivisionError occurred? Our code still crashed in Figure 3.5.10; and even with a finally block, it will still crash. However, a finally block lets us do some things first.

The result of using a finally block is shown in Figure 3.5.19. The ZeroDivisionError isn’t caught, but because it still occurred inside a try block, our finally block _still_ runs. In the output, you see the error message, starting with “Traceback”, but you also see the text printed by line 16 _after_ the error is printed. You might notice also that this is almost the same result as including except Exception: at the end, as shown in Figure 3.5.13. However, with except and finally, our code still crashes after it runs the code inside the finally block. This is useful during debugging: when debugging, we want to know that our code crashes, but we want the opportunity to find out why, too. The finally block lets us print why, then crashes anyway.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "This string is not a number!"
#Run the code below until an error occurs
try:
	print("Converting myString to int...")
	print(1 / 0)
	print("String #" + 1 + ": " + myString)
	myInt = int(myString)
	print(myInt)
#If an error occurs, check if it is a ValueError
except ValueError as error:
	print(error)
finally:
	print("An unknown error occurred!")
print("Done!")'>
</i-sandbox-py>

**Figure 3.5.19**

## Nested Try-Catch-Else-Finally {#Nested-Try-Catch-Else-Finally-3083} 

Earlier we said we would temporarily remove the check for IOError to show off finally. However, in practice we would still want to check that while opening the file, while also checking for a TypeError while reading and converting the file. If an IOError occurred, we don’t even want to try reading or closing the file; but, if a TypeError occurred, we still want to close the file. How do we do this?

By now, you’ve seen nested control structures several times, so we won’t belabor the point. The conclusion is: we can put a try block inside another try block, as shown in Figure 3.5.20. Our outer try block, starting on line 1, checks whether or not the file was successfully opened on line 3; if it wasn’t then an IOError is raised, and so we just need to print that the file was not opened in the except block on lines 18 and 19. If it was successfully opened (i.e., if line 3 didn’t cause an error), then the inner try block checks if the conversions were successfully run. If they were, that means that no errors were encountered, and so it reports that they were converted on line 13; if they weren’t, it means an error was encountered, so it reports that they weren’t converted on line 11. Either way, it needs to close the file, so it does so on line 16 inside the finally block. In Figure 3.5.20, we see the code running with a file of all integers, so no errors occur.

<i-sandbox-py  page-slug="__temp_slug__" code='try:
	#Open NumberFile.txt in read-only mode
	inputFile = open("NumberFile.txt", mode = "r")
	try:
		#For each line in the file
		for line in inputFile:
			#Print the line
			print(int(line))
	#Catch a ValueError
	except ValueError as error:
		print("A value error occurred!")
	else:
		print("No errors occurred converting the file!")
	finally:
		#Close the file
		inputFile.close()
#Catch an IOError
except IOError as error:
	print("An error occurred reading the file!")'>
</i-sandbox-py>

**Figure 3.5.20**

Notice that line 16 is only reachable if the file was opened successfully; if it wasn’t opened successfully on line 3, then execution would be kicked to line 18, skipping lines 4 through 16. By placing the inputFile.close() function call here, we guarantee we only try to close the file if it was previously opened.

Figure 3.5.21 shows the code running with a file of non-integers. An error occurs in the inner try block and is caught as a ValueError when the code tries to convert a string without an integer into an integer. So, “A value error occurred!” is printed, but the file is still closed by line 16 because of the finally block.

<i-sandbox-py  page-slug="__temp_slug__" code='try:
	#Open InputFile.txt in read-only mode
	inputFile = open("InputFile.txt", mode = "r")
	try:
		#For each line in the file
		for line in inputFile:
			#Print the line
			print(int(line))
	#Catch a ValueError
	except ValueError as error:
		print("A value error occurred!")
	else:
		print("No errors occurred converting the file!")
	finally:
		#Close the file
		inputFile.close()
#Catch an IOError
except IOError as error:
	print("An error occurred reading the file!")'>
</i-sandbox-py>

**Figure 3.5.21**

Finally, Figure 3.5.22 shows the code running with an input file that doesn’t exist. The error occurs on line 3, which is in the outer try block, so it is caught as an IOError by line 18. So, “An error occurred reading the file!” is printed. The file doesn’t need to be closed because it was never successfully opened in the first place, and similarly, no ValueErrors could occur because the try block quit before reaching line 8.

<i-sandbox-py  page-slug="__temp_slug__" code='try:
	#Open FakeFile.txt in read-only mode
	inputFile = open("FakeFile.txt", mode = "r")
	try:
		#For each line in the file
		for line in inputFile:
			#Print the line
			print(int(line))
	#Catch a ValueError
	except ValueError as error:
		print("A value error occurred!")
	else:
		print("No errors occurred converting the file!")
	finally:
		#Close the file
		inputFile.close()
#Catch an IOError
except IOError as error:
	print("An error occurred reading the file!")'>
</i-sandbox-py>

**Figure 3.5.22**

## 5. Error Handling and Other Control Structures {#5-Error-Handling-and-Other-Control-Structures-1525} 

Recall that early in our material, we covered some common types of errors such as TypeError and NameError. Since then, we’ve encountered some others, like IOError and ValueError. Remember, when we first went over these, we stated that you wouldn’t necessarily understand them all right away: rather, they were provided early so you could keep going back to them. I’d advise going back to them now as well with your new knowledge of programming and errors in general. You may also read a complete listing of Python’s error types here: https://docs.python. org/3/library/exceptions.html.

As we close our conversation on control structures, let us look at how error handling integrates with the other control structures that we have seen.

## Error Handling and For Loops {#Error-Handling-and-For-Loops-3084} 

Recall as briefly mentioned earlier that because a for loop was itself enclosed in a try block, one single error on any iteration of the loop would cause the execution of the program to jump to the error handling statements. So, the code would read from the file until it found a non-integer line, and then it would quit, as shown in Figure 3.5.23. This file contains some lines with integers, then some without.

<i-sandbox-py  page-slug="__temp_slug__" code='try:
	#Open NumberAndLetterFile.txt in read-only mode
	inputFile = open("NumberAndLetterFile.txt", mode = "r")
	try:
		#For each line in the file
		for line in inputFile:
			#Print the line
			print(int(line))
	#Catch a ValueError
	except ValueError as error:
		print("A value error occurred!")
	else:
		print("No errors occurred converting the file!")
	finally:
		#Close the file
		inputFile.close()
#Catch an IOError
except IOError as error:
	print("An error occurred reading the file!")'>
</i-sandbox-py>

**Figure 3.5.23**

As we see in Figure 3.5.23, the code runs just fine for the first two lines of the file, which have integers (1 and 2). The third line of the file does not have an integer, so it jumps to the except block, which ends execution and prints that a ValueError has occurred. What if we wanted it to only skip the current iteration, though, and then keep reading the file? To do that, we could switch the order: instead of putting the for loop inside the try block, we could put the try block inside of the for loop, as shown in Figure 3.5.24.

<i-sandbox-py  page-slug="__temp_slug__" code='try:
	#Open NumberAndLetterFile.txt in read-only mode
	inputFile = open("NumberAndLetterFile.txt", mode = "r")
	#For each line in the file
	for line in inputFile:
		try:
			#Print the line
			print(int(line))
		#Catch a ValueError
		except ValueError as error:
			print("A value error occurred!")
		else:
			print("No errors occurred converting the file!")
	#Close the file
	inputFile.close()
#Catch an IOError
except IOError as error:
	print("An error occurred reading the file!")'>
</i-sandbox-py>

**Figure 3.5.24**

How will Figure 3.5.24’s execution differ? Recall that when our code runs, the code inside the try block will run. If an error arises, it will jump into the except block. If no error is found by the conclusion of the try block, it will jump into the else block. Either way, it will then run the finally block, if present. What happens after that? After that, execution moves on to the next line of code outside of the try-except-else-finally structure.

However, in Figure 3.5.24, that try-except-else structure is in a loop. When we reach the end of an iteration of the loop, execution jumps back to the loop and asks, “Are the loop’s conditions fulfilled?” If so, the loop ends. If not, it does not. Whether an error was raised or not, the loop is not done. The try, except, and else blocks were all inside the loop, so when the code jumps to the except block, it’s still jumping inside the loop. Previously, when it jumped to the except block, it was jumping out of the loop. Now, it’s jumping within the loop, so an error does not interfere with the loop touching each line of the file. In Figure 3.5.24, we can tell this is happening because the code continues running after hitting an error: specifically, it encounters _two_ errors because the third and fourth lines _each_ have non-integer contents, so _each_ cause an error. Previously, encountering an error terminated the loop, so it would be impossible to encounter two errors.

## Error Handling and Functions {#Error-Handling-and-Functions-3085} 

What happens if an error arises in a function that you write? There are two ways we might handle that: we could handle it inside the function body, or we could handle it in the code that makes the function call. Let’s look at both, using a silly function we’ll write specifically to create errors: divideByZero().

<i-sandbox-py  page-slug="__temp_slug__" code='#Attempts to divide by zero
def divideByZero():
	try:
		print(1 / 0)
	except Exception as error:
		print(error)
print("About to encounter an error...")
divideByZero()
print("We just encountered an error!")'>
</i-sandbox-py>

**Figure 3.5.25**

In Figure 3.5.25, we catch the error inside the function. When the function is called, it attempts to execute line 4, fails, and jumps into the except block. It prints the error on line 6. Then, it jumps back to the main program, and runs the final print statement on line 10.

What happens if we put the error handling directly in the code that calls the function? As shown in Figure 3.5.26, we get effectively the same result. The error occurs inside the function, but because it isn’t caught inside the function, it comes back out to the main program. There, it does get caught. That’s a pretty advanced principle, so don’t worry if it’s a bit confusing. The point is that if an error happens in a function, it will keep “rising” until it is handled. If it’s never handled, the program crashes.

<i-sandbox-py  page-slug="__temp_slug__" code='#Attempts to divide by zero
def divideByZero():
	print(1 / 0)
print("About to encounter an error...")
try:
	divideByZero()
except Exception as error:
	print(error)
print("We just encountered an error!")'>
</i-sandbox-py>

**Figure 3.5.26**

## 6. Error Handling and Turtles {#6-Error-Handling-and-Turtles-1526} 

We’ve been developing code that allows a user using the command line to control the turtle in the turtle window. However, we’ve noted a couple times that there was a weakness. While our code could intelligently react if the user entered an invalid command, it could not intelligently react if the user entered an invalid argument. When prompted for distance, angle, or number of sides, if the user entered a non-numerical input, the program crashed.

We now have the means to fix that. We’ll keep things relatively simple and say that if a user enters an invalid argument, they are kicked back out to the first menu.

## Error Handling and Turtles {#Error-Handling-and-Turtles-3086} 

Our goal to start with is to rerun the loop from scratch if an error is encountered. We don’t want to quit the entire program if the user enters invalid input, but right now we’re not worried about just repeating the same questions until we get the right answer. So, in that case, we can wrap the entire series of conditionals in one giant try block, as shown in ErrorHandlingandTurtles.py on line 24.

We added only a couple lines–line 24, 64, and 65, as well as indenting the lines after 24–but their impact is powerful. Now, if the user accidentally enters a letter instead of a number, the code doesn’t just quit and crash; it tells them that the input was invalid, but it lets them try again. That’s immensely powerful. Now, the only way to exit the program is to type end when prompted. It’s far less likely for someone to do _that_ by accident than accidentally enter a letter when they should enter a number.

## Error Handling and Functions with Turtles {#Error-Handling-and-Functions-with-Turtles-3087} 

However, note that this still isn’t ideal. The ideal approach would be to instead keep repeating that one specific query until the user puts in some valid input. If a user selects the snowflake command and enters “5,” “100,” and then accidentally types “3p” instead of “30,” it should not send them all the way back to the beginning to enter “snowflake,” “5,” and “100” again. Instead, it should simply ask them to try again on that last prompt.

With what we have in ErrorHandlingandTurtles.py, though, that’s extremely difficult. We could wrap each individual input statement in a try block, but that would add a lot of mess to our code. More importantly, it still wouldn’t help; after executing the except block for these try blocks, the code would continue. It wouldn’t be able to draw without getting the argument and it couldn’t go back and get the argument, so it would return to the beginning of the loop again.

So, how can we force the user to keep answering a _single prompt_ until an integer is correctly entered? Beware, things are about to get complicated. Don’t worry if this confuses you at first. This might not make total sense for a long time. You can see the implementation of this in ErrorHandlingandFunctionswithTurtlesRecursion.py.

We’ve actually only made two general changes to create ErrorHandlingandFunctionswithTurtles-Recursion.py from ErrorHandlingandTurtles.py:

1.  We added the getIntegerInput() function at the top.
2.  We replaced all the calls to input() inside our main code with calls to getIntegerInput().

We also removed a couple type conversions that aren’t needed anymore, and our error handling code which isn’t needed anymore either. However, even though these are only a couple changes, what we’ve changed is profound. First, instead of relying on Python’s built in input() function, we’ve built our own. It still uses Python’s input() function, we’ve built some reasoning around it. And because we’ve put it in a function, we can refer to it wherever we were referring to Python’s input() function. This has the practical effect of being _like_ putting these try and except blocks all over our program: we keep referring to a function that has these try and except blocks built in.

The more profound thing we’ve done here, though, is how we’ve structured our getIntegerInput() function. We get the user’s input, try to convert it to an integer, and then _if it works_, we return it. So, if we return from here, we know it’s an integer, and the user’s input was valid.

## Error Handling and Functions with Turtles II {#Error-Handling-and-Functions-with-Turtles-II-3088 .sr-only} 

What happens if the user enters invalid input, like a letter? That generates an error on the second line of the try block. That means the program jumps down to the except block. It tells the user to enter an integer, and then it does something clever: it _runs_ getIntegerInput() _again_, with the same prompt. Don’t worry if this is confusing; we’re previewing the advanced topic of recursion from the last unit of our course.

Essentially, when execution reaches the second line of the except block, it creates _another copy_ of getIntegerInput(), and runs that. So, we repeat exactly what we just did. If the user enters valid input the second time, then the second copy of the function returns that input. The first copy basically says, “return whatever the second copy returns.” If the user enters invalid input the second time, too, then execution creates a _third_ copy, and the second copy says, “return whatever the third copy returns.” So, as long as the user keeps entering invalid input, it keeps creating an extra copy, and each copy returns whatever the copy it creates returns.

It’s like a while loop, and in fact, we _could_ implement this in a while loop. ErrorHandlingandFunctionswithTurtles-While.py shows how.

In ErrorHandlingandFunctionswithTurtles-While.py, we’re doing effectively the same thing: getting input from the user, checking if it’s an integer, and repeating the request if not. The main difference is that instead of a function creating another copy of itself, this relies on us knowing that there is an isdigit() function that checks if a string holds a digit. So, we’ve actually _removed_ error handling from this code by checking if an error will arise preemptively.

This is the most complicated thing we’ve covered so far (especially the first version of doing this), so don’t worry if you’re a little lost. The main takeaway here is the type of complexity we’re starting to build into our program. Lots of functions, helper functions, replacing built-in functions—we’re getting pretty advanced.

