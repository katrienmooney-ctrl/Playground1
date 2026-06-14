import type { Category } from '../types';

export const TIP_TEMPLATES: Record<Category, { warning: string; over: string }> = {
  Groceries: {
    warning: "Grocery spend is nearing your limit. Plan meals for the week before shopping and check weekly specials.",
    over: "Groceries are over budget. Try store-brand items, reduce food waste with meal planning, and buy staples in bulk.",
  },
  Dining: {
    warning: "You're approaching your dining budget. Try meal prepping 2–3 nights a week to cut restaurant costs.",
    over: "Dining budget exceeded. Cooking at home for the rest of the month could save $150–$200. Consider bringing lunch to work.",
  },
  Transport: {
    warning: "Transport costs are climbing. Consider carpooling, public transit, or combining errands into single trips.",
    over: "Transport is over budget. Review fuel costs, parking fees, and ride-share usage — small adjustments add up quickly.",
  },
  Entertainment: {
    warning: "Entertainment spend is nearing the limit. Look for free local events, matinee prices, or streaming alternatives.",
    over: "Entertainment is over budget. Set a weekly cash allowance for outings to stay on track next month.",
  },
  Shopping: {
    warning: "Shopping spend is approaching your limit. Pause non-essential purchases and use a wishlist to delay impulse buys.",
    over: "Shopping is over budget. Try a 48-hour rule before buying anything non-essential — it reduces impulse spending significantly.",
  },
  Utilities: {
    warning: "Utility costs are high this period. Check for energy waste: unplug idle devices, adjust thermostat schedules.",
    over: "Utilities exceeded budget. Review your plan — switching providers or switching to LED lighting can cut costs by 10–20%.",
  },
  Healthcare: {
    warning: "Healthcare spend is nearing your limit. Check if preventative care or generic medications could reduce costs.",
    over: "Healthcare is over budget. Review your health insurance plan — ensure you're using in-network providers to minimize out-of-pocket costs.",
  },
  Travel: {
    warning: "Travel spending is approaching your limit. Book accommodation and transport further in advance to lock in lower prices.",
    over: "Travel is over budget. Consider shorter local getaways or off-peak travel dates for future trips to stretch your budget further.",
  },
  'Personal Care': {
    warning: "Personal care costs are nearing the limit. Space out salon visits or try at-home alternatives for some services.",
    over: "Personal care exceeded budget. Evaluate which services are essential and which could be done less frequently or at home.",
  },
  Subscriptions: {
    warning: "Subscription costs are adding up. Review your active subscriptions and pause ones you haven't used this month.",
    over: "Subscriptions are over budget. Audit every recurring charge — cancelling just 2–3 unused services often saves $30–$60/month.",
  },
  Other: {
    warning: "Unclassified spending is high. Review 'Other' transactions and recategorize them for better tracking.",
    over: "'Other' spending is over budget. Categorizing these transactions will help you identify where the money is actually going.",
  },
};
