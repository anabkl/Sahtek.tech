using Microsoft.AspNetCore.Mvc;
namespace SahtekApi.Controllers;
[ApiController] [Route("api/v1/self-check-guide")]
public class SelfCheckGuideController : ControllerBase {
    [HttpGet]
    public IActionResult Get([FromQuery] string language = "ar") {
        return Ok(new {
            title = "دليل الفحص الذاتي",
            best_time = "من 3 إلى 5 أيام بعد نهاية الدورة الشهرية",
            total_duration_minutes = 5,
            steps = new[] { new { step_number = 1, title = "المراقبة في المرآة", icon = "👁️", duration_seconds = 60, instruction = "وقفي قدّام المرآة..." } }
        });
    }
}
