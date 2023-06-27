using System.Net.Http.Headers;
using System.Text.Json.Serialization;
using Raven.Client.Documents;
using Strife.Repository.Indexes;
using Microsoft.AspNetCore.JsonPatch;
using Raven.Client.Documents.Operations;
using Newtonsoft.Json;

public class FathomAnalyticsService : IHostedService, IDisposable
{
  private int executionCount = 0;
  private readonly ILogger<FathomAnalyticsService> _logger;
  private readonly IDocumentStore _documentStore;
  private readonly IConfiguration _configuration;
  private string token => _configuration.GetSection("Strife").GetValue<string>("FathomAPIToken") ?? "";
  private string siteId => _configuration.GetSection("Strife").GetValue<string>("FathomSiteId") ?? "";
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

    if(string.IsNullOrEmpty(token)) {
      _logger.LogError("Fathom: Token not found");
    }

    var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

    try
    {

      using var session = _documentStore.OpenAsyncSession();

      var pages = await session.Query<Strife.Content, Content_ByUrl>().ToListAsync();

      _logger.LogInformation("Got {COUNT}", pages.Count);

      // var dateFrom = DateTime.UtcNow.AddDays(-6);

      foreach (var page in pages)
      {

        var url = await (from result in session.Query<Content_ByUrl.Result, Content_ByUrl>()
                         where result.Id == page.Id
                         select result.Url
                        ).FirstOrDefaultAsync();

        var reports = new List<Report>() {
          new Report { Date = DateTime.UtcNow.AddDays(-6), PathName = url, Views = 0, Visitors = 0 },
          new Report { Date = DateTime.UtcNow.AddDays(-5), PathName = url, Views = 0, Visitors = 0 },
          new Report { Date = DateTime.UtcNow.AddDays(-4), PathName = url, Views = 0, Visitors = 0 },
          new Report { Date = DateTime.UtcNow.AddDays(-3), PathName = url, Views = 0, Visitors = 0 },
          new Report { Date = DateTime.UtcNow.AddDays(-2), PathName = url, Views = 0, Visitors = 0 },
          new Report { Date = DateTime.UtcNow.AddDays(-1), PathName = url, Views = 0, Visitors = 0 },
          new Report { Date = DateTime.UtcNow, PathName = url, Views = 0, Visitors = 0 }
        };

        // _logger.LogInformation("This is the url: {URL}", url);

        using var res = await client.GetAsync(@$"https://api.usefathom.com/v1/aggregations?entity_id={siteId}&entity=pageview&aggregates=uniques,pageviews&date_from={DateTime.UtcNow.AddDays(-6).ToShortDateString()}&date_grouping=day&field_grouping=pathname&filters=[{{""property"": ""pathname"",""operator"": ""is"",""value"": ""{url}""}}, {{ ""property"": ""referrer_hostname"", ""operator"": ""is not"", ""value"": ""https://marcus.wieldy.app""}}]", HttpCompletionOption.ResponseHeadersRead);

        if(res.IsSuccessStatusCode) {

          var entries = await res.Content.ReadFromJsonAsync<List<Report>>();

          _logger.LogInformation("Fetched {COUNT} reports for {URL}", entries?.Count, url);

          if(entries != null && entries.Any()) {

            foreach(var entry in entries) {

              // _logger.LogInformation((entry.Date.ToUniversalTime() == DateTime.UtcNow.AddDays(-6)).ToString());

              var report = reports.FirstOrDefault(x => x.Date.ToShortDateString() == entry.Date.ToShortDateString());

              // _logger.LogInformation("Report for {URL} on {DATE} is {REPORT}", url, entry.Date, report);

              if(report != null) {
                report.Date = entry.Date;
                report.PathName = entry.PathName;
                report.Views = entry.Views;
                report.Visitors = entry.Visitors;
              }

            }

            // var patchesDocument = new JsonPatchDocument();
            // patchesDocument.Add("/analytics", entries);
            // _documentStore.Operations.Send(new JsonPatchOperation(page.Id, patchesDocument));
          }

        } else {
          Console.WriteLine("An error occurred.", res.StatusCode);
        }

        var patchesDocument = new JsonPatchDocument();
        patchesDocument.Add("/analytics", reports);
        _documentStore.Operations.Send(new JsonPatchOperation(page.Id, patchesDocument));

      }
    }
    catch (Exception ex)
    {
      Console.WriteLine(ex.Message);
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
public class Report {
  [property: JsonPropertyName("pageviews")] public int Views { get; set; }
  [property: JsonPropertyName("uniques")] public int Visitors { get; set; }
  [property: JsonPropertyName("date")] public DateTime Date { get; set; }
  [property: JsonPropertyName("pathname")] public string PathName { get; set; }
}