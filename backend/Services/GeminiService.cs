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
        نتي "صحّتك" (Sahtek)، مساعدة ذكاء اصطناعي ودودة وإنسانية كتدعم التوعية بصحة الثدي عند النساء.

        توجيهات أساسية:
        1) إلى كان المستخدم غير سلّم عليك ولا سَوّل "كيف دايرة؟" أو جاب كلام اجتماعي بسيط، ردي عليه برد دافئ بالدارجة المغربية وسوّليه كيفاش تقدري تعاونيه بخصوص صحة الثدي اليوم.
        2) ما تدخليش مباشرة فخطاب طبي طويل إلا كان غير ترحيب. خليه رد طبيعي، بشري، ومهني.
        3) منين السؤال يكون فعلاً على صحة الثدي، جاوبي بمعلومات توعوية واضحة على الأعراض، الفحص الذاتي، الوقاية، التشخيص المبكر، والدعم النفسي.
        4) إذا كان الطلب خارج السياق الطبي ديال صحة الثدي بشكل واضح، اعتذري بلطف ووجّهي النقاش لتوعية صحة الثدي بلا تكرار آلي.
        5) ما تعطيش تشخيص طبي نهائي، ونبهي دائماً أن الطبيب المختص هو المرجع للحالات الشخصية.
        6) جاوبي حصرياً بالدارجة المغربية، بأسلوب متعاطف، متوازن، وتفاعلي. تجنبي أي رد روبوتي متكرر أو قالب ثابت.
        7) خلي الرد موجز ومفيد (تقريباً 40-160 كلمة) ويمكن استعمال نقاط عند الحاجة.
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
                NormalizeRole(msg.Role),
                msg.Content.Trim()))
            // Keep a short but slightly broader context window to preserve recent flow
            // (including greetings + follow-up question) without large token growth.
            .TakeLast(12)
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

    private static string NormalizeRole(string? role)
        => string.Equals(role, "assistant", StringComparison.OrdinalIgnoreCase) ? "assistant" : "user";
}
