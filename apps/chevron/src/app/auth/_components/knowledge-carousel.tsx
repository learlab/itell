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
    text: "The operator training programs at Chevron's Pascagoula Refinery encompass multi-year progression paths. Trainees achieve fully qualified status by completing required training through a building-block approach. The program evaluates knowledge and competency through written examinations, skill demonstrations, and verbal assessments, ensuring the Refinery maintains a well-qualified workforce.",
    source: "1 Operations Training Program Overview",
    href: "/1-operations-training-program-overview",
  },
  {
    text: "The Formal Operator Training Program is a three-year program designed to develop the required skills, knowledge, and competencies of new hire operators. The program incorporates Global Formal Operator Training Program (GFOTP), On-the-Job Training, and Qualification Activities. Trainees must qualify on their first job within 12 months, second job within 24 months, and jobs three and four within 36 months.",
    source: "2 Formal Operator Training Program (FOTP)",
    href: "/2-formal-operator-training-program-fotp",
  },
  {
    text: "A Fully Qualified Operator must continue training in each of their areas' remaining job roles. FQO Job qualification training provides continuing education for operators to assume duties of additional operator jobs, either within their current Business Unit or when re-assigned to another Business Unit. The maximum time expectation for completing job training requirements is 12 months.",
    source: "3 Fully Qualified Operator (FQO) Training",
    href: "/3-fully-qualified-operator-fqo-training",
  },
  {
    text: "Control Room Operator training requires completion of specific job qualifications and fundamentals courses. The program includes post-fundamentals training with mentors, simulator training on Honeywell and Yokogawa systems, and hands-on console experience. CROs must maintain their qualification by working minimum shifts and completing regular refresher training.",
    source: "4 Control Room Operator (CRO) Training",
    href: "/4-control-room-operator-cro-training",
  },
  {
    text: "The Head Operator training program focuses on developing well-qualified workforce leadership through standardized technical and professional skill development. It includes comprehensive field and console training requirements, with structured progression paths and evaluation processes. The program emphasizes leadership skills aligned with We Lead expectations and promotes Operational Excellence.",
    source: "5 Head Operator (HO) Training",
    href: "/5-head-operator-ho-training",
  },
  {
    text: "Requalification requirements are determined by length of absence from the job through a Board of Review process. The matrix outlines specific requirements for trainees and qualified operators, with mandatory review of MOCs and procedure updates during absence. Training may include shadow training, solo operation, skill assessments, and job school attendance.",
    source: "6 Requalification – Absence from Job",
    href: "/6-requalification-absence-from-job",
  },
  {
    text: "Other training encompasses new plant training requirements and Management of Change (MOC) training. For new plants, operations personnel must complete comprehensive unit schools, achieve minimum test scores, and complete qualification requirements. MOC training covers plant changes and procedure updates, managed through the MOC system and delivered by subject matter experts.",
    source: "7 Other Training",
    href: "/7-other-training",
  },
  {
    text: "The Chevron internship program offers semester-long opportunities for students from Industrial Operations or Maintenance programs. Interns must maintain a 3.0 GPA and complete pre-hire requirements. The 12-14 week program provides hands-on experience under direct supervision, with potential transition to full-time operator trainee positions based on performance and business needs.",
    source: "8 Interns",
    href: "/8-interns",
  },
  {
    text: "Unit School Instructors and OTJ Trainers are crucial for operator development. Qualified instructors must demonstrate teaching ability, complete Train-The-Trainer class, and possess extensive job knowledge. OTJ Trainers conduct shadow training using tools like Break-in Guides and Electronic Operating Manuals to ensure comprehensive skill development.",
    source: "9 Unit School Instructors & OTJ Trainers",
    href: "/9-unit-school-instructors-and-otj-trainers",
  },
  {
    text: "The roles and responsibilities framework outlines duties for Operations Leadership, Unit Field Trainers, Learning & Development staff, and HR personnel. This structure ensures proper training delivery, performance evaluation, and program management while maintaining compliance with safety and regulatory requirements throughout the operator development process.",
    source: "10 Roles & Responsibilities",
    href: "/10-roles-and-responsibilities",
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
