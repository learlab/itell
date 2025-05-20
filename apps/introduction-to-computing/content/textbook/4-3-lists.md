---
assignments:
- summary
chunks:
- title: 1. What Are Lists?
  slug: 1-What-Are-Lists?-1555
  type: plain
- title: Properties of Lists
  slug: Properties-of-Lists-3174
  type: regular
- title: List Synonyms
  slug: List-Synonyms-3175
  type: regular
- title: 2. Tuples in Python
  slug: 2-Tuples-in-Python-1556
  type: plain
- title: Declaring Tuples
  slug: Declaring-Tuples-3176
  type: regular
- title: Reading Tuples
  slug: Reading-Tuples-3177
  type: regular
- title: Usefulness of Tuples
  slug: Usefulness-of-Tuples-3178
  type: regular
- title: Nesting Tuples
  slug: Nesting-Tuples-3179
  type: regular
- title: 3. Lists in Python
  slug: 3-Lists-in-Python-1557
  type: plain
- title: Lists as Tuples
  slug: Lists-as-Tuples-3180
  type: regular
- title: List Functions
  slug: List-Functions-3181
  type: regular
- title: 4. Lists, Loops, and Functions
  slug: 4-Lists,-Loops,-and-Functions-1558
  type: plain
- title: Iterating Over a List
  slug: Iterating-Over-a-List-3182
  type: regular
- title: Iterating Over a 2-Dimensional List
  slug: Iterating-Over-a-2-Dimensional-List-3183
  type: regular
- title: Lists and Functions
  slug: Lists-and-Functions-3184
  type: regular
- title: Lists vs. Tuples
  slug: Lists-vs-Tuples-3185
  type: regular
- title: 5. Advanced List-Like Structures
  slug: 5-Advanced-List-Like-Structures-1559
  type: plain
- title: Stacks
  slug: Stacks-3186
  type: regular
- title: Queues
  slug: Queues-3187
  type: regular
- title: Linked List
  slug: Linked-List-3188
  type: regular
- title: 6. Lists and Turtles
  slug: 6-Lists-and-Turtles-1560
  type: plain
- title: Listing Commands
  slug: Listing-Commands-3189
  type: regular
- title: Preparing for the Record Function
  slug: Preparing-for-the-Record-Function-3190
  type: regular
- title: The Record Function
  slug: The-Record-Function-3191
  type: regular
cri:
- question: How do different programming languages differ in their implementations of lists?
  answer: Programming languages differ in mutability and homogeneity of lists, where some allow changing values and size, while others restrict items to the same type.
  slug: Properties-of-Lists-3174
- question: What is a commonality among list-like structures mentioned in the passage?
  answer: They contain an ordered series of values accessed via numeric indices.
  slug: List-Synonyms-3175
- question: Can tuples have multiple data types within them?
  answer: Yes, tuples can have multiple data types within them, such as strings, floats, and integers.
  slug: Declaring-Tuples-3176
- question: What syntax can be used to access individual parts of a tuple in Python?
  answer: Indexing with brackets.
  slug: Reading-Tuples-3177
- question: What is the real value of tuples according to the passage?
  answer: The real value of tuples comes in places where we can only pass one variable back and forth, but we want to pass multiple values.
  slug: Usefulness-of-Tuples-3178
- question: How can you access individual values of a nested tuple?
  answer: The first index determines which tuple to grab, and the second index determines which element from that tuple you get.
  slug: Nesting-Tuples-3179
- question: What is different between tuples and lists in Python?
  answer: The difference is that lists are defined with brackets instead of parentheses.
  slug: Lists-as-Tuples-3180
- question: What does the 'append(item)' method do in Python lists?
  answer: Adds item to the end of the list, lengthening the list by one.
  slug: List-Functions-3181
- question: What does the function average() do in the provided code snippet?
  answer: It calculates the average of the numbers in a list by iterating over each item in the list and summing them up.
  slug: Iterating-Over-a-List-3182
- question: How does the TwoDAverage function iterate over a two-dimensional list of grades to calculate the average for each student?
  answer: It uses a nested loop structure with an outer loop iterating over each list of grades (student) and an inner loop iterating over each grade within the list.
  slug: Iterating-Over-a-2-Dimensional-List-3183
- question: Why is it important to be cautious when passing mutable data types like lists to functions?
  answer: Because any modifications made to the list within the function will persist outside of the function, potentially causing unintended changes in the main program.
  slug: Lists-and-Functions-3184
- question: Why would you ever use tuples instead of lists?
  answer: Tuples are typically used when dealing with a predetermined number of items or when grouping together different kinds of information.
  slug: Lists-vs-Tuples-3185
- question: What is the purpose of using a stack when programming a robot to search for keys?
  answer: To ensure that the robot searches each room, piece of furniture, and drawer before moving on to the next area.
  slug: Stacks-3186
- question: What is the main difference between queues and stacks?
  answer: The main difference is that queues are First-In-First-Out (FIFO) while stacks are Last-In-First-Out (LIFO).
  slug: Queues-3187
- question: Automatic question-generation has failed. Please try again.
  answer: Automatic answer-generation has failed. Please try again.
  slug: Linked-List-3188
- question: What is the purpose of using all caps when defining VALID_COMMANDS as a tuple?
  answer: To specify it as a constant, a variable whose value won't be changed.
  slug: Listing-Commands-3189
- question: What is the purpose of creating a command that allows the user to enter multiple commands and a number of times to repeat them?
  answer: To enable the user to enter a list of commands and specify the number of times to repeat them for execution.
  slug: Preparing-for-the-Record-Function-3190
- question: How could we have implemented the recording function differently?
  answer: We could have repeatedly passed the list recordList and the boolean recording back and forth between the main code and the functions themselves.
  slug: The-Record-Function-3191
