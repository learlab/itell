---
assignments:
- summary
chunks:
- title: 1. What Is a Loop?
  slug: 1-What-Is-a-Loop?-1500
  type: plain
- title: For Loops
  slug: For-Loops-3021
  type: regular
- title: While Loops
  slug: While-Loops-3022
  type: regular
- title: 3. Traditional For Loops in Python
  slug: 3-Traditional-For-Loops-in-Python-1501
  type: plain
- title: For Loops with Known Ranges
  slug: For-Loops-with-Known-Ranges-3023
  type: regular
- title: For Loops with Unknown Ranges
  slug: For-Loops-with-Unknown-Ranges-3024
  type: regular
- title: 3. For-Each Loops in Python
  slug: 3-For-Each-Loops-in-Python-1502
  type: plain
- title: For-Each and Lists
  slug: For-Each-and-Lists-3025
  type: regular
- title: For-Each and Other Types
  slug: For-Each-and-Other-Types-3026
  type: regular
- title: 4. While Loops in Python
  slug: 4-While-Loops-in-Python-1503
  type: plain
- title: Simple While Loops
  slug: Simple-While-Loops-3027
  type: regular
- title: While Loops and Number Guessing
  slug: While-Loops-and-Number-Guessing-3028
  type: regular
- title: Infinite Loops
  slug: Infinite-Loops-3029
  type: regular
- title: '5. Advanced Loops: Nesting in Python'
  slug: 5-Advanced-Loops-Nesting-in-Python-1504
  type: plain
- title: Nested For Loops
  slug: Nested-For-Loops-3030
  type: regular
- title: Nesting Both Loops
  slug: Nesting-Both-Loops-3031
  type: regular
- title: '6. Advanced Loops: Keywords and Scope in Python'
  slug: 6-Advanced-Loops-Keywords-and-Scope-in-Python-1505
  type: plain
- title: Advanced Loop Keywords
  slug: Advanced-Loop-Keywords-3032
  type: regular
- title: Scope and Loops
  slug: Scope-and-Loops-3033
  type: regular
- title: 7. Loops and Turtles
  slug: 7-Loops-and-Turtles-1506
  type: plain
- title: While Loops for Repeated Commands
  slug: While-Loops-for-Repeated-Commands-3034
  type: regular
- title: For Loops for Drawing Shapes
  slug: For-Loops-for-Drawing-Shapes-3035
  type: regular
cri:
- question: What is a for-each loop and how does it differ from a regular for loop?
  answer: A for-each loop simplifies iterating over items in a list by automatically determining the total number of items and storing each item in a variable for processing, making it easier to write and more natural to think about.
  slug: For-Loops-3021
- question: What is a do-while loop in Java?
  answer: A do-while loop in Java guarantees that the code block will be run at least once before checking the condition.
  slug: While-Loops-3022
- question: What is the purpose of the loop control variable in a for loop?
  answer: The loop control variable is used to keep track of how many times the loop has run so far.
  slug: For-Loops-with-Known-Ranges-3023
- question: Why is the variable 'sum' created outside the loop in this code?
  answer: To set sum equal to the previous sum plus the new number every time the loop runs.
  slug: For-Loops-with-Unknown-Ranges-3024
- question: What is the purpose of the for-each loop in the code snippet from Figure 3.3.5?
  answer: To iterate through each item in the list 'listOfNumbers' and add its value to the sum.
  slug: For-Each-and-Lists-3025
- question: How can we count the number of words in a string?
  answer: We can count the number of spaces in the string and add one to get the number of words.
  slug: For-Each-and-Other-Types-3026
- question: What is the purpose of the while loop in the provided code snippet?
  answer: To count up to 10 by printing the current value of i and incrementing it until it reaches 11.
  slug: Simple-While-Loops-3027
- question: What happens if the user's guess is too low?
  answer: Prints 'Too low!' and prompts the user to guess again.
  slug: While-Loops-and-Number-Guessing-3028
- question: What is an infinite loop and how can it be created?
  answer: An infinite loop is a loop that will never end and can be created by having a loop that repeats based on a condition that never changes.
  slug: Infinite-Loops-3029
- question: What is the purpose of creating numWords and setting it equal to numSpaces + len(listOfStrings)?
  answer: It calculates the total number of words in the list of strings, accounting for spaces between words.
  slug: Nested-For-Loops-3030
- question: What is the purpose of setting the initial value of keepPlaying to 'y' in the nested while loop?
  answer: So that the loop is guaranteed to run the first time.
  slug: Nesting-Both-Loops-3031
- question: What is the purpose of the continue statement in a loop?
  answer: The continue statement forces the current iteration of the loop to stop and skips over any remaining code inside the loop.
  slug: Advanced-Loop-Keywords-3032
- question: What advice does the passage give for creating variables inside loops?
  answer: If you need to refer to a variable outside a loop, don't create it inside a loop; create it before the loop.
  slug: Scope-and-Loops-3033
- question: What changes were made to the code to make it more efficient for repeating commands?
  answer: A command was created outside the loop, a while loop was added to repeat until the command is 'end', and an additional elif statement was included to check for 'end'.
  slug: While-Loops-for-Repeated-Commands-3034
- question: What is the purpose of the shape command implemented using a for loop?
  answer: To let the user enter a number of sides and a side length and draw the corresponding regular polygon.
  slug: For-Loops-for-Drawing-Shapes-3035
next_slug: 3-4-functions
order: 2
parent:
  title: 'Unit 3: Control Structures'
  slug: unit-3-control-structures
