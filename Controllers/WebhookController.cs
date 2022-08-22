using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Raven.Client.Documents;

namespace WebMention;

[ApiController]
[Route("[controller]")]
public class WebhookController : ControllerBase
{
  private readonly ILogger<WebhookController> logger;
  private readonly IDocumentStore documentStore;

  public WebhookController(ILogger<WebhookController> logger, IDocumentStore documentStore)
  {
    this.logger = logger;
    this.documentStore = documentStore;
  }
  [HttpGet]
  public IActionResult Index() => Content("Hello, world");

  [HttpPost("webmention")]
  public async Task<IActionResult> WebMention([FromBody] WebMentionWebhookModel data)
  {
    // logger.LogInformation("User {UserId} mentioned {PostURL}",
    //     data.Post.Author.Name, data.Post.RepostOf);

    using var session = this.documentStore.OpenAsyncSession();
    await session.StoreAsync(data.Post, string.Empty);
    await session.SaveChangesAsync();
    return Ok();
  }
}

public class WebMentionWebhookModel
{

  public string? Secret { get; set; }

  public Uri? Source { get; set; }

  public Uri? Target { get; set; }

  public Post? Post { get; set; }
}

public class Author
{

  public string? Name { get; set; }

  public string? Photo { get; set; }

  public Uri? Url { get; set; }
}

public class Post
{

  public string? Type { get; set; }

  public Author? Author { get; set; }

  public Uri? Url { get; set; }

  public DateTime Published { get; set; }

  public string? Name { get; set; }
  [JsonPropertyName("repost-of")]
  public Uri? RepostOf { get; set; }
  [JsonPropertyName("wm-property")]
  public string? WmProperty { get; set; }
}
