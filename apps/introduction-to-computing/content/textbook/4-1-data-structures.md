---
assignments:
- summary
chunks:
- title: 1. What Are Data Structures?
  slug: 1-What-Are-Data-Structures?-1533
  type: plain
- title: Advanced Data Types
  slug: Advanced-Data-Types-3108
  type: regular
- title: Lists and List-Like Structures
  slug: Lists-and-List-Like-Structures-3109
  type: regular
- title: Unit Outline
  slug: Unit-Outline-3110
  type: regular
- title: Passing by Value vs. Passing by Reference
  slug: Passing-by-Value-vs-Passing-by-Reference-1534
  type: plain
- title: 'Passing By Value: An Analogy'
  slug: Passing-By-Value-An-Analogy-3111
  type: regular
- title: 'Passing by Reference: An Analogy'
  slug: Passing-by-Reference-An-Analogy-3112
  type: regular
- title: 'Terminology: By Reference'
  slug: Terminology-By-Reference-3113
  type: regular
- title: 3. Passing by Value and Reference in Python
  slug: 3-Passing-by-Value-and-Reference-in-Python-1535
  type: plain
- title: 'Integers: By Value or by Reference?'
  slug: Integers-By-Value-or-by-Reference?-3114
  type: regular
- title: 'Other Data Types: By Value or by Reference?'
  slug: Other-Data-Types-By-Value-or-by-Reference?-3115
  type: regular
- title: Variable Assignments
  slug: Variable-Assignments-3116
  type: regular
- title: 4. Mutability in Python
  slug: 4-Mutability-in-Python-1536
  type: plain
- title: Mutability vs. Passing by Reference
  slug: Mutability-vs-Passing-by-Reference-3117
  type: regular
- title: Reassigning Immutable Data Types
  slug: Reassigning-Immutable-Data-Types-3118
  type: regular
- title: 'Immutable Data Types: Functions vs. Local Assignments'
  slug: Immutable-Data-Types-Functions-vs-Local-Assignments-3119
  type: regular
- title: Printing Memory Addresses
  slug: Printing-Memory-Addresses-3120
  type: regular
- title: 5. A Brief Introduction to Methods
  slug: 5-A-Brief-Introduction-to-Methods-1537
  type: plain
- title: Functions vs. Methods
  slug: Functions-vs-Methods-3121
  type: regular
- title: Methods in Practice
  slug: Methods-in-Practice-3122
  type: regular
- title: Equivalent Syntax
  slug: Equivalent-Syntax-3123
  type: regular
cri:
- question: Are all programs built out of control structures and simple data types?
  answer: No, more complicated data structures are needed to build the reasoning seen in computers today.
  slug: Advanced-Data-Types-3108
- question: What are list-like structures and how do they work?
  answer: List-like structures, also called sequences, give multiple values to a single variable name, and the individual values are accessed through indices.
  slug: Lists-and-List-Like-Structures-3109
- question: What are some of the general classifications of data structures covered in this unit?
  answer: Strings, lists, file input and output, and more advanced list-based structures like Dictionaries and HashMaps.
  slug: Unit-Outline-3110
- question: What is the function of Addison in the analogy described in the passage?
  answer: Add two numbers.
  slug: Passing-By-Value-An-Analogy-3111
- question: What is the difference between passing by value and passing by reference?
  answer: Passing by value involves handing off the value to the function, while passing by reference involves handing the variable itself to the function and allowing it to modify the variable's value.
  slug: Passing-by-Reference-An-Analogy-3112
- question: What does passing 'by reference' mean?
  answer: Passing 'by reference' means passing the memory address of a variable, allowing the function to access and potentially modify the value directly.
  slug: Terminology-By-Reference-3113
- question: Is myInteger passed by value or by reference?
  answer: myInteger is passed by value.
  slug: Integers-By-Value-or-by-Reference?-3114
- question: What happens when an item is added to a list in Python?
  answer: The item added to the list persists after the function is run, indicating that lists in Python are passed by reference.
  slug: Other-Data-Types-By-Value-or-by-Reference?-3115
- question: What happens when a list is assigned to another list in Python?
  answer: The two lists point to the same data, so modifying one list will also modify the other list.
  slug: Variable-Assignments-3116
- question: Why didn't the values of myInteger and myString change in the given figures?
  answer: The values of myInteger and myString didn't change because integers, floats, strings, and some other data types in Python are immutable.
  slug: Mutability-vs-Passing-by-Reference-3117
- question: Why does myInteger have the same value even after calling addOne on it?
  answer: myInteger has the same value because addOne only changes the reference of an integer variable, not the value itself.
  slug: Reassigning-Immutable-Data-Types-3118
- question: Why does changing the value of anInteger inside the addOne() function not affect the value of myInteger?
  answer: Because myInteger and anInteger are both immutable, so changing the number stored in anInteger creates a new memory spot and does not affect myInteger.
  slug: Immutable-Data-Types-Functions-vs-Local-Assignments-3119
