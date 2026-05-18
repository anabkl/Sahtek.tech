using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;

namespace SahtekApi.Controllers;

[ApiController]
[Route("api/v1/health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "ok",
            service = "sahtek-api",
            version = "1.0.0",
            timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ")
        });
    }
}