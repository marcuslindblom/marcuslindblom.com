using Microsoft.AspNetCore.Mvc;
using Raven.Client.Documents;
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
        TimeSpan.FromDays(1));

    return Task.CompletedTask;
  }

  private async void DoWork(object? state)
  {
    var count = Interlocked.Increment(ref executionCount);

    _logger.LogInformation(
        "Timed Hosted Service is working. Count: {Count}", count);

    var client = new HttpClient();

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

        var root = await client.GetFromJsonAsync<WebMention.Root>($"https://webmention.io/api/mentions.jf2?target=https://marcuslindblom.com{url}");

        if(root != null && root.Children.Count > 0) {

          _logger.LogInformation("Fetched {COUNT} mentions for {URL}", root.Children.Count, url);

          foreach (var item in root.Children)
          {
            if (!post.Mentions.Any(m => m.WmId == item.WmId))
            {
              Console.WriteLine("Adding mention", post.Id);
              post.Mentions.Add(item);
            }
          }
        }

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
    _logger.LogInformation("Timed Hosted Service is stopping.");

    _timer?.Change(Timeout.Infinite, 0);

    return Task.CompletedTask;
  }

  public void Dispose()
  {
    _timer?.Dispose();
  }
}