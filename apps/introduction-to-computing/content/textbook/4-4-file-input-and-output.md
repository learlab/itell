---
assignments:
- summary
chunks:
- title: 1. What Is File Input and Output?
  slug: 1-What-Is-File-Input-and-Output?-1567
  type: plain
- title: Output Complements Input
  slug: Output-Complements-Input-3210
  type: regular
- title: File Types
  slug: File-Types-3211
  type: regular
- title: 2. Reading, Writing, and Appending
  slug: 2-Reading,-Writing,-and-Appending-1568
  type: plain
- title: 'Getting Started: Opening and Closing Files'
  slug: Getting-Started-Opening-and-Closing-Files-3212
  type: regular
- title: Reading, Writing, Appending
  slug: Reading,-Writing,-Appending-3213
  type: regular
- title: 3. Writing Files in Python
  slug: 3-Writing-Files-in-Python-1569
  type: plain
- title: Simple File Writing
  slug: Simple-File-Writing-3214
  type: regular
- title: Writing Lists
  slug: Writing-Lists-3215
  type: regular
- title: Another Way to Output
  slug: Another-Way-to-Output-3216
  type: regular
- title: 4. Reading Files in Python
  slug: 4-Reading-Files-in-Python-1570
  type: plain
- title: Simple File Reading
  slug: Simple-File-Reading-3217
  type: regular
- title: Loading into Lists
  slug: Loading-into-Lists-3218
  type: regular
- title: 5. Files and Turtles
  slug: 5-Files-and-Turtles-1571
  type: plain
- title: Preparing to Save and Load
  slug: Preparing-to-Save-and-Load-3219
  type: regular
- title: Global Variables
  slug: Global-Variables-3220
  type: regular
- title: The Save Command
  slug: The-Save-Command-3221
  type: regular
- title: The Load Command
  slug: The-Load-Command-3222
  type: regular
- title: Looking Forward
  slug: Looking-Forward-3223
  type: regular
cri:
- question: What is file output and file input in programming?
  answer: File output is writing data from memory to a file, while file input is reading data from a file into memory.
  slug: Output-Complements-Input-3210
- question: What is the purpose of file types and encoding in computer programs?
  answer: File types specify rules about how the program should read the data within it, while encoding is the organizational scheme for interpreting the data.
  slug: File-Types-3211
- question: What is the purpose of enclosing file input and output within a try block in many languages?
  answer: To handle potential errors, such as trying to open a file that doesn't exist, and prevent the program from crashing.
  slug: Getting-Started-Opening-and-Closing-Files-3212
- question: What does the 'writing' mode do when interacting with a file?
  answer: Writing erases the file and writes it completely from scratch.
  slug: Reading,-Writing,-Appending-3213
- question: What is the purpose of using the \n escape sequence in the code provided?
  answer: To write each number on a separate line in the file.
  slug: Simple-File-Writing-3214
- question: How can we write a list of items to a file in Python?
  answer: By using the join() method to merge the list into one string with newlines built in.
  slug: Writing-Lists-3215
- question: What is an advantage of using the print() function with the file parameter instead of outputFile.write()?
  answer: The print() function appends the newline character by default and allows the use of other keyword parameters like end and sep.
  slug: Another-Way-to-Output-3216
- question: What happens if we print the file directly?
  answer: Python prints a reference to what type of file is and what mode it’s in, not the contents.
  slug: Simple-File-Reading-3217
- question: How can we read all the lines in a file until the end in Python?
  answer: Python has a couple ways of doing this, as shown in Figure 4.4.14.
  slug: Loading-into-Lists-3218
- question: Why do we need to create a list of all the commands in order?
  answer: To have the commands available for saving and loading when needed.
  slug: Preparing-to-Save-and-Load-3219
- question: What is a global variable and how can we declare variables and functions globally in Python?
  answer: A global variable is a variable that can be seen across the entire program; we can declare our own variables and functions globally in Python by using the 'global' keyword.
  slug: Global-Variables-3220
- question: What is the key step in saving commands to a file in the program?
  answer: Saving allCommandsList to a file and allowing the user to execute that command.
  slug: The-Save-Command-3221
