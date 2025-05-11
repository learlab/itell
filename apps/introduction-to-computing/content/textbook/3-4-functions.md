---
assignments:
- summary
chunks:
- title: 1. What is a Function?
  slug: 1-What-is-a-Function?-1636
  type: plain
- title: Power of Functions
  slug: Power-of-Functions-3409
  type: regular
- title: 'Function Terminology: Calls and Definitions'
  slug: Function-Terminology-Calls-and-Definitions-3410
  type: regular
- title: Parts of a Function Definition
  slug: Parts-of-a-Function-Definition-3411
  type: regular
- title: Parts of a Function Call
  slug: Parts-of-a-Function-Call-3412
  type: regular
- title: 2. An Analogy for Functions
  slug: 2-An-Analogy-for-Functions-1637
  type: plain
- title: Setting Up the Analogy
  slug: Setting-Up-the-Analogy-3413
  type: regular
- title: The Function Definition
  slug: The-Function-Definition-3414
  type: regular
- title: The Function Call
  slug: The-Function-Call-3415
  type: regular
- title: Bigger Functions
  slug: Bigger-Functions-3416
  type: regular
- title: 3. Simple Functions in Python
  slug: 3-Simple-Functions-in-Python-1638
  type: plain
- title: The Function Definition
  slug: The-Function-Definition-3417
  type: regular
- title: The Function Call
  slug: The-Function-Call-3418
  type: regular
- title: 4. Functions with Returns and Parameters in Python
  slug: 4-Functions-with-Returns-and-Parameters-in-Python-1639
  type: plain
- title: A Function with a Return
  slug: A-Function-with-a-Return-3419
  type: regular
- title: A Function with a Parameter
  slug: A-Function-with-a-Parameter-3420
  type: regular
- title: A Function with Multiple Parameters
  slug: A-Function-with-Multiple-Parameters-3421
  type: regular
- title: 5. Common Function Errors in Python
  slug: 5-Common-Function-Errors-in-Python-1640
  type: plain
- title: Parameter Mismatch
  slug: Parameter-Mismatch-3422
  type: regular
- title: Scope Error
  slug: Scope-Error-3423
  type: regular
- title: 6. Advanced Python Functions
  slug: 6-Advanced-Python-Functions-1641
  type: plain
- title: Using Keyword Parameters
  slug: Using-Keyword-Parameters-3424
  type: regular
- title: Creating Keyword Parameters
  slug: Creating-Keyword-Parameters-3425
  type: regular
- title: 7. Functions and Turtles
  slug: 7-Functions-and-Turtles-1642
  type: plain
- title: The Shape Function
  slug: The-Shape-Function-3426
  type: regular
- title: The Snowflake Function
  slug: The-Snowflake-Function-3427
  type: regular
cri:
- question: Why are functions considered extremely powerful?
  answer: Functions allow code to be packaged up into a mini-program that can be called from different places, increasing code organization and reuse.
  slug: Power-of-Functions-3409
- question: What is a function call?
  answer: A function call is the place where we actually use, or 'call,' a function in our code.
  slug: Function-Terminology-Calls-and-Definitions-3410
- question: What are the main parts of a function definition?
  answer: A function definition consists of a header, a body, and a return statement.
  slug: Parts-of-a-Function-Definition-3411
- question: What happens when a function is called in programming?
  answer: The code execution jumps to the function, runs its code, and then returns to the main code with the output.
  slug: Parts-of-a-Function-Call-3412
- question: What is the function definition in the analogy provided?
  answer: The declaration by the company of what their job will be.
  slug: Setting-Up-the-Analogy-3413
- question: What is the body of the function?
  answer: Addison knows how to add two numbers; that’s the body of the function.
  slug: The-Function-Definition-3414
- question: What is the purpose of using functions in programming?
  answer: By packaging code together and calling it when needed, functions make it easier to revise and enhance programs over time.
  slug: The-Function-Call-3415
- question: What is the main takeaway about functions discussed in the passage?
  answer: Functions are like miniature programs with their own input and output, defined by a header and a body, and are used to build complicated programs.
  slug: Bigger-Functions-3416
- question: What does the function 'printYen()' do?
  answer: It prints the character '¥' without a new line afterward.
  slug: The-Function-Definition-3417
- question: When does the body of a function get executed in Python?
  answer: The body of a function is executed when the function is called, not when it is defined.
  slug: The-Function-Call-3418
- question: What does the function returnYen() do?
  answer: The function returnYen() returns the symbol '¥'.
  slug: A-Function-with-a-Return-3419
- question: What does the function returnYenAmount(10) output?
  answer: ¥10
  slug: A-Function-with-a-Parameter-3420
- question: What is the output of the function currencyAmount('GBP', 5)?
  answer: The output is '£5'.
  slug: A-Function-with-Multiple-Parameters-3421
- question: What happens if we don’t supply arguments for all parameters when calling a function?
  answer: The program will throw a TypeError indicating that a required positional argument is missing.
  slug: Parameter-Mismatch-3422
- question: What are keyword parameters and how do they differ from regular parameters?
  answer: Keyword parameters are parameters with assumed values that can be overridden by the function call, providing flexibility in defining specific values for certain parameters.
  slug: Using-Keyword-Parameters-3424
- question: How do we create keyword parameters in Python functions?
  answer: By including the parameter name and assigning it a value in the function declaration.
  slug: Creating-Keyword-Parameters-3425