next_slug: 4-4-file-input-and-output
order: 7
parent:
  title: 'Unit 4: Data Structures'
  slug: unit-4-data-structures
quiz: null
slug: 4-3-lists
title: 4.3 Lists
---

## 1. What Are Lists? {#1-What-Are-Lists?-1555} 

**List-like structures** are data structures that themselves store multiple values. For example, think of a file folder (a real one, in a file cabinet, not one on your computer). In one sense, you could think of that folder as a singular object. In another sense, you could think of it as a container of several other objects, each individual page inside the folder. If someone were to ask you for the folder, you could give them the folder; yet, the folder on its own is not data, it just contains other data.

That’s effectively what a list is: a single variable that contains multiple values. Actually, this definition is even a little too broad: this would encompass other data structures that we’ll talk about later. More specifically, lists are variables that contained ordered lists of values, accessed via numbers called indices (plural for index).

## Properties of Lists {#Properties-of-Lists-3174} 

We’re starting to get into the more advanced areas of computing, and so as we go forward, fewer and fewer things will be common across multiple languages. Lists are a good example of this. Nearly every programming language has some concept of a list, but the terminology and specific details differ significantly. 

One major way different languages differ in their implementations of lists is mutability. Mutability for a list can involve two things: one, whether the values of the list can be changed, and two, whether the size of the list can be changed. Some list implementations will freely let you keep appending new items to the end, while others require you to state in advance how many items can fit in the list. Generally, the latter is more common for lower-level languages like C, where we manage memory more deliberately.

Another major way list-like structures may differ is whether they accept multiple types. This is called **homogeneity** in lists. In some list implementations, every item in a list must be of the same type: you can have a list of integers, a list of strings, or a list of dates, but you can’t have a single list that has integers, strings, dates, and other types. Other languages don’t have this restriction.

There are benefits to these different properties, so many languages will provide multiple ways to use list-like structures. What, then, defines a list? A list is a data structure that contains multiple values, accessed via an ordered numerical index; in other words, lists will have a first value, a seventh value, and so on. This is in contrast to Dictionaries, HashTables, and other data structures that also contain multiple values, but that access them via non-numeric keys.

## List Synonyms {#List-Synonyms-3175} 

List-like structures go by various names: lists, arrays, tuples, vectors, tables, and more. The specific terms used depend on the language. Java, for example, uses “array” and “list” to refer to different things. “Tuple” is most commonly used in Python. Oftentimes, “array” is used to refer to a more primitive structure that only supports changing the existing values, whereas “list” refers to more complex data structures that support sorting, inserting, and other operations. “Tuples” are often immutable.

<i-image
  style="aspect-ratio:292/394;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/4.3.1-721253de59b0a426756d58e2a442b7ac.png"
  alt="4.3.1"
  width="292"
  height="394">
</i-image>

**Figure 4.3.1**

As noted above, which specific implementation you’ll use depends on your language. The commonality among these list-like structures is that they contain an ordered series of values accessed via numeric indices.

## 2. Tuples in Python {#2-Tuples-in-Python-1556} 

Python has two major list-like structures: **tuples** and **lists.** Tuples are immutable, lists are mutable. The immutable type tends to be simpler because it can’t be modi- fied after it’s declared, although for the same reason it tends to be less useful. So, let’s start with tuples, then move on to more advanced lists.

## Declaring Tuples {#Declaring-Tuples-3176} 

To declare a tuple, we set a variable equal to a comma-separated series of values or variables, as shown on line 2 of Figure 4.3.2. Here, we’re creating a tuple (called a 3-tuple because it has three values) with the values 1, 2, and 3. We’ve done this here in terms of values, but if we use variables, it still pulls out the values and creates a tuple with these values, as shown on lines 7 and 8 in Figure 4.3.3. 

<i-sandbox-py  page-slug="__temp_slug__" code='#Creates myTuple with the tuple (1, 2, 3)
myTuple = (1, 2, 3)
print(myTuple)'>
</i-sandbox-py>

**Figure 4.3.2**

<i-sandbox-py  page-slug="__temp_slug__" code='myInt1 = 1
myInt2 = 2
myInt3 = 3
#Creates myTuple and assigns it the tuple #(myInt1, myInt2, myInt3)
myTuple = (myInt1, myInt2, myInt3)
print(myTuple)'>
</i-sandbox-py>

**Figure 4.3.3**

Note that the parentheses are optional in both Figure 4.3.2 and Figure 4.3.3; the same result would occur from myTuple = 1, 2, 3 and myTuple = myInt1, myInt2, myInt3. The parentheses are always optional except for in those places where they would make a difference, such as differentiating passing a tuple to a function from passing three arguments. However, I recommend including the parentheses. They never hurt, and they sometimes help.

Tuples can have multiple data types within them. For example, we could create a tuple of a string, a float, and an integer, as shown in Figure 4.3.4. Here, the first value of the tuple is a string, the second is a float, and the third is an integer. This follows Python’s general procedure of being loosely typed: Python never really cares what data types you’re using until you try to do something that doesn’t make sense. Imagine, though, if you assumed every value in the tuple was a string and attempted to call isupper() on each to check if they were uppercase. That would crash on the second item in the tuple because it isn’t a string, so we need to be careful to know what data types we’re dealing with.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "Hello, world!"
myFloat = 5.1
myInteger = 5
#Creates myTuple as a tuple with the values of myString, myFloat, myInteger
myTuple = (myString, myFloat, myInteger)
print(myTuple)'>
</i-sandbox-py>

**Figure 4.3.4**

## Reading Tuples {#Reading-Tuples-3177} 

