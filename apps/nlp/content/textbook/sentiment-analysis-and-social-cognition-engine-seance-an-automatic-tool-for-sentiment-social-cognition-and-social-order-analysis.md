---
assignments:
- cloze
chunks:
- title: Abstract
  slug: Abstract-5758
  type: regular
- title: Sentiment analysis
  slug: Sentiment-analysis-5759
  type: regular
- title: Approaches to sentiment analysis
  slug: Approaches-to-sentiment-analysis-5760
  type: regular
- title: LIWC
  slug: LIWC-5766
  type: regular
  headings:
  - level: 3
    slug: overview
    title: Overview
  - level: 3
    slug: psychological-processes
    title: Psychological processes
  - level: 3
    slug: personal-concerns
    title: Personal concerns
- title: SEANCE
  slug: SEANCE-5767
  type: regular
  headings:
  - level: 3
    slug: overview
    title: Overview
  - level: 3
    slug: source-databases
    title: Source databases
  - level: 3
    slug: seance-component-scores
    title: SEANCE component scores
- title: Method
  slug: Method-5768
  type: regular
  headings:
  - level: 3
    slug: corpora
    title: Corpora
  - level: 3
    slug: statistical-analysis
    title: Statistical analysis
- title: Results
  slug: Results-5769
  type: regular
  headings:
  - level: 3
    slug: movie-review-corpus
    title: Movie review corpus
  - level: 3
    slug: seance-component-scores
    title: SEANCE component scores
- title: Multi-domain sentiment dataset
  slug: Multi-domain-sentiment-dataset-5770
  type: regular
  headings:
  - level: 3
    slug: liwc-indices
    title: LIWC indices
  - level: 3
    slug: seance-indices
    title: SEANCE indices
  - level: 3
    slug: seance-component-scores
    title: SEANCE component scores
  - level: 3
    slug: anova-comparison-between-models-for-the-amazon-review-corpus
    title: ANOVA comparison between models for the Amazon review corpus
- title: Discussion
  slug: Discussion-5771
  type: regular
- title: Conclusion
  slug: Conclusion-2444
  type: plain
cloze_test:
  original_text: The study introduces SEANCE, a free sentiment analysis tool that examines text for sentiment, cognition, and social order features, operating on various systems without internet dependence. It supports batch processing and includes negation and part-of-speech tagging, offering superior performance over the commercial tool LIWC. The study validates SEANCE using sentiment analysis on movie and Amazon reviews, demonstrating its predictive accuracy and lexical feature insights into emotional states. SEANCE's microfeatures and macrofeatures outperform LIWC in classifying positive and negative reviews, suggesting its broader applicability for researchers in diverse fields interested in sentiment analysis, discourse processing, and language assessment.
  gaps:
  - start: 208
    end: 218
    gapped_text: processing
    original_word: null
  - start: 260
    end: 267
    gapped_text: tagging
    original_word: null
  - start: 319
    end: 323
    gapped_text: tool
    original_word: null
  - start: 363
    end: 372
    gapped_text: sentiment
    original_word: null
  - start: 429
    end: 439
    gapped_text: predictive
    original_word: null
  - start: 493
    end: 499
    gapped_text: states
    original_word: null
  - start: 561
    end: 572
    gapped_text: classifying
    original_word: null
  - start: 619
    end: 626
    gapped_text: broader
    original_word: null
  - start: 709
    end: 718
    gapped_text: discourse
    original_word: null
cri:
- question: What are some key features of the Sentiment Analysis and Cognition Engine (SEANCE)?
  answer: SEANCE is a freely available text analysis tool that works on most operating systems, is housed on a user's hard drive, includes negation and part-of-speech features, and reports on thousands of lexical categories and 20 component scores related to sentiment, social cognition, and social order.
  slug: Abstract-5758
- question: What are some applications of sentiment analysis mentioned in the passage?
  answer: Some applications of sentiment analysis mentioned in the passage include question-answering systems, text summarization, automating decision-making in organizations, understanding financial markets, corporate sales, economic systems, medical discourse, politics, and educational discourse.
  slug: Sentiment-analysis-5759
- question: What are some examples of domain-independent sentiment dictionaries?
  answer: General Inquirer, SenticNet, SO-CAL, and EmoLex.
  slug: Approaches-to-sentiment-analysis-5760
- question: What are the two main categories that LIWC reports on related to psychological processes and personal concerns?
  answer: LIWC reports on psychological processes and personal concerns.
  slug: LIWC-5766
- question: What is SEANCE's interface like?
  answer: The SEANCE interface is an easy-to-use and intuitive graphical user interface (GUI) that requires the user to select an input folder containing the files of interest (in .txt format).
  slug: SEANCE-5767
- question: What was the goal of the statistical analysis conducted on the Movie Review Corpus and the Multi-Domain Sentiment Dataset?
  answer: To examine the differences between positive and negative reviews to create a model for classifying reviews as positive or negative.
  slug: Method-5768
- question: What was the accuracy rate of the DFA using the 46 significant indices from the SEANCE MANOVA analysis?
  answer: The accuracy rate was 85.0%.
  slug: Results-5769
- question: Which feature set was significantly better at classifying Amazon reviews in the ANOVA comparison between models for the Amazon review corpus?
  answer: The SEANCE indices model was significantly better at classifying Amazon reviews than either the SEANCE component score model or the LIWC indices model.
  slug: Multi-domain-sentiment-dataset-5770
- question: What were the findings of the study regarding the comparison between SEANCE and LIWC in sentiment analysis tasks?
  answer: SEANCE outperformed LIWC in classic sentiment analysis tasks, with both microfeatures and component scores showing statistically better performance.
  slug: Discussion-5771
next_slug: vances-in-transformation-based-part-of-speech-tagging
order: 1
parent: null
quiz: null
slug: sentiment-analysis-and-social-cognition-engine-seance-an-automatic-tool-for-sentiment-social-cognition-and-social-order-analysis
title: 'Sentiment Analysis and Social Cognition Engine (SEANCE): An automatic tool for sentiment, social cognition, and social-order analysis'
---

## Abstract {#Abstract-5758} 

This study introduces the Sentiment Analysis and Cognition Engine (SEANCE), a freely available text analysis tool that is easy to use, works on most operating systems (Windows, Mac, Linux), is housed on a user’s hard drive (as compared to being accessed via an Internet interface), allows for batch processing of text files, includes negation and part-of-speech (POS) features, and reports on thousands of lexical categories and 20 component scores related to sentiment, social cognition, and social order. In the study, we validated SEANCE by investigating whether its indices and related component scores can be used to classify positive and negative reviews in two well-known sentiment analysis test corpora. We contrasted the results of SEANCE with those from. Linguistic Inquiry and Word Count (LIWC), a similar tool that is popular in sentiment analysis, but is pay-to-use and does not include negation or POS features. The results demonstrated that both the SEANCE indices and component scores outperformed LIWC on the categorization tasks.

**Keywords**

Sentiment analysis . Affect detection . Opinion mining . Natural language processing . Automatic tools . Corpus linguistics

The analysis of sentiment is an important component of a number of research disciplines, including psychology, education, sociology, business, political science, and economics.