- question: How can functions help keep code organized and flexible?
  answer: Functions allow us to separate different areas of the program, making it more organized, and provide flexibility in how they can be called.
  slug: The-Shape-Function-3426
- question: What is the benefit of putting drawShape() into its own function?
  answer: It allows for code reusability and organization in functional programming.
  slug: The-Snowflake-Function-3427
next_slug: 3-5-error-handling
order: 3
parent:
  title: 'Unit 3: Control Structures'
  slug: unit-3-control-structures
quiz: null
slug: 3-4-functions
title: 3.4 Functions
---

## 1. What is a Function? {#1-What-is-a-Function?-1636} 

A **function** is like a little program on its own. Like full programs, a function takes some input and produces some output. In that sense, functions are very simple. We could slap a function declaration (the line of code that tells the computer that the code that follows is a function) on top of any code we’ve written so far and call it a function. In fact, some languages (like Java) can’t do _anything_ outside a function.

## Power of Functions {#Power-of-Functions-3409} 

Despite their simplicity, functions are extremely powerful. We’ve talked about loops, which let us repeat some lines of code without repeating them. A loop sat in a single place in our code, though. What happens if we wanted to repeat the same loop in two different places? We would have to just copy the loop’s code to the second place! Not only is that inefficient, it means that if later we have to change that code, we have to remember to change it in two different places.

Functions change that. Functions let us take some code and package it up into a mini-program. Then, whenever we need to use that code, we just **“call” that function;** to call a function means to use it in some other code. Take our running example of validating a purchase. Instead of having to put that long, complex series of conditional statements anywhere we need to validate a purchase, we could instead create a function named validatePurchase() and call that function whenever we need to validate a purchase. Inside that function would be the same conditional statements, but we would only need to put it in one place: once it was there, we could refer to it from anywhere else.

To be honest, this topic is probably my favorite topic in this entire book. Functions are the first step that allow us to transition from the clever little bits of code we’ve been writing to writing real complete programs. In real programs, nearly every single segment of code will have a function call in it somewhere. The power of functions to support organization and reuse of code drastically increases what we can easily create.

## Function Terminology: Calls and Definitions {#Function-Terminology-Calls-and-Definitions-3410} 

Functions are likely the most complex topic we’ve discussed so far, and so they come with their own terminology. In order to discuss function terminology, let’s imagine a simple function for addition. The function would take as input two numbers, and produce as output their sum. This function is pretty trivial, but it will be useful to explain the concept: this function called add() will take two numbers as input, and return as output their sum. Notice that we’re describing this function the same way we described programming itself, lines of code that take in input and return output. Functions are like mini-programs, and we build big, complex programs out of lots of little simple “programs.” These little simple programs are functions.

We’ve already mentioned one term describing functions: a function call. A function call is the place where we actually use, or “call,” a function in our code. In our add() example, it’s the place where we say, “hey, add these two numbers!” You’ve no doubt seen function calls before in our material depending on the language. Things like printing text or converting between data types are often done via functions. These are function calls: you weren’t sure how the functions worked, but you didn’t need to know. To call the function, all you needed was to know what it would accomplish, what input to give it, and what to call it.

The opposite, in some ways, of the function call is the function definition, made of a function header and a function body. The function definition is what actually creates the function so that it can be called from other parts of code. It’s the place where we tell the computer, “Hey, if someone wants to add two numbers, here’s what input you’ll get, here are the steps to take, and here’s the result to give back to them.”

Going back to our analogy of functions as mini-programs, we can think of the function definition as the program’s code, and the function call as actually running the mini-program. Writing the function definition is like writing the code; it hasn’t run yet, but it’s there ready to be used. Calling the function is like running some code, and for that, you don’t necessarily have to understand how it works: you just have to know what it will do.

## Parts of a Function Definition {#Parts-of-a-Function-Definition-3411} 

The structure of **function definitions** differs from language to language, but most have some commonalities. First, most are made of a header and a body. The header names the function and states what input it will expect; the input is shown as a list of **parameters**. For a print() function, for example, the name is “print” and there is one parameter, the text to print. For our addition function, the name might be “add”, and it would have two parameters: the two numbers to add. In some languages, the function itself and each parameter will be given a type. This is all the **function header**: it defines the function as far as the rest of the program is concerned. It tells the rest of the program what name to call when it needs the function, and what information to pass along. That is all the rest of the program will need to know to use the function: it doesn’t have to know how the program works, it just needs to know what to call it and what to give it.

In most cases, the majority of the function definition is the code itself, called the **function body**. These are the actual lines of code that dictate what should be done when the function is called. These are the lines of code that would say, “Add these two numbers and store the result in sum, then return sum.” Generally, the function body isn’t seen by the rest of the code you’re writing outside the function. That code doesn’t need to see the body: it just needs to know what input to give and what the result will be. For our addition function, our main code doesn’t need to know _how_ the addition function adds two numbers; it just needs to trust that it does so accurately and returns the result.

The word return is key in that statement: it’s the other unique piece of a function. The return statement is where the function sends something back to the main program as output. When the code says, “Hey, add 5 and 2,” the function replies, “Hey, the answer is 7!” It returns its output, the number 7, to the main program. A return statement terminates that function and returns execution to the main program. When the addition function says, “Hey, the answer is 7!”, it’s done running.

So, these are the main parts of a function.

* A definition or header, which defines its name and what input it should expect. With our addition function, this might be the name “add” and the expectation of two numbers as parameters for input.
* A body, which are the actual lines of code that run when the function is called. With our addition function, this would be the lines of code to add two numbers and store the result.
* A return, which tells the function what to send back to the main program as output. With our addition function, this would tell the function to return the sum of the two numbers.

