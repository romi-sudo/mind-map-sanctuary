export type MockEventCategory =
  | "אישי"
  | "ימי גיבוש"
  | "העשרה"
  | "הרצאות"
  | "פסטיבלים";

export interface MockEvent {
  id: string;
  title: string;
  category: MockEventCategory;
  shortDescription: string;
  fullDescription: string;
  date: string;
  sortDate: string; // ISO for sorting
  location: string;
  format: "פרונטלי" | "אונליין";
  image: string;
  price: string;
}

export const MOCK_EVENTS: MockEvent[] = [
  {
    id: "ai-course",
    title: "קורס AI מעשי",
    category: "העשרה",
    shortDescription: "4 מפגשים ללמוד להשתמש בכלי AI בעבודה ובחיים.",
    fullDescription:
      "קורס בן 4 מפגשים מעשיים שילמדו אותך לרתום כלי AI מובילים לעבודה היומיומית, ליצירת תוכן ולפתרון בעיות. מתאים לכל הרמות, ללא ידע טכני מוקדם.",
    date: "12 ביולי",
    sortDate: "2026-07-12",
    location: "אונליין · Zoom",
    format: "אונליין",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
    price: "490 ₪",
  },
  {
    id: "desert-festival",
    title: "פסטיבל במדבר",
    category: "פסטיבלים",
    shortDescription: "שלושה ימי חיבור, מוזיקה והתבוננות במדבר יהודה.",
    fullDescription:
      "שלושה ימים של חיבור עמוק, מוזיקה חיה, סדנאות תנועה והתבוננות בלב מדבר יהודה. חוויה קהילתית עוצרת נשימה תחת שמי המדבר.",
    date: "22 ביולי",
    sortDate: "2026-07-22",
    location: "מצפה רמון",
    format: "פרונטלי",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400",
    price: "850 ₪",
  },
  {
    id: "team-day",
    title: "יום גיבוש לצוותים",
    category: "ימי גיבוש",
    shortDescription: "יום חוויתי המשלב אתגרים, חיבור צוותי וסדנת תקשורת.",
    fullDescription:
      "יום שלם של חוויה משותפת לצוותים: אתגרים בטבע, סדנת תקשורת מקרבת, וארוחה חגיגית. בונים אמון ויוצרים זיכרון משותף.",
    date: "5 באוגוסט",
    sortDate: "2026-08-05",
    location: "פארק הירקון, תל אביב",
    format: "פרונטלי",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400",
    price: "350 ₪",
  },
  {
    id: "resilience-lecture",
    title: "הרצאה: חוסן נפשי בעבודה",
    category: "הרצאות",
    shortDescription: "כלים מעשיים להתמודדות עם לחץ ושחיקה.",
    fullDescription:
      "הרצאה בת שעה עם פסיכולוגית ארגונית בכירה — כלים מעשיים לבניית חוסן נפשי, ניהול לחץ ומניעת שחיקה בסביבת העבודה המודרנית.",
    date: "18 ביולי",
    sortDate: "2026-07-18",
    location: "אונליין",
    format: "אונליין",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400",
    price: "ללא עלות",
  },
  {
    id: "mindfulness-retreat",
    title: "ריטריט מיינדפולנס",
    category: "אישי",
    shortDescription: "סוף שבוע של שקט, מדיטציה ותרגול נשימה בטבע.",
    fullDescription:
      "סוף שבוע מלא בנוכחות: מדיטציות בוקר, תרגול נשימה, יוגה עדינה והליכות מודעות בטבע. הזדמנות להתנתק ולחזור אל עצמך.",
    date: "29 ביולי",
    sortDate: "2026-07-29",
    location: "גליל עליון",
    format: "פרונטלי",
    image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400",
    price: "1,250 ₪",
  },
  {
    id: "career-ai-workshop",
    title: "סדנת קריירה ו-AI",
    category: "העשרה",
    shortDescription: "איך AI משנה את שוק העבודה ואיך להתכונן.",
    fullDescription:
      "סדנה אינטראקטיבית על השפעת ה-AI על שוק העבודה: אילו תפקידים משתנים, אילו כישורים נדרשים, ואיך להתכונן לעשור הקרוב.",
    date: "8 ביולי",
    sortDate: "2026-07-08",
    location: "אונליין",
    format: "אונליין",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400",
    price: "180 ₪",
  },
  {
    id: "couples-evening",
    title: "ערב זוגיות מודעת",
    category: "אישי",
    shortDescription: "ערב סדנתי לזוגות על תקשורת ואינטימיות.",
    fullDescription:
      "ערב אינטימי לזוגות בהנחיית מטפלת זוגית מנוסה. תרגילי תקשורת, נוכחות והקשבה — מתנה אמיתית למערכת היחסים שלכם.",
    date: "25 ביולי",
    sortDate: "2026-07-25",
    location: "תל אביב",
    format: "פרונטלי",
    image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400",
    price: "320 ₪",
  },
  {
    id: "leadership-lecture",
    title: "הרצאה: מנהיגות מודעת",
    category: "הרצאות",
    shortDescription: "על מנהיגות מתוך נוכחות, ערכים וחוזקה פנימית.",
    fullDescription:
      "הרצאה מעוררת השראה על מהי מנהיגות מודעת — מנהיגות שמגיעה מתוך נוכחות, ערכים וחוזקה פנימית, ומשפיעה על הסביבה בלי לאבד את עצמה.",
    date: "14 באוגוסט",
    sortDate: "2026-08-14",
    location: "הרצליה",
    format: "פרונטלי",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400",
    price: "ללא עלות",
  },
];
