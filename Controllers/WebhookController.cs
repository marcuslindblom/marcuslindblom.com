using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace WebMention;

[ApiController]
public class WebhookController : ControllerBase
{
  private readonly ILogger<WebhookController> logger;

  public WebhookController(ILogger<WebhookController> logger)
  {
    this.logger = logger;
  }
  [HttpPost("/webmention")]
  public async Task<IActionResult> WebMention([FromBody] WebMentionWebhookModel data)
  {
    logger.LogInformation("User {UserId} mentioned {PostURL}",
        data.Post.Author.Name, data.Post.Url);
    // await _votesCache.AddNewTopggVote(data.User);
    return Ok();
  }
}

public record WebMentionWebhookModel
{
  public string Secret { get; set; }
  public string Source { get; set; }
  public string Target { get; set; }
  public Post Post { get; set; }
}

public record Author
{
  public string Name { get; set; }
  public string Photo { get; set; }
  public string Url { get; set; }
}

public record Post
{
  public string Type { get; set; }
  public Author Author { get; set; }
  public string Url { get; set; }
  public DateTime Published { get; set; }
  public string Name { get; set; }

  [JsonProperty("repost-of")]
  public string RepostOf { get; set; }

  [JsonProperty("wm-property")]
  public string WmProperty { get; set; }
}