## Parts of a Function Call {#Parts-of-a-Function-Call-3412} 

Once we have that, we can call the function. Calling a function means that when our code reaches the line where we call the function, it jumps into and runs the function’s code. It runs the function’s code until it finds a return statement or the function otherwise ends, and then it returns and picks up where it left off in the regular code. So, in some ways, a function all is like saying, “Go to that other code over there, bring this input with you, and tell me what the output is!” The execution of the code then goes to the function, runs the function’s code, and returns to the main code with the output.

<i-image
  style="aspect-ratio:1194/428;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/3.4.1-a78b7612a17f3d0e2114f3e66ee0c893.png"
  alt="3.4.1"
  width="1194"
  height="428">

Figure 3.4.1

</i-image>

To call a function, we would write the function’s name, and then give it the input to provide the function’s parameters. We call the input provided in the function call **“arguments.”** This is nearly identical to variables and values. Variables are names that are assigned values. Parameters are variables specifically for a function, and they are assigned values, called arguments, when the function is called. In our addition example, the “addition” function had two parameters: addend1 and addend2. When we say “Hey, add 5 and 2!”, 5 and 2 are arguments, which are loaded into the parameters. So, when the function has the code addend1 + addend2, these are variables that are loaded with the values 5 and 2.

<i-image
  style="aspect-ratio:1116/406;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/3.4.2-bd22a5ce3604f95ba9b6d8a8bc6eef85.png"
  alt="3.4.2"
  width="1116"
  height="406">

Figure 3.4.2

</i-image>

Then, the function would return the sum, 7. This would jump the execution back to our main code, where the function call asking the function add() to add 5 and 2 would be replaced by the value 7. These are the parts of the function call: calling the function by name and providing the arguments, and then being replaced by the output.

Note that not all functions in all languages have return statements; some might not need to return any output to the main program. For example, a function to save a document might not need to tell the main program anything, it might simply need to write to a file on its own. Similarly, not all functions require any input; for example, a print function might be called without any input, and the computer knows to just print a blank line.

Finally, our notion of scope still applies to functions. In order to call a function, it must be within the scope of the code we’re writing. Different languages define this differently, but it’s worth keeping in mind.

## 2. An Analogy for Functions {#2-An-Analogy-for-Functions-1637} 

Functions are powerful, but complicated. They fundamentally change the way we think about programming. We’re no longer writing just linear sequences of instructions, with small branches or repetitions. Instead, we’re now structuring entire programs. When writing a function, we need to think about how it might be used by the rest of the program, not just what the needs are for our current line of code. The power of functions means that they’re critical to understand, but they’re also a fundamental change in how we think about structuring programs. As a result, they can be very confusing. So, I think it’s useful to think of functions with an analogy to an office.

## Setting Up the Analogy {#Setting-Up-the-Analogy-3413} 

In this analogy, you’re the main code that’s running. You have a specific job. Functions are your coworkers. They also have specific jobs. When you need a job done, you ask your coworker to do it. You might give them some information to do it with, and they might give you some answer back.

In this analogy:

* Your coworker is a function.
* Their name is a function name.
* The declaration by the company of what their job will be is the function definition.
* The information you give them is the input to the function.
* What they do on their own with that input is the body of the function.
* The result they return to you is the output of the function.

## The Function Definition {#The-Function-Definition-3414} 

Let’s use this analogy to actually define a function. You have a coworker named Addison. Your boss tells you that Addison’s sole job is to add two numbers, and to get him to do so, you should shout his name and the numbers. So, Addison (the person) is a function. “Addison” is the name of the function. The statement, “You can give Addison two numbers to add” is the list of parameters to the function. All this information is the function header. Addison knows how to add two numbers; that’s the body of the function. When he’s done adding them, he hollers back the answer; that’s the output of the function.

Note a few features of this analogy. First, note that Addison hasn’t done anything yet. You’ve been informed of _what_ he does, and how to get him to do it. You’re told that he adds two numbers, and you’re told that to get him to add two numbers, you holler his name and then the numbers you want him to add. This is all the definition, defining how the function is _used_.

Second, notice that you don’t know _how_ Addison adds two numbers. Does he do it by mental calculation? Does he do it on paper? Does he use a calculator? You don’t know, and you don’t care. Remember, in this analogy, you’re the main program. You don’t need to know how Addison does his job. All you need to know is how to call him, what input to give him, and what output to expect.

## The Function Call {#The-Function-Call-3415} 

So, you’re sitting in your office today, and you say, “Hey Addison, add 5 and 2!” That’s the function call: you call out to Addison to do something, and you give him the input into what he does. He expects two numbers as input, so you give him two numbers; those are the arguments, and they go into his parameters (like values into variables). Addison hears the two numbers and adds them. That’s running the body of the function. It was defined before, but now it’s being used. You, the main program, don’t know what’s going on inside that function. You’re not sure if he’s adding mentally, using pen and paper, or using a calculator. When Addison is done, he hollers back, “7!” That’s the output of the function. Now, wherever you needed the result of 5 plus 2, you instead use 7.

Notice a couple of things here as well. First, when you hollered for Addison to add 5 and 2, your work stopped. You didn’t continue until you got the output back. In the same way, when a program calls a function, it hands control over to that function. It waits until the function is done running to continue.