- question: What does the literal_eval() method do when reading a line from a file?
  answer: It interprets the line according to Python syntax, correctly interpreting a string that represents a tuple as a tuple.
  slug: The-Load-Command-3222
- question: What is the programming life cycle as described in the passage?
  answer: The programming life cycle involves evaluating code, finding areas for improvement, and continuing to refine and expand the program going forward.
  slug: Looking-Forward-3223
next_slug: 4-5-dictionaries
order: 8
parent:
  title: 'Unit 4: Data Structures'
  slug: unit-4-data-structures
quiz: null
slug: 4-4-file-input-and-output
title: 4.4 File Input and Output
---

## 1. What Is File Input and Output? {#1-What-Is-File-Input-and-Output?-1567} 

So far, the major weakness of everything we’ve written is that every time we run our code, it’s like we’re running it for the very first time. Nothing persists, or is saved, across different runs of our code. If we want to change some data, we have to change it in the code itself. Needless to say, this isn’t how real programs operate. Nearly every program we use on a daily basis persists some information across multiple runs of the same program, whether it’s login information, the user preferences, or the files that we create. This is taken care of by the complementary processes of file input and file output.

## Output Complements Input {#Output-Complements-Input-3210} 

We usually refer to “**file input and output**,” but let’s start with output because it’s what we’ll need to do first in the programs we’ve been writing. File output is the process of taking what’s currently stored in memory and writing it to a persistent file on the hard drive. We might not want to write everything in memory to a file, but anything we would want the next time we run the program would need to be written. This is file output: outputting the current data in the program to a file.

The complementary process to this is file input. File input is reading that data from the file into our program’s active memory. Ideally, these processes are reverses of one another: whatever data was outputted to the file should end up loaded into the program in the same way when inputting from the file. Imagine a program that had three variables, a, b, and c, with the values 5, 3, and 1, respectively. When outputting to the file, the program would write 5, 3, and 1. When inputting the file, the goal would be for 5 to be loaded as the value of a, 3 the value of b, and 1 the value of c. Ideally, it would not be clear after loading that any outputting and inputting occurred at all: loading should restore the state of the program to just as it was when it saved (for most programs, anyway).

Some of the data we’re referring to is obvious. It might be the preferences the user has set, or the document that they’ve created; when they load it again, it should load the document exactly as it was saved. Other data can be a little subtler, though. Recent versions of Microsoft Word, for example, save not only the document, but also the scroll position, so reopening the document actually shows you the same area of the document as you saw when you saved.

## File Types {#File-Types-3211} 

As you’ve noticed using computers in your everyday life, most files have types. There are .pdf files, .docx files, .jpg files, .png files, and thousands of other types. Each type of file specifies rules about how the program should read the data within it.

You may have noticed that you can open any type of file with a plain text reader, like Notepad on Windows, TextEdit on Mac, Emacs or Vim on Linux, or many more. While technically you can open these files, you usually won’t be able to read much in them: they’re not stored in just plain text, but rather there’s a lot of built-in, type-specific encoding. That encoding is properly unpacked by a program that knows how to read the file.

Think of encoding as the organizational scheme for a friend or co-worker. If you walk into a co-worker’s office, you might see file folders labeled with different colors and numbers. You don’t know what those colors and numbers mean, so you can’t fully understand the information stored there the way they can. That’s what a file type is: a set of rules for how to interpret a file. A program can only correctly interpret the file if it knows these rules. You could learn the rules, and similarly, we could develop new programs to read existing file types, but only if the rules are made available.

There do exist plaintext file formats, like .txt, .csv, .html, .xml, and more. These are like walking into your co-worker’s office and seeing an organizational scheme so simple or so well-documented, anyone could understand it. When you open these, what you see is what you get: you can read them just as the text itself. We’ll stick close to these plaintext types for our conversations.

## 2. Reading, Writing, and Appending {#2-Reading,-Writing,-and-Appending-1568} 

With plaintext files, there are three general concepts we need to understand: reading from the files, writing to the files, and appending to the files. Regardless, though, it all starts with opening files and ends with closing files.

