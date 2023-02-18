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
  private Timer? _timer = null;

  public FathomAnalyticsService(ILogger<FathomAnalyticsService> logger, IDocumentStore documentStore)
  {
    _logger = logger;
    _documentStore = documentStore;
  }

  public Task StartAsync(CancellationToken stoppingToken)
  {
    _logger.LogInformation("Fathom Analytics Service Service running.");

    _timer = new Timer(DoWork, null, TimeSpan.Zero,
        TimeSpan.FromDays(1));

    return Task.CompletedTask;
  }

  private async void DoWork(object? state)
  {
    var count = Interlocked.Increment(ref executionCount);

    _logger.LogInformation(
        "Fathom Analytics Service is working. Count: {Count}", count);

    var client = new HttpClient();
    // client.DefaultRequestHeaders.Clear();
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "1125899928000023|fjEfoL2KLzj76pzy1KoQU9lSW7jKNKqftDjNhr3r");
    // client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    // client.DefaultRequestHeaders.Add("Content-Type", "application/json");
    // client.DefaultRequestHeaders.TryAddWithoutValidation("Content-Type", "application/json");
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

        // &date_from={DateTime.UtcNow.StartOfWeek(DayOfWeek.Monday).ToShortDateString()}
        //var res = await client.GetAsync(@$"https://api.usefathom.com/v1/aggregations?entity_id=YUGAMIMD&entity=pageview&aggregates=pageviews&date_grouping=day&field_grouping=pathname&filters=[{{""property"": ""pathname"",""operator"": ""is"",""value"": ""{url}""}}]");

        using var res = await client.GetAsync(@$"https://api.usefathom.com/v1/aggregations?entity_id=YUGAMIMD&entity=pageview&aggregates=pageviews&date_from={DateTime.UtcNow.StartOfWeek(DayOfWeek.Monday).ToShortDateString()}&date_grouping=day&field_grouping=pathname&filters=[{{""property"": ""pathname"",""operator"": ""is"",""value"": ""/""}}]", HttpCompletionOption.ResponseHeadersRead);

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

        // try
        // {
        //   var results = await client.GetFromJsonAsync<List<Report>>(@$"https://api.usefathom.com/v1/aggregations?entity_id=YUGAMIMD&entity=pageview&aggregates=pageviews&date_from={DateTime.UtcNow.StartOfWeek(DayOfWeek.Monday).ToShortDateString()}&date_grouping=day&field_grouping=pathname&filters=[{{""property"": ""pathname"",""operator"": ""is"",""value"": ""{url}""}}]");

        //   _logger.LogInformation("Fetched {COUNT} reports for {URL}", results?.Count, url);

        //   if(results != null && results.Any()) {
        //     post.Analytics.Clear();
        //     post.Analytics.AddRange(results);
        //   }
        // }
        // catch (HttpRequestException ex) // Non success
        // {
        //     Console.WriteLine("An error occurred.", ex.StatusCode);
        // }
        // catch (NotSupportedException) // When content type is not valid
        // {
        //     Console.WriteLine("The content type is not supported.");
        // }
        // catch (JsonException) // Invalid JSON
        // {
        //     Console.WriteLine("Invalid JSON.");
        // }

        //var results = await client.GetFromJsonAsync<List<Report>>(@$"https://api.usefathom.com/v1/aggregations?entity_id=YUGAMIMD&entity=pageview&aggregates=pageviews&date_from={DateTime.UtcNow.StartOfWeek(DayOfWeek.Monday).ToShortDateString()}&date_grouping=day&field_grouping=pathname&filters=[{{""property"": ""pathname"",""operator"": ""is"",""value"": ""{url}""}}]");

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