Second, notice that we said Addison is in your office. You probably have other coworkers as well, and they might need numbers added, too. If the company didn’t have Addison, you could have added those two numbers yourself in your office, but then _everyone_ in the office has to do their own addition. By having one coworker, one function, that can do it, everyone can just call him to do it. If he comes up with a more efficient way to do it, then everyone benefits instead of everyone having to learn the more efficient way themselves. If later we wanted to record every time he added two numbers, we would only need to ask him to record them instead of teaching everyone to record them. These are all connected to the benefits of using functions: by packaging code together and calling it when needed, we make it easier to revise and enhance our programs over time.

## Bigger Functions {#Bigger-Functions-3416} 

Now, of course, with addition this is almost a silly example. In practice, you wouldn’t write a function for addition (in fact, the addition operator is basically a function on its own), just as you wouldn’t have a coworker whose sole function is to add numbers. This has been a simple example, but you might be able to easily generalize it to more authentic applications.

For example, most mid-sized companies have a public relations person that handles press releases. When someone at the company has something to announce, they call the public relations person and give them the information to announce. Let’s call ours Riley. Riley is a function, her parameter would be the information to announce, and her function body would be the steps to announce it. Calling the Riley is calling the function, and providing the information is passing in the argument. This is a good example of a time when a function might not return anything: Riley’s job might not be to tell the coworker any result, but rather just to announce something to the world. Either way, though, this should make it more clear (a) why there is value in encapsulating this job within a particular person or function, and (b) what it means to say that you, when calling a function, don’t care _how_ it works, just _that_ it works.

We can also think of an example of a job that needs no input. For example, imagine you’re working at a retail store. A common question in such a store is, “What was today’s total sales?” A company might have a person whose job it is to tally that when needed. Let’s call him Terry. Terry would be the function, and Terry’s function body would be the steps to tally the sales, but they don’t have any parameters. Terry just automatically has access to the day’s sales. Asking Terry for the day’s sales numbers would be calling the function, but there would be no arguments to pass in. Terry does return a value, though: the day’s sales. There might also be jobs that require no input and return no value; for example, Lola’s job might be to lock up at the end of the day. No input might be needed, and no information is returned, but a function is performed.

We’ve spent a very long time now just talking about functions in abstract terms. That’s because functions are not just another control structure; they’re an entire paradigm of programming. They’re a different way to think about structuring the code that we write. So, it’s important to understand not just the syntax, but also the philosophy behind functional programming. The main takeaways of what we’ve discussed so far are:

* Functions are like miniature programs, with their own input and output, for tasks we need to do a lot.
* Functions are defined by a header that states their name and the input they expect, like a add() function having two parameters, addend1 and addend2.
* Functions possess a body that dictates what to do with that input and what output to return.
* Complicated programs are built out of lots and lots of smaller functions.

## 3. Simple Functions in Python {#3-Simple-Functions-in-Python-1638} 

Functions are a bit of a chicken-and-egg problem when learning to program. You must have defined a function to be able to call it, but you must be able to call a function to test defining it. So, where do we start? Fortunately, we’ve seen some examples of function calls already: len(), str(), and random.randint() for example. So, we’ve seen what’s involved in a function call. Let’s get started defining functions. First, we’ll define a very general function with no input or return, a function that just performs a task. Then, next lesson we’ll define a function that does return some value. Finally, we’ll define a function that has some parameters _and_ returns some value.

## The Function Definition {#The-Function-Definition-3417} 

Imagine you’re writing some code that will be used by an online store that does business in multiple countries. That means the web site must be able to show prices with local currency symbols. You generally only have your own local currency on your keyboard, though, which means accessing the other symbols could be frustrating. So, we want to write a function that will print out a certain local currency’s symbol. Let’s go with the symbol for Japanese yen, ¥.

To start with, let’s just write a simple function printYen() that will print the character ¥; no input, no output. How do we do that?

<i-sandbox-py  page-slug="__temp_slug__" code='#Defines the function "printYen"
def printYen():
	#Prints "¥", without the new line afterward
	print("¥", end="")
#Calls the function "printYen"
printYen()
print(5)'>
</i-sandbox-py>

**Figure 3.4.3**

Figure 3.4.3 shows the code to print the character ¥. Let’s trace through it. Line 2 is the function header. It starts with the keyword def. The keyword def is a reserved word in Python for creating functions. Then, we have the function name, printYen(). Then, we have an open and close parenthesis. If we were defining parameters, they would go in these parentheses; even if we have no parameters, however, we have to leave these parentheses because they tell Python explicitly that the function needs no input. This is also why we often show function names with parentheses after them when referring to them; for example, “the len() function returns the length of a list.” Then, as with all other control structures, we end with a colon, telling Python to expect an indented line.

Inside the body (the indented part, lines 3 and 4) of the function, we write the one line: print("¥"). Actually, we’re doing something extra: the, end = "" inside the print statement tells Python not to create a new line after printing like it usually does. We’ll talk about why later; for now, just know that including this little extra bit prevents Python from going to the next line, so the next thing printed will be on the same line. This is why 5 appears on the same line as ¥ in the output.

## The Function Call {#The-Function-Call-3418} 

Then still in Figure 3.4.3, we’re back outside the function again. On line 7, we call the function: printYen(). Line 2 told the computer, “Hey, there exists a function called printYen(), so when it gets called, come up here!” So, when printYen() is called on line 7, execution of the program goes to line 3, the first line inside the function printYen(). The computer runs line 3 and prints the symbol. That’s the end of the function, so it comes back out to the main program. Line 7 is now done, so it runs line 8, and prints the number 5. The result: the computer prints “¥5.” The number 5 is on the same line as the symbol ¥ because of the , end = "" part of line 7.