## Getting Started: Opening and Closing Files {#Getting-Started-Opening-and-Closing-Files-3212} 

File input can vary pretty dramatically from language to language. Generally, however, it follows a certain high-level workflow. First, the file is opened and assigned to a variable that represents the opened file. This is not always an easy step: if we try to open a file that doesn’t exist, our program will usually throw an error, and as a result, crash if the error was not handled. For that reason, many languages require that file input and output be enclosed within a try block. In many languages, when opening a file, we need to specify a mode: read-only, write, or append, which we’ll cover in the next section.

Opening the file, in most languages and operating systems, locks the file down in the operating system. Other programs are not permitted to modify the file while our program has it opened. For that reason, we need to also close the file when we’re done. Closing the file indicates to the operating system that we’re done modifying it, and it can be modified by other programs again.

## Reading, Writing, Appending {#Reading,-Writing,-Appending-3213} 

Once we’ve opened a file, there are three general modes we’ll usually use for interacting with it: reading, writing, and appending. Reading simply means that we’re looking at the file’s contents and reading it into our program. We’re not changing the file’s contents at all, just reading it.

Writing, on the other hand, means we’re writing to the file from scratch. Have you ever accidentally saved over a file on your computer with a different file? The reason that’s so disastrous is that when “writing” to a file, we by default erase it and write it completely from scratch. With writing, we assume the file is a snapshot of the current state of our program, not a running log of the history of its changes. Usually that’s the case, but it does mean we need to be careful. We should never use sensitive data when testing out our input and output because we could easily find ourselves overwriting it.

The third mode, appending, is safer, although often not as useful. Appending also writes to the file, but it starts on the last line of the file. Nothing is overwritten; new data is just added to the end.

Beyond writing or appending, there are some pretty advanced ways of writing content to files. For example, serialization is an often automatic process of grabbing all the variables in a program and automatically storing them in a way that can be loaded directly in the future. That’s further down the road, though. For our purposes, we’re going to discuss file input and output primarily in terms of reading and writing lines one-by-one. This is a good place to get started because it keeps things pretty close to the individual variables we’re storing.

## 3. Writing Files in Python {#3-Writing-Files-in-Python-1569} 

Let’s start by writing files. The main reason to start here is that to have something to load, we must have something saved! We’ll go through two examples: a simple one, where we just output a handful of variables, and a complex one, where we output a list using a loop.

## Simple File Writing {#Simple-File-Writing-3214} 

To write to a file in Python, we open the file, write our data, then close the file. Python makes this relatively easy, as shown in Figure 4.4.1

<i-sandbox-py  page-slug="__temp_slug__" code={`myInt1 = 12
myInt2 = 23
myInt3 = 34

#Opens file in write mode
outputFile = open("OutputFile.txt", "w")

#Write myInt1 to outputFile
outputFile.write(str(myInt1))
#Write myInt2 to outputFile
outputFile.write(str(myInt2))
#Write myInt3 to outputFile
outputFile.write(str(myInt3))

outputFile.close()`}>
</i-sandbox-py>

**Figure 4.4.1**

We open the file using Python’s general function open() on line 6. We give it a filename and, optionally, a mode: “w” for write, “r” for read, and “a” for append. We then assign the open file to a variable. This variable now contains our open file. However, the variable itself isn’t really data: what the variable does is it allows us to run methods that will take care of reading and writing the file.

Right now we want to write, so we call outputFile.write() on lines 9 through 13. outputFile.write() can only write strings, so we have to convert our variables to strings before writing them, so our argument to outputFile. write() on line 9 is str(myInt1). Then, after writing all the variables, we close() the file on line 15. After running this, we could go to the folder where this code lives, and we would find OutputFile.txt. Opening it, we would find that it contains the text shown on the right side of Figure 4.4.1: 122334.

We probably want each number to appear on its own line, though. Otherwise, we would receive the same file from printing number sets like 12, 23, 34; 123, 3, 34; 12, 334, 2; and so on. Remember our escape sequence \\n? If we add that to the end of each line, we’ll accomplish our goal, as shown in Figure 4.4.2. Here, if we open the file, we’ll see the numbers 12, 23, and 34 each on a separate line. That would make it easier to load in our loading stage.

