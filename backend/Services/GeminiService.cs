using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.Extensions.Logging;
using SahtekApi.Models;

namespace SahtekApi.Services;

public class GeminiService : IGeminiService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<GeminiService> _logger;

    private const string Endpoint = "https://api.deepseek.com/chat/completions";
    private const string Model = "deepseek-chat";

    private const string SystemPrompt = "You are 'Sahtek', a friendly Moroccan AI assistant. Always greet back warmly in Darija if the user says hello (salam, cv, etc). Never reply with robotic fallback text.";

    public GeminiService(HttpClient httpClient, ILogger<GeminiService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<ChatResponse> GenerateChatResponseAsync(ChatRequest request, CancellationToken cancellationToken)
    {
        var apiKey = Environment.GetEnvironmentVariable("DEEPSEEK_API_KEY");
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            _logger.LogError("DEEPSEEK_API_KEY environment variable is not configured.");
            throw new InvalidOperationException("AI service is not configured. Please contact support.");
        }

        var trimmedMessage = request.Message?.Trim();
        if (string.IsNullOrWhiteSpace(trimmedMessage))
        {
            throw new InvalidOperationException("User message cannot be empty.");
        }

        var payload = new
        {
            model = Model,
            messages = new[]
            {
                new { role = "system", content = SystemPrompt },
                new { role = "user", content = trimmedMessage }
            }
        };

        using var httpRequest = new HttpRequestMessage(HttpMethod.Post, Endpoint)
        {
            Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
        };
        httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

        HttpResponseMessage response;
        string json;
        try
        {
            response = await _httpClient.SendAsync(httpRequest, cancellationToken);
            json = await response.Content.ReadAsStringAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "HTTP request to DeepSeek API failed. InnerException: {Inner}", ex.InnerException?.Message);
            throw;
        }

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("DeepSeek API returned HTTP {Status}. Body: {Body}", (int)response.StatusCode, json);
            throw new InvalidOperationException($"DeepSeek API request failed with status {(int)response.StatusCode}.");
        }

        var aiText = ExtractText(json);

        return new ChatResponse
        {
            Response = aiText,
            Category = "general",
            Confidence = 0.9,
            RelatedTopics = ["self_check", "prevention", "when_to_see_doctor"],
            Disclaimer = true
        };
    }

    private string ExtractText(string json)
    {
        try
        {
            var node = JsonNode.Parse(json);
            var content = node?["choices"]?[0]?["message"]?["content"]?.GetValue<string>();
            if (!string.IsNullOrWhiteSpace(content))
            {
                return content;
            }

            _logger.LogError("DeepSeek API returned unexpected response shape. Raw JSON: {Json}", json);
            throw new InvalidOperationException("DeepSeek API returned an unexpected response shape.");
        }
        catch (Exception ex) when (ex is not InvalidOperationException)
        {
            _logger.LogError(ex, "Failed to parse DeepSeek API response. InnerException: {Inner}. Raw JSON: {Json}",
                ex.InnerException?.Message, json);
            throw new InvalidOperationException("Failed to parse the AI service response.", ex);
        }
    }
}