- question: What does the id() function tell us about variables in Python?
  answer: The id() function tells us what spot in memory a variable is pointing to.
  slug: Printing-Memory-Addresses-3120
- question: What is the difference between functions and methods?
  answer: A method is a function contained inside a data structure, while functions are defined at the top level of programs.
  slug: Functions-vs-Methods-3121
- question: What is the purpose of the isdigit() method in Python?
  answer: The isdigit() method checks if a string represents a number.
  slug: Methods-in-Practice-3122
- question: What is the purpose of the method isdigit() in the context of the passage?
  answer: The method isdigit() checks if the string contains all digits.
  slug: Equivalent-Syntax-3123
next_slug: 4-2-strings
order: 5
parent:
  title: 'Unit 4: Data Structures'
  slug: unit-4-data-structures
quiz: null
slug: 4-1-data-structures
title: 4.1 Data Structures
---

## 1. What Are Data Structures? {#1-What-Are-Data-Structures?-1533} 

So far, we’ve done some pretty interesting programming with a relatively limited number of data types. We’ve used numbers, some characters, and some strings. Is it really possible, though, that all the complex reasoning we see on computers can be built out of these simple types of data?

## Advanced Data Types {#Advanced-Data-Types-3108} 

In a sense, yes; in fact, everything on your computer is distilled down to 1s and 0s for your computer to process with a relatively small set of commands, at a rate of billions of commands per second. Our programs get translated down through the layers until the computer can execute them in terms it understands.

But for building programs at our level, do we really build them out of these control structures and simple data types? No; we need some more complicated **data structures** to build the reasoning that we see in computers today. In this unit, we’ll cover a few of these data structures. Specifically, we’ll focus on the data structures that contain multiple pieces of other information, like lists and strings—remember, strings are like lists of individual characters

## Lists and List-Like Structures {#Lists-and-List-Like-Structures-3109} 

So far, everything we’ve covered has involved a one-to-one mapping between variables and values. Every variable could have one and only one value. What happens, then, if you need to keep track of the names of all the students in a class? Do you create a different variable for each student? What if you’re building a roster program where you don’t know in advance how many students to expect; do you just make sure to create more variables than you need?

This is where list-like structures come into play. **List-like structures**, also called sequences, give multiple values to a single variable name. The individual values are then accessed through some kind of index. For example, if we have a variable named roster, we could specifically ask for the first name on the roster, the seventh name, or the twelfth name. The variable roster has one name, but there are multiple values associated with it, accessed via numbers called **indices** (plural for index). Sometimes (specifically, with dictionaries, the topic of Chapter 4.5) it won’t be numbers that we use to access these values, though; it might be strings or other data variables.

Lists can generally hold any kind of data, including other lists. Using that, you can make some pretty complex data structures. You could make a list of classes in a school, where each class is actually a list of students. That could go deeper: each student could be a list of grades, or you could have a list of schools where each school is a list of classes. That’s moving toward the more complex data structures that we’ll talk about in Unit 5.

## Unit Outline {#Unit-Outline-3110} 

In this unit, we’ll cover four different general classifications of data structures. We’ll begin with **strings**. You’ve seen strings a lot before, but only because it’s difficult to do anything in programming without the ability to print text. We’ve only scratched the surface of what strings can do and how they can be used. Strings are actually relatively advanced data structures, both because they technically store a list of other items (in this case, a list of individual characters) and because they have complex reasoning built into them to deal with human language.

Then, we’ll cover **lists**. Lists are single variable names that can store several different items of data, accessed by a numeric index. For example, we can ask for the 7th value of the list named myList. Different languages handle lists very differently, and many languages have multiple different ways of handling lists, so we’ll briefly cover the general concepts before jumping into your language’s instantiation of the concept.

Then, we’ll cover **file input and output**. File input and output is how we persist information across multiple sessions of a program. In many ways, it resembles and builds on list-like structures. When writing files, we’ll very often write all the items in a list one-by-one. When reading a file, we’ll often treat the individual lines like strings in a list. This isn’t always the case, but the similarity is sufficient to make this a good time to cover file input and output.

Finally, we’ll cover more advanced list-based structures, like **Dictionaries** and HashMaps. These data structures are similar to lists in that they store multiple values, but they differ in that the values can be accessed not just through numeric indices, but also through strings or even other data structures. You could, for example, have a data structure that stores multiple students and their grades, and to look up my grades, you’d look up “David” instead of having to know that I’m the 7th student in the list.

Before we get there, though, there are a couple concepts regarding advanced data structures that are important to understand: passing by value, passing by reference, and mutability. These are complex principles that may not come up often in your routine programming, but they’re fundamental concepts in computing.

## Passing by Value vs. Passing by Reference {#Passing-by-Value-vs-Passing-by-Reference-1534} 

The first concept we want to understand is the difference between **passing by value** and **passing by reference**. This distinction specifically applies to writing and using functions. This is one of the more complicated concepts we’ve covered so far, and the terminology is a bit unfamiliar. Let’s start by talking about the difference between the two, and then move on to talking about where the terms “by value” and “by reference” actually come from.