<i-sandbox-py  page-slug="__temp_slug__" code={`myInt1 = 12
myInt2 = 23
myInt3 = 34

#Opens file in write mode
outputFile = open("OutputFile.txt", "w")

#Write myInt1 to outputFile
outputFile.write(str(myInt1) + "\n")
#Write myInt2 to outputFile
outputFile.write(str(myInt2) + "\n")
#Write myInt3 to outputFile
outputFile.write(str(myInt3) + "\n")

outputFile.close()`}>
</i-sandbox-py>

**Figure 4.4.2**

## Writing Lists {#Writing-Lists-3215} 

That form of simple writing works just fine if we know exactly how many values we want to store and exactly the order in which to store them. As we’ll see later, when loading from that file, we’ll assume the first line holds myInt1, the second holds myInt2, and the third holds myInt3.

Most of the interesting applications we’ll write, though, don’t have a predictable number of variables. What if we want to write a list of items to a file? Let’s pretend we’re writing a list of names, for example. How would we do that? The most obvious way would be to iterate over the list, writing them to the file one by one, as shown in Figure 4.4.3. The for loop on line 8 repeats for each name in myList, calling outputFile.write(name + “\\n”) on each one to print the name and a line break.

<i-sandbox-py  page-slug="__temp_slug__" code={`myList = ["David", "Lucy", "Vrushali", "Ping", "Natalie", "Dana", "Addison", "Jasmine"

outputFile = open("OutputFile.txt", "w")

for name in myList:
	outputFile.write(name + "\n")
	
outputFile.close()`}>
</i-sandbox-py>

 **Figure 4.4.3**

This could be even easier, though. The reason we cover lists before file output (or at least, one of the reasons) is because Python has a handy way for writing lists to a file, as shown on line 8 of Figure 4.4.4.

The writelines() method writes every item in the list to a file. Unfortunately, we’re back to our old problem: writelines() doesn’t append line breaks, so all the names are squished together! So what do we do? Well, we could put the newlines directly into the names, but that seems a little inelegant: what if we need to use these names for something else? Instead, we could merge the list into one string with the newlines built in, and then write _that_ to a file, as shown in line 8 of Figure 4.4.5.

<i-sandbox-py  page-slug="__temp_slug__" code={`myList = ["David", "Lucy", "Vrushali", "Ping", "Natalie", "Dana", "Addison", "Jasmine"

outputFile = open("OutputFile.txt", "w")

outputFile.writelines(myList)
	
outputFile.close()`}>
</i-sandbox-py>

**Figure 4.4.4**

<i-sandbox-py  page-slug="__temp_slug__" code={`myList = ["David", "Lucy", "Vrushali", "Ping", "Natalie", "Dana", "Addison", "Jasmine"

outputFile = open("OutputFile.txt", "w")

outputFile.write("\n".join(myList))
	
outputFile.close()`}>
</i-sandbox-py>

**Figure 4.4.5**

This code embeds the newline escape sequence, “\\n”, between every pair of names in myList; if you’re unsure how this works, peek back at the join() method from Chapter 4.2. When it prints this one large string, the newlines are built in, as shown by the contents of OutputFile.txt in Figure 4.4.5.

Note that we can alternate between writing variables directly and writing via loops, as well as print via multiple loops or nested loops. Writing is just like printing: whenever the computer encounters a write() call, it writes to the file in that order.

Figure 4.4.6 shows an example of printing variables directly followed by printing a list. This code will write 12, 23, and 34 to the first three lines of the output file, then the strings David through Jasmine on the next eight lines.

<i-sandbox-py  page-slug="__temp_slug__" code={`myInt1 = 12
myInt2 = 23
myInt3 = 334
myList = ["David", "Lucy", "Vrushali", "Ping", "Natalie", "Dana", "Addison", "Jasmine"

outputFile = open("OutputFile.txt", "w")

outputFile.write(str(myInt1) + "\n")
outputFile.write(str(myInt2) + "\n")
outputFile.write(str(myInt3) + "\n")
outputFile.write("\n".join(myList))
	
outputFile.close()`}>
</i-sandbox-py>

