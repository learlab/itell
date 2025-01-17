"use client";

import Link from "next/link";
import { Card, CardContent } from "@itell/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@itell/ui/carousel";
import { LinkIcon } from "lucide-react";

const cards = [
  {
    text: "Take a minute to ponder some of what you know and how you acquired that knowledge. Perhaps you know that you should make your bed in the morning because your mother or father told you this is what you should do, perhaps you know that swans are white because all of the swans you have seen are white.",
    source: "1. Methods of Knowing",
    href: "/1-methods-of-knowing",
  },
  {
    text: "Some people are surprised to learn that psychology is a science. They generally agree that astronomy, biology, and chemistry are sciences but wonder what psychology has in common with these other fields. Before answering this question, it is worth reflecting on what astronomy, biology, and chemistry have in common with each other.",
    source: "2. Understanding Science",
    href: "/2-understanding-science",
  },
  {
    text: "The first and most basic goal of science is to describe. This goal is achieved by making careful observations. The second goal of science is to predict. Once we have observed with some regularity that two behaviors or events are systematically related to one another we can use that information to predict.",
    source: "3. Goals of Science",
    href: "/3-goals-of-science",
  },
  {
    text: "Although much of our folk psychology is probably reasonably accurate, it is clear that much of it is not. For example, most people believe that anger can be relieved by 'letting it out'—perhaps by punching something or screaming loudly. Scientific research, however, has shown that this approach tends to leave people feeling more angry, not less.",
    source: "4. Science and Common Sense",
    href: "/4-science-and-common-sense",
  },
  {
    text: "Scientific research in psychology is generally conducted by people with doctoral degrees and master's degrees in psychology and related fields, often supported by research assistants with bachelor's degrees or other relevant training. Some of them work for government agencies, national associations, non-profit organizations, or in the private sector.",
    source: "5. Experimental and Clinical Psychologists",
    href: "/5-experimental-and-clinical-psychologists",
  },
  {
    text: "The research by Mehl and his colleagues is described nicely by this model. Their research question—whether women are more talkative than men—was suggested to them both by people's stereotypes and by claims published in the research literature about the relative talkativeness of women and men.",
    source: "7. A Model of Scientific Research in Psychology",
    href: "/7-a-model-of-scientific-research-in-psychology",
  },
  {
    text: "Research questions often begin as more general research ideas—usually focusing on some behavior or psychological characteristic: talkativeness, learning, depression, bungee jumping, and so on. Before looking at how to turn such ideas into empirically testable research questions, it is worth looking at where such ideas come from in the first place.",
    source: "8. Finding a Research Topic",
    href: "/8-finding-a-research-topic",
  },
  {
    text: "A theory is a coherent explanation or interpretation of one or more phenomena. Although theories can take a variety of forms, one thing they have in common is that they go beyond the phenomena they explain by including variables, structures, processes, functions, or organizing principles that have not been observed directly.",
    source: "10. Developing a Hypothesis",
    href: "/10-developing-a-hypothesis",
  },
  {
    text: "Part of generating a hypothesis involves identifying the variables that you want to study and operationally defining those variables so that they can be measured. Research questions in psychology are about variables. A variable is a quantity or quality that varies across people or situations.",
    source: "11. Designing a Research Study",
    href: "/11-designing-a-research-study",
  },
  {
    text: "Once the study is complete and the observations have been made and recorded the researchers need to analyze the data and draw their conclusions. Typically, data are analyzed using both descriptive and inferential statistics. Descriptive statistics are used to summarize the data and inferential statistics are used to generalize the results.",
    source: "12. Analyzing the Data",
    href: "/12-analyzing-the-data",
  },
  {
    text: "Ethics is the branch of philosophy that is concerned with morality—what it means to behave morally and how people can achieve that goal. It can also refer to a set of principles and practices that provide moral guidance in a particular field. There is an ethics of business, medicine, teaching, and of course, scientific research.",
    source: "15. Moral Foundations of Ethical Research",
    href: "/15-moral-foundations-of-ethical-research",
  },
  {
    text: "When researchers measure a construct that they assume to be consistent across time, then the scores they obtain should also be consistent across time. Test-retest reliability is the extent to which this is actually the case. For example, intelligence is generally thought to be consistent across time.",
    source: "20. Reliability and Validity of Measurement",
    href: "/20-reliability-and-validity-of-measurement",
  },
];

export function KnowledgeCarousel() {
  return (
    <Carousel className="mx-auto max-w-lg">
      <CarouselContent>
        {cards.map((item, index) => (
          <CarouselItem key={index}>
            <KnowledgeCard {...item} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export function KnowledgeCard({
  text,
  source,
  href,
}: {
  text: string;
  source: string;
  href: string;
}) {
  return (
    <div className="p-1">
      <Card>
        <CardContent className="flex aspect-square items-center justify-center p-6">
          <figure>
            <svg
              aria-hidden="true"
              className="mx-auto mb-3 size-4"
              viewBox="0 0 24 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"
                fill="currentColor"
              />
            </svg>
            <blockquote className="border-none">
              <p className="text-lg font-light leading-snug text-muted-foreground">
                {text}
              </p>
            </blockquote>
            <figcaption className="mt-6 flex items-center justify-center space-x-3 text-lg">
              <div className="flex items-center divide-x-2">
                <Link
                  className="inline-flex items-center italic hover:underline"
                  href={href}
                  // fix for "aria-hidden elements contain focusable elements" (the parent container for this component is aria-hidden)
                  tabIndex={-1}
                >
                  <span className="flex items-center gap-2">
                    <LinkIcon className="size-4" />
                    {source}
                  </span>
                </Link>
              </div>
            </figcaption>
          </figure>
        </CardContent>
      </Card>
    </div>
  );
}