Measuring sentiment features automatically in a text is thus of value, to better understand how emotions, feelings, affect, and opinions influence cognition, economic choices, learner engagement, and political affiliation. However, the freely available natural language processing (NLP) tools that measure linguistic features related to sentiment, cognition, and social order are limited. The best-known example of an available sentiment analysis tool is Linguistic Inquiry and Word Count (LIWC), which comprises a number of dictionaries that capture conscious and unconscious psychological phenomena related to cognition, affect, and personal concerns. LIWC has proven extremely useful in a number of different disciplines and has had a large impact on our understanding of how lexical elements related to cognition, affect, and personal concerns can be used to better understand human behavior. However, it has several shortcomings with regard to usability and to the facile and broad measurements of its dictionaries. First, LIWC is not freely available (it costs a modest fee). Second, the LIWC indices are based on simple word counts (some of which are populated by fewer than eight words), and the program does not take into consideration issues of valence such as negations, nor part-of-speech (POS) tags, both of which can have important impacts on sentiment analysis. In addition, the indices reported by LIWC are standalone and do not report on larger constructs related to sentiment.

This article introduces a new sentiment analysis tool called the Sentiment Analysis and Cognition Engine (SEANCE). SEANCE is a freely available text analysis tool that incorporates a number of freely available sentiment dictionaries. The tool is easy to use, works on most operating systems (Windows, Mac, and Linux), is housed on a user’s hard drive, allows for batch processing of text files, includes text negation indices and a POS tagger, and reports on a number of component scores specifically developed to make text interpretation easier. In total, the tool reports on over 3,000 classic and recently developed micro-indices and 20 macro-indices related to sentiment, cognition, and social-order analysis.

In this study, we demonstrate the utility of the sentiment, cognition, and social-order indices provided by SEANCE, with a focus on the domain of positive and negative reviews in two corpora across five domains. We examine the degree to which the features reported by SEANCE are able to predict whether a review is positive or negative, and compare this with the predictive ability of LIWC indices. The reviews used in this study include the 2,000 positive and negative movie reviews collected by Pang and Lee (2004) and the Multi-Domain Sentiment Dataset, which comprises 8,000 Amazon product reviews across four domains: books, DVDs, electronics, and kitchen appliances (Blitzer, Dredze, & Pereira, 2007). These reviews have served as a gold standard for many sentiment analysis investigations. The analyses conducted in this study allow us not only to introduce SEANCE and validate the tool (i.e., by testing its predictive validity in assessing positive and negative writing samples), but to also compare the tool to the current state of the art (LIWC) as well as to examine how lexical features in text are related to the affective state of that text.

## Sentiment analysis {#Sentiment-analysis-5759} 

The automatic extraction of semantic information related to human feelings and opinions and the subsequent analysis of texts based on this information is categorized under a number of umbrella terms, including subjectivity (Langacker, 1985; Lyons, 1981), opinion mining (Pang & Lee, 2008), emotion (Collins, Ortony, & Clore, 1988; Ketai, 1975), affect (Batson, Shaw, & Oleson, 1992), and sentiment analysis (Pang & Lee, 2008). Sentiment is widely associated with feelings, emotions, and opinion, and the term sentiment analysis is commonly used as a general term related to extracting subjective information related to human feelings and opinions from natural language texts (Hutto & Gilbert, 2014; Liu, 2012; Pang & Lee, 2008). Sentiment analysis is a useful approach to a number of different problems posed across a number of different disciplines, such as psychology, education, sociology, business, political science, and economics (Hutto & Gilbert, 2014), as well as research fields such as NLP, data mining, and information retrieval (Zhang, Gan, & Jiang, 2014). 

The foundations for sentiment analysis can be found in NLP techniques (Hutto & Gilbert, 2014), which can be used to determine the polarity of text segments (sentences, phrases, or whole texts) on the basis of a binary classification of positive or negative affect. Thus, what is being discussed is not the focus of sentiment analysis, but rather the sentiment toward the topics of discussion (Hogenboom, Boon, & Frasincar, 2012).

There are numerous applications of sentiment analysis. For instance, in question-answering systems, knowing the opinions of different sources can provide better answers to users (Stoyanov, Cardie, Litman, & Wiebe, 2006; H. Yu & Hatzivassiloglou, 2003). In text summarization, sentiment analysis can be used to label and summarize reviews, articles, and blogs (Pang, Lee, & Vaithyanathan, 2002). Sentiment analysis is also helpful in automating decision making by helping organizations better understand the effects of specific issues on people’s perceptions and responding to these effects appropriately through marketing and communication (Sauter, 2011). Sentiment analysis is also important to understanding financial markets (Schumaker, Zhang, Huang, & Chen, 2012; Yu, Duan, & Cao, 2013), corporate sales (Ghose & Ipeirotis, 2011; Yu, Liu, Huang, & An, 2012), economic systems (Ludvigson, 2004), medical discourse (De Choudhury, Gamon, Counts, & Horvitz, 2013), politics (Baron, 2005; Tumasjan, Sprenger, Sandner, & Welpe, 2010), and educational discourse (D’Mello & Graesser, 2012).

## Approaches to sentiment analysis {#Approaches-to-sentiment-analysis-5760} 

Generally speaking, sentiment analysis uses bag-of-words vector representations to denote unordered collections of words and phrases that occur in a text of interest. These vector representations are used in machine-learning algorithms that find patterns of sentiment used to classify texts on the basis of polarity (generally positive or negative texts). Additionally, the vectors can contain information related to semantic valence (e.g., negation and intensification; Polanyi & Zaenen, 2006) and POS tags (Hogenboom et al., 2012). There are two basic approaches to developing these vectors. The first is domain-dependent (also referred to as a text classification approach), wherein the vectors are developed and tested within a specific corpus drawn from a specific domain (i.e., a movie review corpus). The second is domain-independent (also referred to as a lexical-based approach), in which vectors are developed on the basis of general lists of sentiment words and phrases that can be applied to a number of different domains (Hogenboom et al., 2012).

Domain-dependent approaches involve the development of supervised text classification algorithms from labeled instances of texts (Pang et al., 2002). The approach usually follows a three-step pattern. First, texts are queried for words and phrases (i.e., n-grams) that express sentiment. This is sometimes done on the basis of POS tags, but not always. The most successful features in such an approach tend to be basic unigrams (Pang et al., 2002; Salvetti, Reichenbach, & Lewis, 2006). Next, the semantic orientations of the words and phrases are estimated by calculating the pointwise mutual information (i.e., co-occurrence patterns) of the words within the corpus in order to classify the words on the basis of polarity (i.e., positive or negative). The occurrences of these words and phrases are then computed for each text in the corpus and used as predictors in a machine-learning algorithm to classify the texts as either positive or negative (Turney, 2002). 

Classifiers built using supervised methods are generally quite accurate in classifying texts on the basis of polarity within the domain for which they were developed (Bartlett & Albright, 2008; Boiy et al., 2007; Chaovalit & Zhou, 2005; Kennedy & Inkpen, 2006). The problem with such classifiers is that although they perform strongly for the domain in which they were trained, their performance strongly drops (almost to chance) when they are used in different domains (Aue & Gamon, 2005), topics, and even time periods (Read, 2005). For instance, Brooke (2009) extracted the 100 most positive and negative unigrams from the Polarity Dataset of 2,000 movie reviews. Although many of the unigrams were related to positive and negative terms, many were not. For instance, if the plot, director, or writer was mentioned, the review was more often negative. In contrast, unigrams related to the movie’s ending or its flaws were predictive of positive movie reviews. Names were also predictive of negative reviews (as was also reported by Finn & Kushmerick, 2003, and Kennedy & Inkpen, 2006), as were words such as video, TV , and series. These terms, when used to examine polarity in different datasets, are less meaningful.

