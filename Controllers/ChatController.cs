using SahtekApi.Models;
using SahtekApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace SahtekApi.Controllers;

[ApiController]
[Route("api/v1/chat")]
public class ChatController : ControllerBase
{
    private readonly IGeminiService _geminiService;

    public ChatController(IGeminiService geminiService)
    {
        _geminiService = geminiService;
    }

    [HttpPost]
    public async Task<ActionResult<ChatResponse>> Post([FromBody] ChatRequest request, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new ErrorResponse { Error = "invalid_request", Message = "Message is required", Code = 400 });
        }

        try
        {
            var result = await _geminiService.GenerateChatResponseAsync(request, cancellationToken);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ErrorResponse { Error = "internal_error", Message = ex.Message, Code = 500 });
        }
    }
}