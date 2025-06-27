---
assignments:
- summary
chunks:
- title: Learning Objectives
  slug: Learning-Objectives-2082
  type: plain
- title: Between-Subjects Experiments
  slug: Between-Subjects-Experiments-4604
  type: regular
  headings:
  - level: 3
    slug: random-assignment
    title: Random Assignment
- title: Matched Groups
  slug: Matched-Groups-4605
  type: regular
  headings:
  - level: 3
    slug: matched-groups
    title: Matched Groups
- title: Within-Subject Experiments
  slug: Within-Subject-Experiments-4606
  type: regular
- title: Carryover Effects
  slug: Carryover-Effects-4607
  type: regular
  headings:
  - level: 3
    slug: carryover-effects-and-counterbalancing
    title: Carryover Effects and Counterbalancing
- title: Simultaneous Within-Subjects Designs
  slug: Simultaneous-Within-Subjects-Designs-4608
  type: regular
  headings:
  - level: 3
    slug: simultaneous-within-subjects-designs
    title: Simultaneous Within-Subjects Designs
- title: Between-Subjects or Within-Subjects?
  slug: Between-Subjects-or-Within-Subjects?-4609
  type: regular
- title: References
  slug: References-2083
  type: plain
cri:
- question: What is random assignment and why is it important in experimental research?
  answer: Random assignment is using a random process to decide which participants are tested in which conditions, and it is crucial for controlling extraneous variables across conditions in experimental research.
  slug: Between-Subjects-Experiments-4604
- question: What is the purpose of using a matched-groups design in an experiment?
  answer: To ensure that participants in different conditions are matched on certain variables to prevent confounding variables from affecting the results.
  slug: Matched-Groups-4605
- question: What is the primary advantage of using a within-subjects experiment design?
  answer: It provides maximum control of extraneous participant variables and makes the data less 'noisy' for easier detection of the effect of the independent variable.
  slug: Within-Subject-Experiments-4606
- question: What is counterbalancing and how does it help address order effects in within-subjects designs?
  answer: Counterbalancing involves testing different participants in different orders to control the order of conditions as a confounding variable and make it possible to detect carryover effects.
  slug: Carryover-Effects-4607
- question: What is a simultaneous within-subjects design?
  answer: A design where conditions are randomized within a single block of time rather than in counterbalanced blocks.
  slug: Simultaneous-Within-Subjects-Designs-4608
- question: What is a good rule of thumb when choosing between a between-subjects and within-subjects experiment design?
  answer: If it is possible to conduct a within-subjects experiment in the time available per participant and there are no serious concerns about carryover effects that can't be handled with counterbalancing, then that design is likely the best option; otherwise, a between-subjects design should be considered.
  slug: Between-Subjects-or-Within-Subjects?-4609
next_slug: null
order: 25
parent:
  title: V. Experimental Methods
  slug: experimental-methods
quiz: null
slug: page
title: 24. Experimental Design
---

## Learning Objectives {#Learning-Objectives-2082 .sr-only} 

<i-callout variant="info" title="Learning Objectives">

1\. Explain the difference between between-subjects and within-subjects experiments, list some of the pros and cons of each approach, and decide which approach to use to answer a particular research question.

2\. Define random assignment, distinguish it from random sampling, explain its purpose in experimental research, and use some simple strategies to implement it.

3\. Define several types of carryover effect, give examples of each, and explain how counterbalancing helps to deal with them.

</i-callout>

In this section, we look at some different ways to design an experiment. The primary distinction we will make is between approaches in which each participant experiences one level of the independent variable and approaches in which each participant experiences all levels of the independent variable. The former are called between-subjects experiments and the latter are called within-subjects experiments.

## Between-Subjects Experiments {#Between-Subjects-Experiments-4604} 