Knowing that domain-dependent methods do not perform well in other domains (Aue & Gamon, 2005), a number of methods have been proposed to create sentiment analysis approaches that offer greater portability. The most common approach is to leverage general word and phrase vectors that are categorized on the basis of associated sentiment and obtained from domain-independent sources, such as corpora, dictionaries, or the Internet (Andreevskaia & Bergler, 2008; Hogenboom, Hogenboom, Kaymak, Wouters, & De Jong, 2010). Like the domain-dependent methods, this approach uses lexicon-based vectors to calculate the orientation of documents on the basis of the aggregation of the individual word scores (Turney, 2002). Such approaches have gained attention in more recent research because their performance is robust across texts and domains (Heerschop, van Iterson, Hogenboom, Frasincar, & Kaymak, 2011; Hogenboom et al., 2012; Taboada, Brooke, Tofiloski, Voll, & Stede, 2011), and they can be easily enhanced with the inclusion of multiple dictionaries (Taboada, Brooke, & Stede, 2009). 

A number of domain-independent sentiment dictionaries are publicly available for use, such as General Inquirer (Stone, Dunphy, Smith, Ogilvie, et al., 1966), SenticNet (Cambria, Havasi, & Hussain, 2012; Cambria, Speer, Havasi, & Hussain, 2010), SO-CAL (Taboada et al., 2009), and EmoLex (Mohammad & Turney, 2010, 2013). These dic- tionaries usually consist of word vectors that are manually annotated for corresponding polarities, semantic categories, social positioning, or cognitive perspective. Although these dictionaries perform worse than domain-specific models trained on sufficiently large corpora (Pang et al., 2002), they outperform domain-specific classifiers in out-of-domain training sets or when the training sets are small (Andreevskaia & Bergler, 2008). They also perform well on a number of different domains and texts types. For instance, SO-CAL has proven robust for identifying sentiment in video game reviews (Brooke & Hurst, 2009) and blog postings (Murray and Carenini, 2009).

## LIWC {#LIWC-5766} 

### Overview {#overview}

LIWC is a sentiment analysis tool that is easy to use, transparent, fast, and accurate. As a result, it has been widely used by sociologists, psychologists, computer scientists, and linguists in a number of education and social media domains (Hutto & Gilbert, 2014; Pennebaker, Chung, Ireland, Gonzales, & Booth, 2007; Pennebaker, Francis, & Booth, 2001). LIWC is available for a small fee ($90, at the time of writing) and, once purchased, is housed on the user’s hard drive, allowing for secure data processing in the absence of an Internet connection. LIWC was designed to capture conscious and unconscious psychological phenomena related to cognition, affect, and personal concerns. The LIWC dictionary is proprietary and contains about 4,500 words. The word lists that comprise the LIWC dictionary include words that had been compiled from previous lists, thesauri, and dictionaries by researchers and confirmed as construct-relevant by three to six independent judges. The initial word lists were refined through corpus analysis, and new lists were added (Pennebaker et al., 2007; Tausczik & Pennebaker, 2010). LIWC has been used in hundreds of studies to investigate constructs such as social status (Sexton & Helmreich, 2000), deception (Newman, Pennebaker, Berry, & Richards, 2003), and individual differences (Mehl, Gosling, & Pennebaker, 2006). LIWC is not sensitive to POS tags and does not make use of valence markers such as negations. The LIWC software provides information on the percentage of words per text that are covered by its internal dictionary and the percentage of words per text in each of the 80 categories on which it reports. For a complete listing of the categories, see Pennebaker et al. (2007). A brief overview of the sentiment, cognition, and social-order categories reported by LIWC is included below.

### Psychological processes {#psychological-processes}

Psychological-processes categories form the heart of LIWC and comprise 32 word categories. These indices can provide information about the psychological states of writers. The psychological-processes category is subdivided into social, affective, cognitive, perceptual, and biological processes, as well as relativity (motion, space, and time) subcategories. Each subcategory reports a number of variables, all based on word lists. 

### Personal concerns {#personal-concerns}

LIWC reports on seven lexical categories related to personal concerns. These categories include lists of words related to one’s personal life. The categories include work, achievement, leisure, home, money, religion, and death.

## SEANCE {#SEANCE-5767} 

### Overview {#overview}

SEANCE is a sentiment analysis tool that relies on a number of preexisting sentiment, social-positioning, and cognition dictionaries. Like LIWC, SEANCE is housed on the user’s hard drive, allowing users to work independently of outside servers, which allows for secure processing of sensitive data. Unlike LIWC, SEANCE is freely available and includes negation rules, POS tagging, and broad component scores. SEANCE is written in Python but is implemented in a way that requires little to no knowledge of programming, and it can be started by simply double-clicking the SEANCE icon. The SEANCE interface is an easy-to-use and intuitive graphical user interface (GUI) that requires the user to select an input folder containing the files of interest (in .txt format). The user then selects an output folder for the output file and enters a name for a .csv file into which SEANCE will write the results for each text (the default name is results.csv). The user then selects to process the texts, and a program status box informs the user of how many texts have been processed (see Fig. 1 for the SEANCE GUI). Instructions and explanations for using SEANCE, a user help file, and the program itself are available at www.kristopherkyle.com/ seance.html. 

SEANCE contains a number of predeveloped word vectors developed to measure sentiment, cognition, and social order. These vectors are taken from freely available source databases, including SenticNet (Cambria et al., 2012; Cambria et al., 2010) and EmoLex (Mohammad & Turney, 2010, 2013). In some cases, the vectors are populated by a small number of words and should be used only on larger texts that provide greater linguistic coverage, to avoid nonnormal distributions of data (e.g., the Lasswell dictionary lists \[Lasswell & Namenwirth, 1969\] and the Geneva Affect Label Coder \[GALC; Scherer, 2005\] lists). For many of these vectors, SEANCE also provides a negation feature (i.e., a contextual valence shifter; Polanyi & Zaenen, 2006) that ignores positive terms that are negated. The negation feature, which is based on Hutto and Gilbert (2014), checks for negation words in the three words preceding a target word. In SEANCE, any target word that is negated is ignored within the category of interest. For example, if SEANCE processes the sentence He is not happy, the lexical item happy will not be counted as a positive emotion word. This method has been shown to identify approximately 90 % of negated words (Hutto & Gilbert, 2014). SEANCE also includes the Stanford POS tagger (Toutanova, Klein, Manning, & Singer, 2003) as implemented in Stanford CoreNLP (Manning et al., 2014). The POS tagger allows for POS-tagged specific indices for nouns, verbs, and adjectives. POS tagging is an important component of sentiment analysis, because unique aspects of sentiment may be conveyed more strongly by adjectives (Hatzivassiloglou & McKeown, 1997; Hu & Liu, 2004; Taboada, Anthony, & Voll, 2006) or verbs and adverbs (Benamara, Cesarano, Picariello, Reforgiato, & Subrahmanian, 2007; Sokolova & Lapalme, 2009; Subrahmanian & Reforgiato, 2008). SEANCE reports on both POS and non-POS variables. Many of the vectors in SEANCE, for example, are neutral with regard to POS. This allows for SEANCE to accurately process poorly formatted texts that cannot be accurately analyzed by a POS tagger. We briefly discuss below the source databases used in SEANCE. Table 1 provides an overview of the categories reported in SEANCE and the source databases that report on each category.

