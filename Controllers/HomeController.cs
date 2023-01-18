using Microsoft.AspNetCore.Mvc;
using Raven.Client.Documents;
using Raven.Client.Documents.Indexes;
using Raven.Client.Documents.Queries;
using Strife.Binding;
using Strife.Repository.Indexes;

public class HomeController : Controller
{
  private readonly IDocumentStore documentStore;

  public HomeController(IDocumentStore documentStore)
  {
    this.documentStore = documentStore;
  }
  public async Task<IActionResult> Index([FromContentRoute] Home content)
  {
    using var session = documentStore.OpenAsyncSession();

    // var client = new HttpClient();

    // var root = await client.GetFromJsonAsync<WebMention.Root>("https://webmention.io/api/mentions.jf2?domain=marcuslindblom.com&token=ufeSgcy4byQ2weFs8MWs1Q");

    // foreach (var item in root?.Children)
    // {

    //   if (string.IsNullOrEmpty(item.WmTarget.AbsolutePath))
    //   {
    //     continue;
    //   }

    //   Console.WriteLine(item.WmTarget.AbsolutePath);

    //   var post = await session.Query<Content_ByUrl.Result, Content_ByUrl>().Where(m => m.Url == item.WmTarget.AbsolutePath).OfType<Post>().FirstOrDefaultAsync();

    //   if (post == null)
    //   {
    //     continue;
    //   }

    //   if (post != null && !post.Mentions.Any(m => m.WmId == item.WmId))
    //   {
    //     Console.WriteLine("Adding mention", post.Id);
    //     post.Mentions.Add(item);
    //   }

    // }

    // await session.SaveChangesAsync();

    var results = await (from result in session.Query<Content_ByUrl.Result, Content_ByUrl>()
                         where result.Collection == "Posts"
                         let post = RavenQuery.Load<Post>((string)RavenQuery.Metadata(result)["@id"])
                         select new PostViewModel
                         {
                           Title = post.DisplayName,
                           Summary = post.Summary,
                           Url = result.Url
                         }
                        ).ToListAsync();


    return View(new HomeViewModel(content.Heading, content.Introduction, results));
  }
}

public class PostViewModel
{
  public string? Title { get; set; }
  public string? Summary { get; set; }
  public string? Url { get; set; }

  public List<WebMention.Post>? Mentions { get; set; } = new List<WebMention.Post>();
  // public Post? Post { get; set; }
}