quiz: null
slug: 3-3-loops
title: 3.3 Loops
---

## 1. What Is a Loop? {#1-What-Is-a-Loop?-1500} 

What is a **loop**? A loop is a control structure that repeats some lines of code until a certain condition is met. The important word there is: repeats. A loop repeats lines of code. This is extremely valuable. Most trivially, it means that we don’t have to just copy and paste chunks of code if we want to do something more than once: but that’s only a small part of the power of loops. Their real power is their ability to repeat code a dynamic number of times based on some conditions.

For example, imagine if you were writing some code to change the names of all the files in a folder. The code for changing the name of each file is probably pretty similar, and you just want to repeat it for each file in the folder. With loops, it doesn’t matter if there are two files in the folder or two million: you could write code that would repeat the renaming function for every file in the folder.

Generally speaking, there are two common kinds of loops: for loops and while loops. They do have some variations within each type as well, but these are the most common categories of loops. As we’ll describe later, anything you can do with a for loop, you can also do with a while loop; however, each one is better suited to certain kinds of tasks.

## For Loops {#For-Loops-3021} 

A for loop repeats some code a certain number of times: “for 7 times, do this.” For example, imagine you have an exercise routine that has you do ten push-ups, ten sit-ups, and five pull-ups. We could describe this in terms of three loops: the first would run ten times, and with each **iteration** of the loop, you run the function pushup(). Or, imagine you were shopping, and there were seven items on your shopping list. So, seven times, you (a) read the next item on the list, (b) walk to that item in the store, and (c) put the item in your basket. Those three tasks would run seven times; or, in other words, you’d “loop over” them seven times.

Sometimes, we’ll know exactly how many times a loop should run in advance. For example, imagine you were writing the code for a blog, and you knew you wanted to show ten posts on the frontpage.You might run a loop ten times that grabs the next posts and displays it. Other times, the desired number of iterations (i.e., repetitions) might vary. In that same example, imagine we want to show _every_ post in the blog on one page. In that case, we’d run the same loop, where the number of times we run it equals the number of posts in the blog. As more posts are written, the loop will need to run more times.

Some languages, like Python, supply a special kind of for loop called a for-each loop. for-each loops come from the observation that a large number of times that we use for loops, we’re looping over items in a list, like blog posts in a blog or items on a shopping list. These loops generally always take the same form: (a) we find the total number of items in the list and run the loop that many times, and (b) at the beginning of each iteration, we grab the next item on the list and store it in some variable. A for-each loop just simplifies this. Instead of saying, “for seven times, read the next item, go get it, and put it in my basket”, it’s like saying, "for each item, go get it and put it in my basket.” Functionally these are the same, but just a little easier to write and more natural to think about.

## While Loops {#While-Loops-3022} 

for loops run with some advanced knowledge about how many times the loop will run: “for 7 times, do this.” while loops, on the other hand, run _while_ something remains true. For example:

* While the screw is still loose, keep screwing it in.
* While there is food on the plate, take a bite.
* While there are still emails in your inbox, read the next one.
* While there are still items on your grocery list, get the next one.

We mentioned earlier that anything we express in a for loop can also be expressed in a while loop, and we see that with this last example. We can think of this as, “do this for each item on my list,” or we can think of this as, “do this while there are still items on my list.” It’s also technically true that pretty much every while loop can be rewritten as a for loop, but in practice, usually this is far more of a hack than just a different way of approaching the problem.

Some languages, like Java, also have a special kind of while loop called a do- while loop. We can think of the standard while loop above as a “while-do” loop: while a condition is true, do something. A do-while loop is identical, except that it guarantees the “something” will be run at least once: it does it before checking the condition the first time.

Notice also how while loops are heavily dependent on logical expressions, just like conditionals were. Just as we filled a conditional with a logical expression to decide whether to run its code block, so also we fill a while loop with a logical expression to decide whether to _keep_ repeating its code block. In many ways, you can think of a while loop as a repeated conditional: it repeats _while_ the condition is true, rather than running once _if_ the condition is true.

## 3. Traditional For Loops in Python {#3-Traditional-For-Loops-in-Python-1501} 

Let’s start with the traditional for loop. In practice, the traditional for loop is actually used less in Python than the for-each loop; however, in computing as a whole, the traditional for loop is probably more fundamental. In fact, technically, Python does not even have a traditional for loop: even the for loops are technically for-each loops.

## For Loops with Known Ranges {#For-Loops-with-Known-Ranges-3023} 

Let’s start with a loop where we know how many times we want to run it. Imagine we want to write a loop that will print the numbers from 1 to 10. How do we do that? 

Figure 3.3.1 shows the syntax for this simple loop. Let’s walk through it part by part. First, just like we started with if to do a conditional, we start with for to do a for loop on line 2. Then, we define a variable name. Generally, self-documenting code is the goal, but we use loops so commonly that it’s not uncommon to use a single character—usually i or n—here. We call this the **loop control variable**.

<i-sandbox-py  page-slug="__temp_slug__" code='# Loop this for the numbers 1 through 10
for i in range(1, 11):
	#Prints the current number
	print(i)'>
</i-sandbox-py>

**Figure 3.3.1**

This is a variable we’ll be able to access inside the loop to see how many times the loop has run so far.

Next,we see range(1, 11). This is a little confusing in Python, so I won’t get into the nitty-gritty of how exactly it works. All you need to know is that in this kind of loop, the first time it runs, the variable (in this case, i) will take the first number specified in range() as its value (in this case, the 1 in range(1, 11)). Then, each time the loop runs, the variable will increase by 1. The loop will stop running when the variable equals the second number (in this case, 11). Note that when the variable equals that number, it will _not_ run the loop again; it runs _until_ the variable _equals_ the second number, not until the variable _exceeds_ the second number.

