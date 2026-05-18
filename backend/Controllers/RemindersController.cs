using Microsoft.AspNetCore.Mvc;
using SahtekApi.Models;

namespace SahtekApi.Controllers;
[ApiController] [Route("api/v1/reminders")]
public class RemindersController : ControllerBase {
    [HttpPost]
    public ActionResult<ReminderResponse> Post([FromBody] ReminderRequest request) {
        return StatusCode(201, new ReminderResponse {
            Id = "rem_abc123",
            NextReminder = DateTime.UtcNow.AddMonths(1).ToString("yyyy-MM-ddTHH:mm:ssZ"),
            Message = request.Language == "ar" ? "التذكير مفعّل! غادي نذكّروك بالفحص الذاتي كل شهر. 💗" : "Reminder activated!"
        });
    }
}