## Passing By Value: An Analogy {#Passing-By-Value-An-Analogy-3111} 

Let’s return to the analogy we used when describing functions. You worked in an office, and you had a co-worker named Addison. Addison’s job was to add two numbers. Any employee in the office could give Addison two numbers, and Addison would return the result.

Let’s bring variables into this. On your desk, you have two files: File A and File B. On File A and File B are written numbers, 5 and 2 respectively. These are variables and values: the variable A has the value 5, and the variable B has the value 2. Last time, you wanted to add these two numbers together, but we didn’t really talk about what we would do with the result. This time, let’s imagine we want to add B to A; or, in other words, to add 2 to 5. You want to set A equal to the sum of A and B. Our end result should be that A should have the value 7.

Previously, the way we described this is that you shouted across the office, “Hey Addison \[the function call\], 5 and 2 \[the arguments\]!” Addison shouted back, “7 \[the return\]!” So, you erase the number 5 on File A and write the number 7. You set A equal to the sum of A and B, according to the function Add(ison).

This is passing by value. You hollered to Addison the values themselves, 5 and 2. Addison didn’t know 5 and 2 were stored in File A and File B. Then, Addison shouted back the value corresponding to the result. He didn’t know what you’d do with that value. All he knew was he needed to shout the value back. The key here is that it is the values themselves being shouted back and forth: Addison never knows your variables, and you never know Addison’s variables.

## Passing by Reference: An Analogy {#Passing-by-Reference-An-Analogy-3112} 

This interaction could have gone differently, though. Instead of shouting the values of File A and File B across the office, you could have instead walked by Addison’s desk and handed him the two files. Rather than simply telling you the value, now Addison himself erases the original value of File A and puts in the new value. He then brings the files back to you. The result is the same: File A holds 7, File B holds 2 as it did at the beginning. Or, maybe he brings the values back to you as they were, and tells you verbally that the answer is 7. Either way, he had access to your variables and could modify them.

This is passing by **reference**. The major difference is that you and Addison are accessing the same variables. Note that the variables didn’t necessarily have to have the same name: Addison could have a different name he uses to refer to File A. What’s important is that during his operation, Addison could write to _your_ variable. When passing by reference, you’re handing the variable itself to the function, and the function can modify the variable’s value if it wants. When passing by value, you’re simply handing off the value, and the function can’t actually change the value of your variable.

Why does this matter? Imagine if Addison had a strange way of adding numbers. Instead of just adding them, he instead changes the sign of one number, then subtracts it instead. So, when Addison receives 5 (File A) and 2 (File B), he changes them to 5 and −2, and performs 5 – (−2). The result is still 7. However, if you passed by reference, you handed Addison access to File B. He changed File B from 2 to −2. Now, when he hands you the files back, File B has been modified.

The difference between passing by value and passing by reference comes down to whether or not you want the function to be able to change the values of the variables directly, or if you simply want it to receive the values themselves without being able to access the variables. If you shout “5 and 2!” to Addison, he can’t change what you have written down; if you hand the papers to him, he can.

## Terminology: By Reference {#Terminology-By-Reference-3113} 

The term “passing by value” makes some sense. You’re passing some data into a function, and you’re doing it _by_ passing a variable’s _value_. You’re passing the data by passing its value.

What does passing “by reference” mean, then? To understand that, we need to understand a little bit about the way a computer works on the inside. Imagine your computer like a giant file cabinet. It has thousands and millions of files. These files are the computer’s memory: they store everything that it knows at a given time. To access some data, you have to know where in the file cabinet the data is located. So, in our analogy, to access File A and File B, you have to know where they are.

<i-image
  style="aspect-ratio:660/150;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/4.1.1.png-5437e7a2ba691ae2450e68ffa9e78880.png"
  alt="4.1.1.png"
  width="660"
  height="150">

Figure 4.1.1

</i-image>

So, are they just labeled “File A” and “File B”? No; they’re labeled with some far more cryptic identifier like E1557. These identifiers are systematic and ordered; that’s why they’re relatively easy to navigate. We know that E1557 will come after E1556 and before E1558. These identifiers are tough to use, though. So, we create more accessible names, like “File A”, and somewhere we have a key indicating, “File A can be found at E1559.”

<i-image
  style="aspect-ratio:696/344;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/4.1.2.png-dbc0bd0308d106a2e413b1ff2e81bc68.png"
  alt="4.1.2.png"
  width="696"
  height="344">

Figure 4.1.2

</i-image>

That cryptic identifier is called a reference (or a memory address). It tells you where the variable itself can actually be found. When we pass by value, we grab the variable name (File A), find its reference (E1559), use the reference to find the value (5), and then tell the function the value (“Hey Addison, 5 and...”). The function never knows where the value came from.

<i-image
  style="aspect-ratio:688/342;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/4.1.3.png-1707934c254cd7f0831046ce88c9c41a.png"
  alt="4.1.3.png"
  width="688"
  height="342">

Figure 4.1.3

</i-image>