**Figure 4.4.6**

## Another Way to Output {#Another-Way-to-Output-3216} 

Python also gives another way to output files that might be a little more intuitive. The print() function that we’ve been using for a long time has a keyword parameter file that, when defined, writes to the specified file instead of the console, as shown in Figure 4.4.7.

<i-sandbox-py  page-slug="__temp_slug__" code={`myList = ["David", "Lucy", "Vrushali", "Ping", "Natalie", "Dana", "Addison", "Jasmine"

outputFile = open("OutputFile.txt", "w")

for name in myList:
	print(name, file = outputFile)
	
outputFile.close()`}>
</i-sandbox-py>

**Figure 4.4.7**

We still open the file the same way on line 5, but instead of writing using outputFile.write(), we write using print() on line 10, and specify with the file parameter that the target of our print statement is outputFile. The added bonus here is that print(), by default, appends the newline character. It also lets us use our other keyword parameters like end and sep, so we could change the newline character to something else, or write multiple variables separated by a space at the same time.

Personally, I usually see people using the first approach (the write() method), but I prefer using the second approach (including the file parameter with the print() function). Either will work, though.

<i-sandbox-py  page-slug="__temp_slug__" code={`myInt1 = 12
myInt2 = 23
myInt3 = 34

outputFile = open("OutputFile.txt", "w")

outputFile.write(str(myInt1) + "\n")
outputFile.write(str(myInt2) + "\n")
outputFile.write(str(myInt3) + "\n")
outputFile.close()`}>
</i-sandbox-py>

**Figure 4.4.8**

Figure 4.4.8 shows the results of running this code twice in append mode. If we run this code twice, then each of the three lines is printed twice. If we run it three more times, then each of the three lines will be printed three more times.

Does this work for the alternate method of writing we covered? Let’s again assume that OutputFile.txt is empty when we get started, and that we run the code twice, as shown in Figure 4.4.9. This works, too! So, if we want to add to the end of an existing file instead of writing it from scratch, we can open it in append mode. In practice, I haven’t found that many users for this: it’s most useful for logging across multiple runs of a program.

<i-sandbox-py  page-slug="__temp_slug__" code={`myList = ["David", "Lucy", "Vrushali", "Ping", "Natalie", "Dana", "Addison", "Jasmine"

#Open OutputFile.txt in append mode
outputFile = open("OutputFile.txt", "a")

for name in myList:
	print(name, file = outputFile)
	
outputFile.close()`}>
</i-sandbox-py>

**Figure 4.4.9**

## 4. Reading Files in Python {#4-Reading-Files-in-Python-1570} 

We’ve now written some data to a file. Our goal is now to complete the symmetry between output and input: we want to load these files back into our program such that the values of the variables are the same after loading as they were before.

## Simple File Reading {#Simple-File-Reading-3217} 

In our first example in Figure 4.4.2, we wrote three integers to a file, each on their own line. Now, let’s write a program to load these back into myInt1, myInt2, and myInt3. First, though, let’s just see how Python opens the file and what it sees when it does in Figure 4.4.10.

<i-sandbox-py  page-slug="__temp_slug__" code={`inputFile = open("OutputFile.txt", "r")
print(inputFile)
inputFile.close()`}>
</i-sandbox-py>

**Figure 4.4.10**

Here’s how we open a file to read: we use the same function, open(), and supply the “r” argument to indicate we want to read it. What happens if we just print the file directly? Python prints a reference to what type of file is and what mode it’s in, not the contents. To print the contents, we have to actually read the file, as shown in 4.4.11.

<i-sandbox-py  page-slug="__temp_slug__" code={`inputFile = open("OutputFile.txt", "r")

#Prints the next line of inputFile
print(inputFile.readline())
#Prints the next line of inputFile
print(inputFile.readline())
#Prints the next line of inputFile
print(inputFile.readline())

inputFile.close()`}>
</i-sandbox-py>

**Figure 4.4.11**

