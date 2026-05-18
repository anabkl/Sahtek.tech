using System.Net.Http.Json;
using System.Text.Json;
using SahtekApi.Models;

namespace SahtekApi.Services;

public class GeminiService : IGeminiService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    private const string SystemPrompt = """
        Tu es "صحّتك" (Sahtek), une assistante IA spécialisée UNIQUEMENT dans la sensibilisation au cancer du sein, conçue pour les femmes marocaines.

        RÈGLES ABSOLUES:
        1. Tu réponds UNIQUEMENT aux questions liées au cancer du sein, à la santé du sein, à l'auto-examen, à la prévention, aux symptômes, au dépistage et au soutien émotionnel.
        2. Si la question est hors sujet, dis poliment que tu es spécialisée dans le cancer du sein.
        3. Tu n'es PAS médecin. Tu ne fais JAMAIS de diagnostic. Tu donnes des informations éducatives.
        4. Ajoute TOUJOURS un rappel de consulter un médecin pour toute préoccupation.
        5. Sois empathique, chaleureuse et rassurante. Beaucoup de femmes ont peur.
        6. Utilise un langage simple et accessible.

        LANGUES:
        - Si language="ar": Réponds en Darija marocaine. Utilise des mots comme "خاصك", "كيداير", "بزاف", "ديال". PAS en arabe classique.
        - Si language="fr": Réponds en français simple.
        - Si language="en": Réponds en anglais simple.

        FORMAT:
        - Réponses entre 50 et 200 mots maximum.
        - Utilise des émojis pertinents (💗🎀🩺💪✅).
        - Structure avec des tirets si plusieurs points.
        """;

    public GeminiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY")
            ?? throw new InvalidOperationException("GEMINI_API_KEY environment variable is not configured.");
    }

    public async Task<ChatResponse> GenerateChatResponseAsync(ChatRequest request, CancellationToken cancellationToken)
    {
        var contents = new List<object>();

        if (request.ConversationHistory != null)
        {
            foreach (var msg in request.ConversationHistory.TakeLast(10))
            {
                if (string.IsNullOrWhiteSpace(msg.Content))
                {
                    continue;
                }

                var role = string.Equals(msg.Role, "assistant", StringComparison.OrdinalIgnoreCase)
                    ? "model"
                    : "user";

                contents.Add(new
                {
                    role,
                    parts = new[] { new { text = msg.Content } }
                });
            }
        }

        contents.Add(new
        {
            role = "user",
            parts = new[] { new { text = $"language={request.Language}\n\n{request.Message}" } }
        });

        var payload = new
        {
            system_instruction = new { parts = new[] { new { text = SystemPrompt } } },
            contents = contents
        };

        var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={_apiKey}";

        var response = await _httpClient.PostAsJsonAsync(url, payload, cancellationToken);
        var json = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new InvalidOperationException($"Gemini API request failed with status {(int)response.StatusCode}.");
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
        if (!root.TryGetProperty("candidates", out var candidates) ||
            candidates.ValueKind != JsonValueKind.Array ||
            candidates.GetArrayLength() == 0)
        {
            throw new InvalidOperationException("Gemini API returned no candidates.");
        }

        var candidate = candidates[0];
        if (!candidate.TryGetProperty("content", out var content) ||
            !content.TryGetProperty("parts", out var parts) ||
            parts.ValueKind != JsonValueKind.Array)
        {
            throw new InvalidOperationException("Gemini API returned an invalid response shape.");
        }

        foreach (var part in parts.EnumerateArray())
        {
            if (part.TryGetProperty("text", out var textElement))
            {
                var text = textElement.GetString();
                if (!string.IsNullOrWhiteSpace(text))
                {
                    return text;
                }
            }
        }

        throw new InvalidOperationException("Gemini API returned an empty text response.");
    }
}