When we pass by reference, we grab the variable name (File A), find its reference (E1559), and pass that reference _directly_ to the function (“Hey Addison, the value stored at E1559 and...”). The function then looks up the value on its own, but because it knows the reference, it can change the value if it wants to. It doesn’t have to, but it can.

That’s why these two approaches are called pass by value and pass by reference. With pass by value, we simply tell the function what value to operate on; with pass by reference, we tell it where to find the value, such that it could change the value if it wants to.

<i-image
  style="aspect-ratio:726/346;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/4.1.4.png-24d4928ed833c619cf333caa05fe77f1.png"
  alt="4.1.4.png"
  width="726"
  height="346">

Figure 4.1.4

</i-image>

## 3. Passing by Value and Reference in Python {#3-Passing-by-Value-and-Reference-in-Python-1535} 

Many languages let you define whether you want to pass an argument by value or by reference based on the way you write the function. In Visual Basic, there are reserved keywords ByVal and ByRef that tell the computer whether to send in the value or the reference. In C, the asterisk (*) character means “address of” or “reference to” a variable, so passing in the variable name with an asterisk means “the reference to” a variable, while passing in the variable name without an asterisk means “the value of” a variable.

In other languages, like Java, whether an argument will be passed by value or by reference is determined in the language. In Java, primitive data types like integers and characters are always passed by value, while advanced data structures like lists are always passed by reference.

How does Python work? We could just answer that, or we could actually take a look and see.

## Integers: By Value or by Reference? {#Integers-By-Value-or-by-Reference?-3114} 

Note first that in Figure 4.1.5, we’ve started to include a label in our print statements. We’ll do that going forward to make our output a little easier to follow, even though it will make our code a little tougher to read.

<i-sandbox-py  page-slug="__temp_slug__" code='#Add one to anInteger
def addOne(anInteger):
	anInteger = anInteger + 1
	print("anInteger:", anInteger)

#Create myInteger with the value 5
myInteger = 5
print("myInteger before addOne:", myInteger)
#Call addOne on myInteger
addOne(myInteger)
print("myInteger after addOne:", myInteger)'>
</i-sandbox-py>

**Figure 4.1.5**

We start by defining a function addOne() on line 2. addOne has one parameter, anInteger. It takes whatever argument is passed into anInteger and adds one to it. It does _not_ return the result; it simply sets anInteger equal to anInteger + 1.

Outside the function, we create myInteger and give it a value of 5 on line 7. We print it on line 8 to make sure its value really is 5 (it is). We then call addOne(), where myInteger becomes an argument to the anInteger parameter in addOne(). anInteger is then incremented by one. We print anInteger on line 4 to make sure it now has the value 6 (it does).

Then, after the function call is over, we print myInteger one more time on line 11. If it was passed by value, it would now be 5: addOne() would never have access to the original variable, so it couldn’t change the value of myInteger; it only operates on anInteger, which was given the value of myInteger at the time of the function call, but from then on exists as its own variable. If myInteger was passed by value, it was as if addOne() made a copy of the value.

If myInteger was passed by reference, though, it would be 6 after the call to addOne(), because addOne() would be modifying the value of the original vari- able itself; because it knows the references, it knows where to find it. If myInteger was passed by reference, it was as if addOne() was working on the same variable as the code that called it.

What is the result? When printed on line 11, myInteger retains the value 5, meaning that Python _seems_ to have passed this by value rather than by reference. Note that later, we’ll see that Python actually does something slightly different: however, the result is functionally the same as passing by value.

## Other Data Types: By Value or by Reference? {#Other-Data-Types-By-Value-or-by-Reference?-3115} 

We noted above, though, that Java treats different data types differently. What about Python? Let’s check how it handles strings in Figure 4.1.6.

<i-sandbox-py  page-slug="__temp_slug__" code='#Add an exclamation to aString
def addExc(aString):
	aString = aString + "!"
	print("aString:", aString)


myString = "Hello, world"
print("myString before addExc:", myString)
addExc(myString)
print("myString after addExc:", myString)'>
</i-sandbox-py>

**Figure 4.1.6**

Just like Figure 4.1.5, we create a string myString on line 6, pass it into a function that will modify it on line 8, and check to see if that modification persists in the main program on line 9. We see that addExc successfully adds an exclamation point to aString, its local variable, because there is an exclamation point in the text printed by line 3. However, myString remains unchanged when printed on line 9. So, Python seems to have passed this string by value, too. Modifying aString, addExc’s local copy of myString’s value, does not change the actual value of myString.

When we described Java, though, we mentioned it was Java’s primitive types that were passed by value. Strings are somewhat primitive in Python, so let’s see how Python treats something more complex, like a list. We don’t know much about lists yet, but this example doesn’t need much understanding of them. Still, if this is confusing, revisit this after reading Chapter 4.3.

<i-sandbox-py  page-slug="__temp_slug__" code='#Add an item to aList
def addItem(aList):
	aList.append("New Item!")
	print("aList:", aList)