Then, the for loop ends with a colon, Python’s indicator that some indented code block is coming. Then, each line of code indented under the loop statement will be run, in order, each time the loop runs. In this case, these are lines 3 and 4.

So, let’s trace this one. When the computer hits for i on line 2, it creates a variable i. Then, it assigns that variable to the first number in the range; in this case, it assigns it to 1. It then checks to see if the number equals the second number. 1 doesn’t equal 11, so it runs the code and prints the current value of i, 1. When it’s done with the code block, it jumps back to the top and increments i. So, now i is 2. It checks to see if i equals 11. It doesn’t, so it runs it again, then jumps to the top and increments i. It continues like this until i equals 10. At this point, it prints i (10), increments i (to 11), and checks if i equals 11. It does now, so it stops running the loop.

One interesting (but non-essential) note: if you modify i within the body of the loop, the modified value will be used for the rest of _that_ iteration of the loop; however, when that iteration ends, it restores the previous value of i. The _contents_ of the loop can’t control the loop itself. You likely won’t ever encounter this, but it’s an interesting idiosyncrasy of the Python language; in Java and other languages, the contents of the loop _can_ control the loop itself.

<i-sandbox-py  page-slug="__temp_slug__" code='#Loop this for the numbers 1 through 10
for i in range(1, 11):
	#Prints i with a label
	print("Before addition:", i)
	#Adds 1 to i
	i += 1
	#Prints i with a label
	print("After addition:", i)'>
</i-sandbox-py>

**Figure 3.3.2**

## For Loops with Unknown Ranges {#For-Loops-with-Unknown-Ranges-3024} 

One common use of the for loop is to average numbers. So, let’s try that out. Let’s write some code in Figure 3.3.3 that will have the user enter 10 numbers, and then print the average. We’ll start with a known range, but then we’ll look at an unknown range.

First, we need to create sum on line 2, outside the loop with a value of 0 since we haven’t started adding numbers to it. Interesting thought experiment, though: why do we have to create it outside the loop? Couldn’t we create it inside like declaring variables inside our conditionals? The reason is that every time the loop runs, we need to set sum equal to the previous sum plus the new number; if sum didn’t exist before, there is no previous sum, and so the program crashes because we’re not in sum’s scope the first time it runs!

<i-sandbox-py  page-slug="__temp_slug__" code='#Creates sum with the value 0
sum = 0
#Loop 10 times
for i in range(1, 11):
	#Gets the number from user
	nextNumber = int(input("Enter number #" + str(i) + ": "))
	#Add the inputted number to the sum
	sum += nextNumber
#Print the sum over 10
print(sum/10)'>
</i-sandbox-py>

**Figure 3.3.3**

Then, we run the same loop we ran previously starting on line 4, 10 times. Each time, we get the next number from the user, store it in nextNumber, and then add nextNumber to sum. Really, we don’t even need nextNumber—we could add the input directly (after converting it to an integer). I’m using nextNumber here mostly to show off having multiple lines controlled by our for loop. Then, at the end, we print the sum divided by the number of numbers we added, 10.

However, what if we didn’t want to just average 10 numbers? What if we wanted to let the user decide how many numbers to average? We can do that pretty easily, actually: we just have to get the number from the user, then run the loop to that number instead of to 11:

In Figure 3.3.4, instead of just jumping straight to range(1, 11), we instead first prompt the user for the count of numbers to average. Then, we run the loop from 1 to numCount + 1—the plus 1 is so the loop _runs_ the number of times the user inputted instead of stopping one short. Remember, a loop from 1 to 11 runs 10 times, so if the user wants to run 5 times, we need a loop from 1 to 6. 

<i-sandbox-py  page-slug="__temp_slug__" code='#Creates sum with the value 0
sum = 0
#Get the number of numbers to average
numCount = int(input("How many numbers will you average?"))
#Loop numCount times
for i in range(1, numCount + 1):
	#Gets the number input by the user
	nextNumber = int(input("Enter number #" + str(i) + ": "))
	#Add the inputted number to the sum
	sum += nextNumber
#Print the sum over numCount
print(sum/numCount)'>
</i-sandbox-py>

**Figure 3.3.4**

## 3. For-Each Loops in Python {#3-For-Each-Loops-in-Python-1502} 

As I mentioned earlier, I see for-each loops more commonly than I see for loops in Python. Python is specifically set up to make dealing with lists of items easier, and since so many for loops exist to **iterate** over lists of items, for-each loops are very common. We saw this in our examples above: two of our examples of for loops could be easily described as for-each loops:

* For each email in your inbox, read it.
* For each item on your shopping list, go get it.

These are a little simpler to write than the for loops that we saw earlier. A for-each loop runs the same way as a for loop, but it streamlines the process of creating a variable, getting the length of the list, and grabbing the next item during each iteration.

## For-Each and Lists {#For-Each-and-Lists-3025} 

We haven’t covered lists, but you’ve seen them a couple times by now. We’ll cover them more in Unit 4. For now, though, let’s perform the same task as before, but instead of getting numbers one-by-one from the user, let’s have them provided in a list.

In Figure 3.3.5, line 3 creates a list of numbers. The list is called listOfNumbers, and inside the brackets on the right, we list numbers separated by commas. The result is a list of 10 numbers, 91 through 100. We’ll talk about this more in Unit 4. As before, we then create sum and give it the value 0.