To read files, we use the readline() method in the outputFile variable, as shown on lines 4, 6, and 8. readline() reads to the next line break, then returns the string that results. This moves the reader forward to the start of the next line, so when we call readline(), the next line is passed permanently; if we don’t save the results in a variable, we can’t go back and read it again without completely reopening the file from scratch. Reading the file reads through it once straight through; it doesn’t jump around or repeat. Note also that the line breaks are included in what is read from the file, as indicated by the extra blank line between numbers in the output. If we want to store or print the lines without the line breaks (as we often might), we need to strip the whitespace off of them, as shown in lines 4, 6, and 8 of Figure 4.4.12.

<i-sandbox-py  page-slug="__temp_slug__" code={`inputFile = open("OutputFile.txt", "r")

#Prints the next line of inputFile
print(inputFile.readline().strip())
#Prints the next line of inputFile
print(inputFile.readline().strip())
#Prints the next line of inputFile
print(inputFile.readline().strip())

inputFile.close()`}>
</i-sandbox-py>

**Figure 4.4.12**

This is deceptively complicated actually. We’re calling a method on another method. We have inputFile, a variable that represents the file we’re reading. We call inputFile.readline() to get the next line of inputFile. We then want to strip the whitespace (spaces and newlines) off of the string; but if readline() returns a string, then we can call strip() directly on top of readline(). The result is that we print the lines one-by-one with the extra newline characters removed.

If that’s still confusing, let’s step through it bit by bit. We tell the computer to print inputFile.readline().strip(). When we chain calls together like this, they’re run left-to-right—after all, it doesn’t know what it’s calling strip() on until it calls readline(). So, it grabs inputFile() and calls readline(). The first time this happens, readline() returns “12\\n”. This effectively replaces inputFile.readline() with “12\\n”. So, this line effectively becomes "\\n". strip(). “12\\n” is a string, so it has access to the strip() method. strip() removes spaces and newlines, so it removes “\\n”, leaving only “12”.

<i-sandbox-py  page-slug="__temp_slug__" code={`inputFile = open("OutputFile.txt", "r")

myInt1 = int(inputFile.readline())
myInt2 = int(inputFile.readline())
myInt3 = int(inputFile.readline())

print("myInt1:", myInt1)
print("myInt2", myInt2)
print("myInt3:", myInt3)

inputFile.close()`}>
</i-sandbox-py>

So, if we want to store these lines in our variables as we load them, we have to assign the result of each call to readline() to some variable, as shown in lines 5, 8, and 11 of Figure 4.4.13.

Each time we call inputFile.readline(), it reads the next number from the file. By default, readline() returns strings, so we have to convert them to integers. The int() function is smart enough to ignore the whitespace in the strings, so we can skip the strip() method. Then, we print them out one-by-one on lines 13 through 15.

However, the most important thing is that at the end of this execution, myInt1, myInt2, and myInt3 hold the same values that they held before we saved and closed the program from Figure 4.4.2: 1, 2, and 3 respectively. We’ve thus completed the symmetry between output and input. Their values before saving and after loading are the same.

## Loading into Lists {#Loading-into-Lists-3218} 

Writing lists was relatively easy: we just iterated over the list, writing each line to a file just the same way we would print it. The reason this was easy was that we knew in advance how many items in the list there were. However, that presents a challenge for reading from a list. When we’re reading, we don’t know in advance how many lines there are to read. How do we get around this?

Well, we could go back and change our output, telling it to first print the length of the list. That’s a little inelegant, though. Instead, it would be great if Python had a mechanism for reading all the lines in a file until the end. Fortunately, it does have a couple ways of doing this, as shown in Figure 4.4.14.

<i-sandbox-py  page-slug="__temp_slug__" code={`myList = []

inputFile = open("OutputFile.txt", "r")

#For each line in the file
for line in inputFile
	#Add the line to myList, stripping out the whitespace
	myList.append(line.strip())

print(myList)

inputFile.close()`}>
</i-sandbox-py>

**Figure 4.4.14**

Python’s files can use for-each syntax to read each line in the file. On lines 7 and 9, we say for each line in the file, append the line to myList (after calling strip() to strip out whitespace and newlines). If the only thing stored in our file is the list’s data, then this is all we need.

