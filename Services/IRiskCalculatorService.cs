using SahtekApi.Models;
namespace SahtekApi.Services;
public interface IRiskCalculatorService {
    RiskResponse Calculate(RiskAnswers answers, string language);
}