<i-sandbox-py  page-slug="__temp_slug__" code='#Creates listOfNumbers and assigns it to a list of ten numbers, 91 through 100
listOfNumbers = [91, 92, 93, 94, 95, 96, 97, 98, 99, 100]
sum = 0
#Runs this loop once for each item, assigning the current item to the variable "currentNumber"
for currentNumber in listOfNumbers:
	sum += currentNumber
#Divides sum by the number of items in the list
print(sum / len(listOfNumbers))'>
</i-sandbox-py>

**Figure 3.3.5**

Line 6 is our for-each loop. Notice that it doesn’t use the word “each.” The computer knows this is a for-each loop because listOfNumbers is a list instead of a range. The computer infers from the context what it should do, like when it inferred from the data types we were using how to use addition and multiplication operators. Just like i took on each number in a range in a for loop, currentNumber is given each value in sequence from the list.

So, let’s trace through this. On the first run of the loop, currentNumber is given the first value from listOfNumbers, which is 91. 91 is added to sum, which was previously 0. So, now the value of sum is 91. That iteration of the loop is now done. The code jumps back to the top, and currentNumber is now assigned to the next value on the list, 92. That value is then added to sum, so sum now equals 183. This continues for each item in the list. Then, the program prints sum divided by the number of numbers that were added, in this case expressed as the length of the list of numbers, or len(listOfNumbers)

To see the equivalence of these different types of for loops, note that the for-each loop in Figure 3.3.5 is identical to the for loop in Figure 3.3.6. In Figure 3.3.6, we run the for loop from 0 to the length of the list of numbers. We start at 0 because the computer sees the first item in the list as the “zeroth” item, for reasons we’ll describe in Unit 4. Then, for each iteration of the list, the first thing we do is grab item i (e.g., item 4) from the list, assign it to currentNumber, and then add currentNumber to sum. It works exactly the same, it just introduces some more manual work: we have to manually get the length of the list and the current number.

<i-sandbox-py  page-slug="__temp_slug__" code='#Creates listOfNumbers and assigns it to a list of ten numbers, 91 through 100
listOfNumbers = [91, 92, 93, 94, 95, 96, 97, 98, 99, 100]
sum = 0
for i in range(0, len(listOfNumbers)):
	currentNumber = listOfNumbers[i]
	sum += currentNumber
#Divides sum by the number of items in the list
print(sum / len(listOfNumbers))'>
</i-sandbox-py>

**Figure 3.3.6**

## For-Each and Other Types {#For-Each-and-Other-Types-3026} 

We’ll use for-each a lot in Unit 4 because many of the data types we’ll discover are different forms of lists. Lists, tuples, and dictionaries are all data types that in some way implement a list-like structure. Another one, however, you’ve already seen: strings. Strings are, effectively, ordered lists of individual characters. So, we can use a for-each loop with a string as well.

For example, imagine we wanted to count the number of words in a string. We might infer that we can do that by counting the number of spaces in the string: the number of words should be the number of spaces, plus one. How do we do this?

In Figure 3.3.7, we’re doing something more complicated than what we’ve done before: we’re using a conditional _inside_ a for-each loop. We check each character (currentCharacter) of the string to see if it equals a space on line 7; if it does, it increments numSpaces on line 8. Then, at the end on line 9, it prints numSpaces + 1, which would be the number of words.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "There are seven words in this string."
numSpaces = 0
#Runs this loop for each character in the string
for currentCharacter in myString:
	#Checks if the character is a space
	if currentCharacter == " ":
		numSpaces += 1
print("There are " + str(numSpaces + 1) + " words in the string.")'>
</i-sandbox-py>

**Figure 3.3.7**

Notice a few things here. First, notice that technically, characters and strings aren’t different data types in Python. They are in many other languages, but in Python, a character is just a string with a length of 1. So, when it iterates over the characters in the string, it’s just iterating over smaller strings of length 1 that make up the bigger string.

Second, notice the nested structures here. The conditional on line 7 is _inside_, or _controlled by_, the for loop on line 5, so it’s indented under the for loop. Line 8, which increments numSpaces, is controlled by both the for loop (it could repeat for each character) and the conditional, so it’s indented under both (and double- indented as a result).

Third, notice the explicit conversion in our print statement on line 9. Python won’t just add a number to a string, so we have to convert it to a string: str(numSpaces + 1). However, notice that we’re adding 1 to numSpaces right here inside the explicit conversion to a string. This isn’t changing numSpaces; if we printed it afterward, it would still equal 6. That’s because we’re not using the assignment operator; we’re not saying numSpaces += 1, we’re just asking for the string version of numSpaces + 1. We’re saying, “what is numSpaces plus one?” instead of “set numSpaces equal to itself plus one.” Note that we can bypass this by using commas instead of addition signs: this tells Python to use the implicit conversion to a string instead, which is what we’ll usually use.

Fourth and finally, notice that this code doesn’t _really_ work the way it’s intended to. It works when we have predictable strings, but it would generate a lot of wrong results. It would say an empty string has 1 word (0 spaces + 1 = 1 word). If a string had back-to-back spaces, it would assume there was a word between them even if there wasn’t. These are what we might call **edge cases**. They’re outside of what we usually expect, but when they happen, they demand some special processing. For example, to improve this, we might tell our code to ignore consecutive spaces, or assume the length of an empty string is zero words.

## 4. While Loops in Python {#4-While-Loops-in-Python-1503} 