What happens, though, if our file was a mixture of lists and variables? For example, in Figure 4.4.6, we printed out myInt1, myInt2, myInt3, and myList all in one file. How do we load just the integers into the three myInt variables, and the list items into the list?

To do this, we do have to know which lines are going to be which kinds of data. In Figure 4.4.15, we know that the first three lines of the file are going to be the integers, so we can load these the same way on lines 6 through 8. Fortunately, though, the for-each loop by default starts with the next _unread_ line, not at the beginning of the file. So, we just have to start the for loop after reading the first three integers.

At the end of Figure 4.4.15, the status of all four variables—the three myInt variables and myList—is the same as it was when we saved in Figure 4.4.6. Note also that we don’t _have_ to read line-by-line: we can also use the read() method (rather than the readline() method) to read the entire remaining contents of the file into one string, newlines and all.

<i-sandbox-py  page-slug="__temp_slug__" code={`myList = []

inputFile = open("OutputFile.txt", "r")

myInt1 = int(inputFile.readline())
myInt2 = int(inputFile.readline())
myInt3 = int(inputFile.readline())

#For each line in the file
for line in inputFile
	#Add the line to myList, stripping out the whitespace
	myList.append(line.strip())

print(myInt1)
print(myInt2)
print(myInt3)

print(myList)

inputFile.close()`}>
</i-sandbox-py>

**Figure 4.4.15**

## 5. Files and Turtles {#5-Files-and-Turtles-1571} 

Now that we’ve covered our save and load functions, let’s make that the next thing we implement in our turtles. Let’s create the ability to save all previously executed commands to a file, and load these commands from a file. That will let users share what they created! For now, we’ll keep this simple: the save command will automatically save all previous commands, and the load command will automatically load and execute all previous commands.

We’re going to be making several revisions this time around; instead of sharing each intermediate state, let’s instead just look at the finished product, FilesandTurtles.py. We can talk through each individual change as we go.

## Preparing to Save and Load {#Preparing-to-Save-and-Load-3219} 

One way to do this would be to automatically save any command issued to a file. However, we don’t want to just automatically save every session. We want to specifically give the user the option to save when they want to. To save something, we need to have it stored in memory, and right now, we lose our commands once they’re run. So, the first thing we need to do is create a list of all the commands in order, to have available when we want to save.

So, to prepare for saving and loading, we need to keep that log of the commands that have been entered. We do that by creating allCommandsList, near the end of our program. Then, whenever the user executes a command, it’s appended to allCommandsList; we want to save the commands as they’re executed rather than as they’re entered so that we don’t have to worry about saving record and stop commands (instead, we’ll save the “unpacked” version).

However, this presents an issue. allCommandsList is declared in the main part of our program. However, save will be a command that the user enters, so it will be processed inside executeCommand(). executeCommand(), however, can’t see the variables of the main program. This was similar to our problem with recordList and recording: for executeCommand() to work on them, it needed to see them, but they were defined outside executeCommand().

So, the way our program is structured right now, we would have to take care of saving and loading in that main while loop at the bottom as well. But this is getting messy: we want all our commands to be run through executeCommand(), not divided up between two places. We can do this, we just have to introduce a new principle: global variables.

## Global Variables {#Global-Variables-3220} 

A **global variable** is a variable that can be seen across the entire program. We force it to have a large scope. It can be seen inside the functions even if it wasn’t passed to them as an argument. Functions can be global as well, actually, and we’ve seen some: why were we able to see functions like print() and open() even though we never declared them anywhere? They were declared globally. We can declare our own variables and functions globally, too. In fact, it isn’t hard to do in Python.

By default, any variable declared in our main program has the _potential_ to be global. The problem lies with our functions. When we create a function, by default it only sees the parameters with which it was declared. So, our executeCommand() function, by default, sees only commandTuple. Any variables we declare inside are assumed to be local to the function, _unless_ we specifically tell the function to go look outside of itself for the variables.

We do that on the first two lines: global recording and global recordList. These tell the function, “From here on, whenever you see a reference to recordList, go look at recordList in the main program”. This is a subtle difference, but it’s significant. This means that executeCommand() can now change whether the main program is recording or not.

