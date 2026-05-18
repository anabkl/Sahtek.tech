using SahtekApi.Models;
namespace SahtekApi.Services;

public class RiskCalculatorService : IRiskCalculatorService
{
    private const int MaxScore = 12;

    public RiskResponse Calculate(RiskAnswers answers, string language)
    {
        ArgumentNullException.ThrowIfNull(answers);

        var lang = NormalizeLanguage(language);
        double score = 0;
        var riskFactors = new List<string>();
        var protectiveFactors = new List<string>();

        if (EqualsValue(answers.FamilyHistory, "mother_or_sister"))
        {
            score += 5;
            riskFactors.Add(Text(lang, "التاريخ العائلي عند الأم أو الأخت", "Antécédent familial chez la mère ou la sœur", "Family history in mother or sister"));
        }
        else if (EqualsValue(answers.FamilyHistory, "none"))
        {
            protectiveFactors.Add(Text(lang, "ما كاينش تاريخ عائلي معروف", "Pas d'antécédent familial connu", "No known family history"));
        }

        if (EqualsValue(answers.Age, "40-49") || EqualsValue(answers.Age, "50_plus"))
        {
            score += 3;
            riskFactors.Add(Text(lang, "العمر 40 سنة أو أكثر", "Âge de 40 ans ou plus", "Age 40 or older"));
        }

        if (EqualsValue(answers.Exercise, "rarely"))
        {
            score += 2;
            riskFactors.Add(Text(lang, "قلة النشاط البدني", "Manque d'activité physique", "Low physical activity"));
        }
        else if (EqualsValue(answers.Exercise, "daily"))
        {
            protectiveFactors.Add(Text(lang, "نشاط بدني يومي", "Activité physique quotidienne", "Daily physical activity"));
        }

        if (EqualsValue(answers.SmokingAlcohol, "regularly"))
        {
            score += 2;
            riskFactors.Add(Text(lang, "التدخين أو الكحول بانتظام", "Tabac ou alcool régulier", "Regular smoking or alcohol use"));
        }
        else if (EqualsValue(answers.SmokingAlcohol, "never"))
        {
            protectiveFactors.Add(Text(lang, "عدم التدخين والكحول", "Pas de tabac ni d'alcool", "No smoking or alcohol use"));
        }

        if (EqualsValue(answers.SelfExam, "monthly"))
        {
            protectiveFactors.Add(Text(lang, "الفحص الذاتي كل شهر", "Auto-examen mensuel", "Monthly self-check"));
        }

        if (EqualsValue(answers.Breastfeeding, "yes"))
        {
            protectiveFactors.Add(Text(lang, "الرضاعة الطبيعية", "Allaitement", "Breastfeeding"));
        }

        var riskLevel = score < 5
            ? "low"
            : score < 10
                ? "moderate"
                : "high";

        return new RiskResponse
        {
            RiskLevel = riskLevel,
            RiskScore = score,
            MaxScore = MaxScore,
            RiskPercentage = (int)Math.Round(score / MaxScore * 100),
            Summary = Summary(lang, riskLevel),
            Recommendations = Recommendations(lang, riskLevel, answers),
            RiskFactorsIdentified = riskFactors,
            ProtectiveFactorsIdentified = protectiveFactors,
            NextSteps = NextSteps(lang, riskLevel),
            Disclaimer = Disclaimer(lang)
        };
    }

    private static bool EqualsValue(string? actual, string expected) =>
        string.Equals(actual, expected, StringComparison.OrdinalIgnoreCase);

    private static string NormalizeLanguage(string? language) =>
        string.Equals(language, "fr", StringComparison.OrdinalIgnoreCase) ? "fr" :
        string.Equals(language, "en", StringComparison.OrdinalIgnoreCase) ? "en" :
        "ar";

    private static string Text(string language, string ar, string fr, string en) =>
        language switch
        {
            "fr" => fr,
            "en" => en,
            _ => ar
        };