myList = ["One", "Two", "Three"]
print("myList before addItem:", myList)
addItem(myList)
print("myList after addItem:", myList)'>
</i-sandbox-py>

**Figure 4.1.7**

Figure 4.1.7 shows the result of this same kind of code running on a list instead of an integer or string. Now things are getting interesting, though. When we did this with integers and strings, the values of myInteger or myString were identical before and after the function was run, and only the value inside the function was different. Now with a list, though, the values of the list inside the function and after the function match, as shown by the second and third lines of the output. The new item in the list is still in the list out in the main program. You don’t need to worry about how lists work right now; all you need to notice is that the output of printing the list inside addItem() on line 4 matches the output of printing the list after addItem() on line 9.

This means that Python seems to pass primitive data types such as integers and strings by value, and advanced data types such as lists by reference, right? Practically speaking, yes. Accurately speaking, no! The ultimate effect is that it’s _as if_ Python is passing these primitive data types by value, but in reality, something different is going on: Python has immutable data types. That gets tricky, though, so we’ll talk about that next lesson. For now, it’s sufficient to know: there are some data types that Python _effectively_ passes “by value”, but for the majority of data types, Python passes by reference.

## Variable Assignments {#Variable-Assignments-3116} 

This is a good time to briefly look at a related dynamic in how variables are assigned in Python. There are some variable assignments that function similarly to how these function calls work

In Figure 4.1.8, we create myInt1 and give it the value 5 on line 1. Then we assign myInt2 to myInt1 on line 2. Then we change myInt1 to 7 on line 3. What is the result? myInt1 now has the value 7, its new value, as shown in the output of line 5. myInt2, though, keeps the value 5, as shown in the output of line 6. So, myInt2 isn’t set to equal myInt1 on line 2; it’s set to equal the _current value_ of myInt1 on line 2. This is similar to our notion of pass-by-value, although this is assignment- by-value. We assign myInt2 to the current value of myInt1. If the value of myInt1 changes, it doesn’t change myInt2 because it was only set to the value of myInt1 at one point in time.

<i-sandbox-py  page-slug="__temp_slug__" code='myInt1 = 5
myInt2 = myInt1
myInt1 = 7

print("myInt1:", myInt1)
print("myInt2:", myInt2)'>
</i-sandbox-py>

**Figure 4.1.8**

What happens when we try that with a list? The same thing happens in Figure 4.1.9 that happened with our function calls with lists in Figure 4.1.7. We create myList1 on line 1, then set myList2 equal to myList1 on line 2. We then change myList1 on line 3. When we print both lists, we find that myList2 _still_ equals myList1 on lines 5 and 6. It’s been set equal to the _reference_ to myList1. In other words, myList1 and myList2 now point to the same data: if we change myList1, we’re actually changing the data that myList1 and myList2 both point to. It’s kind of like myList2 is following myList1 around, copying its data, but really, it’s not even copying it: it’s pointing to the exact same data.

<i-sandbox-py  page-slug="__temp_slug__" code='myList1 = ["One", "Two", "Three"]
myList2 = myList1
myList1.append("Four")

print("myList1:", myList1)
print("myList2:", myList2)'>
</i-sandbox-py>

**Figure 4.1.9**

To stick with our previous analogy, this is like you and Addison remember the location of a certain file in two different ways. You remember, “Oh, that’s file E1557”, while Addison remembers, “Oh, that’s the file in the second drawer of the third cabinet eight folders back.” These are two different “names” for the same file. If you modify file E1557, then you’re also modifying Addison’s second-drawer-third-cabinet-eighth-folder’s-file.

Or, to take an alternate analogy: you likely refer to your mother as “mom,” while others refer to her by her name. These are two different identifiers that point to the same underlying “data”. Saying “Margaret is my mom” means that anything that happens to “Margaret” happens to “my mom.”

## 4. Mutability in Python {#4-Mutability-in-Python-1536} 

**Mutability** is a simple idea with complicated implications. A variable is said to be **mutable** if its value can change after it has been assigned; all the variables we’ve used so far have _appeared_ to be mutable because we can always change their values by reassigning them. Inversely, a variable is said to be **immutable** if its value cannot change. You may create the variable and assign it a value, but once that value has been assigned, it cannot be changed again.

## Mutability vs. Passing by Reference {#Mutability-vs-Passing-by-Reference-3117} 

Python passes all arguments by reference. We noted above that, for all practical purposes, Python seems to pass certain data types by value, and indeed, there’s really no functional difference between what it actually does and passing data types by value. However, our goal here is to learn computing, not just programming, so we should know what’s going on “under the hood.”

What’s going on in this case is that integers, floats, strings, and some other data types in Python are actually immutable. In fact, every data type that appeared to be passed by value is immutable. That means that once a variable of these types is created with a value, its value cannot be changed. To go back to our analogy on passing by reference, this is like handing Addison File A with the number 5 written in permanent marker. Yes, he knows where the file is located, but he can’t erase the current value; it’s written permanently.

So, the values of myInteger and myString in Figures 4.1.5 and 4.1.6 didn’t change because myInteger and myString were immutable. Their values can’t change. Simple, right? Not exactly.