for loops run code blocks a certain number of times. This might be the number of items in a list, or a preset number of iterations. A while loop, on the other hand, runs some code as long as some situation or condition remains true.

Any of our for loops could have been rewritten as while loops. However, while loops are good for code where we don’t know how many times we’ll need to repeat in advance. For example, imagine we’re playing a number-guessing game with the user. We don’t know how many guesses it will take to get the correct number. So, we want to repeat while their guess is incorrect.

## Simple While Loops {#Simple-While-Loops-3027} 

Let’s take a simple example of this. You might notice what we’re about to write is similar to something we wrote previously with for loops. That’s exactly right: any for loop can be written as a while loop. Figure 3.3.8 shows some code to count up to a number with a while loop.

<i-sandbox-py  page-slug="__temp_slug__" code='i = 1
#Repeat while i is less than 11
while i < 11:
	print(i)
	i += 1'>
</i-sandbox-py>

**Figure 3.3.8**

On line 1, we create i and set it equal to 1. We need to create it in advance so we can check it when we get to the loop. Then we write our while loop. We start with the word while, which is a reserved word like if and for. We then write the logical expression that will control the loop. Notice this is just like an if statement: in many ways, a while loop is an if statement that repeats until the condition is False instead of just running once if it was True. As before, we end with a colon to mark off the code block the loop will control.

Inside the while loop, we print the current value of i, and then add 1 to it. So, let’s trace this code. When the program reaches the while loop the first time, i is 1, which is less than 11. So, it prints i(1), then adds 1 to i to make it 2.Then, it jumps back to the top and checks the logical expression again: is 2 less than 11? Yes, it still is. So, it runs the body again: it prints i, now 2, and then adds 1 to i, making it 3. It repeats this until i is 11. At that point, the logical expression is no longer true, and so it stops running. Notice that we increment i _after_ we print it. If we incremented it first, the loop would run the same number of times, but it would print 2 to 11 instead of 1 to 10.

Notice how similar this is to our for loops. With our for loop, we noted that when the code jumps back to the top, it increments i or whatever variable we use to control the loop. Here, we increment i manually on line 5. We noted that whenever the code jumps to the top, it checks if i is still less than the second number in the range. Here, this check is what governs the while loop on line 3. So, anything a for loop can do, a while loop can do, too. A for loop—especially a for-each loop in Python—is just a little more efficient to write and often more natural to think about.

## While Loops and Number Guessing {#While-Loops-and-Number-Guessing-3028} 

Let’s try to create a small game using while loops. In this game, we’ll randomly generate a number from 1 to 100, and we’ll ask the user to guess the number. While their guess is wrong, we’ll give them feedback on which direction to guess and repeat until it’s correct. The code for this is shown in Figure 3.3.9.

<i-sandbox-py  page-slug="__temp_slug__" code='import random
#Get a random number from 1 to 100
hiddenNumber = random.randint(1, 100)
#Creates userGuess and give it a value that cannot be correct
userGuess = 0
#Repeat until the guess is correct
while not userGuess == hiddenNumber:
	#Get the next guess as an integer
	userGuess = int(input("Guess a number: "))
	#Check if the guess is too high
	if userGuess > hiddenNumber:
		print("Too high!")
	#Check if the guess is too low
	elif userGuess < hiddenNumber:
		print("Too low!")
	#The guess must be right!
	else:
		print("That is right!")'>
</i-sandbox-py>

**Figure 3.3.9**

We start with import random on line 1 just so we can get random numbers. You can read more about Python’s random library and what you can do with it at https://docs.python.org/3/library/random.html. Then on line 3, we create a random number from 1 to 100 using random.randint(1, 100). Here, that integer was 81, but the user doesn’t know that initially. We then create userGuess on line 5 and give it the value 0; we use 0 because hiddenNumber is greater than or equal to 1, so using 0 guarantees that we won’t accidentally set userGuess to the right answer.

Then, we get started on the while loop on line 7. The while loop repeats as long as the user’s guess is not correct. Initially it’s guaranteed not to be correct, so the contents of the while loop definitely run the first time. It gets the user’s guess (for now, we assume the user correctly enters an integer), and runs a conditional on the guess:

* If the guess is too high, it prints “Too high!”.
* If the guess is too low, it prints “Too low!”.
* If the guess is neither too high nor too low, it must be correct, so it prints “That’s right!”

That’s the end of the while loop’s contents, so how does it know whether to repeat again? At the end of the loop’s contents, userGuess is whatever number the user entered. So, when the loop ends, it jumps back to the top, line 7. Then, it checks userGuess to see if it’s equal to hiddenNumber. If it _is_ equal, then this statement is False because of the not in front, and so if it _is_ equal, the loop will not repeat. If it’s not equal, the loop repeats again.

## Infinite Loops {#Infinite-Loops-3029} 

You might notice in the previous example that something risky could happen. What if the user never enters the right answer? What if they just enter “1” over and over and over again? The program will never end! Now what if instead of waiting on user input in the loop, the loop could just run as fast as it wanted? This is called an **infinite loop**: a loop that, by its design, will never end.

These are very easy to create. This simple loop in Figure 3.3.10, for example, will never end. We create i, our loop control variable, and assign it the value 1. Then, we create a while loop that repeats as long as i is greater than 0. Every time it repeats, we just print i. What will the result be here? Simple: it will just print 1 over and over and over again, millions of times per second if our computer allows it. If the loop repeats so long as i is greater than 0 and the value of i never changes, then the loop will never terminate.

<i-sandbox-py  page-slug="__temp_slug__" code='i = 1
while i > 0:
	print(i)'>
