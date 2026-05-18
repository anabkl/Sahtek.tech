using System.Net.Http.Json;
using System.Net.Http.Headers;
using System.Text.Json;
using SahtekApi.Models;

namespace SahtekApi.Services;

public class GeminiService : IGeminiService
{
    private sealed record DeepSeekMessage(string role, string content);

    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    private const string Endpoint = "https://api.deepseek.com/chat/completions";
    private const string Model = "deepseek-chat";

    private const string SystemPrompt = """
        نتي "صحّتك" (Sahtek)، مساعدة ذكاء اصطناعي للتوعية بسرطان الثدي فقط.

        قواعد صارمة:
        1) جاوبي غير على مواضيع سرطان الثدي، الفحص الذاتي، الوقاية، الأعراض، التشخيص المبكر، والدعم النفسي.
        2) إلا كان السؤال خارج هاد النطاق، اعتذري بلطف وقولي بلي اختصاصك هو التوعية بسرطان الثدي.
        3) ما تعطيش تشخيص طبي نهائياً، ودائماً نبهي المستخدم يتواصل مع طبيب.
        4) ردودك خاصها تكون إنسانية، مطمئنة، وبسيطة.
        5) جاوبي حصرياً وبشكل كامل بالدارجة المغربية فقط، وما تستعمليش الفرنسية، الإنجليزية، أو العربية الفصحى.
        6) الرد يكون واضح ومختصر (تقريباً بين 50 و 180 كلمة) ومع نقاط إلا اِحتاج الأمر.
        """;

    public GeminiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _apiKey = Environment.GetEnvironmentVariable("DEEPSEEK_API_KEY")
            ?? throw new InvalidOperationException("DEEPSEEK_API_KEY environment variable is not configured.");
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
    }

    public async Task<ChatResponse> GenerateChatResponseAsync(ChatRequest request, CancellationToken cancellationToken)
    {
        var trimmedMessage = request.Message.Trim();
        var messages = new List<DeepSeekMessage>
        {
            new("system", SystemPrompt)
        };

        var history = (request.ConversationHistory ?? [])
            .Where(msg => !string.IsNullOrWhiteSpace(msg.Content))
            .Select(msg => new DeepSeekMessage(
                string.Equals(msg.Role, "assistant", StringComparison.OrdinalIgnoreCase) ? "assistant" : "user",
                msg.Content.Trim()))
            .TakeLast(10)
            .ToList();

        foreach (var msg in history)
        {
            // Guard against repeated adjacent turns that can cause loop-like model replies.
            if (messages.Count > 0 &&
                messages[^1].role == msg.role &&
                messages[^1].content == msg.content)
            {
                continue;
            }

            messages.Add(msg);
        }

        var alreadyIncludedAsLastUserMessage =
            history.Count > 0 &&
            history[^1].role == "user" &&
            string.Equals(history[^1].content, trimmedMessage, StringComparison.Ordinal);

        if (!alreadyIncludedAsLastUserMessage)
        {
            messages.Add(new("user", trimmedMessage));
        }

        var payload = new
        {
            model = Model,
            messages,
            temperature = 0.4
        };

        var response = await _httpClient.PostAsJsonAsync(Endpoint, payload, cancellationToken);
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
