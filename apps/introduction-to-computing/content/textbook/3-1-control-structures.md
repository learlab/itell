---
assignments:
- summary
chunks:
- title: 1. What Are Control Structures
  slug: 1-What-Are-Control-Structures-1453
  type: plain
- title: What Do Control Structures Do?
  slug: What-Do-Control-Structures-Do?-2860
  type: regular
- title: 2. The Control Structures
  slug: 2-The-Control-Structures-1454
  type: plain
- title: Conditionals
  slug: Conditionals-2861
  type: regular
- title: Loops
  slug: Loops-2862
  type: regular
- title: Function
  slug: Function-2863
  type: regular
- title: Exception Handling
  slug: Exception-Handling-2864
  type: regular
- title: 3. Indentation and Control Structures in Python
  slug: 3-Indentation-and-Control-Structures-in-Python-1455
  type: plain
- title: 'Indentation and Conditionals '
  slug: Indentation-and-Conditionals-2870
  type: regular
- title: Nested Indentation
  slug: Nested-Indentation-2871
  type: regular
- title: Scope
  slug: Scope-1459
  type: plain
- title: Simple Scope in Python
  slug: Simple-Scope-in-Python-2872
  type: regular
- title: The Dangers of Scope in Python
  slug: The-Dangers-of-Scope-in-Python-2873
  type: regular
cri:
- question: What is the purpose of control structures in programming?
  answer: Control structures allow us to loop over code, branch based on conditions, and anticipate errors to make code more powerful and flexible.
  slug: What-Do-Control-Structures-Do?-2860
- question: What do conditional statements do in programming?
  answer: Conditional statements in programming tell the computer to make a decision based on certain conditions.
  slug: Conditionals-2861
- question: How can loops be used in programming a cash register?
  answer: Loops in programming a cash register involve executing several lines of code for every item a customer is purchasing, updating the total, inventory, adding tax, etc., and running operations while customers are still waiting in line.
  slug: Loops-2862
- question: What is the purpose of functions in programming?
  answer: Functions allow for packaging multiple lines of code together for easy reuse and dynamically inserting them into the rest of the code.
  slug: Function-2863
- question: Can we use errors in the design of our programs?
  answer: Yes, exception handling allows us to anticipate and handle errors in the design of our programs.
  slug: Exception-Handling-2864
- question: What happens if the conditional statement in Figure 3.1.3 is false?
  answer: The indented lines of code do not execute, but the non-indented line does.
  slug: Indentation-and-Conditionals-2870
- question: What will be printed by the code in Figure 3.1.5?
  answer: Execution complete!
  slug: Nested-Indentation-2871
- question: What happens when the code in Figure 3.1.6 is executed?
  answer: The variable result is created inside the conditional and printed outside of it.
  slug: Simple-Scope-in-Python-2872
- question: What happens when line 6 is never run in the code snippet?
  answer: An error occurs on line 8 because the variable 'result' was never created due to the conditional not triggering.
  slug: The-Dangers-of-Scope-in-Python-2873
next_slug: 3-2-conditionals
order: 0
parent:
  title: 'Unit 3: Control Structures'
  slug: unit-3-control-structures
quiz: null
slug: 3-1-control-structures
title: 3.1 Control Structures
---

## 1. What Are Control Structures {#1-What-Are-Control-Structures-1453} 

At this point, we’ve covered the basic design of procedural computer programs. Every program we’ve seen, except for the glimpses forward we’ve taken, has run a linear series of lines of code in order from first to last, generating output. In doing so, we’ve been able to do some powerful things, but at the same time, what we can do is somewhat limited. For example, we can draw a hexagon in around twelve lines of code, but what if we want to draw an octagon? So far, that means writing new lines of code, lengthening the program. Wouldn’t it be great if we could just say, “I’d like a shape with 8 sides” and get an octagon instead of having to write the code?

## What Do Control Structures Do? {#What-Do-Control-Structures-Do?-2860} 

**Control structures** are where we start to have that capability. Control structures let us loop over certain lines of code multiple times, changing the data they act on each time. Control structures let us branch our code based on the result of some conditional statement, like returning one message if a customer has sufficient money to make a purchase and another if they don’t. Control structures let us repackage code that is commonly used into functions, like validating a customer’s information or making a series of turns in a vehicle. Control structures let us anticipate certain errors and react gracefully instead of crashing.