Notice a couple of things here. First, as we’ve said before, Python starts at line 1 and runs the lines of code one by one. That means, on line 2, it runs, def printYen():. What does running that line mean? Running that line on its own means remembering, “Hey, there exists a function called printYen().” The function doesn’t run; running this line merely _defines_ the function. It’s the equivalent of you being told, “Hey, Addison adds two numbers”: you haven’t asked him to add two numbers yet, but you know he’s there. The program then skips any lines inside the function because the function hasn’t been called; it’s just been defined.

Then the program runs line 7. Line 7 says, “Hey, remember that function printYen()? Run it!” Now the program jumps to line 3, the first line inside printYen(), and runs it. The body of the code is run when the function is _called_, not when it’s _defined_. After it runs line 3, that’s the end of the printYen() method, so execution returns to where it left off in the main program. Line 7 is now done, so it runs line 8.

Notice that we’ve touched on the idea of scope for methods in this. The scope of the printYen() method begins on line 2 when it’s defined. So, anything after line 2 can see printYen(). Had we tried to call printYen() on line 1, it would have failed because printYen() wasn’t yet defined. This is different from many other languages, where the language goes through and compiles functions before trying to run the code.

## 4. Functions with Returns and Parameters in Python {#4-Functions-with-Returns-and-Parameters-in-Python-1639} 

So, we’ve now seen the general syntax for defining a function: the keyword def, a name for the function, parentheses, a colon, then the function body. Now let’s add two layers of complexity to this: a return statement and some parameters.

## A Function with a Return {#A-Function-with-a-Return-3419} 

The function we defined in Figure 3.4.3 is of limited usefulness. Chances are, we’re not usually trying to print the ¥ symbol to the console; we usually want to use it in some other program we’re writing. So, instead of printing it directly, we want a function that will _return_ that symbol.

In Figure 3.4.4, we’ve changed line 4. Instead of printing ¥, we return it. What does this mean? It means that wherever we call returnYen(), it gets replaced by the string “¥”. That was our goal, after all: to make it so we didn’t have to keep going and finding the symbol. Now, instead, whenever we need to use it we can just call returnYen().

<i-sandbox-py  page-slug="__temp_slug__" code='#Defines the function "returnYen"
def returnYen():
	#Returns "¥"
	return "¥"
#Prints the output of returnYen()
print(returnYen(), end = "")
print(5)'>
</i-sandbox-py>

**Figure 3.4.4**

Let’s trace through how this code executes. Just like before, when the computer runs line 2, it loads the knowledge of the existence of returnYen() into memory. Now it knows that if returnYen() is called, it should come back here and run this function’s body. Then, it skips line 4 because it’s in the body of the function, and the function hasn’t been called yet. Then, it runs line 7. Line 7 asks to print the output of returnYen() (again, without the linebreak). To do this, it has to call returnYen(). So, it does. Execution jumps to line 4, the body of returnYen(). Line 4 says return “¥”. This means that “¥” is sent back to the main program to replace the function call. returnYen() is replaced by the string “¥”. So, this line becomes print("¥", end=""), and so the program just prints ¥. Then, line 8 runs and prints 5.

The outcome is exactly the same, but notice that this design means we could have used returnYen() in other ways. Specifically, we could cut the two print statements down to one, as shown in Figure 3.4.5.

<i-sandbox-py  page-slug="__temp_slug__" code='#Defines the function "returnYen"
def returnYen():
	#Returns "¥"
	return "¥"
#Prints the output of returnYen(), then 5
print(returnYen(), 5, end = "")'>
</i-sandbox-py>

**Figure 3.4.5**

Because returnYen() returns “¥” to replace the function call instead of just printing “¥” by itself, we can use it in other lines, too. In Figure 3.4.5, we’re using it to print the same text as before, but imagine using this to generate the price tag to be put into a web site, or the price listing for a pricing database. In those cases, having this kind of access is valuable.

## A Function with a Parameter {#A-Function-with-a-Parameter-3420} 

The function from Figure 3.4.5 just returns the “¥” symbol. However, are we ever going to use this symbol without an amount of currency following it? ...well, we might, but for a moment let’s pretend we won’t. So, instead of forcing the main program to always add the amount separately, why don’t we instead make this function simply return the string version of the amount of currency preceded by the ¥ symbol? To do that, we need to send in the amount of currency to use as input into the function, as shown in Figure 3.4.6.

<i-sandbox-py  page-slug="__temp_slug__" code='#Defines the function "returnYenAmount"
def returnYenAmount(amount):
	#Returns "¥" with the amount
	return "¥" + str(amount)
#Prints the output of returnYenAmount(5)
print(returnYenAmount(5))'>
</i-sandbox-py>

**Figure 3.4.6**

We’ve updated the function definition and put some new information in the header: amount, in parentheses. amount is a parameter of this function. This is like creating a variable specifically for this function: inside the function body, we can refer to amount as a variable. The value for this variable is the argument passed into the function when it is called. So, when the computer runs line 2 and defines the function, it defines it with the knowledge, “Hey, to call this function, you need to pass in one argument.”

As before, execution then skips line 6 because the function returnYen- Amount() is being defined, not called. So, execution proceeds to line 7, where it prints returnYenAmount(5). 5 is the argument being passed into the function. So, the value 5 is assigned to the variable amount. This is just as if the first line of the function was amount = 5. Execution jumps to the body of returnYenAmount, which returns "¥" + str(amount). Since amount is 5, this resolves to “¥5”. So, the string “¥5” is returned and replaces returnYenAmount(5) in line 7. This line becomes print("¥5"), so the computer does so.

