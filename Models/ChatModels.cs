using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SahtekApi.Models;

public record ConversationMessage(
    [property: JsonPropertyName("role")] string Role,
    [property: JsonPropertyName("content")] string Content
);

public class ChatRequest
{
    [Required(ErrorMessage = "Message is required")]
    [JsonPropertyName("message")]
    public string Message { get; set; } = default!;

    [Required]
    [JsonPropertyName("language")]
    public string Language { get; set; } = "ar";

    [JsonPropertyName("conversation_history")]
    public List<ConversationMessage>? ConversationHistory { get; set; }
}

public class ChatResponse
{
    [JsonPropertyName("response")] public string Response { get; set; } = default!;
    [JsonPropertyName("category")] public string Category { get; set; } = "general";
    [JsonPropertyName("confidence")] public double Confidence { get; set; } = 0.95;
    [JsonPropertyName("related_topics")] public List<string> RelatedTopics { get; set; } = ["self_check", "prevention"];
    [JsonPropertyName("disclaimer")] public bool Disclaimer { get; set; } = true;
}

public class ErrorResponse
{
    [JsonPropertyName("error")] public string Error { get; set; } = default!;
    [JsonPropertyName("message")] public string Message { get; set; } = default!;
    [JsonPropertyName("code")] public int Code { get; set; }
}