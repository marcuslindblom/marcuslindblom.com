using Raven.Client.Documents;
using Raven.Client.Documents.Queries;
using Strife.Repository.Indexes;

public class TimedHostedService : IHostedService, IDisposable
{
  private int executionCount = 0;
  private readonly ILogger<TimedHostedService> _logger;
  private readonly IDocumentStore _documentStore;
  private Timer? _timer = null;

  public TimedHostedService(ILogger<TimedHostedService> logger, IDocumentStore documentStore)
  {
    _logger = logger;
    _documentStore = documentStore;
  }

  public Task StartAsync(CancellationToken stoppingToken)
  {
    _logger.LogInformation("Timed Hosted Service running.");

    _timer = new Timer(DoWork, null, TimeSpan.Zero,
        TimeSpan.FromMinutes(10));

    return Task.CompletedTask;
  }

  private async void DoWork(object? state)
  {
    var count = Interlocked.Increment(ref executionCount);

    _logger.LogInformation(
        "Timed Hosted Service is working. Count: {Count}", count);

    var client = new HttpClient();

    var root = await client.GetFromJsonAsync<WebMention.Root>("https://webmention.io/api/mentions.jf2?domain=marcuslindblom.com&token=ufeSgcy4byQ2weFs8MWs1Q");
    try
    {

      using var session = _documentStore.OpenAsyncSession();

      foreach (var item in root?.Children)
      {
        Console.WriteLine(item.WmTarget.AbsolutePath);
        // var post = await session.Query<Content_ByUrl.Result, Content_ByUrl>().Where(m => m.Url == item.WmTarget.AbsolutePath).OfType<Post>().FirstOrDefaultAsync();
        var post = await (from result in session.Query<Content_ByUrl.Result, Content_ByUrl>()
                          where result.Url == item.WmTarget.AbsolutePath
                          select RavenQuery.Load<Post>(result.Id)
                  ).SingleOrDefaultAsync();

        if (post != null && !post.Mentions.Any(m => m.WmId == item.WmId))
        {
          post.Mentions.Add(item);
        }
      }

      await session.SaveChangesAsync();

      _logger.LogInformation("Saved {COUNT} mentions", root?.Children.Count);
    }
    catch
    {
      Console.WriteLine("Err...");
    }
  }

  public Task StopAsync(CancellationToken stoppingToken)
  {
    _logger.LogInformation("Timed Hosted Service is stopping.");

    _timer?.Change(Timeout.Infinite, 0);

    return Task.CompletedTask;
  }

  public void Dispose()
  {
    _timer?.Dispose();
  }
}