So far, all our arguments have been values themselves, but we can (and usually will) use variables themselves as arguments. In this case, the value of the variable becomes the value of the parameter. For example, let’s convert this to a user-facing program that asks the user to input the amount they want added to the currency symbol.

<i-sandbox-py  page-slug="__temp_slug__" code='#Defines the function "returnYenAmount"
def returnYenAmount(amount):
	#Returns "¥" with the amount
	return "¥" + str(amount)
inputAmount = int(input("Enter the amount: "))
#Prints the output of returnYenAmount(inputAmount)
print(returnYenAmount(inputAmount))'>
</i-sandbox-py>

**Figure 3.4.7**

On line 6 of Figure 3.4.7, the user enters a number, when prompted by line 6 and it’s stored in the variable inputAmount. The variable inputAmount is then used as the argument to the function returnYenAmount. This assigns the value of inputAmount to the parameter amount, to be used in the function returnYenAmount. So, in this case, the user types in 10, which is stored in inputAmount. inputAmount is then passed into returnYenAmount as an argument, meaning the value of inputAmount is assigned to the parameter amount. Now, amount in the function returnYenAmount has the value 10, so when return "¥" + str(amount) is called, it becomes return "¥" + str(10). This resolves to return "¥10", and so the function call is replaced with “¥10”.

## A Function with Multiple Parameters {#A-Function-with-Multiple-Parameters-3421} 

If a function is defined with multiple inputs, then it is assumed that the order of the arguments in the function call matches the order of parameters in the function definition. Let’s make our running example from Figure 3.4.6 a little more complicated to check this out. Let’s write a function that doesn’t just handle the ¥ symbol, but the £ and $ symbols as well.

In Figure 3.4.8, we’ve revised the function definition to change the name (now currencyAmount) and have two parameters: currency and amount. The body of the function is a series of conditionals that checks to see if the currency is one of three expected types: JPY for Japanese yen, USD for US dollars, or GBP for British pounds. If currency isn’t one of these, it simply returns amount as a string. Notice here how we have multiple returns, but only one will be reachable at a time based on the value of currency.

<i-sandbox-py  page-slug="__temp_slug__" code='#Defines the function "currencyAmount"
def currencyAmount(currency, amount):
	if currency == "JPY":
		return "¥" + str(amount)
	elif currency == "USD":
		return "$" + str(amount)
	elif currency == "GBP":
		return "£" + str(amount)
	else:
		return str(amount)
#Prints the output of currencyAmount("GBP", 5)
print(currencyAmount("GBP", 5))'>
</i-sandbox-py>

**Figure 3.4.8**

When we call the function, we now use two arguments: “GBP” and 5. The order of the arguments matches the order of the parameters, so the parameter currency receives the argument “GBP” and the parameter amount receives the argument 5. The body of the function runs, finding that currency == “GBP” is True, so it returns "£" + str(amount). This resolves to “£5”, so it returns the string “£5”, which replaces the function call. So, line 11 resolves to print("£5"), so it does so.

Before we move on, it is also worth calling attention to the subtle but powerful structure here. We have the function print(), and we have the function currencyAmount(). The function print() takes a string as input and prints it. How, then, can print() take currencyAmount(), a function, as input? Remember, when we call a function, we effectively replace the function with its output, then run the line of code again. When we run print(currencyAmount("GBP", 5)), the computer starts with the innermost set of parentheses (which may be attached to a function) and evaluates it. Here, that’s currencyAmount("GBP", 5). After evaluating that function call, it is replaced by the string “£5”. Now, the computer tries the line again: print("£5"). There is nothing left to evaluate, so it just runs this line as-is. There are two important takeaways here: (a) function calls are effectively evaluated and replaced by whatever they output, and (b) as a result, we can use function calls as arguments to other function calls as long as they will output the right kind of data. Later, we’ll even look at functions that use _themselves_ as arguments, like reprint(reprint("WHAT?!")).

## 5. Common Function Errors in Python {#5-Common-Function-Errors-in-Python-1640} 

We’ve covered how functions are defined and called; now let’s discuss some of the function-specific things that can go wrong. All of the errors we’ve described in the past can apply to functions, too. For example, if we have a parameter to a function (like amount in currencyAmount()) that is treated as an integer inside the function but we pass in a string, then we get the same error as if we had just tried to do math on a string in a regular program as well. The function doesn’t change that. However, there are a couple of function-specific errors we can anticipate.

## Parameter Mismatch {#Parameter-Mismatch-3422} 

When we define a function, part of that definition is the declaration of how many arguments should be passed in. This comes in the form of the parameter list. Our currencyAmount() function above had two parameters: currency and amount. 

To call currencyAmount(), the program had to supply arguments for both parameters (that is, values for both variables). What happens if we don’t?

<i-sandbox-py  page-slug="__temp_slug__" code='#Defines the function "currencyAmount"
def currencyAmount(currency, amount):
	if currency == "JPY":
		return "¥" + str(amount)
	elif currency == "USD":
		return "$" + str(amount)
	elif currency == "GBP":
		return "£" + str(amount)
	else:
		return str(amount)
#Prints the output of currencyAmount(5)
print(currencyAmount(5))'>
</i-sandbox-py>

**Figure 3.4.9**

