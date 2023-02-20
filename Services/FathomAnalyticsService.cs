using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;
using Raven.Client.Documents;
using Strife.Repository.Indexes;

public class FathomAnalyticsService : IHostedService, IDisposable
{
  private int executionCount = 0;
  private readonly ILogger<FathomAnalyticsService> _logger;
  private readonly IDocumentStore _documentStore;
  private readonly IConfiguration _configuration;
  private string token => _configuration.GetValue<string>("FathomAPIToken") ?? "";
  private Timer? _timer = null;

  public FathomAnalyticsService(ILogger<FathomAnalyticsService> logger, IDocumentStore documentStore, IConfiguration configuration)
  {
    _logger = logger;
    _documentStore = documentStore;
    _configuration = configuration;
  }

  public Task StartAsync(CancellationToken stoppingToken)
  {
    _logger.LogInformation("Fathom Analytics Service Service running.");

    _timer = new Timer(DoWork, null, TimeSpan.Zero,
        TimeSpan.FromHours(1));

    return Task.CompletedTask;
  }

  private async void DoWork(object? state)
  {
    var count = Interlocked.Increment(ref executionCount);

    _logger.LogInformation(
        "Fathom Analytics Service is working. Count: {Count}", count);

    // if(string.IsNullOrEmpty(token)) {
    //   _logger.LogError("Fathom: Token not found");
    // }

    var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "1125899928000023|fjEfoL2KLzj76pzy1KoQU9lSW7jKNKqftDjNhr3r");

    try
    {

      using var session = _documentStore.OpenAsyncSession();

      var posts = await session.Query<Post>().ToListAsync();

      foreach (var post in posts)
      {

        var url = await (from result in session.Query<Content_ByUrl.Result, Content_ByUrl>()
                         where result.Id == post.Id
                         select result.Url
                        ).SingleOrDefaultAsync();

        using var res = await client.GetAsync(@$"https://api.usefathom.com/v1/aggregations?entity_id=YUGAMIMD&entity=pageview&aggregates=pageviews,visits&date_from={DateTime.UtcNow.AddDays(-6).ToShortDateString()}&date_grouping=day&field_grouping=pathname&filters=[{{""property"": ""pathname"",""operator"": ""is"",""value"": ""{url}""}}]", HttpCompletionOption.ResponseHeadersRead);

        if(res.IsSuccessStatusCode) {

          var reports = await res.Content.ReadFromJsonAsync<List<Report>>();

          _logger.LogInformation("Fetched {COUNT} reports for {URL}", reports?.Count, url);

          if(reports != null && reports.Any()) {
            post.Analytics.Clear();
            post.Analytics.AddRange(reports);
          }

        } else {
          Console.WriteLine("An error occurred.", res.StatusCode);
        }

      }

      if(session.Advanced.HasChanges) {
        await session.SaveChangesAsync();
      }

    }
    catch (Exception ex)
    {
      Console.WriteLine(ex.StackTrace);
    }
  }

  public Task StopAsync(CancellationToken stoppingToken)
  {
    _logger.LogInformation("Fathom Analytics Service is stopping.");

    _timer?.Change(Timeout.Infinite, 0);

    return Task.CompletedTask;
  }

  public void Dispose()
  {
    _timer?.Dispose();
  }
}

public record Report([property: JsonPropertyName("pageviews")] int PageViews, [property: JsonPropertyName("date")] DateTime Date, [property: JsonPropertyName("pathname")] string PathName);