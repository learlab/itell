import { Blockquote } from "@itell/ui/blockquote";
import { Image } from "@itell/ui/image";
import { Steps } from "@itell/ui/steps";

import { Accordion, AccordionItem } from "./ui/accordion";
import { Callout } from "./ui/callout";
import { Question } from "./ui/question";
import { YoutubeVideo } from "./youtube-video";

export const TextbookComponents = {
  "i-image": Image,
  "i-question": Question,
  "i-blockquote": Blockquote,
  "i-callout": Callout,
  "i-accordion": Accordion,
  "i-accordion-item": AccordionItem,
  "i-steps": Steps,
  "i-youtube": (props: { videoid: string }) => {
    return <YoutubeVideo videoid={props.videoid} />;
  },
};

export const GuideComponents = {
  "i-image": Image,
  "i-callout": Callout,
  "i-accordion": Accordion,
  "i-accordion-item": AccordionItem,
  "i-steps": Steps,
};
