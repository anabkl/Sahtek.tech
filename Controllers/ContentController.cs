using Microsoft.AspNetCore.Mvc;
namespace SahtekApi.Controllers;
[ApiController] [Route("api/v1/content")]
public class ContentController : ControllerBase {
    [HttpGet("{topic}")] public IActionResult Get(string topic) => Ok(new {
        topic = topic,
        title = "الأعراض اللي خاصك تراقبيها",
        content = new { introduction = "سرطان الثدي عندو عدة علامات...", call_to_action = "سيري عند الطبيب فأقرب وقت." }
    });
}