<i-image
  style="aspect-ratio:642/890;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/8 Figure 1-b750fa088036a319a993cc025c342022.png"
  alt="8 Figure 1"
  width="642"
  height="890">

Fig. 1 Graphical user interface of SEANCE

</i-image>

<i-image
  style="aspect-ratio:1346/856;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/8 Table 1-ffa13880c6da624c61d6aeb30f76d805.png"
  alt="8 Table 1"
  width="1346"
  height="856">
</i-image>

### Source databases {#source-databases}

#### General inquirer

SEANCE includes the Harvard IV-4 dictionary lists used by the General Inquirer (GI; Stone et al., 1966). The GI lists are the oldest manually constructed lists still in widespread use and include 119 word lists organized into 17 semantic categories, containing over 11,000 words. These categories include semantic dimensions, pleasure, overstatements, institutions, roles, social categories, references to places, references to objects, communication, motivation, cognition, pronouns, assent and negation, and verb and adjective types. The lists were developed for content analysis by social, political, and psychological scientists. Greater detail on the categories and available word lists is available at www. wjh.harvard.edu/~inquirer/homecat.htm.

#### Lasswell

SEANCE also includes the Lasswell dictionary lists (Lasswell & Namenwirth, 1969; Namenwirth & Weber, 1987), which are also included in the GI. Included are 63 word lists organized into nine semantic categories. These categories include power, rectitude, respect, affection, wealth, wellbeing, enlightenment, and skill. Additional information on these categories and their supporting word lists is available at www.wjh.harvard.edu/~inquirer/homecat.htm. 

#### Geneva affect label coder

The GALC is a database composed of lists of words pertaining to 36 specific emotions and two general emotional states (positive and negative; Scherer, 2005). The specific emotion lists include anger, guilt, hatred, hope, joy, and humility. 

#### Affective norms for english words

The Affective Norms for English Words (ANEW) database (Bradley & Lang, 1999) includes affective norms for valence, pleasure, arousal, and dominance (Osgood, Suci, & Tannenbaum, 1957). Unlike the LIWC and GI word lists, ANEW word lists have associated sentiment scores that are positive if the score is above 5 and negative if it is below 5 (and neutral if the score is around 5). Bradley and Lang collected these norms by using the Self-Assessment Manikin system (Lang, 1980) to collect norms for 1,033 English words. 

#### EmoLex

EmoLex (Mohammad & Turney, 2010, 2013) consists of lists of words and bigrams that evoke particular emotions (e.g., anger, anticipation, disgust, fear, joy, sadness, surprise, and trust). Additionally, EmoLex include lists of words and bigrams that generally evoke negative and positive emotions. Word and bigram lists were compiled from entries in the Macquarie Thesaurus (Bernard, 1986) that were also frequent in the Google N-Gram Corpus (Brants & Franz, 2006), the WordNet Affect Lexicon (Strapparava & Valitutti, 2004), and the GI (Stone et al., 1966). Mohammad and Turney then used Amazon Mechanical Turk to determine which emotions (if any) were evoked by each word or bigram. The ten lists each include between 534 (for surprise) and 3,324 (for negative emotions) entries. EmoLex has been used to examine emotions in mail and e-mail (Mohammad & Yang, 2011) and to investigate emotion in fiction writing (Mohammad, 2012). 

#### SenticNet

SenticNet (Cambria et al., 2012; Cambria et al., 2010) is a database extension of WordNet (Fellbaum, 1998) consisting of norms for around 13,000 words with regard to four emotional dimensions (sensitivity, aptitude, attention, and pleasantness), based on work by Plutchik (2001) and norms for polarity. Unlike LIWC, GI, or ANEW, the SenticNet scores were calculated using semisupervised algorithms, and the scores are thus not a gold-standard resource. SenticNet was designed to build and improve upon SentiWordNet (Esuli & Sebastiani, 2006) using a number of data-refining techniques. 

#### Valence aware dictionary for sentiment reasoning

The Valence Aware Dictionary for Sentiment Reasoning (VADER) is a rule-based sentiment analysis system (Hutto & Gilbert, 2014) developed specifically for shorter texts found in social media contexts (e.g., Twitter or Facebook). VADER uses a large list of words and emoticons that include crowdsourced valence ratings. Additionally, the VADER system includes a number of rules that account for changes in valence strength due to punctuation (i.e., exclamation points), capitalization, degree modifiers (e.g., intensifiers), contrastive conjunctions (i.e., but), and negation words that occur within three words before a target word. VADER has been used to accurately classify valence in social media text, movie reviews, product reviews, and newspaper articles (Hutto & Gilbert, 2014). 

#### Hu–Liu polarity

SEANCE includes two large polarity lists compiled by Hu and Liu (2004) for the purposes of sentiment analysis. The Hu–Liu word lists were developed specifically for product reviews and social texts. The positive word list includes 2,006 entries, whereas the negative word list includes 4,783 entries. Both lists were constructed through bootstrapping processes in WordNet. The Hu–Liu lists have been used to successfully predict whether product reviews were positive or negative (Hu & Liu, 2004; Liu, Hu, & Cheng, 2005).

### SEANCE component scores {#seance-component-scores}

One potential pitfall with the SEANCE tool is the sheer number of indices that it reports. With the potential for each index to report results for all words, nouns, verbs, and adjectives, in addition to each of these having the potential to be negated, the SEANCE tool can report on almost 3,000 indices. For the uninitiated such a large number of indices can be unwieldy, and they are also potentially unnecessary because of the overlap between databases. Thus, we developed component scores derived from the SEANCE indices to provide users with more manageable options, if desired, and to investigate the potential of combining similar indices into larger, macrofeatures.

To compute the component scores, we adopted an approach similar to those of Graesser, McNamara, and Kulikowich (2011) and Crossley, Kyle, and McNamara (2015). We conducted a principal component analysis (PCA) to reduce the number of indices selected from SEANCE to a smaller set of components, each of which was composed of a set of related features. The PCA, based on the Movie Review Corpus, clustered the indices into groups that co-occurred frequently, allowing for a large number of variables to be reduced into a smaller set of derived variables (i.e., the components). This gave us two approaches to assessing sentiment: a microfeature approach (i.e., the indices individually) and a macrofeature approach (i.e., the indices aggregated into components).

We set a conservative cutoff for the eigenvalues to be included in a component (i.e., .40), to ensure that only strongly related indices would be included in the analysis. For inclusion in the analysis, all variables needed to be normally distributed. We then controlled for multicollinearity between variables (defined as r ≥ .90), so that the selected variables would not measure the same construct. After conducting the factor analysis, we set a cutoff of 1 % for the variance that needed to be explained by each component included in SEANCE. Components that explained less than 1 % of the variance were removed. For the included component scores, we used the eigenvalues for each included index to create weighted component scores. In total, we developed 20 component scores, which explained 56 % of the variance in the Movie Review Corpus. The 20 components are summarized in Table 2.

<i-image
  style="aspect-ratio:1336/994;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/8 Table 2-938a647f1bafb9da3d771d506929eec4.png"
  alt="8 Table 2"
  width="1336"
  height="994">
</i-image>

## Method {#Method-5768} 