The content of these control structures will largely be the same kinds of code we covered with procedural programming; control structures, in many ways, simply control what lines of code will be run in what order. This makes what we can create orders of magnitude more powerful.

## 2. The Control Structures {#2-The-Control-Structures-1454} 

We’ll generally break our conversation about control structures into four types of structures: conditionals, loops, functions, and exception handling.

## Conditionals {#Conditionals-2861} 

One of the first types of structures we’ll cover to add to our programming toolbox is **conditional statements**. Conditionals basically tell the computer to make a decision. Depending on that decision, it might execute some code or skip that code; or, it might choose between two different blocks of code to execute.

Conditionals build on our logical operators that we covered last unit. In fact, almost every conditional statement reacts to the result of a logical expression. For example, imagine we’re writing code to validate a transaction at the store. We might write, “If the customer has a sufficient balance for the purchase, then permit the purchase; otherwise, reject the purchase.” This is a conditional statement based on the result of the relational evaluation of the customer’s balance and the purchase price. Depending on the result of that logical expression, the code will do different things.

Conditionals can be used to make very complex code structures. For example, you could nest several conditional statements one after the other to check the customer’s balance, the retailer’s authenticity, and the cardholder’s identity. You can also write single conditional structures that react to multiple conditions; for example, if a purchase is rejected, you might want your code to _then_ check for fraud if other suspicious purchases have been attempted. In this way, conditionals are powerful tools for creating complex code.

## Loops {#Loops-2862} 

A **loop** involves executing certain lines of code multiple times. Multiple times might be a certain number of times; it might be for every item in a list, like for every file in a folder; or it might be while some condition remains true, like reading from a file as long as you haven’t reached the end yet.

We can think of our example of programming a cash register in terms of loops. First, the register would loop through every item that the customer is purchasing. For every item, it would execute several lines of code: it would update the customer’s running total, it would update the store’s internal inventory, it would calculate and add tax to the product’s value, and so on. The same lines of code would be executed for each item the customer is purchasing. What’s more, that loop, as well as operations for getting the payment method and validating the purchase, would be run while the store still has customers waiting in line. So, that’s another loop, this time one operating on each customer in order.

Like conditionals, loops can be complex and nested. In fact, the example above would be a nested loop: we would run the loop over a single customer’s items for every customer in line. We can also use loops in other complicated ways as well. For example, if we wanted to write a program that would consistently listen for some interruption from a server, we could simply tell it to loop indefinitely until a message was received.

## Function {#Function-2863} 

A **function** is a way of packaging together multiple lines of code in a way that allows them to be easily used wherever needed. In effect, it removes the need to copy and paste lines of code around our program when needed because instead of copying them, we can just “call the function” that contains them. Practically speaking, this is like dynamically inserting the lines of code from the function into the rest of the code and running them right there.

You’ve already seen some examples of functions. This isn’t because we were trying to get ahead of ourselves, but rather it’s because functions are so fundamental to modern programming that it’s difficult to show anything without using some functions. Even something as fundamental as printing to the console is usually run through a function. In practice, functions behave just like operators: they take some input and produce some output. Operators are simply low-level, extremely common functions, but every operator could be rewritten as a function.

The real power of functions is their ability to take lots of different pieces of input and produce some output. You could have, for example, a single function called validatePurchase() that takes as input a customer’s name, credit card number, purchase amount, current balance, and retailer name, and returns either True or False to indicate whether the purchase is valid. This goes far beyond just adding or subtracting a couple of numbers; functions can handle complex operations.

## Exception Handling {#Exception-Handling-2864} 

Earlier in our material, we covered the idea of errors. Errors occur when your code tries to do something it can’t do such as accessing files that don’t exist or dividing by zero. So far, we’ve usually talked about errors in the context of debugging. However, can we actually use errors in the design of our programs?

**Exception** handling tries to do exactly this. With **exception handling**, we anticipate certain errors (“exceptions,” in this case) might arise, and we program in a way to recover from them. In many ways, they’re extremely similar to conditionals; you can think of nearly every instance of exception handling as saying, “If an error is encountered in the following code, then...”

When would we want to anticipate and handle errors instead of just avoiding them? Think of our example of loading information from a file. Let’s say we prompt the user to enter a filename. We have no guarantee the filename they enter is valid. So, we need to check it first before trying to load it, right? That’s one way we could do it. However, we know that if the file doesn’t exist, we should get an error that says “file not found.” So instead of checking if the file exists before trying to load it, we could instead just try to load it, and prepare our code to handle a “file not found” error if it arises.

