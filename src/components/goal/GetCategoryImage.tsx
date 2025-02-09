import React from "react";

// Import SVGs
import Cooking from "@/assets/images/activities/cooking.svg";
import CreativeArts from "@/assets/images/activities/crotchet.svg";
import EventPlanning from "@/assets/images/activities/event.svg";
import Gardening from "@/assets/images/activities/gardening.svg";
import Hiking from "@/assets/images/activities/hiking.svg";
import Journaling from "@/assets/images/activities/journaling.svg";
import Mindfulness from "@/assets/images/activities/meditate.svg";
import SelfCare from "@/assets/images/activities/meditate.svg";
import OutdoorActivities from "@/assets/images/activities/meditate.svg";
import Planning from "@/assets/images/activities/planning.svg";
import HobbiesInterests from "@/assets/images/activities/meditate.svg";
import Reading from "@/assets/images/activities/reading.svg";
import SocialActivities from "@/assets/images/activities/meditate.svg";
import Sports from "@/assets/images/activities/sports.svg";
import Volunteer from "@/assets/images/activities/volunteer.svg";
import Fitness from "@/assets/images/activities/meditate.svg";
import Health from "@/assets/images/activities/meditate.svg";
import Learning from "@/assets/images/activities/meditate.svg";
import Travel from "@/assets/images/activities/meditate.svg";
import CareerWork from "@/assets/images/activities/meditate.svg";
import Finance from "@/assets/images/activities/meditate.svg";
import Family from "@/assets/images/activities/meditate.svg";
import Pets from "@/assets/images/activities/meditate.svg";
import Technology from "@/assets/images/activities/meditate.svg";

import { Category } from "@/src/types/goals";

const IMG_WIDTH = "100%";

// Map category names to their corresponding SVG components
const categoryIcons: Record<Category, React.ElementType> = {
  cooking: Cooking,
  "creative arts": CreativeArts,
  "event planning": EventPlanning,
  gardening: Gardening,
  hiking: Hiking,
  journaling: Journaling,
  mindfulness: Mindfulness,
  "self-care": SelfCare,
  outdoor: OutdoorActivities,
  planning: Planning,
  hobbies: HobbiesInterests,
  reading: Reading,
  social: SocialActivities,
  sports: Sports,
  volunteer: Volunteer,
  fitness: Fitness,
  health: Health,
  learning: Learning,
  travel: Travel,
  "career/work": CareerWork,
  finance: Finance,
  family: Family,
  pets: Pets,
  technology: Technology,
};

// Function to get the correct SVG component for a category
export const GetCategoryImage = (category: Category, height: number = 120) => {
  const IconComponent = categoryIcons[category];

  if (!IconComponent) {
    console.warn(`Invalid category: ${category}`);
    return null;
  }

  return <IconComponent width={IMG_WIDTH} height={height} />;
};
