using Microsoft.AspNetCore.Mvc;
namespace SahtekApi.Controllers;
[ApiController] [Route("api/v1/statistics")]
public class StatisticsController : ControllerBase {
    [HttpGet] public IActionResult Get() => Ok(new {
        global = new { affected_ratio = "1 in 8", early_detection_survival = "99%" },
        morocco = new { new_cases_yearly = "~12,000", awareness_note = "60% من الحالات كيتشخّصو متأخر." },
        key_facts = new[] { new { stat = "5 دقائق", description = "الوقت الكافي للفحص الذاتي" } }
    });
}
