// using System.Text.Json.Serialization;
// using Microsoft.AspNetCore.Mvc;
// using Raven.Client.Documents;
// using Raven.Client.Documents.Queries;
// using Strife.Repository.Indexes;
// using Wieldy.Core.Models;

// [ApiController]
// [Route("[controller]")]
// public class WebhookController : ControllerBase
// {
//   private readonly ILogger<WebhookController> logger;
//   private readonly IDocumentStore documentStore;

//   public WebhookController(ILogger<WebhookController> logger, IDocumentStore documentStore)
//   {
//     this.logger = logger;
//     this.documentStore = documentStore;
//   }
//   [HttpGet]
//   public IActionResult Index() => Content("Hello, world");

//   [HttpPost("webmention")]
//   public async Task<IActionResult> WebMention([FromBody] WebMention.WebMention data)
//   {
//     // logger.LogInformation("User {UserId}",
//     //     data.Post.Author.Name);

//     using var session = this.documentStore.OpenAsyncSession();
//     var post = await session.Query<Models_ByFullPath.Result, Models_ByFullPath>().Where(m => m.Path == data.Target.AbsolutePath).OfType<Post>().FirstOrDefaultAsync();
//     post.WebMentions?.Add(data);
//     await session.StoreAsync(post);
//     await session.SaveChangesAsync();
//     return Ok();
//   }
// }