## Reassigning Immutable Data Types {#Reassigning-Immutable-Data-Types-3118} 

The idea that integers and strings are immutable seems to be contradicted in the very same segment of code that is meant to demonstrate that they’re immutable. Let’s look at it again, shown here in Figure 4.1.10.

<i-sandbox-py  page-slug="__temp_slug__" code='#Add one to anInteger
def addOne(anInteger):
	anInteger = anInteger + 1
	print("anInteger: ", anInteger)

#Create myInteger with the value 5
myInteger = 5
print("myInteger before addOne:", myInteger)
#Call addOne on myInteger
addOne(myInteger)
print("myInteger after addOne:", myInteger)'>
</i-sandbox-py>

**Figure 4.1.10**

myInteger has the same value in lines 8 and 11 because myInteger is immutable, and therefore cannot be changed by addOne(). But wait: isn’t that very principle being contradicted inside addOne()? Isn’t anInteger also an integer, and isn’t its value being changed in line 3?

Or, to make this even simpler, we can consider just the block of code shown in Figure 4.1.11. We’re changing myInteger right there on line 2, and the print statement on line 3 confirms its value changed! So how can integer be an immutable data type? We _just_ saw its value change in one of the simplest programs we can imagine.

<i-sandbox-py  page-slug="__temp_slug__" code='myInteger = 1
myInteger = 2
print(myInteger)'>
</i-sandbox-py>

**Figure 4.1.11**

Brace yourself, this is about to get weird.

In Python, we can’t change the value of an immutable variable. We can, however, change the reference of an immutable variable to point to a different value. That’s what’s happening here. We’re not technically changing the value of myInteger; we’re telling myInteger to point to the address of a different value.

This will hopefully make more sense in terms of our analogy. We have File A, and on File A is written 5 in permanent marker. We can’t change the number 5 on File A. However, imagine we want to change the value of File A to 7. What do we do? We take out a new sheet of paper, write the number 7 in permanent marker, and we say to ourselves, “Okay, this is now File A.” We never changed what was written on the original sheet of paper, we just changed what we named it. We wanted File A to be 7, so we said, “File A now refers to this other sheet of paper, on which is written the number 7.” If that feels like cheating, then you’re understanding it pretty well.

That’s exactly what Python is doing in Figure 4.1.11. When we call line 1, it creates the value 1 in memory, and points myInteger at 1. When we change myInteger to 2, it doesn’t change the same spot in memory where 1 was stored. Instead, it grabs a new spot in memory, puts the number 2 in it, and says that myInteger now points to the new spot. So, the 1 is still there.

Let’s tie this back to Addison. We drop File A and File B on Addison’s desk. They have the numbers 5 and 2 written in permanent marker on them. Addison wants to change the value of File A to 7. So, what does he do? He pulls out a sheet of paper, writes the number 7, and says to himself, “This is now my File A.” However, he doesn’t get to change what file _we_ call File A. As far as we’re concerned, the original file with 5 written on it is still File A. That’s why the code in Figure 4.1.10 behaved the way it did: addOne() only changes what its variable anInteger points to, not what myInteger pointed to.

## Immutable Data Types: Functions vs. Local Assignments {#Immutable-Data-Types-Functions-vs-Local-Assignments-3119} 

Let’s alter the code a little bit to trace through this entire process. In Figure 4.1.12, we’ve added lines at the bottom to legitimately change the value of myInteger, and then print it again (lines 12 and 13).

Running it, what do we see? When we attempt to change the value of myInteger in our main code at the bottom, it works! When we attempt to change it in addOne(), it only works on the local variable within addOne(), anInteger. Now, let’s trace through this and see why this happens.

As before, first we define the addOne() function on line 2. Then, in our main program code, we create myInteger and assign it the value 5 on line 7. That means that Python creates a memory spot and plops the value 5 in it, and then points myInteger to that memory spot. Then, on line 10, we call addOne().

<i-sandbox-py  page-slug="__temp_slug__" code='#Add one to anInteger
def addOne(anInteger):
	anInteger = anInteger + 1
	print("anInteger:", anInteger)

#Creates myInteger with the value 5
myInteger = 5
print("myInteger before addOne:", myInteger)
#Call addOne on myInteger
addOne(myInteger)
print("myInteger after addOne:", myInteger)
myInteger = myInteger + 1
print("myInteger after increment:", myInteger)'>
</i-sandbox-py>

**Figure 4.1.12**

Python technically passes by reference, so anInteger is assigned to point to the same memory spot as myInteger. Were myInteger not immutable, that means if we changed anInteger, it would also change myInteger because they’re pointing at the same spot in memory.

However, myInteger and anInteger are both immutable. So, when line 3 runs inside addOne(), the computer doesn’t change the number stored at that memory spot to 6. Instead, it grabs a new memory spot, puts in the number 6, and tells anInteger to point to _that_ memory spot instead. So, the 5 is still there, anInteger just isn’t pointing to it anymore. So, when we print anInteger, we’re printing the value of the new location to which it’s pointing, which is now 6.