To validate the SEANCE indices and component scores, we examined the relations between the indices calculated by SEANCE for two corpora of reviews: the Movie Review Corpus and the Multi-Domain Sentiment Dataset. In both analyses, we use LIWC as a baseline to compare the reliability of the SEANCE results. The Multi-Domain Sentiment Dataset analysis afforded a chance to examine the generalization of the SEANCE component scores (derived from the Movie Review Corpus) to a broad set of reviews across a variety of domains (book, DVD, electronics, and kitchen appliance reviews).

### Corpora {#corpora}

#### Movie review corpus

This corpus comprises 1,000 positive and 1,000 negative movie reviews collected by Pang and Lee (2004) from the Internet Movie Database (IMDB). The review polarity in this corpus is based on the numerical score given by the reviewer(e.g., a score of 3.5 or higher on a five-point scale is considered positive). This corpus (or portions of it) has been used for a number of sentiment analysis studies that have attempted to classify the reviews as either positive or negative (e.g., Hutto & Gilbert, 2014; Kennedy & Inkpen, 2006). The recent classification accuracies for these studies have ranged from .803 to .872 (Andreevskaia & Bergler,2008; Kennedy & Inkpen, 2006; Pang & Lee, 2004) for domain-dependent classifiers, and from .581 to .764 for domain-independent classifiers (Kennedy & Inkpen, 2006; Taboada et al., 2006).

#### Multi-domain sentiment dataset

This corpus (Blitzer, Dredze, et al., 2007) comprises 2,000 Amazon product reviews across four domains: books, DVDs, electronics, and kitchen appliances (for a total of 8,000 reviews). Each domain includes equal numbers of positive (earning more than three out of five stars) and negative (earning fewer than three stars) product reviews. The dataset has been used in a number of studies (Blitzer, Dredze, et al., 2007; Blitzer, Crammer, Kulesza, Pereira, & Wortman, 2007; Dredze, Crammer, & Pereira, 2008) to investigate domain-adaptive automatic polarity detection. Blitzer, Dredze, et al. (2007) achieved domain-specific prediction accuracies ranging from 80.4 % (books) to 87.7 % (kitchen appliances) by using unigram and bigram predictors. Cross-domain model prediction accuracies have ranged from 68.6 % accuracy (for the kitchen appliances model adapted to books) to 86.8 % accuracy (for the kitchen appliances model adapted to electronics). To our knowledge, no studies have been conducted with the Multi-Domain Sentiment Dataset using domain-independent predictors (such as those found in LIWC and SEANCE).

### Statistical analysis {#statistical-analysis}

Our goal was to examine the differences between positive and negative reviews and to use these differences to create a model that would classify each review as either positive or negative. To accomplish this, we first conducted a multivariate analysis of variance (MANOVA), followed by a stepwise discriminant function analysis (DFA). We did this for each corpus and for the LIWC indices, the SEANCE indices, and the SEANCE component scores. Indices reported by these tools that lacked normal distributions were removed. We used the MANOVA to examine which indices reported differences between the positive and negative reviews (i.e., the LIWC and SEANCE indices were the predictor variables, and the positive and negative classifications were the criterion variables). To control for the Type I errors that result from multiple comparisons, we applied Bonferroni corrections to all of the MANOVA analyses. The MANOVA was followed by a stepwise DFA (Field, 2013; Jarvis, 2011) using the selected indices from each tool that had demonstrated significant differences between the negative and positive reviews after Bonferroni corrections and that did not exhibit multicollinearity (r ≥ .90) with other indices in the set. In the case of multicollinearity, the index demonstrating the largest effect size was retained in the analysis. The DFA provided an algorithm to predict group memberships (i.e., whether the review was positive or negative) through a discriminant function coefficient. A DFA model was first developed for the entire corpus, and the indices from the model were then used to predict group memberships of the reviews, using leave-one-out cross-validation (LOOCV) to ensure that the model was stable across the datasets. To compare prediction accuracies across the three tools, we assigned each review that the DFA predicted correctly a score of 1, and those that were predicted incorrectly a score of 0, across the three feature sets (i.e., the LIWC indices, the SEANCE indices, and the SEANCE component scores). We then conducted a one-way analysis of variance (ANOVA) among the three conditions to examine differences in the prediction accuracies, with the classification scores as the dependent variable and tools as the independent variable. For both the Movie Review Corpus and the Multi-Domain Sentiment Dataset, we conducted ANOVAs for the entire set. In addition, for the Multi-Domain Sentiment Dataset we conducted individual ANOVAs for the DVD reviews, the book reviews, the electronics reviews, and the kitchen appliance reviews.

## Results {#Results-5769} 

### Movie review corpus {#movie-review-corpus}

_LIWC indices_

#### MANOVA

A MANOVA was conducted using the LIWC indices related to psychological processes and personal concerns as the dependent variables and the positive and negative movie reviews in the Movie Review Corpus as the independent variables. The indices were first checked for normal distributions and then assessed using Pearson correlations for multicollinearity. After these assumptions were checked, 27 indices remained that were used in the MANOVA. The MANOVA indicated that 14 of the variables demonstrated significant differences between the positive and negative movie reviews and reported a p value below .001.

#### DFA

We used the 14 significant variables from the MANOVA analysis as our predictor variables in the DFA. For this analysis, the significance level for a variable to be entered or removed from the model was set at p ≤ .05. The stepwise DFA retained nine variables (see Table 3 for the descriptive and MANOVA statistics for these variables), and we removed the remaining variables as nonsignificant predictors. The results demonstrated that the DFA using these nine indices correctly allocated 1,379 of the 2,000 texts in the total set, χ^2 (df = 1, n = 2,000) = 287.331, p < .001, for an accuracy of 69 % (the chance level for this and all other analyses was 50 %). For the LOOCV, the discriminant analysis correctly allocated 1,376 of the 2,000 texts, for an accuracy of 68.8 % (see the confusion matrix reported in Table 4 for the results). The measure of agreement between the actual text types and those assigned by the model produced a weighted Cohen’s Kappa of .379, demonstrating moderate agreement.

![8 Table 3](https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/8%20Table%203-bec3175d024ed85f9d2ae598cbcc196c.png)![8 Table 4](https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/8%20Table%204-22d43481c41ec2165930526ea302ce58.png)

#### _SEANCE indices_

#### MANOVA

A MANOVA was conducted using the SEANCE indices as the dependent variables and the positive and negative reviews in the Movie Review Corpus as the independent variables. After checking normal distributions and multicollinearity, 295 indices remained. These indices were used in the MANOVA. The MANOVA indicated that 290 of these variables demonstrated significant differences between the positive and negative movie reviews. Among these, 206 of the variables had a p value that was below .001.

#### DFA

We used the 206 significant variables from the MANOVA analysis as our predictor variables in the DFA. The stepwise DFA retained 46 variables (see Table 5 for the descriptive and MANOVA statistics for these variables), and we removed the remaining variables as nonsignificant predictors. 

The results demonstrated that the DFA using these 46 indices correctly allocated 1,799 of the 2,000 texts in the total set, χ^2 (df = 1, n = 2,000) = 980.004, p < .001, for an accuracy of 85.0 %. For the LOOCV, the discriminant analysis correctly allocated 1,683 of the 2,000 texts, for an accuracy of 84.2 % (see the confusion matrix reported in Table 6 for the results). The measure of agreement between the actual text types and those assigned by the model produced a weighted Cohen’s Kappa of .700, demonstrating substantial agreement.