In a [**between-subjects experiment**](https://kpu.pressbooks.pub/psychmethods4e/chapter/experimental-design/#term_63_1020), each participant is tested in only one condition. For example, a researcher with a sample of 100 university students might assign half of them to write about a traumatic event and the other half write about a neutral event. Or a researcher with a sample of 60 people with severe agoraphobia (fear of open spaces) might assign 20 of them to receive each of three different treatments for that disorder. It is essential in a between-subjects experiment that the researcher assigns participants to conditions so that the different groups are, on average, highly similar to each other. Those in a trauma condition and a neutral condition, for example, should include a similar proportion of men and women, and they should have similar average IQs, similar average levels of motivation, similar average numbers of health problems, and so on. This matching is a matter of controlling these extraneous participant variables across conditions so that they do not become confounding variables.

### Random Assignment {#random-assignment}

The primary way that researchers accomplish this kind of control of extraneous variables across conditions is called [**random assignment**](https://kpu.pressbooks.pub/psychmethods4e/chapter/experimental-design/#term_63_1021), which means using a random process to decide which participants are tested in which conditions. Do not confuse random assignment with random sampling. Random sampling is a method for selecting a sample from a population, and it is rarely used in psychological research. Random assignment is a method for assigning participants in a sample to the different conditions, and it is an important element of all experimental research in psychology and other fields too.

In its strictest sense, random assignment should meet two criteria. One is that each participant has an equal chance of being assigned to each condition (e.g., a 50% chance of being assigned to each of two conditions). The second is that each participant is assigned to a condition independently of other participants. Thus one way to assign participants to two conditions would be to flip a coin for each one. If the coin lands heads, the participant is assigned to Condition A, and if it lands tails, the participant is assigned to Condition B. For three conditions, one could use a computer to generate a random integer from 1 to 3 for each participant. If the integer is 1, the participant is assigned to Condition A; if it is 2, the participant is assigned to Condition B; and if it is 3, the participant is assigned to Condition C. In practice, a full sequence of conditions—one for each participant expected to be in the experiment—is usually created ahead of time, and each new participant is assigned to the next condition in the sequence as they are tested. When the procedure is computerized, the computer program often handles the random assignment.

One problem with coin flipping and other strict procedures for random assignment is that they are likely to result in unequal sample sizes in the different conditions. Unequal sample sizes are generally not a serious problem, and you should never throw away data you have already collected to achieve equal sample sizes. However, for a fixed number of participants, it is statistically most efficient to divide them into equal-sized groups. It is standard practice, therefore, to use a kind of modified random assignment that keeps the number of participants in each group as similar as possible. One approach is [**block randomization**](https://kpu.pressbooks.pub/psychmethods4e/chapter/experimental-design/#term_63_1022). In block randomization, all the conditions occur once in the sequence before any of them is repeated. Then they all occur again before any of them is repeated again. Within each of these “blocks,” the conditions occur in a random order. Again, the sequence of conditions is usually generated before any participants are tested, and each new participant is assigned to the next condition in the sequence. Table 5.2 shows such a sequence for assigning nine participants to three conditions. The Research Randomizer website ([http://www.randomizer.org](https://www.google.com/url?q=http://www.randomizer.org/&sa=D&usg=AFQjCNH_FpOxIlkMjNqZHpXAd30V-I27HA)) will generate block randomization sequences for any number of participants and conditions. Again, when the procedure is computerized, the computer program often handles the block randomization.

|     |     |
| --- | --- |
| **Participant** | **Condition** |
| **1** | **A** |
| **2** | **C** |
| **3** | **B** |
| 4   | B   |
| 5   | C   |
| 6   | A   |
| **7** | **C** |
| **8** | **B** |
| **9** | **A** |

_**Table 5.2 Block Randomization Sequence for Assigning Nine Participants to Three Conditions**_

Random assignment is not guaranteed to control all extraneous variables across conditions. The process is random, so it is always possible that just by chance, the participants in one condition might turn out to be substantially older, less tired, more motivated, or less depressed on average than the participants in another condition. However, there are some reasons that this possibility is not a major concern. One is that random assignment works better than one might expect, especially for large samples. Another is that the inferential statistics that researchers use to decide whether a difference between groups reflects a difference in the population takes the “fallibility” of random assignment into account. Yet another reason is that even if random assignment does result in a confounding variable and therefore produces misleading results, this confound is likely to be detected when the experiment is replicated. The upshot is that random assignment to conditions—although not infallible in terms of controlling extraneous variables—is always considered a strength of a research design.

## Matched Groups {#Matched-Groups-4605 .sr-only} 

### Matched Groups {#matched-groups}

An alternative to simple random assignment of participants to conditions is the use of a [**matched-groups design**](https://kpu.pressbooks.pub/psychmethods4e/chapter/experimental-design/#term_63_1023). Using this design, participants in the various conditions are matched on the dependent variable or on some extraneous variable(s) prior the manipulation of the independent variable. This guarantees that these variables will not be confounded across the experimental conditions. For instance, if we want to determine whether expressive writing affects people’s health then we could start by measuring various health-related variables in our prospective research participants. We could then use that information to rank-order participants according to how healthy or unhealthy they are. Next, the two healthiest participants would be randomly assigned to complete different conditions (one would be randomly assigned to the traumatic experiences writing condition and the other to the neutral writing condition). The next two healthiest participants would then be randomly assigned to complete different conditions, and so on until the two least healthy participants. This method would ensure that participants in the traumatic experiences writing condition are matched to participants in the neutral writing condition with respect to health at the beginning of the study. If at the end of the experiment, a difference in health was detected across the two conditions, then we would know that it is due to the writing manipulation and not to pre-existing differences in health.

## Within-Subject Experiments {#Within-Subject-Experiments-4606} 

In a [**within-subjects experiment**](https://kpu.pressbooks.pub/psychmethods4e/chapter/experimental-design/#term_63_1024), each participant is tested under all conditions. Consider an experiment on the effect of a defendant’s physical attractiveness on judgments of his guilt. Again, in a between-subjects experiment, one group of participants would be shown an attractive defendant and asked to judge his guilt, and another group of participants would be shown an unattractive defendant and asked to judge his guilt. In a within-subjects experiment, however, the same group of participants would judge the guilt of both an attractive and an unattractive defendant.

The primary advantage of this approach is that it provides maximum control of extraneous participant variables. Participants in all conditions have the same mean IQ, same socioeconomic status, same number of siblings, and so on—because they are the very same people. Within-subjects experiments also make it possible to use statistical procedures that remove the effect of these extraneous participant variables on the dependent variable and therefore make the data less “noisy” and the effect of the independent variable easier to detect. We will look more closely at this idea later in the book.  However, not all experiments can use a within-subjects design nor would it be desirable to do so.

## Carryover Effects {#Carryover-Effects-4607 .sr-only} 

### Carryover Effects and Counterbalancing {#carryover-effects-and-counterbalancing}

The primary disadvantage of within-subjects designs is that they can result in order effects. An [**order effect**](https://kpu.pressbooks.pub/psychmethods4e/chapter/experimental-design/#term_63_1025)occurs when participants’ responses in the various conditions are affected by the order of conditions to which they were exposed. One type of order effect is a carryover effect. A [**carryover effect**](https://kpu.pressbooks.pub/psychmethods4e/chapter/experimental-design/#term_63_1028) is an effect of being tested in one condition on participants’ behavior in later conditions. One type of carryover effect is a [**practice effect**](https://kpu.pressbooks.pub/psychmethods4e/chapter/experimental-design/#term_63_1029), where participants perform a task better in later conditions because they have had a chance to practice it. Another type is a [**fatigue effect**](https://kpu.pressbooks.pub/psychmethods4e/chapter/experimental-design/#term_63_1030), where participants perform a task worse in later conditions because they become tired or bored. Being tested in one condition can also change how participants perceive stimuli or interpret their task in later conditions. This type of effect is called a [**context effect (or contrast effect)**](https://kpu.pressbooks.pub/psychmethods4e/chapter/experimental-design/#term_63_1031). For example, an average-looking defendant might be judged more harshly when participants have just judged an attractive defendant than when they have just judged an unattractive defendant. Within-subjects experiments also make it easier for participants to guess the hypothesis. For example, a participant who is asked to judge the guilt of an attractive defendant and then is asked to judge the guilt of an unattractive defendant is likely to guess that the hypothesis is that defendant attractiveness affects judgments of guilt. This knowledge could lead the participant to judge the unattractive defendant more harshly because he thinks this is what he is expected to do. Or it could make participants judge the two defendants similarly in an effort to be “fair.”

Carryover effects can be interesting in their own right. (Does the attractiveness of one person depend on the attractiveness of other people that we have seen recently?) But when they are not the focus of the research, carryover effects can be problematic. Imagine, for example, that participants judge the guilt of an attractive defendant and then judge the guilt of an unattractive defendant. If they judge the unattractive defendant more harshly, this might be because of his unattractiveness. But it could be instead that they judge him more harshly because they are becoming bored or tired. In other words, the order of the conditions is a confounding variable. The attractive condition is always the first condition and the unattractive condition the second. Thus any difference between the conditions in terms of the dependent variable could be caused by the order of the conditions and not the independent variable itself.

There is a solution to the problem of order effects, however, that can be used in many situations. It is [**counterbalancing**](https://kpu.pressbooks.pub/psychmethods4e/chapter/experimental-design/#term_63_1032), which means testing different participants in different orders. The best method of counterbalancing is [**complete counterbalancing**](https://kpu.pressbooks.pub/psychmethods4e/chapter/experimental-design/#term_63_1033)in which an equal number of participants complete each possible order of conditions. For example, half of the participants would be tested in the attractive defendant condition followed by the unattractive defendant condition, and others half would be tested in the unattractive condition followed by the attractive condition. With three conditions, there would be six different orders (ABC, ACB, BAC, BCA, CAB, and CBA), so some participants would be tested in each of the six orders. With four conditions, there would be 24 different orders; with five conditions there would be 120 possible orders. With counterbalancing, participants are assigned to orders randomly, using the techniques we have already discussed. Thus, random assignment plays an important role in within-subjects designs just as in between-subjects designs. Here, instead of randomly assigning to conditions, they are randomly assigned to different orders of conditions. In fact, it can safely be said that if a study does not involve random assignment in one form or another, it is not an experiment.

A more efficient way of counterbalancing is through a Latin square design which randomizes through having equal rows and columns. For example, if you have four treatments, you must have four versions. Like a Sudoku puzzle, no treatment can repeat in a row or column. For four versions of four treatments, the Latin square design would look like:

|     |     |     |     |
| --- | --- | --- | --- |
| A   | B   | C   | D   |
| B   | C   | D   | A   |
| C   | D   | A   | B   |
| D   | A   | B   | C   |

You can see in the diagram above that the square has been constructed to ensure that each condition appears at each ordinal position (A appears first once, second once, third once, and fourth once) and each condition precedes and follows each other condition one time. A Latin square for an experiment with 6 conditions would by 6 x 6 in dimension, one for an experiment with 8 conditions would be 8 x 8 in dimension, and so on. So while complete counterbalancing of 6 conditions would require 720 orders, a Latin square would only require 6 orders.

Finally, when the number of conditions is large experiments can use [**random counterbalancing **](https://kpu.pressbooks.pub/psychmethods4e/chapter/experimental-design/#term_63_1034)in which the order of the conditions is randomly determined for each participant. Using this technique every possible order of conditions is determined and then one of these orders is randomly selected for each participant. This is not as powerful a technique as complete counterbalancing or partial counterbalancing using a Latin squares design. Use of random counterbalancing will result in more random error, but if order effects are likely to be small and the number of conditions is large, this is an option available to researchers.

There are two ways to think about what counterbalancing accomplishes. One is that it controls the order of conditions so that it is no longer a confounding variable. Instead of the attractive condition always being first and the unattractive condition always being second, the attractive condition comes first for some participants and second for others. Likewise, the unattractive condition comes first for some participants and second for others. Thus any overall difference in the dependent variable between the two conditions cannot have been caused by the order of conditions. A second way to think about what counterbalancing accomplishes is that if there are carryover effects, it makes it possible to detect them. One can analyze the data separately for each order to see whether it had an effect.

## Simultaneous Within-Subjects Designs {#Simultaneous-Within-Subjects-Designs-4608 .sr-only} 

### Simultaneous Within-Subjects Designs {#simultaneous-within-subjects-designs}

So far, we have discussed an approach to within-subjects designs in which participants are tested in one condition at a time, across counterbalanced blocks. There is another approach, however, that is often used when participants make multiple responses in each condition. Imagine, for example, that participants judge the guilt of 10 attractive defendants and 10 unattractive defendants. Instead of having people make judgments about all 10 defendants of one type followed by all 10 defendants of the other type, the researcher could present all 20 defendants in a sequence that mixed the two types. The researcher could then compute each participant’s mean rating for each type of defendant. Or imagine an experiment designed to see whether people with social anxiety disorder remember negative adjectives (e.g., “stupid,” “incompetent”) better than positive ones (e.g., “happy,” “productive”). The researcher could have participants study a single list that includes both kinds of words and then have them try to recall as many words as possible. The researcher could then count the number of each type of word that was recalled. This type of design is called a simultaneous within-subject design because the conditions are randomized within a single block of time (simultaneously), rather than in counterbalanced blocks.

## Between-Subjects or Within-Subjects? {#Between-Subjects-or-Within-Subjects?-4609} 

Almost every experiment can be conducted using either a between-subjects design or a within-subjects design. This possibility means that researchers must choose between the two approaches based on their relative merits for the particular situation.

Between-subjects experiments have the advantage of being conceptually simpler and requiring less testing time per participant. They also avoid carryover effects without the need for counterbalancing. Within-subjects experiments have the advantage of controlling extraneous participant variables, which generally reduces noise in the data and makes it easier to detect any effect of the independent variable upon the dependent variable. Within-subjects experiments also require fewer participants than between-subjects experiments to detect an effect of the same size.

 

A good rule of thumb, then, is that if it is possible to conduct a within-subjects experiment (with proper counterbalancing) in the time that is available per participant—and you have no serious concerns about carryover effects that can't be handled by counterbalancing—this design is probably the best option. If a within-subjects design would be difficult or impossible to carry out, then you should consider a between-subjects design instead. For example, if you were testing participants in a doctor’s waiting room or shoppers in line at a grocery store, you might not have enough time to test each participant in all conditions and therefore would opt for a between-subjects design. Or imagine you were trying to reduce people’s level of prejudice by having them interact with someone of another race. A within-subjects design with counterbalancing would require testing some participants in the treatment condition first and then in a control condition. But if the treatment works and reduces people’s level of prejudice, then they would no longer be suitable for testing in the control condition. This difficulty is true for many designs that involve a treatment meant to produce long-term change in participants’ behavior (e.g., studies testing the effectiveness of psychotherapy). Clearly, a between-subjects design would be necessary here.

Remember also that using one type of design does not preclude using the other type in a different study. There is no reason that a researcher could not use both a between-subjects design and a within-subjects design to answer the same research question. In fact, professional researchers often take exactly this type of mixed methods approach.

## References {#References-2083} 

1.  Birnbaum, M.H. (1999). How to show that 9>221: Collect judgments in a between-subjects design. _Psychological Methods, 4_(3), 243-249. [↵](https://kpu.pressbooks.pub/psychmethods4e/chapter/experimental-design/#return-footnote-63-1)