    private static string Summary(string language, string riskLevel) =>
        (language, riskLevel) switch
        {
            ("fr", "low") => "Votre risque semble faible. Continuez les bonnes habitudes et gardez l'auto-examen mensuel.",
            ("fr", "moderate") => "Votre risque semble modéré. Il vaut mieux renforcer vos habitudes de prévention et faire un suivi régulier.",
            ("fr", "high") => "Votre risque semble élevé. Prenez rendez-vous avec un médecin pour un avis personnalisé.",
            ("en", "low") => "Your risk appears low. Keep healthy habits and continue monthly self-checks.",
            ("en", "moderate") => "Your risk appears moderate. Strengthen prevention habits and keep regular medical follow-up.",
            ("en", "high") => "Your risk appears high. Please book a medical appointment for personalized guidance.",
            (_, "low") => "المخاطر ديالك باينة منخفضة. كملي العادات الصحية وديري الفحص الذاتي كل شهر.",
            (_, "moderate") => "المخاطر ديالك متوسطة. من الأحسن تزيدي الاهتمام بصحتك وتديري الفحص الذاتي بانتظام.",
            _ => "المخاطر ديالك باينة مرتفعة. من الأحسن تحجزي موعد عند الطبيب باش يعطيك نصيحة مناسبة لحالتك."
        };

    private static List<RiskRecommendation> Recommendations(string language, string riskLevel, RiskAnswers answers)
    {
        var recommendations = new List<RiskRecommendation>
        {
            new()
            {
                Priority = "high",
                Action = Text(language, "ديري الفحص الذاتي كل شهر", "Faites l'auto-examen chaque mois", "Do a breast self-check every month"),
                Icon = "🩺"
            },
            new()
            {
                Priority = riskLevel == "high" ? "high" : "medium",
                Action = Text(language, "استشيري الطبيب مرة في العام", "Consultez un médecin une fois par an", "See a doctor once a year"),
                Icon = "👩‍⚕️"
            }
        };

        if (EqualsValue(answers.Exercise, "rarely"))
        {
            recommendations.Add(new RiskRecommendation
            {
                Priority = "medium",
                Action = Text(language, "زيدي الرياضة - 30 دقيقة فاليوم", "Augmentez l'activité physique - 30 minutes par jour", "Increase activity - 30 minutes a day"),
                Icon = "🏃‍♀️"
            });
        }

        if (EqualsValue(answers.SmokingAlcohol, "regularly"))
        {
            recommendations.Add(new RiskRecommendation
            {
                Priority = "high",
                Action = Text(language, "نقصي أو حبسي التدخين والكحول", "Réduisez ou arrêtez le tabac et l'alcool", "Reduce or stop smoking and alcohol"),
                Icon = "💪"
            });
        }

        recommendations.Add(new RiskRecommendation
        {
            Priority = "medium",
            Action = Text(language, "نظام غذائي متوازن غني بالخضر والفواكه", "Adoptez une alimentation équilibrée riche en fruits et légumes", "Eat a balanced diet rich in fruits and vegetables"),
            Icon = "🥗"
        });

        return recommendations;
    }

    private static string NextSteps(string language, string riskLevel) =>
        (language, riskLevel) switch
        {
            ("fr", "high") => "Prenez rendez-vous avec un médecin pour un examen clinique. La mammographie est importante à partir de 40 ans.",
            ("fr", _) => "Gardez l'auto-examen mensuel et consultez un médecin si vous remarquez un changement.",
            ("en", "high") => "Book a medical appointment for a clinical exam. Mammography is important from age 40.",
            ("en", _) => "Keep monthly self-checks and see a doctor if you notice any change.",
            (_, "high") => "من الأحسن تحجزي موعد عند الطبيب باش تديري فحص سريري. الماموغرافيا مهمة بعد سن 40.",
            _ => "كملي الفحص الذاتي كل شهر، وإذا لاحظتي أي تغيير سيري عند الطبيب."
        };

    private static string Disclaimer(string language) =>
        Text(
            language,
            "⚕️ هاد التقييم للتوعية فقط وماشي تشخيص طبي. استشيري طبيبك ديما.",
            "⚕️ Cette évaluation est éducative et ne remplace pas un diagnostic médical. Consultez toujours votre médecin.",
            "⚕️ This assessment is educational only and is not a medical diagnosis. Always consult your doctor.");
}