<i-image
  style="aspect-ratio:1218/1518;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/8 Table 5-29b63d16dc964074e478e61397a9a558.png"
  alt="8 Table 5"
  width="1218"
  height="1518">
</i-image>

![8 Table 6.png](https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/8%20Table%206.png-9a4b986c231a9fe5ec580944802a0051.png)

### SEANCE component scores {#seance-component-scores}

#### MANOVA

A MANOVA was conducted using the SEANCE indices as the dependent variables and the positive and negative movie reviews in the Movie Review Corpus as the independent variables. All indices were normally distributed, and no multicollinearity (r < .899) was reported between any of the variables. Thus, the 20 component scores were all used in the MANOVA. This analysis indicated that all 20 of the variables demonstrated significant differences (p < .001) between the positive and negative movie reviews.

#### DFA

We used the 20 significant variables from the MANOVA as our predictor variables in the DFA. The stepwise DFA retained ten variables (see Table 7 for the descriptive and MANOVA statistics for these variables), and we removed the remaining variables as nonsignificant predictors.

The results demonstrated that the DFA using these ten component scores correctly allocated 1,495 of the 2,000 texts in the total set, χ^2 (df = 1, n = 2,000) = 492.394, p < .001, for an accuracy of 74.8 %. For the LOOCV, the discriminant analysis correctly allocated 1,488 of the 2,000 texts, for an accuracy of 74.4 % (see the confusion matrix reported in Table 8 for the results). The measure of agreement between the actual text types and those assigned by the model produced a weighted Cohen’s Kappa of .495, demonstrating moderate agreement. 

<i-image
  style="aspect-ratio:1336/468;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/8 Table 7.png-87f59349e2b629a7e6e35a4c11ce5d1e.png"
  alt="8 Table 7.png"
  width="1336"
  height="468">
</i-image><i-image
  style="aspect-ratio:1338/270;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/8 Table 8.png-ef894b37c80ba0c5ca4dd385b39affff.png"
  alt="8 Table 8.png"
  width="1338"
  height="270">
</i-image>

_ANOVA comparison between models for the movie review corpus_

We conducted a one-way ANOVA between the models, using the accuracy scores as the dependent variable and the models as the independent variable. The ANOVA reported an overall significant effect, F(2, 5997) = 74.690, p < .001, η^2 = .025. Pairwise comparisons showed significant differences between all models (p < .001), indicating that the SEANCE indices model was significantly better at classifying the movie reviews (M = .850, SD = .357) than either the SEANCE component score model (M = .748, SD = .435) or the LIWC indices model (M = .690, SD = .463). In addition, the pairwise comparisons indicated that the SEANCE component score model was significantly better at predicting the movie review classifications than was the LIWC indices model.

## Multi-domain sentiment dataset {#Multi-domain-sentiment-dataset-5770} 

### LIWC indices {#liwc-indices}

#### MANOVA

A MANOVA was conducted using the LIWC indices related to psychological processes and personal concerns as the dependent variables, and the positive and negative Amazon reviews as the independent variables. After checking for normal distributions and multicollinearity, 15 of the indices remained. These indices were used in the MANOVA, which indicated that 12 of the variables demonstrated significant differences between the positive and negative Amazon reviews and reported p values below .001.

#### DFA

We used the 12 significant variables from the MANOVA as our predictor variables in the DFA. The stepwise DFA retained nine of the variables (see Table 9 for the descriptive and MANOVA statistics for these variables), and we removed the remaining variables as nonsignificant predictors.

The results demonstrated that the DFA using these nine indices correctly allocated 5,748 of the 8,000 texts in the total set, χ^2 (df = 1, n = 8,000) = 1,530.852, p < .001, for an accuracy of 71.9 %. For the LOOCV, the discriminant analysis correctly allocated 5,742 of the 8,000 texts, for an accuracy of 71.8 % (see the confusion matrix reported in Table 10 for the results). The measure of agreement between the actual text type and that assigned by the model produced a weighted Cohen’s Kappa of .437, demonstrating moderate agreement.

For the individual domains in the dataset, the DFA based on the LIWC features correctly allocated 1,424 of the 2,000 book reviews, χ^2 (df = 1, n = 2,000) = 359.696, p < .001, Kappa = .424, for an accuracy of 71.2 %; 1,473 of the 2,000 DVD reviews, χ^2 (df = 1, n = 2,000) = 447.480, p < .001, Kappa = .473, for an accuracy of 73.7 %; 1,395 of the 2,000 electronics reviews, χ^2 (df = 1, n = 2,000) = 332.450, p < .001, Kappa = .395, for an accuracy of 69.8 %; and 1,456 of the 2, 000 kitchen appliance reviews, χ^2 (df = 1, n = 2,000) = 416.412, p < .001, Kappa = .456, for an accuracy of 72.8 %. See Table 11 for an overview.

### SEANCE indices {#seance-indices}

#### MANOVA

A MANOVA was conducted using the SEANCE indices as the dependent variables and the positive and negative Amazon reviews as the independent variables. After checking for normal distributions and multicollinearity, 109 indices remained. These indices were used in the MANOVA, which indicated that 80 of the variables demonstrated significant differences between the positive and negative Amazon reviews and had p values below .001.

#### DFA

We used the 80 significant variables from the MANOVA as our predictor variables in the DFA. The stepwise DFA retained 37 of the variables (see Table 12 for the descriptive and MANOVA statistics for these variables), and we removed the remaining variables as nonsignificant predictors.

The results demonstrated that the DFA using these 37 indices correctly allocated 6,219 of the 8,000 texts in the total set, χ^2 (df = 1, n = 8,000) = 2,468.464, p < .001, for an accuracy of 77.7 %. For the LOOCV, the discriminant analysis correctly allocated 6,196 of the 8,000 texts for an accuracy of 77.5 % (see the confusion matrix reported in Table 13 for the results). The measure of agreement between the actual text types and those assigned by the model produced a weighted Cohen’s Kappa of .555, demonstrating moderate agreement.

For the individual domains in the dataset, the DFA based on the SEANCE indices correctly allocated 1,500 of the 2,000 book reviews, χ^2 (df = 1, n = 2,000) = 501.929, p < .001, Kappa = .500, for an accuracy of 75 %; 1,547 of the 2,000 DVD reviews, χ^2 (df = 1, n = 2,000) = 598.634, p < .001, Kappa = .547, for an accuracy of 77.4 %; 1,583 of the 2,000 electronics reviews, χ^2 (df = 1, n = 2,000) = 679.860, p < .001, Kappa = .583, for an accuracy of 79.2 %; and 1,605 of the 2, 000 kitchen appliance reviews, χ^2 (df = 1, n = 2,000) = 737.128, p < .001, Kappa = .605, for an accuracy of 80.3 %. See Table 11 for an overview.

### SEANCE component scores {#seance-component-scores}

#### MANOVA

A MANOVA was conducted using the SEANCE component scores as the dependent variables and the positive and negative Amazon reviews as the independent variables. All indices were normally distributed, and no multicollinearity was reported between any of the variables. Thus, all 20 component scores were used in the MANOVA, which indicated that 16 of the variables demonstrated significant differences between the positive and negative Amazon reviews and reported p values below .001.

#### DFA