To access the individual items of a tuple, we use the same syntax we used for accessing individual characters in a string. As far as Python is concerned, strings, tuples, and lists are all pretty much the same.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "Hello, world!"
myFloat = 5.1
myInteger = 5
#Creates myTuple as a tuple with the values of myString, myFloat, myInteger
myTuple = (myString, myFloat, myInteger)
#Prints the first element of myTuple
print(myTuple[0])
#Prints the second element of myTuple
print(myTuple[1])
#Prints the third element of myTuple
print(myTuple[2])'>
</i-sandbox-py>

**Figure 4.3.5**

As shown in lines 10, 12, and 14 of Figure 4.3.5, to read an individual value from a tuple, we simply place the index in brackets after the variable name to access that specific element. This analogy to strings extends to slicing as well. We can access individual parts of the tuple using the same syntax we used with strings. Figure 4.3.6 shows a long tuple with some examples of slicing it the way we sliced strings on lines 11 through 19. All the same splicing syntax we used for strings works here for tuples as well.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "Hello, world!"
myFloat = 5.1
myInt1 = 5
myCharacter = "Q"
myInt2 = -1
myTuple = (myString, myFloat, myInt1, myCharacter, myInt2)
#Prints myTuple values from #4 to the end
print(myTuple[3:])
#Prints the first two values of myTuple
print(myTuple[:2])
#Prints the second and third values of myTuple
print(myTuple[1:3])
#Prints all but the last three values of myTuple
print(myTuple[:-3])'>
</i-sandbox-py>

**Figure 4.3.6**

Tuples also have a handy syntax for unpacking them, shown in line 11 of Figure 4.3.7. While technically this doesn’t allow us to do anything we couldn’t do before (since we could have referred to the tuple parts by index whenever we needed them), it allows us to easily unpack the parts of a tuple into variables with self-documenting names again rather than remembering what kind of data is held at each index.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "Hello, world!"
myFloat = 5.1
myInt1 = 5
myCharacter = "Q"
myInt2 = -1
#Packs these five variables into myTuple
myTuple = (myString, myFloat, myInt1, myCharacter, myInt2)
#Unpacks myTuple into these variables
(myNewString, myNewFloat, myNewInt1, myNewCharacter, myNewInt2) = myTuple
print(myNewString)
print(myNewFloat)
print(myNewInt1)
print(myNewCharacter)
print(myNewInt2)'>
</i-sandbox-py>

**Figure 4.3.7**

## Usefulness of Tuples {#Usefulness-of-Tuples-3178} 

Given that tuples are immutable, they lack some of the value of traditional lists. We would not use tuples to store a list of students on a class roster, for example, because students might enroll or drop, and a tuple could not add or remove those students. Similarly, we would not use tuples to store data that we want to sort because the element order cannot be changed.

In that case, what are tuples good for? You might be tempted to say, “A tuple lets me use fewer variable names!”, but that’s not inherently a good thing. Remember, we want our variables to be self-documenting, and having to remember which index corresponds to which value isn’t self-documenting.

Rather, the real value of tuples comes in places where we can only pass one variable back and forth, but we want to pass multiple values. The most prominent example of that is the return statements of functions. A function or method can only return one value, but if it returns a tuple, it can actually return multiple values contained within that list. The receiving code merely needs to know what is located at each index of the tuple. Let’s try an example of this: imagine we want to tie together floor division and modulus so that we can call one function and get both the quotient and remainder for a division operation.

<i-sandbox-py  page-slug="__temp_slug__" code='#Returns a tuple containing the quotient and remainder
def quotientAndRemainder(dividend, divisor):
	#Gets the quotient
	quotient = dividend // divisor
	#Gets the remainder
	remainder = dividend % divisor
	#Returns the tuple of the quotient and remainder
	return (quotient, remainder)
myDividend = 11
myDivisor = 4
tupleResults = quotientAndRemainder(myDividend, myDivisor)
#Prints the first element of tupleResults
print("Quotient:", tupleResults[0])
#Prints the second element of tupleResults
print("Remainder:", tupleResults[1])'>
</i-sandbox-py>

**Figure 4.3.8**

In lines 2 through 8 of Figure 4.3.8, we define a function quotientAndRemainder that takes as parameters a dividend and a divisor. It calculates the quotient and remainder, then returns a tuple containing the quotient in the first spot and the remainder in the second on line 8. The main code of the program on lines 15 and 17 knows (because we told it) that it can find the quotient in the first spot and the remainder in the second, so it prints them. Thus, we’ve returned two values with one function by packaging them as a tuple.

We can actually make this code shorter and more readable respectively by performing the operations in the tuple assignment and by using the unpacking trick we saw earlier, as shown in Figure 4.3.9. Here, we skip creating new temporary variables to hold the quotient and remainder by calculating them on line 4, and we make our code more readable by unpacking the resultant tuple into myQuotient and myRemainder on line 10 instead of referring to these values as tupleResults\[0\] and tupleResults\[1\]. This gives tuples what appear to be some considerable power. However, we’ll later see that Dictionaries are actually even better for this, at least in some ways.

