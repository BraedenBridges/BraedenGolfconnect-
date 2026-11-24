// ============================================================
// data.js — ALL the fake data for your prototype lives here.
//
// There is no database. Everything below is made up, and that is
// on purpose: never put real people's names, emails, phone numbers
// or addresses in this file.
//
// To change what appears on the Explore page, edit LISTINGS.
// Each item is one card. Keep the same fields (id, name, category,
// description) or ask Copilot to add new ones everywhere they're needed.
// ============================================================

const STARTUP = {
  name: "Golf Connect",
  tagline: "Find golfers. Plan rounds. Keep playing.",
  pitch: "Golf Connect brings compatible golfers together based on location, skill level, availability, and interests."
};

const LISTINGS = [
  { id: 1, name: "Emma", location: "Antigonish", skill: "Beginner", availability: "Weekend", interests: "Learning, nine-hole rounds", course: "Fairmont Fairway", description: "New to golf and looking for a relaxed, encouraging group.", initials: "EM" },
  { id: 2, name: "Liam", location: "Antigonish", skill: "Recreational", availability: "Weekday afternoon", interests: "Casual golf, new courses", course: "Riverbend Links", description: "Usually free after classes and happy to try new courses.", initials: "LI" },
  { id: 3, name: "Sarah", location: "St. Andrews", skill: "Intermediate", availability: "Weekend", interests: "Walking, friendly competition", course: "North Shore Golf Club", description: "Interested in a regular weekend foursome and friendly matches.", initials: "SA" },
  { id: 4, name: "Noah", location: "Halifax", skill: "Competitive", availability: "Weekday morning", interests: "Practice rounds, tournaments", course: "Harbourview Golf", description: "Looking for consistent partners to prepare for tournament play.", initials: "NO" },
  { id: 5, name: "Avery", location: "New Glasgow", skill: "Recreational", availability: "Flexible", interests: "Nine-hole rounds, social golf", course: "Pictou Pines", description: "Flexible schedule and always up for a relaxed nine holes.", initials: "AV" },
  { id: 6, name: "Maya", location: "Antigonish", skill: "Intermediate", availability: "Weekday evening", interests: "Women’s golf, course walks", course: "Fairmont Fairway", description: "Planning to join a local league and meet more golfers.", initials: "MA" }
];

const PROS = [
  { id: "pro-1", name: "Jordan Lee", location: "Antigonish", course: "Fairmont Fairway", specialty: "Beginner lessons, putting", experience: "Teaching professional · 8 years", availability: "Weekday afternoons", rate: "$60 / 45 min", initials: "JL" },
  { id: "pro-2", name: "Morgan Chen", location: "Halifax", course: "Harbourview Golf", specialty: "Short game, course strategy", experience: "Teaching professional · 12 years", availability: "Weekday mornings", rate: "$75 / 60 min", initials: "MC" },
  { id: "pro-3", name: "Casey Martin", location: "St. Andrews", course: "North Shore Golf Club", specialty: "Full swing, beginner lessons", experience: "Teaching professional · 6 years", availability: "Weekends", rate: "$55 / 45 min", initials: "CM" },
  { id: "pro-4", name: "Taylor Brooks", location: "New Glasgow", course: "Pictou Pines", specialty: "Putting, short game", experience: "Teaching professional · 10 years", availability: "Flexible", rate: "$65 / 45 min", initials: "TB" }
];

const TOURNAMENTS = [
  { id: 1, name: "Spring Scramble", location: "Fairmont Fairway", date: "May 24", format: "2-player scramble", level: "All levels", spots: "18 teams" },
  { id: 2, name: "Community Classic", location: "Riverbend Links", date: "June 8", format: "Individual stroke play", level: "Recreational", spots: "32 spots" },
  { id: 3, name: "Coastal Junior Open", location: "North Shore Golf Club", date: "June 21", format: "Stableford", level: "Youth competitive", spots: "Waitlist open" }
];