Figure 3.4.9 shows this error in action. The error is TypeError, which we’ve seen before. The feedback from the error gives us plenty of information: “missing 1 required positional argument: ‘amount.’” This basically says, “no value was given for amount.” The only reason amount specifically didn’t receive a value is because, as we described before, the arguments are assumed to go in the same order as the parameters. The first argument is 5, so it’s assigned to the first parameter, currency. This is wrong, of course, but that’s the way the computer interprets it. It then looks for an argument for amount, but doesn’t find one. So, it throws up that error.

## Scope Error {#Scope-Error-3423} 

We’ve covered the scope of functions themselves; basically, a function must be defined before it is called in some code, the same way a variable had to be created before it was used. However, what about the variables we use inside functions? What are their scopes?

<i-sandbox-py  page-slug="__temp_slug__" code='#Defines the function "currencyAmount"
def currencyAmount(currency, amount):
	if currency == "JPY":
		resultString = "¥" + str(amount)
	elif currency == "USD":
		resultString = "$" + str(amount)
	elif currency == "GBP":
		resultString = "£" + str(amount)
	else:
		resultString = str(amount)
#Runs currencyAmount(5)
currencyAmount("GBP", 5)
print(resultString)'>
</i-sandbox-py>

**Figure 3.4.10**

The code in Figure 3.4.10 tests that out. Instead of returning something from currencyAmount, here we just set the result equal to resultString. If the scope of a variable created inside a function extended to after the function has run, then this code should work: by the time line 12 runs, line 8 will have run, and resultString will have been created. Instead, though, we receive an error saying that resultString is not defined. Variables defined inside functions only exist inside those functions. The same goes for parameters: we can’t use currency or amount outside of currencyAmount() because these are variables specifically for that function.

This is the first major exception we’ve encountered to our general rule that the scope of a variable is the remainder of the program’s execution. Variables created inside functions only exist inside that function, and only until the function is done running; if we called currencyAmount twice, it would be as if resultString was never created. In this way, functions really are like little programs; the scope of a variable is the remainder of the program, and a function is like its own little program, so the scope of a variable created inside a function is the remainder of the function. Note that this doesn’t interfere with the scope of other variables outside the function; a variable declared before a function call is still available after the function call, but not inside the function that is called.

## 6. Advanced Python Functions {#6-Advanced-Python-Functions-1641} 

Different languages extend the general idea of functions in different ways. In Python, there are a couple of advanced details regarding functions that are worth covering. In fact, Python functions can get very complex, but we’re most interested in keyword parameters. Keyword parameters are not terribly common in what you’ll write, but they do add a lot of power to your toolbox.

## Using Keyword Parameters {#Using-Keyword-Parameters-3424} 

To understand **keyword parameters**, remember two things we’ve said. First, remember that we said Python assumes that arguments come in the order that parameters are defined in a function definition. Second, remember that at one point, we included a weird extra bit of code in a print statement: we said print("¥", end = ""). I promised to come back to this later, and now is later!

For required parameters, what we’ve said so far is true with regard to assuming arguments come in the order that parameters are defined. However, sometimes that can be a bit limiting. One instance of that is that oftentimes, we might have param- eters for which we want to _assume_ one value, but allow the program to override this if they want.

The print() function is a good example of this. The print() function takes as input one or more strings to print in order. We haven’t seen it printing multiple strings before, but we can see it now in Figure 3.4.11.

<i-sandbox-py  page-slug="__temp_slug__" code='print("A", "B", "C")
print("D", "E", "F")'>
</i-sandbox-py>

**Figure 3.4.11**

When we give print() multiple strings, it prints them one at a time in the order they’re given, separated by spaces. Each print() function call automatically ends the line, which is why D E F appears on a different line from A B C; print() puts a space between each character and a new line at the end of each line. Technically, new line is just a character that isn’t shown, but instead tells the computer to print the next text on a new line.

The print() function assumes we want spaces between the individual strings, and a new line at the end of each print() call. What if we don’t want that? What if we want no spaces between strings, and no new line at the end of each line? Then, we use keyword parameters, as shown in Figure 3.4.12.

<i-sandbox-py  page-slug="__temp_slug__" code='print("A", "B", "C", sep = "", end = "")
print("D", "E", "F", sep = "", end = "")'>
</i-sandbox-py>

**Figure 3.4.12**

A keyword parameter is a parameter that has an assumed value, but that the function call can override. Overriding it looks like declaring a variable: we take the name of the parameter, and assign it to a different value. Here, the parameter sep (for “separator”) is used to define what character will be used between each string in the print() call. It is assumed to be a space, but if we include the argument sep = "", it is assigned an empty value. Then, the print statement puts nothing in between the characters. Similarly, the parameter end holds what character to put at the end of the line. By passing the argument end = "", we override that with a blank character, forcing everything onto one line.

If this is confusing, let’s try to override sep and end with visible characters in Figure 3.4.13. This looks messier, but it might be easier to understand. Including the argument sep = "#" in the first line replaces those spaces from the original output with # symbols. Including the argument end = "?" replaces the new line character with a question mark. We can also see here how using different symbols in line 2 causes different symbols to appear among the D, E, and F.

<i-sandbox-py  page-slug="__temp_slug__" code='print("A", "B", "C", sep = "#", end = "?")
print("D", "E", "F", sep = "%", end = "!")'>
</i-sandbox-py>

**Figure 3.4.13**

