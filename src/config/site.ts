export const siteConfig = {
  name: "RoomHesabKitaab",
  description: "Room 14, Al Syed Hostel ka simple daily kharcha aur roommate hisaab-kitaab tracker.",
  url: "https://roomhesabkitaab.app",
  roomNumber: "Room 14",
  hostelName: "Al Syed Hostel",
  totalRoommates: 8,
  links: {
    github: "https://github.com",
  },
  allowedStaticMembers: [
    "tatheer",
    "sadam",
    "ahmed ali",
    "syed ali mehdi",
    "muhammad rohail",
    "amanullah",
    "aman",
    "amankhan707022",
    "aizaz",
    "masood",
    "masood haider",
    "masood.haider.bangash1",
    "admin",
  ],
};

export const ALLOWED_STATIC_MEMBERS = siteConfig.allowedStaticMembers;

export type SiteConfig = typeof siteConfig;

