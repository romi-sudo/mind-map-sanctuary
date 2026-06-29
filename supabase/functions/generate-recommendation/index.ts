import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const REAL_PRACTITIONERS = [
  { id: "michal-levi", name: 'ד"ר מיכל לוי', title: "פסיכולוגית קלינית", tags: ["חרדה", "טראומה", "מעברי חיים"], price: "400-600 ש\"ח" },
  { id: "oren-cohen", name: "אורן כהן", title: "מאמן קריירה וחיים", tags: ["קריירה", "AI וקריירה", "זהות"], price: "300-500 ש\"ח" },
  { id: "noa-shamir", name: "נועה שמיר", title: "מטפלת זוגית ומשפחתית", tags: ["זוגיות", "מערכות יחסים", "גבולות"], price: "500-700 ש\"ח" },
  { id: "yoav-barak", name: "יואב ברק", title: "מנחה ריטריטים", tags: ["זהות", "מיינדפולנס", "גוף ונפש"], price: "ריטריטים" },
  { id: "shira-adler", name: "שירה אדלר", title: "מאמנת צמיחה אישית", tags: ["ביטחון עצמי", "זהות", "קריירה"], price: "250-400 ש\"ח" },
  { id: "ran-mizrachi", name: 'ד"ר רן מזרחי', title: "פסיכותרפיסט", tags: ["טראומה", "EMDR", "חרדה"], price: "500-800 ש\"ח" },
  { id: "tamar-golan", name: "תמר גולן", title: "מטפלת באמנות", tags: ["טראומה", "ביטחון עצמי", "ילדים ונוער"], price: "280-400 ש\"ח" },
  { id: "daniel-shapira", name: "דניאל שפירא", title: "מטפל סומטי ועיסוי טיפולי", tags: ["גוף-נפש", "סומטי", "ניהול סטרס"], price: "320-450 ש\"ח" },
  { id: "liat-ben-ami", name: "ליאת בן עמי", title: "מנחת סדנאות והכשרות ארגוניות", tags: ["ימי גיבוש", "תקשורת", "מנהיגות"], price: "1,500-3,000 ש\"ח לסדנה" },
  { id: "yael-friedman", name: "יעל פרידמן", title: "מאמנת NLP וזוגיות", tags: ["זוגיות", "NLP", "תקשורת בין-אישית"], price: "350-500 ש\"ח" },
  { id: "amit-rosen", name: "עמית רוזן", title: "מורה למיינדפולנס ומדיטציה", tags: ["מיינדפולנס", "חרדה", "איזון נפשי"], price: "200-350 ש\"ח" },
  { id: "noa-eckstein", name: 'ד"ר נועה אקשטיין', title: "פסיכולוגית ארגונית ומאמנת מנהלים", tags: ["מנהיגות", "AI וקריירה", "פיתוח ארגוני"], price: "500-800 ש\"ח" },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { responseId, track, answers, freeText } = await req.json();

    if (!responseId || !track || !answers) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `אתה יועץ מומחה בתחום הטיפול הנפשי, האימון האישי והפיתוח המקצועי בישראל.
בהתבסס על תשובות המשתמש לשאלון, עליך להמליץ על:
1. מסלול טיפולי/אימוני מותאם אישית (כותרת + הסבר של 2 שורות למה זה מתאים)
2. 3 מומחים מומלצים (שם בדוי, תואר, התמחויות, טווח מחירים)

ענה בפורמט JSON בלבד עם המבנה הבא:
{
  "primary": {
    "title": "שם המסלול",
    "description": "הסבר למה זה מתאים"
  },
  "practitioners": [
    {
      "name": "שם מלא",
      "initials": "2 אותיות ראשונות",
      "title": "תואר מקצועי",
      "tags": ["התמחות1", "התמחות2", "התמחות3"],
      "price": "טווח מחירים"
    }
  ]
}

חשוב: התאם את ההמלצה למסלול (אישי/מקצועי/שניהם) ולתשובות הספציפיות. היה מדויק ורלוונטי.`;

    const userPrompt = `מסלול: ${track}
תשובות: ${JSON.stringify(answers)}
טקסט חופשי: ${freeText || "לא הוזן"}`;

    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
        }),
      }
    );

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const recommendationText = aiData.choices?.[0]?.message?.content;
    
    let recommendation;
    try {
      recommendation = JSON.parse(recommendationText);
    } catch {
      console.error("Failed to parse AI response:", recommendationText);
      // Fallback recommendation
      recommendation = {
        primary: {
          title: track === "career" ? "אימון קריירה + עבודה פנימית" : "טיפול פסיכולוגי אינטגרטיבי",
          description: track === "career"
            ? "שילוב של מיפוי מקצועי עם עבודה על זהות — כדי שהצעד הבא יהיה גם חכם וגם נכון."
            : "גישה שמשלבת הקשבה עמוקה עם כלים מעשיים — כדי שתרגיש/י שינוי אמיתי כבר מהפגישה הראשונה.",
        },
        practitioners: [
          { name: "ד״ר נועה לוי", initials: "נל", title: "פסיכולוגית קלינית", tags: ["CBT", "חרדה", "מעברי חיים"], price: "350–500 ש״ח" },
          { name: "עמית כהן", initials: "עכ", title: "מאמן אישי ומקצועי", tags: ["NLP", "קריירה", "מנהיגות"], price: "300–450 ש״ח" },
          { name: "מיכל אברהם", initials: "מא", title: "מטפלת בתנועה", tags: ["סומטי", "טראומה", "גוף-נפש"], price: "280–400 ש״ח" },
        ],
      };
    }

    // Save recommendation to DB
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase
      .from("questionnaire_responses")
      .update({ recommendation })
      .eq("id", responseId);

    return new Response(
      JSON.stringify({ recommendation }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
