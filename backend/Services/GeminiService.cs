using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using SahtekApi.Models;

namespace SahtekApi.Services;

public class GeminiService : IGeminiService
{
    private sealed record DeepSeekMessage(
        [property: JsonPropertyName("role")] string Role,
        [property: JsonPropertyName("content")] string Content
    );

    private sealed record DeepSeekRequest(
        [property: JsonPropertyName("model")] string Model,
        [property: JsonPropertyName("messages")] List<DeepSeekMessage> Messages
    );

    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    private const string Endpoint = "https://api.deepseek.com/chat/completions";
    private const string Model = "deepseek-chat";

    private const string SystemPrompt = "You are 'Sahtek', a friendly Moroccan AI assistant. Always greet back warmly in Darija if the user says hello (salam, cv, etc). Never reply with robotic fallback text.";

    public GeminiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _apiKey = Environment.GetEnvironmentVariable("DEEPSEEK_API_KEY")
            ?? throw new InvalidOperationException("DEEPSEEK_API_KEY environment variable is not configured.");
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
    }

    public async Task<ChatResponse> GenerateChatResponseAsync(ChatRequest request, CancellationToken cancellationToken)
    {
        var trimmedMessage = request.Message?.Trim();
        if (string.IsNullOrWhiteSpace(trimmedMessage))
        {
            throw new InvalidOperationException("User message cannot be empty.");
        }

        var payload = new DeepSeekRequest(
            Model,
            [
                new DeepSeekMessage("system", SystemPrompt),
                new DeepSeekMessage("user", trimmedMessage)
            ]
        );

        using var httpRequest = new HttpRequestMessage(HttpMethod.Post, Endpoint)
        {
            Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
        };

        var response = await _httpClient.SendAsync(httpRequest, cancellationToken);
        var json = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new InvalidOperationException($"DeepSeek API request failed with status {(int)response.StatusCode}.");
        }

        using var jsonDoc = JsonDocument.Parse(json);
        var aiText = ExtractText(jsonDoc.RootElement);

        return new ChatResponse
        {
            Response = aiText,
            Category = "general",
            Confidence = 0.9,
            RelatedTopics = ["self_check", "prevention", "when_to_see_doctor"],
            Disclaimer = true
        };
    }

    private static string ExtractText(JsonElement root)
    {
        if (!root.TryGetProperty("choices", out var choices) ||
            choices.ValueKind != JsonValueKind.Array ||
            choices.GetArrayLength() == 0)
        {
            throw new InvalidOperationException("DeepSeek API returned no choices.");
        }

        var firstChoice = choices[0];
        if (!firstChoice.TryGetProperty("message", out var messageElement) ||
            !messageElement.TryGetProperty("content", out var contentElement))
        {
            throw new InvalidOperationException("DeepSeek API returned an invalid response shape.");
        }

        var aiText = contentElement.GetString();
        if (!string.IsNullOrWhiteSpace(aiText))
        {
            return aiText;
        }

        throw new InvalidOperationException("DeepSeek API returned an empty text response.");
    }

}