We used the 16 significant variables from the MANOVA as our predictor variables in the DFA. The stepwise DFA retained 11 of the variables (see Table 14 for descriptive and MANOVA statistics for these variables), and we removed the remaining variables as nonsignificant predictors.

The results demonstrated that the DFA using these 11 component scores correctly allocated 5,963 of the 8,000 texts in the total set, χ^2 (df = 1, n = 8,000) = 1,936.240, p < .001, for an accuracy of 74.5 %. For the LOOCV, the discriminant analysis correctly allocated 5,960 of the 8,000 texts, for an accuracy of 74.5 % (see the confusion matrix reported in Table 15 for the results). The measure of agreement between the actual text types and those assigned by the model produced a weighted Cohen’s Kappa of .491, demonstrating moderate agreement. 

For the individual domains in the dataset, the DFA based on the SEANCE component scores correctly allocated 1,449 of the 2,000 book reviews, χ^2 (df = 1, n = 2,000) = 412.867, p < .001, Kappa = .449, for an accuracy of 72.5 %; 1,519 of the 2,000 DVD reviews, χ^2 (df = 1, n = 2,000) = 538.735, p < .001, Kappa = .519, for an accuracy of 76 %; 1,477 of the 2, 000 electronics reviews, χ^2 (df = 1, n = 2,000) = 455.751, p < .001, Kappa = .477, for an accuracy of 73.9 %; and 1,518 of the 2,000 kitchen appliance reviews, χ^2 (df = 1, n = 2,000) = 541.432, p < .001, Kappa = .518, for an accuracy of 75.9 %. See Table 11 for an overview.

### ANOVA comparison between models for the Amazon review corpus {#anova-comparison-between-models-for-the-amazon-review-corpus}

We conducted one-way ANOVAs between the classification accuracies reported for the entire model and by the model for each domain (books, DVDs, electronics, and kitchen appliances), using the accuracy scores as the dependent variable and the models as the independent variable.

The ANOVA reported an overall significant effect for the feature set used, F(2, 23997) = 35.598, p < .001, η^2 = .003. Pairwise comparisons showed significant differences between all models (p < .001), indicating that the SEANCE indices model (M = .779, SD = .415) was significantly better at classifying the Amazon reviews than either the SEANCE component score model (M = .745, SD = .436) or the LIWC indices model (M = .719, SD = .449). In addition, the pairwise comparisons indicated that the SEANCE component score model was significantly better at predicting the Amazon review classifications than was the LIWC indices model.

The ANOVAs for the model’s domain-specific predictability reported significant effects for the domains of books, F(2, 5997) = 3.799, p < .050, η^2 = .001; DVDs, F(2, 5997) = 3.792, p < .050, η^2 = .001; electronics, F(2, 5997) = 23.403, p < .001, η^2 = .008; and kitchen appliances, F(2, 5997) = 15.571, p < .001, η^2 = .005. Pairwise comparisons showed a number of significant differences between the models (p < .001; see Table 16), indicating that the SEANCE indices model was significantly better at classifying the Amazon reviews than were the SEANCE component score model (except with DVD reviews) and the LIWC indices model. In addition, the pairwise comparisons indicated that the SEANCE component score model was significantly better at predicting the Amazon review classifications than was the LIWC indices model, with the exception of book and DVD reviews.

<i-image
  style="aspect-ratio:1348/450;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/8 Table 9.png-19dfc6ad20fd3641224ac5ec09766eae.png"
  alt="8 Table 9.png"
  width="1348"
  height="450">
</i-image><i-image
  style="aspect-ratio:1332/266;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/8 Table 10.png-34131eeefe040bb818fb6614922b6bdc.png"
  alt="8 Table 10.png"
  width="1332"
  height="266">
</i-image><i-image
  style="aspect-ratio:1344/278;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/8 Table 11.png-a0d16d6343b1bf5d77e49ccd37906021.png"
  alt="8 Table 11.png"
  width="1344"
  height="278">
</i-image><i-image
  style="aspect-ratio:1338/1072;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/8 Table 12.png-5744441d87fd9d2954bb0d7d17553310.png"
  alt="8 Table 12.png"
  width="1338"
  height="1072">
</i-image><i-image
  style="aspect-ratio:1342/274;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/8 Table 13.png-4fb913e074f1295feb3e4e4034a41cff.png"
  alt="8 Table 13.png"
  width="1342"
  height="274">
</i-image><i-image
  style="aspect-ratio:1348/498;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/8 Table 14.png-51d462d54c9c8ef8489cbcf73cce141d.png"
  alt="8 Table 14.png"
  width="1348"
  height="498">
</i-image><i-image
  style="aspect-ratio:1340/274;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/8 Table 15.png-627c2ecc79f9f6f2ede2629efa094889.png"
  alt="8 Table 15.png"
  width="1340"
  height="274">
</i-image><i-image
  style="aspect-ratio:1342/270;"
  src="https://pxeblicvfnzlnounkznu.supabase.co/storage/v1/object/public/strapi/files/8 Table 16.png-c8816333a87b4190ec178a736e3f25dd.png"
  alt="8 Table 16.png"
  width="1342"
  height="270">
</i-image>

## Discussion {#Discussion-5771} 

This article introduces a new tool, SEANCE, which automatically analyzes text features related to sentiment, cognition, and social order, among numerous other features. The tool is domain-general, and the output allows users to develop theoretical inferences from their datasets. The findings from this study have helped provide predictive validity for SEANCE, by demonstrating the potential for the SEANCE indices to predict positive and negative reviews with a number of well-known and widely used sentiment analysis test corpora. In addition, the study provides evidence for lexical differences between positive and negative texts, providing insight into the linguistic underpinnings that are predictive of writers’ emotional states. Our hope is that this freely available, user-friendly tool will provide wider access to a greater depth and breadth of lexical-based indices related to sentiment, cognition, and social order for researchers into discourse processing, language assessment, education, and cognitive science. The indices reported by SEANCE could be used to study the sentiment in a number of different discourse domains beyond those tested here (e.g., Web-based media, educational discourse, language assessment, and product reviews). In essence, researchers in any number of fields with an interest in examining sentiment in discourse structures could use SEANCE as a research tool.

We tested SEANCE against the most common tool used in sentiment analysis for behavioral studies (LIWC) and found that both the individual indices (i.e., the microfeatures) and the component scores (i.e., the macrofeatures) statistically outperformed LIWC in classic sentiment analysis tasks. For the Movie Review Corpus, SEANCE’s microfeatures performed on a par with domain-dependent tools (cf. .847 for SEANCE vs. .803–.872 for previous classification accuracies; Taboada et al., 2009), and better than previous domainindependent classification accuracies, which had reported accuracies that ranged from .581 to .764 for the same corpus. The component scores proved less accurate than the microfeatures in the Movie Review Corpus, but still reported accuracies of around 75 %, putting the component scores on a par with the top end of previous classification accuracies for domain-independent tools. For the Multi-Domain Sentiment Dataset (i.e., Amazon reviews), the SEANCE indices performed slightly below previously reported domain-specific algorithms based on n-grams (cf. 80 % from n-grams vs. 75 % from SEANCE for books, 82 % vs. 77 % for DVDs, 84 % vs. 79 % for electronics, and 88 % vs. 80 % for kitchen appliances) and on a par with or slightly better than (cf. 70.7 %–72.8 % vs. 75 % for books, 70.6 %–77.2 % vs. 77 % for DVDs, 70.8 %–82.7 % vs. 79 % for electronics, and 74.5 %–84 % vs. 80 % for kitchen appliances) previously reported domain adaption algorithms (i.e., algorithms that adapted predictive n-grams on the basis of frequency and mutual information from similar domains, such as the book and DVD review domains). The SEANCE component scores reported lower classification accuracies, but they were still on a par with previous domain adaption algorithms.