## 3. Indentation and Control Structures in Python {#3-Indentation-and-Control-Structures-in-Python-1455} 

The fundamental idea of control structures is that certain lines of code tell the computer how to interpret or when to execute other lines of code. With a conditional statement, for example, certain lines of code only run if the logical expression is true. However, that means the code needs some way of telling the computer which lines of code apply. In most languages, this is taken care of with reserved characters like brackets around the lines of code; Python, interestingly, uses **indentation**.

## Indentation and Conditionals  {#Indentation-and-Conditionals-2870} 

Let’s look at this with a simple example of a conditional statement. We’ll talk more about conditionals in the next lesson, but for now, just know that the third line of Figure 3.1.1 says, “if myNum1 is less than myNum2, do the indented line of code below.”

<i-sandbox-py  page-slug="__temp_slug__" code='myNum1 = 1
myNum2 = 2
#Checks if myNum1 is less than myNum2
if myNum1 < myNum2:
	#Prints this if so
	print("myNum2 is greater than myNum1!")
#Prints this regardless
print("Execution complete!")'>
</i-sandbox-py>

**Figure 3.1.1**

Notice in Figure 3.1.1 that both print statements ran. That’s because the conditional statement on line 4 said, “If this expression is true, run the indented code below.” When we change the results of the conditional statement by changing the values of myNum1 and myNum2, check out what happens in Figure 3.1.2. 

<i-sandbox-py  page-slug="__temp_slug__" code='myNum1 = 3
myNum2 = 2
#Checks if myNum1 is less than myNum2
if myNum1 < myNum2:
	#Prints this if so
	print("myNum2 is greater than myNum1!")
#Prints this regardless
print("Execution complete!")'>
</i-sandbox-py>

**Figure 3.1.2**

Here, the indented code on line 6 did not run because the conditional statement was false (because myNum1 is now 3, not 1). In effect, the conditional statement “controls” the indented line below it; that’s why we call it a control structure. However, the important thing to note here is that the non-indented line of code (line 8) _did_ run. It’s outside the indentation, so it executes regardless.

This applies to multiple indented lines as well. None of the indented lines in Figure 3.1.3 executed. They are one code block that runs only if the conditional statement is true. This organizational method applies to every code structure we’ll talk about in this chapter: conditionals, loops, functions, and exception handling all group together code through indentation, and all mark their blocks of code with a colon at the end of the preceding line (here, if myNum1 < myNum2:).

<i-sandbox-py  page-slug="__temp_slug__" code='myNum1 = 3
myNum2 = 2
#Checks if myNum1 is less than myNum2
if myNum1 < myNum2:
	#Prints all these if so
	print("myNum2 is greater than myNum1!")
	print("Yes it is!")
	print("Yes it is!")
#Prints this regardless
print("Execution complete!")'>
</i-sandbox-py>

**Figure 3.1.3**

## Nested Indentation {#Nested-Indentation-2871} 

Indentation can be nested as well; this is how we create nested conditionals or nested loops. Look at Figure 3.1.4, with three numbers.

<i-sandbox-py  page-slug="__temp_slug__" code='myNum1 = 1
myNum2 = 2
myNum3 = 3
#Checks if myNum1 is less than myNum2
if myNum1 < myNum2:
	#Prints this if so
	print("myNum2 is greater than myNum1!")
	#Checks if myNum1 is less than myNum3
	if myNum1 < myNum3:
		#Prints this if so
		print("myNum3 is also greater than myNum1")
#Prints this regardless
print("Execution complete!")'>
</i-sandbox-py>

**Figure 3.1.4**

Line 9 is also indented under line 5, so line 9 is controlled by line 5. Here, the conditional statement in line 5 is True, so the computer reaches line 9. The conditional statement in line 9 is also True, so the computer runs line 11. Notice what happens if the conditional statement in line 5 is False when we switch myNum1 and myNum2 in Figure 3.1.5.

myNum1 is still less than myNum3, so _if_ the computer had reached line 9, it would have evaluated to True and printed line 11. However, line 9 is controlled by line 5, and line 5 was False, so the computer skips over the indented block (lines 6 through 11) containing line 9 and just runs the print statement in line 13. 

