import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface CorporatePayload {
  companyName: string;
  companySize: string;
  needs: string[];
  format: string;
  budget: string;
  expectations: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = (await req.json()) as CorporatePayload;
    const { companyName, companySize, needs, format, budget, expectations } = payload;

    if (!companyName || !companySize || !needs?.length) {
      return new Response(
        JSON.stringify({ error: "חסרים פרטים נדרשים" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Fetch relevant practitioners from DB based on needs
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: practitioners } = await supabase
      .from("practitioner_applications")
      .select("full_name, professional_title, specialties, approaches, price_per_session, bio, area")
      .eq("accepting_new_clients", true)
      .limit(20);

    const practitionersContext = (practitioners ?? []).map((p) => ({
      name: p.full_name,
      title: p.professional_title,
      specialties: p.specialties,
      approaches: p.approaches,
      price: p.price_per_session,
      bio: p.bio?.slice(0, 200),
    }));

    const systemPrompt = `אתה יועץ ארגוני בכיר המתמחה ברווחת עובדים, גיבוש צוותים ופיתוח ארגוני בישראל.
תפקידך להמליץ לאיש HR על פעילויות מתאימות לצורכי החברה, ולבחור 3 מטפלים/מנחים מתוך רשימת המומחים שתקבל.

החזר JSON בלבד במבנה הבא:
{
  "summary": "סיכום קצר של 2-3 משפטים על הצרכים המרכזיים של החברה",
  "activities": [
    { "title": "שם הפעילות", "description": "תיאור 2-3 שורות", "format": "פורמט מומלץ", "duration": "משך משוער" }
  ],
  "practitioners": [
    { "name": "שם מהרשימה", "title": "התפקיד שלו", "tags": ["התמחות1","התמחות2"], "matchReason": "למה הוא מתאים לחברה הזו במשפט" }
  ]
}

המלץ על 3 פעילויות ו-3 מטפלים. אם אין מספיק מטפלים ברשימה, צור פרופילים גנריים עם שמות בדויים ישראליים.`;

    const userPrompt = `פרטי החברה:
- שם: ${companyName}
- גודל: ${companySize}
- צרכים: ${needs.join(", ")}
- פורמט מועדף: ${format || "לא צוין"}
- תקציב: ${budget || "לא צוין"}
- ציפיות ויעדים: ${expectations || "לא צוין"}

מטפלים/מנחים זמינים בפלטפורמה:
${JSON.stringify(practitionersContext, null, 2)}`;

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
        return new Response(JSON.stringify({ error: "יותר מדי בקשות, נסי שוב בעוד רגע" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "נדרש תשלום נוסף" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const text = aiData.choices?.[0]?.message?.content;

    let recommendation;
    try {
      recommendation = JSON.parse(text);
    } catch {
      console.error("Failed to parse AI response:", text);
      recommendation = {
        summary: `${companyName} מחפשת לחזק את ${needs.slice(0, 2).join(" ו")} עבור ${companySize} עובדים. הכנו עבורך מסלול מותאם.`,
        activities: [
          { title: "סדנת גיבוש בטבע", description: "יום פעילות חווייתי בטבע המשלב כלים לחיזוק קשרים בין-אישיים ועבודת צוות.", format: "סדנה חד-פעמית", duration: "6 שעות" },
          { title: "מסע מנהיגות", description: "תהליך של 3 מפגשים למנהלי ביניים — מנהיגות עצמית, תקשורת אפקטיבית והובלת שינוי.", format: "קורס מתמשך", duration: "3 מפגשים" },
          { title: "מיינדפולנס בעבודה", description: "סדרת מפגשים שבועיים קצרים לחיזוק חוסן נפשי והפחתת שחיקה.", format: "אונליין מתמשך", duration: "8 שבועות" },
        ],
        practitioners: [
          { name: "רותם בן-דוד", title: "מנחה גיבוש ופיתוח ארגוני", tags: ["דינמיקה קבוצתית", "טבע", "חוויה"], matchReason: "מתמחה בקבוצות בגודל הזה" },
          { name: "ד״ר ענת שמיר", title: "פסיכולוגית ארגונית", tags: ["חוסן", "מנהיגות", "שחיקה"], matchReason: "ניסיון רב עם הצרכים שציינתם" },
          { name: "יוסי כהן", title: "מאמן צוותים", tags: ["תקשורת", "צוות", "פתרון קונפליקטים"], matchReason: "התאמה גבוהה לפורמט שביקשתם" },
        ],
      };
    }

    return new Response(JSON.stringify({ recommendation }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