However, telling anInteger to point at 6 instead of 5 doesn’t change where myInteger points. myInteger is still pointing at 5. So, when we exit the function, printing myInteger still prints 5. In line 12, though, we reassign myInteger to point at 6 as well. So, when we print myInteger in line 13, we now see it show the value 6.

## Printing Memory Addresses {#Printing-Memory-Addresses-3120} 

That all brings us to one last interesting thing we can do in Python. We mentioned above how every variable name actually points to a spot in memory, and when we change the value of an immutable variable (like an integer), we’re actually changing where the variable name is pointing. To make this a little easier, we _can_ print what spot of memory each variable is pointing at, as shown in Figure 4.1.13.

<i-sandbox-py  page-slug="__temp_slug__" code='myInt1 = 5
#Print the spot in memory to which myInt1 is pointing
print(id(myInt1))'>
</i-sandbox-py>

**Figure 4.1.13**

The id() function tells us what spot in memory a variable is pointing to. Here, it shows us that the variable myInt1 is pointing to the location in memory labeled 1407565448. If a data type is immutable, it just means that while the program is running, the data stored in that spot can’t be changed. It’s written in permanent marker, so to speak. Using this new function, we can see the difference between mutable and immutable data structures, as shown in Figure 4.1.14.

<i-sandbox-py  page-slug="__temp_slug__" code='myInt1 = 5
#Print the spot in memory to which myInt1 is pointing
print(id(myInt1))
myInt1 = 6
#Print the spot in memory to which myInt1 is pointing
print(id(myInt1))

myList = ["One", "Two", "Three"]
#Print the spot in memory to which myInt1 is pointing
print(id(myList))
myList.append("Four")
#Print the spot in memory to which myInt1 is pointing
print(id(myList))'>
</i-sandbox-py>

**Figure 4.1.14**

When we make a change to the immutable variable myInt1 on line 5, the memory address to which it points changes, as shown on line 8. Notice that the first two print() statements in this code print myInt1’s memory address, but the memory address is different between the two. Line 5 changes what spot in memory myInt1 points to. myInt1 is an immutable type, so to change its value, we have to change where it’s pointing in memory.

When we make a change to the mutable variable myList on line 14, however, the memory address to which it points doesn’t change. Notice that the print() statements on lines 13 and 17 print the same number, 40885824. Note, however, that this only applies to _changing_ the mutable variable. If we reassign it, it also gets a new memory address, as shown in Figure 4.1.15.

<i-sandbox-py  page-slug="__temp_slug__" code='myList = ["One", "Two", "Three"]
#Print the spot in memory to which myInt1 is pointing
print(id(myList))
myList.append("Four")
#Print the spot in memory to which myInt1 is pointing
print(id(myList)) 

myList = ["Five", "Six", "Seven"]
#Print the spot in memory to which myInt1 is pointing
print(id(myList))'>
</i-sandbox-py>

**Figure 4.1.15**

Running append() on line 5 changes the value of the variable, but it doesn’t change its memory address. This is confirmed by the print() statements on lines 4 and 8 printing the same memory addressed. Reassigning it, however, does: notice that after running line 9 and assigning myList to a new list, the memory address for myList is changed, as shown by the print() statement on line 12. In this way, integers and strings really don’t behave all that differently; they just don’t have methods that change their values without reassigning them.

Finally, it’s this strange oddity of Python that makes the code in Figure 4.1.16 print “True.” myInt1 and myInt2 are separately assigned to the value 5; yet, because Python creates 5 in memory, it simply assigns both variables to point at the same spot. So, not only do myInt1 and myInt2 have the same value, but they also refer to the same spot in memory. This only works because integers are immutable: otherwise, every time two variables coincidentally took on the same value, they would start interfering with each other.

<i-sandbox-py  page-slug="__temp_slug__" code='myInt1 = 5
myInt2 = 5
#Prints True if myInt1 and myInt2 point to the same spot in memory
print(id(myInt1) == id(myInt2))'>
</i-sandbox-py>

**Figure 4.1.16**

Mutable variables will behave differently, as shown in Figure 4.1.17. Just like myInt1 and myInt2, myList1 and myList2 are assigned the same value. Because they are mutable, though, Python creates that value twice in memory, assigning them to point at the different memory locations; so, it is False that their memory locations are equal, as shown by line 4. This is what allows us to call append() on myList2 without affecting myList1, as shown by lines 6 through 9: had they pointed at the same memory location, changing the value via one variable name would have changed the value for the other variable name.

<i-sandbox-py  page-slug="__temp_slug__" code='myList1 = ["One", "Two", "Three"]
myList2 = ["One", "Two", "Three"]

print(id(myList1) == id(myList2))

myList2.append("Four")

print(myList1)
print(myList2)'>
</i-sandbox-py>

**Figure 4.1.17**

## 5. A Brief Introduction to Methods {#5-A-Brief-Introduction-to-Methods-1537} 

