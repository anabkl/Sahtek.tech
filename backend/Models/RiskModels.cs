using System.Text.Json.Serialization;
namespace SahtekApi.Models;

public class RiskAnswers {
    [JsonPropertyName("age")] public string Age { get; set; } = "";
    [JsonPropertyName("family_history")] public string FamilyHistory { get; set; } = "";
    [JsonPropertyName("exercise")] public string Exercise { get; set; } = "";
    [JsonPropertyName("smoking_alcohol")] public string SmokingAlcohol { get; set; } = "";
    [JsonPropertyName("self_exam")] public string SelfExam { get; set; } = "";
    [JsonPropertyName("overweight")] public string Overweight { get; set; } = "";
    [JsonPropertyName("breastfeeding")] public string Breastfeeding { get; set; } = "";
    [JsonPropertyName("first_period_age")] public string FirstPeriodAge { get; set; } = "";
    [JsonPropertyName("hormone_therapy")] public string HormoneTherapy { get; set; } = "";
    [JsonPropertyName("first_pregnancy_age")] public string FirstPregnancyAge { get; set; } = "";
}
public class RiskRequest {
    [JsonPropertyName("answers")] public RiskAnswers Answers { get; set; } = new();
    [JsonPropertyName("language")] public string Language { get; set; } = "ar";
}
public class RiskRecommendation {
    [JsonPropertyName("priority")] public string Priority { get; set; } = "";
    [JsonPropertyName("action")] public string Action { get; set; } = "";
    [JsonPropertyName("icon")] public string Icon { get; set; } = "";
}
public class RiskResponse {
    [JsonPropertyName("risk_level")] public string RiskLevel { get; set; } = "";
    [JsonPropertyName("risk_score")] public double RiskScore { get; set; }
    [JsonPropertyName("max_score")] public int MaxScore { get; set; }
    [JsonPropertyName("risk_percentage")] public int RiskPercentage { get; set; }
    [JsonPropertyName("summary")] public string Summary { get; set; } = "";
    [JsonPropertyName("recommendations")] public List<RiskRecommendation> Recommendations { get; set; } = new();
    [JsonPropertyName("risk_factors_identified")] public List<string> RiskFactorsIdentified { get; set; } = new();
    [JsonPropertyName("protective_factors_identified")] public List<string> ProtectiveFactorsIdentified { get; set; } = new();
    [JsonPropertyName("next_steps")] public string NextSteps { get; set; } = "";
    [JsonPropertyName("disclaimer")] public string Disclaimer { get; set; } = "";
}