These are keyword parameters. We don’t assume the program will define them because oftentimes they won’t; but we want to give the program the ability to define them if need be. If we simply list them as normal parameters, they become required, and throw up that TypeError from Figure 3.4.9 if the program doesn’t specify them. We don’t want the programmer to have to specify what separator to use every time they use the print() function, though, since most of the time it will be the same. So, we use keyword parameters, which give the program a way to specify alternate values when needed, but a way to ignore them in favor of default values when alternate values are not needed.

## Creating Keyword Parameters {#Creating-Keyword-Parameters-3425} 

So, how do we create keyword parameters? In our function declaration, we include the parameter name, but assign it a value the same way we do when overriding it. For example, let’s assume we want our currencyAmount function to assume US dollars unless the program specifies otherwise.

In Figure 3.4.14, we’ve revised our function declaration to say currency = "USD" in the parameter list instead of just currency. We switched the order because keyword parameters must come after regular (also called positional) parameters.

<i-sandbox-py  page-slug="__temp_slug__" code='#Defines the function "currencyAmount"
def currencyAmount(amount, currency = "USD"):
	if currency == "JPY":
		return "¥" + str(amount)
	elif currency == "USD":
		return "$" + str(amount)
	elif currency == "GBP":
		return "£" + str(amount)
	else:
		return str(amount)
#Prints the output of currencyAmount(5)
print(currencyAmount(5))
#Prints the output of currencyAmount(5, currency = "GBP")
print(currencyAmount(5, currency = "GBP"))'>
</i-sandbox-py>

**Figure 3.4.14**

We assigned currency a value of “USD”, which basically says, “Assume currency is ‘USD’ unless the function call says otherwise.” Beyond that, the function definition is the same.

Now, we call currencyAmount in two different ways. On line 13, we just give it the argument 5. Based on the position, the computer assumes 5 is the amount. No argument is given for currency, so it maintains the assumed value of ‘USD’ and runs accordingly. On line 15 we call currencyAmount, we specifically override the parameter currency with the value “GBP”, and as a result, the code uses “GBP” as the value for that variable.

## 7. Functions and Turtles {#7-Functions-and-Turtles-1642} 

Functions give us a powerful new way to add new functionality to our turtle project while keeping it somewhat organized. To close out our lesson on functions, let’s do two things: first, let’s take our prior work on a shape command and spin it off into a function, and second, let’s create a new function for something even more interesting.

## The Shape Function {#The-Shape-Function-3426} 

While our code to draw a custom shape wasn’t too long (five lines), it was still a good bit longer than other commands, which were only two lines. If we had commands with even longer code, this could get big and disorganized fast. Functions give us a way to keep things more organized by separating out different areas of the program.

To start, let’s take that shape command’s code and make it a separate function. There are two ways we could do this: we could continue to get the user’s input in the main program, then pass it as input into the function to draw the shape. Or, we could just combine all that code into the single function and call it; then, the user input would be entered during the function call. The benefit of the first approach is that it allows us to draw a shape with numSides and sideLength regardless of whether the user entered these or if they came from somewhere else (like reading them from a file), so that’s probably the better design.

TheShapeFunction.py shows the code to do this the first way. Our changes are relatively simple:

* Defined a function drawShape() on line 5 at the start with parameters numSides and sideLength (still after the import statement, though).
* Copied the three lines of code (from the ‘shape’ branch) after getting the sideLength into the function drawShape(), line 6 through 8.
* Called the function drawShape() with the user’s inputted numSides and sideLength as arguments on line 35. Note that here, the arguments are variables, and their names (numSides and sideLength) _happen_ to match the parameter names (also numSides and sideLength), but this doesn’t have to be the case.

So, now we’ve successfully spun drawShape() off into its own function. In the process, we’ve shortened the code inside the main reasoning of the program down to just the input lines and one line to actually do the drawing, like the other commands. One of the benefits of this is that it keeps our code more organized. The bigger benefit, though, is that it lets us call that function in more flexible ways. Let’s see how.

## The Snowflake Function {#The-Snowflake-Function-3427} 

To see this in action, we’re going to write a function that will call drawShape() multiple times. We couldn’t do that previously: we would have had to copy the for loop into a different area of the program to use it in a different place. Because it’s a function now, though, we can call it wherever we want.

So, in TheSnowflakeFunction.py, I’ve created another command: snowflake (line 46). Snowflake asks the user for three numbers: the number of sides (line 48), the length of each side (line 50), and the rotation angle (line 52). It stores these in the corresponding variables, and passes them as arguments into the drawSnowflake() function (line 54), jumping to line 13. The drawSnowflake() function first uses the rotationAngle to figure out how many times it will have to rotate to cover a full 360 degrees (line 14). It then runs a for loop that many times (line 15). Each time the for loop runs, it calls (line 16) drawShape() with the given number of sides and side length, jumping to line 5. Once the shape is drawn (repeating lines 6 and 7 several times), the execution jumps back to line 17. There, it rotates the turtle by the rotation angle, and repeats drawing the shape.

The result? A snowflake effect, most of the time anyway. The same shape is drawn repeatedly, rotating a little bit about the center point each time. This can lead to some radically different results based on the number of sides and the rotation angle; try out some different combinations to see. Because of the while loop, we can use this to draw multiple things one over the other. Note that this is this easy (in terms of number of lines of code in drawSnowflake(), 5) because we first put drawShape() into its own function. That allowed us to create drawSnowflake(), which calls drawShape(). That’s the power of functional programming: not only does it keep our code more organized but it also lets us reuse and recycle segments of code in varied ways.