So, when the user enters “record,” recording is set to True here in executeCommand(). When the user enters “stop,” the recorded commands are run inside executeCommand(). Now, the only “special” reasoning our main program needs is to (a) determine whether the newest command should be executed or recorded, and (b) to bypass that check if the command is “stop”. Without the latter reasoning, a “stop” command would merely be added to the list of recorded commands; instead, the latter reasoning directs “stop” to be executed immediately.

Now we’re prepared to actually create our save and load commands. Defining things globally will help us create our save command, but we’ll also soon see that restructuring the recording process to use global variables will allow it to be loaded more easily as well.

## The Save Command {#The-Save-Command-3221} 

With a global variable available, saving becomes actually a pretty easy process. We’ve already added reasoning to our program that saves every command as it comes in to allCommandsList. Now all we need to do is save allCommandsList to a file, and allow the user to execute that command.

So, we add three things:

* Save as an option in getCommandFromUser(). This will also allow the user to enter a filename to which to save. For now, we’ll assume that the filename they enter is valid.
* Save as an option in executeCommand(). This will actually call the save() function if the user enters save as their command.
* The save() function itself.

Because everything we’re saving is tuples, we’re just going to save the tuples directly. This means we won’t have to worry when reading these commands back in about how many parameters each has. So, when we save, we’ll find that every line of the file represents one of the tuples.

## The Load Command {#The-Load-Command-3222} 

Now for the slightly harder part: the load command. There are different ways we can do this. For now, let’s construct the load command to load the commands from a file into a list and return the list. Let’s also update our save command to ignore load commands, too, and let’s keep assuming the file entered will be valid.

Adding our load function involves calling a library and method we’ve never seen before. The library is ast, and the method is literal_eval(). Don’t worry about what this does for now, just know that this reads a line from a file and interprets it according to Python syntax; in this case, it correctly interprets a string that represents a tuple as a tuple. Note also you should generally do all your imports at the start of the program; I’m including the import here just to highlight it.

So, now we have a list of commands contained within loadedCommands. What do we do with it? Simple: we run them! Remember, we saved commands as they were _executed_, not as they were _entered_. That means that we don’t need the reasoning for dealing with recording and stopping; if a set of three commands was repeated five times, then we saved all fifteen commands individually. So, after retrieving our loaded commands, we just iterate over them, executing them one by one.

The final result: it actually took relatively little work to create these save and load commands. Excluding the conversion of recording and stopping to global variables, we’ve only added 29 lines:

* Four lines to give the save and load options to getCommandFromUser().
* Six lines to execute the save and load commands in executeCommand().
* Four lines to build allCommandsList.
* Eight lines to build the save function itself.
* Seven lines to build the load function itself.

Notice that the way we’ve structured this, if we load some commands from a file, then save our own commands, the commands we loaded are saved as well; so, we can add other commands to a new program, and save them without having to save the original file.

## Looking Forward {#Looking-Forward-3223} 

Note that this has gotten extremely complex. The goal here is not necessarily for you to understand every part. The goal is for you to understand the general idea of complexity and program flow. Trace through some executions of this code and notice how execution passes back and forth from function to function, how loops run over saved commands or recorded commands, and how tuples are used to communicate commands around. Notice how I’ve referenced some methods and specifically told you not to worry how they work, like ast.literal_eval(): that’s part of programming, using methods you don’t understand because you know their result.

There are also lots of places this program could still be improved:

* Files are still unchecked for validity. The program will crash if the user saves to an invalid filename, or loads from an absent file.
* Recording can’t be nested. Since recording is stored globally, we can only ever have one recording at a time. It would be cool if we could include a recording within a recording, like a nested loop.
* Right now, we’re looping over commands in three places: the main while loop, the loop repeating recorded commands, and the loop repeating commands loaded from the file. Ideally, we would only have one such loop. We could restructure the program to have only one executeCommands() function that takes as input a list of commands and executes them.
    
    This is indicative of the overall process of writing programs: there’s always room for expansion, improvement, and refinement. This is the programming life cycle: evaluating our code also gives us ideas for how to improve it even more going forward.

