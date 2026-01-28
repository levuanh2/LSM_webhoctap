using System.Text.Json;
using System.Text;

namespace IntelligentLMS.Progress.Services;

public interface IAiAdvisorClient
{
    Task<string> GetRecommendationAsync(Guid userId, double progressPercentage);
}

public class AiAdvisorClient : IAiAdvisorClient
{
    private readonly HttpClient _httpClient;

    public AiAdvisorClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<string> GetRecommendationAsync(Guid userId, double progressPercentage)
    {
        var request = new
        {
            user_id = userId.ToString(),
            progress = progressPercentage
        };

        var content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");
        
        try 
        {
            // AI Service is running on port 8000
            var response = await _httpClient.PostAsync("http://localhost:8000/recommend", content);
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                return result;
            }
            return "No recommendation available (AI Service unavailable or error)";
        }
        catch
        {
            return "AI Service is offline";
        }
    }
}
