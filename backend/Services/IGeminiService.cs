using SahtekApi.Models;
namespace SahtekApi.Services;

public interface IGeminiService
{
    Task<ChatResponse> GenerateChatResponseAsync(ChatRequest request, CancellationToken cancellationToken = default);
}