</i-sandbox-py>

**Figure 3.3.10**

Infinite loops are errors, but they’re interesting errors in that they generally don’t give us any actual error messages. When we use a variable outside its scope or divide by zero, the computer tells us, “Hey, you can’t do that!” But when we have an infinite loop in our code, it just runs and runs and runs. If your code is complex, it can be tough to tell if it’s just running normally and taking a while, or encountering an infinite loop. print() statements can help with this: if you use print debugging and see the same thing printed over and over again, it often means you’re looping over the same thing over and over. I can say, personally, I’ve done that _many_ times, usually just by forgetting to add that last line that increments some loop control variable.

## 5. Advanced Loops: Nesting in Python {#5-Advanced-Loops-Nesting-in-Python-1504} 

We discussed previously that we can nest conditionals within one another. We can do the same thing with loops. We can have for loops inside for loops and for loops inside while loops. We can have while loops inside while loops and while loops inside for loops. We can have for loops inside while loops inside conditionals and conditions inside while loops inside for loops. Before this book becomes too much like a Dr. Seuss poem, let’s take a look at some examples.

## Nested For Loops {#Nested-For-Loops-3030} 

Earlier, we used for-each loops to loop over lists of strings and characters in a string. Now, let’s try doing both at once. Imagine we have a list of strings of multiple words, and we want to count the words in the list. To do that, we need to iterate over each character in each string; there are two “each”es in that statement, which means two for-each loops.

Figure 3.3.11 shows the code that does this. First, in lines 3 through 5, note that we have another way to tell the computer to interpret multiple lines as one line for human readability. If we’re creating a list and separating our list items with commas, we can create a new line and continue the list. Python knows that the list isn’t over until it sees that closed bracket, so it knows we’re still creating the list—that lets us break the line up into multiple visual lines so that we can read it more easily.

<i-sandbox-py  page-slug="__temp_slug__" code='#Creates listOfStrings and assigns it a list of strings each with multiple words
listOfStrings = ["This is the first string", "This is the second string", "This is the third string", "This is the fourth string", "This is the fifth string"]
numSpaces = 0
#Loops over each string in listOfStrings
for currentString in listOfStrings:
	#Loops over each character in currentString
	for currentCharacter in currentString:
		#Checks if the current character is a space
		if currentCharacter == " ":
			numSpaces += 1
numWords = numSpaces + len(listOfStrings)
print("There are ", numWords, " words in these strings.")'>
</i-sandbox-py>

**Figure 3.3.11**

Starting on line 8, we loop over each of the strings in listOfStrings. Each time we loop, the next string in the list gets assigned to the variable currentString. So, the first time this loop (the “outer loop”) runs, currentString is assigned the value “This is the first string.” The second time it runs, current- String is assigned the value “This is the second string.” And so on.

Each time the outer loop iterates once, the inner loop on line 10 runs. This one iterates over each character in currentString. For each character, it checks if the character is a space, and increments numSpaces if so. Notice that numSpaces is created outside _both_ loops. If we created it inside the inner loop, the code would run, but with each iteration of the outer loop, its value would be reset. So, by the end of it, we’d have a list of spaces in the _last_ string, not all the strings.

After this code has iterated over every character in every string, it then creates numWords and sets it equal to numSpaces + len(listOfStrings) on line 15. Why does it do this? Recall that previously, we added 1 to numSpaces because one space meant two words. Here, that’s true for each string individually: each string’s first space suggests two words. So, we want to add one for each string in the list. Granted, there are other ways we could do this, too: we could run an additional for-each loop at the end to add 1 for each string, or we could simply add 1 to numSpaces each time the outer loop runs, assuming there is at least one word in the string.

## Nesting Both Loops {#Nesting-Both-Loops-3031} 

The previous example showed nesting for loops (and as an added bonus, nesting a conditional inside a for loop). What about nesting while loops inside for loops, or for loops inside while loops? Let’s try that out. Let’s take our previous while loop-enabled number-guessing game and extend it to allow the player to decide in advance how many games they’d like to play. Note that we’re about to get pretty complicated, so if you find yourself confused, don’t worry: try to trace through the code line-by-line to understand how it’s running.

<i-sandbox-py  page-slug="__temp_slug__" code='import random
numGames = int(input("How many games would you like to play? "))
#Repeats this the number of games the user chose
for i in range(0, numGames):
	print("Game start!")
	#Get a random number from 1 to 100
	hiddenNumber = random.randint(1, 100)
	#Create userGuess and give it a value that cannot be correct
	userGuess = 0
	#Repeat until the guess is correct
	while not userGuess == hiddenNumber:
		#Get the next guess as an integer
		userGuess = int(input("Guess a number: "))
		#Check if the guess is too high
		if userGuess > hiddenNumber:
			print("Too high!")
		#Check if the guess is too low
		elif userGuess < hiddenNumber:
			print("Too low!")
		#The guess must be right!
		else:
			print("That is right!")'>
</i-sandbox-py>

**Figure 3.312**

This code is shown in Figure 3.3.12. Notice a few things here: first, notice that we keep the import statement at the top. That’s a common convention, to put all the import statements at the top. For now, don’t worry too much about what these do: just know that sometimes with things like random and datetime, we have to import something before we can use it.

Second, notice that in my outer for loop on line 4, I’m running the loop from 0 to numGames instead of 1 to numGames + 1. These will run the same number of times, and if I don’t care to print or use the value of i inside the loop, the fact that it starts at 0 isn’t as confusing. Even if it was, I could simply print i + 1 whenever I wanted to use it to translate it from Python’s interpretation to ours.

