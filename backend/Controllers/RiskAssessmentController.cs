using Microsoft.AspNetCore.Mvc;
using SahtekApi.Models;
using SahtekApi.Services;

namespace SahtekApi.Controllers;
[ApiController] [Route("api/v1/risk-assessment")]
public class RiskAssessmentController : ControllerBase {
    private readonly IRiskCalculatorService _riskCalculator;
    public RiskAssessmentController(IRiskCalculatorService riskCalculator) { _riskCalculator = riskCalculator; }
    
    [HttpPost]
    public ActionResult<RiskResponse> Post([FromBody] RiskRequest request) {
        return Ok(_riskCalculator.Calculate(request.Answers, request.Language));
    }
}