<i-sandbox-py  page-slug="__temp_slug__" code='myNum1 = 2
myNum2 = 1
myNum3 = 3
#Checks if myNum1 is less than myNum2
if myNum1 < myNum2:
	#Prints this if so
	print("myNum2 is greater than myNum1!")
	#Checks if myNum1 is less than myNum3
	if myNum1 < myNum3:
		#Prints this if so
		print("myNum3 is also greater than myNum1")
#Prints this regardless
print("Execution complete!")'>
</i-sandbox-py>

**Figure 3.1.5**

## Scope {#Scope-1459} 

Nearly every programming language has some concept of scope. Scope most often describes what portions of a program can see a particular variable. It’s like your program’s short-term memory: what is it remembering at a given time? You can’t access something it’s no longer remembering. We can extend the idea of scope to functions, classes, and other advanced concepts that we’ll get to later, but most often for our material, **scope** refers to which parts of a program can see the variables that you’ve declared.

## Simple Scope in Python {#Simple-Scope-in-Python-2872} 

Let’s start with a simple example. Figure 3.1.6 is a revised version of the conditional we saw in Figure 3.1.1. The revision makes one change: instead of printing inside the conditional (the if statement), it saves the result to a string called result. It then prints result after the conditional has executed. What happens?

<i-sandbox-py  page-slug="__temp_slug__" code='myNum1 = 1
myNum2 = 2
#Checks if myNum1 is less than myNum2
if myNum1 < myNum2:
	#Saves this if so
	result = "myNum2 is greater than myNum1"
#Prints the result
print(result)
print("Execution complete!")'>
</i-sandbox-py>

**Figure 3.1.6**

Well, myNum1 _is_ less than myNum2, so the contents of the conditional on line 4 run. The variable result is created, and it is then printed. Python didn’t care that result was created inside the conditional’s code block. This makes it different than many languages; many languages only define variables as existing within that code block. 

In some ways, this makes programming in Python simpler. If we know that we’re going to create result at some point, we don’t have to worry about creating it at the wrong point. However, it isn’t all good news.

## The Dangers of Scope in Python {#The-Dangers-of-Scope-in-Python-2873} 

Scope in Python also presents a danger. Take a look at the simple tweak in Figure 3.1.7 to the code from Figure 3.1.6. All we’ve done is change the values of myNum1 and myNum2 so that now the conditional statement on line 4 doesn’t trigger. That means line 6 never runs, which means result is never created. So, what happens when we run this code? 

<i-sandbox-py  page-slug="__temp_slug__" code='myNum1 = 2
myNum2 = 1
#Checks if myNum1 is less than mynum2
if myNum1 < myNum2:
	#Saves this if so
	result = "myNum2 is greater than myNum1!"
#Prints the result
print(result)
print("Execution complete!")'>
</i-sandbox-py>

**Figure 3.1.7**

Line 8 gives us an error. It hits an error because result was never created because line 6 was never run. This goes back to the idea that a variable’s scope begins when it is created; if the variable is never created, it has no scope.

This is the danger of scope in Python. When everything is working correctly, scope in Python is relatively easy to understand because you can think of the control structures as just determining what lines of code run in what order; the result is those lines of code running as if they had been written that way in the first place. However, if a control structure is going to start interfering with whether or not variables get created, then you might run into some issues.

You can avoid this by creating variables outside the control structures just in case, as shown in Figure 3.1.8. Here, we create result initially before the conditional, so that even if the conditional doesn’t execute, result is still created. Generally, for our purposes, knowledge of scope is most useful in debugging; when you encounter errors, one of the first things to check is whether the error is due to scope problems. Are you trying to access a variable that was created inside a conditional that didn’t run? Then you have a scope error.

<i-sandbox-py  page-slug="__temp_slug__" code='myNum1 = 2
myNum2 = 1
#Creates an initial value for result
result = "Result was unchanged."
if myNum1 < myNum2:
	#Saves this if so
	result = "myNum2 is greater than myNum1!"
#Prints the result
print(result)
print("Execution complete!")'>
</i-sandbox-py>

**Figure 3.1.8**

If you go into computing, one day you’ll learn other languages as well. This knowledge of scope will also be useful for that transition. When working in Python, we take this for granted because it makes scope relatively easy, but in many other languages, it’s a more significant topic.