<i-sandbox-py  page-slug="__temp_slug__" code='#Returns a tuple containing the quotient and remainder
def quotientAndRemainder(dividend, divisor):
	#Returns the tuple of the quotient and remainder
	return (dividend // divisor, dividend % divisor)
myDividend = 11
myDivisor = 4
#Assigns the first value of the result to myQuotient and the second to myRemainder
(myQUotient, myRemainder) = quotientAndRemainder(myDividend, myDivisor)
print("Quotient:", myQuotient)
print("Remainder:", myRemainder)'>
</i-sandbox-py>

**Figure 4.3.9**

## Nesting Tuples {#Nesting-Tuples-3179} 

Finally, tuples can be nested. You can have a tuple of tuples. First, we could do this by creating tuples, and then creating a tuple that contains those tuples, as shown in lines 1 through 5 in Figure 4.3.10.

<i-sandbox-py  page-slug="__temp_slug__" code='myTuple1 = (1, 2, 3)
myTuple2 = (4, 5, 6)
myTuple3 = (7, 8, 9)
mySuperTuple = (myTuple1, myTuple2, myTuple3)
print(mySuperTuple)'>
</i-sandbox-py>

**Figure 4.3.10**

The nested sets of parentheses in the output of Figure 4.3.10 show that these are nested tuples: the outer set of parentheses defines the tuple as a whole, and the inner sets of parentheses define each smaller tuple. You might notice that it looks like this syntax could be used in-line as well, and you would be correct, as shown in Figure 4.3.11.

<i-sandbox-py  page-slug="__temp_slug__" code='mySuperTuple = ((1, 2, 3), (4, 5, 6), (7, 8, 9))
print(mySuperTuple)'>
</i-sandbox-py>

**Figure 4.3.11**

How would you then access individual values of this nested tuple? The first index you provide would determine which of the three tuples you grab, and the second index you provide would determine which element from that tuple you get. So, to get the first item of the second tuple, you ask for mySuperTuple\[1\]\[0\]), as shown in Figure 4.3.12.

<i-sandbox-py  page-slug="__temp_slug__" code='myTuple1 = (1, 2, 3)
myTuple2 = (4, 5, 6)
myTuple3 = (7, 8, 9)
mySuperTuple = (myTuple1, myTuple2, myTuple3)
#Prints the first item of the second tuple
print(mySuperTuple[1][0])'>
</i-sandbox-py>

**Figure 4.3.12**

Remember, tuples are like strings and all other list-like structures in Python: they’re zero-indexed. So, to get the first item, you request the item at index 0. This is why requesting mySuperTuple\[1\]\[0\] yields 4: mySuperTuple\[1\] yields the second tuple, and mySuperTuple\[1\]\[0\] yields the first item of the second tuple.

## 3. Lists in Python {#3-Lists-in-Python-1557} 

For the most part, anything you can do with a tuple, you can also do with a list. Most of the syntax is the same, even. Lists are created similarly, sliced the same way, accessed the same way, and nested the same way. The major difference is that lists are mutable, which means we can add items to them or remove items from them. So, let’s start by quickly demonstrating the extent to which lists are the same as tuples, then find out what makes them different.

## Lists as Tuples {#Lists-as-Tuples-3180} 

Nearly everything we did with tuples, we can also do with lists. Figure 4.3.13 runs through all the different creation, unpacing, and slicing methods we covered with tuples, showing they work with lists as well.

Notice that the output of each block throughout this process matches the output of the corresponding block from the tuple examples in the previous lesson. The only difference is that lists are defined with brackets (as shown on line 7 of Figure 4.3.13) instead of parentheses.