So far, we’ve glossed over a bit of syntax and promised to return to it later. For example, in the previous lesson we saw it with myList.append(). We noted earlier that the dot separates the variable, myList, from something resembling a function, append(). We’ve seen similar things in other places as well, like myString.isdigit(). We noted at the time to just remember what each individual example of this kind of syntax does, and not worry too much about the syntax.

Going forward into more advanced data structures, however, this syntax is going to become more common. We’ll talk about this more extensively when we discuss encapsulation in Chapter 5.1, but because we’ll see it more often in this unit, this is a good time to pause and comment a little more on what this is.

## Functions vs. Methods {#Functions-vs-Methods-3121} 

Previously we noted that this dot syntax behaved essentially like a function, and that’s still true. Just like functions, they have names, parameters, some internal operations or code, and they may or may not return some value. The way we’ve used them so far, they’re pretty indistinguishable from functions.

The difference is subtle. The functions we’ve defined have been defined at the top level of our programs. We’ve created them before actually writing the body of our programs, and that’s why they’re visible. **Methods**, on the other hand, are _contained within data types_. Instead of just calling them directly like functions, we have to first say which variable we’re referring to, and _then_ call the method inside them. So, a method is a function contained inside a data structure.

## Methods in Practice {#Methods-in-Practice-3122} 

What does this mean for us in practice? So far, we’ve mostly been manipulating our variables through operators. Operators work on simple data types. Going forward, we’re mostly going to be manipulating our variables using methods and functions. The reasoning necessary to manipulate advanced data types is too complex to be taken care of by simpler operators.

For now, though, you don’t need to worry too much about how methods work or the meaning behind their syntax; we’ll cover that in Chapter 5.1. For now, you really just need to understand what the effect of a method call will be. Let’s take a simple string method we’ve seen in the past: isdigit().

isdigit() is a boolean method that is part of the string data structure. It checks if the string represents a number. Note that just like functions, methods can have types as well: isdigit() returns a True or False value, but other methods could return integers, strings, or more complex data types just like functions. If we try to think of isdigit() as a function, though, we’re faced with a problem: how does isdigit() know _which_ string to check? It doesn’t have any parameters! We can imagine an isdigit() function with the header def isdigit(aString), where it would check if aString is all digits. But the method isdigit() as defined has no parameters; how does it know what string to check?

The answer lies in the fact that isdigit() is contained _within_ the string data type. That means every string has access to the isdigit() method. When called, the isdigit() method acts on whatever string called it, as shown in Figure 4.1.18. When we call myNumericString.isdigit(), isdigit() looks at myNumericString. When we call myNonNumericString.isdigit(), isdigit() checks myNonNumericString.

<i-sandbox-py  page-slug="__temp_slug__" code='myNumericString = "12345"
myNonNumericString = "ABCDE"

#Prints True if myNumericString is digital
print(myNumericString.isdigit())
#Prints True if myNonNumericString is digital
print(myNonNumericString.isdigit())'>
</i-sandbox-py>

**Figure 4.1.18**

In the past, we’ve used the example of Addison, where Addison was a function. Now let’s take another example. Imagine Dana is another co-worker, but let’s treat Dana as a variable of type Coworker. The Coworker type might have a method getMyName(), which is the equivalent of asking a co-worker for their name. When someone asks Dana her name, she doesn’t have to holler to some other function in the workplace and ask, “Hey, what’s my name?” She knows her name; it’s “Dana.” In fact, every co-worker knows their own name, but for every co-worker the answer is different. They all have the same method, getMyName(), which requires no input and returns a different result for each co-worker. The reason why is when asked their name, each co-worker knows to return their _own_ name.

That’s like a method. A method is a function defined within a data type that must be called from a particular variable. When it’s called, it knows to look at the variable from which it’s called. myNumericString.isdigit() knows to check myNumericString, not myNonNumericString, just as Dana knows to give her own name, not Vrushali’s name when asked.

## Equivalent Syntax {#Equivalent-Syntax-3123} 

If this is still confusing, don’t worry. Like I’ve said, you don’t really need to understand this too deeply until we get to Chapter 5.1. This is good exposure, but you’re safe to move forward without understanding this fully.

If this is still confusing but functions made sense, then there’s a little equivalent syntax you can think of that will be true for the rest of this unit. A method is like a function that takes the variable referencing it as its first parameter. myString. isdigit() can be thought of largely as the same as isdigit(myString), where isdigit() is a function that checks if myString is all digits, as shown in Figure 4.1.19. This won’t work when we reach Chapter 5.1, but it’s sufficiently equivalent to let you proceed with Unit 4.

<i-sandbox-py  page-slug="__temp_slug__" code='import string
#Return True if inString contains all digits
def isdigit(inString):
	#Check each character one-by-one
	for character in inString:
		#Check if the character is a digit
		if not character in string.digits:
			#Return false if not
			return False
	#Return true if we reached here
	return True

myString = "52672"
print(isdigit(myString))
print(myString.isdigit())'>
</i-sandbox-py>

**Figure 4.1.19**