Third and most importantly, though, notice that it took only two lines (lines 2 and 4) of code to change this game from running once to running a user-defined number of times. In fact, we could have shrunk it even more to only one line; we could replace numGames in line 4 with the input function call itself. That’s the power of loops: tiny segments of code can radically change the behavior of the finished product.

This is still a little bit of an odd design, though. What if the user decides halfway through they want to quit? Or what if they reach the end and decide they want to keep playing? We can take care of that by switching this to nested while loops, as shown in Figure 3.3.13.

<i-sandbox-py  page-slug="__temp_slug__" code='import random
keepPlaying = "y"
#While keepPlaying is "y"
while KeepPlaying == "y"
	print("Game start!")
	#Get a random number from 1 to 100
	hiddenNumber = random.randint(1, 100)
	#Create userGuess and give it a value that cannot be correct
	userGuess = 0
	#Repeat until the guess is correct
	while not userGuess == hiddenNumber:
		#Get the next guess as an integer
		userGuess = int(input("guess a number: "))
		#Checks if the guess is too high'>
</i-sandbox-py>

**Figure 3.3.13**

Instead of asking for the number of games in advance and running a for loop, we could instead ask the user at the end of each game if they want to continue. Then, we run a while loop while their answer to the final question is “y” for “yes.” To design it this way, we would set the initial value of keepPlaying to “y” on line 2 so that the loop is guaranteed to run the first time. Other languages might do this with a do-while loop, which similarly guarantees the loop will run at least once, but Python does not have a do-while loop.

## 6. Advanced Loops: Keywords and Scope in Python {#6-Advanced-Loops-Keywords-and-Scope-in-Python-1505} 

Before we end our discussion of loops, there are two final things we should discuss. First, Python has a couple of additional keywords that govern loops. So far we’ve covered for, while, and in. We also have continue, break, and pass. In prac- tice, these are used relatively rarely (in my experience, anyway), but they’re worth covering in case you come across them.

Second, we discussed scope earlier in our material. Scope is important for loops as well, so we’ll briefly discuss the scope of variables used in loops.

## Advanced Loop Keywords {#Advanced-Loop-Keywords-3032} 

There are three final keywords with loops that are worth covering, although to be honest, I find relatively few opportunities to use these. They’re covered here for the sake of completeness, but don’t be surprised if you rarely see these in the wild.

The first is the continue statement. The continue statement forces the current iteration of the loop to stop, skipping over any remaining code inside the loop, as shown in Figure 3.3.14.

<i-sandbox-py  page-slug="__temp_slug__" code='#Runs this loop 20 times
for i in range(1, 21):
	#Checks if i is even
	if i % 2 == 0:
		#Skips the rest of the code block if so
		continue
	#Prints that i is odd
	print(i, "is odd.")
print("Done!")'>
</i-sandbox-py>

**Figure 3.3.14**

This code runs 20 times and prints the odd numbers. It does this by checking if i, the loop control variable, is even. If it’s even, it runs the continue statement, which skips the remainder of the loop’s code and continues to the next iteration. The keyword continue is used inside a loop’s code block to skip the rest of the code block for the current iteration, and return to the loop itself.

The second advanced structure is the break statement. Like the continue statement, the break statement forces the entire loop to terminate; it will not iterate any further even if the conditions governing the loop remain True, as shown in Figure 3.3.15.

<i-sandbox-py  page-slug="__temp_slug__" code='#Runs this loop 20 times
for i in range(1, 21):
	#Checks if i is even
	if i % 2 == 0:
		#Skips the rest of the code block if so
		break
	#Prints that i is odd
	print(i, "is odd.")
print("Done!")'>
</i-sandbox-py>

**Figure 3.3.15**

If we replace the continue statement with a break statement, then just like before, the loop terminates before it prints i for the second iteration. Unlike with the continue statement, however, with break, the loop terminates altogether. It jumps straight to whatever line follows the loop’s code block, as opposed to back up to the loop itself. It breaks the loop.

Finally, the third advanced loop keyword we might use is the word pass. The keyword pass exists by necessity. How do you have a loop with an empty code block? A blank line isn’t interpreted as a line by Python; something needs to be there and indented. The keyword pass is simply what you put if you want to run a loop that does nothing. It can also be used when you want to run a conditional, function, or exception handler with no code block underneath it as well. Why would you want to do either of these things? That mystery is left to you, dear reader. (Also, we’ll see why later in this unit.)

## Scope and Loops {#Scope-and-Loops-3033} 

Finally, we should briefly talk about scope in the context of loops. As we said with conditionals, the scope of a variable is the area of the program’s execution where the variable can be seen. In Python, a variable’s scope is effectively anything after the variable is created. It doesn’t matter if it’s declared inside a loop or outside a loop; anything after the variable is created is within the variable’s scope.

With conditionals, this presented a challenge if a variable was created inside a conditional, then referred to outside the conditional. If the conditional didn’t run (which, by design, it sometimes shouldn’t—if it always should, why have a conditional?), then the variable was not created, and referring to it later would create an error. This isn’t as big a deal in loops. We rarely create loops that might not run at all. It can happen, but it isn’t a common decision in my experience.

However, loops create a different issue for creating variables inside loops. The first time you assign a value to a variable, Python creates the variable. The second time, Python just changes the variable’s value. That means if you create a variable inside a loop, then every time the loop runs, its value is _replaced_, as shown in Figure 3.3.16. Many times that’s perfectly fine; if you only need the value of that variable within one iteration of the loop, then there’s no problem replacing its old value with the new one.

