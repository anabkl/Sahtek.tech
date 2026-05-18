using System.Text.Json.Serialization;
namespace SahtekApi.Models;

public class ReminderRequest {
    [JsonPropertyName("email")] public string? Email { get; set; }
    [JsonPropertyName("phone")] public string? Phone { get; set; }
    [JsonPropertyName("preferred_day")] public int PreferredDay { get; set; }
    [JsonPropertyName("language")] public string Language { get; set; } = "ar";
    [JsonPropertyName("notification_type")] public string NotificationType { get; set; } = "email";
}
public class ReminderResponse {
    [JsonPropertyName("id")] public string Id { get; set; } = "";
    [JsonPropertyName("status")] public string Status { get; set; } = "active";
    [JsonPropertyName("next_reminder")] public string NextReminder { get; set; } = "";
    [JsonPropertyName("message")] public string Message { get; set; } = "";
}