Overall, the findings of this study support the notion that negative and positive reviews in a variety of domains can be classified on the basis of a number of lexical features related to sentiment, cognition, and social order. Thus, the findings support the notion that emotional texts can be classified on the basis of the types of words selected by their authors. The LIWC analysis indicated that negative movie reviews contained more negative emotion words, negations, discrepancy terms, anger words, and exclusion terms, whereas positive movie reviews had more positive emotion words, inclusion terms, and terms related to perception processes. The LIWC findings from the Amazon.com reviews were similar, in that positive reviews also contained more positive emotion words along with fewer negations, negative emotion words, and exclusion terms. The DFA also indicated that positive Amazon reviews contained more affective, social, and certainty words, along with fewer exclusion terms.

The SEANCE microfeature analysis of the movie reviews supported the LIWC findings, but indicated that terms used as adjectives were the most predictive features of positive and negative texts and that reversing polarity based on negation was also an important component of predicting positive and negative opinions and emotions. This was especially true for the Hu–Lui positive and negative emotional categories, which were the strongest predictors in both the DFA models. Furthermore, the results indicated that other POS tags, such as adverbs, verbs, and nouns, are also important discriminators for sentiment analysis tasks. In addition, the SEANCE microfeature analysis reported that a number of features indirectly related to sentiment were important predictors of positive and negative movie reviews. These features indicated that positive movie reviews contained more words related to organized systems (doctrines), more dominance words, more polite terms, more male and human terms, more words related to power gain and solving, more terms related to natural processes, more enlightenment words, more words related to wellbeing, and more respect terms. Negative movie reviews, on the other hand, contained terms related to understatements, more tool terms, more spatial terms, and more terms of understanding. These findings were generally upheld in the analysis of the Amazon reviews, in that negation and POS tags were important components of predicting positive and negative reviews, and that a number of nonsentiment features related to strength of propositions, economy, social relations, time, communication, quantity, overstatements, communication, power, and action were predictive of both positive and negative Amazon reviews. 

Our macrofeature analysis demonstrated the power of combining like indices into specific components. Of the 20 components we developed, each demonstrated significant differences between the positive and negative movie reviews. In addition, ten of the 20 component scores were significant predictors of positive movie reviews in a DFA analysis. Like the microfeature analysis, these components indicated that adjectives were the strongest predictors of sentiment, and that components directly related to positive and negative sentiment were the strongest predictors of movie review type. In addition, components that were indirectly related to sentiment were strong predictors. For instance, negative movie reviews reported higher social-order, action, and certainty component scores than did positive movie reviews. Conversely, positive movie reviews reported higher economy, politeness, and wellbeing component scores than did negative movie reviews. Similar findings were reported for the component scores in the Amazon review analysis. This analysis indicated that 16 of the component scores showed significant differences between positive and negative Amazon reviews, and 11 of these component scores were predictors in the DFA. These component scores indicated that positive reviews contained fewer negative adjectives, more positive adjectives and verbs, more well-being terms, and were more polite. In addition, positive reviewers had fewer action terms. Three components that differed from the movie review analysis were also included for the Amazon reviews, indicating that positive reviews contained more trust terms, more affective terms related to friends and family, and fewer failure terms. 

Combined, these findings provide support for the notion that word vectors related to positive and negative emotions are the strongest predictors of review types in both the Movie Review Corpus and the Amazon corpus, indicating that writers rely on emotion words to convey affect. In addition, the findings indicate that valence features such as negation (Hutto & Gilbert, 2014; Polanyi & Zaenen, 2006), along with POS tags (Hogenboom et al., 2012), are important components of sentiment analysis and should be included in sentiment tasks. The findings indicate that writers may localize emotions more often in adjectives followed by verbs and adverbs. Although writers do use nouns to convey emotional content, nouns that contain emotions are less predictive than adjectives, verbs, and adverbs. Interestingly, a number of lexical features indirectly related to sentiment analysis were shown to be significant predictors of positive and negative reviews in both the test corpora, indicating that writers may not rely solely on emotional terms. These indirect assessments of sentiment were weaker predictors than traditional sentiment indices related to positive and negative terms, but their inclusion indicates the possibility to better understand sentiment features. A few of the features reported in this study are likely domain-specific. For instance, political movies appear more likely to be reviewed positively than movies centering on the legal system (as can be seen in the word vectors related to political and legal terms). In a similar fashion, reviews that discuss defined roles and men are more likely to be positive, and Amazon reviews that contain words related to the economy (most likely those related to price) are more likely to be negative. However, a number of word vectors in SEANCE that indirectly assess sentiment and are domain-independent were strong predictors of review types in this analysis. For instance, vectors related to dominance, respect, and power (e.g., power conflict, power gain, strength, and weakness), evaluation (e.g., overstatement, understatement, and virtue), quality and quantity (e.g., increase and quality), action, and temporality and spatiality (e.g., space and time) all reported significant differences between positive and negative reviews in both the movie review and Amazon corpora. Thus, a number of domain-general lexical features that are not specifically emotional are used by writers when producing positive and negative texts. Overall, the findings appear to allow for theoretical inferences about how language features related to sentiment, cognition, and social order are predictive of affect, and thus provide a better understanding of how writers use specific types of words to convey affect to readers.

## Conclusion {#Conclusion-2444} 

This study introduces and demonstrates the use of a new sentiment analysis tool, SEANCE, which is freely available to researchers and provides an automated approach to the examination of discourse in terms of sentiment, cognition, and social order. The two evaluations presented in this study afford strong evidence for the utility of SEANCE. Nonetheless, we plan to extend this foundational research by conducting additional validation studies using other metrics of sentiment beyond movie reviews (i.e., product reviews, blogs, tweets, and human discourse). These studies will provide evidence for the effectiveness of the SEANCE indices and component scores in other domains, to ensure domain independence. In addition, future studies will focus on developing new indices of sentiment for inclusion in SEANCE and additional valence features. Such indices will be based on sentiment dictionaries that are currently available, those that become available over time (e.g., the Warriner norms; Warriner, Kuperman, & Brysbaert, 2013; Westbury, Keith, Briesemeister, Hofmann, & Jacobs, 2015), or previous dictionaries that are updated. We also plan to add valence features, as necessary, to examine discourse features such as intensification. In the future, we will use these new indices and features to examine and test SEANCE on domains beyond movie reviews. 

We presume that SEANCE will facilitate research on sentiment analysis in discourse studies, language assessment, business management, education, and cognitive science (among other disciplines). We foresee SEANCE being used to examine the effects of negative and positive text on readers; to investigate affective educational states such as engagement, motivation, and arousal; to assess the effects of emotions in language assessment; and to control stimuli in behavioral studies. Outside of academic research, SEANCE could also aid businesses and industry in assessing product responses, advertising, and consumer sentiment. The study also provides evidence supporting the notion that valence and POS tags are important elements of sentiment analysis, and that word vectors indirectly associated with sentiment can provide valuable information about positive and negative language.