<i-sandbox-py  page-slug="__temp_slug__" code='#Get the number of numbers to average
numCount = int(input("How many numbers will you average? "))
#Loop numCount times
for i in range(1, numCount + 1):
	#Creates sum with the value 0
	sum = 0
	#Gets the number from user
	nextNumber = int(input("Enter number #" + str(i) + ": "))
	sum += nextNumber
#Prints the sum over numCount
print(sum / numCount)'>
</i-sandbox-py>

**Figure 3.3.16**

However, if you’re going to reference the variable outside the loop, _usually_ it’s because you wanted that variable to persist across different iterations of the loop. If the variable was created inside the loop, then referencing it after the loop will just give you the value the variable received the last time the loop ran, which is rarely what we want. So, the same advice I had in conditionals applies here, too: generally, if you need to refer to a variable outside a loop, don’t create it inside a loop. Create it before the loop, as shown in Figure 3.3.17. 

<i-sandbox-py  page-slug="__temp_slug__" code='#Creates sum with the value 0
sum = 0
#Get the number of numbers to average
numCount = int(input("How many numbers would you like to average? "))
#Loop numCount times
for i in range(1, numCount + 1):
	#Gets the number input by the user
	nextNumber = int(input("Enter number #" + str(i) + ": "))
	#Add the inputted number to sum 
	sum += nextNumber
#Print the sum over numCount
print(sum / numCount)'>
</i-sandbox-py>

**Figure 3.3.17**

## 7. Loops and Turtles {#7-Loops-and-Turtles-1506} 

Last time in our work with the turtles graphics module, we created a little segment of code that would allow the user to enter two commands (turn or forward) two times. That was rather limited, though: with only two iterations, we could draw at most one line in any direction. With loops, though, we’ve already seen how we can loop some code until the user is done. Let’s apply that to our turtles with a while loop, and then use a for loop to create an interesting portion of an image for the user to draw.

## While Loops for Repeated Commands {#While-Loops-for-Repeated-Commands-3034} 

We noted before that it only took a couple of extra lines to make some code repeat with a while loop. We’ll see the same thing in WhileLoopsforRepeatedCommands.py.

As we see, it’s actually far less code to loop over this with this while loop than it was to repeat it twice manually! After deleting the repeated code, we only made the following changes:

* Created command outside the loop on line 2 so we could use it in the loop’s logical expression. This way, the user just enters the command “end” to stop the loop.
* Add the while loop line to repeat until command is “end” on line 5
* Add a separate elif to check for “end” on line 21. We need this because otherwise, if the user entered “end,” it would be caught by the else on line 24 and register as an invalid command. However, we don’t need to _do_ anything inside that elif because the loop won’t repeat again if command is “end” (because of the condition for the while loop; we just have to prevent the else from running.

Interestingly, we could have also used break or continue where we use pass here. If the user enters “end,” our goal is to stop repeating the loop. Using break would force the loop to stop altogether. Using continue would skip the else (which wouldn’t run anyway) and return to the logical expression govern- ing the loop, which would end the loop, too, since the command now is “end.” It’s important to note as well that we could restructure this loop to not have to use pass, continue, or break at all.

With this relatively simple change, we now have some code that will allow the user to keep entering commands until they type end. They could run 200 commands if they wanted to and draw pretty complex figures.

## For Loops for Drawing Shapes {#For-Loops-for-Drawing-Shapes-3035} 

We've seen how a while loop can be used to let the user keep entering multiple commands. Now let’s see how we could use a for loop to create some more complex commands. We’re going to implement a shape command. A shape command lets the user enter a number of sides and a side length, and it will draw the regular polygon that they entered. If they entered 4 and 100, for example, it would draw a square with side length 100, starting from the current direction it’s facing. What’s remarkable is this actually won’t take many lines of code!

The results of this implementation are in ForLoopsforDrawingShapes.py. In six lines (not including comments), we created this ability. Let’s walk through them.

* In line 21, we check if the command entered was “shape,” just like the other commands. In line 23, we get the number of sides. For now, we just assume the user enters a valid number of sides (an integer greater than 2).
* In line 25, we get the length of each side. Again, we assume the user enters a valid number (any integer). In line 27, we run a loop for however many sides the user wrote. Here,we use a convention in Python: if we’re never going to _use_ the loop control variable (what we usually call i), then we name it _, the underscore character. Python sees this just as a normal variable name, but visually, it’s a nice indicator to other humans that this variable is never used besides its role controlling the loop.
* In line 28, we simply move the turtle forward by the side length. In line 29, we use a little principle from math to complete our shape. To draw a complete shape, we need to rotate 360 total degrees. So, we divide 360 degrees by the number of sides, and rotate that length at the end of each side. This way, we’re guaranteed to draw a complete shape.

With only these six lines, the user can now enter a number of sides and side length, and Python will automatically draw the corresponding shape. The code starts with the turtle in whatever direction it was facing originally, so we can rotate to draw shapes in different orientations. For example, if issued the command “turn” with angle 45, then “shape” with numSides 4 and side length 50, we’d draw a diamond with sides of length 50.

It’s cool that we can do that, but if we wanted to add a lot of commands like that, this code would get really long. It would get hard to differentiate the high-level organization from the details of drawing individual shapes or patterns. So, in the next chapter, we’ll talk about functions. Among several other benefits, functions are ways of separating out often-used code so that we can refer to it from different places without cluttering our code.