<i-sandbox-py  page-slug="__temp_slug__" code='#Returns a tuple containing the quotient and
def quotientAndRemainder(dividend, divisor)
	#Returns the tuple of the quotient and remainder
	return [dividend // divisor, dividend % divisor]
myDividend = 11
myDivisor = 4
#Assigns the first value of the result to myQuotient and the second to myRemainder
[myQuotient, myRemainder] = quotientAndRemainder(myDividend, myDivisor)
print("Quotient:", myQuotient)
print("Remainder:", myRemainder)'>
</i-sandbox-py>

**Figure 4.3.14**

The handy way of unpacking tuples into individual variables even works with lists, as shown in Figure 4.3.14. And nested lists work the same way as nested tuples, as shown in Figure 4.3.15. You could even mix lists and tuples to have a list of tuples or a tuple of lists, or a list with both lists and tuples or a tuple with both tuples and lists. Python is very flexible.

<i-sandbox-py  page-slug="__temp_slug__" code='mySuperTuple = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
print(mySuperTuple)'>
</i-sandbox-py>

**Figure 4.3.15**

So, everything you learned about tuples still applies to lists. The declarations are the same (just with brackets instead of parentheses), accessing elements is the same, slicing is the same, unpacking is the same, nesting is the same. What’s different, then?

## List Functions {#List-Functions-3181} 

What differentiates lists is that they’re mutable. That means there are a lot of interesting things we can do with lists that we haven’t been able to do with strings or tuples. Let’s run through a few of them:

* append(item). Adds item to the end of the list, lengthening the list by one.
* insert(index, item). Inserts item at the given index. For example, insert(1, newItem) would make newItem the second item on the list (because lists are zero-indexed).
* sort(). Sorts the items in the list in place. This will change the values associated with each index in the list.
* reverse(). Reverses the current order of the list. This will also change the values associated with each index in the list.
* copy(). Returns a copy of the list.
* index(item). Returns the index of the first element in the list whose value matches item.
* count(item). Returns the count of elements in the list whose values match item.
* remove(item). Removes the first element in the list whose value matches item.
* pop(). Removes and returns the last item on the list.
* clear(). Removes all items from the list.
* extend(incomingList). Appends all the items in incomingList to the current list. Note that this adds the items in incomingList one-by-one to the current list; it doesn’t add incomingList itself as an item to the current list. incomingList could be a list or a tuple.

In addition, there are a couple of other ways we can examine and modify lists. The in operator can still be used to check to see if a particular value is present in a list; it will return True if the value is present, False if the value isn’t. We can also use the reserved word del to delete items from the list by their index. We can combine del with our syntax for slicing lists to delete any slice that we want to remove.

## 4. Lists, Loops, and Functions {#4-Lists,-Loops,-and-Functions-1558} 

A significant portion of the value of lists (and sometimes tuples as well) comes when we integrate them with loops. Additionally, lists are our first example of mutable data structures, so it’s useful to remind ourselves what happens when we pass a mutable data structure into a function. So, let’s briefly look over three things: iterat- ing over a list with a for loop, iterating over multi-dimensional lists, and using lists with functions.

## Iterating Over a List {#Iterating-Over-a-List-3182} 

Remember, to iterate over a sequence means to execute some block of code for each item in the sequence. So, iterating over a list means executing a segment of code for each individual item in a list. The same can be done for a tuple as long as we’re not trying to modify it.

Recall that earlier when we talked about loops, we had a program where the user would enter a bunch of grades, and it would average those grades. Let’s revise that program to instead average the numbers in a list. In fact, let’s make it a function, so that it could be used in other ways by a hypothetical program.

<i-sandbox-py  page-slug="__temp_slug__" code='#Averages the numbers in a list
def average(inList):
	sum = 0
	for number in inList:
		sum += number
	return sum / len(inList)
myList1 = [1, 2, 3, 4, 5, 6, 7, 8, 9]
myList2 = [97, 87, 91, 83, 85, 91, 95, 99, 81, 85]
print("The average of myList1 is:", average(myList1))
print("The average of myList2 is:", average(myList))'>
</i-sandbox-py>

**Figure 4.3.17**

In Figure 4.3.17, we define the function average() on lines 2 through 6, which takes as input a list. It initializes sum to 0, and then for each number in the list, it adds number to sum. It then returns sum divided by the number of items in the list. In the main program starting on line 8, we create two lists: myList1 and myList2. We then print their averages on lines 11 and 12.

We can do this kind of iteration for any kind of list. Each time the loop iterates, number (or whatever variable fills in the blank in for ___ in list) takes on the value of the next item in the list. The first time the loop runs on myList1, number has the value 1, and 1 is added to sum. The second time, it has the value 2, and 2 is added to sum; it repeats this _for each_ item in the list.

Generally, when dealing with lists, we use for loops. We can technically use while loops, but for loops just tend to be a little bit easier: we don’t have to worry about manually checking the length of the list or incrementing a loop control variable, and if we’re using a for-each loop, we need no loop control variable anyway. The constraint on for loops was that we needed to know the number of iterations in advance, but we do know that with a list, as long as we don’t make the mistake of modifying its length while the loop is running.

## Iterating Over a 2-Dimensional List {#Iterating-Over-a-2-Dimensional-List-3183} 

Let’s take that a step further. We’ve mentioned that we can have **multi-dimensional lists,** or lists of lists. How do we iterate over those? Let’s imagine that instead of just averaging one set of numbers, we were interested in averaging several sets, each within themselves. Let’s call this a gradebook. In the gradebook, we have a list of lists of grades: each list of grades corresponds to one student, so we want to average each individual student’s grades. The result of this should be a separate list where each item in the list is the average of the corresponding item from the list of lists of grades. In other words, item #1 in the result should be the average of the numbers in list #1.

<i-sandbox-py  page-slug="__temp_slug__" code='def TwoDAverage(in2DList):
	result = []
	#For each list in the list of lists
	for numList in in2DList:
		sum = 0
		for number in numList
			sum += number
		#Append this list average to result
		result.append(sum / len(numList)
	return result
my2DList = [[91, 95, 89, 92, 85],
			[85, 87, 91, 81, 82],
			[79, 75, 85, 83, 89],
			[81, 89, 91, 91, 90],
			[99, 91, 95, 89, 90]]
print("Averages:", TwoDAverage(my2DList))'>
</i-sandbox-py>

**Figure 4.3.18**

Let’s start with the main program this time so we can have some real numbers when we discuss the function. In Figure 4.3.18, we define my2DList on lines 15 through 19 as a two-dimensional list: a list of lists. We start the outer list with a bracket, and then immediately start the first inner list with another bracket. Python lets us split the list definition into multiple lines to keep things organized, so we can see the two-dimensional structure here: each line is a list, and my2DList is a list where each of these lists is one of the items.

Then, we print the result of TwoDAverage(my2DList). So, the code jumps up to TwoDAverage() on line 4. It initially defines an empty list on line 4 that will hold the results; each time we get a new result, we’ll add it to this list. Then, we start what we call the outer loop on line 6: the outer loop is the loop that wraps around the other (inner) loop. Each run of our outer loop will grab the next list from my2DList and assign it to numList. So, on the first iteration, the value of numList is \[91, 95, 89, 92, 85\], which is the first list in my2DList.

Now, we run the inner loop over numList. This portion is identical to our previ- ous average() function: create sum and set it equal to 0 on line 7, iterate over each number adding it to sum on lines 9 and 10, then divide sum by the length of the list to get the average on line 12. Instead of returning it, though, we add it to result: result contains all the averages we want to return, so we want to wait until the end to return it. So, the outer loop runs for each of the five lists, and the inner loop runs within each of the five lists. In the end, result contains five numbers, each the average of one of the lists in my2DList.

This kind of nested loop structure is how we iterate over a two-dimensional list. We could take this further: we could have a list of lists of lists, where we would need three nested loops to iterate over everything.

## Lists and Functions {#Lists-and-Functions-3184} 

Lists are mutable. That means that if we pass a list to a function or method, the function or method _can_ change the values of the list, and those changes will persist out to the main program. Sometimes, this can be problematic. Imagine, for example, if the function from Figure 4.3.18 “popped” the grades in each list rather than iterating over them, as shown in Figure 4.3.19.

<i-sandbox-py  page-slug="__temp_slug__" code='def TwoDAverageWithPop(in2DList):
	result = []
	while len(in2DList) > 0:
		numList = in2DList.pop()
		sum = 0
		count = 0
		while len(numList) > 0:
			number = numList.pop()
			sum += number
			count += 1
		result.insert(0, sum / count)
	return result
my2DList = [[91, 95, 89, 92, 85],
			[85, 87, 91, 81, 82],
			[79, 75, 85, 83, 89],
			[81, 89, 91, 91, 90],
			[99, 91, 95, 89, 90]]
print("Averages:", TwoDAverage(my2DList))
print("my2DList:", my2DList)'>
</i-sandbox-py>

**Figure 4.3.19**

The pop() method _removes_ and returns the last item in a list. It’s good when you want to empty and process everything in a list. If it was used here, though, it’s actually changing the list itself. That’s why we have to manually count the number of items on line 9 and 15: when we reach line 17 to calculate the sum, the length of the list is now empty.

So, when dealing with lists and any other mutable data type, we have to be careful that we understand that all modifications we make to the list will persist. Most of the time, though, this will be useful: we can call functions to modify lists in place. We’ve actually seen an example of this. Compare the string methods to the list methods in Figure 4.3.20.

<i-sandbox-py  page-slug="__temp_slug__" code='myString = "Hello, world"
myList = [4, 1, 2, 3]
print("myString before upper():", myString)
print("myList before sort():", myList, "\n")
myString.upper()
myList.sort()
print("myString after upper():", myString)
print("myList after sort():", myList)'>
</i-sandbox-py>

**Figure 4.3.20**

String’s upper() method on line 8 makes the string uppercase. List’s sort() method on line 10 sorts a list. Yet, after we call myString.upper() and myList. sort(), only myList has changed, as shown by the print() statements on lines 12 and 13. Lists such as myList are mutable, meaning that a method can actually change its values (or in this case, the order of its values). Strings such as myString are immutable, meaning that a method cannot change its value. To get the upper- case version of myString, we have to assign myString.upper() to a variable; it returns what happens _if_ we converted the string. To get the sorted version of myList, we just have to call myList.sort(); it sorts it _in place_. To go back to our example of Addison, myString.upper() is like asking someone to read to you the results of the capitalizing the string; myList.sort() is like handing someone the list and asking them to hand you back a sorted list.

## Lists vs. Tuples {#Lists-vs-Tuples-3185} 

Based on our description, lists can do everything tuples can do and more. They can be declared, sliced, nested, and unpacked the same ways, with the added bonus of being mutable. That means we can add new items, remove items, sort items, and more.

So, you might wonder: Why would you ever use tuples? That’s actually an interesting question, and if you ask a bunch of people, you’ll get a bunch of different answers. Generally, though, there are a couple of conventions we follow to decide whether to use lists or tuples.

First, we often use tuples when we’re definitely dealing with a predetermined number of items. We use lists when the ability to add or remove from the list would actually be useful and relevant. Consider our quotientAndRemainder() function from Figure 4.3.14, though. Would there ever be a need to add additional values to the return from that function? Not really; they represent two qualitatively different things, a quotient and a remainder. So, we use a tuple in that case.

That connects nicely to the second convention. When we think of a list of things, we typically think of the list as somewhat homogenous. That is, we think of the things on the list as being qualitatively similar. Take our examples of real-world lists. A grocery list is a list of items. A to-do list is a list of tasks. We would generally consider it strange to put “Call Becky” on a grocery list or “oranges” on a to-do list because we think of lists as having a homogenous collection of things. So, if we’re grouping together different _kinds_ of information (even if they’re the same data _types_), we often use tuples.

That convention can be made even stronger. One common convention is that lists are used for _like_ data types. Python technically lets you create a list that has integers, floats, strings, and other data types in the same list, but by convention we rarely do that. This is largely because lists are so often iterated upon with for loops: when we iterate over a list, we execute a block of code on each item in the list. For a single block of code more complex than just a print statement to work on every item, the items generally need to be of the same type. Tuples are more often used to represent information that is unpacked into unique variables, like quotients and remainders, so it’s more natural for them to have a different data types.

These are all just conventions, though. That means that while other programmers with whom you share your code will often expect these conventions to be followed, Python isn’t going to stop you from doing things one way or the other. It’s good to get in the habit of following these conventions, though.

## 5. Advanced List-Like Structures {#5-Advanced-List-Like-Structures-1559} 

Before we move on, let’s quickly cover three special kinds of list-like structures. These structures are like lists in that they contain multiple items in a certain order. However, they provide unique constraints on how the items in the list are actually accessed. In some ways, these are additional data types; many languages have dedicated types for these list-like structures. In other ways, these are simply ways of interacting with lists, and are constraints we could apply on ourselves depending on the type of program we’re writing.

## Stacks {#Stacks-3186} 

A **Stack** is a list-like structure that limits the ways in which you can add or remove information from the list. Rather than being able to insert or grab information from anywhere in the list, you can only add new information on top, and you can only access the information that is currently on the top. To add new data, we “push” it onto the top of the stack; to remove data, we “pop” it off the top of the stack. This is sometimes referred to as Last-In-First-Out, or LIFO. The last item added to the list is the first item removed from the list.

<i-image
  style="aspect-ratio:458/402;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/4.3.21-9a049dbe0c5e6940242d0b90307772dc.png"
  alt="4.3.21"
  width="458"
  height="402">
</i-image>

**Figure 4.3.21**

This makes a lot of sense when we’re dealing with physical objects: typically putting a new item on top blocks access to the ones below, so that should be the one we grab first when we need one. What about when there is no physical need to do so, though?

Imagine you were programming a robot to search for your keys in your house or apartment. You would want it to search each room, and within each room search each piece of furniture, and within each piece of furniture search each drawer. So, what would you do? You’d initially give it three commands: search-Kitchen, search-Bedroom, and search-Bathroom. search-Kitchen, though, would be unpacked to find search-Counters, search-Drawers, and search-Cabinets. You would want the robot to do all three of these things before moving on to search the bedroom. So, you’d push those three commands on top of the stack of orders, then pop them off one by one. That way, you would ensure the robot would not move on to the bedroom until it had finished checking the kitchen.

<i-image
  style="aspect-ratio:322/426;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/4.3.22-ab0470cfa2a174dfb05eb36db6a8c2eb.png"
  alt="4.3.22"
  width="322"
  height="426">
</i-image>

**Figure 4.3.22**

This is actually analogous to an advanced computing topic called depth-first search that comes from the advanced data structure trees. These are both outside the scope of this material, but you’ll get to them in a future computing class.

## Queues {#Queues-3187} 

**Queues** work in exactly the opposite way of stacks: rather than Last-In-First-Out, queues are First-In-First-Out, or FIFO. Queues work the way most lines you experience in the real-world work: you are served in the order in which you got in line.

Your call is answered in the order it was received. With queues, we’re restricted to removing items from the front of the list and adding items to the end of the list. We refer to this as “enqueuing” (adding an item to the end of the list) and “dequeuing” (removing an item from the start of the list).

<i-image
  style="aspect-ratio:748/316;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/4.3.23-1b53f8c1ff930fc33cac4d9f8c9f93c0.png"
  alt="4.3.23"
  width="748"
  height="316">
</i-image>

**Figure 4.3.23**

When designing programs, we might use queues to process tasks in the order they were launched. Interestingly, however, stacks end up being used more often in programming, for both theoretical and practical reasons. Theoretically, stacks lend themselves to the way in which programs are executed, as demonstrated by the analogy to a depth-first search above—you don’t need to understand the analogy right now, but rather just know that there exist concepts in computing that lend themselves nicely to stacks. For practical reasons, stacks tend to be a little more efficient as well: when using a queue, every time we dequeue an item, we have to update the indices of every other item in the list to decrease them by one. When using advanced computers that isn’t a big issue, but when you use computers of earlier generations, which are comparatively slower, that could present a major difficulty.

Note that when we iterate over a list using a simple for loop, we’re processing things in the same order we would process them with a queue. That doesn’t make that a queue, though: queues and stacks are characterized by the requirement to _remove_ an item from the list in order to really access it.

## Linked List {#Linked-List-3188} 

**Linked lists** are a special kind of implementation of a list-like structure. In order to understand linked lists, though, we have to briefly talk about how lists are usually stored.

In lower-level languages (i.e., languages that are closer to the real functions of a computer), memory is typically allocated in contiguous blocks. That’s why lists in these languages have to be declared with their lengths in advance: If you need a list with 40 memory spots, the computer has to find an area of memory with 40 consecutive spots open. If you then need a 41st, there’s no guarantee the 41st spot is open.

Higher-level languages abstract over this process. While they’re written to mimic interacting with a contiguous block of memory, in reality there might be pointers to different areas of memory. A list with five items might store those five items in various different places in memory, and when you request the second item, it goes and looks up the next item’s memory location. With older computers, though, even those look-ups could take some notable time, especially if you were doing a lot of them. Inserting was a particularly high-intensity operation: if you wanted to insert an item in the middle of a list, the computer had to go through and change its locations for every item after it in the list.

<i-image
  style="aspect-ratio:670/420;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/4.3.24-31d213d38c87bf7338ac15f437a32255.png"
  alt="4.3.24"
  width="670"
  height="420">
</i-image>

**Figure 4.3.24**

A linked list operates differently. Instead of one list of memory pointers, each item in the list would contain both its value _and_ a pointer to the next item in the list. So, if you wanted to get item #6, you would find its location from item #5. This makes certain operations significantly more efficient. Iterating, for example, wouldn’t require the computer to return to its list of memory locations each time it wanted to move to the next item: the next item’s location was stored with the current item. Inserting was a breeze as well: instead of having to update every item’s index, only the previous item had to be updated. If we wanted to insert a new item #6, we would just have to change item #5 to point to the new item #6; the new item #6 would then point to the old item #6, which is now #7.

Of course, other operations are significantly less efficient. In a linked list, the computer has to iterate through _every_ previous item to find an item with a given index; there’s no way to jump straight to item #7 like there is with a regular list. But if we’re iterating and inserting far more than we’re jumping into the center of the list, then a linked list could grant some significant efficiency gains. Many of these issues have gone away as computers have gotten faster, but the underlying concepts are still part of the core of computing theory.

<i-image
  style="aspect-ratio:674/408;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/4.3.25-24d04b572147309448471bed51d6ef33.png"
  alt="4.3.25"
  width="674"
  height="408">
</i-image>

**Figure 4.3.25**

## 6. Lists and Turtles {#6-Lists-and-Turtles-1560} 

We have a new tool in our toolbox now: lists. How can we use lists to improve or expand our user interface for controlling turtles? Let’s do two things: first, let’s simplify the process by which we’re listing commands that the user has available. Second, let’s create a new function: a record function that would allow the user to enter multiple commands, and a number of times to repeat them.

It’s worth noting that here, the complexity of our turtles applications is going to rise tremendously. Don’t worry at all if you get lost; we’re covering very advanced structures, syntax, and ideas. Try to step through the code one line at a time, following how the programs execute. Try to predict what will happen if you enter certain commands, and then follow through and see if you were right. Most importantly, don’t get discouraged. It’s taken me a long time to develop this example, and part of its purpose _is_ to show the complexity possible with the concepts we’ve learned. If you understand the rest of the course besides these turtle examples, you’re still doing very well.

## Listing Commands {#Listing-Commands-3189} 

When we covered strings, we covered a join() method that could use the string to join together multiple items in a list into a longer string. Right now, we’re having to update the line that lists the commands for users manually each time we add a new command. This can be slightly easier if we maintain a list of all the valid commands at the top of the program, and simply join together the valid commands when they’re needed. This way, if we need to list the commands in multiple places, we don’t need to worry about adding to the list in multiple places.

We’ve only made two changes in ListingCommands.py. First, we’ve created a tuple early in the program: VALID\_COMMANDS, on line 3. This is written in all caps to specify it as a constant, a variable whose value won’t be changed. Granted, a tuple’s value can’t be changed anyway, but we’re also not going to set VALID\_COMMANDS equal to a different tuple either. The goal of writing it in all caps is to communicate that this variable will retain the value it was assigned at the beginning throughout the program.

Then, later, we’ve replaced the line that lists the available commands with line 39, which calls “, “.join(VALID\_COMMANDS). This takes the individual strings in VALID\_COMMANDS and combines them into one string, with “, “ separating each pair. This way, when we add a new command, we need only remember to add it to the tuple at the beginning, not to any line that lists commands. So, let’s go ahead and change the “Invalid!” message to use VALID_COMMANDS, too, on line 96.

## Preparing for the Record Function {#Preparing-for-the-Record-Function-3190} 

Our next goal is to create a command that will allow the user to enter _multiple_ commands, as well as a number of times to repeat these commands, to then be executed repeatedly. In other words, instead of just entering one command at a time, we want the user to enter a _list_ of commands, followed by a number of times to repeat these commands.

That’s going to mean, however, our user needs to be able to enter commands in two ways: one, the normal way we have now, to execute them directly, and two, a new way, to enter them into a “recording”. This is going to mean a pretty significant restructuring of our program. We now need to differentiate commands that are to be run immediately from commands that are to be added to a list. We also need to differentiate commands that are run based on direct user input from commands that are run based on executing a list. In other words, we need to split up our command input and our command execution. To do that, we need to create a data structure that will hold commands and their parameters. We’ll use tuples for that in PreparingfortheRecordFunction.py; remember, tuples are good for heterogenous lists.

We haven’t yet added our record function yet, right now we’re just laying the groundwork. To be able to record commands to be repeated later, we need to get commands from the user without executing them right away. We also need to execute commands that weren’t just entered by the user. So, we’ve split up the process: We have separate functions for getting commands from users and to execute commands.

Previously, however, the arguments we received from users were stored in local variables, like angle and distance. Now, however, we need to store commands and their arguments separately. This means combining qualitatively different kinds of information into one variable whose value should not change once entered. In other words, perfect time for a tuple!

So, we’ve revised our code: we now have a getCommandFromUser() function starting on line 16. It runs the same conditionals we ran previously, but instead of immediately executing the command the user enters, it instead stores it in a tuple with the command name itself as the first item. That tuple is returned at the end of the function, so we’ll be able to correctly direct it to be executed or recorded. Right now, we’re only executing, so immediately after getting a command from the user, we run the execute function. It runs the same conditional based on what command was in the first spot of the tuple, but instead of getting any user input, it just executes the command directly.

Note one special feature here: for our commands without arguments (penup, pendown, end), we have a comma after the command name in the tuple declaration. That’s how Python knows to treat these as tuples: otherwise it just treats them as strings. Notice also how this has radically shortened the actual control loop of the function, down on lines 86 through 89. It could be shortened even more by having the while loop operate on commandTuple\[0\] directly, but we’re about to need the command in the main function anyway.

So, we’ve now separated the act of getting the command from the user and executing the command we received. Now we’re ready to start differentiating whether the command should be executed immediately or recorded for repetition.

## The Record Function {#The-Record-Function-3191} 

Now let’s make things complicated. All our new reasoning here is going to be inside our while loop. Why? The list of recorded moves (the list recordList) and the memory of whether we’re recording (the boolean recording) need to persist across multiple executions of the while loop. There are other ways we could handle this, of course, but for now let’s do it the way shown in TheRecordFunction.py.

Every step of the while loop’s execution, it now does a couple extra things; all of the following reasoning takes place in the while loop at the bottom of the program. It first checks if it’s currently recording. If it’s not, it executes the next command. If that command is to _start_ recording, then it clears the list of recorded commands (in case this isn’t the first time we’ve recorded something), and sets the boolean recording to True. So, if we’re not recording and we didn’t just start recording, executeCommand() runs like normal.

If we _are_ recording, then the loop first checks to see if the command was to stop. If so, it stops recording, then runs two loops. The outer loop repeats the request number of repetitions. The inner loop runs each command one-by-one. So, if the user asked to run the sequence five times, the outer loop would run five times, and each time it ran, all the commands would run one-by-one.

If we’re recording and the command _isn’t_ stop, then it just adds the command to the list and continues as normal. Once we’re done recording, the program returns to its default state: any new commands are executed immediately unless we record again.

Our program has now gotten very complex. This little explanation shouldn’t be enough to understand it. Instead, you should try it out. Try different sequences of commands to see what happens. Modify the code and see what breaks, and how. This is a very complex program, one that took someone with almost two decades of programming experience considerable time to write and debug; it’s okay to find it intimidating. Step through it line-by-line, see why it operates the way it does, and try it out with different input.

How else could we have implemented this? If we wanted to avoid having to check for the recording and stop commands in the while loop, we could have repeatedly passed the list recordList and the boolean recording back and forth between the main code and the functions themselves. I prefer not to do that, however, since that requires dealing with them every step of the way rather than only dealing with them when recording is turned on and off. We could also force the functions to see global copies of the variables, but that’s outside of the scope (no pun intended) of what we’ve covered so far.

As of now, for anyone, the recording function requires some pretty complex reasoning within our while loop. In the future, we may find a way to streamline this.

